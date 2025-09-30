import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Row,
  Col,
  Input,
  Button,
  Select,
  Statistic,
  Space,
  message,
} from "antd";
import productsData from "@/data/productsData";
import "./StaffListingManagement.scss";

const { Search } = Input;

const statusColors = {
  "Pending Review": "gold",
  Published: "green",
  Rejected: "red",
  Archived: "default",
};

const StaffListingManagement = () => {
  // Dùng state để quản lý danh sách (có thể cập nhật status khi duyệt)
  const [listings, setListings] = useState(productsData);

  // Convert productData -> dataSource cho Table
  const dataSource = useMemo(() => {
    return listings.map((p) => {
      const normalizedStatus =
        p.status === "ACTIVE" ? "Published" : "Pending Review";
      return {
        key: p.id,
        id: p.id,
        title: p.title,
        seller: p.seller?.fullName || "-",
        phone: p.seller?.phone || "-",
        type:
          p.category === "EV_CAR"
            ? "Xe ô tô"
            : p.category === "E_MOTORBIKE"
            ? "Xe máy"
            : p.category === "E_BIKE"
            ? "Xe đạp"
            : p.category === "BATTERY"
            ? "Pin"
            : "Khác",
        soh: p.sohPercent ? `${p.sohPercent}%` : "-",
        status: p.statusNormalized || normalizedStatus,
        date: new Date(p.createdAt).toLocaleString("vi-VN"),
      };
    });
  }, [listings]);

  // Thống kê động
  const stats = useMemo(() => {
    return {
      pending: dataSource.filter((p) => p.status === "Pending Review").length,
      published: dataSource.filter((p) => p.status === "Published").length,
      rejected: dataSource.filter((p) => p.status === "Rejected").length,
      archived: dataSource.filter((p) => p.status === "Archived").length,
    };
  }, [dataSource]);

  // Xử lý action
  const handleApprove = (id) => {
    setListings((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, statusNormalized: "Published" } : p
      )
    );
    message.success("Bài đăng đã được duyệt");
  };

  const handleReject = (id) => {
    setListings((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, statusNormalized: "Rejected" } : p
      )
    );
    message.error("Bài đăng đã bị từ chối");
  };

  const columns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Người bán", dataIndex: "seller", key: "seller" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Pin & SOH%", dataIndex: "soh", key: "soh" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    { title: "Ngày tạo", dataIndex: "date", key: "date" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleApprove(record.id)}
            disabled={record.status === "Published"}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleReject(record.id)}
            disabled={record.status === "Rejected"}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="staff-listing">
      {/* Bộ lọc */}
      <Card className="staff-listing__filter">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Search placeholder="Từ khóa" allowClear enterButton="Tìm kiếm" />
          </Col>
          <Col span={4}>
            <Input placeholder="SĐT người bán" />
          </Col>
          <Col span={4}>
            <Select style={{ width: "100%" }} placeholder="Trạng thái">
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select style={{ width: "100%" }} placeholder="Loại">
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="car">Xe ô tô</Select.Option>
              <Select.Option value="bike">Xe máy</Select.Option>
              <Select.Option value="ebike">Xe đạp</Select.Option>
              <Select.Option value="battery">Pin</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button danger>Xóa lọc</Button>
          </Col>
        </Row>
      </Card>

      {/* Thống kê nhanh */}
      <Row gutter={16} className="staff-listing__stats">
        <Col>
          <Statistic title="Pending" value={stats.pending} />
        </Col>
        <Col>
          <Statistic title="Published" value={stats.published} />
        </Col>
        <Col>
          <Statistic title="Rejected" value={stats.rejected} />
        </Col>
        <Col>
          <Statistic title="Archived" value={stats.archived} />
        </Col>
      </Row>

      {/* Bảng */}
      <Card className="staff-listing__table">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default StaffListingManagement;
