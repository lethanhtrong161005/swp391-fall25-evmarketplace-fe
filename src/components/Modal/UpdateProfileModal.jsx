import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Avatar,
  Button,
  message,
  Row,
  Col,
  Space,
  Tooltip,
  Divider,
} from "antd";
import {
  ExclamationCircleTwoTone,
  CheckCircleTwoTone,
  UploadOutlined,
  UserOutlined,
  MessageTwoTone,
  MailTwoTone,
} from "@ant-design/icons";
import useUpdateProfileModal from "@hooks/useUpdateProfileModal";
import EmailOtpVerifyModal from "./EmailOtpVerifyModal";
import AddressField from "@components/AddressField";

export default function UpdateProfileModal({
  isOpen = true,
  initialData = {},
  onClose,
  onUpdated,
}) {
  const [form] = Form.useForm();
  const [msgApi, contextHolder] = message.useMessage();

  const {
    preview,
    avatarUploading,
    loading,
    otpSending,
    otpVerifying,
    otpRequested,
    phoneVerified,
    emailExist,
    emailVerified,
    emailSending,
    initForm,
    handleUploadBefore,
    handleRequestOtp,
    handleVerifyOtp,
    handleVerifyEmailOtp,
    handleResendEmailOtp,
    onFinish,
  } = useUpdateProfileModal({ initialData, onUpdated, msgApi });

  const [emailOtpOpen, setEmailOtpOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (isOpen) initForm(form);
  }, [isOpen, initForm, form]);

  const handleOpenEmailOtp = async () => {
    const email = form.getFieldValue("email");
    if (!email) {
      msgApi.warning("Vui lòng nhập email trước khi xác thực!");
      return;
    }
    try {
      setPendingEmail(email);
      await handleResendEmailOtp(email);
      msgApi.success("Đã gửi mã OTP đến email của bạn!");
      setEmailOtpOpen(true);
    } catch (err) {
      msgApi.error(err?.message || "Không thể gửi mã OTP.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            Cập nhật thông tin cá nhân
          </span>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={720}
        style={{ top: 40 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Row gutter={[24, 12]}>
            <Col xs={24} sm={8} style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                src={preview}
                icon={<UserOutlined />}
                style={{ border: "2px solid #eee" }}
              />
              <div style={{ marginTop: 12 }}>
                <Upload
                  accept="image/*"
                  beforeUpload={handleUploadBefore}
                  showUploadList={false}
                  disabled={avatarUploading}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={avatarUploading}
                    style={{ borderRadius: 6 }}
                  >
                    Thay ảnh
                  </Button>
                </Upload>
              </div>
            </Col>

            <Col xs={24} sm={16}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Nhập họ tên" }]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label={
                  <Space>
                    <span>Email</span>
                    {emailExist || emailVerified ? (
                      <Tooltip title="Email đã xác thực">
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Chưa xác thực email">
                        <ExclamationCircleTwoTone twoToneColor="#faad14" />
                      </Tooltip>
                    )}
                  </Space>
                }
                rules={[
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  placeholder="example@email.com"
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setPendingEmail(newEmail);
                  }}
                  suffix={
                    (!emailVerified ||
                      form.getFieldValue("email") !== initialData.email) && (
                      <Button
                        size="small"
                        type="link"
                        icon={<MailTwoTone />}
                        onClick={handleOpenEmailOtp}
                        style={{ padding: 0 }}
                        loading={emailSending}
                      >
                        Xác thực
                      </Button>
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label={
                  <Space>
                    <span>Số điện thoại</span>
                    {phoneVerified ? (
                      <Tooltip title="Đã xác thực">
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Chưa xác thực">
                        <ExclamationCircleTwoTone twoToneColor="#faad14" />
                      </Tooltip>
                    )}
                  </Space>
                }
                rules={[
                  {
                    pattern: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="0987654321" disabled={phoneVerified} />
              </Form.Item>

              {!phoneVerified && (
                <>
                  <Space style={{ marginBottom: 12 }}>
                    <Button
                      onClick={() => handleRequestOtp(form)}
                      loading={otpSending}
                      icon={<MessageTwoTone />}
                    >
                      Gửi OTP
                    </Button>
                  </Space>

                  {otpRequested && (
                    <>
                      <Form.Item
                        name="otpCode"
                        label="Mã OTP"
                        rules={[{ required: true, message: "Nhập mã OTP" }]}
                      >
                        <Input placeholder="Nhập mã OTP" maxLength={6} />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => handleVerifyOtp(form)}
                        loading={otpVerifying}
                      >
                        Xác thực OTP
                      </Button>
                    </>
                  )}
                </>
              )}

              <Divider />

              <AddressField form={form} />
            </Col>
          </Row>

          <div
            style={{
              textAlign: "right",
              marginTop: 24,
              borderTop: "1px solid #f0f0f0",
              paddingTop: 16,
            }}
          >
            <Button
              style={{ marginRight: 8 }}
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </Modal>

      <EmailOtpVerifyModal
        open={emailOtpOpen}
        email={pendingEmail}
        onClose={() => setEmailOtpOpen(false)}
        onVerify={async (otp) => {
          await handleVerifyEmailOtp(pendingEmail, otp);
          setEmailOtpOpen(false);
        }}
        onResend={() => handleResendEmailOtp(pendingEmail)}
      />
    </>
  );
}
