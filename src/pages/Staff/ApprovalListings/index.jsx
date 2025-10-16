import React from "react";
import { Button, Typography, Card, Row, Col, Modal } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useApprovalListings } from "./useApprovalListings";
import ListingTable from "@pages/Staff/ManageListing/ListingTable/ListingTable";
import ManageListingDetail from "@pages/Staff/ManageListingDetail";

const { Title, Text } = Typography;

export default function ApprovalListings() {
  const { loading, listings, refresh, onApprove, onReject } =
    useApprovalListings();

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleOpenDetail = (row) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý duyệt bài
            </Title>
            <Text type="secondary">
              Duyệt các tin đăng có trạng thái PENDING
            </Text>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={refresh}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        <ListingTable
          loading={loading}
          dataSource={listings}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={() => {}}
          onActivate={() => {}}
          onDeactivate={() => {}}
          onDelete={() => {}}
          onRestore={() => {}}
          onRenew={() => {}}
          onOpenDetail={handleOpenDetail}
        />
      </Card>

      <Modal
        title={null}
        open={detailOpen}
        onCancel={handleCloseDetail}
        width={1100}
        style={{ top: 24 }}
        footer={null}
        destroyOnClose
      >
        {detailOpen && (
          <ManageListingDetail
            modalId={selectedRow?.id}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </div>
  );
}
