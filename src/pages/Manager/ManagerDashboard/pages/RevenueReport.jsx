import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Skeleton,
  Alert,
  Button,
  Space,
} from "antd";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { useResponsive } from "@/utils/responsive";

const RevenueReport = ({
  state,
  onRetry,
  onExport,
  formatCurrency,
  formatPercent,
}) => {
  const { isMobile } = useResponsive();

  if (state.loading) {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Skeleton active />
        <Skeleton active />
      </Space>
    );
  }

  if (state.error) {
    return (
      <Alert
        type="error"
        message="Lỗi tải dữ liệu doanh thu"
        description={
          <Space>
            <span>{state.error}</span>
            <Button icon={<ReloadOutlined />} onClick={onRetry}>
              Thử lại
            </Button>
          </Space>
        }
        showIcon
      />
    );
  }

  if (!state.data) {
    return (
      <div
        style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Không có dữ liệu
      </div>
    );
  }

  const data = state.data;
  const currency = data.currency || "VND";
  const totalRevenue = data.totalRevenue || 0;
  const averagePerDay = data.averagePerDay || 0;
  const averagePerPayingUser = data.averagePerPayingUser || 0;
  const averageTransactionValue = data.averageTransactionValue || 0;
  const consignmentListingRevenueRate = Number.isFinite(data.consignmentListingRevenueRate)
    ? data.consignmentListingRevenueRate
    : 0;
  const revenueBySource = data.revenueBySource || {};

  const columnData = [
    {
      type: "Đăng tin",
      value: Number.isFinite(revenueBySource.POST) ? revenueBySource.POST : 0,
    },
    {
      type: "Ký gửi",
      value: Number.isFinite(revenueBySource.CONSIGNMENT) ? revenueBySource.CONSIGNMENT : 0,
    },
  ];

  const columnConfig = {
    data: columnData,
    xField: "type",
    yField: "value",
    columnWidthRatio: 0.5,
    minColumnWidth: 40,
    maxColumnWidth: 120,
    appendPadding: [20, 20, 40, 20],
    label: {
      position: "top",
      offsetY: 8,
      style: {
        fill: "#fff",
        fontSize: isMobile ? 11 : 13,
        fontWeight: 600,
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      },
      formatter: (datum) => {
        const val = Number(datum.value);
        if (!Number.isFinite(val) || val === 0) return "";
        return `${val.toLocaleString("vi-VN")} VND`;
      },
    },
    color: ({ type }) => {
      // Gradient colors - more vibrant and modern
      return type === "Đăng tin" 
        ? "l(270) 0:#1890ff 1:#096dd9" // Blue gradient
        : "l(270) 0:#52c41a 1:#389e0d"; // Green gradient
    },
    columnStyle: {
      radius: [12, 12, 0, 0],
      shadowBlur: 8,
      shadowColor: "rgba(0,0,0,0.15)",
    },
    legend: false,
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: "#f0f0f0",
            lineDash: [4, 4],
          },
        },
      },
      label: {
        style: {
          fill: "#666",
          fontSize: isMobile ? 11 : 12,
        },
        formatter: (v) => {
          const val = Number(v);
          if (!Number.isFinite(val)) return "0";
          // Format theo VND, rút gọn nếu quá lớn
          if (val >= 1_000_000_000) {
            return `${(val / 1_000_000_000).toFixed(1)} tỷ`;
          }
          if (val >= 1_000_000) {
            return `${(val / 1_000_000).toFixed(1)} triệu`;
          }
          if (val >= 1_000) {
            return `${(val / 1_000).toFixed(1)} nghìn`;
          }
          return val.toLocaleString("vi-VN");
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fill: "#333",
          fontSize: isMobile ? 12 : 13,
          fontWeight: 500,
        },
      },
    },
    interactions: [{ type: "element-active" }],
    animation: {
      appear: {
        animation: "scale-in-y",
        duration: 800,
      },
    },
  };

  return (
    <div>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0, fontSize: isMobile ? 20 : 24 }}>
          Báo Cáo Doanh Thu
        </h2>
        <Button
          icon={<DownloadOutlined />}
          onClick={onExport}
          size={isMobile ? "small" : "middle"}
        >
          {!isMobile && "Xuất CSV"}
        </Button>
      </Space>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {/* Row 1: Total Revenue - Large Card */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              variant="borderless"
              style={{
                background:
                  "linear-gradient(135deg, #52c41a15 0%, #52c41a05 100%)",
                borderLeft: "4px solid #52c41a",
              }}
            >
              <Statistic
                title="Tổng Doanh Thu"
                value={formatCurrency(totalRevenue, currency)}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: isMobile ? 24 : 32,
                  fontWeight: 600,
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Row 2: Average Statistics - Small Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card variant="borderless">
              <Statistic
                title="Trung Bình / Ngày"
                value={formatCurrency(averagePerDay, currency)}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card variant="borderless">
              <Statistic
                title="TB / Người Dùng"
                value={formatCurrency(averagePerPayingUser, currency)}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card variant="borderless">
              <Statistic
                title="TB / Giao Dịch"
                value={formatCurrency(averageTransactionValue, currency)}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Row 3: Revenue by Source - Column Chart */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={16} lg={16}>
            <Card title="Doanh Thu Theo Nguồn" variant="borderless">
              {columnData.length > 0 ? (
                <Column {...columnConfig} height={450} />
              ) : (
                <div
                  style={{
                    height: 450,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  Không có dữ liệu
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card title="Tỷ Lệ Ký Gửi" variant="borderless">
              <div style={{ padding: "20px 0" }}>
                <Statistic
                  value={formatPercent(consignmentListingRevenueRate)}
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: isMobile ? 28 : 36,
                    fontWeight: 600,
                  }}
                />
                <p style={{ marginTop: 16, color: "#666", fontSize: 14 }}>
                  Tỷ lệ doanh thu từ ký gửi so với tổng doanh thu
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default RevenueReport;
