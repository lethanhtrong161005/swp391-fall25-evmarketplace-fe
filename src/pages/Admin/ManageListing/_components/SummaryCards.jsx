// src/pages/Admin/ManageListing/_components/SummaryCards.jsx
import React from "react";
import { Card, Col, Row, Skeleton, Statistic } from "antd";

export default function SummaryCards({ stats = {}, loading }) {
  const items = [
    { title: "Chờ duyệt", key: "PENDING" },
    { title: "Đã đăng", key: "ACTIVE" },
    { title: "Từ chối", key: "REJECTED" },
    { title: "Đã bán", key: "SOLD" },
    { title: "Lưu trữ", key: "ARCHIVED" },
  ];
  return (
    <Row gutter={12}>
      {items.map((it) => (
        <Col key={it.key} xs={12} md={6} lg={4}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic title={it.title} value={Number(stats[it.key] || 0)} />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
