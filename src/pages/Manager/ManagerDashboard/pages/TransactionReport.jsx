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
  Progress,
} from "antd";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Pie } from "@ant-design/plots";
import { useResponsive } from "@/utils/responsive";

/**
 * Transaction Report Page - Báo cáo Giao Dịch
 * Phân tích sâu dữ liệu từ API transaction-counts
 */
const TransactionReport = ({ state, onRetry, onExport, formatPercent }) => {
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
        message="Lỗi tải dữ liệu giao dịch"
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

  // 🔍 DEBUG LOGGING
  console.log("=== TransactionReport DEBUG ===");
  console.log("Raw API Data:", data);

  const totalTransactions = data.totalTransactions || 0;
  const successfulTransactions = data.successfulTransactions || 0;
  const failedOrCancelledTransactions = data.failedOrCancelledTransactions || 0;
  const successRate = Number.isFinite(data.successRate) ? data.successRate : 0;
  const transactionTypeBreakdown = data.transactionTypeBreakdown || {};

  console.log("Parsed Values:", {
    totalTransactions,
    successfulTransactions,
    failedOrCancelledTransactions,
    successRate,
    transactionTypeBreakdown,
  });

  // Prepare data for Donut Chart
  const postCount = transactionTypeBreakdown.POST || 0;
  const consignmentCount = transactionTypeBreakdown.CONSIGNMENT || 0;
  const otherCount = transactionTypeBreakdown.OTHER || 0;

  console.log("Donut Calculation:", {
    postCount,
    consignmentCount,
    otherCount,
  });

  const donutData = [
    {
      type: "Đăng tin",
      value: postCount,
    },
    {
      type: "Ký gửi",
      value: consignmentCount,
    },
  ];

  // Only add "Other" if it exists in API and > 0
  if (otherCount > 0) {
    donutData.push({
      type: "Khác",
      value: otherCount,
    });
  }

  const filteredDonutData = donutData.filter((item) => item.value > 0);

  console.log("Final Donut Data:", filteredDonutData);
  console.log("===============================");

  // Calculate total from breakdown (should equal totalTransactions now)
  const breakdownTotal = filteredDonutData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const donutConfig = {
    data: filteredDonutData,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
        fill: "#fff",
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: {
        content: "Tổng",
        style: {
          fontSize: 14,
        },
      },
      content: {
        content: String(breakdownTotal),
        style: {
          fontSize: 24,
          fontWeight: 600,
        },
      },
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value: datum.value,
        };
      },
    },
    color: ["#1677ff", "#52c41a", "#8c8c8c"],
  };

  // Calculate success rate display values
  const successRatePercent = (successRate * 100).toFixed(2);
  const successRateColor =
    successRate >= 0.7 ? "#52c41a" : successRate >= 0.5 ? "#faad14" : "#ff4d4f";

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
          Báo Cáo Giao Dịch
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
        {/* Row 1: Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
              <Statistic
                title="Tổng Giao Dịch"
                value={totalTransactions}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
              <Statistic
                title="Thành Công"
                value={successfulTransactions}
                valueStyle={{ color: "#52c41a", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card bordered={false}>
              <Statistic
                title="Thất Bại / Huỷ"
                value={failedOrCancelledTransactions}
                valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Row 2: Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card title="Phân Loại Giao Dịch" bordered={false}>
              {filteredDonutData.length > 0 ? (
                <Pie {...donutConfig} height={300} />
              ) : (
                <div
                  style={{
                    height: 300,
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
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card title="Tỷ Lệ Thành Công" bordered={false}>
              <div style={{ padding: "20px 0" }}>
                <Statistic
                  value={successRatePercent}
                  suffix="%"
                  valueStyle={{
                    color: successRateColor,
                    fontSize: 48,
                    fontWeight: 600,
                  }}
                />
                <Progress
                  percent={Number(successRatePercent)}
                  strokeColor={successRateColor}
                  showInfo={false}
                  style={{ marginTop: 20 }}
                />
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  <span>
                    Thành công: <strong>{successfulTransactions}</strong>
                  </span>
                  <span>
                    Thất bại: <strong>{failedOrCancelledTransactions}</strong>
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default TransactionReport;
