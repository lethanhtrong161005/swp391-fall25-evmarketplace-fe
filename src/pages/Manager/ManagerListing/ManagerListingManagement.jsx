import React from "react";
import { Card, Space } from "antd";
import s from "./styles.module.scss";
import useManagerListing from "./useManagerListing";
import ManagerListingTable from "./ManagerListingTable/ManagerListingTable";
import ManagerListingFilter from "./ListingFilter/ListingFilter";
import ChangeStatusModal from "./ChangeStatusModal/ChangeStatusModal";

export default function ManagerListingManagement() {
  const {
    rows,
    total,
    page,
    pageSize,
    loading,
    status,
    query,
    handleTableChange,
    handleSearch,
    handleStatusFilter,
    // modal + status
    modalOpen,
    selectedListing,
    selectedStatus,
    confirmLoading,
    openStatusModal,
    confirmStatusChange,
    closeModal,
  } = useManagerListing();

  return (
    <div className={s.root}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <ManagerListingFilter
          onSearch={handleSearch}
          onStatusChange={handleStatusFilter}
          status={status}
          query={query}
          loading={loading}
        />

        <Card
          size="small"
          title={`Tất cả bài đăng (${total?.toLocaleString?.("vi-VN") || 0})`}
        >
          <ManagerListingTable
            key={`${status}-${query}-${page}`}
            rows={rows}
            loading={loading}
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={handleTableChange}
            onStatusChange={openStatusModal} // 🔗 thêm callback mở modal
          />
        </Card>
      </Space>

      {/* Modal xác nhận đổi trạng thái */}
      <ChangeStatusModal
        open={modalOpen}
        record={selectedListing}
        newStatus={selectedStatus}
        onCancel={closeModal}
        onConfirm={confirmStatusChange}
        confirmLoading={confirmLoading}
      />
    </div>
  );
}
