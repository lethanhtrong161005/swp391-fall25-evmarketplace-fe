import React from "react";
import { Tag } from "antd";

export default function YesNoTag({ value }) {
  return value ? (
    <Tag color="green" style={{ borderRadius: 999, paddingInline: 10 }}>
      Có
    </Tag>
  ) : (
    <Tag style={{ borderRadius: 999, paddingInline: 10 }}>Không</Tag>
  );
}
