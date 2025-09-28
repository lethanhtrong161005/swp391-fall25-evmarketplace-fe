
import React, {
    useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle
} from "react";
import { Modal, Typography, Button, message, theme, Input, Form } from "antd";
import { useFormErrorHandle } from "@hooks/useFormErrorHandle";


const { Title, Text } = Typography;

const OtpVerifyModal = forwardRef(function OtpVerifyModal(
    { open, phone, onClose, onVerify, onResend, cooldownSec = 30, submitting = false, resendSubmitting = false },
    ref
) {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [code, setCode] = useState("");
    const [cooldown, setCooldown] = useState(cooldownSec);
    const [messageApi, contextHolder] = message.useMessage();
    const timerRef = useRef(null);

    useFormErrorHandle(ref, form);

    const hiddenPhone = useMemo(() => {
        if (!phone) return "";
        // 09******99
        return phone.replace(/(\d{2})\d+(?=\d{2}$)/, (_, p1) => p1 + "*".repeat(Math.max(0, phone.length - 4)));
    }, [phone]);

    const isValid = code && /^\d{6}$/.test(code);

    // Reset khi mở
    useEffect(() => {
        if (!open) return;
        setCode("");
        setCooldown(cooldownSec);
        form.resetFields();
    }, [open, cooldownSec, form]);

    // Countdown resend
    useEffect(() => {
        if (!open) return;
        timerRef.current && clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCooldown((s) => (s <= 1 ? (clearInterval(timerRef.current), 0) : s - 1));
        }, 1000);
        return () => timerRef.current && clearInterval(timerRef.current);
    }, [open]);

    const handleVerify = async () => {
        if (!isValid) {
            form.setFields([{ name: "otp", errors: ["Vui lòng nhập đủ 6 số"] }]);
            return;
        }
        try {
            form.setFields([{ name: "otp", errors: [] }]);
            await onVerify?.(code);
        } catch (e) {
            // field error sẽ được parent set qua ref; ở đây chỉ toast nhẹ
            messageApi.error(e?.message || "Mã OTP không hợp lệ");
        }
    };

    const handlePaste = (e) => {
        const text = (e.clipboardData || window.clipboardData).getData("text");
        const digits = (text || "").replace(/\D/g, "").slice(0, 6);
        if (digits.length === 6) {
            setCode(digits);
            setTimeout(handleVerify, 0);
            e.preventDefault();
        }
    };

    const resend = async () => {
        if (cooldown > 0) return;
        try {
            await onResend?.();
            messageApi.success("Đã gửi lại mã OTP");
            setCooldown(cooldownSec);
            // timer đã được set ở effect open; restart local
            timerRef.current && clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setCooldown((s) => (s <= 1 ? (clearInterval(timerRef.current), 0) : s - 1));
            }, 1000);
        } catch (e) {
            messageApi.error(e?.message || "Không thể gửi lại mã");
        }
    };

    return (
        <Modal
            title={null}
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            maskClosable={false}
            width={404}
            styles={{
                content: {
                    width: 404,
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.5)",
                    background: "#FFF",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 12,
                },
                body: { padding: 0 },
            }}
            destroyOnHidden
            closeIcon={<span style={{ fontSize: 20, color: token.colorTextSecondary }}>×</span>}
        >
            {contextHolder}

            <div style={{ textAlign: "center", marginBottom: 6 }}>
                <Title level={2} style={{ margin: 0 }}>Xác thực số điện thoại</Title>
                <Text type="secondary">Chúng tôi đã gửi mã OTP đến số điện thoại</Text>
                <div style={{ marginTop: 6, fontWeight: 600 }}>{hiddenPhone}</div>
                <div style={{ marginTop: 6, fontWeight: 500 }}>Nhập mã OTP 6 số</div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleVerify}>
                <Form.Item name="otp" validateTrigger={false} style={{ marginBottom: 8 }}>
                    <div onPaste={handlePaste} style={{ display: "flex", justifyContent: "center" }}>
                        <Input.OTP
                            autoFocus
                            length={6}
                            value={code}
                            onChange={(v) => {
                                if (/^\d{0,6}$/.test(v)) setCode(v);
                                if (v.length < 6) form.setFields([{ name: "otp", errors: [] }]);
                            }}
                            size="large"
                            onPressEnter={handleVerify}
                        />
                    </div>
                </Form.Item>

                <Button
                    type="primary"
                    block
                    size="large"
                    style={{ borderRadius: 10, fontWeight: 700 }}
                    disabled={!isValid}
                    loading={submitting}
                    onClick={handleVerify}
                >
                    Xác thực
                </Button>
            </Form>

            <div style={{ textAlign: "center", marginTop: 6 }}>
                <Text type="secondary">Bạn không nhận được mã?</Text>
                <div>
                    {cooldown > 0 ? (
                        <Text type="secondary">Gửi lại sau {cooldown} giây</Text>
                    ) : (
                        <Button type="link" style={{ padding: 0 }} onClick={resend} loading={resendSubmitting}>
                            Gửi lại mã
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
});

export default OtpVerifyModal;

