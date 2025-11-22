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
const TransactionReport = ({ state, onRetry, onExport }) => {
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

  const totalTransactions = data.totalTransactions || 0;
  const successfulTransactions = data.successfulTransactions || 0;
  const failedOrCancelledTransactions = data.failedOrCancelledTransactions || 0;
  const successRate = Number.isFinite(data.successRate) ? data.successRate : 0;
  const transactionType = data.transactionType || {};

  const promotionCount = transactionType.PROMOTION || 0;
  const orderCount = transactionType.ORDER || 0;

  const allDonutData = [
    {
      type: "Đăng tin",
      value: promotionCount,
    },
    {
      type: "Ký gửi",
      value: orderCount,
    },
  ];

  const filteredDonutData = allDonutData.filter((item) => item.value > 0);

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
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "bottom",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: `Tổng\n${breakdownTotal}`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 24,
          fontStyle: "bold",
        },
      },
    ],
    scale: {
      color: {
        domain: ["Đăng tin", "Ký gửi"],
        range: ["#1B2A41", "#808080"],
      },
    },
  };

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
            <Card variant="borderless">
              <Statistic
                title="Tổng Giao Dịch"
                value={totalTransactions}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card variant="borderless">
              <Statistic
                title="Thành Công"
                value={successfulTransactions}
                valueStyle={{ color: "#52c41a", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Card variant="borderless">
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
            <Card title="Phân Loại Giao Dịch" variant="borderless">
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
            <Card title="Tỷ Lệ Thành Công" variant="borderless">
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
