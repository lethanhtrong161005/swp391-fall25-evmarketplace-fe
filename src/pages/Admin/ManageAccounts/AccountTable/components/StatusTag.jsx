import React from "react";
import { Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import s from "../AccountTable.module.scss";

const StatusTag = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <Tag
      color={isActive ? "success" : "warning"}
      icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      className={s.statusTag}
      style={{
        color: isActive ? "#389e0d" : "#d46b08", // Darker text color for better visibility
        fontWeight: 500,
      }}
    >
      {isActive ? "Hoạt động" : "Bị khóa"}
    </Tag>
  );
};

export default StatusTag;
