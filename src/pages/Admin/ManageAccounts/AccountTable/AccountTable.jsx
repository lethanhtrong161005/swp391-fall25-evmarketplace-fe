import React from "react";
import { Table, Grid } from "antd";
import s from "./AccountTable.module.scss";
import { useAccountTable } from "./useAccountTable";
import { useAuth } from "@hooks/useAuth";
import { useAccountTableColumns } from "./hooks/useAccountTableColumns";
import SearchBar from "./components/SearchBar";

const { useBreakpoint } = Grid;

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
  const { user } = useAuth();
  const screens = useBreakpoint();
  const { onToggleLock, onChangeRole } = useAccountTable({ onChanged });

  const columns = useAccountTableColumns({
    user,
    onShowDetail,
    onShowEdit,
    onToggleLock,
    onChangeRole,
  });

  return (
    <div className={s.tableContainer}>
      <SearchBar onSearch={onSearch} />

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
