import React from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

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

export default function FilterBar({
  loading,
  onSearch,
  onReset,
  onRefresh,
  // optional: nếu muốn controlled từ cha theo style bạn gửi
  filters,
  onFiltersChange,
}) {
  const [form] = Form.useForm();

  // Nếu có filters từ cha, hydrate Form
  React.useEffect(() => {
    if (filters) {
      form.setFieldsValue({
        q: filters.keyword,
        status: filters.status || "ALL",
        verified: filters.verified || "ALL",
        isConsigned: filters.consigned || "ALL",
        createdAt:
          filters.dateFrom && filters.dateTo
            ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)]
            : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const emitSearch = () => {
    const v = form.getFieldsValue(true);
    const [from, to] = v.createdAt || [];
    const mapBool = (str) =>
      str === "true" ? true : str === "false" ? false : undefined;

    const payload = {
      q: v.q?.trim(),
      status: v.status === "ALL" ? undefined : v.status,
      verified: mapBool(v.verified),
      isConsigned: mapBool(v.isConsigned),
      createdFrom: from ? from.toISOString() : undefined,
      createdTo: to ? to.toISOString() : undefined,
    };

    // hỗ trợ callback kiểu bạn tham khảo
    onFiltersChange?.({
      keyword: payload.q || "",
      status: payload.status || "ALL",
      verified: v.verified || "ALL",
      consigned: v.isConsigned || "ALL",
      dateFrom: payload.createdFrom || "",
      dateTo: payload.createdTo || "",
    });

    onSearch?.(payload);
  };

  const clearAll = () => {
    form.resetFields();
    onReset?.();
    onFiltersChange?.({
      keyword: "",
      status: "ALL",
      verified: "ALL",
      consigned: "ALL",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <Form
      form={form}
      onFinish={emitSearch}
      initialValues={{ status: "ALL", verified: "ALL", isConsigned: "ALL" }}
    >
      {/* Lưới 6 cột kiểu tham khảo (wrap khi hẹp) */}
      <Row gutter={[8, 8]} align="top">
        {/* Keyword (col-span-2) */}
        <Col xs={24} md={12} lg={8}>
          <Form.Item name="q" style={{ marginBottom: 0 }}>
            <Input
              allowClear
              placeholder="Tìm theo tiêu đề, mã, người đăng..."
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
            />
          </Form.Item>
        </Col>

        {/* Status */}
        <Col xs={24} sm={12} lg={4}>
          <Form.Item name="status" style={{ marginBottom: 0 }}>
            <Select
              options={STATUS}
              placeholder="Trạng thái"
              allowClear={false}
            />
          </Form.Item>
        </Col>

        {/* Verified */}
        <Col xs={24} sm={12} lg={4}>
          <Form.Item name="verified" label="Xác thực" style={{ marginBottom: 0 }}>
            <Select options={YES_NO_ALL} placeholder="Đã xác thực" />
          </Form.Item>
        </Col>

        {/* Consigned */}
        <Col xs={24} sm={12} lg={4}>
          <Form.Item name="isConsigned" label="Ký gửi" style={{ marginBottom: 0 }}>
            <Select options={YES_NO_ALL} placeholder="Đã ký gửi" />
          </Form.Item>
        </Col>

        {/* Date range (From / To) */}
        <Col xs={24} md={12} lg={4}>
          <Form.Item name="createdAt" style={{ marginBottom: 0 }}>
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Form.Item>
        </Col>

        {/* Action buttons */}
        <Col xs={24}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tìm kiếm
            </Button>
            <Button onClick={clearAll} disabled={loading}>
              Xóa lọc
            </Button>
            <Button onClick={onRefresh} disabled={loading}>
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}
