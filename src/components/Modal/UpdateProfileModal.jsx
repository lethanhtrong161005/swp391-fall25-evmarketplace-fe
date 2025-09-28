import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Avatar, Button, message, Row, Col, Space, Tooltip } from "antd";
import { ExclamationCircleTwoTone, CheckCircleTwoTone, UploadOutlined, UserOutlined, MessageTwoTone } from "@ant-design/icons";
import useUpdateProfileModal from "@/hooks/useUpdateProfileModal";

const { Option } = Select;

export default function UpdateProfileModal({ isOpen = true, initialData = {}, onClose, onUpdated }) {
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
        initForm,
        handleUploadBefore,
        handleRequestOtp,
        handleVerifyOtp,
        onFinish,
    } = useUpdateProfileModal({ initialData, onUpdated, msgApi });

    useEffect(() => {
        if (isOpen) {
            initForm(form);
        }
    }, [initForm, form, isOpen]);

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
                                    <Button onClick={() => handleRequestOtp(form)} loading={otpSending} icon={<MessageTwoTone />}>
                                        Gửi OTP
                                    </Button>
                                </Space>

                                {otpRequested && (
                                    <>
                                        <Form.Item name="otpCode" label="Mã OTP" rules={[{ required: true, message: "Nhập mã OTP" }]}>
                                            <Input placeholder="Nhập mã OTP" maxLength={6} />
                                        </Form.Item>
                                        <Button type="primary" onClick={() => handleVerifyOtp(form)} loading={otpVerifying}>
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