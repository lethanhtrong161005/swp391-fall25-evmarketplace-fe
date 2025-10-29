import React, { useEffect, useState, useMemo } from "react";
import useStaffAgreementManagement from "./useStaffAgreementManagement";
import StaffAgreementTable from "./StaffAgreementTable/StaffAgreementTable";
import AddAgreementModal from "./AddAgreementModal/AddAgreementModal";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import { message } from "antd";
import "./StaffAgreementManagement.scss";

const StaffAgreementManagement = () => {
  const {
    inspections,
    loading,
    fetchInspections,
    isModalVisible,
    openAddAgreementModal,
    closeAddAgreementModal,
    handleAddAgreement,
  } = useStaffAgreementManagement();

  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  // ✅ Fetch inspections on mount
  useEffect(() => {
    // Hook đã tự lọc INSPECTED_PASS, INSPECTED_FAIL, SIGNED trong đó rồi
    fetchInspections();
  }, [fetchInspections]);

  // ✅ Lọc lại theo filter card (trên UI)
  const filteredData = useMemo(() => {
    if (!Array.isArray(inspections)) return [];
    if (statusFilter === "all") return inspections;
    return inspections.filter(
      (item) => item.consignment?.status === statusFilter
    );
  }, [inspections, statusFilter]);

  const handleRowClick = (record) => {
    const name = record?.consignment?.accountName || "Không rõ";
    message.info(`Kiểm định của ${name} (#${record.id})`);
  };

  const handleEditDraft = () => {
    setIsEditingDraft(true);
    openAddAgreementModal();
  };

  return (
    <div className="staff-management-page">
      <h2 className="page-title">Quản lý hợp đồng ký gửi</h2>

      {/* Bộ lọc */}
      <div className="filter-section">
        <div className="filter-title">Lọc theo trạng thái ký gửi</div>
        <ConsignmentFilterCard
          options={[
            { value: "all", label: "Tất cả" },
            { value: "INSPECTED_PASS", label: "Đạt kiểm định" },
            { value: "INSPECTED_FAIL", label: "Không đạt kiểm định" },
            { value: "SIGNED", label: "Đã ký hợp đồng" },
          ]}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* Danh sách kiểm định */}
      <div className="list-section">
        <div className="list-header">
          <span>Danh sách kiểm định hợp lệ</span>
        </div>

        <StaffAgreementTable
          items={filteredData}
          loading={loading}
          onRowClick={handleRowClick}
          onAddAgreement={openAddAgreementModal}
          onEditDraft={handleEditDraft}
        />
      </div>

      {/* Modal thêm hợp đồng */}
      <AddAgreementModal
        visible={isModalVisible}
        onCancel={() => {
          closeAddAgreementModal();
          setIsEditingDraft(false);
        }}
        onSubmit={handleAddAgreement}
        loading={loading}
        isEditingDraft={isEditingDraft}
      />
    </div>
  );
};

export default StaffAgreementManagement;
