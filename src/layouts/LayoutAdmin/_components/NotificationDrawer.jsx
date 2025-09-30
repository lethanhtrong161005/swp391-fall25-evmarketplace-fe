import React from "react";
import { Drawer, List } from "antd";

export default function NotificationDrawer({ open, onClose, data = [] }) {
  return (
    <Drawer title="Thông báo" open={open} onClose={onClose} width={360}>
      <List
        dataSource={data}
        renderItem={(n) => (
          <List.Item key={n.id}>
            <List.Item.Meta title={n.title} description={n.time} />
          </List.Item>
        )}
      />
    </Drawer>
  );
}
