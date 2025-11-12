import useManagerConsignmentsManagement from "./useManagerConsignmentsManagement";
import ManagerConsignmentManagementTable from "./ManagerConsignmentsManagementTable/ManagerConsignmentManagementTable";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import ConsignmentSearch from "../../../components/ConsignmentSearch/ConsignmentSearch";
import { useState, useMemo } from "react";
import { message } from "antd";
import { searchConsignmentByPhone } from "../../../services/consigmentService";
import "./ManagerConsignmentsManagement.scss";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../utils/constants";

const ManagerConsigmentsManagement = () => {
  const {
    consignmentsManagement,
    loading,
    branchId,
    selectedItem,
    onViewDetail,
    onCloseDetail,
    fetchManagerConsignments,
    // setConsignmentsManagement,
  } = useManagerConsignmentsManagement();

  const [filteredData, setFilteredData] = useState(
    consignmentsManagement || []
  );

  useMemo(() => {
    if (Array.isArray(consignmentsManagement)) {
      setFilteredData(consignmentsManagement);
    }
  }, [consignmentsManagement]);

  const handleSearch = async (phone) => {
    if (!phone?.trim()) {
      message.warning("Vui lòng nhập số điện thoại để tìm kiếm");
      return;
    }

    try {
      const res = await searchConsignmentByPhone(phone.trim());
      const data = Array.isArray(res) ? res : [];
      const filtered = data.filter(
        (item) => item?.status !== "SUBMITTED"
      );
      const mapped = filtered.map((item) => ({
        ...item,
        category: CATEGORIES[item.category] || item.category,
        itemType: ITEM_TYPE[item.itemType] || item.itemType,
        statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
        statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
      }));

      if (mapped.length === 0) {
        message.info("Không tìm thấy yêu cầu ký gửi nào với số điện thoại này");
      }

      setFilteredData(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm kiếm yêu cầu ký gửi.");
    }
  };

  const handleReset = async () => {
    if (fetchManagerConsignments) {
      await fetchManagerConsignments();
    }
  };

  return (
    <div className="manager-management-page">
      <h2>Danh sách ký gửi</h2>

      <div className="search-section">
        <ConsignmentSearch onSearch={handleSearch} onReset={handleReset} />
      </div>

      <div className="list-section">
        <div className="list-header">Danh sách</div>
        <ManagerConsignmentManagementTable
          items={filteredData}
          loading={loading}
          branchId={branchId}
          onView={onViewDetail}
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />
    </div>
  );
};

export default ManagerConsigmentsManagement;
