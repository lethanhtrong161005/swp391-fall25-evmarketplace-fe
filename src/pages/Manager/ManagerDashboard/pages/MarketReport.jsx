import React from "react";
import { Card, Row, Col, Skeleton, Alert, Button, Space } from "antd";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Pie, Column, Bar } from "@ant-design/plots";
import { useResponsive } from "@/utils/responsive";

/**
 * Market Report Page - Báo cáo Thị Trường
 * Phân tích sâu dữ liệu từ API market
 */
const MarketReport = ({ state, onRetry, onExport, formatCurrency }) => {
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
  const postTypeBreakdown = data.postTypeBreakdown || {};
  const categoryBreakdown = data.categoryBreakdown || {};
  const topBrands = data.topBrands || [];
  const topModels = data.topModels || [];
  const avgListingPriceByCategory = data.avgListingPriceByCategory || {};

  // Prepare data for Post Type Donut Chart
  const postTypeData = [
    {
      type: "Thường",
      value: postTypeBreakdown.NORMAL || 0,
    },
    {
      type: "Nổi bật",
      value: postTypeBreakdown.BOOSTED || 0,
    },
  ].filter((item) => item.value > 0);

  const postTypeConfig = {
    data: postTypeData,
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
    statistic: {
      title: {
        content: "Tổng",
        style: {
          fontSize: 14,
        },
      },
      content: {
        content: String(
          (postTypeBreakdown.NORMAL || 0) + (postTypeBreakdown.BOOSTED || 0)
        ),
        style: {
          fontSize: 20,
          fontWeight: 600,
        },
      },
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      customContent: (title, items) => {
        if (!items || items.length === 0) return null;
        const item = items[0];
        const typeName = item?.data?.type || title;
        const count = item?.data?.value || 0;
        return `
          <div style="padding: 8px 12px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="font-weight: 600; margin-bottom: 4px; color: #262626;">${typeName}</div>
            <div style="color: #595959;">Số lượng: <strong style="color: #1890ff;">${count}</strong></div>
          </div>
        `;
      },
    },
    interactions: [{ type: "element-active" }, { type: "element-highlight" }],
    color: ["#1677ff", "#eb2f96"],
  };

  // Prepare data for Category Column Chart - INCLUDE ALL CATEGORIES
  const categoryLabels = {
    BATTERY: "Pin",
    E_BIKE: "Xe đạp điện",
    EV_CAR: "Ô tô điện",
    E_MOTORBIKE: "Xe máy điện",
  };

  // Ensure all categories are present (even with 0 values)
  const allCategories = Object.keys(categoryLabels);

  const categoryData = allCategories.map((key) => ({
    category: categoryLabels[key],
    value: categoryBreakdown[key] || 0,
  }));

  const categoryConfig = {
    data: categoryData,
    xField: "category",
    yField: "value",
    label: {
      position: "top",
      content: "{value}",
      style: {
        fill: "#000",
        opacity: 0.6,
      },
    },
    color: "#52c41a",
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum?.category || "",
          value: datum?.value || 0,
        };
      },
    },
  };

  // Prepare data for Average Price Column Chart - INCLUDE ALL CATEGORIES
  const avgPriceData = allCategories.map((key) => ({
    category: categoryLabels[key],
    value: parseFloat(avgListingPriceByCategory[key]) || 0,
  }));

  const avgPriceConfig = {
    data: avgPriceData,
    xField: "category",
    yField: "value",
    label: {
      position: "top",
      formatter: (datum) => {
        if (!datum || !datum.value || datum.value === 0) return "";
        const val = datum.value;
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
      },
    },
    color: "#faad14",
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: "Giá TB",
          value: formatCurrency(datum?.value || 0, currency),
        };
      },
    },
  };

  // Prepare data for Top Brands Bar Chart
  const topBrandsData = topBrands.slice(0, 10).map((item) => ({
    brand: item.name || "N/A",
    count: item.count || 0,
  }));

  const topBrandsConfig = {
    data: topBrandsData,
    xField: "count",
    yField: "brand",
    seriesField: "brand",
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
  };

  // Prepare data for Top Models Bar Chart
  const topModelsData = topModels.slice(0, 10).map((item) => ({
    model: item.name || "N/A",
    count: item.count || 0,
  }));

  const topModelsConfig = {
    data: topModelsData,
    xField: "count",
    yField: "model",
    seriesField: "model",
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
            <Card title="Loại Tin Đăng" bordered={false}>
              {postTypeData.length > 0 ? (
                <Pie {...postTypeConfig} height={280} />
              ) : (
                <div
                  style={{
                    height: 280,
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
            <Card title="Số Lượng Theo Danh Mục" bordered={false}>
              {categoryData.length > 0 ? (
                <Column {...categoryConfig} height={280} />
              ) : (
                <div
                  style={{
                    height: 280,
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
            <Card title="Giá TB Theo Danh Mục" bordered={false}>
              {avgPriceData.length > 0 ? (
                <Column {...avgPriceConfig} height={280} />
              ) : (
                <div
                  style={{
                    height: 280,
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
        </Row>

        {/* Row 2: Top Brands and Top Models */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card title="Top Thương Hiệu" bordered={false}>
              {topBrandsData.length > 0 ? (
                <Bar {...topBrandsConfig} height={350} />
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
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card title="Top Model" bordered={false}>
              {topModelsData.length > 0 ? (
                <Bar {...topModelsConfig} height={350} />
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
        </Row>
      </Space>
    </div>
  );
};

export default MarketReport;
