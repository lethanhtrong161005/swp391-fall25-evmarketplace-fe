import React from "react";
import { App, Card, Space } from "antd";
import useStaffListing from "./useStaffListing";
import SearchFilters from "./SearchFilters";
import ListingTable from "./ListingTable";
import EmptyState from "./EmptyState";
import s from "./styles.module.scss";
import AgreementListingCreate from "../StaffAgreementManagement/AgreementListingCreate/AgreementListingCreate";
import CreateOrderModal from "./CreateOrderModal/CreateOrderModal";

export default function StaffListing() {
  const logic = useStaffListing();
  const {
    loading,
    rows,
    total,
    page,
    pageSize,
    filters,
    onTableChange,
    setFilters,
    refresh,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    handleEditListing,
    handleOpenOrderModal,
    isOrderModalOpen,
    setIsOrderModalOpen,
    orderListing,
    handleConfirmCreateOrder,
  } = logic;

  return (
    <div className={s.root}>
      <Space direction="vertical" size={12} className={s.stack}>
        <Card size="small" title="Bộ lọc ký gửi">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SearchFilters
              value={filters}
              onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
              onSubmit={refresh}
            />
          </Space>
        </Card>

        {(!loading && total === 0) ? (
          <EmptyState onRefresh={refresh} />
        ) : (
          <Card
            size="small"
            title={`Danh sách ký gửi (${total?.toLocaleString?.("vi-VN") || 0})`}
          >
            <ListingTable
              rows={rows}
              loading={loading}
              page={page}
              pageSize={pageSize}
              total={total}
              onChange={onTableChange}
              onEdit={handleEditListing}
              onCreateOrder={handleOpenOrderModal}
            />
          </Card>
        )}
      </Space>

      <AgreementListingCreate
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        consignmentData={editingItem}
        mode="agreement-update"
      />

      <CreateOrderModal
        open={isOrderModalOpen}
        onCancel={() => setIsOrderModalOpen(false)}
        onConfirm={handleConfirmCreateOrder}
        listing={orderListing}
      />
    </div>
  );
}
