import useManagerConsignmentsManagement from "./useManagerConsignmentsManagement";
import ManagerConsignmentManagementTable from "./ManagerConsignmentsManagementTable/ManagerConsignmentManagementTable";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import { useState, useMemo } from "react";
import "./ManagerConsignmentsManagement.scss";

const ManagerConsigmentsManagement = () => {
  const {
    consignmentsManagement,
    loading,
    branchId,
    selectedItem,
    onViewDetail,
    onCloseDetail,
  } = useManagerConsignmentsManagement();

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!Array.isArray(consignmentsManagement)) return [];
    if (statusFilter === "all") return consignmentsManagement;
    return consignmentsManagement.filter(
      (item) => item.status === statusFilter
    );
  }, [consignmentsManagement, statusFilter]);

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "REQUEST_REJECTED", label: "Bị từ chối" },
    { value: "FINISHED", label: "Hoàn thành" },
    { value: "EXPIRED", label: "Hết hạn" },
  ];

  return (
    <div className="manager-management-page">
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
        <ManagerConsignmentManagementTable
          items={filteredData}
          loading={loading}
          branchId={branchId}
          onView={onViewDetail}
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />
    </div>
  );
};

export default ManagerConsigmentsManagement;
