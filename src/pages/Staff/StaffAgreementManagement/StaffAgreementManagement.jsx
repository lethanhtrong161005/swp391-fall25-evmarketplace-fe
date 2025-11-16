import React, { useMemo, useState } from "react";
import useStaffAgreementManagement from "./useStaffAgreementManagement";
import StaffAgreementTable from "./StaffAgreementTable/StaffAgreementTable";
import AddAgreementModal from "./AddAgreementModal/AddAgreementModal";
import AgreementDetailModal from "./AgreementDetailModal/AgreementDetailModal";
import ExtendAgreementModal from "./AgreementExtendModal/AgreementExtendModal";
import ConfirmCancelModal from "./AgreementDetailModal/ConfirmCancelModal";
import AgreementListingCreate from "./AgreementListingCreate/AgreementListingCreate";
import ConsignmentSearch from "../../../components/ConsignmentSearch/ConsignmentSearch";
import { message } from "antd";
import {
  CONSIGNMENT_STATUS_LABELS,
  CONSIGNMENT_STATUS_COLOR,
  CATEGORIES,
  ITEM_TYPE,
} from "../../../utils/constants";
import {
  addAgreement,
  searchStaffInspectionByPhone,
} from "@/services/staff/staffConsignmentService";
import "./StaffAgreementManagement.scss";

const includedStatuses = ["INSPECTED_PASS", "INSPECTED_FAIL", "SIGNED", "EXPIRED"];

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

  const [filteredData, setFilteredData] = useState(inspections || []);

  useMemo(() => {
    if (Array.isArray(inspections)) {
      setFilteredData(inspections);
    }
  }, [inspections]);

  const handleSearch = async (phone) => {
    if (!phone?.trim()) {
      message.warning("Vui lòng nhập số điện thoại để tìm kiếm");
      return;
    }

    try {
      const res = await searchStaffInspectionByPhone(phone.trim());
      const mapped = (res?.data || res || [])
        .map((item) => ({
          ...item,
          category: CATEGORIES[item.category] || item.category,
          itemType: ITEM_TYPE[item.itemType] || item.itemType,
          statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
          statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
        }))
        .filter((item) => includedStatuses.includes(item.status));

      if (mapped.length === 0) {
        message.info("Không tìm thấy dữ liệu kiểm định phù hợp với số điện thoại này");
      }

      setFilteredData(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm kiếm dữ liệu kiểm định.");
    }
  };

  const handleReset = async () => {
    await fetchData();
  };

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

      <div>
        <ConsignmentSearch
          onSearch={handleSearch}
          onReset={handleReset}
          mode="inspection"
        />
      </div>

      <div className="list-section">
        <div className="list-header">Danh sách kiểm định</div>

        <StaffAgreementTable
          items={filteredData}
          loading={loading}
          pagination={{ pageSize: 10 }}
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

      <AgreementListingCreate
        open={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        consignmentData={selectedConsignmentForPost}
        mode="agreement"
        onSuccess={() => fetchData()}
      />
    </div>
  );
};

export default StaffAgreementManagement;
