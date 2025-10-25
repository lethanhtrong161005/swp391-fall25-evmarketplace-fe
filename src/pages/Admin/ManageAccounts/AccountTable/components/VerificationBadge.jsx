import React from "react";
import { Tooltip } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import s from "../AccountTable.module.scss";

const VerificationBadge = ({ verified, type }) => (
  <Tooltip
    title={`${type === "phone" ? "Số điện thoại" : "Email"} ${
      verified ? "đã xác minh" : "chưa xác minh"
    }`}
  >
    <div
      className={s.verificationBadge}
      style={{
        background: verified ? "#f6ffed" : "#fff2f0",
        padding: "4px 8px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {type === "phone" ? (
        <PhoneOutlined style={{ fontSize: "12px" }} />
      ) : (
        <MailOutlined style={{ fontSize: "12px" }} />
      )}
      {verified ? (
        <CheckCircleOutlined
          className={s.verified}
          style={{ fontSize: "12px", color: "#52c41a" }}
        />
      ) : (
        <CloseCircleOutlined
          className={s.unverified}
          style={{ fontSize: "12px", color: "#ff4d4f" }}
        />
      )}
    </div>
  </Tooltip>
);

export default VerificationBadge;
