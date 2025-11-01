import React, { useMemo, useState } from "react";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffInspectingTable from "./StaffInspectingTable/StaffInspectingTable";
import useStaffInspectingManagement from "./useStaffInspectingManagement";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import InspectionResultModal from "./InspectionResultModal/InspectionResultModal";
import InspectionInactiveModal from "./InspectionInactiveModal/InpectionInactiveModal";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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

  const [selectedItem, setSelectedItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState("INSPECTING");

  const statusOptions = [
    {
      value: "INSPECTING",
      label: "Đang kiểm định",
      icon: <SyncOutlined style={{ color: "#1890ff", fontSize: 20 }} />,
    },
    {
      value: "INSPECTED_PASS",
      label: "Kiểm định đạt",
      icon: <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />,
    },
    {
      value: "INSPECTED_FAIL",
      label: "Không đạt",
      icon: <CloseCircleOutlined style={{ color: "volcano", fontSize: 20 }} />,
    },
  ];

  const filteredData = useMemo(() => {
    if (!Array.isArray(consignments)) return [];
    return consignments.filter((item) => item.status === statusFilter);
  }, [consignments, statusFilter]);

  const handleViewDetail = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="staff-management-page">
      <h2 className="page-title">Quản lý kiểm định</h2>

      <div className="filter-section">
        <ConsignmentFilterCard
          title="Lọc theo trạng thái"
          options={statusOptions}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
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
