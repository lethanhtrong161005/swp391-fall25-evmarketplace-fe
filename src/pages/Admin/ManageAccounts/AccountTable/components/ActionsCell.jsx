import React from "react";
import { Space, Tooltip, Popconfirm, Dropdown } from "antd";
import {
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  MoreOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import ActionButton from "@components/ActionButton";
import {
  canLockAccount,
  getActionTooltip,
} from "@utils/accountPermissions";
import s from "../AccountTable.module.scss";

const ActionsCell = ({
  record,
  user,
  onShowDetail,
  onShowEdit,
  onToggleLock,
  onChangeRole,
}) => {
  const isActive = record.status === "ACTIVE";
  const isAdmin = record.role === "ADMIN";
  const canLock = canLockAccount(user, record);

  const handleDetailClick = () => onShowDetail?.(record);
  const handleToggleLock = () => onToggleLock?.(record);
  const handleChangeRole = (role) => onChangeRole?.(record, role);

  // Admin accounts - special actions
  if (isAdmin) {
    return (
      <div className={s.actionsContainer}>
        <Space size={8} className={s.primaryActions}>
          <Tooltip title="Xem chi tiết tài khoản Admin" placement="top">
            <ActionButton
              variant="primary"
              size="medium"
              icon={<EyeOutlined />}
              onClick={handleDetailClick}
            >
              <span className={s.btnLabel}>Chi tiết</span>
            </ActionButton>
          </Tooltip>

        </Space>
      </div>
    );
  }

  // Primary Actions
  const primaryActions = (
    <Space size={8} className={s.primaryActions}>
      <Tooltip title="Xem chi tiết" placement="top">
        <ActionButton
          variant="primary"
          size="medium"
          icon={<EyeOutlined />}
          onClick={handleDetailClick}
        >
          <span className={s.btnLabel}>Chi tiết</span>
        </ActionButton>
      </Tooltip>

    </Space>
  );

  // Lock/Unlock Action
  const lockAction = canLock ? (
    <Popconfirm
      title={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
      description={
        isActive
          ? "Bạn có chắc muốn khóa tài khoản này?"
          : "Bạn có chắc muốn mở khóa tài khoản này?"
      }
      onConfirm={handleToggleLock}
      okText="Xác nhận"
      cancelText="Hủy"
      okType={isActive ? "danger" : "primary"}
    >
      <Tooltip title={getActionTooltip("lock", user, record)}>
        <ActionButton
          variant={isActive ? "danger" : "primary"}
          size="medium"
          icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
        >
          <span className={s.btnLabel}>{isActive ? "Khóa" : "Mở khóa"}</span>
        </ActionButton>
      </Tooltip>
    </Popconfirm>
  ) : (
    <Tooltip title={getActionTooltip("lock", user, record)}>
      <ActionButton
        variant={isActive ? "danger" : "primary"}
        size="medium"
        icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
        disabled={true}
      >
        <span className={s.btnLabel}>{isActive ? "Khóa" : "Mở khóa"}</span>
      </ActionButton>
    </Tooltip>
  );

  return (
    <div className={s.actionsContainer}>
      {/* Desktop Layout */}
      <div className={s.desktopActions}>
        {primaryActions}
        {lockAction}
      </div>

      {/* Mobile Layout - Dropdown */}
      <div className={s.mobileActions}>
        <Dropdown
          menu={{
            items: [
              {
                key: "detail",
                label: "Chi tiết",
                icon: <EyeOutlined />,
                onClick: handleDetailClick,
              },
              {
                key: "changeRole",
                label: "Đổi vai trò",
                icon: <SwapOutlined />,
                disabled: true,
                children: [
                  {
                    key: "MANAGER",
                    label: "Đổi thành Quản lý",
                    onClick: () => handleChangeRole("MANAGER"),
                    disabled: true,
                  },
                  {
                    key: "INSPECTOR",
                    label: "Đổi thành Kỹ thuật viên",
                    onClick: () => handleChangeRole("INSPECTOR"),
                    disabled: true,
                  },
                  {
                    key: "STAFF",
                    label: "Đổi thành Nhân viên",
                    onClick: () => handleChangeRole("STAFF"),
                    disabled: true,
                  },
                  {
                    key: "MEMBER",
                    label: "Đổi thành Thành viên",
                    onClick: () => handleChangeRole("MEMBER"),
                    disabled: true,
                  },
                ],
              },
              {
                type: "divider",
              },
              {
                key: "lock",
                label: isActive ? "Khóa tài khoản" : "Mở khóa tài khoản",
                icon: isActive ? <LockOutlined /> : <UnlockOutlined />,
                onClick: handleToggleLock,
                danger: isActive,
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <ActionButton variant="primary" size="large" icon={<MoreOutlined />}>
            Thao tác
          </ActionButton>
        </Dropdown>
      </div>
    </div>
  );
};

export default ActionsCell;
