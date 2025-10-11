import React, { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import {
  fakeList,
  fakeApprove,
  fakeReject,
} from "@/data/admin/manageListing.fake";
// Khi nối BE: import { getStaffListings, approveStaffListing, rejectStaffListing, reactivateStaffListing } from "@services/staff/listing.staff.service";

const PAGE_SIZE = 10;

export function useManageListing() {
  const [msg, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ page: 1, size: PAGE_SIZE });
  const [data, setData] = useState({ items: [], total: 0, stats: {} });

  const handleSearch = (values) =>
    setQuery((q) => ({ ...q, page: 1, ...values }));
  const handleReset = () => setQuery({ page: 1, size: PAGE_SIZE });
  const setPage = (page) => setQuery((q) => ({ ...q, page }));

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
    try {
      await fakeApprove(row.id); // TODO: await approveListing(row.id)
      msg.success("Đã duyệt");
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Duyệt thất bại");
    }
  };

  const onReject = async (row) => {
    try {
      await fakeReject(row.id); // TODO: await rejectListing(row.id)
      msg.success("Đã từ chối");
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Từ chối thất bại");
    }
  };

  const onActivate = async (row) => {
    try {
      // TODO: implement activate functionality
      msg.success(`Đã kích hoạt listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Kích hoạt thất bại");
    }
  };

  const onDeactivate = async (row) => {
    try {
      // TODO: implement deactivate functionality
      msg.success(`Đã ẩn listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Ẩn listing thất bại");
    }
  };

  const onDelete = async (row) => {
    try {
      // TODO: implement delete functionality with confirmation
      msg.success(`Đã xóa listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Xóa thất bại");
    }
  };

  const onRestore = async (row) => {
    try {
      // TODO: implement restore functionality
      msg.success(`Đã khôi phục listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Khôi phục thất bại");
    }
  };

  const onRenew = async (row) => {
    try {
      // TODO: implement renew functionality
      msg.success(`Đã gia hạn listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Gia hạn thất bại");
    }
  };

  const onEdit = async (row) => {
    try {
      // TODO: implement edit functionality
      // await editListing(row.id)
      msg.info(`Chỉnh sửa listing ID: ${row.id}`);
      // Tạm thời chỉ log, sau này sẽ điều hướng đến trang edit
    } catch (e) {
      console.error(e);
      msg.error("Chỉnh sửa thất bại");
    }
  };

  return {
    loading,
    data,
    query,
    handleSearch,
    handleReset,
    refresh,
    setPage,
    onApprove,
    onReject,
    onEdit,
    onActivate,
    onDeactivate,
    onDelete,
    onRestore,
    onRenew,
    contextHolder,
  };
}
