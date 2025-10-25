import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Spin,
  Empty,
  Typography,
  Avatar,
  Card,
  Row,
  Col,
  Space,
  Tag,
} from "antd";
import {
  HeartOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { toVND } from "@pages/Member/ProductDetail/utils/productFormatters";
import { useFavorites } from "./hooks/useFavorites";
import "./MyFavoritesPage.styles.scss";

const { Title, Text } = Typography;

export default function MyFavoritesPage() {
  const navigate = useNavigate();
  const {
    favorites,
    loading,
    loadingMore,
    hasNext,
    handleLoadMore,
    handleRemoveFavorite,
    isRemoving,
  } = useFavorites();

  const handleItemClick = (listingId) => {
    navigate(`/detail/${listingId}`);
  };

  const handleChatClick = (e, listingId) => {
    e.stopPropagation();
    // TODO: Implement chat functionality
    console.log("Chat with listing:", listingId);
  };

  const handleRemoveClick = (e, listingId) => {
    e.stopPropagation();
    handleRemoveFavorite(listingId);
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__header">
          <Title level={2}>
            <HeartOutlined /> Tin đăng đã lưu ({favorites.length} / 100)
          </Title>
        </div>
        <div className="favorites-page__loading">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      {/* Header */}
      <div className="favorites-page__header">
        <Title level={2}>
          <HeartOutlined /> Tin đăng đã lưu ({favorites.length} / 50)
        </Title>
      </div>

      {/* Content */}
      <div className="favorites-page__content">
        {favorites.length === 0 ? (
          <div className="favorites-page__empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có sản phẩm nào được lưu"
            />
          </div>
        ) : (
          <div className="favorites-list">
            {favorites.map((item) => (
              <Card
                key={item.listingId}
                className="favorite-item"
                hoverable
                onClick={() => handleItemClick(item.listingId)}
                bodyStyle={{ padding: 16 }}
              >
                <Row gutter={16} align="middle">
                  {/* Image Section */}
                  <Col flex="120px">
                    <div className="favorite-item__image-container">
                      <Avatar
                        shape="square"
                        size={120}
                        src={
                          item.thumbnailUrl ||
                          item.imageUrl ||
                          item.image ||
                          item.thumbnail ||
                          item.mainImage ||
                          item.listingImage ||
                          item.photo ||
                          item.picture ||
                          item.avatar
                        }
                        className="favorite-item__image"
                      >
                        {!item.thumbnailUrl &&
                          !item.imageUrl &&
                          !item.image &&
                          !item.thumbnail &&
                          !item.mainImage &&
                          !item.listingImage &&
                          !item.photo &&
                          !item.picture &&
                          !item.avatar && (
                            <div className="favorite-item__placeholder">
                              <EyeOutlined />
                            </div>
                          )}
                      </Avatar>
                      {/* Image counter overlay */}
                      <div className="favorite-item__image-counter">
                        <CameraOutlined />
                        <span>5</span>
                      </div>
                    </div>
                  </Col>

                  {/* Content Section */}
                  <Col flex="auto">
                    <div className="favorite-item__content">
                      {/* Title */}
                      <div className="favorite-item__title-section">
                        <Text strong className="favorite-item__title">
                          {item.title}
                        </Text>
                      </div>

                      {/* Price Section */}
                      <div className="favorite-item__price-section">
                        <Space>
                          <Text strong className="favorite-item__price">
                            {toVND(item.price)}
                          </Text>
                          {item.oldPrice && (
                            <Text delete className="favorite-item__old-price">
                              {toVND(item.oldPrice)}
                            </Text>
                          )}
                        </Space>
                      </div>

                      {/* Meta Information */}
                      <div className="favorite-item__meta">
                        <Space size="small">
                          {item.visibility === "PRIORITY" && (
                            <>
                              <Tag color="gold" icon={<StarOutlined />}>
                                Tin Ưu Tiên
                              </Tag>
                              <Text type="secondary">-</Text>
                            </>
                          )}
                          <ClockCircleOutlined />
                          <Text type="secondary">2 Ngày Trước</Text>
                          <Text type="secondary">-</Text>
                          <EnvironmentOutlined />
                          <Text type="secondary">
                            {item.district && item.province
                              ? `${item.district}, ${item.province}`
                              : item.province ||
                                item.district ||
                                "Không xác định"}
                          </Text>
                        </Space>
                      </div>
                    </div>
                  </Col>

                  {/* Actions Section */}
                  <Col flex="none">
                    <div className="favorite-item__actions">
                      <Button
                        type="default"
                        className="favorite-item__chat-btn"
                        onClick={(e) => handleChatClick(e, item.listingId)}
                      >
                        Chat
                      </Button>
                      <Button
                        danger
                        icon={<HeartOutlined />}
                        className="favorite-item__heart-btn"
                        loading={isRemoving(item.listingId)}
                        onClick={(e) => handleRemoveClick(e, item.listingId)}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasNext && (
          <div className="favorites-page__load-more">
            <Button
              type="primary"
              size="large"
              loading={loadingMore}
              onClick={handleLoadMore}
            >
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
