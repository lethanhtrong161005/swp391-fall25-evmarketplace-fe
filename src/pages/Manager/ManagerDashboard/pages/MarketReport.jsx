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

const formatCurrencyLabel = (value) => {
  if (!Number.isFinite(value) || value === 0) return "";
  if (value >= 1_000_000_000) {
    const formatted = (value / 1_000_000_000).toFixed(2).replace(/\.00$/, "");
    return `${formatted} tỷ`;
  }
  if (value >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(2).replace(/\.00$/, "");
    return `${formatted} triệu`;
  }
  if (value >= 1_000) {
    const formatted = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}K`;
  }
  return value.toLocaleString("vi-VN");
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
        // Modern gradient colors for donut chart
        if (type === "Thường") return "l(270) 0:#1890ff 1:#096dd9"; // Blue gradient
        if (type === "Nổi bật") return "l(270) 0:#ff4d4f 1:#cf1322"; // Red gradient
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
      columnWidthRatio: isMobile ? 0.5 : 0.6,
      minColumnWidth: 35,
      maxColumnWidth: 80,
      appendPadding: [20, 20, 40, 20],
      label: {
        position: "top",
        offsetY: 6,
        style: {
          fill: "#fff",
          fontSize: isMobile ? 10 : 12,
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        },
        formatter: (datum) => {
          return datum.value > 0 ? datum.value.toLocaleString("vi-VN") : "";
        },
      },
      color: "l(270) 0:#52c41a 1:#389e0d", // Green gradient
      columnStyle: {
        radius: [10, 10, 0, 0],
        shadowBlur: 6,
        shadowColor: "rgba(82,196,26,0.2)",
      },
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
            fontSize: isMobile ? 10 : 11,
          },
        },
      },
      xAxis: {
        label: {
          autoRotate: false,
          autoHide: false,
          style: {
            fill: "#333",
            fontSize: isMobile ? 11 : 12,
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
    }),
    [categoryData, isMobile]
  );

  // Prepare data for Average Price Column Chart - INCLUDE ALL CATEGORIES
  const avgPriceData = useMemo(
    () =>
      ALL_CATEGORIES.map((key) => {
        const priceValue = Number(avgListingPriceByCategory[key]) || 0;
        return {
          category: CATEGORY_LABELS[key],
          value: priceValue,
          displayValue: formatCurrencyDetailed(priceValue),
          labelValue: formatCurrencyLabel(priceValue),
        };
      }),
    [avgListingPriceByCategory]
  );

  const avgPriceConfig = useMemo(
    () => ({
      data: avgPriceData,
      xField: "category",
      yField: "value",
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
      appendPadding: [20, 10, 40, 20],
      label: {
        position: "top",
        offsetY: 6,
        content: ({ labelValue }) => {
          // Chỉ hiển thị label nếu giá trị > 0 và không phải mobile
          return !isMobile ? labelValue : "";
        },
        style: {
          fill: "#fff",
          fontSize: isMobile ? 10 : 12,
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        },
      },
      color: "l(270) 0:#faad14 1:#d48806", // Orange gradient
      columnStyle: {
        radius: [10, 10, 0, 0],
        shadowBlur: 6,
        shadowColor: "rgba(250,173,20,0.2)",
      },
      xAxis: {
        label: {
          autoRotate: false,
          autoHide: false,
          style: {
            fontSize: isMobile ? 10 : 12,
            fontWeight: 500,
            fill: "#333",
          },
        },
      },
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
          formatter: (v) => formatCurrencyAxis(Number(v)),
          style: {
            fill: "#666",
            fontSize: isMobile ? 10 : 11,
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
      barWidthRatio: 0.6,
      appendPadding: [10, 10, 10, 60],
      label: {
        position: "right",
        offsetX: 8,
        style: {
          fill: "#000",
          opacity: 0.7,
          fontSize: isMobile ? 10 : 11,
          fontWeight: 500,
        },
        formatter: (datum) => {
          return datum.count > 0 ? datum.count.toLocaleString("vi-VN") : "";
        },
      },
      color: "l(90) 0:#1890ff 1:#096dd9", // Blue gradient (horizontal)
      barStyle: {
        radius: [0, 8, 8, 0],
        shadowBlur: 4,
        shadowColor: "rgba(24,144,255,0.2)",
      },
      legend: false,
      xAxis: {
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
            fontSize: isMobile ? 10 : 11,
          },
        },
      },
      yAxis: {
        label: {
          style: {
            fill: "#333",
            fontSize: isMobile ? 11 : 12,
            fontWeight: 500,
          },
        },
      },
      interactions: [{ type: "element-active" }],
      animation: {
        appear: {
          animation: "scale-in-x",
          duration: 800,
        },
      },
    }),
    [topBrandsData, isMobile]
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
      barWidthRatio: 0.6,
      appendPadding: [10, 10, 10, 80],
      label: {
        position: "right",
        offsetX: 8,
        style: {
          fill: "#000",
          opacity: 0.7,
          fontSize: isMobile ? 10 : 11,
          fontWeight: 500,
        },
        formatter: (datum) => {
          return datum.count > 0 ? datum.count.toLocaleString("vi-VN") : "";
        },
      },
      color: "l(90) 0:#52c41a 1:#389e0d", // Green gradient (horizontal)
      barStyle: {
        radius: [0, 8, 8, 0],
        shadowBlur: 4,
        shadowColor: "rgba(82,196,26,0.2)",
      },
      legend: false,
      xAxis: {
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
            fontSize: isMobile ? 10 : 11,
          },
        },
      },
      yAxis: {
        label: {
          style: {
            fill: "#333",
            fontSize: isMobile ? 11 : 12,
            fontWeight: 500,
          },
        },
      },
      interactions: [{ type: "element-active" }],
      animation: {
        appear: {
          animation: "scale-in-x",
          duration: 800,
        },
      },
    }),
    [topModelsData, isMobile]
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
        {/* Row 1: Post Type */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <ChartCard
              title="Loại Tin Đăng"
              height={280}
              hasData={postTypeData.length > 0}
            >
              <Pie {...postTypeConfig} />
            </ChartCard>
          </Col>
        </Row>

        {/* Row 2: Category */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <ChartCard
              title="Số Lượng Theo Danh Mục"
              height={280}
              hasData={categoryData.length > 0}
            >
              <Column {...categoryConfig} />
            </ChartCard>
          </Col>
        </Row>

        {/* Row 3: Avg Price */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <ChartCard
              title="Giá TB Theo Danh Mục"
              height={280}
              hasData={avgPriceData.length > 0}
            >
              <Column {...avgPriceConfig} />
            </ChartCard>
          </Col>
        </Row>

        {/* Row 4: Top Brands */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <ChartCard
              title="Top Thương Hiệu"
              height={350}
              hasData={topBrandsData.length > 0}
            >
              <Bar {...topBrandsConfig} />
            </ChartCard>
          </Col>
        </Row>

        {/* Row 5: Top Models */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
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
