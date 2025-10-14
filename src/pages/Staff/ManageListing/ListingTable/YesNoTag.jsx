import React from "react";
import { Tag } from "antd";
import s from "./ListingTable.module.scss";

export default function YesNoTag({ value }) {
  return value ? (
    <Tag color="green" className={s.uniformYesNo}>
      Có
    </Tag>
  ) : (
    <Tag className={s.uniformYesNo}>Không</Tag>
  );
}
