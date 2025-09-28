import React, { forwardRef, useState } from "react";
import { useFormErrorHandle } from "@hooks/useFormErrorHandle";
import {
    Modal,
    Form,
    Input,
    Button,
    Typography,
    Divider,
    theme,
} from "antd";
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,32}$/;
const fullNameRegex =
    /^[\p{L}][\p{L}\s\-']{1,49}$/u; 

const RegisterModal = forwardRef(function RegisterModal(
    { open, onClose, onSubmit, onGoLogin, submitting = false, phone },
    ref
) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [password, setPassword] = useState("");

    useFormErrorHandle(ref, form);

    const handleFinish = ({ fullName, password }) => {
        onSubmit?.({ fullName: fullName.trim(), password, phoneNumber: phone });
    };

    // rule check
    const rules = {
        length: password.length >= 8 && password.length <= 32,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*]/.test(password),
    };

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

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            maskClosable={false}
            destroyOnHidden
            width={404}
            styles={{
                content: {
                    maxWidth: 404,
                    width: "92vw",
                    padding: 24,
                    borderRadius: token.borderRadiusLG,
                    background: token.colorBgElevated,
                    boxShadow: token.boxShadowSecondary,
                },
                body: { padding: 0 },
            }}
            afterClose={() => form.resetFields()}
            closeIcon={
                <span style={{ fontSize: 18, color: token.colorTextSecondary }}>×</span>
            }
        >
            <div style={{ textAlign: "center", marginBottom: 8 }}>
                <Title level={3} style={{ margin: 0, lineHeight: "28px" }}>
                    Đăng ký
                </Title>
                <Text type="secondary">Tham gia vào thị trường ReEV</Text>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    requiredMark={false}
                    style={{ marginTop: 4 }}
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
                        style={{ marginBottom: 12 }}
                    >
                        <Input placeholder="Nhập họ và tên của bạn" size="large" />
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
                            placeholder="Nhập mật khẩu của bạn"
                            size="large"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    {/* Checklist ngay dưới mật khẩu */}
                    <div style={{ marginBottom: 12 }}>
                        {renderRule(rules.length, "Giới hạn từ 8–32 ký tự.")}
                        {renderRule(rules.upper, "Tối thiểu 01 ký tự IN HOA.")}
                        {renderRule(rules.lower, "Tối thiểu 01 ký tự in thường.")}
                        {renderRule(rules.number, "Tối thiểu 01 chữ số.")}
                        {renderRule(
                            rules.special,
                            "Tối thiểu 01 ký tự đặc biệt (!@#$%^&*)."
                        )}
                    </div>

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
                        style={{ marginBottom: 16 }}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
                    </Form.Item>

                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        block
                        loading={submitting}
                        disabled={submitting}
                        style={{ borderRadius: 8, fontWeight: 600 }}
                    >
                        Đăng ký
                    </Button>
                </Form>

                <Divider plain style={{ margin: "10px 0 6px" }}>
                    Hoặc
                </Divider>
                <div style={{ textAlign: "center" }}>
                    <Text type="secondary">
                        Bạn đã có tài khoản?{" "}
                        <Button
                            type="link"
                            style={{ padding: 0, fontWeight: 600 }}
                            onClick={onGoLogin}
                        >
                            Đăng nhập ngay
                        </Button>
                    </Text>
                </div>
            </div>
        </Modal>
    );
});

export default RegisterModal;
