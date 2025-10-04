import React from "react";
import { Card, Space } from "antd";
import s from "./style.module.scss";
import { useManageListing } from "./logic";
import FilterBar from "./FilterBar";
import SummaryCards from "./SummaryCards";
import ListingTable from "./ListingTable";

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
          total={data.total}
          page={query.page}
          pageSize={query.size}
          onPageChange={setPage}
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
