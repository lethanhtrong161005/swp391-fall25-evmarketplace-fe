import React, { useState } from "react";
import { Drawer, Form, Input, Button, Space, Typography, Select } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useCreateAccountForm } from "./useCreateAccountForm.js";

const { Text } = Typography;
const { Option } = Select;

// Regex validation giống RegisterModal
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,32}$/;
const fullNameRegex = /^[\p{L}][\p{L}\s\-']{1,49}$/u;
const phoneRegex = /^[0-9]{10,11}$/;

/**
 * Form tạo tài khoản mới cho Admin
 * Sử dụng validation đầy đủ giống RegisterModal
 */
export default function CreateAccountForm({ open, onClose, onFinish }) {
  const { form, loading, handleFinish } = useCreateAccountForm({ onFinish });
  const [password, setPassword] = useState("");

  // Kiểm tra rule cho mật khẩu
  const rules = {
    length: password.length >= 8 && password.length <= 32,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  // Render rule check cho mật khẩu
  const renderRule = (ok, text) =>
    ok ? (
      <div style={{ fontSize: 13, color: "green" }}>
        <CheckCircleTwoTone twoToneColor="#52c41a" /> {text}
      </div>
    ) : (
      <div style={{ fontSize: 13, color: "gray" }}>
        <CloseCircleTwoTone twoToneColor="#ccc" /> {text}
      </div>
    );

  // Reset password state khi đóng drawer
  const handleClose = () => {
    setPassword("");
    onClose();
  };

  return (
    <Drawer
      title="Tạo tài khoản mới"
      open={open}
      onClose={handleClose}
      width={500}
      destroyOnHidden
      footer={
        <Space style={{ float: "right" }}>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.validateFields().then(handleFinish)}
          >
            Tạo tài khoản
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            {
              pattern: fullNameRegex,
              message:
                "Họ tên phải dài 2–50 ký tự, chỉ chứa chữ cái, khoảng trắng, dấu gạch nối hoặc dấu nháy đơn",
            },
          ]}
        >
          <Input placeholder="Nhập họ và tên" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: phoneRegex,
              message: "Số điện thoại phải có 10-11 chữ số",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            {
              pattern: passwordRegex,
              message:
                "Mật khẩu 8–32 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (!@#$%^&*)",
            },
          ]}
          style={{ marginBottom: 4 }}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        {/* Hiển thị checklist validation mật khẩu */}
        {password && (
          <div style={{ marginBottom: 16 }}>
            {renderRule(rules.length, "Giới hạn từ 8–32 ký tự.")}
            {renderRule(rules.upper, "Tối thiểu 01 ký tự IN HOA.")}
            {renderRule(rules.lower, "Tối thiểu 01 ký tự in thường.")}
            {renderRule(rules.number, "Tối thiểu 01 chữ số.")}
            {renderRule(
              rules.special,
              "Tối thiểu 01 ký tự đặc biệt (!@#$%^&*)."
            )}
          </div>
        )}

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[
            { required: true, message: "Vui lòng chọn vai trò!" },
            {
              validator: (_, value) => {
                if (!value || (value !== "STAFF" && value !== "MODERATOR")) {
                  return Promise.reject(
                    new Error("Chỉ có thể tạo tài khoản Staff hoặc Moderator")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          initialValue="STAFF"
        >
          <Select placeholder="Chọn vai trò" size="large">
            <Option value="STAFF">Nhân viên</Option>
            <Option value="MODERATOR">Kiểm duyệt viên</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
