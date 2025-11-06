import React from "react";
import { Card, Row, Col, Skeleton, Alert, Button, Space, Tabs, Table } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";

const MarketWidget = ({ state, vm, onRetry, onExport, formatCurrency, currency }) => {
  return (
    <Card title="Market" extra={<Button icon={<DownloadOutlined />} onClick={onExport}>Export CSV</Button>}>
      {state.loading ? (
        <Skeleton active />
      ) : state.error ? (
        <Alert type="error" message="Lỗi tải Market" description={<Button icon={<ReloadOutlined />} onClick={onRetry}>Retry</Button>} />
      ) : !vm ? (
        <div style={{ height: 220, color: "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>No data</div>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row gutter={16}>
            <Col xs={24} md={8}><Pie height={220} data={vm.postType} angleField="value" colorField="type" innerRadius={0.64} label={{ type: "inner", offset: "-50%", content: "{percentage}" }} /></Col>
            <Col xs={24} md={8}><Column height={220} data={vm.countsArr} xField="name" yField="value" seriesField="series" isGroup /></Col>
            <Col xs={24} md={8}><Column height={220} data={vm.avgArr} xField="name" yField="value" seriesField="series" isGroup /></Col>
          </Row>
          <Table
            size="small"
            rowKey={(r) => `${r.brand}-${r.model}`}
            dataSource={vm.brandsRows}
            pagination={{ pageSize: 10 }}
            columns={[
              { title: "Brand", dataIndex: "brand" },
              { title: "Model", dataIndex: "model" },
              { title: "Count", dataIndex: "count" },
              { title: "Avg Price", dataIndex: "avgPrice", render: (v) => formatCurrency(v, currency) },
            ]}
          />
          {vm.priceBuckets?.length ? (
            <Tabs items={[{ key: "hist", label: "Histogram (Price Buckets)", children: (
              <Column height={240} data={vm.priceBuckets.map(p => ({ name: `${p.category}-${p.bucket}`, value: p.value, series: "bucket" }))} xField="name" yField="value" seriesField="series" isGroup />
            ) }]} />
          ) : null}
        </Space>
      )}
    </Card>
  );
};

export default MarketWidget;


