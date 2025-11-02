import React, { useState } from "react";
import { Modal, Descriptions, Tag, Spin, Button } from "antd";
import dayjs from "dayjs";
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
  onCancelSchedule,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleConfirmCancel = async (reason) => {
    if (!data?.id) return;
    try {
      setLoadingCancel(true);
      await onCancelSchedule(data.id, reason);
      setShowCancelModal(false);
      onClose();
    } catch (err) {
      console.error("Cancel inspection error:", err);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <>
      <Modal
        title="Chi tiết Lịch kiểm định"
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={700}
        className="inspection-schedule-modal"
      >
        <Spin spinning={loading}>
          {data ? (
            <>
              <Descriptions
                bordered={false}
                column={2}
                labelStyle={{ fontWeight: 600 }}
              >
                <Descriptions.Item label="Mã lịch">
                  {data.id}
                </Descriptions.Item>

                <Descriptions.Item label="Trạng thái">
                  <Tag color={INSPECTION_STATUS_COLOR[data.status] || "default"}>
                    {INSPECTION_STATUS_LABELS[data.status] || data.status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Ngày hẹn">
                  {dayjs(data.scheduleDate).format("DD/MM/YYYY")}
                </Descriptions.Item>

                <Descriptions.Item label="Ca làm">
                  {data.shiftCode} ({data.shiftStartTime} - {data.shiftEndTime})
                </Descriptions.Item>

                <Descriptions.Item label="Chi nhánh">
                  {data.branchName || "Không có"}
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
                  {dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>

                {data.cancelledReason && (
                  <Descriptions.Item label="Lý do hủy" span={2}>
                    {data.cancelledReason}
                  </Descriptions.Item>
                )}
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
                <Button
                  danger
                  type="primary"
                  disabled={data?.status !== "SCHEDULED"}
                  onClick={() => setShowCancelModal(true)}
                >
                  Hủy lịch
                </Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p>Không có dữ liệu lịch kiểm định để hiển thị.</p>
            </div>
          )}
        </Spin>
      </Modal>

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
