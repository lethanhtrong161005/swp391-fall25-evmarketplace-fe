import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Tag, Typography, Spin, Button } from "antd";
import dayjs from "dayjs";
import { viewContractFile } from "@/services/agreementService"; // có thể tái sử dụng cho file settlement
import { PAYMENT_METHODS, SETTLEMENT_STATUS_COLOR, SETTLEMENT_STATUS_LABELS } from "../../../../utils/constants";

const { Text, Link } = Typography;
const SettlementDetailModal = ({ open, onClose, settlement }) => {
  const [fileBlobUrl, setFileBlobUrl] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      if (!settlement?.mediaUrl) return;
      setFileLoading(true);
      try {
        const blob = await viewContractFile(settlement.mediaUrl);
        const blobUrl = URL.createObjectURL(blob);
        setFileBlobUrl(blobUrl);
      } catch (err) {
        console.error("Lỗi khi tải file sao kê:", err);
      } finally {
        setFileLoading(false);
      }
    };

    if (open && settlement?.mediaUrl) {
      fetchFile();
    } else {
      setFileBlobUrl(null);
    }
  }, [open, settlement]);

  const renderMedia = () => {
    if (!settlement?.mediaUrl) {
      return (
        <p style={{ textAlign: "center" }}>Không có tệp sao kê để hiển thị.</p>
      );
    }

    const isPdf = settlement.mediaUrl.toLowerCase().endsWith(".pdf");
    if (fileLoading) {
      return (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải tệp sao kê...</div>
        </div>
      );
    }

    if (!fileBlobUrl) {
      return <p style={{ textAlign: "center" }}>Không thể tải tệp sao kê.</p>;
    }

    if (isPdf) {
      return (
        <iframe
          src={fileBlobUrl}
          title="Tệp sao kê PDF"
          width="100%"
          height="500px"
          style={{
            borderRadius: 8,
            border: "1px solid #ddd",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        />
      );
    }

    // fallback nếu không phải PDF
    return (
      <p style={{ textAlign: "center" }}>
        <Link
          href={`http://localhost:8089/api/files/contract/${settlement.mediaUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tải tệp sao kê
        </Link>
      </p>
    );
  };

  return (
    <Modal
      title="Chi tiết Sao kê hợp đồng"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Spin spinning={fileLoading}>
        {settlement ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {renderMedia()}
            </div>

            <Descriptions
              bordered={false}
              column={2}
              labelStyle={{ fontWeight: 600 }}
            >
              <Descriptions.Item label="Phương thức">
                <Tag color="blue">{PAYMENT_METHODS[settlement.method] || settlement.method}</Tag>
              </Descriptions.Item>
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
              <Descriptions.Item label="Trạng thái">
                <Tag color= {SETTLEMENT_STATUS_COLOR[settlement.status]}>
                  {SETTLEMENT_STATUS_LABELS[settlement.status]|| settlement.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thanh toán">
                {settlement.paidAt
                  ? dayjs(settlement.paidAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Ghi chú" span={2}>
                {settlement.note || "-"}
              </Descriptions.Item> */}
            </Descriptions>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            >
              <Button onClick={onClose}>Đóng</Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p>Không có dữ liệu sao kê để hiển thị.</p>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default SettlementDetailModal;
