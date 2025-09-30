// src/pages/Admin/ManageListing/index.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Card, Space, message } from "antd";
import FilterBar from "./_components/FilterBar";
import SummaryCards from "./_components/SummaryCards";
import ListingTable from "./_components/ListingTable";
import {
  fakeList,
  fakeApprove,
  fakeReject,
  fakeArchive,
} from "@/data/admin/manageListing.fake";
// Khi nối BE: import { listAdminListings, approveListing, rejectListing, archiveListing } from "@services/admin/listing.admin.service";

const PAGE_SIZE = 10;

export default function ManageListingPage() {
  const [msg, ctx] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ page: 1, size: PAGE_SIZE });
  const [data, setData] = useState({ items: [], total: 0, stats: {} });

  const handleSearch = (values) =>
    setQuery((q) => ({ ...q, page: 1, ...values }));
  const handleReset = () => setQuery({ page: 1, size: PAGE_SIZE });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // TODO (BE): thay fakeList bằng listAdminListings(query)
      const res = await fakeList(query);
      setData(res);
    } catch (e) {
      console.error(e);
      msg.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [msg, query]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onApprove = async (row) => {
    await fakeApprove(row.id); // TODO: await approveListing(row.id)
    msg.success("Đã duyệt");
    refresh();
  };
  const onReject = async (row) => {
    await fakeReject(row.id); // TODO: await rejectListing(row.id)
    msg.success("Đã từ chối");
    refresh();
  };
  const onArchive = async (row) => {
    await fakeArchive(row.id); // TODO: await archiveListing(row.id)
    msg.success("Đã lưu trữ");
    refresh();
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {ctx}
      <Card>
        <FilterBar
          loading={loading}
          onSearch={handleSearch}
          onReset={handleReset}
          onRefresh={refresh}
        />
      </Card>

      <SummaryCards stats={data.stats} loading={loading} />

      <Card>
        <ListingTable
          loading={loading}
          dataSource={data.items}
          total={data.total}
          page={query.page}
          pageSize={query.size}
          onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
          onApprove={onApprove}
          onReject={onReject}
          onArchive={onArchive}
          // (Detail & History Drawer xử lý trong ListingTable)
        />
      </Card>
    </Space>
  );
}
