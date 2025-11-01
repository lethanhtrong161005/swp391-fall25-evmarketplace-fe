import React from "react";
import { Card, Tag, Space, Typography, Tooltip, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const STATUS_COLOR = {
    PENDING: "processing",
    PAID: "success",
    FAILED: "error",
    EXPIRED: "warning",
    CANCELED: "default"
};

const METHOD_COLOR = {
    VNPAY: "blue",
    CASH: "green",
    BANK_TRANSFER: "purple"
};

const PURPOSE_COLOR = {
    ORDER: "geekblue",
    DEPOSIT: "gold",
    REFUND: "magenta"
};

const toVnd = (n) =>
    typeof n === "number" ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : n;

const PaymentItem = ({ p }) => {
    return (
        <Card size="small" bordered>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space wrap>
                    <Tag color={STATUS_COLOR[p.status] || "default"}>{p.status}</Tag>
                    <Tag color={METHOD_COLOR[p.method] || "default"}>{p.method}</Tag>
                    <Tag color={PURPOSE_COLOR[p.purpose] || "default"}>{p.purpose}</Tag>
                    <Text strong>{toVnd(p.amount)}</Text>
                </Space>

                <Space wrap size="small">
                    <Text type="secondary">Order:</Text>
                    <Text code>{p.orderNo}</Text>
                </Space>

                <Space wrap size="small">
                    <Text type="secondary">Provider Txn:</Text>
                    <Text code>{p.providerTxnId || "-"}</Text>
                    {p.providerTxnId && (
                        <Tooltip title="Sao chép mã giao dịch">
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => navigator.clipboard.writeText(p.providerTxnId)}
                            />
                        </Tooltip>
                    )}
                </Space>

                {p.referenceNo && (
                    <Space wrap size="small">
                        <Text type="secondary">Reference:</Text>
                        <Text code>{p.referenceNo}</Text>
                        <Tooltip title="Sao chép mã tham chiếu">
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => navigator.clipboard.writeText(p.referenceNo)}
                            />
                        </Tooltip>
                    </Space>
                )}

                <Space wrap size="small">
                    <Text type="secondary">Người nộp:</Text>
                    <Text>{p.payerName} — {p.payerPhone}</Text>
                </Space>

                <Space wrap size="small">
                    <Text type="secondary">Thời gian:</Text>
                    <Text>
                        Tạo: {dayjs(p.createdAt).format("DD/MM/YYYY HH:mm")}
                        {"  •  "}
                        {p.paidAt ? `Thanh toán: ${dayjs(p.paidAt).format("DD/MM/YYYY HH:mm")}` : "Chưa thanh toán"}
                        {p.expiresAt ? `  •  Hết hạn: ${dayjs(p.expiresAt).format("DD/MM/YYYY HH:mm")}` : ""}
                    </Text>
                </Space>
            </Space>
        </Card>
    );
}

export default PaymentItem;