
import React, { useMemo } from "react";
import s from "./CashCollectModal.module.scss";
import { Modal, Form, InputNumber, Input, Typography, Space, Alert, Button } from "antd";

export default function CashCollectModal({ open, onCancel, order, onSubmit }) {
    const [form] = Form.useForm();

    const remain = useMemo(() => {
        const a = Number(order?.amount || 0);
        const p = Number(order?.paidAmount || 0);
        return Math.max(0, a - p);
    }, [order]);

    const disabled =
        !order ||
        remain <= 0 ||
        ["CANCELED", "COMPLETED", "PAYMENT_FAILED"].includes(order?.status);

    return (
        <Modal
            open={open}
            title={`Thu tiền mặt — ${order?.orderNo || ""}`}
            onCancel={onCancel}
            okText="Xác nhận thu"
            onOk={() => form.submit()}
            okButtonProps={{ disabled }}
            destroyOnHidden
        >
            <div className={s.root}>
                <Space direction="vertical" size="small" className={s.stack}>
                    <Alert
                        type="info"
                        showIcon
                        message="Số tiền còn lại"
                        description={remain.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                        className={s.info}
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        validateTrigger="onChange"
                        onFinish={(v) => onSubmit?.({
                            amountVnd: Number(v.amount),                 // ✅ chỉ gửi amountVnd
                            referenceNo: v.referenceNo?.trim() || undefined,
                            note: v.note?.trim() || undefined,
                        })}
                        initialValues={{ amount: remain, referenceNo: "", note: "" }}
                        className={s.form}
                    >
                        <Form.Item
                            label="Số tiền thu"
                            name="amount"
                            validateTrigger="onChange"
                            rules={[
                                { required: true, message: "Nhập số tiền" },
                                {
                                    validator: (_, val) => {
                                        const n = Number(val);
                                        if (Number.isNaN(n) || n <= 0)
                                            return Promise.reject("Số tiền không hợp lệ");
                                        if (n > remain)
                                            return Promise.reject(`Không được vượt quá ${remain.toLocaleString("vi-VN")} VND còn lại`);
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <InputNumber
                                className={s.fullWidth}
                                min={1}
                                max={remain}
                                step={1000}
                                precision={0}
                                stringMode
                                formatter={(v) => Number(v || 0).toLocaleString("vi-VN")}
                                parser={(v) => (v || "").replace(/[^\d]/g, "")}
                                addonAfter="VND"
                            />
                        </Form.Item>

                        <Form.Item label="Mã phiếu thu (tuỳ chọn)" name="referenceNo">
                            <Input placeholder="VD: PT-000123" />
                        </Form.Item>

                        <Form.Item label="Ghi chú" name="note">
                            <Input.TextArea rows={3} placeholder="Thông tin bổ sung..." />
                        </Form.Item>

                        <div className={s.actions}>
                            <Button onClick={() => form.setFieldsValue({ amount: remain })}>
                                Thu đủ còn lại
                            </Button>
                        </div>
                    </Form>

                    {disabled && (
                        <Typography.Text type="secondary" className={s.disabledNote}>
                            Đơn không thể thu: trạng thái {order?.status} hoặc đã đủ tiền.
                        </Typography.Text>
                    )}
                </Space>
            </div>
        </Modal>
    );
}
