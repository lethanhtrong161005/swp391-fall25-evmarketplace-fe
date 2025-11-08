import React from "react";
import { Form, DatePicker } from "antd";

const FilterBar = ({
  form,
  onValuesChange,
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
    </Form>
  );
};

export default FilterBar;
