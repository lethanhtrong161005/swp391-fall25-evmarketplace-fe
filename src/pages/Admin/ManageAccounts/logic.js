import React from "react";
import { message } from "antd";
import {
  getAllAccounts,
  updateAccountProfile,
  getAccountActivityLogs,
} from "@services/accountService";
import {
  fakeAccountsData,
  mockApiDelay,
} from "../../../data/admin/accountsData.fake";

// Temporary toggle: set to true to use local fake data while backend is addressed
const USE_FAKE_DATA = true;
// Đã xoá import fake data, luôn dùng API thật

export function useManageAccounts() {
  const [msg] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);

  // Simplified pagination like ManageListing
  const [query, setQuery] = React.useState({
    page: 1,
    size: 10,
    role: "",
    status: "",
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const [data, setData] = React.useState({ items: [], total: 0 });

  const setPage = (page) => setQuery((q) => ({ ...q, page }));

  const handleSearch = (values) =>
    setQuery((q) => ({ ...q, page: 1, ...values }));

  const handleReset = () =>
    setQuery({
      page: 1,
      size: 10,
      role: "",
      status: "",
      search: "",
      sortBy: "created_at",
      sortOrder: "desc",
    });

  // drawer states
  const [openCreate, setOpenCreate] = React.useState(false);
  const [detailRow, setDetailRow] = React.useState(null);
  const [detailLogs, setDetailLogs] = React.useState([]);
  const [editRow, setEditRow] = React.useState(null);

  const fetchAccounts = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: query.page,
        pageSize: query.size,
        role: query.role || undefined,
        status: query.status || undefined,
        search: query.search || undefined,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      let response;
      if (USE_FAKE_DATA) {
        await mockApiDelay(250);
        response = { ...fakeAccountsData };
        const items = response.data.items || [];
        setRows(items);
        setData({
          items: items,
          total: response.data.total || items.length,
        });
      } else {
        response = await getAllAccounts(params);
        const items = response.data?.items || response.data || [];
        const total =
          response.data?.pagination?.total_items || response.data?.total || 0;
        setRows(items);
        setData({
          items: items,
          total: total,
        });
      }
    } catch (error) {
      msg.error(error.message || "Không tải được danh sách tài khoản");
      setRows([]);
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [msg, query]);

  const refresh = React.useCallback(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  React.useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const onCreateFinish = async (values) => {
    try {
      // TODO: Implement create account API
      console.log("Create account:", values);
      msg.info("Chức năng tạo tài khoản đang được phát triển");
      setOpenCreate(false);
      // refresh();
    } catch (error) {
      msg.error(error.message || "Tạo tài khoản thất bại");
    }
  };

  const onEditFinish = async (patch) => {
    try {
      await updateAccountProfile(patch.id, patch);
      msg.success("Đã cập nhật thông tin tài khoản");
      setEditRow(null);
      fetchAccounts();
    } catch (error) {
      msg.error(error.message || "Cập nhật thất bại");
    }
  };

  // khi mở chi tiết, tải log
  React.useEffect(() => {
    (async () => {
      if (detailRow?.id) {
        try {
          const response = await getAccountActivityLogs(detailRow.id);
          setDetailLogs(response.data || response || []);
        } catch (error) {
          console.error("Error loading activity logs:", error);
          setDetailLogs([]);
        }
      } else {
        setDetailLogs([]);
      }
    })();
  }, [detailRow]);

  return {
    loading,
    rows,
    refresh,
    query,
    data,
    setPage,
    handleSearch,
    handleReset,
    openCreate,
    setOpenCreate,
    onCreateFinish,
    detailRow,
    setDetailRow,
    detailLogs,
    editRow,
    setEditRow,
    onEditFinish,
  };
}
