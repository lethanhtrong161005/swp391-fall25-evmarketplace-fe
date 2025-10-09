import { Card, Form, Row, Col, Divider, Spin } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { useAuth } from "@contexts/AuthContext";

const PAGE_WIDTH = 1200;

export default function ListingCreate() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.accountId ?? user?.sub ?? null;

  const {
    form, msg, contextHolder, loading, tax,
    visibility, handleChangeVisibility, isBattery,
    postTypeOpen, submitting, setPostTypeOpen,
    handleSubmit, handlePreview, handleDraft, onValuesChange,
    loadLocalDraftById,
  } = useListingCreate({ userId }); 

  const [params] = useSearchParams();
  useEffect(() => {
    const draftId = params.get("draftId");
    if (draftId) loadLocalDraftById?.(draftId);
  }, [params, loadLocalDraftById]);

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
        <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
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
        currentMode={visibility}
        onChoosePostType={() => setPostTypeOpen(true)}
        onPreview={handlePreview}
        onDraft={handleDraft}
        onSubmit={handleSubmit}
        submitting={submitting}
        maxWidth={PAGE_WIDTH}
      />

      <PostTypeModal
        open={postTypeOpen}
        value={visibility}
        onChange={handleChangeVisibility}
        onCancel={() => setPostTypeOpen(false)}
        onOk={() => setPostTypeOpen(false)}
      />
    </>
  );
}
