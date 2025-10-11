import React from "react";
import { Form } from "antd";
import dayjs from "dayjs";

const STATUS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã đăng" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

const YES_NO_ALL = [
  { value: "ALL", label: "Tất cả" },
  { value: "true", label: "Có" },
  { value: "false", label: "Không" },
];

export function useFilterBar({ onSearch, onReset, filters, onFiltersChange }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (filters) {
      form.setFieldsValue({
        q: filters.keyword,
        category: filters.category,
        status: filters.status || "ALL",
        verified: filters.verified || "ALL",
        isConsigned: filters.consigned || "ALL",
        createdAt:
          filters.dateFrom && filters.dateTo
            ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
            : undefined,
      });
    }
  }, [filters, form]);

  const handleFinish = (values) => {
    const params = { ...values };

    // Map field names cho đúng với backend/fake data
    if (values.q) {
      params.q = values.q;
    }

    if (values.category) {
      params.category = values.category;
    }

    if (values.createdAt) {
      params.dateFrom = values.createdAt[0]?.format("YYYY-MM-DD");
      params.dateTo = values.createdAt[1]?.format("YYYY-MM-DD");
      delete params.createdAt;
    }

    // Remove empty/ALL values
    Object.keys(params).forEach((key) => {
      if (
        params[key] === "ALL" ||
        params[key] === undefined ||
        params[key] === null ||
        params[key] === ""
      ) {
        delete params[key];
      }
    });

    onSearch?.(params);
    onFiltersChange?.(params);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
    onFiltersChange?.({});
  };

  return {
    form,
    STATUS,
    YES_NO_ALL,
    handleFinish,
    handleReset,
  };
}
