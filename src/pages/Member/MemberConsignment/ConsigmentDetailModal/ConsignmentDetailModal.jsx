import React, { useRef } from "react";
import {
  Modal,
  Descriptions,
  Button,
  Spin,
  Tag,
  Divider,
  Carousel,
  Image,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../../utils/constants";
import "./ConsignmentDetailModal.scss";

const ConsignmentDetailModal = ({ item, onClose, loading = false }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
  const carouselRef = useRef(null);
  if (!item) return null;

  const mediaList = Array.isArray(item.mediaUrls)
    ? item.mediaUrls
    : item.mediaUrls
    ? item.mediaUrls.split(",")
    : [];

  const renderMediaSlide = () => {
    if (!mediaList || mediaList.length === 0) {
      return (
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
          alt="No image"
          preview={false}
          width="70%"
          height={400}
          style={{
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        />
      );
    }

    return (
      <div className="carousel-wrapper" style={{ position: "relative" }}>
        <Carousel ref={carouselRef} dots={true} style={{ width: "100%" }}>
          {mediaList.map((url, index) => {
            const fileUrl = url?.startsWith("http")
              ? url
              : `${BASE_URL}/upload/consignment/${url}`;
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(fileUrl);
            const isValidUrl =
              fileUrl && !fileUrl.includes("Tomcat") && !fileUrl.includes("Status");

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                {isVideo ? (
                  <video
                    src={fileUrl}
                    controls
                    style={{
                      width: "80%",
                      maxHeight: "400px",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : isValidUrl ? (
                  <Image
                    src={fileUrl}
                    alt={`media-${index}`}
                    width="80%"
                    height={400}
                    style={{
                      objectFit: "contain",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    fallback="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  />
                ) : (
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    alt="Invalid media"
                    preview={false}
                    width="80%"
                    height={400}
                    style={{
                      objectFit: "contain",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </Carousel>

        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={() => carouselRef.current?.prev()}
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.8)",
            border: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
        <Button
          shape="circle"
          icon={<RightOutlined />}
          onClick={() => carouselRef.current?.next()}
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.8)",
            border: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    );
  };

  return (
    <Modal
      title="Chi tiết Ký gửi"
      open={!!item}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Spin spinning={loading}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {renderMediaSlide()}
        </div>

        <Descriptions
          bordered={false}
          column={2}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Mã ký gửi">{item.id}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={CONSIGNMENT_STATUS_COLOR[item.status]}>
              {CONSIGNMENT_STATUS_LABELS[item.status] || item.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tên chủ sở hữu">
            {item.accountName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {item.accountPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Loại sản phẩm">
            {ITEM_TYPE[item.itemType] || item.itemType}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {CATEGORIES[item.category] || item.category}
          </Descriptions.Item>
          <Descriptions.Item label="Hãng">{item.brand}</Descriptions.Item>
          <Descriptions.Item label="Model">{item.model}</Descriptions.Item>
          <Descriptions.Item label="Năm sản xuất">{item.year}</Descriptions.Item>
          <Descriptions.Item label="Dung lượng pin (kWh)">
            {item.batteryCapacityKwh}
          </Descriptions.Item>
          <Descriptions.Item label="SOH (%)">{item.sohPercent}</Descriptions.Item>
          <Descriptions.Item label="Quãng đường (km)">
            {item.mileageKm?.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Chi nhánh ưu tiên">
            {item.preferredBranchName}
          </Descriptions.Item>
          <Descriptions.Item label="Giá mong muốn">
            {item.ownerExpectedPrice?.toLocaleString("vi-VN")} ₫
          </Descriptions.Item>
          {item.rejectedReason && item.status === "REQUEST_REJECTED" && (
            <Descriptions.Item label="Lý do từ chối" span={2}>
              {item.rejectedReason}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Ngày tạo">
            {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 16,
            gap: 10,
          }}
        >
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </Spin>
    </Modal>
  );
};

export default ConsignmentDetailModal;
