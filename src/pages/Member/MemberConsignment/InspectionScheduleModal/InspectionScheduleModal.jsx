import React, { useState } from "react";
import { Modal, Descriptions, Tag, Spin, Button } from "antd";
import "./InspectionScheduleModal.scss";
import {
  INSPECTION_STATUS_COLOR,
  INSPECTION_STATUS_LABELS,
} from "../../../../utils/constants";
import CancelInspectionModal from "../../../../components/CancelInspectionModal/CancelInspectionModal";

const InspectionScheduleModal = ({
  open,
  onClose,
  data,
  loading,
  onCancelSchedule, // ✅ callback từ parent (useManagerConsignment)
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleConfirmCancel = async (reason) => {
    if (!data?.id) return;
    try {
      setLoadingCancel(true);
      await onCancelSchedule(data.id, reason); // Gọi API hủy
      setShowCancelModal(false);
      onClose(); // Đóng modal lịch
    } catch (err) {
      console.error("Cancel inspection error:", err);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <>
      {/* 🔹 Modal chính hiển thị thông tin lịch kiểm định */}
      <Modal
        open={open}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose}>Đóng</Button>
            <Button
              danger
              type="primary"
              style={{ marginLeft: 8 }}
              disabled={data?.status !== "SCHEDULED"}
              onClick={() => setShowCancelModal(true)} // mở modal nhập lý do
            >
              Hủy lịch
            </Button>
          </div>
        }
        title="Thông tin lịch kiểm định"
        width={650}
        className="modal"
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : data ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Ngày hẹn">
              {data.scheduleDate}
            </Descriptions.Item>
            <Descriptions.Item label="Ca làm">
              {data.shiftCode} ({data.shiftStartTime} - {data.shiftEndTime})
            </Descriptions.Item>
            <Descriptions.Item label="Chi nhánh">
              {data.branchName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={INSPECTION_STATUS_COLOR[data.status] || "default"}>
                {INSPECTION_STATUS_LABELS[data.status] || data.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Người lên lịch">
              {data.scheduledByName || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Người kiểm định">
              {data.staffName || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {data.note || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(data.createdAt).toLocaleString()}
            </Descriptions.Item>
            {data.cancelledReason && (
              <Descriptions.Item label="Lý do hủy">
                {data.cancelledReason}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <p style={{ textAlign: "center" }}>Không có dữ liệu lịch hẹn.</p>
        )}
      </Modal>

      {/* 🔹 Modal nhập lý do (dùng lại component bạn đã có) */}
      <CancelInspectionModal
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        loading={loadingCancel}
      />
    </>
  );
};

export default InspectionScheduleModal;
