import React from "react";
import {
  Drawer,
  Descriptions,
  Space,
  Button,
  Typography,
  Tag,
  Timeline,
} from "antd";
import { EditOutlined, HistoryOutlined } from "@ant-design/icons";
import s from "./AccountDetails.module.scss";
import { useAccountDetails } from "./useAccountDetails.jsx";

const { Title } = Typography;

export default function AccountDetails({
  open,
  onClose,
  account,
  logs,
  onEdit,
}) {
  const { formatDate, getRoleTag, getStatusTag } = useAccountDetails();

  if (!account) return null;

  return (
    <Drawer
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết tài khoản
          </Title>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(account)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      }
      open={open}
      onClose={onClose}
      width={600}
      className={s.drawer}
    >
      <div className={s.content}>
        <Descriptions
          title="Thông tin tài khoản"
          bordered
          column={1}
          className={s.descriptions}
        >
          <Descriptions.Item label="ID">{account.id}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {account.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{account.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {getRoleTag(account.role)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(account.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Xác thực SĐT">
            {account.phoneVerified ? "Đã xác thực" : "Chưa"}
          </Descriptions.Item>
          <Descriptions.Item label="Xác thực Email">
            {account.emailVerified ? "Đã xác thực" : "Chưa"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {(() => {
              const date =
                account.createdAt ||
                account.created_at ||
                account.profile?.createdAt ||
                account.profile?.created_at;
              return formatDate(date) || "—";
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {(() => {
              const date =
                account.updatedAt ||
                account.updated_at ||
                account.profile?.updatedAt ||
                account.profile?.updated_at;
              return formatDate(date) || "—";
            })()}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="Thông tin cá nhân"
          bordered
          column={1}
          className={s.descriptions}
        >
          <Descriptions.Item label="Họ tên">
            {account.profile?.fullName || account.fullName || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Tỉnh/Thành phố">
            {account.profile?.province || account.province || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {account.profile?.addressLine || account.addressLine || "—"}
          </Descriptions.Item>
        </Descriptions>
        {logs && logs.length > 0 && (
          <div className={s.logsSection}>
            <Title level={5}>
              <HistoryOutlined /> Lịch sử hoạt động
            </Title>
            <Timeline
              items={logs.map((log) => ({
                children: (
                  <div>
                    <div className={s.logAction}>{log.action}</div>
                    <div className={s.logTime}>{formatDate(log.createdAt)}</div>
                    {log.note && <div className={s.logNote}>{log.note}</div>}
                  </div>
                ),
                color:
                  log.type === "success"
                    ? "green"
                    : log.type === "warning"
                    ? "orange"
                    : "blue",
              }))}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
}
