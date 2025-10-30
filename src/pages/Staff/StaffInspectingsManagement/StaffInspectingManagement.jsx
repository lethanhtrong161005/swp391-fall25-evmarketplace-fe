import React, { useMemo, useState } from "react";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffInspectingTable from "./StaffInspectingTable/StaffInspectingTable";
import useStaffInspectingManagement from "./useStaffInspectingManagement";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import InspectionResultModal from "./InspectionResultModal/InspectionResultModal";
import InspectionInactiveModal from "./InspectionInactiveModal/InpectionInactiveModal";
import "./StaffInspectingManagement.scss"


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

  const [selectedItem, setSelectedItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!Array.isArray(consignments)) return [];
    if (statusFilter === "all") return consignments;
    return consignments.filter((item) => item.status === statusFilter);
  }, [consignments, statusFilter]);

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "INSPECTING", label: "Đang kiểm định" },
    { value: "INSPECTED_PASS", label: "Đạt kiểm định" },
    { value: "INSPECTED_FAIL", label: "Không đạt kiểm định" },
  ];

  const handleViewDetail = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="staff-management-page">
      <h2>Quản lý kiểm định</h2>

      <div className="filter-section">
        <ConsignmentFilterCard
          title="Lọc theo trạng thái"
          options={statusOptions}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="list-section">
        <div className="list-header">Danh sách ký gửi kiểm định</div>
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
        description={`Bạn có chắc chắn muốn hủy kết quả kiểm định không?`}
      />
    </div>
  );
};

export default StaffInspectingManagement;
