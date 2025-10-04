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
} from "@ant-design/icons";
import s from "./AccountTable.module.scss";
import { useAccountTable } from "./logic";

const { Text } = Typography;

const RoleTag = ({ role }) => {
  const roleConfig = {
    ADMIN: { color: "#f5222d", text: "Quản trị viên" },
    STAFF: { color: "#1890ff", text: "Nhân viên" },
    MEMBER: { color: "#52c41a", text: "Thành viên" },
  };

  const config = roleConfig[role] || { color: "#d9d9d9", text: role };

  return (
    <Tag color={config.color} className={s.roleTag}>
      {config.text}
    </Tag>
  );
};

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

const VerificationBadge = ({ verified, type }) => (
  <Tooltip title={`${type} ${verified ? "đã xác minh" : "chưa xác minh"}`}>
    <span className={s.verificationBadge}>
      {type === "phone" ? <PhoneOutlined /> : <MailOutlined />}
      {verified ? (
        <CheckCircleOutlined className={s.verified} />
      ) : (
        <CloseCircleOutlined className={s.unverified} />
      )}
    </span>
  </Tooltip>
);

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
}) {
  const {
    onChangeRole,
    onToggleLock,
    onShowDetail: handleShowDetail,
    onShowEdit: handleShowEdit,
  } = useAccountTable({ onChanged });

  // Wrapper handlers provide a single place to log and call either prop handlers
  const handleDetailClick = (record) => {
    console.log("AccountTable: detail click", record?.id);
    try {
      if (typeof onShowDetail === "function") return onShowDetail(record);
      return handleShowDetail?.(record);
    } catch (err) {
      console.error("Error in handleDetailClick:", err);
    }
  };

  const handleEditClick = (record) => {
    console.log("AccountTable: edit click", record?.id);
    try {
      if (typeof onShowEdit === "function") return onShowEdit(record);
      return handleShowEdit?.(record);
    } catch (err) {
      console.error("Error in handleEditClick:", err);
    }
  };

  const handleToggleLock = (record) => {
    console.log("AccountTable: toggle lock", record?.id);
    try {
      return onToggleLock?.(record);
    } catch (err) {
      console.error("Error in handleToggleLock:", err);
    }
  };

  const handleChangeRole = (record, role) => {
    console.log("AccountTable: change role", record?.id, role);
    try {
      return onChangeRole?.(record, role);
    } catch (err) {
      console.error("Error in handleChangeRole:", err);
    }
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (_, record) => (
        <div className={s.userCell}>
          <Avatar
            size={40}
            src={record.profile?.avatar_url}
            icon={<UserOutlined />}
            className={s.avatar}
            style={{
              backgroundColor:
                record.role === "ADMIN"
                  ? "#f5222d"
                  : record.role === "STAFF"
                  ? "#1890ff"
                  : "#52c41a",
            }}
          />
          <div className={s.userInfo}>
            <Text strong className={s.userName}>
              {record.profile?.full_name || record.phone_number}
            </Text>
            <div className={s.userDetails}>
              <Text type="secondary" className={s.userEmail}>
                <MailOutlined className={s.icon} />
                {record.email || "Chưa có email"}
              </Text>
              <Text type="secondary" className={s.userPhone}>
                <PhoneOutlined className={s.icon} />
                {record.phone_number}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      key: "role",
      width: 140,
      align: "center",
      render: (_, record) => <RoleTag role={record.role} />,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => <StatusTag status={record.status} />,
    },
    {
      title: "Xác minh",
      key: "verification",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          <VerificationBadge verified={record.verified_phone} type="phone" />
          <VerificationBadge verified={record.verified_email} type="email" />
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 140,
      align: "center",
      render: (value) => (
        <Text type="secondary" className={s.dateText}>
          {value ? new Date(value).toLocaleDateString("vi-VN") : "—"}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 320,
      align: "center",
      render: (_, record) => {
        const isActive = record.status === "ACTIVE";

        // Primary Actions - Visible on all screen sizes
        const primaryActions = (
          <Space size={8} className={s.primaryActions}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleDetailClick(record)}
              className={s.primaryButton}
              size="small"
            >
              Chi tiết
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
              className={s.primaryButton}
              size="small"
            >
              Sửa
            </Button>
          </Space>
        );

        // Role Change Action
        const roleChangeAction = (
          <Dropdown
            menu={{
              items: [
                {
                  key: "STAFF",
                  label: "Đổi thành Nhân viên",
                  onClick: () => handleChangeRole(record, "STAFF"),
                  disabled: record.role === "STAFF",
                },
                {
                  key: "MEMBER",
                  label: "Đổi thành Thành viên",
                  onClick: () => handleChangeRole(record, "MEMBER"),
                  disabled: record.role === "MEMBER",
                },
              ],
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              icon={<SwapOutlined />}
              className={s.primaryButton}
              size="small"
            >
              Đổi vai trò
            </Button>
          </Dropdown>
        );

        // Lock/Unlock Action with Popconfirm
        const lockAction = (
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
            <Button
              type="text"
              icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
              className={`${s.lockButton} ${
                isActive ? s.lockDanger : s.lockSuccess
              }`}
              size="small"
            >
              {isActive ? "Khóa" : "Mở khóa"}
            </Button>
          </Popconfirm>
        );

        // More Actions Dropdown - Removed since individual log viewing is moved to global action

        return (
          <div className={s.actionsContainer}>
            {/* Desktop Layout */}
            <div className={s.desktopActions}>
              {primaryActions}
              {roleChangeAction}
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
                      children: [
                        {
                          key: "STAFF",
                          label: "Đổi thành Nhân viên",
                          onClick: () => handleChangeRole(record, "STAFF"),
                          disabled: record.role === "STAFF",
                        },
                        {
                          key: "MEMBER",
                          label: "Đổi thành Thành viên",
                          onClick: () => handleChangeRole(record, "MEMBER"),
                          disabled: record.role === "MEMBER",
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
                <Button
                  type="primary"
                  icon={<MoreOutlined />}
                  className={s.mobileActionButton}
                >
                  Thao tác
                </Button>
              </Dropdown>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className={s.tableContainer}>
      <Table
        rowKey="id"
        columns={columns}
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
        scroll={{ x: 1300 }}
        rowClassName={(record) =>
          `${s.tableRow} ${
            record.status === "ACTIVE" ? s.activeRow : s.inactiveRow
          }`
        }
      />
    </div>
  );
}
