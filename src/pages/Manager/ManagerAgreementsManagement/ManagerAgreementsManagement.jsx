import React, { useEffect, useState } from "react";
import { Input, Button, Space, message } from "antd";
import useManagerAgreementsManagement from "./useManagerAgreementsManagement";
import "./ManagerAgreementsManagement.scss";
import ManagerAgreementsTable from "./ManagerAgreementsTable/ManagerAgreementsTable";
import AgreementDetailModal from "../../Staff/StaffAgreementManagement/AgreementDetailModal/AgreementDetailModal";
import UploadPayoutModal from "./ManagerSettlement/ManagerSettlementUpload";
import SettlementDetailModal from "./ManagerSettlement/SettlementDetailModal";
import { Card } from "antd";

const ManagerAgreementsManagement = () => {
  const {
    loading,
    agreementsManagement,
    fetchManagerAgreements,
    searchManagerAgreements,
    getSettlementByAgreementId,
    uploadPayoutFile,
  } = useManagerAgreementsManagement();

  const [phone, setPhone] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedSettlementId, setSelectedSettlementId] = useState(null);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  useEffect(() => {
    fetchManagerAgreements();
  }, [fetchManagerAgreements]);

  const handleSearch = async () => {
    if (!phone.trim()) {
      message.warning("Vui lòng nhập số điện thoại!");
      return;
    }
    await searchManagerAgreements(phone);
  };

  const handleReset = async () => {
    setPhone("");
    await fetchManagerAgreements();
  };

  const handleViewAgreement = (record) => {
    setSelectedAgreement(record);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAgreement(null);
  };

  const handleOpenPayout = async (record) => {
    try {
      const settlement = await getSettlementByAgreementId(record.id);
      if (!settlement?.id) {
        message.warning("Không tìm thấy bản sao kê để thanh toán.");
        return;
      }
      setSelectedAgreement(record);
      setSelectedSettlementId(settlement.id);
      setIsPayoutModalOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải thông tin sao kê.");
    }
  };

  const handleSubmitPayout = async (file) => {
    if (!selectedSettlementId) {
      message.warning("Không xác định được settlementId.");
      return;
    }
    await uploadPayoutFile(selectedSettlementId, file);
    setIsPayoutModalOpen(false);
  };

  const handleViewSettlement = async (record) => {
    try {
      const settlement = await getSettlementByAgreementId(record.id);
      if (!settlement) {
        message.warning("Không tìm thấy dữ liệu sao kê.");
        return;
      }
      setSelectedSettlement(settlement);
      setIsSettlementOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải chi tiết sao kê.");
    }
  };

  return (
    <div className="manager-management-page">
      <h2 className="page-title">Danh sách hợp đồng ký gửi</h2>

      <Card size="small" title="Bộ lọc hợp đồng">
        <Space>
          <Input
            placeholder="Nhập số điện thoại khách hàng..."
            allowClear
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" loading={loading} onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Card>

      <div className="list-section">
        <ManagerAgreementsTable
          items={agreementsManagement}
          loading={loading}
          pagination={{ pageSize: 10 }}
          onViewAgreement={handleViewAgreement}
          onViewSettlement={handleViewSettlement}
          onSetPayout={handleOpenPayout}
        />
      </div>

      <AgreementDetailModal
        open={isDetailOpen}
        onClose={handleCloseDetail}
        agreement={selectedAgreement}
        loading={loading}
        mode="manager"
      />

      <UploadPayoutModal
        open={isPayoutModalOpen}
        onCancel={() => setIsPayoutModalOpen(false)}
        onSubmit={handleSubmitPayout}
        settlement={selectedSettlement}
      />

      <SettlementDetailModal
        open={isSettlementOpen}
        onClose={() => setIsSettlementOpen(false)}
        settlement={selectedSettlement}
      />
    </div>
  );
};

export default ManagerAgreementsManagement;
