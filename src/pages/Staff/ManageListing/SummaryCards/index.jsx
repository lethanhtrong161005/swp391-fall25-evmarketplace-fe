import React from "react";
import { Card, Col, Row, Skeleton, Statistic } from "antd";
import s from "./SummaryCards.module.scss";
import { useSummaryCards } from "./logic";

export default function SummaryCards({ stats = {}, loading, onQuickFilter }) {
  const { items } = useSummaryCards();

  const handleCardClick = (key) => {
    if (typeof onQuickFilter === "function") {
      onQuickFilter(key);
    }
  };

  return (
    <Row gutter={12} className={s.summaryRow}>
      {items.map((it) => (
        <Col key={it.key} xs={12} md={6} lg={4}>
          <Card
            className={s.summaryCard}
            hoverable
            onClick={() => handleCardClick(it.key)}
            style={{ cursor: "pointer", borderColor: "#1677ff" }}
          >
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
