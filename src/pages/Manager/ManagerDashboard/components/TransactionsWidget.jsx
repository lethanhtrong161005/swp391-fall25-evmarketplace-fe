import React from "react";
import { Card, Row, Col, Statistic, Skeleton, Alert, Button, Space, Tooltip } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Area, Column, Pie } from "@ant-design/plots";

const TransactionsWidget = ({ state, vm, onRetry, onExport, formatPercent }) => {
  return (
    <Card title="Transactions" extra={<Button icon={<DownloadOutlined />} onClick={onExport}>Export CSV</Button>}>
      {state.loading ? (
        <Skeleton active />
      ) : state.error ? (
        <Alert type="error" message="Lỗi tải Transactions" description={<Button icon={<ReloadOutlined />} onClick={onRetry}>Retry</Button>} />
      ) : !vm || vm.total === 0 ? (
        <div style={{ height: 220, color: "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>No data</div>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row gutter={16}>
            <Col span={6}><Statistic title="Tổng giao dịch" value={vm.total} /></Col>
            <Col span={6}><Statistic title="Thành công" value={vm.successful} /></Col>
            <Col span={6}><Statistic title="Tỉ lệ thành công" valueRender={() => <Tooltip title={vm.total === 0 ? "No data" : undefined}>{formatPercent(vm.successRate)}</Tooltip>} /></Col>
            <Col span={6}><Statistic title="Failed/Huỷ" value={vm.failed} /></Col>
          </Row>
          <Area height={240} data={vm.tsLong} xField="date" yField="value" seriesField="series" smooth xAxis={{ type: "timeCat" }} tooltip={{ shared: true }} />
          <Row gutter={16}>
            <Col span={12}><Column height={220} data={vm.byTypeArr.map(d => ({ name: d.type, value: d.value, series: "count" }))} xField="name" yField="value" seriesField="series" isGroup /></Col>
            <Col span={12}><Pie height={220} data={vm.byTypeArr.map(d => ({ type: d.type, value: d.value }))} angleField="value" colorField="type" innerRadius={0.64} label={{ type: "inner", offset: "-50%", content: "{percentage}" }} /></Col>
          </Row>
        </Space>
      )}
    </Card>
  );
};

export default TransactionsWidget;


