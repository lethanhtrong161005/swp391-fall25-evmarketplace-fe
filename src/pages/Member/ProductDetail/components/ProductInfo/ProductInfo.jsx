// src/pages/Member/ProductDetail/components/ProductInfo/ProductInfo.jsx
import React, { useState } from "react";
import {
  Typography,
  Tag,
  Space,
  Avatar,
  Card,
  Button,
  Modal,
  message,
  Row,
  Col,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  CopyOutlined,
  HeartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toVND, formatMileage } from "../../utils/productFormatters";
import {
  CATEGORY_LABELS,
  CATEGORY_TAG_COLORS,
} from "../../utils/productConstants";
import { useProductActions } from "../../hooks/useProductActions";
import "./ProductInfo.styles.scss";

const { Title, Text, Paragraph } = Typography;

export default function ProductInfo({ product }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isEmailRevealed, setIsEmailRevealed] = useState(false);

  // Sử dụng hook cho chức năng yêu thích
  const { isFavorite, isLoading, handleToggleFavorite } =
    useProductActions(product);

  if (!product) return null;

  const seller = product.seller;

  // Lấy số điện thoại từ seller
  const phoneNumber = seller?.phone || seller?.phoneNumber;

  // Removed unused getCategory function

  // Hiển thị thông tin liên hệ khi user click
  const handleShowContact = () => {
    if (phoneNumber) {
      setIsPhoneRevealed(true);
    } else if (seller?.email) {
      setIsEmailRevealed(true);
    } else {
      setShowContactModal(true);
    }
  };

  // Sao chép thông tin liên hệ vào clipboard
  const handleCopyContact = (contact) => {
    navigator.clipboard.writeText(contact);
    message.success("Đã sao chép vào clipboard!");
  };

  // Ẩn một phần số điện thoại để bảo mật
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    if (phone.length <= 4) return phone;
    return phone.slice(0, -4) + "****";
  };

  // Format thời gian đăng
  const formatPostTime = (createdAt) => {
    if (!createdAt) return "Chưa xác định";

    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Đăng ${diffInHours} giờ trước`;
    } else {
      return `Đăng ${postTime.toLocaleDateString("vi-VN")}`;
    }
  };

  return (
    <div className="product-info">
      {/* Header với title và nút Lưu */}
      <div className="product-info__header">
        <Title level={2} className="product-info__title">
          {product.title}
        </Title>
        <Button
          className="product-info__save-btn"
          icon={<HeartOutlined />}
          onClick={handleToggleFavorite}
          loading={isLoading}
          type={isFavorite ? "primary" : "default"}
        >
          {isFavorite ? "Đã lưu" : "Lưu"}
        </Button>
      </div>

      {/* Thông tin chi tiết sản phẩm */}
      <div className="product-info__details">
        <Text className="product-info__detail-text">
          {product.year} • {formatMileage(product.mileageKm)} km
        </Text>
      </div>

      {/* Giá tiền */}
      <div className="product-info__price-section">
        <Title level={1} className="product-info__price">
          {toVND(product.price)}
        </Title>
        {product.listingExtra?.aiSuggestedPrice && (
          <Text className="product-info__installment">
            (Trả góp từ {toVND(product.listingExtra.aiSuggestedPrice / 12)}
            /tháng)
          </Text>
        )}
      </div>

      {/* Nút liên hệ */}
      <div className="product-info__contact-actions">
        <Button
          className="product-info__contact-btn product-info__contact-btn--chat"
          icon={<PhoneOutlined />}
          onClick={() => {
            /* TODO: Implement chat */
          }}
        >
          Chat
        </Button>

        {!isPhoneRevealed && !isEmailRevealed ? (
          <Button
            className="product-info__contact-btn product-info__contact-btn--phone"
            icon={<EyeOutlined />}
            onClick={handleShowContact}
          >
            {phoneNumber
              ? `Hiện số ${formatPhoneNumber(phoneNumber)}`
              : seller?.email
              ? "Hiện email"
              : "Hiện liên hệ"}
          </Button>
        ) : (
          <div className="product-info__revealed-contact">
            {isPhoneRevealed && phoneNumber && (
              <div className="product-info__contact-display">
                <PhoneOutlined className="product-info__contact-icon" />
                <Text className="product-info__contact-text">
                  {phoneNumber}
                </Text>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyContact(phoneNumber)}
                  className="product-info__copy-btn"
                />
              </div>
            )}
            {isEmailRevealed && seller?.email && (
              <div className="product-info__contact-display">
                <MailOutlined className="product-info__contact-icon" />
                <Text className="product-info__contact-text">
                  {seller.email}
                </Text>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyContact(seller.email)}
                  className="product-info__copy-btn"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thông tin địa điểm và thời gian */}
      <div className="product-info__meta">
        <div className="product-info__location">
          <EnvironmentOutlined /> {product.city}, {product.province}
        </div>
        <div className="product-info__time">
          <ClockCircleOutlined /> {formatPostTime(product.createdAt)}
        </div>
      </div>

      {/* Thông tin người bán */}
      <div className="product-info__seller-card">
        <div className="product-info__seller-content">
          <Avatar
            src={seller?.avatarUrl}
            size={56}
            className="product-info__seller-avatar"
          />
          <div className="product-info__seller-info">
            <div className="product-info__seller-header">
              <Text strong className="product-info__seller-name">
                {seller?.fullName || "Người bán"}
              </Text>
              {seller?.verified && (
                <CheckCircleOutlined className="product-info__verified-icon" />
              )}
            </div>
            <div className="product-info__seller-location">
              <EnvironmentOutlined className="product-info__seller-location-icon" />
              <Text
                type="secondary"
                className="product-info__seller-location-text"
              >
                {seller?.province}, {seller?.addressLine}
              </Text>
            </div>
            {seller?.rating && (
              <div className="product-info__seller-stats">
                <Text type="secondary" className="product-info__seller-rating">
                  ⭐ {seller.rating} ({seller.reviewCount || 0} đánh giá)
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat nhanh */}
      <div className="product-info__quick-chat">
        <Text className="product-info__quick-chat-label">Chat nhanh:</Text>
        <div className="product-info__quick-chat-buttons">
          <Button size="small" className="product-info__quick-chat-btn">
            Xe này còn không ạ?
          </Button>
          <Button size="small" className="product-info__quick-chat-btn">
            Xe chính chủ hay đư...
          </Button>
        </div>
      </div>

      {/* Modal hiển thị khi không có thông tin liên hệ */}
      <Modal
        title="Thông tin liên hệ"
        open={showContactModal}
        onCancel={() => setShowContactModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowContactModal(false)}>
            Đóng
          </Button>,
        ]}
      >
        <div className="product-info__contact-details">
          <Text type="secondary">Không có thông tin liên hệ</Text>
        </div>
      </Modal>
    </div>
  );
}
