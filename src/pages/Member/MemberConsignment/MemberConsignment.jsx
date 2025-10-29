import React, { useState } from "react";
import { Card, Skeleton } from "antd";
import ProfileBar from "../ManagerListing/ProfileBar";
import SearchActions from "../ManagerListing/SearchActions";
import EmptyState from "../ManagerListing/EmptyState";
import StatusTabs from "../ManagerListing/StatusTabs";
import ConsignmentTable from "./ConsignmentTable/ConsingmentTable";
import ConsignmentDetailModal from "./ConsigmentDetailModal/ConsignmentDetailModal";
import useManagerConsignment from "./useMemberConsignment.js";
import styles from "../ManagerListing/styles.module.scss";
import DynamicBreadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import CancelConsignmentModal from "./ConsignmentCancelModal/ConsignmentCancelModal.jsx";
import InspectionScheduleModal from "./InspectionScheduleModal/InspectionScheduleModal.jsx";

const tabs = [
  { key: "SUBMITTED", label: "Đã gửi", statuses: ["SUBMITTED"] },
  { key: "SCHEDULING", label: "Đã duyệt", statuses: ["SCHEDULING"] },
  { key: "SCHEDULED", label: "Đã lên lịch", statuses: ["SCHEDULED"] },
  { key: "RESCHEDULED", label: "Hẹn lại", statuses: ["RESCHEDULED"] },
  {
    key: "INSPECTION_GROUP",
    label: "Kiểm định",
    statuses: ["INSPECTING", "INSPECTED_PASS", "INSPECTED_FAIL"],
  },
  { key: "REQUEST_REJECTED", label: "Bị từ chối", statuses: ["REQUEST_REJECTED"] },
  { key: "FINISHED", label: "Hoàn thành", statuses: ["FINISHED"] },
  { key: "EXPIRED", label: "Hết hạn", statuses: ["EXPIRED"] },
  { key: "CANCELLED", label: "Đã hủy", statuses: ["CANCELLED"] },
];

const MemberConsignment = () => {
  const {
    loading,
    consignments,
    pagination,
    onChangeTable,
    selectedItem,
    onViewDetail,
    onCloseDetail,
    activeTab,
    setActiveTab,
    counts,
    // fetchData,
    goCreateConsignment,
    setCancelId,
    handleCancel,
    handleViewSchedule,
    scheduleData,
    openScheduleModal,
    loadingSchedule,
    closeScheduleModal,
    handleOpenSchedule,
    handleCancelSchedule,
  } = useManagerConsignment(tabs);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleOpenCancelModal = (id) => {
    setCancelId(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (reason) => {
    await handleCancel(reason);
    setShowCancelModal(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <DynamicBreadcrumb />
      </div>

      <Card className={styles.card} bordered={false}>
        <ProfileBar />
        <SearchActions
          query={""}
          onChangeQuery={() => {}}
          onCreate={goCreateConsignment}
          queryHolder="Tìm sản phẩm ký gửi của bạn..."
          queryButtonText="Tạo ký gửi"
        />

        <StatusTabs
          tabs={tabs}
          counts={counts}
          activeKey={activeTab}
          onChange={setActiveTab}
        />

        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : consignments.length ? (
          <ConsignmentTable
            items={consignments}
            pagination={pagination}
            onChange={onChangeTable}
            loading={loading}
            onView={onViewDetail}
            setCancelId={handleOpenCancelModal}
            onViewSchedule={handleViewSchedule}
            onOpenSchedule={handleOpenSchedule}
          />
        ) : (
          <EmptyState
            onCreate={goCreateConsignment}
            queryText="ký gửi"
            queryButtonText="Tạo ký gửi"
          />
        )}
      </Card>

      <CancelConsignmentModal
        open={showCancelModal}
        onCancel={() => {
          setShowCancelModal(false);
          setCancelId(null);
        }}
        onConfirm={handleConfirmCancel}
        loading={loading}
      />

      <InspectionScheduleModal
        open={openScheduleModal}
        onClose={closeScheduleModal}
        data={scheduleData}
        loading={loadingSchedule}
        onCancelSchedule={handleCancelSchedule} 
      />

      <ConsignmentDetailModal item={selectedItem} onClose={onCloseDetail} />
    </div>
  );
};

export default MemberConsignment;
