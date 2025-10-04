import React from "react";
import { Drawer, Form, Input, Select, Button, Space } from "antd";
import { useCreateAccountForm } from "./logic.jsx";

const { Option } = Select;

export default function CreateAccountForm({ open, onClose, onFinish }) {
  const { form, loading } = useCreateAccountForm({ onFinish });

  return (
    <Drawer
      title="Tạo tài khoản mới"
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
            Tạo tài khoản
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
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
