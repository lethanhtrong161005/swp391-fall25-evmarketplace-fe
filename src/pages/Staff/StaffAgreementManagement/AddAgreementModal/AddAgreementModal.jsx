import React, { useEffect } from "react";
import {
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import useDraftAgreement from "./useDraftAgreement";

const { Option } = Select;

const AddAgreementModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  isEditingDraft = false,
}) => {
  const [form] = Form.useForm();
  const { saveDraft, loadDraft, clearDraft } = useDraftAgreement(
    form,
    "agreement_draft"
  );

  /**
   * Khi mở modal ở chế độ chỉnh sửa nháp
   * -> Tự động load dữ liệu nháp vào form
   */
  useEffect(() => {
    if (visible && isEditingDraft) {
      const draft = loadDraft();
      if (draft) {
        // ✅ Nếu có trường ngày, convert lại sang dayjs để DatePicker hiểu được
        if (draft.startAt && typeof draft.startAt === "string") {
          draft.startAt = dayjs(draft.startAt);
        }
        form.setFieldsValue(draft);
      }
    }
  }, [visible, isEditingDraft, form, loadDraft]);

  /** ✅ Lưu bản nháp vào localStorage */
  const handleSaveDraft = () => {
    const success = saveDraft();
    if (success) message.success("Đã lưu bản nháp hợp đồng!");
  };

  /** ✅ Gửi form lên server */
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        // ⚠️ Dùng 'T' giữa ngày và giờ để Spring Boot parse đúng LocalDateTime
        startAt: values.startAt
          ? values.startAt.format("YYYY-MM-DDTHH:mm:ss")
          : null,
      };

      await onSubmit(formattedValues);
      clearDraft();
      form.resetFields();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      title={
        isEditingDraft ? "Chỉnh sửa bản nháp hợp đồng" : "Thêm hợp đồng ký gửi"
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={500}
      footer={[
        <Button key="draft" onClick={handleSaveDraft}>
          Lưu nháp
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
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
          rules={[
            { required: true, message: "Vui lòng nhập phần trăm hoa hồng" },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%" }}
            placeholder="Nhập % hoa hồng"
          />
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
            formatter={(v) =>
              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(v) => v.replace(/,/g, "")}
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
          label="Phần trăm đặt cọc (%)"
          name="depositPercent"
          rules={[
            { required: true, message: "Vui lòng nhập phần trăm đặt cọc" },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%" }}
            placeholder="Nhập % đặt cọc"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAgreementModal;
