import React from "react";
import { Button, Card, Space, Typography } from "antd";
import { PlusOutlined, HistoryOutlined } from "@ant-design/icons";
import s from "./style.module.scss";
import { useManageAccounts } from "./logic";
import AccountTable from "./AccountTable";
import CreateAccountForm from "./CreateAccountForm";
import AccountDetails from "./AccountDetails";
import EditAccountForm from "./EditAccountForm";

const { Title } = Typography;

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
    onCreateFinish,
    detailRow,
    setDetailRow,
    detailLogs,
    editRow,
    setEditRow,
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
              icon={<HistoryOutlined />}
              onClick={() => {
                // TODO: Implement global log viewing functionality
                console.log("View all account logs");
              }}
              className={s.actionButton}
            >
              Xem log chung
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
