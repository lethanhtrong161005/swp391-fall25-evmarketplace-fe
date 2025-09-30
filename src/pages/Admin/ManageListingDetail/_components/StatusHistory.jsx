import React from "react";
import { Card, Timeline } from "antd";
import StatusTag from "../../ManageListing/_components/StatusTag";

// Timeline của AntD để hiển thị log theo thứ tự thời gian. :contentReference[oaicite:8]{index=8}
export default function StatusHistory({ items = [] }) {
  const normalized = (items || []).map((h) => ({
    key: h.id || `${h.listingId}-${h.at}`,
    at: h.at,
    from: h.from_status ?? h.from ?? "",
    to: h.to_status ?? h.to ?? "",
    by: h.by_name ?? h.by ?? "—",
    note: h.note,
  }));

  return (
    <Card size="small" title="Lịch sử trạng thái">
      <Timeline
        items={normalized.map((h) => ({
          key: h.key,
          color: "blue",
          label: h.at,
          children: (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StatusTag status={h.from} />{" "}
                <span style={{ opacity: 0.7 }}>→</span>{" "}
                <StatusTag status={h.to} />
              </div>
              <div style={{ color: "rgba(0,0,0,0.65)" }}>
                bởi {h.by} {h.note ? `• ${h.note}` : ""}
              </div>
            </div>
          ),
        }))}
      />
    </Card>
  );
}
