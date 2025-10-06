import React from "react";
import { Button, Card, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import s from "./ManageAccounts.module.scss";
import { useManageAccounts } from "./useManageAccounts";
import AccountTable from "./AccountTable/AccountTable";
import CreateAccountForm from "./CreateAccountForm/CreateAccountForm";
import AccountDetails from "./AccountDetails/AccountDetails";
import EditAccountForm from "./EditAccountForm/EditAccountForm";

const { Title } = Typography;

/**
 * Admin Account Management Page
 * Features: View accounts, create new accounts, edit profiles, lock/unlock accounts
 * Security: Admins can only edit their own profile
 */
export default function ManageAccounts() {
  const {
    loading,
    rows,
    refresh,
    query,
    data,
    setPage,
    handleSearch,
    openCreate,
    setOpenCreate,
    detailRow,
    setDetailRow,
    detailLogs,
    editRow,
    setEditRow,
    onCreateFinish,
    onEditFinish,
  } = useManageAccounts();

  return (
    <div className={s.wrap}>
      <Card
        className={s.pageHeader}
        title={
          <Title level={4} style={{ margin: 0 }}>
            Quản lý tài khoản
          </Title>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenCreate(true)}
              className={s.createButton}
            >
              Tạo tài khoản
            </Button>
          </Space>
        }
      >
        <AccountTable
          rows={rows}
          loading={loading}
          page={query.page}
          pageSize={query.limit}
          total={data?.pagination?.totalRecords || 0}
          onPageChange={setPage}
          onSearch={handleSearch}
          onChanged={refresh}
          onShowDetail={setDetailRow}
          onShowEdit={setEditRow}
        />
      </Card>

      {/* Create Account Form */}
      <CreateAccountForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onFinish={onCreateFinish}
      />

      {/* Account Details */}
      <AccountDetails
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        account={detailRow}
        logs={detailLogs}
        onEdit={setEditRow}
      />

      {/* Edit Account Form */}
      <EditAccountForm
        open={!!editRow}
        onClose={() => setEditRow(null)}
        account={editRow}
        onFinish={onEditFinish}
      />
    </div>
  );
}
