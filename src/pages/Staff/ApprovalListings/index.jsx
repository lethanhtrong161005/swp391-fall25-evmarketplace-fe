import React from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Image,
  Descriptions,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useApprovalListings } from "./useApprovalListings";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ApprovalListings() {
  const {
    listings,
    loading,
    selectedListing,
    modalVisible,
    rejectionReason,
    setRejectionReason,
    handleViewDetail,
    handleApprove,
    handleReject,
    handleModalCancel,
    handleConfirmReject,
    fetchListings,
  } = useApprovalListings();

  const columns = [
    {
      title: "Thông tin chính",
      key: "mainInfo",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            width={80}
            height={80}
            src={record.thumbnailUrl}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {record.title}
            </div>
            <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 2 }}>
              ID: {record.id}
            </div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              {record.brand} {record.model}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Phân loại",
      key: "category",
      width: 120,
      render: (_, record) => {
        const getCategoryTag = (categoryId) => {
          switch (categoryId) {
            case 1:
              return { text: "Xe ô tô", color: "blue" };
            case 2:
              return { text: "Xe máy điện", color: "green" };
            case 3:
              return { text: "Xe đạp điện", color: "orange" };
            case 4:
              return { text: "Pin", color: "purple" };
            default:
              return { text: "Khác", color: "default" };
          }
        };
        const categoryTag = getCategoryTag(record.categoryId);
        return <Tag color={categoryTag.color}>{categoryTag.text}</Tag>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          {Number(price).toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 100,
      render: () => <Tag color="orange">Chờ duyệt</Tag>,
    },
    {
      title: "Xác minh",
      key: "verified",
      width: 80,
      render: (_, record) => (
        <Tag color={record.isConsigned ? "green" : "default"}>
          {record.isConsigned ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Ký gửi",
      key: "consigned",
      width: 80,
      render: (_, record) => (
        <Tag color={record.isConsigned ? "blue" : "default"}>
          {record.isConsigned ? "Có" : "Không"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
            style={{
              backgroundColor: "#f5f5f5",
              borderColor: "#d9d9d9",
              color: "#595959",
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => handleApprove(record.id)}
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              color: "#fff",
            }}
          >
            Duyệt
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => handleReject(record.id)}
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
            }}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý duyệt bài
            </Title>
            <Text type="secondary">
              Duyệt các tin đăng có trạng thái PENDING
            </Text>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchListings}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={listings}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tin đăng`,
          }}
        />
      </Card>

      {/* Modal chi tiết tin đăng */}
      <Modal
        title="Chi tiết tin đăng"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        {selectedListing && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Image
                  width="100%"
                  src={selectedListing.thumbnailUrl}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              </Col>
              <Col span={12}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="ID">
                    {selectedListing.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiêu đề">
                    {selectedListing.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thương hiệu">
                    {selectedListing.brand}
                  </Descriptions.Item>
                  <Descriptions.Item label="Model">
                    {selectedListing.model}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm">
                    {selectedListing.year}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    {Number(selectedListing.price).toLocaleString("vi-VN")} đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Người đăng">
                    {selectedListing.sellerName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tỉnh/Thành">
                    {selectedListing.province}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {new Date(selectedListing.createdAt).toLocaleString(
                      "vi-VN"
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Modal từ chối với lý do */}
      <Modal
        title="Từ chối tin đăng"
        open={rejectionReason !== null}
        onOk={handleConfirmReject}
        onCancel={() => setRejectionReason(null)}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
      >
        <TextArea
          placeholder="Nhập lý do từ chối tin đăng..."
          value={rejectionReason || ""}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
}
