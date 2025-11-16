import React, { useMemo } from "react";
import { Card, Row, Col, Skeleton, Alert, Button, Space } from "antd";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Pie, Column, Bar } from "@ant-design/plots";
import { useResponsive } from "@/utils/responsive";

const CATEGORY_LABELS = {
  BATTERY: "Pin",
  E_BIKE: "Xe đạp điện",
  EV_CAR: "Ô tô điện",
  E_MOTORBIKE: "Xe máy điện",
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS);

const NoDataPlaceholder = React.memo(({ height }) => (
  <div
    style={{
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#999",
    }}
  >
    Không có dữ liệu
  </div>
));

const formatCurrencyAxis = (value) => {
  if (!Number.isFinite(value)) return "0";
  if (value >= 1_000_000_000) {
    const formatted = value / 1_000_000_000;
    return `${
      Number.isInteger(formatted) ? formatted : formatted.toFixed(1)
    } tỷ`;
  }
  if (value >= 1_000_000) {
    const formatted = value / 1_000_000;
    return `${
      Number.isInteger(formatted) ? formatted : formatted.toFixed(1)
    } triệu`;
  }
  if (value >= 1_000) {
    const formatted = value / 1_000;
    return `${
      Number.isInteger(formatted) ? formatted : formatted.toFixed(1)
    } nghìn`;
  }
  return value.toLocaleString("vi-VN");
};

