import React from "react";
import { Space } from "antd";
import { Grid } from "antd";
import RoleTag from "../components/RoleTag";
import StatusTag from "../components/StatusTag";
import VerificationBadge from "../components/VerificationBadge";
import UserCell from "../components/UserCell";
import CreatedDateCell from "../components/CreatedDateCell";
import ActionsCell from "../components/ActionsCell";

const { useBreakpoint } = Grid;

export const useAccountTableColumns = ({
  user,
  onShowDetail,
  onShowEdit,
  onToggleLock,
  onChangeRole,
}) => {
  const screens = useBreakpoint();

  // Filter columns based on screen size
  const visibleColumns = React.useMemo(() => {
    const columns = [
      {
        title: "Người dùng",
        dataIndex: "name",
        key: "name",
        width: screens.xl ? 280 : 240,
        render: (_, record) => <UserCell record={record} />,
      },
      {
        title: "Vai trò",
        key: "role",
        dataIndex: "role",
        width: 120,
        align: "center",
        render: (_, record) => <RoleTag role={record.role} />,
        responsive: ["sm"],
      },
      {
        title: "Trạng thái",
        key: "status",
        dataIndex: "status",
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
        dataIndex: "createdAt",
        width: 130,
        align: "center",
        render: (_, record) => <CreatedDateCell record={record} />,
        responsive: ["lg"],
      },
      {
        title: "Thao tác",
        key: "actions",
        fixed: "right",
        width: screens.xl ? 300 : 260,
        align: "center",
        render: (_, record) => (
          <ActionsCell
            record={record}
            user={user}
            onShowDetail={onShowDetail}
            onShowEdit={onShowEdit}
            onToggleLock={onToggleLock}
            onChangeRole={onChangeRole}
          />
        ),
      },
    ];

    let cols = [...columns];
    if (!screens.xl) {
      cols = cols.filter((c) => c.key !== "verification");
    }
    if (!screens.lg) {
      cols = cols.filter((c) => c.key !== "createdAt");
    }
    return cols;
  }, [
    screens.xl,
    screens.lg,
    user,
    onShowDetail,
    onShowEdit,
    onToggleLock,
    onChangeRole,
  ]);

  return visibleColumns;
};
