import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Image, Button, Spin, Tag } from "antd";
import dayjs from "dayjs";
import {
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  DURATION_LABEL,
} from "../../../../utils/constants";
import { viewContractFile } from "@/services/agreementService";

const AgreementDetailModal = ({
  open,
  onClose,
  agreement,
  loading,
  onCancelAgreement,
  isCancelView = false,
  mode = "staff",
}) => {
  const [fileBlobUrl, setFileBlobUrl] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    const fetchFileWithAuth = async () => {
      if (!agreement?.medialUrl) return;

      setFileLoading(true);
      try {
        const blob = await viewContractFile(agreement.medialUrl);
        const blobUrl = URL.createObjectURL(blob);
        setFileBlobUrl(blobUrl);
      } catch (err) {
        console.error("Lỗi khi tải file hợp đồng:", err);
      } finally {
        setFileLoading(false);
      }
    };

    if (open && agreement?.medialUrl) {
      fetchFileWithAuth();
    } else {
      setFileBlobUrl(null);
    }
  }, [open, agreement]);

  const renderMedia = () => {
    if (!agreement?.medialUrl) {
      return (
        <p style={{ textAlign: "center" }}>
          Không có tệp hợp đồng để hiển thị.
        </p>
      );
    }

    const isPdf = agreement.medialUrl.toLowerCase().endsWith(".pdf");
    if (fileLoading) {
      return <Spin tip="Đang tải hợp đồng..." />;
    }

    if (!fileBlobUrl) {
      return <p style={{ textAlign: "center" }}>Không thể tải tệp hợp đồng.</p>;
    }

    if (isPdf) {
      return (
        <iframe
          src={fileBlobUrl}
          title="Hợp đồng PDF"
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

    return (
      <Image
        width={500}
        src={fileBlobUrl}
        alt="Hình ảnh hợp đồng"
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          objectFit: "cover",
        }}
        fallback="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
      />
    );
  };

  return (
    <Modal
      title="Chi tiết Hợp đồng Ký gửi"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Spin spinning={loading}>
        {agreement ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {renderMedia()}
            </div>

            <Descriptions
              bordered={false}
              column={2}
              labelStyle={{ fontWeight: 600 }}
            >
              <Descriptions.Item label="Mã hợp đồng">
                {agreement.id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={CONSIGNMENT_STATUS_COLOR[agreement.status]}>
                  {CONSIGNMENT_STATUS_LABELS[agreement.status] ||
                    agreement.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thời hạn">
                {DURATION_LABEL[agreement.duration] || agreement.duration}
              </Descriptions.Item>
              <Descriptions.Item label="Tỷ lệ hoa hồng">
                {agreement.commissionPercent}%
              </Descriptions.Item>
              <Descriptions.Item label="Giá chấp nhận">
                {agreement.acceptablePrice?.toLocaleString("vi-VN")} ₫
              </Descriptions.Item>
              <Descriptions.Item label="Chi nhánh">
                {agreement.branchName}
              </Descriptions.Item>
              <Descriptions.Item label="Nhân viên phụ trách">
                {agreement.staffName}
              </Descriptions.Item>
              <Descriptions.Item label="Chủ sở hữu">
                {agreement.ownerName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dayjs(agreement.startAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn">
                {dayjs(agreement.expireAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 24,
                gap: 10,
              }}
            >
              <Button onClick={onClose}>Đóng</Button>

              {mode !== "manager" && !isCancelView && (
                <Button danger onClick={onCancelAgreement}>
                  Hủy hợp đồng
                </Button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p>Không có dữ liệu hợp đồng để hiển thị.</p>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default AgreementDetailModal;
