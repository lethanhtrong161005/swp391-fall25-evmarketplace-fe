import { Card, Form, Row, Col, Divider, Spin } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SectionMedia from "@components/SectionMedia";
import SectionDetailVehicle from "@components/SectionDetailVehicle";
import SectionDetailBattery from "@components/SectionDetailBattery";
import SectionTitleDesc from "@components/SectionTitleDesc";
import AddressField from "@components/AddressField";
import CategoryBrandModel from "@components/CategoryBrandModel";
import YearColorFields from "@components/YearColorFields";
import CreateListingFooter from "@components/CreateListingFooter";
import PostTypeModal from "@components/PostTypeModal";
import DynamicBreadcrumb from "@components/Breadcrumb/Breadcrumb";

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
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "80px" }}>
      {contextHolder}
      <div style={{ maxWidth: PAGE_WIDTH, margin: "16px auto", padding: "0 16px" }}>
        <DynamicBreadcrumb />
      </div>
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
    </div>
  );
}
