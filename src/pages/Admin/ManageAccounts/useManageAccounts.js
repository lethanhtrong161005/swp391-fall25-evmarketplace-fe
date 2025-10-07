import React from "react";
import { message } from "antd";
import {
  listAccounts,
  createAccount,
  updateAccount,
  searchAccounts,
  getAccountDetail,
} from "@services/admin/account.admin.service";
import cookieUtils from "@utils/cookieUtils";

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
  const [data, setData] = React.useState({
    items: [],
    pagination: { totalRecords: 0, currentPage: 1, pageSize: 10 },
  });

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
      sortBy: "",
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
      // Map frontend params to backend API format
      const params = {
        page: query.page - 1 || 0, // Backend uses 0-based pagination
        size: query.size || 10,
        sort: "", // Force empty sort to avoid 500 error
        dir: query.sortOrder || "desc",
      };

      let response;

      // Use search API if there's a search term, otherwise use list API
      if (query.search && query.search.trim()) {
        response = await searchAccounts({
          ...params,
          keyword: query.search.trim(),
        });
      } else {
        response = await listAccounts(params);
      }

      // Handle response based on actual API schema
      // Response structure: { status, success, data: { items: [...], totalElements: 32 } }
      const apiData = response?.data || {};
      const rawItems = apiData?.items || [];
      const total = apiData?.totalElements || 0;

      // Sort items: Admin accounts first, then Staff, then Members
      const sortedItems = rawItems.sort((a, b) => {
        const roleOrder = { ADMIN: 0, STAFF: 1, MEMBER: 2 };
        const roleA = roleOrder[a.role] ?? 3;
        const roleB = roleOrder[b.role] ?? 3;

        if (roleA !== roleB) {
          return roleA - roleB;
        }

        // If same role, sort by ID or name
        return (a.id || 0) - (b.id || 0);
      });

      setRows(sortedItems);
      setData({
        items: sortedItems,
        pagination: {
          totalRecords: total,
          currentPage: query.page,
          pageSize: query.size,
        },
      });
    } catch (error) {
      // Check for authentication errors specifically
      if (error.status === 401) {
        if (error.message?.includes("expired")) {
          msg.error("Phiên đăng nhập đã hết hạn. Đang chuyển hướng...");
          // Interceptor will handle redirect
        } else {
          msg.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }

        // Clear data on auth failure
        setRows([]);
        setData({
          items: [],
          pagination: {
            totalRecords: 0,
            currentPage: query.page,
            pageSize: query.size,
          },
        });
      } else if (error.status === 500) {
        msg.error("Lỗi server. Vui lòng kiểm tra lại.");
      } else {
        msg.error(
          error.message ||
            error.response?.data?.message ||
            "Không tải được danh sách tài khoản"
        );

        setRows([]);
        setData({
          items: [],
          pagination: {
            totalRecords: 0,
            currentPage: query.page,
            pageSize: query.size,
          },
        });
      }
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

  // Xử lý tạo tài khoản mới
  const onCreateFinish = async (values) => {
    // Kiểm tra authentication trước
    const token = cookieUtils.getToken();
    if (!token) {
      msg.error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    // Validation cơ bản
    if (!values.phone || !values.password || !values.fullName) {
      msg.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Tạo payload với validation
      const payload = {
        phoneNumber: String(values.phone).trim(),
        password: String(values.password).trim(),
        fullName: String(values.fullName).trim(),
      };

      console.log("🚀 Tạo tài khoản với payload:", payload);
      console.log("🔑 Token hiện tại:", cookieUtils.getToken());

      // Gọi API thông qua service (đã có validation)
      await createAccount(payload);

      msg.success("Tạo tài khoản thành công");
      setOpenCreate(false);
      refresh();
    } catch (error) {
      console.error("❌ Lỗi tạo tài khoản chi tiết:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error,
      });

      // Xử lý lỗi chi tiết
      if (error.response?.status === 401) {
        msg.error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.message;
        if (errorMessage.includes("phoneNumber")) {
          msg.error("Số điện thoại đã tồn tại hoặc không hợp lệ.");
        } else {
          msg.error(errorMessage || "Dữ liệu không hợp lệ.");
        }
      } else if (error.response?.status === 500) {
        msg.error(
          "Lỗi server nội bộ. Vui lòng liên hệ team Backend để kiểm tra server logs."
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Tạo tài khoản thất bại";
        msg.error(errorMessage);
      }
      throw error;
    }
  };

  const onEditFinish = async (updateData) => {
    try {
      const { id, ...fieldsToUpdate } = updateData;

      if (!id) {
        msg.error("Không tìm thấy ID tài khoản");
        return;
      }

      if (Object.keys(fieldsToUpdate).length === 0) {
        msg.info("Không có thay đổi nào để cập nhật");
        setEditRow(null);
        return;
      }

      // Map frontend field names to backend field names if needed
      const mappedFields = {};
      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        switch (key) {
          case "phone":
            mappedFields["phoneNumber"] = value;
            break;
          default:
            mappedFields[key] = value;
        }
      });

      await updateAccount(id, mappedFields);
      msg.success("Cập nhật tài khoản thành công");
      setEditRow(null);
      refresh(); // Refresh the list to show updated data
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        msg.error("Không có quyền thực hiện thao tác này");
      } else if (error.response?.status === 404) {
        msg.error("Không tìm thấy tài khoản");
      } else if (error.response?.status === 400) {
        msg.error("Dữ liệu không hợp lệ");
      } else {
        msg.error(
          error.response?.data?.message || error.message || "Cập nhật thất bại"
        );
      }
    }
  };

  // khi mở chi tiết, tải account detail
  React.useEffect(() => {
    (async () => {
      if (detailRow?.id) {
        try {
          const response = await getAccountDetail(detailRow.id);
          // Update detail row with full data
          const fullData = response.data?.data || response.data || detailRow;

          // Merge with existing data from list to preserve dates if detail API doesn't have them
          const mergedData = {
            ...detailRow,
            ...fullData,
            // Preserve dates from list if detail doesn't have them
            createdAt:
              fullData.createdAt ||
              fullData.created_at ||
              detailRow.createdAt ||
              detailRow.created_at,
            updatedAt:
              fullData.updatedAt ||
              fullData.updated_at ||
              detailRow.updatedAt ||
              detailRow.updated_at,
          };

          setDetailRow(mergedData);
          setDetailLogs([]); // For now, logs are not available in current API
        } catch {
          setDetailLogs([]);
        }
      } else {
        setDetailLogs([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailRow?.id]);

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
