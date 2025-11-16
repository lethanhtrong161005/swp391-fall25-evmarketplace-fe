import { Card, Form, Row, Col, Divider, Spin, Button, Layout } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import SectionMedia from "@components/SectionMedia";
import { LeftOutlined } from "@ant-design/icons";
import SectionDetailVehicle from "@components/SectionDetailVehicle";
import SectionDetailBattery from "@components/SectionDetailBattery";
import SectionTitleDesc from "@components/SectionTitleDesc";
import AddressField from "@components/AddressField";
import CategoryBrandModel from "@components/CategoryBrandModel";
import YearColorFields from "@components/YearColorFields";
import CreateListingFooter from "@components/CreateListingFooter";
import PostTypeModal from "@components/PostTypeModal";
import RejectedReasonModal from "@pages/Member/ListingEdit/RejectedReasonModal";
import DynamicBreadcrumb from "@components/Breadcrumb/Breadcrumb";
import React, { useState } from "react";

import { useListingEdit } from "./useListingEdit";
import { useAuth } from "@contexts/AuthContext";

const { Content } = Layout;
const PAGE_WIDTH = 1200;

export default function ListingEdit() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = user?.id ?? user?.accountId ?? user?.sub ?? null;

  const {
    form, msg, contextHolder, loading, tax, fetching,
    visibility, handleChangeVisibility, isBattery,
    submitting, handleSubmit, onValuesChange,
    postTypeOpen, setPostTypeOpen,
    status, rejectedReason, rejectedAt,
  } = useListingEdit({ userId, listingId: id });

  const [rejectOpen, setRejectOpen] = useState(false);
  const isRejected = String(status || "").toUpperCase() === "REJECTED";

  if (loading || fetching) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        {contextHolder}
        <Spin size="large">
          <div style={{ padding: 50 }}>Đang tải dữ liệu...</div>
        </Spin>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {contextHolder}
      <div style={{ maxWidth: PAGE_WIDTH, margin: "16px auto", padding: "0 16px", width: "100%" }}>
        <DynamicBreadcrumb />
      </div>

      <Content style={{ maxWidth: PAGE_WIDTH, margin: "0 auto", padding: "0 16px", paddingBottom: "100px", width: "100%" }}>
        <Card
          style={{ marginBottom: 16 }}
          variant="bordered"
          title="Chỉnh sửa tin đăng"
          extra={(
            <div style={{ display: "flex", gap: 8 }}>
              {isRejected && (
                <Button danger ghost onClick={() => setRejectOpen(true)}>
                  Lý do từ chối
                </Button>
              )}
              <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </div>
          )}
        />

        <Card variant="bordered" style={{ marginBottom: 0 }}>
          <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <SectionMedia messageApi={msg} />
              </Col>
              <Col xs={24} md={16}>
                <CategoryBrandModel form={form} tax={tax} disableCategory />
                <YearColorFields isBattery={isBattery} />
                {isBattery ? <SectionDetailBattery /> : <SectionDetailVehicle />}
              </Col>
            </Row>

            <Divider />
            <SectionTitleDesc />
            <Divider />
            <Row>
              <Col span={24}>
                <AddressField />
              </Col>
            </Row>
          </Form>
        </Card>
      </Content>

      <CreateListingFooter
        currentMode={visibility}
        onChoosePostType={() => setPostTypeOpen(true)}
        onSubmit={handleSubmit}
        submitting={submitting}
        maxWidth={PAGE_WIDTH}
        isEdit
      />

      <PostTypeModal
        open={postTypeOpen}
        value={visibility}
        onChange={handleChangeVisibility}
        onCancel={() => setPostTypeOpen(false)}
        onOk={() => setPostTypeOpen(false)}
      />

      {isRejected && (
        <RejectedReasonModal
          open={rejectOpen}
          onClose={() => setRejectOpen(false)}
          reason={rejectedReason}
          rejectedAt={rejectedAt}
        />
      )}
    </Layout>
  );
}
