import React from "react";
import { Card, Row, Col, Statistic, Skeleton, Alert, Button, Space, Tooltip } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Area, Pie } from "@ant-design/plots";

const RevenueWidget = ({ state, vm, onRetry, onExport, formatCurrency, formatPercent }) => {
  return (
    <Card title="Revenue" extra={<Button icon={<DownloadOutlined />} onClick={onExport}>Export CSV</Button>}>
      {state.loading ? (
        <Skeleton active />
      ) : state.error ? (
        <Alert type="error" message="Lỗi tải Revenue" description={<Button icon={<ReloadOutlined />} onClick={onRetry}>Retry</Button>} />
      ) : !vm || vm.total === 0 ? (
        <div style={{ height: 220, color: "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>No data</div>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row gutter={16}>
            <Col span={6}><Statistic title="Tổng doanh thu" value={formatCurrency(vm.total, vm.currency)} /></Col>
            <Col span={6}><Statistic title="TB/ngày" value={formatCurrency(vm.avgPerDay, vm.currency)} /></Col>
            <Col span={6}><Statistic title="TB/user giao dịch" value={formatCurrency(vm.avgPerUser, vm.currency)} /></Col>
            <Col span={6}><Statistic title="TB/giao dịch" value={formatCurrency(vm.avgPerTx, vm.currency)} /></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Statistic title="Consignment / Total" valueRender={() => <Tooltip title={vm.total === 0 ? "No data" : undefined}>{formatPercent(vm.consignmentRatio)}</Tooltip>} /></Col>
          </Row>
          <Area height={240} data={vm.stackedTs} xField="date" yField="value" seriesField="source" isStack smooth xAxis={{ type: "timeCat" }} />
          <Pie height={240} data={vm.donut} angleField="value" colorField="type" innerRadius={0.64} label={{ type: "inner", offset: "-50%", content: "{percentage}" }} />
        </Space>
      )}
    </Card>
  );
};

export default RevenueWidget;


