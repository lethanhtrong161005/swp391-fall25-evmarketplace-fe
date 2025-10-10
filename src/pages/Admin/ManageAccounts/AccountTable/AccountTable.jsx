import React from "react";
import {
  Table,
  Space,
  Button,
  Tag,
  Dropdown,
  Avatar,
  Typography,
  Tooltip,
  Popconfirm,
  Input,
  Card,
  Grid,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  SwapOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import s from "./AccountTable.module.scss";
import { useAccountTable } from "./useAccountTable";
import { useAuth } from "@hooks/useAuth";
import RoleLabel from "@components/RoleLabel/index.jsx";
import ActionButton from "@components/ActionButton";
import {
  canEditAccount,
  canLockAccount,
  getActionTooltip,
} from "@utils/accountPermissions";

const { Text } = Typography;

// Role tag component with color coding - sử dụng RoleLabel component
const RoleTag = ({ role }) => {
  // Debug: Log role để kiểm tra
  console.log("RoleTag received role:", role);

  // Fallback nếu RoleLabel không hoạt động
  const roleLabels = {
    ADMIN: "Quản trị viên",
    MANAGER: "Quản lý",
    INSPECTOR: "Kỹ thuật viên",
    STAFF: "Nhân viên",
    MEMBER: "Thành viên",
    GUEST: "Khách",
  };

  const roleColors = {
    ADMIN: "red",
    MANAGER: "blue",
    INSPECTOR: "orange",
    STAFF: "green",
    MEMBER: "cyan",
    GUEST: "default",
  };

  const label = roleLabels[role] || role;
  const color = roleColors[role] || "default";

  return (
    <Tag color={color} className={s.roleTag}>
      {label}
    </Tag>
  );
};

// Status tag component (Active/Blocked)
const StatusTag = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <Tag
      color={isActive ? "success" : "warning"}
      icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      className={s.statusTag}
    >
      {isActive ? "Hoạt động" : "Bị khóa"}
    </Tag>
  );
};

// Verification badge for phone/email
const VerificationBadge = ({ verified, type }) => (
  <Tooltip
    title={`${type === "phone" ? "Số điện thoại" : "Email"} ${
      verified ? "đã xác minh" : "chưa xác minh"
    }`}
  >
    <div
      className={s.verificationBadge}
      style={{
        background: verified ? "#f6ffed" : "#fff2f0",
        padding: "4px 8px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {type === "phone" ? (
        <PhoneOutlined style={{ fontSize: "12px" }} />
      ) : (
        <MailOutlined style={{ fontSize: "12px" }} />
      )}
      {verified ? (
        <CheckCircleOutlined
          className={s.verified}
          style={{ fontSize: "12px", color: "#52c41a" }}
        />
      ) : (
        <CloseCircleOutlined
          className={s.unverified}
          style={{ fontSize: "12px", color: "#ff4d4f" }}
        />
      )}
    </div>
  </Tooltip>
);

/**
 * Admin Account Management Table Component
 * Displays account list with actions (view, edit, lock/unlock)
 * Security: Admins can only edit their own profile
 */
