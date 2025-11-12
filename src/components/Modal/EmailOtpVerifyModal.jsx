import React, { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { Modal, Typography, Button, message, theme, Input, Form } from "antd";
import { useFormErrorHandle } from "@hooks/useFormErrorHandle";

const { Title, Text } = Typography;

const EmailOtpVerifyModal = forwardRef(function EmailOtpVerifyModal(
  { open, email, onClose, onVerify, onResend, cooldownSec = 45, submitting = false, resendSubmitting = false },
  ref
) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(cooldownSec);
  const [messageApi, contextHolder] = message.useMessage();
  const timerRef = useRef(null);

  useFormErrorHandle(ref, form);

  const hiddenEmail = useMemo(() => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    const maskedUser =
      user.length > 2 ? user.slice(0, 2) + "*".repeat(user.length - 2) : user;
    return `${maskedUser}@${domain}`;
  }, [email]);

  const isValid = code && /^\d{6}$/.test(code);

  useEffect(() => {
    if (!open) return;
    setCode("");
    setCooldown(cooldownSec);
    form.resetFields();
  }, [open, cooldownSec, form]);

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
      messageApi.error(e?.message || "Mã OTP không hợp lệ");
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    try {
      await onResend?.();
      messageApi.success("Đã gửi lại mã OTP đến email");
      setCooldown(cooldownSec);
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
          borderRadius: 10,
          background: "#fff",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        body: { padding: 0 },
      }}
      destroyOnClose
    >
      {contextHolder}
      <Title level={3} style={{ textAlign: "center", marginBottom: 4 }}>
        Xác thực Email
      </Title>
      <Text type="secondary">Chúng tôi đã gửi mã OTP đến địa chỉ email:</Text>
      <div style={{ margin: "6px 0 14px", fontWeight: 600 }}>{hiddenEmail}</div>

      <Form form={form} layout="vertical" onFinish={handleVerify} style={{ width: "100%" }}>
        <Form.Item name="otp" validateTrigger={false} style={{ textAlign: "center" }}>
          <Input.OTP
            length={6}
            autoFocus
            value={code}
            onChange={(v) => /^\d{0,6}$/.test(v) && setCode(v)}
            size="large"
            style={{ display: "flex", justifyContent: "center" }}
            onPressEnter={handleVerify}
          />
        </Form.Item>

        <Button
          type="primary"
          block
          size="large"
          style={{ borderRadius: 8, fontWeight: 600 }}
          disabled={!isValid}
          loading={submitting}
          onClick={handleVerify}
        >
          Xác nhận
        </Button>
      </Form>

      <div style={{ marginTop: 10, textAlign: "center" }}>
        {cooldown > 0 ? (
          <Text type="secondary">Gửi lại sau {cooldown}s</Text>
        ) : (
          <Button type="link" onClick={resend} loading={resendSubmitting} style={{ padding: 0 }}>
            Gửi lại mã
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default EmailOtpVerifyModal;
