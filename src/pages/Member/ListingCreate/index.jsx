import React, { useMemo, useState } from "react";
import { Card, Form, Row, Col, Divider, message, Spin } from "antd";

import SectionMedia from "./_components/SectionMedia";
import SectionDetailVehicle from "./_components/SectionDetailVehicle";
import SectionDetailBattery from "./_components/SectionDetailBattery";
import SectionTitleDesc from "./_components/SectionTitleDesc";
import AddressField from "./_components/AddressField";
import CategoryBrandModel from "./_components/CategoryBrandModel";
import YearColorFields from "./_components/YearColorFields";
import CreateListingFooter from "./_components/CreateListingFooter";
import PostTypeModal from "./_components/PostTypeModal";
import DefaultHeader from "@components/Header/DefaultHeader";

import { useTaxonomy } from "@hooks/useTaxonomy";
import { createListing } from "@services/listing.service";

// ✅ Dùng hàm chuẩn hoá tách riêng
import { normalizeListingPayload, buildCreateListingFormData } from "./_shared/normalizeListingPayload";

const PAGE_WIDTH = 1200;

export default function ListingCreate() {
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const { loading, tax } = useTaxonomy(msg);

  // trạng thái footer + modal
  const [postType, setPostType] = useState("NORMAL");
  const [postTypeOpen, setPostTypeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categoryId = Form.useWatch("category", form);
  const selectedCategory = useMemo(
    () => (tax?.categoryOptions || []).find((o) => o.value === categoryId),
    [tax, categoryId]
  );
  const isBattery = selectedCategory?.code === "BATTERY";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createListing(values, tax, postType);
      msg.success("Đăng tin thành công!");
      form.resetFields();
    } catch (e) {
      if (e?.errorFields) {
        msg.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      } else {
        msg.error(e?.message || "Đăng tin thất bại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      const preview = normalizeListingPayload(values, tax, postType);
      localStorage.setItem("listing_preview", JSON.stringify(preview));
      msg.success("Đã lưu bản xem trước.");
    } catch {
      msg.error("Hãy điền đủ các trường bắt buộc trước khi xem trước.");
    }
  };

  const handleDraft = () => {
    const values = form.getFieldsValue(true);
    const payload = normalizeListingPayload(values, tax, postType);
    localStorage.setItem("listing_draft", JSON.stringify(payload));
    msg.success("Đã lưu nháp.");
  };

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

      {/* Footer cố định */}
      <CreateListingFooter
        currentPostType={postType}
        onChoosePostType={() => setPostTypeOpen(true)}
        onPreview={handlePreview}
        onDraft={handleDraft}
        onSubmit={handleSubmit}
        submitting={submitting}
        maxWidth={PAGE_WIDTH}
      />

      {/* Modal chọn loại đăng tin */}
      <PostTypeModal
        open={postTypeOpen}
        value={postType}
        onChange={setPostType}
        onCancel={() => setPostTypeOpen(false)}
        onOk={() => setPostTypeOpen(false)}
      />
    </>
  );
}
