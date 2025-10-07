import React from "react";
import { Tag } from "antd";
import s from "./StatusTag.module.scss";
import { useStatusTag } from "./useStatusTag";

export default function StatusTag({ status }) {
  const { statusConfig } = useStatusTag(status);

  return (
    <Tag color={statusConfig.color} className={s.statusTag}>
      {statusConfig.label}
    </Tag>
  );
}
