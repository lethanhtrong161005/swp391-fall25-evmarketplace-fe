// ContractEditModal.jsx
import React from "react";
import { Modal, Form, Upload, Typography, Button, Space, Select, DatePicker, Input } from "antd";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import s from "./ContractEditModal.module.scss";
import { STATUS_CHOICES } from "./useContractEditModal";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ContractEditModal = ({
    open,
    submitting,
    initialValues,
    onCancel,
    onSubmit,
    fileList,
    setFileList,
    beforeUpload,
    onPreviewCurrent,
    readOnly,
}) => {
    const [form] = Form.useForm();
    const hasCurrentFile = !!initialValues?.currentFileUrl;

    return (
        <Modal
            title={<div style={{ textAlign: "center", width: "100%" }}>Chỉnh sửa hợp đồng</div>}
            open={open}
            onCancel={onCancel}
            centered
            width={720}
            className={s.centerModal}
            destroyOnHidden
            footer={null}
            styles={{ body: { paddingTop: 8 } }}
            afterOpenChange={(opened) => {
                if (opened) {
                    form.setFieldsValue({
                        status: initialValues?.status,
                        effectiveRange: initialValues?.effectiveRange || [null, null],
                        currentFileUrl: initialValues?.currentFileUrl || "",
                        note: initialValues?.note || "",
                    });
                } else {
                    form.resetFields();
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={{
                    status: initialValues?.status,
                    effectiveRange: initialValues?.effectiveRange || [null, null],
                    note: initialValues?.note || "",
                }}
            >
                {/* 1) File hợp đồng */}
                <Form.Item
                    label="File hợp đồng (PDF)"
                    name="file"
                    tooltip="Tùy chọn - để trống nếu không thay đổi"
                    extra={
                        hasCurrentFile ? (
                            <div className={s.currentFile}>
                                <Text type="secondary">File hiện tại:&nbsp;</Text>
                                <Space size="small" wrap>
                                    <Button size="small" icon={<EyeOutlined />} onClick={() => onPreviewCurrent?.()}>
                                        Xem
                                    </Button>
                                </Space>
                            </div>
                        ) : null
                    }
                >
                    <Upload
                        accept="application/pdf"
                        listType="text"
                        multiple={false}
                        beforeUpload={() => false}
                        disabled={readOnly}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        maxCount={1}
                    >
                        <Button disabled={readOnly} icon={<UploadOutlined />}>Chọn file PDF</Button>
                    </Upload>
                </Form.Item>


                {/* 2) Trạng thái */}
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select options={STATUS_CHOICES} showSearch optionFilterProp="label" placeholder="Chọn trạng thái" disabled={readOnly} />

                </Form.Item>

                {/* 3) Hiệu lực */}
                <Form.Item
                    label="Hiệu lực hợp đồng"
                    name="effectiveRange"
                    rules={[{
                        validator: (_, v) => {
                            if (!v || v.length !== 2) return Promise.resolve();
                            const [from, to] = v;
                            if (from && to && to.isBefore(from)) {
                                return Promise.reject(new Error("Ngày 'đến' phải sau ngày 'từ'"));
                            }
                            return Promise.resolve();
                        },
                    }]}
                >
                    <RangePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" allowEmpty={[true, true]} disabled={readOnly} />

                </Form.Item>

                <Form.Item label="Ghi chú" name="note">
                    <Input.TextArea rows={3} placeholder="Nhập ghi chú (tuỳ chọn)" />
                </Form.Item>

                <Space style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                    <Button onClick={onCancel}>{readOnly ? "Đóng" : "Hủy"}</Button>
                    {!readOnly && (
                        <Button type="primary" onClick={() => form.submit()} loading={submitting}>
                            Lưu thay đổi
                        </Button>
                    )}
                </Space>
            </Form>
        </Modal>
    );
};

export default ContractEditModal;
