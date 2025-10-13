import React from "react";
import { Card, Row, Col } from "antd";
import "./CategoryFilter.scss"

export default function CategoryFilter({ categories, selectedCategory, onSelect }) {
  if (!categories || categories.length === 0) return null;

  return (
    <Card title="Lọc theo danh mục" className="category-filter">
      <Row gutter={[16, 16]} className="category-statistics">
        {categories.map((cat) => (
          <Col key={cat.id} span={24 / categories.length}>
            <Card
              hoverable
              onClick={() => onSelect(cat.id)}
              className={selectedCategory === cat.id ? "selected" : ""}
            >
              <p>{cat.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