const formatCurrencyDetailed = (value) => {
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0 VND";
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2).replace(/\\.00$/, "")} tỷ VND`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(/\\.00$/, "")} triệu VND`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2).replace(/\\.00$/, "")} nghìn VND`;
  }
  return `${value.toLocaleString("vi-VN")} VND`;
};

const formatCurrencyTooltip = (value) => {
  if (!Number.isFinite(value)) return "0 VND";
  return `${value.toLocaleString("vi-VN")} VND`;
};

const ChartCard = React.memo(({ title, height, hasData, children }) => (
  <Card title={title} variant="borderless">
    {hasData ? children : <NoDataPlaceholder height={height} />}
  </Card>
));

/**
 * Market Report Page - Báo cáo Thị Trường
 * Phân tích sâu dữ liệu từ API market
 */
const MarketReport = ({ state, onRetry, onExport }) => {
  const { isMobile } = useResponsive();

  const isLoading = state.loading;
  const hasError = Boolean(state.error);
  const hasMarketData = Boolean(state.data);

  const data = state.data || {
    currency: "VND",
    postTypeBreakdown: {},
    categoryBreakdown: {},
    topBrands: [],
    topModels: [],
    avgListingPriceByCategory: {},
  };

  const {
    postTypeBreakdown = {},
    categoryBreakdown = {},
    topBrands = [],
    topModels = [],
    avgListingPriceByCategory = {},
  } = data;

  // Prepare data for Post Type Donut Chart
  const postTypeData = useMemo(
    () =>
      [
        {
          type: "Thường",
          value: postTypeBreakdown.NORMAL || 0,
        },
        {
          type: "Nổi bật",
          value: postTypeBreakdown.BOOSTED || 0,
        },
      ].filter((item) => item.value > 0),
    [postTypeBreakdown]
  );

  const postTypeTotal = useMemo(
    () => (postTypeBreakdown.NORMAL || 0) + (postTypeBreakdown.BOOSTED || 0),
    [postTypeBreakdown]
  );

  const postTypeConfig = useMemo(
    () => ({
      data: postTypeData,
      angleField: "value",
      colorField: "type",
      innerRadius: 0.6,
      height: 280,
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
      tooltip: ({ type, value }) => {
        return { type, value };
      },
      interaction: {
        tooltip: {
          render: (e, { items }) => {
            return (
              <React.Fragment>
                {items.map((item) => {
                  const { type, value, color } = item;
                  return (
                    <div
                      key={type}
                      style={{
                        margin: 0,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: color,
                            marginRight: 6,
                          }}
                        ></span>
                        <span>{type}</span>
                      </div>
                      <b>{value}</b>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          },
        },
      },
      annotations: [
        {
          type: "text",
          style: {
            text: `Tổng\n${postTypeTotal}`,
            x: "50%",
            y: "50%",
            textAlign: "center",
            fontSize: 20,
            fontStyle: "bold",
          },
        },
      ],
      color: ({ type }) => {
        if (type === "Thường") return "#1677ff";
        if (type === "Nổi bật") return "#eb2f96";
        return "#8c8c8c";
      },
    }),
    [postTypeData, postTypeTotal]
  );

  // Prepare data for Category Column Chart - INCLUDE ALL CATEGORIES
  const categoryData = useMemo(
    () =>
      ALL_CATEGORIES.map((key) => ({
        category: CATEGORY_LABELS[key],
        value: categoryBreakdown[key] || 0,
      })),
    [categoryBreakdown]
  );

  const categoryConfig = useMemo(
    () => ({
      data: categoryData,
      xField: "category",
      yField: "value",
      height: 280,
      label: {
        position: "top",
        style: {
          fill: "#000",
          opacity: 0.6,
        },
      },
      color: "#52c41a",
      columnStyle: {
        radius: [8, 8, 0, 0],
      },
    }),
    [categoryData]
  );

  // Prepare data for Average Price Column Chart - INCLUDE ALL CATEGORIES
  const avgPriceData = useMemo(
    () =>
      ALL_CATEGORIES.map((key) => ({
        category: CATEGORY_LABELS[key],
        value: Number(avgListingPriceByCategory[key]) || 0,
        displayValue: formatCurrencyDetailed(
          Number(avgListingPriceByCategory[key]) || 0
        ),
      })),
    [avgListingPriceByCategory]
  );

  const avgPriceConfig = useMemo(
    () => ({
      data: avgPriceData,
      xField: "category",
      yField: "value",
      seriesField: "category",
      tooltip: {
        title: "Giá trung bình",
        customContent: (_, items) => {
          if (!items?.length) return "";
          const { data } = items[0];
          return `<div style="padding:8px 12px;font-size:12px">
            <div style="font-weight:600;margin-bottom:6px">${
              data.category
            }</div>
            <div>Giá: <b>${formatCurrencyTooltip(data.value)}</b></div>
          </div>`;
        },
      },
      height: 280,
      appendPadding: isMobile ? [16, 12, 32, 12] : [24, 24, 36, 24],
      columnWidthRatio: isMobile ? 0.55 : 0.65,
      minColumnWidth: 36,
      maxColumnWidth: 60,
      label: isMobile
        ? false
        : {
            position: "top",
            offsetY: 8,
            content: ({ displayValue }) => displayValue,
            style: {
              fill: "#000",
              opacity: 0.7,
              fontWeight: 500,
            },
          },
      color: "#faad14",
      columnStyle: {
        radius: [4, 4, 0, 0],
      },
      xAxis: {
        label: {
          autoRotate: !isMobile,
          autoHide: isMobile,
          style: {
            fontSize: isMobile ? 10 : 12,
            whiteSpace: "nowrap",
          },
        },
      },
      yAxis: {
        label: {
          formatter: (v) => formatCurrencyAxis(Number(v)),
        },
      },
      interactions: [{ type: "element-active" }],
    }),
    [avgPriceData, isMobile]
  );

  // Prepare data for Top Brands Bar Chart
  const topBrandsData = useMemo(
    () =>
      topBrands
        .slice(0, 10)
        .map((item) => ({
          brand: item.name || "N/A",
          count: item.count || 0,
        }))
        .sort((a, b) => b.count - a.count),
    [topBrands]
  );

  const topBrandsConfig = useMemo(
    () => ({
      data: topBrandsData,
      xField: "count",
      yField: "brand",
      height: 350,
      label: {
        position: "right",
        style: {
          fill: "#000",
          opacity: 0.6,
        },
      },
      color: "#1677ff",
      barStyle: {
        radius: [0, 4, 4, 0],
      },
      legend: false,
    }),
    [topBrandsData]
  );

  // Prepare data for Top Models Bar Chart
  const topModelsData = useMemo(
    () =>
      topModels
        .slice(0, 10)
        .map((item) => ({
          model: item.name || "N/A",
          count: item.count || 0,
        }))
        .sort((a, b) => b.count - a.count),
    [topModels]
  );

  const topModelsConfig = useMemo(
    () => ({
      data: topModelsData,
      xField: "count",
      yField: "model",
      height: 350,
      label: {
        position: "right",
        style: {
          fill: "#000",
          opacity: 0.6,
        },
      },
      color: "#52c41a",
      barStyle: {
        radius: [0, 4, 4, 0],
      },
      legend: false,
    }),
    [topModelsData]
  );

  if (isLoading) {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Skeleton active />
        <Skeleton active />
      </Space>
    );
  }

  if (hasError) {
    return (
      <Alert
        type="error"
        message="Lỗi tải dữ liệu thị trường"
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

  if (!hasMarketData) {
    return <NoDataPlaceholder height={400} />;
  }

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
          Báo Cáo Thị Trường
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
        {/* Row 1: Post Type, Category, Avg Price */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <ChartCard
              title="Loại Tin Đăng"
              height={280}
              hasData={postTypeData.length > 0}
            >
              <Pie {...postTypeConfig} />
            </ChartCard>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <ChartCard
              title="Số Lượng Theo Danh Mục"
              height={280}
              hasData={categoryData.length > 0}
            >
              <Column {...categoryConfig} />
            </ChartCard>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <ChartCard
              title="Giá TB Theo Danh Mục"
              height={280}
              hasData={avgPriceData.length > 0}
            >
              <Column {...avgPriceConfig} />
            </ChartCard>
          </Col>
        </Row>

        {/* Row 2: Top Brands and Top Models */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <ChartCard
              title="Top Thương Hiệu"
              height={350}
              hasData={topBrandsData.length > 0}
            >
              <Bar {...topBrandsConfig} />
            </ChartCard>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <ChartCard
              title="Top Model"
              height={350}
              hasData={topModelsData.length > 0}
            >
              <Bar {...topModelsConfig} />
            </ChartCard>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default MarketReport;
