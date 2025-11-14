import React, { useMemo } from "react";
import s from "./PaymentModal.module.scss";
import { Modal, Form, InputNumber, Alert, Button, Typography, Space } from "antd";

const MAX_VNPAY_AMOUNT = 100000000; // 100 triệu VND - giới hạn VNPay NCB

export default function PaymentModal({ open, onCancel, order, onSubmit }) {
    const [form] = Form.useForm();

    const remain = useMemo(() => {
        const a = Number(order?.amount || 0);
        const p = Number(order?.paidAmount || 0);
        return Math.max(0, a - p);
    }, [order]);

    // Số tiền tối đa có thể thanh toán: min(số tiền còn lại, 100 triệu)
    const maxAmount = Math.min(remain, MAX_VNPAY_AMOUNT);
    
    const disabled = !order || remain <= 0 || ["CANCELED", "COMPLETED"].includes(order?.status);

    return (
        <Modal
            open={open}
            title={`Thanh toán — ${order?.orderNo || ""}`}
            onCancel={onCancel}
            okText="Xác nhận thanh toán"
            onOk={() => form.submit()}
            okButtonProps={{ disabled }}
            destroyOnHidden
        >
            <div className={s.root}>
                <Space direction="vertical" size="small" className={s.stack}>
                    <Alert
                        type="info"
                        showIcon
                        message="Thông tin thanh toán"
                        description={
                            <Space direction="vertical" size={4}>
                                <Typography.Text>
                                    Số tiền còn lại:{" "}
                                    <Typography.Text strong>
                                        {remain.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </Typography.Text>
                                </Typography.Text>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Giới hạn giao dịch VNPay NCB: 100.000.000 VND/lần
                                </Typography.Text>
                                {remain > MAX_VNPAY_AMOUNT && (
                                    <Alert
                                        type="warning"
                                        message="Số tiền còn lại vượt quá giới hạn VNPay"
                                        description={`Bạn cần thanh toán thành nhiều lần. Lần này tối đa: ${MAX_VNPAY_AMOUNT.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}`}
                                        style={{ marginTop: 8 }}
                                    />
                                )}
                            </Space>
                        }
                        className={s.info}
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={(v) => {
                            const amount = Number(v.amount);
                            onSubmit?.({
                                orderId: order.id,
                                amount,
                            });
                        }}
                        initialValues={{ amount: maxAmount }}
                        className={s.form}
                    >
                        <Form.Item
                            label="Số tiền thanh toán"
                            name="amount"
                            rules={[
                                { required: true, message: "Vui lòng nhập số tiền" },
                                {
                                    validator: (_, val) => {
                                        const n = Number(val);
                                        if (Number.isNaN(n) || n <= 0)
                                            return Promise.reject("Số tiền phải lớn hơn 0");
                                        if (n > remain)
                                            return Promise.reject(
                                                `Số tiền không được lớn hơn số tiền còn lại (${remain.toLocaleString("vi-VN")} VND)`
                                            );
                                        if (n > MAX_VNPAY_AMOUNT)
                                            return Promise.reject(
                                                `Số tiền không được vượt quá giới hạn VNPay (${MAX_VNPAY_AMOUNT.toLocaleString("vi-VN")} VND)`
                                            );
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            extra={
                                <Space direction="vertical" size={2} style={{ fontSize: 12, marginTop: 4 }}>
                                    <Typography.Text type="secondary">
                                        ⚠️ Số tiền không được lớn hơn số tiền còn lại ({remain.toLocaleString("vi-VN")} VND)
                                    </Typography.Text>
                                    <Typography.Text type="secondary">
                                        ⚠️ Số tiền không được vượt quá giới hạn VNPay ({MAX_VNPAY_AMOUNT.toLocaleString("vi-VN")} VND)
                                    </Typography.Text>
                                </Space>
                            }
                        >
                            <InputNumber
                                className={s.fullWidth}
                                min={1}
                                max={maxAmount}
                                step={1000}
                                precision={0}
                                stringMode
                                formatter={(v) => Number(v || 0).toLocaleString("vi-VN")}
                                parser={(v) => (v || "").replace(/[^\d]/g, "")}
                                addonAfter="VND"
                                onChange={(value) => {
                                    const numValue = Number(value || 0);
                                    if (numValue > maxAmount) {
                                        form.setFieldValue("amount", maxAmount);
                                    }
                                }}
                            />
                        </Form.Item>

                        <div className={s.actions}>
                            <Button onClick={() => form.setFieldsValue({ amount: maxAmount })}>
                                Thanh toán tối đa {maxAmount.toLocaleString("vi-VN")} VND
                            </Button>
                            {remain <= MAX_VNPAY_AMOUNT && (
                                <Button onClick={() => form.setFieldsValue({ amount: remain })}>
                                    Thanh toán đủ còn lại
                                </Button>
                            )}
                        </div>
                    </Form>

                    {disabled && (
                        <Typography.Text type="secondary" className={s.disabledNote}>
                            Đơn không thể thanh toán: trạng thái {order?.status} hoặc đã đủ tiền.
                        </Typography.Text>
                    )}
                </Space>
            </div>
        </Modal>
    );
}
