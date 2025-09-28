import React, { useMemo, forwardRef } from "react";
import { useFormErrorHandle } from "@hooks/useFormErrorHandle";
import { Modal, Form, Input, Button, Typography, Divider, theme } from "antd";

const { Title, Text } = Typography;

const PhoneResetPasswordModal = forwardRef(function PhoneResetPasswordModal(
    { open, onClose, onContinue, onGoLogin, submitting = false },
    ref
) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    // expose { setFieldErrors, clearErrors } cho parent
    useFormErrorHandle(ref, form);

    const phoneValue = Form.useWatch("phoneNumber", form);
    const isPhoneValid = useMemo(() => /^[0-9]{9,11}$/.test(phoneValue || ""), [phoneValue]);

    const handleFinish = ({ phoneNumber }) => onContinue?.(phoneNumber.trim());

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
                <Title level={3} style={{ margin: 0, lineHeight: "28px" }}>Đặt lại mật khẩu</Title>
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
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ!" },
                        ]}
                        style={{ marginBottom: 12 }}
                    >
                        <Input
                            size="large"
                            placeholder="Nhập số điện thoại"
                            addonBefore={<span style={{ color: token.colorTextSecondary }}>+84</span>}
                            inputMode="numeric"
                            maxLength={11}
                            autoFocus
                            onPressEnter={(e) => {
                                e.preventDefault();
                                if (!submitting && isPhoneValid) form.submit();
                            }}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        block
                        loading={submitting}
                        disabled={!isPhoneValid || submitting}
                        style={{ borderRadius: 8, fontWeight: 600 }}
                    >
                        Tiếp tục
                    </Button>
                </Form>

                <Divider plain style={{ margin: "10px 0 6px" }}>Hoặc</Divider>
                <div style={{ textAlign: "center" }}>
                    <Text type="secondary">
                        Bạn đã có tài khoản?{" "}
                        <Button type="link" style={{ padding: 0, fontWeight: 600 }} onClick={onGoLogin}>
                            Đăng nhập ngay
                        </Button>
                    </Text>
                </div>
            </div>
        </Modal>
    );
});

export default PhoneResetPasswordModal;
