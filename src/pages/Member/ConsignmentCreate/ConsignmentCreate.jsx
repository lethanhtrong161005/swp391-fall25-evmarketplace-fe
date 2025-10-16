import React from "react";
import { Form, Card, Button, Row, Col, Space, Select } from "antd";
import useConsignmentCreate from "./useConsignmentCreate";
import CategoryBrandModel from "@/components/CategoryBrandModel";
import YearColorFields from "@/components/YearColorFields";
import SectionDetailVehicle from "@/components/SectionDetailVehicle";
import SectionDetailBattery from "@/components/SectionDetailBattery";
import SectionMedia from "@/components/SectionMedia";
import BranchAddressField from "@/components/BranchAddressField/BranchAddressField";
import styles from "./style.module.scss";

const ConsignmentCreate = () => {
  const { form, msg, contextHolder, tax, isBattery, submitting, handleSubmit } =
    useConsignmentCreate();

  return (
    <div className={styles.wrapper}>
      {contextHolder}
      <Card
        title="Đăng ký gửi sản phẩm"
        bordered={false}
        className={styles.card}
      >
        <Form
          layout="vertical"
          form={form}
          requiredMark="optional"
          scrollToFirstError
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Loại"
            name="itemType"
            rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm" }]}
          >
            <Select
              placeholder="Chọn loại sản phẩm"
              options={[
                { label: "Phương tiện", value: "VEHICLE" },
                { label: "Pin", value: "BATTERY" },
              ]}
              onChange={(value) => {
                form.setFieldValue("brand_id", null);
                form.setFieldValue("model_id", null);

                if (value === "BATTERY") {
                  const batteryCategory = tax.categoryOptions.find(
                    (c) => c.code === "BATTERY"
                  );
                  if (batteryCategory) {
                    form.setFieldValue("category", batteryCategory.value);
                  }
                } else {
                  form.setFieldValue("category", null);
                }
              }}
            />
          </Form.Item>

          <CategoryBrandModel form={form} tax={tax} />

          <YearColorFields isBattery={isBattery} mode="consignment" />

          {isBattery ? (
            <SectionDetailBattery />
          ) : (
            <SectionDetailVehicle mode="consignment" />
          )}

          <SectionMedia messageApi={msg} />

          <Form.Item
            label="Chi nhánh ký gửi"
            name="preferredBranchId"
            rules={[
              { required: true, message: "Vui lòng chọn chi nhánh ký gửi" },
            ]}
          >
            <BranchAddressField placeholder="Chọn chi nhánh ký gửi" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú" className="no-optional">
            <textarea
              placeholder="Nhập ghi chú thêm (nếu có)..."
              className={styles.textareaCustom}
            />
          </Form.Item>

          <Form.Item>
            <Row justify="end">
              <Col>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    Tạo yêu cầu ký gửi
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ConsignmentCreate;
