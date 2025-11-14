import React, { useMemo, useState } from "react";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffConsManageTable from "./StaffConsManageTable/StaffConsManageTable";
import useStaffConsignmentsManagement from "./useStaffCosignmentsManagement";
import ConsignmentSearch from "../../../components/ConsignmentSearch/ConsignmentSearch"; // ✅ thay cho FilterCard
import { message } from "antd";
import {
  CONSIGNMENT_STATUS_LABELS,
  CONSIGNMENT_STATUS_COLOR,
  CATEGORIES,
  ITEM_TYPE,
} from "../../../utils/constants";
import "./StaffConsignmentsManagement.scss";
import { searchConsignmentByPhone } from "../../../services/consigmentService";

const excludedStatuses = [
  "SUBMITTED",
  "INSPECTED_PASS",
  "INSPECTED_FAIL",
  "SIGNED",
  "EXPIRED",
];
const StaffConsignmentsManagement = () => {
  const {
    loading,
    consignments,
    pagination,
    selectedItem,
    onCloseDetail,
    onViewDetail,
    fetchStaffConsignments, // ✅ nếu có trong hook, dùng cho reset
  } = useStaffConsignmentsManagement();

  const [filteredData, setFilteredData] = useState(consignments || []);

  useMemo(() => {
    if (Array.isArray(consignments)) {
      setFilteredData(consignments);
    }
  }, [consignments]);

  // 🔍 Tìm kiếm theo số điện thoại
  const handleSearch = async (phone) => {
    if (!phone?.trim()) {
      message.warning("Vui lòng nhập số điện thoại để tìm kiếm");
      return;
    }

    try {
      const res = await searchConsignmentByPhone(phone.trim());
      const mapped = (res || [])
        .map((item) => ({
          ...item,
          category: CATEGORIES[item.category] || item.category,
          itemType: ITEM_TYPE[item.itemType] || item.itemType,
          statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
          statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
        }))
        .filter((item) => !excludedStatuses.includes(item.status));

      if (mapped.length === 0) {
        message.info("Không tìm thấy yêu cầu ký gửi nào với số điện thoại này");
      }

      setFilteredData(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm kiếm yêu cầu ký gửi.");
    }
  };

  // 🔁 Làm mới (tải lại danh sách mặc định)
  const handleReset = async () => {
    if (fetchStaffConsignments) {
      await fetchStaffConsignments();
    }
  };

  return (
    <div className="staff-management-page">
      <h2 className="page-title">Danh sách ký gửi</h2>

      <div>
        <ConsignmentSearch onSearch={handleSearch} onReset={handleReset} />
      </div>

      <div className="list-section">
        <div className="list-header">Danh sách ký gửi</div>
        <StaffConsManageTable
          items={filteredData}
          loading={loading}
          pagination={pagination}
          onView={onViewDetail}
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />
    </div>
  );
};

export default StaffConsignmentsManagement;
