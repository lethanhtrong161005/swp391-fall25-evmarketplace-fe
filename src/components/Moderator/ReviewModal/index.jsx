import React, { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Image,
  Descriptions,
  Button,
  Form,
  Input,
  Statistic,
  Typography,
  Space,
  Card,
  Divider,
  Tabs,
  Carousel,
  Avatar,
  Spin,
  Tag,
  message,
  Grid,
} from "antd";

const { useBreakpoint } = Grid;
import {
  CheckOutlined,
  CloseOutlined,
  UnlockOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PlayCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const STATUS_LABEL = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  ACTIVE: "Đang hiển thị",
  HIDDEN: "Đã ẩn",
  EXPIRED: "Hết hạn",
  DRAFT: "Bản nháp",
};

const getStatusLabel = (status) => {
  return STATUS_LABEL[status] || status;
};

const fmtVND = (n) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const fmtDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

export default function ReviewModal({
  open,
  item,
  isRejecting,
  onClose,
  onApprove,
  onConfirmReject,
  onEnterRejectMode,
  onExitRejectMode,
  onRelease,
  onExtend,
  onAutoRelease,
  loading = false,
  isDetailLoading = false,
}) {
  const [form] = Form.useForm();
  const [rejectReason, setRejectReason] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const screens = useBreakpoint();

  // Reset chỉ số media khi modal mở
  React.useEffect(() => {
    if (open && item?.media?.length > 0) {
      setCurrentMediaIndex(0);
    }
  }, [open, item?.media?.length]);

  if (!item) return null;

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }
    onConfirmReject(rejectReason);
    setRejectReason("");
    form.resetFields();
  };

  const handleCancelReject = () => {
    setRejectReason("");
    form.resetFields();
    onExitRejectMode();
  };

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleConfirmApprove = () => {
    setShowApproveConfirm(false);
    onApprove();
  };

  // Determine modal width based on screen size - reduced by 30%
  const getModalWidth = () => {
    if (!screens.md) return "90%"; // was 95%
    if (!screens.lg) return "80%"; // was 90%
    if (!screens.xl) return "70%"; // was 85%
    return 980; // was 1400, now ~70% of original
  };

  const modalTitle = (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Title level={4} style={{ margin: 0 }}>
        Duyệt tin đăng: {item.listing?.title || item.title}
      </Title>
      {item.ttlRemainSec && (
        <Space direction="vertical" size={4}>
          <Statistic.Timer
            type="countdown"
            value={Date.now() + item.ttlRemainSec * 1000}
            format="mm:ss"
            onFinish={() => {
              // Auto release listing when countdown finishes
              if (onAutoRelease) {
                onAutoRelease();
              } else {
                onClose();
              }
            }}
            valueStyle={{
              color: item.ttlRemainSec < 60 ? "#ff4d4f" : "#1890ff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          />
          {item.ttlRemainSec < 60 && (
            <Text type="danger" style={{ fontSize: 12 }}>
              ⚠️ Sắp hết thời gian duyệt!
            </Text>
          )}
        </Space>
      )}
    </div>
  );

  // Component hiển thị thư viện media
  const renderMediaGallery = () => {
    if (!item.media || item.media.length === 0) {
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

    const currentMedia = item.media[currentMediaIndex];
    const hasNext = currentMediaIndex < item.media.length - 1;
    const hasPrev = currentMediaIndex > 0;

    const handleNext = () => {
      if (hasNext) {
        setCurrentMediaIndex(currentMediaIndex + 1);
      }
    };

    const handlePrev = () => {
      if (hasPrev) {
        setCurrentMediaIndex(currentMediaIndex - 1);
      }
    };

    const handleDotClick = (index) => {
      setCurrentMediaIndex(index);
    };

    return (
      <div style={{ width: "100%" }}>
        {/* Khu vực hiển thị chính */}
        <div
          style={{
            position: "relative",
            height: screens.md ? 350 : 250, // Responsive height
            maxWidth: screens.lg ? 500 : "100%", // Responsive max width
            margin: "0 auto",
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Hiển thị media chính */}
          <div
            style={{
              width: "100%",
              height: screens.md ? 350 : 250, // Responsive height
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            {currentMedia.mediaType === "IMAGE" ? (
              <Image
                src={currentMedia.mediaUrl}
                alt={`Media ${currentMediaIndex + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                preview={true}
              />
            ) : (
              <video
                controls
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
                preload="metadata"
              >
                <source src={currentMedia.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Counter hiển thị vị trí hiện tại */}
          {item.media.length > 1 && (
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
              {currentMediaIndex + 1} / {item.media.length}
            </div>
          )}

          {/* Mũi tên điều hướng */}
          {item.media.length > 1 && (
            <>
              {/* Nút trước */}
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

              {/* Nút tiếp */}
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

        {/* Dots indicator */}
        {item.media.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {item.media.map((_, index) => (
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

        {/* Thumbnail strip */}
        {item.media.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              padding: "6px 0",
              flexWrap: screens.xs ? "wrap" : "nowrap", // Responsive wrapping
            }}
          >
            {item.media.map((media, index) => (
              <div
                key={index}
                onClick={() => handleDotClick(index)}
                style={{
                  width: screens.md ? 40 : 35, // Responsive thumbnail size
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
                {media.mediaType === "IMAGE" ? (
                  <Image
                    src={media.mediaUrl}
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
                      color: "#666",
                      fontSize: 16,
                    }}
                  >
                    📹
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tab 1: Tổng quan & Media
  const renderOverviewTab = () => {
    const listing = item.listing || item;
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Thư viện media */}
        <Card title="Hình ảnh & Video" size="small">
          {renderMediaGallery()}
        </Card>

        {/* Thông tin cơ bản */}
        <Card title="Thông tin cơ bản" size="small">
          <Descriptions
            bordered
            size="small"
            column={screens.md ? 2 : 1} // Responsive columns
            items={[
              {
                key: "title",
                label: "Tiêu đề",
                children: (
                  <Text strong style={{ fontSize: 16 }}>
                    {listing.title}
                  </Text>
                ),
              },
              {
                key: "price",
                label: "Giá bán",
                children: (
                  <Space direction="vertical" size={4}>
                    <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
                      {fmtVND(listing.price)}
                    </Text>
                  </Space>
                ),
              },
              {
                key: "category",
                label: "Danh mục",
                children: (
                  <Tag color="blue">
                    {CATEGORY_LABEL[listing.categoryName] ||
                      listing.categoryName}
                  </Tag>
                ),
              },
              {
                key: "brand",
                label: "Hãng",
                children: listing.brand || "—",
              },
              {
                key: "model",
                label: "Model",
                children: listing.model || "—",
              },
              {
                key: "year",
                label: "Năm sản xuất",
                children: listing.year || "—",
              },
              {
                key: "mileage",
                label: "Số km đã đi",
                children: listing.mileageKm
                  ? `${listing.mileageKm.toLocaleString()} km`
                  : "—",
              },
              {
                key: "soh",
                label: "SOH%",
                children: listing.sohPercent ? `${listing.sohPercent}%` : "—",
              },
              {
                key: "color",
                label: "Màu sắc",
                children: listing.color || "—",
              },
              {
                key: "status",
                label: "Trạng thái",
                children: (
                  <Tag color={listing.status === "PENDING" ? "orange" : listing.status === "APPROVED" ? "green" : "red"}>
                    {getStatusLabel(listing.status)}
                  </Tag>
                ),
              },
              {
                key: "visibility",
                label: "Loại tin",
                children: (() => {
                  const getVisibilityConfig = (vis) => {
                    switch (vis) {
                      case "NORMAL":
                        return { color: "blue", text: "Thường" };
                      case "BOOSTED":
                        return { color: "gold", text: "Nổi bật" };
                      default:
                        return { color: "default", text: vis || "—" };
                    }
                  };
                  const config = getVisibilityConfig(listing.visibility);
                  return <Tag color={config.color}>{config.text}</Tag>;
                })(),
              },
            ]}
          />
        </Card>

        {/* Description */}
        {listing.description && (
          <Card title="Mô tả chi tiết" size="small">
            <div
              style={{
                background: "#f5f5f5",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "4px solid #1890ff",
              }}
            >
              <Text style={{ whiteSpace: "pre-line" }}>
                {listing.description}
              </Text>
            </div>
          </Card>
        )}
      </Space>
    );
  };

  // Tab 2: Thông tin người bán
  const renderSellerTab = () => {
    const seller = item.sellerId;
    if (!seller) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Text type="secondary">Không có thông tin người bán</Text>
        </div>
      );
    }

    return (
      <Card
        title={
          <Space>
            <Avatar src={seller.profile?.avatarUrl} icon={<UserOutlined />} />
            <span>{seller.profile?.fullName || "Người bán"}</span>
          </Space>
        }
        size="small"
      >
        <Descriptions
          bordered
          size="small"
          column={screens.md ? 2 : 1} // Responsive columns
          items={[
            {
              key: "phone",
              label: (
                <Space>
                  <PhoneOutlined />
                  <span>Số điện thoại</span>
                </Space>
              ),
              children: (
                <Space>
                  <Text>{seller.phoneNumber}</Text>
                  {seller.phoneVerified ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <CloseCircleTwoTone twoToneColor="#eb2f96" />
                  )}
                </Space>
              ),
            },
            {
              key: "email",
              label: (
                <Space>
                  <MailOutlined />
                  <span>Email</span>
                </Space>
              ),
              children: (
                <Space>
                  <Text>{seller.email}</Text>
                  {seller.emailVerified ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : (
                    <CloseCircleTwoTone twoToneColor="#eb2f96" />
                  )}
                </Space>
              ),
            },
            {
              key: "address",
              label: (
                <Space>
                  <EnvironmentOutlined />
                  <span>Địa chỉ</span>
                </Space>
              ),
              children: seller.profile?.addressLine || "—",
            },
            {
              key: "province",
              label: "Tỉnh/Thành",
              children: seller.profile?.province || "—",
            },
            {
              key: "createdAt",
              label: "Tham gia từ",
              children: fmtDate(seller.profile?.createdAt),
            },
          ]}
        />
      </Card>
    );
  };

  // Tab 3: Thông số kỹ thuật
  const renderTechnicalTab = () => {
    const productVehicle = item.productVehicle;
    if (!productVehicle) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Text type="secondary">Không có thông số kỹ thuật</Text>
        </div>
      );
    }

    return (
      <Card title="Thông số kỹ thuật" size="small">
        <Descriptions
          bordered
          size="small"
          column={screens.md ? 2 : 1} // Responsive columns
          items={[
            {
              key: "category",
              label: "Loại xe",
              children:
                CATEGORY_LABEL[productVehicle.category] ||
                productVehicle.category,
            },
            {
              key: "brand",
              label: "Hãng",
              children: productVehicle.brand,
            },
            {
              key: "model",
              label: "Model",
              children: productVehicle.model,
            },
            {
              key: "releaseYear",
              label: "Năm ra mắt",
              children: productVehicle.releaseYear,
            },
            {
              key: "batteryCapacity",
              label: "Dung lượng pin (kWh)",
              children: productVehicle.batteryCapacityKwh
                ? `${productVehicle.batteryCapacityKwh} kWh`
                : "—",
            },
            {
              key: "range",
              label: "Tầm hoạt động (km)",
              children: productVehicle.rangeKm
                ? `${productVehicle.rangeKm} km`
                : "—",
            },
            {
              key: "motorPower",
              label: "Công suất động cơ (kW)",
              children: productVehicle.motorPowerKw
                ? `${productVehicle.motorPowerKw} kW`
                : "—",
            },
            {
              key: "acCharging",
              label: "Sạc AC (kW)",
              children: productVehicle.acChargingKw
                ? `${productVehicle.acChargingKw} kW`
                : "—",
            },
            {
              key: "dcCharging",
              label: "Sạc DC (kW)",
              children: productVehicle.dcChargingKw
                ? `${productVehicle.dcChargingKw} kW`
                : "—",
            },
            {
              key: "acConnector",
              label: "Cổng sạc AC",
              children: productVehicle.acConnector || "—",
            },
            {
              key: "dcConnector",
              label: "Cổng sạc DC",
              children: productVehicle.dcConnector || "—",
            },
            {
              key: "status",
              label: "Trạng thái sản phẩm",
              children: (
                <Tag
                  color={productVehicle.status === "ACTIVE" ? "green" : "red"}
                >
                  {productVehicle.status}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    );
  };

  const renderModalContent = () => {
    if (isDetailLoading) {
      return (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Đang tải chi tiết tin đăng...</Text>
          </div>
        </div>
      );
    }

    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Các tab */}
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: "Tổng quan & Hình ảnh",
              children: renderOverviewTab(),
            },
            {
              key: "seller",
              label: "Thông tin Người bán",
              children: renderSellerTab(),
            },
            {
              key: "technical",
              label: "Thông số Kỹ thuật",
              children: renderTechnicalTab(),
            },
          ]}
        />

        {/* Form lý do từ chối */}
        {isRejecting && (
          <Card
            size="small"
            title={
              <Space>
                <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                <span>Lý do từ chối</span>
              </Space>
            }
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="reason"
                rules={[
                  { required: true, message: "Vui lòng nhập lý do từ chối" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập lý do từ chối tin đăng này..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Các nút thao tác */}
        <Card size="small" title="Thao tác">
          {!isRejecting && (
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleApproveClick}
                  loading={loading}
                  block
                  size="large"
                >
                  Đồng ý
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={onEnterRejectMode}
                  loading={loading}
                  block
                  size="large"
                >
                  Từ chối
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  icon={<ClockCircleOutlined />}
                  onClick={onExtend}
                  loading={loading}
                  block
                  size="large"
                >
                  Gia hạn
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  icon={<UnlockOutlined />}
                  onClick={onRelease}
                  loading={loading}
                  block
                  size="large"
                >
                  Thả bài
                </Button>
              </Col>
            </Row>
          )}

          {isRejecting && (
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleRejectSubmit}
                  loading={loading}
                  disabled={!rejectReason.trim()}
                  block
                  size="large"
                >
                  Xác nhận từ chối
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  onClick={handleCancelReject}
                  loading={loading}
                  block
                  size="large"
                >
                  Hủy
                </Button>
              </Col>
            </Row>
          )}
        </Card>
      </Space>
    );
  };

  return (
    <>
      <Modal
        title={modalTitle}
        open={open}
        onCancel={onClose}
        width={getModalWidth()}
        style={{
          top: screens.md ? 24 : 12, // Responsive top margin
          maxHeight: screens.md ? "90vh" : "95vh", // Responsive max height
        }}
        footer={null}
        destroyOnHidden
        maskClosable={false}
        centered={screens.xs} // Center on mobile
      >
        {renderModalContent()}
      </Modal>

      {/* Confirmation modal for approve */}
      <Modal
        open={showApproveConfirm}
        onCancel={() => setShowApproveConfirm(false)}
        onOk={handleConfirmApprove}
        okText="Xác nhận đồng ý"
        cancelText="Hủy"
        title="Xác nhận duyệt tin đăng"
      >
        <p>Bạn có chắc chắn muốn đồng ý duyệt tin đăng này không?</p>
      </Modal>
    </>
  );
}
