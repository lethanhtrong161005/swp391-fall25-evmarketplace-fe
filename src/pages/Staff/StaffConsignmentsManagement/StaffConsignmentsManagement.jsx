import ConsignmentDetailModal from "../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";
import StaffConsManageTable from "./StaffConsManageTable/StaffConsManageTable";
import useStaffConsignmentsManagement from "./useStaffCosignmentsManagement";
import "./StaffConsignmentsManagement.scss";
import { useMemo, useState } from "react";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import {
  ClockCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const StaffConsignmentsManagement = () => {
  const {
    loading,
    consignments,
    pagination,
    selectedItem,
    onCloseDetail,
    onViewDetail,
  } = useStaffConsignmentsManagement();

  const [statusFilter, setStatusFilter] = useState("SCHEDULING");

  const statusOptions = [
    {
      value: "SCHEDULING_GROUP",
      label: "Lên lịch",
      icon: <CalendarOutlined style={{ color: "#1677ff", fontSize: 20 }} />,
    },
    {
      value: "REQUEST_REJECTED",
      label: "Đã từ chối",
      icon: <StopOutlined style={{ color: "volcano", fontSize: 20 }} />,
    },
    {
      value: "FINISHED",
      label: "Hoàn thành",
      icon: <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />,
    },
    {
      value: "EXPIRED",
      label: "Hết hạn",
      icon: <ClockCircleOutlined style={{ color: "gray", fontSize: 20 }} />,
    },
  ];

  const filteredData = useMemo(() => {
    if (!Array.isArray(consignments)) return [];
    if (statusFilter === "SCHEDULING_GROUP") {
      return consignments.filter(
        (item) => item.status === "SCHEDULING" || item.status === "RESCHEDULED"
      );
    }
    return consignments.filter((item) => item.status === statusFilter);
  }, [consignments, statusFilter]);

  return (
    <div className="staff-management-page">
      <h2 className="page-title">Danh sách ký gửi</h2>

      <div className="filter-section">
        <ConsignmentFilterCard
          title="Lọc theo trạng thái"
          options={statusOptions}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="list-section">
        <div className="list-header">Danh sách ký gửi</div>
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
