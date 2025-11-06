import React from "react";
import { Card, Space } from "antd";
import s from "./styles.module.scss";
import useManagerListing from "./useManagerListing";
import ManagerListingTable from "./ManagerListingTable/ManagerListingTable";
import ManagerListingFilter from "./ListingFilter/ListingFilter";

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
          />
        </Card>
      </Space>
    </div>
  );
}
