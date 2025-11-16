import React, { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Image,
  Descriptions,
  Button,
  Space,
  Card,
  Tabs,
  Typography,
  Spin,
  Tag,
  Grid,
} from "antd";
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../../utils/constants";
import "./ConsignmentDetailModal.scss";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const fmtVND = (n) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ConsignmentDetailModal = ({ item, onClose, loading = false }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const screens = useBreakpoint();

  React.useEffect(() => {
    if (item && (Array.isArray(item.mediaUrls) || item.mediaUrls)) {
      setCurrentMediaIndex(0);
    }
  }, [item]);

  if (!item) return null;

  const mediaList = Array.isArray(item.mediaUrls)
    ? item.mediaUrls
    : item.mediaUrls
    ? item.mediaUrls.split(",")
    : [];

  const renderMediaGallery = () => {
    if (!mediaList || mediaList.length === 0) {
      return (
        <div
          style={{
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            border: "1px dashed #d9d9d9",
            borderRadius: 8,
          }}
        >
          <Text type="secondary">Không có hình ảnh hoặc video</Text>
        </div>
      );
    }

    const currentMedia = mediaList[currentMediaIndex];
    const hasNext = currentMediaIndex < mediaList.length - 1;
    const hasPrev = currentMediaIndex > 0;

    const handleNext = () => {
      if (hasNext) setCurrentMediaIndex(currentMediaIndex + 1);
    };

    const handlePrev = () => {
      if (hasPrev) setCurrentMediaIndex(currentMediaIndex - 1);
    };

    const handleDotClick = (index) => {
      setCurrentMediaIndex(index);
    };

    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(currentMedia);
    const isValidUrl =
      currentMedia &&
      !currentMedia.includes("Tomcat") &&
      !currentMedia.includes("Status");
    const fileUrl = currentMedia?.startsWith("http")
      ? currentMedia
      : `${BASE_URL}/upload/consignment/${currentMedia}`;

    return (
      <div style={{ width: "100%" }}>

        <div
          style={{
            position: "relative",
            height: screens.md ? 350 : 250,
            maxWidth: screens.lg ? 500 : "100%",
            margin: "0 auto",
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            {isVideo && isValidUrl ? (
              <video
                controls
                src={fileUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
                preload="metadata"
              />
            ) : isValidUrl ? (
              <Image
                src={fileUrl}
                alt={`Media ${currentMediaIndex + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
                fallback="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                preview={true}
              />
            ) : (
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                alt="Invalid media"
                preview={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            )}
          </div>


          {mediaList.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 14,
                fontWeight: "bold",
                zIndex: 10,
              }}
            >
              {currentMediaIndex + 1} / {mediaList.length}
            </div>
          )}


          {mediaList.length > 1 && (
            <>
              {hasPrev && (
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                  }}
                />
              )}

              {hasNext && (
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                  }}
                />
              )}
            </>
          )}
        </div>


        {mediaList.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {mediaList.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor:
                    index === currentMediaIndex ? "#1890ff" : "#d9d9d9",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (index !== currentMediaIndex) {
                    e.target.style.backgroundColor = "#91d5ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentMediaIndex) {
                    e.target.style.backgroundColor = "#d9d9d9";
                  }
                }}
              />
            ))}
          </div>
        )}


        {mediaList.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              padding: "6px 0",
              flexWrap: screens.xs ? "wrap" : "nowrap",
            }}
          >
            {mediaList.map((media, index) => {
              const thumbUrl = media?.startsWith("http")
                ? media
                : `${BASE_URL}/upload/consignment/${media}`;
              const isThumbVideo = /\.(mp4|mov|avi|webm)$/i.test(thumbUrl);
              const isValidThumb =
                thumbUrl &&
                !thumbUrl.includes("Tomcat") &&
                !thumbUrl.includes("Status");

              return (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  style={{
                    width: screens.md ? 40 : 35,
                    height: screens.md ? 40 : 35,
                    borderRadius: 6,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      index === currentMediaIndex
                        ? "2px solid #1890ff"
                        : "2px solid transparent",
                    transition: "all 0.3s ease",
                    opacity: index === currentMediaIndex ? 1 : 0.7,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentMediaIndex) {
                      e.target.style.opacity = "0.7";
                    }
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {isThumbVideo && isValidThumb ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#666",
                        fontSize: 16,
                      }}
                    >
                      📹
                    </div>
                  ) : isValidThumb ? (
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      preview={false}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: 12,
                      }}
                    >
                      ✕
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderOverviewTab = () => {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card title="Hình ảnh & Video" size="small">
          {renderMediaGallery()}
        </Card>

        <Card title="Thông tin cơ bản" size="small">
          <Descriptions
            bordered
            size="small"
            column={screens.md ? 2 : 1}
            items={[
              {
                key: "id",
                label: "Mã ký gửi",
                children: <Text strong>{item.id}</Text>,
              },
              {
                key: "status",
                label: "Trạng thái",
                children: (
                  <Tag color={CONSIGNMENT_STATUS_COLOR[item.status]}>
                    {CONSIGNMENT_STATUS_LABELS[item.status] || item.status}
                  </Tag>
                ),
              },
              {
                key: "itemType",
                label: "Loại sản phẩm",
                children: ITEM_TYPE[item.itemType] || item.itemType,
              },
              {
                key: "category",
                label: "Danh mục",
                children: (
                  <Tag color="blue">
                    {CATEGORIES[item.category] || item.category}
                  </Tag>
                ),
              },
              {
                key: "brand",
                label: "Hãng",
                children: item.brand || "—",
              },
              {
                key: "model",
                label: "Model",
                children: item.model || "—",
              },
              {
                key: "year",
                label: "Năm sản xuất",
                children: item.year || "—",
              },
              {
                key: "batteryCapacity",
                label: "Dung lượng pin (kWh)",
                children: item.batteryCapacityKwh || "—",
              },
              {
                key: "sohPercent",
                label: "SOH (%)",
                children: item.sohPercent ? `${item.sohPercent}%` : "—",
              },
              {
                key: "mileage",
                label: "Quãng đường (km)",
                children: item.mileageKm
                  ? item.mileageKm.toLocaleString()
                  : "—",
              },
              {
                key: "preferredBranch",
                label: "Chi nhánh ưu tiên",
                children: item.preferredBranchName || "—",
              },
              {
                key: "expectedPrice",
                label: "Giá mong muốn",
                children: item.ownerExpectedPrice
                  ? fmtVND(item.ownerExpectedPrice)
                  : "—",
              },
            ]}
          />
        </Card>

        {item.rejectedReason && item.status === "REQUEST_REJECTED" && (
          <Card title="Lý do từ chối" size="small">
            <div
              style={{
                background: "#fff2f0",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "4px solid #ff4d4f",
              }}
            >
              <Text style={{ whiteSpace: "pre-line" }}>
                {item.rejectedReason}
              </Text>
            </div>
          </Card>
        )}
      </Space>
    );
  };

  const renderOwnerTab = () => {
    return (
      <Card title="Thông tin chủ sở hữu" size="small">
        <Descriptions
          bordered
          size="small"
          column={screens.md ? 2 : 1}
          items={[
            {
              key: "name",
              label: "Tên chủ sở hữu",
              children: item.accountName || "—",
            },
            {
              key: "phone",
              label: "Số điện thoại",
              children: item.accountPhone || "—",
            },
          ]}
        />
      </Card>
    );
  };

  const getModalWidth = () => {
    if (!screens.md) return "90%";
    if (!screens.lg) return "80%";
    if (!screens.xl) return "70%";
    return 980;
  };

  const modalTitle = (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Title level={4} style={{ margin: 0 }}>
        Chi tiết Ký gửi:
      </Title>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={!!item}
      onCancel={onClose}
      width={getModalWidth()}
      style={{
        top: screens.md ? 24 : 12,
        maxHeight: screens.md ? "90vh" : "95vh",
      }}
      footer={
        <div style={{ textAlign: "right", gap: 10 }}>
          <Button onClick={onClose}>Đóng</Button>
        </div>
      }
      destroyOnHidden
      maskClosable={false}
      centered={screens.xs}
    >
      <Spin spinning={loading}>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: "Tổng quan & Hình ảnh",
              children: renderOverviewTab(),
            },
            {
              key: "owner",
              label: "Thông tin Chủ sở hữu",
              children: renderOwnerTab(),
            },
          ]}
        />
      </Spin>
    </Modal>
  );
};

export default ConsignmentDetailModal;
