import React from "react";
import { Form, DatePicker, Select } from "antd";

const FilterBar = ({
  form,
  onValuesChange,
  listingTypeOptions,
  categoryOptions,
  branchOptions = [],
  branchLoading = false,
}) => {
  return (
    <Form
      form={form}
      layout="inline"
      onValuesChange={onValuesChange}
      style={{ gap: 12, flexWrap: "wrap" }}
    >
      <Form.Item
        name="range"
        label="Khoảng thời gian"
        rules={[{ required: true, message: "Chọn khoảng thời gian" }]}
      >
        <DatePicker.RangePicker allowClear={false} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="branchId"
        label="Chi nhánh"
        rules={[{ required: true, message: "Chọn chi nhánh" }]}
      >
        <Select
          placeholder="Chọn chi nhánh"
          style={{ minWidth: 180 }}
          loading={branchLoading}
          options={branchOptions}
        />
      </Form.Item>
      <Form.Item name="listingType" label="Loại tin">
        <Select
          allowClear
          placeholder="Tất cả"
          style={{ minWidth: 140 }}
          options={listingTypeOptions}
        />
      </Form.Item>
      <Form.Item name="category" label="Danh mục">
        <Select
          allowClear
          placeholder="Tất cả"
          style={{ minWidth: 160 }}
          options={categoryOptions}
        />
      </Form.Item>
    </Form>
  );
};

export default FilterBar;
