import React from "react";
import {
  Card,
  Table,
  Input,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
  Tag,
  Row,
  Col,
  Collapse,
  Empty,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  HistoryOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useModeratorHistoryLogic } from "@hooks/useModeratorHistoryLogic";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Status options for filtering
const STATUS_OPTIONS = [
  { value: "APPROVED", label: "Đã duyệt", color: "green" },
  { value: "REJECTED", label: "Đã từ chối", color: "red" },
];

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "—";
  return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
};

// Get status tag configuration
const getStatusConfig = (status) => {
  const config = STATUS_OPTIONS.find((opt) => opt.value === status);
  return config || { label: status, color: "default" };
};

export default function ModeratorHistoryPage() {
  const {
    filters,
    pagination,
    tableData,
    loading,
    handleFilterChange,
    handleTableChange,
    handleResetFilters,
    handleSearch,
  } = useModeratorHistoryLogic();

  // Handle individual filter changes
  const handleSearchChange = (value) => {
    handleFilterChange({
      ...filters,
      q: value,
    });
  };

  const handleDateRangeChange = (dates) => {
    handleFilterChange({
      ...filters,
      dateRange: dates,
    });
  };

  const handleStatusChange = (values) => {
    handleFilterChange({
      ...filters,
      toStatuses: values,
    });
  };

  // Table columns definition
  const columns = [
    {
      title: "Mã tin",
      dataIndex: "listingId",
      key: "listingId",
      width: 100,
      render: (id) => `#${id}`,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title) => (
        <Text strong style={{ color: "#1890ff" }}>
          {title}
        </Text>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "toStatus",
      key: "toStatus",
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Người duyệt",
      dataIndex: "actorName",
      key: "actorName",
      width: 150,
      render: (actorName, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{actorName || `ID: ${record.actorId}`}</Text>
          {record.actorId && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.actorId}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Lý do từ chối",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      ellipsis: true,
      render: (reason) => {
        if (!reason) return <Text type="secondary">—</Text>;
        return (
          <Tooltip title={reason}>
            <Text>{reason}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (timestamp) => <Text>{formatDate(timestamp)}</Text>,
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <HistoryOutlined /> Lịch sử duyệt tin đăng
            </Title>
            <Text type="secondary">
              Xem và tìm kiếm lịch sử các hành động duyệt tin đăng
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleSearch}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filter Panel */}
      <Card style={{ marginBottom: 16 }}>
        <Collapse
          defaultActiveKey={["filters"]}
          ghost
          expandIconPosition="end"
          items={[
            {
              key: "filters",
              label: (
                <Space>
                  <FilterOutlined />
                  <span>Bộ lọc tìm kiếm</span>
                  {(filters.q ||
                    filters.dateRange.length > 0 ||
                    filters.toStatuses.length > 0) && (
                    <Tag color="blue">Có bộ lọc</Tag>
                  )}
                </Space>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {/* General Search */}
                  <Col xs={24} sm={12} md={8}>
                    <Text strong>Tìm kiếm chung:</Text>
                    <Search
                      placeholder="Tìm theo tiêu đề, mã tin..."
                      allowClear
                      value={filters.q}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onSearch={handleSearch}
                      style={{ marginTop: 8 }}
                    />
                  </Col>

                  {/* Date Range */}
                  <Col xs={24} sm={12} md={8}>
                    <Text strong>Khoảng thời gian:</Text>
                    <RangePicker
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      placeholder={["Từ ngày", "Đến ngày"]}
                      value={filters.dateRange}
                      onChange={handleDateRangeChange}
                      style={{ marginTop: 8, width: "100%" }}
                    />
                  </Col>

                  {/* Status Filter */}
                  <Col xs={24} sm={12} md={8}>
                    <Text strong>Trạng thái:</Text>
                    <Select
                      mode="multiple"
                      placeholder="Chọn trạng thái"
                      value={filters.toStatuses}
                      onChange={handleStatusChange}
                      style={{ marginTop: 8, width: "100%" }}
                      allowClear
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <Tag color={option.color} style={{ marginRight: 8 }}>
                            {option.label}
                          </Tag>
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  {/* Action Buttons */}
                  <Col xs={24}>
                    <Space>
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        loading={loading}
                      >
                        Tìm kiếm
                      </Button>
                      <Button
                        icon={<ClearOutlined />}
                        onClick={handleResetFilters}
                      >
                        Xóa bộ lọc
                      </Button>
                    </Space>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Card>

      {/* Results Table */}
      <Card title={`Kết quả tìm kiếm (${tableData.total} bản ghi)`}>
        <Table
          rowKey="uniqueKey"
          loading={loading}
          dataSource={tableData.items}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bản ghi`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                description="Không có dữ liệu lịch sử"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
