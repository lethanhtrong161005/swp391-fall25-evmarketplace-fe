import React from "react";
import { Card, Space } from "antd";
import s from "./ManageListing.module.scss";
import { useManageListing } from "./useManageListing";
import FilterBar from "./FilterBar/FilterBar";
import SummaryCards from "./SummaryCards/SummaryCards";
import ListingTable from "./ListingTable/ListingTable";

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
          page={query.page}
          pageSize={query.limit}
          total={data?.pagination?.totalRecords || 0}
          onPageChange={(page) => setPage(page - 1)} // Convert 1-based to 0-based for API
          onApprove={onApprove}
          onReject={onReject}
          onEdit={onEdit}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
          onRestore={onRestore}
          onRenew={onRenew}
        />
      </Card>
    </Space>
  );
}
