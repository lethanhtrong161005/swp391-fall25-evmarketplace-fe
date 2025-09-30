import React, { useMemo, useState, useEffect } from "react";
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
  Badge,
} from "antd";
import productsData from "@/data/productsData";
import "./StaffListingManagement.scss";

const { Search } = Input;

// Màu trạng thái
const statusColors = {
  PENDING: "gold",
  APPROVED: "blue",
  ACTIVE: "green",
  RESERVED: "cyan",
  SOLD: "purple",
  EXPIRED: "volcano",
  REJECTED: "red",
  ARCHIVED: "default",
  UNKNOWN: "default", // cho trường hợp null
};

// Màu visibility
const visibilityColors = {
  NORMAL: "default",
  BOOSTED: "magenta",
};

// 🔹 Map nhãn hiển thị
const statusLabels = {
  PENDING: "Chờ xét duyệt",
  APPROVED: "Đã kiểm duyệt",
  ACTIVE: "Đã đăng",
  REJECTED: "Từ chối",
  UNKNOWN: "Chưa xác định",
};

const visibilityLabels = {
  NORMAL: "Tin miễn phí",
  BOOSTED: "Tin trả phí",
};

const STORAGE_KEY = "staffListings";

const StaffListingManagement = () => {
  // 🔹 Load data từ localStorage
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : productsData;
  });
  const [filterStatus, setFilterStatus] = useState("PENDING"); 
  const [filterVisibility, setFilterVisibility] = useState("NORMAL"); 
  const [filterType, setFilterType] = useState("all"); 
  const [searchText, setSearchText] = useState(""); 

  // 🔹 Cập nhật localStorage mỗi khi listings thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  // 🔹 Convert productData -> dataSource cho Table
  const dataSource = useMemo(() => {
    return listings
      .filter(
        (p) =>
          (p.listingExtra?.visibility?.toUpperCase() || "NORMAL") ===
          filterVisibility
      )
      .filter((p) => (p.status || "UNKNOWN") === filterStatus)
      .filter((p) => {
        if (filterType === "all") return true;
        if (filterType === "car") return p.category === "EV_CAR";
        if (filterType === "bike") return p.category === "E_MOTORBIKE";
        if (filterType === "ebike") return p.category === "E_BIKE";
        if (filterType === "battery") return p.category === "BATTERY";
        return true;
      })
      .filter((p) => {
        if (!searchText) return true;
        const keyword = searchText.toLowerCase();
        return (
          p.title?.toLowerCase().includes(keyword) ||
          p.seller?.phone?.toLowerCase().includes(keyword)
        );
      })
      .map((p) => ({
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
        visibility: p.listingExtra?.visibility?.toUpperCase() || "NORMAL",
        status: p.status || "UNKNOWN",
        date: new Date(p.createdAt).toLocaleString("vi-VN"),
      }));
  }, [listings, filterStatus, filterVisibility, filterType, searchText]);

  // 🔹 Thống kê động theo status tùy visibility
  const statsByVisibility = useMemo(() => {
    const count = (status) =>
      listings.filter(
        (p) =>
          (p.listingExtra?.visibility?.toUpperCase() || "NORMAL") ===
            filterVisibility && (p.status || "UNKNOWN") === status
      ).length;

    if (filterVisibility === "NORMAL") {
      return {
        PENDING: count("PENDING"),
        ACTIVE: count("ACTIVE"),
        REJECTED: count("REJECTED"),
        UNKNOWN: count("UNKNOWN"),
      };
    }
    if (filterVisibility === "BOOSTED") {
      return {
        PENDING: count("PENDING"),
        APPROVED: count("APPROVED"),
        ACTIVE: count("ACTIVE"),
        REJECTED: count("REJECTED"),
        UNKNOWN: count("UNKNOWN"),
      };
    }
    return {};
  }, [listings, filterVisibility]);

  // 🔹 Thống kê theo visibility (cho badge nút)
  const statsVisibility = useMemo(() => {
    const count = (vis) =>
      listings.filter(
        (p) => (p.listingExtra?.visibility?.toUpperCase() || "NORMAL") === vis
      ).length;

    const pendingCount = (vis) =>
      listings.filter(
        (p) =>
          (p.listingExtra?.visibility?.toUpperCase() || "NORMAL") === vis &&
          p.status === "PENDING"
      ).length;

    return {
      normal: { total: count("NORMAL"), pending: pendingCount("NORMAL") },
      boosted: { total: count("BOOSTED"), pending: pendingCount("BOOSTED") },
    };
  }, [listings]);

  // 🔹 Action handlers
  const updateStatus = (id, newStatus) => {
    setListings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleAccept = (id) => {
    updateStatus(id, "ACTIVE");
    message.success("Bài đăng đã được chuyển sang trạng thái Đã đăng");
  };

  const handleReject = (id) => {
    updateStatus(id, "REJECTED");
    message.error("Bài đăng đã bị từ chối");
  };

  const handleWaitPayment = (id) => {
    updateStatus(id, "APPROVED");
    message.info("Bài đăng đã được kiểm duyệt");
  };

  const handleUndo = (id) => {
    updateStatus(id, "PENDING");
    message.info("Bài đăng đã được hoàn tác trạng thái");
  };

  // 🔹 Cấu hình cột bảng
  const columns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Người bán", dataIndex: "seller", key: "seller" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Loại", dataIndex: "type", key: "type" },
    {
      title: "Loại tin",
      dataIndex: "visibility",
      key: "visibility",
      render: (vis) => (
        <Tag color={visibilityColors[vis] || "default"}>
          {visibilityLabels[vis] || vis}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    { title: "Ngày tạo", dataIndex: "date", key: "date" },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_, record) => {
        const { status, visibility, id } = record;

        if (status === "PENDING" && visibility === "NORMAL") {
          return (
            <Space>
              <Button type="primary" size="small" onClick={() => handleAccept(id)}>
                Chấp nhận
              </Button>
              <Button danger size="small" onClick={() => handleReject(id)}>
                Từ chối
              </Button>
            </Space>
          );
        }

        if (status === "PENDING" && visibility === "BOOSTED") {
          return (
            <Space>
              <Button type="primary" size="small" onClick={() => handleWaitPayment(id)}>
                Kiểm duyệt
              </Button>
              <Button danger size="small" onClick={() => handleReject(id)}>
                Từ chối
              </Button>
            </Space>
          );
        }

        if (status === "APPROVED" && visibility === "BOOSTED") {
          return (
            <Space>
              <Button type="primary" size="small" onClick={() => handleAccept(id)}>
                Đăng tin
              </Button>
              <Button danger size="small" onClick={() => handleReject(id)}>
                Từ chối
              </Button>
            </Space>
          );
        }

        if (status === "ACTIVE") {
          return (
            <Space>
              <Button type="dashed" size="small" onClick={() => handleUndo(id)}>
                Hoàn tác
              </Button>
            </Space>
          );
        }

        return null;
      },
    },
  ];

  return (
    <div className="staff-listing">
      {/* Bộ lọc */}
      <Card className="staff-listing__filter">
        <Row gutter={16} align="middle">
          <Col flex="2">
            <Search
              placeholder="Tìm theo tiêu đề hoặc số điện thoại"
              allowClear
              enterButton="Tìm kiếm"
              onSearch={(val) => setSearchText(val)}
            />
          </Col>
          <Col flex="1">
            <Select
              style={{ width: "100%" }}
              placeholder="Loại"
              value={filterType}
              onChange={(val) => setFilterType(val)}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="car">Xe ô tô</Select.Option>
              <Select.Option value="bike">Xe máy</Select.Option>
              <Select.Option value="ebike">Xe đạp</Select.Option>
              <Select.Option value="battery">Pin</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              danger
              onClick={() => {
                setFilterStatus("PENDING");
                setFilterVisibility("NORMAL");
                setFilterType("all");
                setSearchText("");
              }}
            >
              Xóa lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Bộ lọc theo visibility */}
      <div style={{ margin: "16px 0" }}>
        <Space
          size="middle"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <Badge count={statsVisibility.normal.pending} offset={[8, 0]}>
            <Button
              style={{ minWidth: 140 }}
              type={filterVisibility === "NORMAL" ? "primary" : "default"}
              onClick={() => {
                setFilterVisibility("NORMAL");
                setFilterStatus("PENDING");
              }}
            >
              {visibilityLabels.NORMAL}
            </Button>
          </Badge>
          <Badge count={statsVisibility.boosted.pending} offset={[8, 0]}>
            <Button
              style={{ minWidth: 140 }}
              type={filterVisibility === "BOOSTED" ? "primary" : "default"}
              onClick={() => {
                setFilterVisibility("BOOSTED");
                setFilterStatus("PENDING");
              }}
            >
              {visibilityLabels.BOOSTED}
            </Button>
          </Badge>
        </Space>
      </div>

      {/* Thống kê nhanh */}
      <Card className="staff-listing__stats">
        <Space
          size="large"
          wrap
          style={{ width: "100%", justifyContent: "center" }}
        >
          {Object.entries(statsByVisibility).map(([key, value]) => (
            <div
              key={key}
              onClick={() => setFilterStatus(key)}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: 8,
                textDecoration: filterStatus === key ? "underline" : "none",
                fontWeight: filterStatus === key ? 600 : 400,
              }}
            >
              <Statistic title={statusLabels[key] || key} value={value} />
            </div>
          ))}
        </Space>
      </Card>

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
