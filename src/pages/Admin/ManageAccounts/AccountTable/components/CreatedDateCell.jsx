import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const CreatedDateCell = ({ record }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
    }}
  >
    <Text strong style={{ fontSize: "13px", color: "rgba(0, 0, 0, 0.85)" }}>
      {record.profile?.createdAt
        ? new Date(record.profile.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "—"}
    </Text>
    <Text type="secondary" style={{ fontSize: "11px" }}>
      {record.profile?.createdAt
        ? new Date(record.profile.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""}
    </Text>
  </div>
);

export default CreatedDateCell;
