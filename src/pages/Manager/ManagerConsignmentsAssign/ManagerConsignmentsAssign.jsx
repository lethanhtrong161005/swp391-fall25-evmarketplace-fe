import useManagerConsignmentsAssign from "./useManagerConsignmentsAssign";
import ManagerConsignmentTable from "./ManagerConsignmentsAssignTable/ManagerConsignmentAssignsTable";
import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import { useState } from "react";
import { useMemo } from "react";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";

import "./ManagerConsignmentsAssign.scss"

const ManagerConsigmentsAssign = () => {
  const {
    consignmentsAssign,
    loading,
    branchId,
    fetchData,
    onViewDetail,
    selectedItem,
    onCloseDetail,
  } = useManagerConsignmentsAssign();

  const [staffFilter, setStaffFilter] = useState("noStaff");

  const filteredData = useMemo(() => {
    if (!Array.isArray(consignmentsAssign)) return [];
    if (staffFilter === "noStaff")
      return consignmentsAssign.filter((item) => !item.staffId);
    if (staffFilter === "hasStaff")
      return consignmentsAssign.filter((item) => !!item.staffId);
    return consignmentsAssign;
  }, [consignmentsAssign, staffFilter]);

  const filterOptions = [
    { value: "noStaff", label: "Chưa phân công" },
    { value: "hasStaff", label: "Đã phân công" },
  ];

  return (
    <div className="manager-assign-page">
      <h2>Phân công ký gửi</h2>

      <div className="filter-section">
        <ConsignmentFilterCard
          options={filterOptions}
          selectedValue={staffFilter}
          onChange={setStaffFilter}
        />
      </div>
    
      <div className="list-section">
        <div className="list-header">Danh sách</div>
        <ManagerConsignmentTable
          items={filteredData}
          loading={loading}
          branchId={branchId}
          onReload={fetchData}
          onView={onViewDetail}
        />
      </div>

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />
    </div>
  );
};

export default ManagerConsigmentsAssign;
