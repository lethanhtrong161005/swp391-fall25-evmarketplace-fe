import React from "react";
import { Card, Row, Col, Typography, Tag, Statistic, Progress } from "antd";
import dayjs from "dayjs";
import s from "./styles.module.scss";
import { STAFF_ORDER_STATUS_LABELS } from "../../../utils/constants";

const { Title, Text } = Typography;

const STATUS_COLOR = {
  INITIATED: "default",
  PENDING_PAYMENT: "processing",
  PAID: "success",
  CONTRACT_SIGNED: "purple",
  COMPLETED: "green",
  CANCELED: "red",
  PAYMENT_FAILED: "red",
};

const toVnd = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : n;

export default function Summary({ order, onCopyOrderNo }) {
  const pctRaw =
    order?.paymentProcessPercent ??
    (order?.amount ? (order.paidAmount / order.amount) * 100 : 0);
  const pct = Math.min(100, Math.max(0, Math.round(pctRaw)));

  return (
    <div className={s.root}>
      <Row gutter={[16, 8]} align="middle">
        <Col flex="auto">
          <Title level={4} className={s.title}>
            {order.orderNo}
          </Title>
          <Text
            className={s.copy}
            copyable={{ text: String(order.orderNo) }}
            onClick={onCopyOrderNo}
          >
            Order No: <b>{String(order.orderNo)}</b>
          </Text>
        </Col>
        <Col>
          <Tag color={STATUS_COLOR[order.status] || "default"}>
            {STAFF_ORDER_STATUS_LABELS[order.status] || order.status}
          </Tag>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={s.row}>
        <Col xs={24} md={24}>
          <Card title="Tóm tắt đơn hàng">
            <Statistic title="Số tiền" value={toVnd(order.amount)} />
            <Statistic
              title="Đã thanh toán"
              value={toVnd(order.paidAmount)}
              className={s.stat}
            />
            <Progress percent={pct} className={s.progress} />
            {order?.isReservedActive ? (
              <Text type="danger">
                Giữ chỗ đến:{" "}
                {dayjs(order.reservedUntil).format("DD/MM/YYYY HH:mm")}
              </Text>
            ) : null}
            <div className={s.times}>
              <Text type="secondary">
                Tạo lúc: {dayjs(order.createdAt).format("YYYY-MM-DD HH:mm")}
              </Text>
              <br />
              <Text type="secondary">
                Cập nhật: {dayjs(order.updatedAt).format("YYYY-MM-DD HH:mm")}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
