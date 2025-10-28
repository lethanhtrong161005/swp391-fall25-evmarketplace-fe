import React from "react";
import { Card, Row, Col, Avatar, Typography, Tag, Space, Empty } from "antd";
import { CarOutlined } from "@ant-design/icons";
import s from "./styles.module.scss";

const { Title, Text } = Typography;

const toVnd = (n) => typeof n === "number" ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : n;

export default function ProductCard({ listing }) {
    return (
        <Card title="Sản phẩm" className={s.root}>
            {!listing ? (
                <Empty description="Không có thông tin sản phẩm" />
            ) : (
                <Row gutter={16} align="middle">
                    <Col>
                        <Avatar shape="square" size={96} src={listing.thumbnailUrl} icon={<CarOutlined />} className={s.thumb} />
                    </Col>
                    <Col flex="auto">
                        <Title level={5} className={s.title}>{listing.title}</Title>
                        <Space wrap size={[6, 6]}>
                            {listing.categoryName ? <Tag>{listing.categoryName}</Tag> : null}
                            {listing.visibility ? <Tag color="default">{listing.visibility}</Tag> : null}
                            {listing.isConsigned ? <Tag color="cyan">Ký gửi</Tag> : null}
                            {listing.status === "RESERVED" ? <Tag color="orange">Đã giữ chỗ</Tag> : null}
                        </Space>
                        <div className={s.meta}>
                            <Text>{[listing.brand, listing.model, listing.year].filter(Boolean).join(", ")}</Text>
                        </div>
                        <Space direction="vertical" size={2} className={s.specs}>
                            <Text>Giá: <b>{toVnd(listing.price)}</b></Text>
                            <Text>
                                Km: {listing.mileageKm ?? "-"}
                                {" — "}SOH: {listing.sohPercent ?? "-"}%
                                {" — "}Battery: {listing.batteryCapacityKwh ?? "-"} kWh
                                {" — "}Màu: {listing.color ?? "-"}
                            </Text>
                            <Text>Địa chỉ: {[listing.province, listing.district].filter(Boolean).join(", ")}</Text>
                        </Space>
                    </Col>
                </Row>
            )}
        </Card>
    );
}


