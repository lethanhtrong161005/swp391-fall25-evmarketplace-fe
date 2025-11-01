import { useEffect, useState } from "react";
import { message } from "antd";
import { getStaffInspections } from "@/services/staff/staffConsignmentService";
import { getConsignmentById } from "../../../services/consigmentService";
import {
  cancelAgreement,
  getAgreementByRequestId,
  extendAgreement,
} from "../../../services/agreementService";

const useStaffAgreementManagement = () => {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [agreementDetail, setAgreementDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [extendDuration, setExtendDuration] = useState("SIX_MONTHS");
  const [selectedConsignmentForPost, setSelectedConsignmentForPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getStaffInspections();
      const inspectionList = Array.isArray(res.data)
        ? res.data
        : res?.data?.data || [];

      const inspectionsWithConsignment = await Promise.all(
        inspectionList.map(async (item) => {
          try {
            const consignmentRes = await getConsignmentById(item.requestId);
            const consignmentData = consignmentRes?.data || {};
            return { ...item, ...consignmentData };
          } catch {
            return { ...item };
          }
        })
      );

      setInspections(inspectionsWithConsignment);
    } catch {
      message.error("Không thể tải danh sách kiểm định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddAgreementModal = (inspection) => {
    setSelectedInspection(inspection);
    setIsEditingDraft(false);
    setIsModalVisible(true);
  };

  const openEditDraftModal = (inspection) => {
    setSelectedInspection(inspection);
    setIsEditingDraft(true);
    setIsModalVisible(true);
  };

  const closeAddAgreementModal = () => {
    setIsModalVisible(false);
    setSelectedInspection(null);
    setIsEditingDraft(false);
  };

  const openAgreementDetail = async (requestId) => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await getAgreementByRequestId(requestId);
      if (res?.success && res?.data) {
        setAgreementDetail(res.data);
        setIsDetailOpen(true);
      } else {
        message.warning("Không tìm thấy dữ liệu hợp đồng.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeAgreementDetail = () => {
    setIsDetailOpen(false);
    setAgreementDetail(null);
  };

  const handleCancelAgreement = () => {
    if (!agreementDetail?.id) return;
    setIsConfirmOpen(true);
  };

  const confirmCancelAgreement = async () => {
    try {
      setLoading(true);
      const res = await cancelAgreement(agreementDetail.id);
      if (res?.success) {
        message.success("Hủy hợp đồng thành công");
        setIsConfirmOpen(false);
        closeAgreementDetail();
        fetchData();
      } else {
        message.warning(res?.message || "Không thể hủy hợp đồng");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExtendModal = async (record) => {
    try {
      setLoading(true);
      const res = await getAgreementByRequestId(record.requestId || record.id);
      if (res?.success && res?.data) {
        setAgreementDetail(res.data);
        setExtendDuration("SIX_MONTHS");
        setIsExtendOpen(true);
      } else {
        message.warning("Không tìm thấy hợp đồng để gia hạn.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmExtend = async () => {
    if (!agreementDetail?.id) {
      message.error("Không xác định được mã hợp đồng để gia hạn!");
      return;
    }
    try {
      setLoading(true);
      const res = await extendAgreement(agreementDetail.id, extendDuration);
      if (res?.success) {
        message.success("Gia hạn hợp đồng thành công!");
        setIsExtendOpen(false);
        fetchData();
      } else {
        message.warning(res?.message || "Không thể gia hạn hợp đồng");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = (consignment) => {
    setSelectedConsignmentForPost(consignment);
    setIsPostModalOpen(true);
  };

  return {
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
  };
};

export default useStaffAgreementManagement;
