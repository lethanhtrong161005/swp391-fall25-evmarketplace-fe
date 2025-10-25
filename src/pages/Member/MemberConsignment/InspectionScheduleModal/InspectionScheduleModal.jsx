import React from "react";
import { Modal, Descriptions, Tag, Spin } from "antd";
import "./InspectionScheduleModal.scss";
import { INSPECTION_STATUS_COLOR, INSPECTION_STATUS_LABELS } from "../../../../utils/constants";



const InspectionScheduleModal = ({ open, onClose, data, loading }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
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
  );
};

export default InspectionScheduleModal;