export default function AccountTable({
  rows,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onChanged,
  onShowDetail,
  onShowEdit,
  onSearch,
}) {
  const { user } = useAuth(); // Current logged in user
  const screens = Grid.useBreakpoint();
  const {
    onChangeRole,
    onToggleLock,
    onShowDetail: handleShowDetail,
    onShowEdit: handleShowEdit,
  } = useAccountTable({ onChanged });

  const [searchValue, setSearchValue] = React.useState("");

  // Handle search input
  const handleSearch = (value) => {
    const trimmedValue = value?.trim();
    onSearch?.({ search: trimmedValue });
  };

  // Safe wrapper for detail view
  const handleDetailClick = (record) => {
    try {
      if (typeof onShowDetail === "function") return onShowDetail(record);
      return handleShowDetail?.(record);
    } catch {
      // Silent error handling
    }
  };

  // Safe wrapper for edit action
  const handleEditClick = (record) => {
    try {
      if (typeof onShowEdit === "function") return onShowEdit(record);
      return handleShowEdit?.(record);
    } catch {
      // Silent error handling
    }
  };

  // Safe wrapper for lock/unlock action
  const handleToggleLock = (record) => {
    try {
      return onToggleLock?.(record);
    } catch {
      // Silent error handling
    }
  };

  // Safe wrapper for role change (currently unused)
  const handleChangeRole = (record, role) => {
    try {
      return onChangeRole?.(record, role);
    } catch {
      // Silent error handling
    }
  };

  // Table columns with responsive widths; hide less-important columns on smaller screens
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      width: screens.xl ? 280 : 240,
      render: (_, record) => (
        <div className={s.userCell}>
          <Avatar
            size={40}
            src={record.profile?.avatarUrl}
            icon={<UserOutlined />}
            className={s.avatar}
            style={{
              backgroundColor:
                record.role === "ADMIN"
                  ? "#f5222d"
                  : record.role === "MANAGER"
                  ? "#1890ff"
                  : record.role === "INSPECTOR"
                  ? "#fa8c16"
                  : record.role === "STAFF"
                  ? "#52c41a"
                  : record.role === "MEMBER"
                  ? "#13c2c2"
                  : "#d9d9d9",
            }}
          />
          <div className={s.userInfo}>
            <Text strong className={s.userName}>
              {record.profile?.fullName || record.phoneNumber}
            </Text>
            <div className={s.userDetails}>
              <Text type="secondary" className={s.userEmail}>
                <MailOutlined className={s.icon} />
                {record.email || "Chưa có email"}
              </Text>
              <Text type="secondary" className={s.userPhone}>
                <PhoneOutlined className={s.icon} />
                {record.phoneNumber}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      key: "role",
      width: 120,
      align: "center",
      render: (_, record) => <RoleTag role={record.role} />,
      responsive: ["sm"],
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 110,
      align: "center",
      render: (_, record) => <StatusTag status={record.status} />,
      responsive: ["sm"],
    },
    {
      title: "Xác minh",
      key: "verification",
      width: 110,
      align: "center",
      render: (_, record) => (
        <Space size={12} direction="vertical">
          <VerificationBadge verified={record.phoneVerified} type="phone" />
          <VerificationBadge verified={record.emailVerified} type="email" />
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      width: 130,
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <Text
            strong
            style={{ fontSize: "13px", color: "rgba(0, 0, 0, 0.85)" }}
          >
            {record.profile?.createdAt
              ? new Date(record.profile.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "—"}
          </Text>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {record.profile?.createdAt
              ? new Date(record.profile.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </div>
      ),
      responsive: ["lg"],
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: screens.xl ? 300 : 260,
      align: "center",
      render: (_, record) => {
        const isActive = record.status === "ACTIVE";
        const isAdmin = record.role === "ADMIN";

        // 🔒 BẢO MẬT: Sử dụng utility functions để kiểm tra quyền hạn
        const canEdit = canEditAccount(user, record);
        const canLock = canLockAccount(user, record);

        // Admin accounts - hiển thị actions đặc biệt
        if (isAdmin) {
          return (
            <div className={s.actionsContainer}>
              <Space size={8} className={s.primaryActions}>
                <Tooltip title="Xem chi tiết tài khoản Admin" placement="top">
                  <ActionButton
                    variant="primary"
                    size="medium"
                    icon={<EyeOutlined />}
                    onClick={() => handleDetailClick(record)}
                  >
                    <span className={s.btnLabel}>Chi tiết</span>
                  </ActionButton>
                </Tooltip>

                <Tooltip
                  title={getActionTooltip("edit", user, record)}
                  placement="top"
                >
                  <ActionButton
                    variant="secondary"
                    size="medium"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(record)}
                    disabled={!canEdit}
                  >
                    <span className={s.btnLabel}>Sửa</span>
                  </ActionButton>
                </Tooltip>
              </Space>
            </div>
          );
        }

        // Primary Actions - Visible on all screen sizes
        const primaryActions = (
          <Space size={8} className={s.primaryActions}>
            <Tooltip title="Xem chi tiết" placement="top">
              <ActionButton
                variant="primary"
                size="medium"
                icon={<EyeOutlined />}
                onClick={() => handleDetailClick(record)}
              >
                <span className={s.btnLabel}>Chi tiết</span>
              </ActionButton>
            </Tooltip>

            <Tooltip
              title={getActionTooltip("edit", user, record)}
              placement="top"
            >
              <ActionButton
                variant="secondary"
                size="medium"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
                disabled={!canEdit}
              >
                <span className={s.btnLabel}>Sửa</span>
              </ActionButton>
            </Tooltip>
          </Space>
        );

        // Lock/Unlock Action with Popconfirm - chỉ hiển thị nếu có quyền
        const lockAction = canLock ? (
          <Popconfirm
            title={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            description={
              isActive
                ? "Bạn có chắc muốn khóa tài khoản này?"
                : "Bạn có chắc muốn mở khóa tài khoản này?"
            }
            onConfirm={() => handleToggleLock(record)}
            okText="Xác nhận"
            cancelText="Hủy"
            okType={isActive ? "danger" : "primary"}
          >
            <Tooltip title={getActionTooltip("lock", user, record)}>
              <ActionButton
                variant={isActive ? "danger" : "success"}
                size="medium"
                icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
              >
                <span className={s.btnLabel}>
                  {isActive ? "Khóa" : "Mở khóa"}
                </span>
              </ActionButton>
            </Tooltip>
          </Popconfirm>
        ) : (
          <Tooltip title={getActionTooltip("lock", user, record)}>
            <ActionButton
              variant={isActive ? "danger" : "success"}
              size="medium"
              icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
              disabled={true}
            >
              <span className={s.btnLabel}>
                {isActive ? "Khóa" : "Mở khóa"}
              </span>
            </ActionButton>
          </Tooltip>
        );

        // More Actions Dropdown - Removed since individual log viewing is moved to global action

        return (
          <div className={s.actionsContainer}>
            {/* Desktop Layout */}
            <div className={s.desktopActions}>
              {primaryActions}
              {lockAction}
            </div>

            {/* Mobile Layout - Dropdown only */}
            <div className={s.mobileActions}>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "detail",
                      label: "Chi tiết",
                      icon: <EyeOutlined />,
                      onClick: () => handleDetailClick(record),
                    },
                    {
                      key: "edit",
                      label: "Sửa",
                      icon: <EditOutlined />,
                      onClick: () => handleEditClick(record),
                    },
                    {
                      key: "changeRole",
                      label: "Đổi vai trò",
                      icon: <SwapOutlined />,
                      disabled: true, // Disable until backend API is available
                      children: [
                        {
                          key: "MANAGER",
                          label: "Đổi thành Quản lý",
                          onClick: () => handleChangeRole(record, "MANAGER"),
                          disabled: true, // Backend API not available
                        },
                        {
                          key: "INSPECTOR",
                          label: "Đổi thành Kỹ thuật viên",
                          onClick: () => handleChangeRole(record, "INSPECTOR"),
                          disabled: true, // Backend API not available
                        },
                        {
                          key: "STAFF",
                          label: "Đổi thành Nhân viên",
                          onClick: () => handleChangeRole(record, "STAFF"),
                          disabled: true, // Backend API not available
                        },
                        {
                          key: "MEMBER",
                          label: "Đổi thành Thành viên",
                          onClick: () => handleChangeRole(record, "MEMBER"),
                          disabled: true, // Backend API not available
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
                      onClick: () => handleToggleLock(record),
                      danger: isActive,
                    },
                  ],
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <ActionButton
                  variant="primary"
                  size="large"
                  icon={<MoreOutlined />}
                >
                  Thao tác
                </ActionButton>
              </Dropdown>
            </div>
          </div>
        );
      },
    },
  ];

  // On smaller screens hide less-important columns to avoid horizontal scroll
  const visibleColumns = React.useMemo(() => {
    let cols = [...columns];
    if (!screens.xl) {
      cols = cols.filter((c) => c.key !== "verification");
    }
    if (!screens.lg) {
      cols = cols.filter((c) => c.key !== "createdAt");
    }
    return cols;
  }, [columns, screens.xl, screens.lg]);

  return (
    <div className={s.tableContainer}>
      {/* Search Bar */}
      <Card size="small" className={s.searchCard} style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          className={s.searchInput}
          style={{ maxWidth: 400 }}
        />
      </Card>

      {/* Account Table */}
      <Table
        rowKey="id"
        columns={visibleColumns}
        dataSource={rows}
        loading={loading}
        pagination={{
          current: page || 1,
          pageSize: pageSize || 10,
          total: total || 0,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong ${total} kết quả`,
          onChange: onPageChange,
          className: s.pagination,
        }}
        className={s.accountTable}
        // Remove forced horizontal scroll; AntD will wrap within container
        scroll={screens.md ? undefined : { x: 900 }}
        rowClassName={(record) =>
          `${s.tableRow} ${
            record.status === "ACTIVE" ? s.activeRow : s.inactiveRow
          }`
        }
      />
    </div>
  );
}
