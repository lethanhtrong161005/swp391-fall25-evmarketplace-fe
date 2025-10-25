import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffConsManageTable from "./StaffConsManageTable/StaffConsManageTable";
import useStaffConsignmentsManagement from "./useStaffCosignmentsManagement";
import "./StaffConsignmentsManagement.scss";
import { useMemo } from "react";
import { useState } from "react";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";

const StaffConsignmentsManagement = () => {
  const {
    loading,
    consignments,
    pagination,
    // fetchData,
    selectedItem,
    onCloseDetail,
    onViewDetail,
  } = useStaffConsignmentsManagement();

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!Array.isArray(consignments)) return [];
    if (statusFilter === "all") return consignments;
    return consignments.filter((item) => item.status === statusFilter);
  }, [consignments, statusFilter]);

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "REQUEST_REJECTED", label: "Đã từ chối" },
    { value: "FINISHED", label: "Hoàn thành" },
    { value: "EXPIRED", label: "Hết hạn" },
  ];
  return (
    <div className="staff-management-page">
      <h2>Danh sách ký gửi</h2>

      <div className="filter-section">
        <ConsignmentFilterCard
          options={statusOptions}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="list-section">
        <div className="list-header">Danh sách </div>
        <StaffConsManageTable
          items={filteredData}
          loading={loading}
          pagination={pagination}
          onView={onViewDetail}
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />
    </div>
   
  );
};
export default StaffConsignmentsManagement;
