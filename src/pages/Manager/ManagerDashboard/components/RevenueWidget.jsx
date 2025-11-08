import React from "react";
import { Card, Row, Col, Statistic, Skeleton, Alert, Button, Space, Tooltip } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Area, Pie } from "@ant-design/plots";

const RevenueWidget = ({ state, vm, onRetry, onExport, formatCurrency, formatPercent }) => {
  // Map revenue source types to Vietnamese
  const sourceLabels = {
    postListing: "Đăng tin",
    consignment: "Ký gửi",
    other: "Khác",
  };

  // Color mapping for revenue sources
  const sourceColors = {
    "Ký gửi": "#52c41a", // Xanh lá
    "Đăng tin": "#1677ff", // Xanh dương đậm
    "Khác": "#ff4d4f", // Đỏ cam
  };

  return (
    <Card title="Doanh thu" extra={<Button icon={<DownloadOutlined />} onClick={onExport}>Xuất CSV</Button>}>
      {state.loading ? (
        <Skeleton active />
      ) : state.error ? (
        <Alert type="error" message="Lỗi tải dữ liệu doanh thu" description={<Button icon={<ReloadOutlined />} onClick={onRetry}>Thử lại</Button>} />
      ) : !vm || vm.total === 0 ? (
        <div style={{ height: 220, color: "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>Không có dữ liệu</div>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row gutter={16}>
            <Col span={6}><Statistic title="Tổng doanh thu" value={formatCurrency(vm.total, vm.currency)} /></Col>
            <Col span={6}><Statistic title="TB/ngày" value={formatCurrency(vm.avgPerDay, vm.currency)} /></Col>
            <Col span={6}><Statistic title="TB/user giao dịch" value={formatCurrency(vm.avgPerUser, vm.currency)} /></Col>
            <Col span={6}><Statistic title="TB/giao dịch" value={formatCurrency(vm.avgPerTx, vm.currency)} /></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Statistic title="Tỷ lệ Ký gửi / Tổng" valueRender={() => <Tooltip title={vm.total === 0 ? "Không có dữ liệu" : undefined}>{formatPercent(vm.consignmentRatio)}</Tooltip>} /></Col>
          </Row>
          {vm.stackedTs && vm.stackedTs.length > 0 ? (
            <Area 
              height={240} 
              data={vm.stackedTs.map(t => ({ ...t, source: sourceLabels[t.source] || t.source }))} 
              xField="date" 
              yField="value" 
              seriesField="source" 
              color={(source) => sourceColors[source] || "#8c8c8c"}
              isStack 
              smooth 
              xAxis={{ type: "timeCat" }} 
            />
          ) : null}
          <Pie 
            height={240} 
            data={vm.donut.map(d => {
              const total = vm.donut.reduce((sum, item) => sum + (item.value || 0), 0);
              const percentage = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
              return { 
                ...d, 
                type: sourceLabels[d.type] || d.type,
                percentage: `${percentage}%`
              };
            })} 
            angleField="value" 
            colorField="type" 
            color={(type) => sourceColors[type] || "#8c8c8c"}
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
        </Space>
      )}
    </Card>
  );
};

export default RevenueWidget;


