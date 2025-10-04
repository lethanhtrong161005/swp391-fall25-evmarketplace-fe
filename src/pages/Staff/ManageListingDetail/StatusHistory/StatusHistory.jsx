import React from "react";
import { Card, Timeline } from "antd";
import StatusTag from "../../ManageListing/StatusTag/StatusTag";
import s from "./StatusHistory.module.scss";
import { useStatusHistory } from "./logic";

export default function StatusHistory({ items = [] }) {
  const { normalizedItems } = useStatusHistory(items);

  return (
    <Card size="small" title="Lịch sử trạng thái">
      <Timeline
        items={normalizedItems.map((h) => ({
          key: h.key,
          color: "blue",
          label: h.at,
          children: (
            <div>
              <div className={s.statusFlow}>
                <StatusTag status={h.from} />
                <span className={s.arrow}>→</span>
                <StatusTag status={h.to} />
              </div>
              <div className={s.metaInfo}>
                bởi {h.by} {h.note ? `• ${h.note}` : ""}
              </div>
            </div>
          ),
        }))}
      />
    </Card>
  );
}
