import { Card, Form, Row, Col, Divider, Spin } from "antd";
import SectionMedia from "./SectionMedia";
import SectionDetailVehicle from "./SectionDetailVehicle";
import SectionDetailBattery from "./SectionDetailBattery";
import SectionTitleDesc from "./SectionTitleDesc";
import AddressField from "./AddressField";
import CategoryBrandModel from "./CategoryBrandModel";
import YearColorFields from "./YearColorFields";
import CreateListingFooter from "./CreateListingFooter";
import PostTypeModal from "./PostTypeModal";

import { useListingCreate } from "@hooks/useListingCreate";

const PAGE_WIDTH = 1200;

export default function ListingCreate() {
  const {
    form,
    msg,
    contextHolder,
    loading,
    tax,
    visibility,
    handleChangeVisibility,
    isBattery,
    postType,
    postTypeOpen,
    submitting,
    setPostType,
    setPostTypeOpen,
    handleSubmit,
    handlePreview,
    handleDraft,
  } = useListingCreate();

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        {contextHolder}
        <Spin tip="Đang tải danh mục..." />
      </div>
    );
  }

  return (
    <>
      {contextHolder}

      <Card style={{ maxWidth: PAGE_WIDTH, margin: "16px auto" }} variant="bordered">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <SectionMedia messageApi={msg} />
            </Col>

            <Col xs={24} md={16}>
              <CategoryBrandModel form={form} tax={tax} />
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

      <CreateListingFooter
        currentMode={visibility}                // 👈 dùng visibility để hiển thị
        onChoosePostType={() => setPostTypeOpen(true)}
        onPreview={handlePreview}
        onDraft={handleDraft}
        onSubmit={handleSubmit}
        submitting={submitting}
        maxWidth={PAGE_WIDTH}
      />

      <PostTypeModal
        open={postTypeOpen}
        value={visibility}                      // 👈 bind vào visibility
        onChange={handleChangeVisibility}       // 👈 cập nhật visibility + postType
        onCancel={() => setPostTypeOpen(false)}
        onOk={() => setPostTypeOpen(false)}
      />

    </>
  );
}
