import React from "react";
import { Drawer, List } from "antd";
import { useNotificationDrawer } from "./logic";

export default function NotificationDrawer({ open, onClose, data = [] }) {
  const { processedData } = useNotificationDrawer(data);

  return (
    <Drawer title="Thông báo" open={open} onClose={onClose} width={360}>
      <List
        dataSource={processedData}
        renderItem={(n) => (
          <List.Item key={n.id}>
            <List.Item.Meta title={n.title} description={n.time} />
          </List.Item>
        )}
      />
    </Drawer>
  );
}
