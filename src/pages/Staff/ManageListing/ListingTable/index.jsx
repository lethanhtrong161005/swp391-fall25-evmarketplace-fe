import React from "react";
import { Table, Space, Button, Drawer, List, Typography } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import s from "./ListingTable.module.scss";
import { useListingTable } from "./logic.jsx";
import StatusTag from "../StatusTag/StatusTag";

const { Text } = Typography;

export default function ListingTable({
  loading,
  dataSource,
  total,
  page,
  pageSize,
  onPageChange,
  onApprove,
  onReject,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onRestore,
  onRenew,
}) {
  const navigate = useNavigate();
  const {
    columns,
    historyOpen,
    setHistoryOpen,
    historyData,
    showGlobalHistory,
  } = useListingTable({
    onApprove,
    onReject,
    onEdit,
    onActivate,
    onDeactivate,
    onDelete,
    onRestore,
    onRenew,
    navigate,
  });

  return (
    <>
      {/* Nút xem log chung */}
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button
          icon={<HistoryOutlined />}
          onClick={showGlobalHistory}
          style={{
            fontWeight: 500,
            height: 36,
            borderRadius: 6,
          }}
        >
          Xem log chung
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: onPageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong ${total} kết quả`,
        }}
        scroll={{ x: 1320 }}
        className={s.listingTable}
      />

      {/* History Drawer */}
      <Drawer
        title="Lịch sử thao tác"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        width={520}
      >
        <List
          dataSource={historyData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{item.action}</Text>
                    <Text type="secondary">({item.by})</Text>
                  </Space>
                }
                description={
                  <div>
                    <div>{item.note}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.at}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
