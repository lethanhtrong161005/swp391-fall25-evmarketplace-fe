import React, { useMemo, useState } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Select,
  AutoComplete,
  Divider,
  message,
} from "antd";

import DefaultHeader from "@/components/Header/DefaultHeader";
import SectionMedia from "./_components/SectionMedia";
import SectionDetailVehicle from "./_components/SectionDetailVehicle";
import SectionDetailBattery from "./_components/SectionDetailBattery";
import SectionTitleDesc from "./_components/SectionTitleDesc";
import AddressField from "./_components/AddressField";
import CreateListingFooter from "./_components/CreateListingFooter";
import PostTypeModal from "./_components/PostTypeModal";

import {
  CATEGORIES,
  BRANDS_BY_CATEGORY,
  YEARS_EXTENDED,
} from "./_shared/constants";
import { createListing } from "@services/listing.service";

const PAGE_WIDTH = 1200; // dùng chung cho Card + Footer container

export default function ListingCreate() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [postType, setPostType] = useState("FREE");
  const [postTypeOpen, setPostTypeOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();

  // Theo dõi category/brand để đổi gợi ý
  const category = Form.useWatch("category", form);
  const brand = Form.useWatch("brand", form);

  // Gợi ý Hãng theo category (có thể thay bằng API thật)
  const brandSuggest = useMemo(
    () =>
      category
        ? (BRANDS_BY_CATEGORY[category] || []).map((b) => ({
            value: b.value,
            label: b.label,
          }))
        : [],
    [category]
  );

  // Gợi ý Model theo brand đã chọn
  const modelSuggest = useMemo(() => {
    const found = (BRANDS_BY_CATEGORY[category] || []).find(
      (b) => (b.value || b.label) === brand
    );
    return (found?.models || []).map((m) => ({ value: m, label: m }));
  }, [category, brand]);

  // Chuẩn hóa payload đúng schema BE
  const normalizePayload = (values) => {
    const allMedia = [...(values.images || []), ...(values.videos || [])];

    return {
      // taxonomy override (BE có thể map brand/model → id nếu muốn)
      category: values.category,
      brand: values.brand, // string tự do
      model: values.model, // string tự do
      year: values.year,
      battery_capacity_kwh: values.battery_capacity_kwh,
      soh_percent: values.soh_percent,
      mileage_km: values.mileage_km,
      color: values.category === CATEGORIES.BATTERY ? undefined : values.color,
      description: values.description,
      price: values.price,
      province: values.address?.province?.label,
      city: values.address?.district?.label,

      // media (BE upload/ghi listing_media)
      media: allMedia.map((f) => ({
        uid: f.uid,
        name: f.name,
        type: f.type,
        url: f.url,
        originFileObj: f.originFileObj, // nếu dùng upload thật
      })),

      post_type: postType,
    };
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createListing(normalizePayload(values));
      msg.success("Đã đăng tin thành công!");
      form.resetFields();
    } catch (e) {
      if (e?.errorFields) msg.error("Vui lòng kiểm tra các trường bắt buộc.");
      else msg.error(e?.message || "Đăng tin thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Xem trước → localStorage
  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      localStorage.setItem(
        "listing_preview",
        JSON.stringify(normalizePayload(values))
      );
      msg.success("Đã lưu bản xem trước vào trình duyệt.");
    } catch {
      msg.error("Hãy điền đủ các trường bắt buộc trước khi xem trước.");
    }
  };

  // Lưu nháp → localStorage
  const handleDraft = () => {
    const values = form.getFieldsValue(true);
    localStorage.setItem(
      "listing_draft",
      JSON.stringify(normalizePayload(values))
    );
    msg.success("Đã lưu nháp vào trình duyệt.");
  };

  return (
    <>
      {contextHolder}
      <DefaultHeader />

      <Card
        style={{ maxWidth: PAGE_WIDTH, margin: "16px auto" }}
        variant="bordered"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ category: CATEGORIES.EV_CAR }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              {/* Media: 3–8 ảnh, ≤2 video */}
              <SectionMedia messageApi={msg} />
            </Col>

            <Col xs={24} md={16}>
              {/* Danh mục tin đăng */}
              <Form.Item
                label="Danh mục tin đăng"
                name="category"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select
                  options={[
                    { value: CATEGORIES.EV_CAR, label: "Xe điện - Ô tô" },
                    {
                      value: CATEGORIES.E_MOTORBIKE,
                      label: "Xe điện - Xe máy",
                    },
                    { value: CATEGORIES.E_BIKE, label: "Xe điện - Xe đạp" },
                    { value: CATEGORIES.BATTERY, label: "Pin/Pack/Sạc" },
                  ]}
                />
              </Form.Item>

              {/* Hãng & Model: AutoComplete = gõ tự do + chọn gợi ý */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Hãng"
                    name="brand"
                    rules={[{ required: true, message: "Nhập hoặc chọn Hãng" }]}
                  >
                    <AutoComplete
                      placeholder="VD: VinES, CATL, Tesla…"
                      options={brandSuggest}
                      filterOption={(input, option) =>
                        option?.label
                          ?.toLowerCase?.()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Mẫu/Model"
                    name="model"
                    rules={[
                      { required: true, message: "Nhập hoặc chọn Model" },
                    ]}
                  >
                    <AutoComplete
                      placeholder="Chọn/nhập model"
                      options={modelSuggest}
                      filterOption={(input, option) =>
                        option?.label
                          ?.toLowerCase?.()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Năm sản xuất"
                    name="year"
                    rules={[{ required: true, message: "Chọn năm" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn năm"
                      options={YEARS_EXTENDED}
                      filterOption={(input, option) =>
                        `${option?.label}`
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Pin không có 'color' trong DB → chỉ render cho Vehicle */}
                {category !== CATEGORIES.BATTERY && (
                  <Col xs={24} md={12}>
                    <Form.Item label="Màu sắc (tùy chọn)" name="color">
                      <AutoComplete
                        allowClear
                        options={[
                          { value: "Trắng", label: "Trắng" },
                          { value: "Đen", label: "Đen" },
                          { value: "Đỏ", label: "Đỏ" },
                          { value: "Xanh", label: "Xanh" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              {/* Block chi tiết: Vehicle ↔ Battery */}
              {category === CATEGORIES.BATTERY ? (
                <SectionDetailBattery />
              ) : (
                <SectionDetailVehicle />
              )}
            </Col>
          </Row>

          <Divider />

          {/* Tiêu đề & Mô tả có hint + auto title */}
          <SectionTitleDesc />

          <Divider />

          <Row gutter={0}>
            <Col span={24}>
              <AddressField />
            </Col>
          </Row>
        </Form>
      </Card>

      <CreateListingFooter
        currentPostType={postType}
        onChoosePostType={() => setPostTypeOpen(true)}
        onPreview={handlePreview}
        onDraft={handleDraft}
        onSubmit={handleSubmit}
        submitting={submitting}
        maxWidth={PAGE_WIDTH}
      />

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
