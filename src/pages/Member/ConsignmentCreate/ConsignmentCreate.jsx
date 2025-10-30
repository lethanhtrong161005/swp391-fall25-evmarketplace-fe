import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Form, Card, Button, Row, Col, Space, Select } from "antd";
import useConsignmentCreate from "./useConsignmentCreate";
import { getConsignmentById } from "../../../services/consigmentService";
import CategoryBrandModel from "@/components/CategoryBrandModel";
import YearColorFields from "@/components/YearColorFields";
import SectionDetailVehicle from "@/components/SectionDetailVehicle";
import SectionDetailBattery from "@/components/SectionDetailBattery";
import SectionMedia from "@/components/SectionMedia";
import BranchAddressField from "@/components/BranchAddressField/BranchAddressField";
import styles from "./style.module.scss";
import DynamicBreadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const ConsignmentForm = ({
  mode = "create",
  initialData: propInitialData = null,
}) => {
  const location = useLocation();
  const { id } = useParams();

  const [data, setData] = useState(
    propInitialData || location.state?.consignment || null
  );

  useEffect(() => {
    if (mode === "update" && !data && id) {
      const fetchData = async () => {
        const res = await getConsignmentById(id);
        if (res?.success && res.data) {
          setData(res.data);
        } else {
          msg.error(res?.message || "Không thể tải thông tin ký gửi");
        }
      };
      fetchData();
    }
  }, [mode, id, data]);

  const { form, msg, contextHolder, tax, isBattery, submitting, handleSubmit } =
    useConsignmentCreate(mode, data);

  const isUpdate = mode === "update";

  if (isUpdate && !data) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.breadcrumb}>
          <DynamicBreadcrumb />
        </div>
        <Card className={styles.card}>Đang tải dữ liệu ký gửi...</Card>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {contextHolder}
      <div className={styles.breadcrumb}>
        <DynamicBreadcrumb />
      </div>
      <Card
        title={isUpdate ? "Chỉnh sửa yêu cầu ký gửi" : "Tạo yêu cầu ký gửi"}
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
                if (mode === "create") {
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
                }
              }}
            />
          </Form.Item>

          <CategoryBrandModel form={form} tax={tax} />
          <YearColorFields isBattery={isBattery} mode="consignment" />
          {isBattery ? (
            <SectionDetailBattery mode="consignment"/>
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
                    {isUpdate
                      ? "Cập nhật yêu cầu ký gửi"
                      : "Tạo yêu cầu ký gửi"}
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

export default ConsignmentForm;
