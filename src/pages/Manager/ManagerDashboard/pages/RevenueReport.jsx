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

/**
 * Revenue Report Page - Báo cáo Doanh Thu
 * Phân tích sâu dữ liệu từ API revenue
 */
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
  const consignmentListingRevenueRate = data.consignmentListingRevenueRate || 0;
  const revenueBySource = data.revenueBySource || {};

  // Prepare data for Column Chart - Always show both types
  const columnData = [
    {
      type: "Đăng tin",
      value: revenueBySource.POST || 0,
    },
    {
      type: "Ký gửi",
      value: revenueBySource.CONSIGNMENT || 0,
    },
  ];

  // Debug: Log data to check values
  console.log("Revenue By Source Data:", revenueBySource);
  console.log("Column Data for Chart:", columnData);
  const columnConfig = {
    data: columnData,
    xField: "type",
    yField: "value",
    label: {
      position: "top",
      formatter: (datum) => {
        const val = datum?.value || 0;
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`;
        }
        if (val >= 1000) {
          return `${(val / 1000).toFixed(0)}K`;
        }
        return String(Math.round(val));
      },
      style: {
        fill: "#000",
        opacity: 0.6,
        fontSize: 12,
      },
    },
    color: ({ type }) => {
      return type === "Đăng tin" ? "#1677ff" : "#52c41a";
    },
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    legend: false,
    tooltip: {
      customContent: (title, items) => {
        if (!items || items.length === 0) return "";

        const item = items[0];
        const typeName = item?.data?.type || title || "";
        const revenue = item?.data?.value || 0;
        const formattedRevenue = formatCurrency(revenue, currency);

        return `
          <div style="padding: 12px 16px; background: white; border-radius: 6px; box-shadow: 0 3px 12px rgba(0,0,0,0.18); min-width: 200px; border: 1px solid #e8e8e8;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #262626; font-size: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px;">${typeName}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #8c8c8c; font-size: 13px;">Doanh thu:</span>
              <strong style="color: #1890ff; font-size: 16px; margin-left: 12px; font-weight: 600;">${formattedRevenue}</strong>
            </div>
          </div>
        `;
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          const val = Number(v);
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(0)}M`;
          }
          if (val >= 1000) {
            return `${(val / 1000).toFixed(0)}K`;
          }
          return String(val);
        },
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
              bordered={false}
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
            <Card bordered={false}>
              <Statistic
                title="Trung Bình / Ngày"
                value={formatCurrency(averagePerDay, currency)}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
              <Statistic
                title="TB / Người Dùng"
                value={formatCurrency(averagePerPayingUser, currency)}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
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
            <Card title="Doanh Thu Theo Nguồn" bordered={false}>
              {columnData.length > 0 ? (
                <Column {...columnConfig} height={350} />
              ) : (
                <div
                  style={{
                    height: 350,
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
            <Card title="Tỷ Lệ Ký Gửi" bordered={false}>
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
