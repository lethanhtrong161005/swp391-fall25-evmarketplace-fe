import React from "react";
import { Tag } from "antd";
import s from "../ListingTable/ListingTable.module.scss";
import { useStatusTag } from "./useStatusTag";

export default function StatusTag({ status }) {
  const { statusConfig } = useStatusTag(status);

  return (
    <Tag color={statusConfig.color} className={s.uniformPill}>
      {statusConfig.label}
    </Tag>
  );
}
