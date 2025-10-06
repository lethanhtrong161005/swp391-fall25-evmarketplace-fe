import React from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import s from "./FilterBar.module.scss";
import { useFilterBar } from "./useFilterBar";

const { RangePicker } = DatePicker;

export default function FilterBar({
  loading,
  onSearch,
  onReset,
  onRefresh,
  filters,
  onFiltersChange,
}) {
  const { form, STATUS, YES_NO_ALL, handleFinish, handleReset } = useFilterBar({
    onSearch,
    onReset,
    filters,
    onFiltersChange,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className={s.filterForm}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Từ khóa" name="q">
            <Input placeholder="Tìm theo tiêu đề, ID..." />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label="Loại" name="category">
            <Select
              allowClear
              options={[
                { value: "EV_CAR", label: "Xe ô tô" },
                { value: "E_MOTORBIKE", label: "Xe máy điện" },
                { value: "E_BIKE", label: "Xe đạp điện" },
                { value: "BATTERY", label: "Pin" },
              ]}
              placeholder="Chọn loại xe hoặc pin"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ngày tạo" name="createdAt">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Space>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          loading={loading}
        >
          Tìm kiếm
        </Button>
        <Button onClick={handleReset}>Xóa bộ lọc</Button>
        <Button onClick={onRefresh} loading={loading}>
          Làm mới
        </Button>
      </Space>
    </Form>
  );
}
