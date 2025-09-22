import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import { mapFieldErrorsToAntd } from "@utils/mapFieldErrors";
import { LoginDto } from "../../dtos/user/LoginDto";
import { getGoogleAuthUrl } from "@services/authService";




const LoginModal = ({
    open,
    onClose,
    onSubmit,      // (values) => Promise<void> | void
    onForgot,      // () => void
    onGoogle,      // () => void
    onGoRegister,  // () => void
}) => {

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleFinish = async (values) => {
        // convert form values -> DTO
        const loginDto = new LoginDto(values.phoneNumber, values.password);

        setSubmitting(true);
        try {

            await onSubmit?.(loginDto);

            messageApi.success("Đăng nhập thành công", 1.2);

            setTimeout(() => onClose?.(), 0);

        } catch (e) {
            mapFieldErrorsToAntd(form, e?.fieldErrors);
            messageApi.error(e?.message || "Đăng nhập thất bại", 1.2);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const url = await getGoogleAuthUrl();
            window.location.assign(url); // redirect tới Google 
        } catch (e) {
            messageApi.error(e?.message || "Không thể bắt đầu đăng nhập Google", 1.2);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onClose}
            footer={null}
            width={404}
            centered
            maskClosable={false}
            closeIcon={<span style={{ fontSize: 18, color: "#999" }}>×</span>}
            styles={{
                content: {
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,.5)",
                    background: "#fff",
                    padding: "35px 22px",
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "stretch",
                    gap: 24,
                },
                body: { padding: 0 },
            }}
            afterClose={() => form.resetFields()}
        >
            {contextHolder}
            {/* Header */}
            <div style={{ textAlign: "center", marginTop: -8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, lineHeight: "28px" }}>
                    Đăng nhập
                </div>
                <div style={{ marginTop: 6, color: "#8C8C8C" }}>
                    Chào mừng bạn đến với ReEV
                </div>
            </div>

            {/* Form */}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark="optional"
                style={{ marginTop: 8 }}
            >
                <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại !" },
                        { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ !" },
                    ]}
                    style={{ marginBottom: 12 }}
                >
                    <Input
                        placeholder="Nhập số điện thoại của bạn"
                        style={{
                            height: 44,
                            borderRadius: 6,
                            border: "1px solid #000",
                            padding: "0 16px",
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu !" }]}
                    style={{ marginBottom: 6 }}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu của bạn"
                        style={{
                            height: 44,
                            borderRadius: 6,
                            border: "1px solid #000",
                            padding: "0 16px",
                        }}
                    />
                </Form.Item>

                <div style={{ marginBottom: 12 }}>
                    <Button style={{ padding: 0 }} type="link">Bạn quên mật khẩu?</Button>
                </div>

                <Form.Item style={{ marginBottom: 12 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={submitting}
                        disabled={googleLoading}
                        style={{ height: 44, borderRadius: 8, fontWeight: 600 }}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>

                <Form.Item style={{ marginBottom: 8 }}>
                    <Button
                        block
                        icon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        style={{
                            height: 44,
                            borderRadius: 8,
                            border: "1px solid #D9D9D9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            fontWeight: 600,
                            background: "#fff",
                        }}
                    >
                        Đăng nhập với Google
                    </Button>
                </Form.Item>

                {/* Separator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 8px" }}>
                    <div style={{ flex: 1, height: 1, background: "#E5E6EB" }} />
                    <div style={{ color: "#8C8C8C" }}>Hoặc</div>
                    <div style={{ flex: 1, height: 1, background: "#E5E6EB" }} />
                </div>

                {/* Register text */}
                <div style={{ textAlign: "center", color: "#8C8C8C" }}>
                    Bạn chưa có tài khoản?{" "}
                    <button
                        type="button"
                        onClick={onGoRegister}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            color: "#1677FF",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Đăng ký ngay
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default LoginModal;


