import React from "react";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Input,
  Table,
  Space,
  Tag,
  Statistic,
  Empty,
  Tooltip,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useModeratorApprovalLogic } from "@hooks/useModeratorApprovalLogic";
import { useAuth } from "@hooks/useAuth";
import ReviewModal from "@components/Moderator/ReviewModal";

const { Title, Text } = Typography;
const { Search } = Input;

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const fmtVND = (n) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const fmtDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

const getVisibilityConfig = (visibility) => {
  switch (visibility) {
    case "NORMAL":
      return { color: "blue", text: "Thường" };
    case "BOOSTED":
      return { color: "gold", text: "Nổi bật" };
    default:
      return { color: "default", text: visibility || "—" };
  }
};

export default function ModeratorApprovalListings() {
  const { user } = useAuth();
  const currentModeratorId = user?.id ?? user?.accountId ?? user?.sub ?? null;

  const {
    queueData,
    myLocks,
    loading,
    isDetailLoading,
    isModalVisible,
    reviewingItem,
    isRejecting,
    handleClaim,
    handleCloseModal,
    handleAutoRelease,
    handleEnterRejectMode,
    handleExitRejectMode,
    handleConfirmReject,
    handleApprove,
    handleRelease,
    handleExtend,
    handleSearch,
    handleRefresh,
  } = useModeratorApprovalLogic();

  // Table columns for queue
  const queueColumns = [
    {
      title: "Mã tin",
      dataIndex: "listingId",
      key: "listingId",
      width: 80,
      render: (id) => `#${id}`,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title) => (
        <Text strong style={{ color: "#1890ff" }}>
          {title}
        </Text>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 120,
      render: (category) => (
        <Tag color="blue" className="uniform-category-tag">
          {CATEGORY_LABEL[category] || category}
        </Tag>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <Text strong style={{ color: "#52c41a" }}>
          {fmtVND(price)}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => fmtDate(date),
    },
    {
      title: "Loại tin",
      dataIndex: "visibility",
      key: "visibility",
      width: 100,
      render: (visibility) => {
        const config = getVisibilityConfig(visibility);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      key: "lockStatus",
      width: 120,
      render: (_, record) => {
        if (record.lockedBy !== null) {
          return (
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              Đang duyệt
            </Tag>
          );
        }
        return <Tag color="blue">Chờ duyệt</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => {
        // This logic is now more reliable because the auto-release will clean up stale data
        if (record.lockedBy && record.lockedBy !== currentModeratorId) {
          return (
            <Tooltip
              title={`Đang được duyệt bởi ${
                record.lockedByName || `Mod ID: ${record.lockedBy}`
              }`}
            >
              <Button
                type="primary"
                disabled
                size="small"
                style={{ width: "100%" }}
              >
                Đang duyệt...
              </Button>
            </Tooltip>
          );
        }

        if (record.lockedBy && record.lockedBy === currentModeratorId) {
          return (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClaim(record.listingId);
              }}
              loading={loading}
              style={{ width: "100%" }}
            >
              Tiếp tục duyệt
            </Button>
          );
        }

        return (
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleClaim(record.listingId);
            }}
            loading={loading}
            size="small"
            style={{ width: "100%" }}
          >
            Duyệt
          </Button>
        );
      },
    },
  ];

  // Table columns for my locks
  const myLocksColumns = [
    {
      title: "Mã tin",
      dataIndex: "listingId",
      key: "listingId",
      width: 80,
      render: (id) => `#${id}`,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Loại tin",
      dataIndex: "visibility",
      key: "visibility",
      width: 100,
      render: (visibility) => {
        const config = getVisibilityConfig(visibility);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thời gian còn lại",
      dataIndex: "ttlRemainSec",
      key: "ttlRemainSec",
      width: 140,
      render: (seconds) => (
        <Space direction="vertical" size={2}>
          <Statistic.Timer
            type="countdown"
            value={Date.now() + (seconds || 0) * 1000}
            format="mm:ss"
            onFinish={() => {
              // Refresh data when countdown expires in table
              // The listing will be automatically released by the backend
              handleRefresh();
            }}
            valueStyle={{
              color: (seconds || 0) < 60 ? "#ff4d4f" : "#1890ff",
              fontSize: 14,
            }}
          />
          {(seconds || 0) < 60 && (
            <Text type="danger" style={{ fontSize: 10 }}>
              <WarningOutlined /> Sắp hết hạn
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleClaim(record.listingId);
          }}
          loading={loading}
          size="small"
        >
          Tiếp tục
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý duyệt bài
            </Title>
            <Text type="secondary">
              Duyệt các tin đăng có trạng thái PENDING
            </Text>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="Tìm kiếm theo tiêu đề..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* My Locks Section */}
      {myLocks.length > 0 && (
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              <span>Tiếp tục duyệt ({myLocks.length})</span>
            </Space>
          }
          style={{ marginBottom: 16 }}
          size="small"
        >
          <Table
            rowKey="listingId"
            dataSource={myLocks}
            columns={myLocksColumns}
            pagination={false}
            size="small"
            locale={{
              emptyText: (
                <Empty description="Không có tin đăng nào đang duyệt" />
              ),
            }}
          />
        </Card>
      )}

      {/* Queue Section */}
      <Card title="Hàng đợi duyệt bài">
        <Table
          rowKey="listingId"
          loading={loading}
          dataSource={queueData.items}
          columns={queueColumns}
          pagination={{
            current: queueData.page + 1,
            pageSize: queueData.size,
            total: queueData.total,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tin đăng`,
          }}
          locale={{
            emptyText: <Empty description="Không có tin đăng nào chờ duyệt" />,
          }}
        />
      </Card>

      {/* Review Modal */}
      <ReviewModal
        open={isModalVisible}
        item={reviewingItem}
        isRejecting={isRejecting}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onConfirmReject={handleConfirmReject}
        onEnterRejectMode={handleEnterRejectMode}
        onExitRejectMode={handleExitRejectMode}
        onRelease={handleRelease}
        onExtend={handleExtend}
        onAutoRelease={handleAutoRelease}
        loading={loading}
        isDetailLoading={isDetailLoading}
      />
    </div>
  );
}
