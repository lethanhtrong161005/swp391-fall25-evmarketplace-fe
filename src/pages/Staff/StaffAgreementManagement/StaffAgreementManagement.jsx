import React, { useMemo, useState } from "react";
import useStaffAgreementManagement from "./useStaffAgreementManagement";
import StaffAgreementTable from "./StaffAgreementTable/StaffAgreementTable";
import AddAgreementModal from "./AddAgreementModal/AddAgreementModal";
import AgreementDetailModal from "./AgreementDetailModal/AgreementDetailModal";
import ExtendAgreementModal from "./AgreementExtendModal/AgreementExtendModal";
import ConfirmCancelModal from "./AgreementDetailModal/ConfirmCancelModal";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import { message } from "antd";
import { addAgreement } from "@/services/staff/staffConsignmentService";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./StaffAgreementManagement.scss";
import AgreementListingModal from "./AgreementListingCreate/AgreementListingCreate";

const StaffAgreementManagement = () => {
  const {
    loading,
    inspections,
    selectedInspection,
    isModalVisible,
    isEditingDraft,
    openAddAgreementModal,
    openEditDraftModal,
    closeAddAgreementModal,
    fetchData,
    isDetailOpen,
    agreementDetail,
    openAgreementDetail,
    closeAgreementDetail,
    handleCancelAgreement,
    confirmCancelAgreement,
    isConfirmOpen,
    setIsConfirmOpen,
    isExtendOpen,
    setIsExtendOpen,
    extendDuration,
    setExtendDuration,
    handleOpenExtendModal,
    handleConfirmExtend,
    selectedConsignmentForPost,
    isPostModalOpen,
    setIsPostModalOpen,
    handleCreateOrder,
  } = useStaffAgreementManagement();

  const [statusFilter, setStatusFilter] = useState("INSPECTED_PASS");

  const filterOptions = [
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
    {
      value: "SIGNED",
      label: "Đã ký hợp đồng",
      icon: <FileDoneOutlined style={{ color: "blue", fontSize: 20 }} />,
    },
    {
      value: "EXPIRED",
      label: "Hết hạn",
      icon: <ClockCircleOutlined style={{ color: "gray", fontSize: 20 }} />,
    },
  ];

  const filteredData = useMemo(() => {
    if (!Array.isArray(inspections)) return [];
    return inspections.filter((item) => item.status === statusFilter);
  }, [inspections, statusFilter]);

  const handleAddAgreementSubmit = async (payload, file) => {
    try {
      const res = await addAgreement(payload, file);
      message.success("Tạo hợp đồng ký gửi thành công!");
      closeAddAgreementModal();
      fetchData();
      return res;
    } catch {
      message.error("Không thể tạo hợp đồng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="staff-management-page">
      <h2 className="page-title">Quản lý hợp đồng ký gửi</h2>

      <div className="filter-section">
        <ConsignmentFilterCard
          title="Lọc theo trạng thái"
          options={filterOptions}
          selectedValue={statusFilter}
          onChange={(value) => setStatusFilter(value)}
        />
      </div>

      <div className="list-section">
        <div className="list-header">
          <span>Danh sách kiểm định</span>
        </div>

        <StaffAgreementTable
          items={filteredData}
          loading={loading}
          pagination={{ pageSize: 10 }}
          onChange={() => {}}
          onAddAgreement={openAddAgreementModal}
          onEditDraft={openEditDraftModal}
          onViewAgreement={(record) =>
            openAgreementDetail(record.requestId || record.id)
          }
          onCreateOrder={handleCreateOrder}
          onRenew={(record) => handleOpenExtendModal(record)}
        />
      </div>

      <AddAgreementModal
        visible={isModalVisible}
        onCancel={closeAddAgreementModal}
        onSubmit={handleAddAgreementSubmit}
        loading={loading}
        isEditingDraft={isEditingDraft}
        requestId={selectedInspection?.requestId || selectedInspection?.id}
      />

      <AgreementDetailModal
        open={isDetailOpen}
        onClose={closeAgreementDetail}
        agreement={agreementDetail}
        loading={loading}
        onCancelAgreement={handleCancelAgreement}
      />

      <ConfirmCancelModal
        open={isConfirmOpen}
        title="Hủy hợp đồng ký gửi"
        content="Bạn có chắc chắn muốn hủy hợp đồng này?"
        loading={loading}
        onConfirm={confirmCancelAgreement}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <ExtendAgreementModal
        open={isExtendOpen}
        onCancel={() => setIsExtendOpen(false)}
        onConfirm={handleConfirmExtend}
        loading={loading}
        duration={extendDuration}
        setDuration={setExtendDuration}
      />

      <AgreementListingModal
        open={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
};

export default StaffAgreementManagement;
