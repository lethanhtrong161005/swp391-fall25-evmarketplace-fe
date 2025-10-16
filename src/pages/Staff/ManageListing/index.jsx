import React from "react";
import { Card, Space, Button, Modal } from "antd";
import s from "./ManageListing.module.scss";
import { useManageListing } from "./useManageListing";
import FilterBar from "./FilterBar/FilterBar";
import SummaryCards from "./SummaryCards/SummaryCards";
import ListingTable from "./ListingTable/ListingTable";
import ManageListingDetail from "@pages/Staff/ManageListingDetail";

/**
 * Staff Listing Management Page
 * Features: Filter, approve/reject listings, view stats, manage listing lifecycle
 */
export default function ManageListingPage() {
  const {
    loading,
    data,
    query,
    handleSearch,
    handleReset,
    refresh,
    onApprove,
    onReject,
    onEdit,
    onActivate,
    onDeactivate,
    onDelete,
    onRestore,
    onRenew,
    setPage,
    contextHolder,
  } = useManageListing();

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleOpenDetail = (row) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedRow(null);
  };

  return (
    <Space direction="vertical" size={16} className={s.wrap}>
      {contextHolder}
      <Card>
        <FilterBar
          loading={loading}
          onSearch={handleSearch}
          onReset={handleReset}
          onRefresh={refresh}
        />
      </Card>

      <SummaryCards
        stats={data.stats}
        loading={loading}
        onQuickFilter={(status) => handleSearch({ status })}
      />

      <Card>
        <ListingTable
          loading={loading}
          dataSource={data.items}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
          onRestore={onRestore}
          onRenew={onRenew}
          onOpenDetail={handleOpenDetail}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 12,
          }}
        >
          <Button
            onClick={() => setPage(Math.max(0, (query.page || 0) - 1))}
            disabled={loading || (query.page || 0) <= 0}
          >
            Trang trước
          </Button>
          <Button
            type="primary"
            onClick={() => setPage((query.page || 0) + 1)}
            disabled={loading || !data?.hasNext}
          >
            Trang sau
          </Button>
        </div>
      </Card>

      <Modal
        title={null}
        open={detailOpen}
        onCancel={handleCloseDetail}
        width={1100}
        style={{ top: 24 }}
        footer={null}
        destroyOnClose
      >
        {detailOpen && (
          <ManageListingDetail
            modalId={selectedRow?.id}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </Space>
  );
}
