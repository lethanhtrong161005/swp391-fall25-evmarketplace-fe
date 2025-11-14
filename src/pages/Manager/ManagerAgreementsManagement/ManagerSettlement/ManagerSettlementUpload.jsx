import React, { useState } from "react";
import { Modal, Upload, Button, message, Descriptions, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

/**
 * Modal cho phép chọn và upload file PDF để thanh toán hợp đồng.
 *
 * Props:
 * - open: boolean (hiển thị/ẩn modal)
 * - onCancel: () => void
 * - onSubmit: (file) => Promise<void> — callback khi xác nhận upload
 * - settlement: object — chứa thông tin sao kê hiện tại (tùy chọn)
 */
const UploadPayoutModal = ({ open, onCancel, onSubmit, settlement }) => {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const beforeUpload = (f) => {
    if (f.type !== "application/pdf") {
      message.error("Chỉ chấp nhận tệp PDF!");
      return Upload.LIST_IGNORE;
    }
    setFile(f);
    return false; // không upload tự động
  };

  const handleOk = async () => {
    if (!file) {
      message.warning("Vui lòng chọn tệp PDF trước khi xác nhận.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(file);
      message.success("Thanh toán hợp đồng thành công!");
      setFile(null);
      onCancel();
    } catch (err) {
      console.error(err);
      message.error("Không thể thanh toán hợp đồng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Xác nhận thanh toán hợp đồng"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={submitting}
    >
      {/* ✅ Thông tin thanh toán */}
      {settlement && (
        <Descriptions
          bordered={false}
          column={1}
          size="small"
          labelStyle={{ fontWeight: 600, width: 180 }}
          style={{ marginBottom: 16 }}
        >
          <Descriptions.Item label="Tổng tiền giao dịch">
            {settlement.grossAmount?.toLocaleString("vi-VN")} ₫
          </Descriptions.Item>
          <Descriptions.Item label="Hoa hồng (%)">
            {settlement.commissionPercent}%
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền hoa hồng">
            {settlement.commissionAmount?.toLocaleString("vi-VN")} ₫
          </Descriptions.Item>
          <Descriptions.Item label="Thực nhận của chủ sở hữu">
            <Text strong type="success">
              {settlement.ownerReceiveAmount?.toLocaleString("vi-VN")} ₫
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo thanh toán">
            {settlement.createdAt
              ? dayjs(settlement.createdAt).format("DD/MM/YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      )}

      {/* ✅ Upload file PDF */}
      <Upload
        beforeUpload={beforeUpload}
        accept=".pdf"
        maxCount={1}
        showUploadList={!!file}
      >
        <Button icon={<UploadOutlined />}>Tải lên biên lai</Button>
      </Upload>

      {file && (
        <p style={{ marginTop: 12, color: "#555" }}>
          <b>{file.name}</b>
        </p>
      )}
    </Modal>
  );
};

export default UploadPayoutModal;
