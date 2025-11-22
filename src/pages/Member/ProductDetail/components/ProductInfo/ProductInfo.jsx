// src/pages/Member/ProductDetail/components/ProductInfo/ProductInfo.jsx
import React, { useState } from "react";
import { Typography, Tag, Avatar, Button, Modal, message } from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  CopyOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { toVND, formatMileage } from "../../utils/productFormatters";
import FavoriteButton from "@components/FavoriteButton/FavoriteButton";
import { useAuth } from "@hooks/useAuth";
import UnauthenticatedChatButton from "@components/Chat/UnauthenticatedChatButton/index";
import { getAccountDbId, normalizeUserId } from "@utils/chatUtils";
import { useNavigate } from "react-router-dom";
import "./ProductInfo.styles.scss";

const { Title, Text, Paragraph } = Typography;

export default function ProductInfo({ product, onShowLoginModal }) {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isEmailRevealed, setIsEmailRevealed] = useState(false);
  const { isLoggedIn, user } = useAuth();

  if (!product) return null;

  const seller = product.seller;
  const sellerId = seller?.id || seller?.accountId;
  const sellerIdNum = sellerId
    ? typeof sellerId === "number"
      ? sellerId
      : parseInt(sellerId, 10)
    : null;
  const normalizedSellerId = normalizeUserId(sellerIdNum);
  const currentUserId = getAccountDbId(user);
  const normalizedCurrentUserId = normalizeUserId(currentUserId);
  const isOwner =
    isLoggedIn &&
    normalizedSellerId !== null &&
    normalizedCurrentUserId !== null &&
    normalizedSellerId === normalizedCurrentUserId;

  // Lấy số điện thoại từ seller
  const phoneNumber = seller?.phone || seller?.phoneNumber;

  // Navigate to chat page with seller
  const handleChatClick = () => {
    if (isOwner) {
      message.info("Đây là tin đăng của bạn");
      return;
    }

    if (sellerIdNum) {
      navigate("/chat", { state: { recipientId: sellerIdNum } });
    } else {
      message.error("Không tìm thấy thông tin người bán");
    }
  };

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
        {isOwner ? (
          <Tag color="blue" className="product-info__owner-tag">
            Tin đăng của bạn
          </Tag>
        ) : (
          <FavoriteButton
            listingId={product.id}
            onShowLoginModal={onShowLoginModal}
            className="product-info__save-btn"
          />
        )}
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
      </div>

      {/* Nút liên hệ */}
      <div className="product-info__contact-actions">
        {isLoggedIn ? (
          isOwner ? (
            <Button
              className="product-info__contact-btn product-info__contact-btn--chat"
              icon={<MessageOutlined />}
              disabled
            >
              Bạn đã đăng tin này
            </Button>
          ) : (
            <Button
              className="product-info__contact-btn product-info__contact-btn--chat"
              icon={<MessageOutlined />}
              onClick={handleChatClick}
            >
              Chat
            </Button>
          )
        ) : (
          <UnauthenticatedChatButton
            variant="detail"
            onLoginClick={onShowLoginModal}
          />
        )}

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
                {seller?.addressLine}
              </Text>
            </div>
          </div>
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
