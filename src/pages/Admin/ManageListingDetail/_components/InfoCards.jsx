import React from "react";
import { Card, Divider, Space, Tag, Typography } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone, CalendarOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

function YesNo({ value }) {
  return value ? (
    <Tag color="green" style={{ borderRadius: 999, paddingInline: 10 }}>Có</Tag>
  ) : (
    <Tag style={{ borderRadius: 999, paddingInline: 10 }}>Không</Tag>
  );
}

export default function InfoCards({ price, aiPrice, seller = {}, flags = {} }) {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card size="small" title="Giá niêm yết">
        <Title level={3} style={{ margin: 0 }}>{price || "—"}</Title>
        {aiPrice && <Text type="secondary">Gợi ý AI: {aiPrice}</Text>}
      </Card>

      <Card size="small" title="Người bán">
        <div style={{ lineHeight: 1.6 }}>
          <div><Text strong>{seller.name || "—"}</Text></div>
          <div><Text type="secondary">{seller.phone || "—"}</Text></div>
          <div><Text type="secondary">{seller.email || "—"}</Text></div>
        </div>
      </Card>

      <Card size="small" title="Thông tin bài đăng">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Đã xác minh</span>
          {flags.verified ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#bfbfbf" />}
        </div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Ký gửi</span>
          {flags.consigned ? <CheckCircleTwoTone twoToneColor="#1677ff" /> : <CloseCircleTwoTone twoToneColor="#bfbfbf" />}
        </div>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Ngày tạo</span>
          <span><CalendarOutlined /> {flags.createdAt || "—"}</span>
        </div>
      </Card>
    </Space>
  );
}
