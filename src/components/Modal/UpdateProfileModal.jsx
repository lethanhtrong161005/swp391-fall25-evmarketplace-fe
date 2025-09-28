import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Avatar, Button, message, Row, Col, Space, Tooltip } from "antd";
import { ExclamationCircleTwoTone, CheckCircleTwoTone, UploadOutlined, UserOutlined, MessageTwoTone } from "@ant-design/icons";
import { getAxiosErrorMessage } from "../../config/errorMessage";
import { updateUserProfile, updateUserAvatar, requestPhoneOpt, verifyPhoneOtp } from "../../services/accountService";

const { Option } = Select;

export default function UpdateProfileModal({ isOpen = true, initialData = {}, onClose, onUpdated }) {
    const [form] = Form.useForm();
    const [msgApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(initialData.avatar || initialData.avatarUrl || null);
    const [avatarUploading, setAvatarUploading] = useState(false);

    //opt state
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const emailExist = Boolean(initialData.email);

    const getAvatarUrl = (filename) => {
        if (!filename) return null;
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089';
        return `${API_BASE}/api/accounts/image/${filename}/avatar`;
    }

    useEffect(() => {

    const profileData = initialData.profile || {};
    const fullNameValue = profileData.fullName ?? initialData.fullName ?? "";

        form.setFieldsValue({
            fullName: fullNameValue,
            email: initialData.email,
            phoneNumber: initialData.phoneNumber,
            address: profileData.addressLine,
            province: profileData.province,
            otpCode: "",
        });

        const avaUrl = profileData.avatarUrl;
        setPreview(avaUrl ? getAvatarUrl(avaUrl) : null);
        // Initialize phone verified state from initialData
        const derivedPhoneVerified = initialData?.phoneVerified ?? initialData?.profile?.phoneVerified ?? false;
        setPhoneVerified(!!derivedPhoneVerified);
    }, [initialData, form]);

    const handleUploadBefore = async (file) => {
        const ok = file.type.startsWith("image/");
        if (!ok) {
            msgApi.error("Chỉ chấp nhận ảnh.");
            return Upload.LIST_IGNORE;
        }
        const isLt500 = file.size / 1024 / 1024 < 500;
        if (!isLt500) {
            msgApi.error("Kích thước phải < 500MB.");
            return Upload.LIST_IGNORE;
        }
        // Show instant local preview first
        const oldPreview = preview;
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // Immediately upload avatar
        setAvatarUploading(true);
        try {
            const uploadRes = await updateUserAvatar(file);
            if (uploadRes?.status < 200 || uploadRes?.status >= 300 || uploadRes?.success === false) {
                msgApi.error(uploadRes?.message || "Tải ảnh đại diện thất bại");
                setPreview(oldPreview);
                return Upload.LIST_IGNORE;
            }
            const nameCandidate = uploadRes?.data?.avatarUrl || uploadRes?.avatarUrl || uploadRes?.data;
            const newAvatarFileName = typeof nameCandidate === 'string' ? nameCandidate : null;
            if (!newAvatarFileName) {
                msgApi.warning("Không nhận được tên tệp ảnh từ máy chủ");
                setPreview(oldPreview);
                return Upload.LIST_IGNORE;
            }
            // Update preview to server URL and notify parent immediately
            setPreview(getAvatarUrl(newAvatarFileName));
            const updatedProfile = {
                ...initialData,
                profile: {
                    ...initialData.profile,
                    avatarUrl: newAvatarFileName,
                },
            };
            onUpdated && onUpdated(updatedProfile);
            msgApi.success("Ảnh đại diện đã được cập nhật");
        } catch (err) {
            const errMsg = getAxiosErrorMessage(err);
            msgApi.error(errMsg || "Tải ảnh đại diện thất bại");
            setPreview(oldPreview);
        } finally {
            setAvatarUploading(false);
        }
        return false; // prevent antd auto upload
    };

    const handleRequestOtp = async () => {
        try {
            const phone = form.getFieldValue("phoneNumber") || initialData.phoneNumber
            if (!phone) {
                msgApi.warning("Vui lòng nhập số điện thoại");
                return;
            }
            setOtpSending(true);
            const res = await requestPhoneOpt(phone);
            if (res?.success === false) {
                msgApi.error(res?.message || "Gửi mã OTP thất bại");
                return
            }
            setOtpRequested(true);
            msgApi.success("Mã OTP đã được gửi đến số điện thoại của bạn");
        } catch (err) {
            const errMsg = getAxiosErrorMessage(err)
            msgApi.error(errMsg || "Gửi mã OTP thất bại");
        } finally {
            setOtpSending(false);
        }
    }

    const handleVerifyOtp = async () => {
        try {
            const phone = form.getFieldValue("phoneNumber") || initialData.phoneNumber
            const otp = form.getFieldValue("otpCode");
            if (!otp) {
                msgApi.warning("Vui lòng nhập mã OTP");
                return;
            }

            setOtpVerifying(true);
            const res = await verifyPhoneOtp({ phoneNumber: phone, otp })
            if (res?.success === false) {
                msgApi.error(res?.message || "Xác thực mã OTP thất bại");
                return
            }
            setPhoneVerified(true);
            msgApi.success("Xác thực mã OTP thành công");
        } catch (err) {
            const errMsg = getAxiosErrorMessage(err)
            msgApi.error(errMsg || "Xác thực mã OTP thất bại");
        } finally {
            setOtpVerifying(false);
        }
    }

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Build payload only with fields backend DTO accepts (flat DTO: no nested "profile")
            const payload = {
                fullName: values.fullName,
                province: values.province,
                addressLine: values.address,
            };

            const response = await updateUserProfile(payload);
            if (response?.success === false) {
                msgApi.error(response?.message || "Cập nhật thất bại");
                return;
            }

            msgApi.success("Cập nhật thành công");

            const updatedProfile = {
                ...initialData,
                email: initialData.email, // unchanged here
                phoneNumber: initialData.phoneNumber, // unchanged here
                profile: {
                    ...initialData.profile,
                    fullName: values.fullName,
                    province: values.province,
                    addressLine: values.address,
                    avatarUrl: initialData.profile?.avatarUrl,
                },
                phoneVerified: phoneVerified,
            };

            onUpdated && onUpdated(updatedProfile);

        } catch (err) {
            msgApi.error("Cập nhật thất bại")
            const errMsg = getAxiosErrorMessage(err)
            console.error("Cập nhật thất bại:", errMsg)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {contextHolder}
        <Modal
            title="Cập nhật thông tin cá nhân"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnHidden={true}
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                <Row gutter={16}>
                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                        <Avatar size={110} src={preview} icon={<UserOutlined />} />
                        <div style={{ marginTop: 12 }}>
                            <Upload
                                accept="image/*"
                                beforeUpload={handleUploadBefore}
                                showUploadList={false}
                                disabled={avatarUploading}
                            >
                                <Button icon={<UploadOutlined />} loading={avatarUploading}>Thay ảnh</Button>
                            </Upload>

                        </div>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Form.Item name="fullName" label="Họ và tên"
                            rules={[{ required: true, message: "Nhập họ tên" }]}>
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item name="email"
                            label={
                                <Space>
                                    <span>Email</span>
                                    {emailExist ? (
                                        <Tooltip title="Email đã được xác thực">
                                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                                        </Tooltip>
                                    ) : null}
                                </Space>
                            }
                            rules={[
                                { required: !emailExist, message: "Nhập email" },
                                { type: "email", message: "Email không hợp lệ" }
                            ]}>
                            <Input placeholder="example@email.com" disabled={emailExist} />
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
                                { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ" },
                            ]}
                        >
                            <Input placeholder="0987654321" disabled={phoneVerified} />
                        </Form.Item>

                        {!phoneVerified && (
                            <>
                                <Space style={{ marginBottom: 12 }}>
                                    <Button onClick={handleRequestOtp} loading={otpSending} icon={<MessageTwoTone />}>
                                        Gửi OTP
                                    </Button>
                                </Space>

                                {otpRequested && (
                                    <>
                                        <Form.Item name="otpCode" label="Mã OTP" rules={[{ required: true, message: "Nhập mã OTP" }]}>
                                            <Input placeholder="Nhập mã OTP" maxLength={6} />
                                        </Form.Item>
                                        <Button type="primary" onClick={handleVerifyOtp} loading={otpVerifying}>
                                            Xác thực OTP
                                        </Button>
                                    </>
                                )}
                            </>
                        )}



                        <Form.Item name="province" label="Tỉnh/Thành phố">
                            <Select showSearch placeholder="Chọn tỉnh/thành phố">
                                <Option value="Hà Nội">Hà Nội</Option>
                                <Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                                <Option value="Đà Nẵng">Đà Nẵng</Option>
                                <Option value="Hải Phòng">Hải Phòng</Option>
                                <Option value="Cần Thơ">Cần Thơ</Option>
                                {/* Thêm các tỉnh khác nếu cần */}
                            </Select>
                        </Form.Item>

                        <Form.Item name="address" label="Địa chỉ">
                            <Input placeholder="Số nhà, tên đường, phường/xã..." />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ textAlign: "right", marginTop: 16 }}>
                    <Button style={{ marginRight: 8 }} onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </Form>
        </Modal>
        </>
    );
}