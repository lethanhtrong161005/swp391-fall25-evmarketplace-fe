import React from "react";
import { Button, Card, Space, Typography } from "antd";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import s from "./ManageAccounts.module.scss";
import { useManageAccounts } from "./useManageAccounts";
import AccountTable from "./AccountTable/AccountTable";
import CreateAccountForm from "./CreateAccountForm/CreateAccountForm";
import AccountDetails from "./AccountDetails/AccountDetails";
import EditAccountForm from "./EditAccountForm/EditAccountForm";

const { Title } = Typography;

// Admin Account Management Page - View accounts, create, edit, lock/unlock
export default function ManageAccounts() {
  const {
    loading,
    rows,
    refresh,
    query,
    data,
    setPage,
    handleSearch,
    handleReset,
    openCreate,
    setOpenCreate,
    detailRow,
    setDetailRow,
    detailLogs,
    editRow,
    setEditRow,
    onCreateFinish,
    onEditFinish,
    contextHolder,
  } = useManageAccounts();

  return (
    <div className={s.wrap}>
      {contextHolder}


      <Card
        className={s.pageHeader}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Title level={4} style={{ margin: 0 }}>
              Quản lý tài khoản
            </Title>
            {(query.role || query.status || query.verified !== undefined) && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#1890ff",
                  background: "#e6f7ff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid #91d5ff",
                }}
              >
                {data?.pagination?.totalRecords || 0} kết quả
              </span>
            )}
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<ClearOutlined />}
              onClick={handleReset}
              disabled={
                !query.role && !query.status && query.verified === undefined
              }
              className={s.clearFilterButton}
            >
              Xóa bộ lọc
            </Button>
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
          pageSize={query.size}
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
