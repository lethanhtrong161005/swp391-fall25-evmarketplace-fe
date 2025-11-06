import React from "react";
import { Card, Row, Col, Statistic, Skeleton, Alert, Button, Space, Tooltip } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Area, Column, Pie } from "@ant-design/plots";

const TransactionsWidget = ({ state, vm, onRetry, onExport, formatPercent }) => {
  // Map transaction types to Vietnamese labels
  const typeLabels = {
    postListing: "Đăng tin",
    consignment: "Ký gửi",
    other: "Khác",
  };

  return (
    <Card title="Số lượng giao dịch" extra={<Button icon={<DownloadOutlined />} onClick={onExport}>Xuất CSV</Button>}>
      {state.loading ? (
        <Skeleton active />
      ) : state.error ? (
        <Alert type="error" message="Lỗi tải dữ liệu giao dịch" description={<Button icon={<ReloadOutlined />} onClick={onRetry}>Thử lại</Button>} />
      ) : !vm || vm.total === 0 ? (
        <div style={{ height: 220, color: "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>Không có dữ liệu</div>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Row gutter={16}>
            <Col span={6}><Statistic title="Tổng giao dịch" value={vm.total} /></Col>
            <Col span={6}><Statistic title="Thành công" value={vm.successful} /></Col>
            <Col span={6}><Statistic title="Tỉ lệ thành công" valueRender={() => <Tooltip title={vm.total === 0 ? "Không có dữ liệu" : undefined}>{formatPercent(vm.successRate)}</Tooltip>} /></Col>
            <Col span={6}><Statistic title="Thất bại/Huỷ" value={vm.failed} /></Col>
          </Row>
          {vm.tsLong && vm.tsLong.length > 0 ? (
            <Area height={240} data={vm.tsLong} xField="date" yField="value" seriesField="series" smooth xAxis={{ type: "timeCat" }} tooltip={{ shared: true }} />
          ) : null}
          <Row gutter={16}>
            <Col span={12}><Column height={220} data={vm.byTypeArr.map(d => ({ name: d.label || typeLabels[d.type] || d.type, value: d.value, series: "Số lượng" }))} xField="name" yField="value" seriesField="series" isGroup /></Col>
            <Col span={12}>
              <Pie 
                height={220} 
                data={vm.byTypeArr.map(d => {
                  const total = vm.byTypeArr.reduce((sum, item) => item.value + sum, 0);
                  const percentage = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
                  return { 
                    type: d.label || typeLabels[d.type] || d.type, 
                    value: d.value,
                    percentage: `${percentage}%`
                  };
                })} 
                angleField="value" 
                colorField="type" 
                innerRadius={0.64} 
                label={{ 
                  type: "inner", 
                  offset: "-50%", 
                  content: (item) => item.percentage || ""
                }} 
              />
            </Col>
          </Row>
        </Space>
      )}
    </Card>
  );
};

export default TransactionsWidget;


