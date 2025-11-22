import React, { useEffect } from "react";
import {
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Upload,
  Typography,
  App,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useDraftAgreement from "./useDraftAgreement";

const { Option } = Select;
const { Text } = Typography;

const AddAgreementModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  isEditingDraft = false,
  requestId,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { saveDraft, loadDraft, clearDraft } = useDraftAgreement(form, "agreement_draft");

  useEffect(() => {
    if (visible && isEditingDraft) {
      const draft = loadDraft();
      if (draft) {
        if (draft.startAt && typeof draft.startAt === "string") {
          draft.startAt = dayjs(draft.startAt);
        }
        form.setFieldsValue(draft);
      }
    }
  }, [visible, isEditingDraft, form, loadDraft]);

  const handleSaveDraft = () => {
    const success = saveDraft();
    if (success) message.success("Đã lưu bản nháp hợp đồng!");
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        requestId,
        commissionPercent: values.commissionPercent,
        acceptablePrice: values.acceptablePrice,
        startAt: values.startAt ? values.startAt.toISOString() : null,
        duration: values.duration,
      };

      const fileList = values.contractFile || [];
      const file = fileList[0]?.originFileObj;
      if (!file) {
        message.error("Vui lòng tải lên tệp hợp đồng (PDF)");
        return;
      }

      await onSubmit(payload, file);
      clearDraft();
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title={isEditingDraft ? "Chỉnh sửa bản nháp hợp đồng" : "Thêm hợp đồng ký gửi"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={600}
      footer={[
        <Button key="draft" onClick={handleSaveDraft}>
          Lưu nháp
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {isEditingDraft ? "Xác nhận lưu" : "Xác nhận"}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          duration: "SIX_MONTHS",
        }}
      >
        <Form.Item
          label="Phần trăm hoa hồng (%)"
          name="commissionPercent"
          rules={[{ required: true, message: "Vui lòng nhập phần trăm hoa hồng" }]}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="Nhập % hoa hồng" />
        </Form.Item>

        <Form.Item
          label="Giá chấp nhận (VND)"
          name="acceptablePrice"
          rules={[{ required: true, message: "Vui lòng nhập giá chấp nhận" }]}
        >
          <InputNumber
            min={0}
            step={100000}
            style={{ width: "100%" }}
            placeholder="Nhập giá chấp nhận"
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            parser={(v) => v.replace(/\./g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="startAt"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={(d) => d && d < dayjs().startOf("day")}
            placeholder="Chọn ngày và giờ bắt đầu"
          />
        </Form.Item>

        <Form.Item
          label="Thời hạn hợp đồng"
          name="duration"
          rules={[{ required: true, message: "Vui lòng chọn thời hạn" }]}
        >
          <Select placeholder="Chọn thời hạn">
            <Option value="SIX_MONTHS">6 tháng</Option>
            <Option value="ONE_YEAR">1 năm</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tệp hợp đồng ký gửi (PDF)"
          name="contractFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList || [])}
          rules={[{ required: true, message: "Vui lòng tải lên tệp PDF" }]}
        >
          <Upload
            accept="application/pdf"
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải hợp đồng (PDF)</div>
            </div>
          </Upload>
        </Form.Item>

        <Text type="secondary">
          Chỉ hỗ trợ tệp hợp đồng định dạng PDF (tối đa 20MB)
        </Text>
      </Form>
    </Modal>
  );
};

export default AddAgreementModal;
