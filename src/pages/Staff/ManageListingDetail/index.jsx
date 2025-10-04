import React from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import s from "./style.module.scss";
import { useManageListingDetail } from "./logic";
import MediaGallery from "./MediaGallery/MediaGallery";
import InfoCards from "./InfoCards/InfoCards";
import StatusHistory from "./StatusHistory/StatusHistory";
import StatusTag from "../ManageListing/StatusTag/StatusTag";

const { Title, Text } = Typography;

export default function ManageListingDetail() {
  const {
    loading,
    listing,
    history,
    metaItems,
    screens,
    fmtVND,
    fmtDate,
    handleBack,
  } = useManageListingDetail();

  return (
    <Space direction="vertical" size={16} className={s.wrapper}>
      <Card>
        <Space align="center" size={12}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết bài đăng
          </Title>
        </Space>
      </Card>

      <Card loading={loading}>
        {!listing ? (
          <Skeleton active />
        ) : (
          <Row gutter={[16, 16]}>
            {/* Bên trái: ảnh + mô tả + thông số */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {/* Header title + status */}
                <div className={s.header}>
                  <div>
                    <Title level={3} style={{ marginBottom: 4 }}>
                      {listing.title || "—"}
                    </Title>
                    <Text type="secondary">
                      Mã tin: #
                      {listing.code || String(listing.id).padStart(6, "0")}
                    </Text>
                  </div>
                  <StatusTag status={listing.status} />
                </div>

                {/* Media */}
                <MediaGallery images={listing.images || []} />

                {/* Mô tả */}
                <Card size="small" title="Mô tả chi tiết">
                  <Text style={{ whiteSpace: "pre-line" }}>
                    {listing.description || "—"}
                  </Text>
                </Card>

                {/* Thông số sản phẩm */}
                <Card size="small" title="Thông số">
                  <Descriptions
                    bordered
                    size={screens.md ? "middle" : "small"}
                    column={screens.lg ? 3 : screens.md ? 2 : 1}
                  >
                    {metaItems.map((it) => (
                      <Descriptions.Item key={it.label} label={it.label}>
                        {it.value}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>

                {/* Lịch sử trạng thái */}
                <StatusHistory items={history} />
              </Space>
            </Col>

            {/* Bên phải: price + người bán + info nhanh */}
            <Col xs={24} lg={8}>
              <InfoCards
                price={fmtVND(listing.price)}
                aiPrice={
                  listing.ai_suggested_price
                    ? fmtVND(listing.ai_suggested_price)
                    : null
                }
                seller={{
                  name: listing.seller_name ?? listing.sellerName,
                  phone: listing.seller_phone ?? listing.sellerPhone,
                  email: listing.seller_email ?? listing.sellerEmail,
                }}
                flags={{
                  verified: !!listing.verified,
                  consigned: !!listing.is_consigned,
                  createdAt: fmtDate(listing.created_at),
                }}
              />
            </Col>
          </Row>
        )}
      </Card>
    </Space>
  );
}
