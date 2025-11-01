import React, { useEffect, useState } from "react";
import useManagerAgreementsManagement from "./useManagerAgreementsManagement";
import "./ManagerAgreementsManagement.scss";
import ManagerAgreementsTable from "./ManagerAgreementsTable/ManagerAgreementsTable";
import AgreementDetailModal from "../../Staff/StaffAgreementManagement/AgreementDetailModal/AgreementDetailModal";

const ManagerAgreementsManagement = () => {
  const { loading, agreementsManagement, fetchManagerAgreements } =
    useManagerAgreementsManagement();

  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchManagerAgreements();
  }, [fetchManagerAgreements]);

  const handleViewAgreement = (record) => {
    setSelectedAgreement(record);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedAgreement(null);
  };

  return (
    <div className="manager-management-page">
      <h2 className="page-title">Danh sách hợp đồng ký gửi</h2>

      <div className="list-section">
        <div className="list-header">
          <span>Danh sách hợp đồng</span>
        </div>

        <ManagerAgreementsTable
          items={agreementsManagement}
          loading={loading}
          pagination={{ pageSize: 10 }}
          onChange={() => {}}
          onViewAgreement={handleViewAgreement}
        />
      </div>

      <AgreementDetailModal
        open={isDetailOpen}
        onClose={handleCloseDetail}
        agreement={selectedAgreement}
        loading={loading}
        mode="manager"
      />
    </div>
  );
};

export default ManagerAgreementsManagement;
