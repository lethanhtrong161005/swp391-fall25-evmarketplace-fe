// src/components/Modal/ResetPasswordModal.jsx
import React, { forwardRef } from "react";
import { Modal, Form, Input, Button, Typography, Divider, theme } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useFormErrorHandle } from "@hooks/useFormErrorHandle";

const { Title, Text } = Typography;

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,32}$/;

const ResetPasswordModal = forwardRef(function ResetPasswordModal(
    { open, onClose, onSubmit, submitting = false, onGoLogin },
    ref
) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    // Cho parent: ref.current?.setFieldErrors({ newPassword: ["..."] });
    useFormErrorHandle(ref, form);

    // Theo dõi giá trị mật khẩu để render checklist
    const pwd = Form.useWatch("newPassword", form) || "";

    const rules = {
        length: pwd.length >= 8 && pwd.length <= 32,
        upper: /[A-Z]/.test(pwd),
        lower: /[a-z]/.test(pwd),
        number: /\d/.test(pwd),
        special: /[!@#$%^&*]/.test(pwd),
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

    const handleFinish = ({ newPassword }) => {
        onSubmit?.({ newPassword });
    };

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
            closeIcon={<span style={{ fontSize: 18, color: token.colorTextSecondary }}>×</span>}
        >
            <div style={{ textAlign: "center", marginBottom: 8 }}>
                <Title level={3} style={{ margin: 0, lineHeight: "28px" }}>
                    Đặt lại mật khẩu
                </Title>
                <Text type="secondary">Nhập mật khẩu mới cho tài khoản của bạn</Text>
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
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            {
                                pattern: passwordRegex,
                                message:
                                    "Mật khẩu 8–32 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (!@#$%^&*)",
                            },
                        ]}
                        style={{ marginBottom: 4 }}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
                    </Form.Item>

                    {/* Checklist ngay dưới mật khẩu */}
                    <div style={{ marginBottom: 12 }}>
                        {renderRule(rules.length, "Giới hạn từ 8–32 ký tự.")}
                        {renderRule(rules.upper, "Tối thiểu 01 ký tự IN HOA.")}
                        {renderRule(rules.lower, "Tối thiểu 01 ký tự in thường.")}
                        {renderRule(rules.number, "Tối thiểu 01 chữ số.")}
                        {renderRule(rules.special, "Tối thiểu 01 ký tự đặc biệt (!@#$%^&*).")}
                    </div>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                                },
                            }),
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
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
                        Cập nhật mật khẩu
                    </Button>
                </Form>

                {onGoLogin && (
                    <>
                        <Divider plain style={{ margin: "10px 0 6px" }}>Hoặc</Divider>
                        <div style={{ textAlign: "center" }}>
                            <Text type="secondary">
                                Đã nhớ mật khẩu?{" "}
                                <Button type="link" style={{ padding: 0, fontWeight: 600 }} onClick={onGoLogin}>
                                    Đăng nhập
                                </Button>
                            </Text>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
});

export default ResetPasswordModal;
