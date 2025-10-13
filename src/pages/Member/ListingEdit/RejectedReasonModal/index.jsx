import React from "react";
import { Modal, Alert, Descriptions, Tag } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const fmt = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

export default function RejectedReasonModal({
    open,
    onClose,
    reason,
    rejectedAt,
}) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={onClose}
            okText="Đã hiểu"
            cancelButtonProps={{ style: { display: "none" } }}
            title={
                <span>
                    <InfoCircleOutlined style={{ marginRight: 8, color: "#fa541c" }} />
                    Lý do bị từ chối
                </span>
            }
            width={600}
        >
            <Alert
                type="error"
                message={
                    <span>
                        Trạng thái: <Tag color="red">REJECTED</Tag>
                    </span>
                }
                description="Vui lòng xem lý do, chỉnh sửa nội dung và gửi lại."
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Descriptions bordered size="small" column={1} labelStyle={{ width: 180, fontWeight: 600 }}>
                <Descriptions.Item label="Thời điểm từ chối">{fmt(rejectedAt)}</Descriptions.Item>
                <Descriptions.Item label="Lý do">{reason || "—"}</Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}
