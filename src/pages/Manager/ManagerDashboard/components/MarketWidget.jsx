import React from "react";
import { Card, Row, Col, Skeleton, Alert, Button, Space, Tabs, Table } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";

const MarketWidget = ({ state, vm, onRetry, onExport, formatCurrency, currency }) => {
  // Map category names to Vietnamese
  const categoryLabels = {
    battery: "Pin",
    car: "Ô tô",
    bike: "Xe đạp",
    motobike: "Xe máy",
  };

  // Map post type to Vietnamese
  const postTypeLabels = {
    normal: "Thường",
    booster: "Nổi bật",
  };

  // Color mapping for post types
  const postTypeColors = {
    "Thường": "#1677ff", // Xanh dương đậm
    "Nổi bật": "#ff7a00", // Cam vàng
  };

  return (
    <Card title="Xu hướng thị trường" extra={<Button icon={<DownloadOutlined />} onClick={onExport}>Xuất CSV</Button>}>
      {state.loading ? (
        <Skeleton active />
      ) : state.error ? (
        <Alert type="error" message="Lỗi tải dữ liệu thị trường" description={<Button icon={<ReloadOutlined />} onClick={onRetry}>Thử lại</Button>} />
      ) : !vm ? (
        <div style={{ height: 220, color: "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>Không có dữ liệu</div>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Pie 
                height={220} 
                data={vm.postType.map(p => {
                  const total = vm.postType.reduce((sum, item) => sum + (item.value || 0), 0);
                  const percentage = total > 0 ? ((p.value / total) * 100).toFixed(1) : "0";
                  return { 
                    ...p, 
                    type: postTypeLabels[p.type] || p.type,
                    percentage: `${percentage}%`
                  };
                })} 
                angleField="value" 
                colorField="type" 
                color={(type) => postTypeColors[type] || "#8c8c8c"}
                innerRadius={0.64} 
                label={false}
                legend={{
                  position: "bottom",
                  itemName: {
                    style: {
                      fill: "#333"
                    }
                  }
                }}
                tooltip={{
                  fields: ["type", "value", "percentage"],
                  formatter: (datum) => {
                    return {
                      name: datum.type,
                      value: `${datum.value} (${datum.percentage})`
                    };
                  }
                }} 
              />
            </Col>
            <Col xs={24} md={8}>
              <Column 
                height={220} 
                data={vm.countsArr.map(c => ({ ...c, name: categoryLabels[c.name] || c.name, series: "Số lượng" }))} 
                xField="name" 
                yField="value" 
                seriesField="series" 
                isGroup 
              />
            </Col>
            <Col xs={24} md={8}>
              <Column 
                height={220} 
                data={vm.avgArr.map(a => ({ ...a, name: categoryLabels[a.name] || a.name, series: "Giá TB" }))} 
                xField="name" 
                yField="value" 
                seriesField="series" 
                isGroup 
              />
            </Col>
          </Row>
          <Table
            size="small"
            rowKey={(r) => `${r.brand}-${r.model}`}
            dataSource={vm.brandsRows}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            columns={[
              { 
                title: "Thương hiệu", 
                dataIndex: "brand", 
                width: "25%",
                ellipsis: true
              },
              { 
                title: "Mẫu xe", 
                dataIndex: "model", 
                width: "25%",
                ellipsis: true
              },
              { 
                title: "Số lượng", 
                dataIndex: "count", 
                width: "20%",
                align: "center"
              },
              { 
                title: "Giá trung bình", 
                dataIndex: "avgPrice", 
                width: "30%",
                align: "right",
                render: (v) => formatCurrency(v, currency) 
              },
            ]}
          />
          {vm.priceBuckets?.length ? (
            <Tabs items={[{ key: "hist", label: "Phân bố giá (Histogram)", children: (
              <Column height={240} data={vm.priceBuckets.map(p => ({ name: `${categoryLabels[p.category] || p.category}-${p.bucket}`, value: p.value, series: "Số lượng" }))} xField="name" yField="value" seriesField="series" isGroup />
            ) }]} />
          ) : null}
        </Space>
      )}
    </Card>
  );
};

export default MarketWidget;


