import React from "react";
import { Card, Divider, Space, Typography } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CalendarOutlined,
} from "@ant-design/icons";
import s from "./InfoCards.module.scss";
import { useInfoCards } from "./logic";

const { Text, Title } = Typography;

export default function InfoCards({ price, aiPrice, seller = {}, flags = {} }) {
  const { formatSeller } = useInfoCards();

  return (
    <Space direction="vertical" size={16} className={s.container}>
      <Card size="small" title="Giá niêm yết">
        <Title level={3} style={{ margin: 0 }}>
          {price || "—"}
        </Title>
        {aiPrice && <Text type="secondary">Gợi ý AI: {aiPrice}</Text>}
      </Card>

      <Card size="small" title="Người bán">
        <div className={s.sellerInfo}>
          <div>
            <Text strong>{formatSeller.name(seller)}</Text>
          </div>
          <div>
            <Text type="secondary">{formatSeller.phone(seller)}</Text>
          </div>
          <div>
            <Text type="secondary">{formatSeller.email(seller)}</Text>
          </div>
        </div>
      </Card>

      <Card size="small" title="Thông tin bài đăng">
        <div className={s.infoRow}>
          <span>Đã xác minh</span>
          {flags.verified ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CloseCircleTwoTone twoToneColor="#bfbfbf" />
          )}
        </div>
        <Divider className={s.divider} />
        <div className={s.infoRow}>
          <span>Ký gửi</span>
          {flags.consigned ? (
            <CheckCircleTwoTone twoToneColor="#1677ff" />
          ) : (
            <CloseCircleTwoTone twoToneColor="#bfbfbf" />
          )}
        </div>
        <Divider className={s.divider} />
        <div className={s.infoRow}>
          <span>Ngày tạo</span>
          <span>
            <CalendarOutlined /> {flags.createdAt || "—"}
          </span>
        </div>
      </Card>
    </Space>
  );
}
