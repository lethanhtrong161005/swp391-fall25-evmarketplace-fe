import React, { useMemo, useState } from "react";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffInspectingTable from "./StaffInspectingTable/StaffInspectingTable";
import useStaffInspectingManagement from "./useStaffInspectingManagement";
import ConsignmentSearch from "../../../components/ConsignmentSearch/ConsignmentSearch"; // ✅ dùng giống StaffConsignmentsManagement
import { message } from "antd";
import {
  CONSIGNMENT_STATUS_LABELS,
  CONSIGNMENT_STATUS_COLOR,
  CATEGORIES,
  ITEM_TYPE,
} from "../../../utils/constants";
import { searchConsignmentByPhone } from "../../../services/consigmentService";
import InspectionResultModal from "./InspectionResultModal/InspectionResultModal";
import InspectionInactiveModal from "./InspectionInactiveModal/InpectionInactiveModal";
import "./StaffInspectingManagement.scss";

const StaffInspectingManagement = () => {
  const {
    consignments,
    loading,
    pagination,
    fetchData,
    openModal,
    selectedRequest,
    confirmLoading,
    inactiveModalOpen,
    inactiveTarget,
    handleOpenModal,
    handleCloseModal,
    handleSubmitInspection,
    handleOpenInactive,
    handleCloseInactive,
    handleConfirmInactive,
  } = useStaffInspectingManagement();

  const [filteredData, setFilteredData] = useState(consignments || []);
  const [selectedItem, setSelectedItem] = useState(null);

  useMemo(() => {
    if (Array.isArray(consignments)) {
      setFilteredData(consignments);
    }
  }, [consignments]);

  const validStatuses = ["INSPECTING", "INSPECTED_PASS", "INSPECTED_FAIL"];

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
        .filter((item) => validStatuses.includes(item.status));

      if (mapped.length === 0) {
        message.info("Không tìm thấy yêu cầu kiểm định nào phù hợp");
      }

      setFilteredData(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm kiếm yêu cầu ký gửi.");
    }
  };

  const handleReset = async () => {
    await fetchData();
  };

  const handleViewDetail = (item) => setSelectedItem(item);
  const handleCloseDetail = () => setSelectedItem(null);

  return (
    <div className="staff-management-page">
      <h2 className="page-title">Quản lý kiểm định</h2>

      <div className="search-section">
        <ConsignmentSearch onSearch={handleSearch} onReset={handleReset} />
      </div>

      <div className="list-section">
        <div className="list-header">
          <span>Danh sách ký gửi kiểm định</span>
        </div>

        <StaffInspectingTable
          items={filteredData}
          loading={loading}
          pagination={pagination}
          onChange={(pagination) =>
            fetchData(pagination.current, pagination.pageSize)
          }
          onView={handleViewDetail}
          onResult={handleOpenModal}
          onCancel={handleOpenInactive}
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={handleCloseDetail} />

      <InspectionResultModal
        open={openModal}
        loading={confirmLoading}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitInspection}
        request={selectedRequest}
      />

      <InspectionInactiveModal
        open={inactiveModalOpen}
        loading={confirmLoading}
        onCancel={handleCloseInactive}
        onConfirm={handleConfirmInactive}
        description="Bạn có chắc chắn muốn hủy kết quả kiểm định không?"
      />
    </div>
  );
};

export default StaffInspectingManagement;
