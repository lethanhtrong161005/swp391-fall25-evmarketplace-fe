import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Avatar, Button, message, Row, Col } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function UpdateProfileModal({ isOpen = true, initialData = {}, onClose, onUpdated }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(initialData.avatar || initialData.avatarUrl || null);

    useEffect(() => {
        form.setFieldsValue({
            fullName: initialData.fullName || initialData.name,
            email: initialData.email,
            phoneNumber: initialData.phoneNumber || initialData.phone,
            address: initialData.address || initialData.addressLine,
            province: initialData.province,
        });
        setPreview(initialData.avatar || initialData.avatarUrl || null);
    }, [initialData, form]);

    const handleUploadBefore = (file) => {
        const ok = file.type.startsWith("image/");
        if (!ok) {
            message.error("Chỉ chấp nhận ảnh.");
            return Upload.LIST_IGNORE;
        }
        const isLt5 = file.size / 1024 / 1024 < 5;
        if (!isLt5) {
            message.error("Kích thước phải < 5MB.");
            return Upload.LIST_IGNORE;
        }
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
        return false; // prevent auto upload
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // simulate API update or call real update service
            const updated = {
                ...values,
                avatar: preview,
            };
            message.success("Cập nhật thông tin thành công");
            onUpdated && onUpdated(updated);
        } catch (err) {
            message.error("Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Cập nhật thông tin cá nhân"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                <Row gutter={16}>
                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                        <Avatar size={110} src={preview} icon={<UserOutlined />} />
                        <div style={{ marginTop: 12 }}>
                            <Upload accept="image/*" beforeUpload={handleUploadBefore} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Thay ảnh</Button>
                            </Upload>
                        </div>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Nhập họ tên" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Email không hợp lệ" }]}>
                            <Input />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ" }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="province" label="Tỉnh/Thành">
                            <Select showSearch placeholder="Chọn tỉnh">
                                <Option value="Hà Nội">Hà Nội</Option>
                                <Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                                <Option value="Đà Nẵng">Đà Nẵng</Option>
                                {/* thêm các tỉnh nếu cần */}
                            </Select>
                        </Form.Item>

                        <Form.Item name="address" label="Địa chỉ">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ textAlign: "right", marginTop: 16 }}>
                    <Button style={{ marginRight: 8 }} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Lưu
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}