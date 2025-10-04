import React from "react";
import { Drawer, Form, Input, Select, Button, Space } from "antd";
import { useEditAccountForm } from "./logic.jsx";

const { Option } = Select;

export default function EditAccountForm({ open, onClose, account, onFinish }) {
  const { form, loading } = useEditAccountForm({ account, onFinish });

  return (
    <Drawer
      title="Chỉnh sửa tài khoản"
      open={open}
      onClose={onClose}
      width={400}
      footer={
        <Space style={{ float: "right" }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Cập nhật
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="STAFF">Nhân viên</Option>
            <Option value="MEMBER">Thành viên</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Không hoạt động</Option>
            <Option value="BLOCKED">Bị khóa</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
