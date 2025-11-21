import { Card, Form, Row, Col, Divider, Spin, Layout } from "antd";
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
import styles from "../shared/ListingPage.module.scss";

import { useListingCreate } from "@hooks/useListingCreate";
import { useAuth } from "@contexts/AuthContext";

const { Content } = Layout;
const PAGE_WIDTH = 1200;

export default function ListingCreate() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.accountId ?? user?.sub ?? null;

  const {
    form,
    msg,
    contextHolder,
    loading,
    tax,
    visibility,
    handleChangeVisibility,
    isBattery,
    postTypeOpen,
    submitting,
    setPostTypeOpen,
    handleSubmit,
    handlePreview,
    handleDraft,
    onValuesChange,
    loadLocalDraftById,
    images,
    setImages,
    videos,
    setVideos,
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
    <Layout className={styles.layoutContainer} style={{boxShadow:"none", padding:0}} >
      {contextHolder}
      <div className={styles.breadcrumbSection}>
        <DynamicBreadcrumb />
      </div>
      <Content className={styles.content} style={{backgroundColor:"#E9F2FF", padding: "0px", marginBottom:"58px" }}>
        <Card variant="borderless" style={{ margin: 0, borderTopRightRadius:0, borderTopLeftRadius:0, width:"100%", borderTop:"1px solid rgb(0,0,0,0.1)"}}>
          <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <SectionMedia
                  messageApi={msg}
                  images={images}
                  setImages={setImages}
                  videos={videos}
                  setVideos={setVideos}
                />
              </Col>
              <Col xs={24} md={16}>
                <CategoryBrandModel form={form} tax={tax} />
                <YearColorFields isBattery={isBattery} />
                {isBattery ? (
                  <SectionDetailBattery />
                ) : (
                  <SectionDetailVehicle />
                )}
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
    </Layout>
  );
}
