import React, { useState } from "react";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffConsConsiderTable from "./StaffConsConsiderTable/StaffConsConsiderTable";
import useStaffConsignmentsConsider from "./useStaffConsignmentConsider";
import StaffConsiderModal from "./StaffConsiderModal/RejectModal";
const StaffConsignmentsConsider = () => {
  const {
    loading,
    consignments,
    pagination,
    // fetchData,
    selectedItem,
    onViewDetail,
    onCloseDetail,
    handleAccept,
    handleReject,
  } = useStaffConsignmentsConsider();

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleConfirmReject = async () => {
    await handleReject(rejectId, rejectReason);
    setRejectId(null);
    setRejectReason("");
  };

  return (
    <div className="staff-management-page">
      <h2>Phê duyệt ký gửi</h2>

      <div className="list-section">
        <div className="list-header">Danh sách </div>
        <StaffConsConsiderTable
          items={consignments}
          loading={loading}
          pagination={pagination}
          onView={onViewDetail}
          setRejectId={setRejectId}
          onAccept={handleAccept} 
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />

      <StaffConsiderModal
        rejectId={rejectId}
        rejectReason={rejectReason}
        handleConfirmReject={handleConfirmReject}
        setRejectId={setRejectId}
        setRejectReason={setRejectReason}
      />
    </div>
  );
};

export default StaffConsignmentsConsider;
