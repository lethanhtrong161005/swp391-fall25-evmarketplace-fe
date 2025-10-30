import React from "react";
import { Tabs } from "antd";
import styles from "./StatusTabs.module.scss";

const StatusTabs = ({ tabs, counts, activeKey, onChange }) => {
  const items = tabs.map((t) => {
    let total = 0;

    if (Array.isArray(t.statuses) && t.statuses.length > 0) {
      total = t.statuses.reduce((sum, st) => sum + (counts?.[st] || 0), 0);
    } else {
      total = counts?.[t.key] || 0;
    }
    return {
      key: t.key,
      label: (
        <span className={styles.label}>
          {t.label} ({total})
        </span>
      ),
    };
  });
  return (
    <div className={styles.container}>
      <Tabs
        items={items}
        activeKey={activeKey}
        onChange={onChange}
        tabBarGutter={15}
      />
    </div>
  );
};

export default StatusTabs;
