import React from "react";
import { App, Card, Space } from "antd";
import useStaffListing from "./useStaffListing";
import SearchFilters from "./SearchFilters";
import ListingTable from "./ListingTable";
import EmptyState from "./EmptyState";
import s from "./styles.module.scss";

export default function StaffListing() {
    const logic = useStaffListing();
    const { loading, rows, total, page, pageSize } = logic;

    return (

        <div className={s.root}>
            <Space direction="vertical" size={12} className={s.stack}>
                <Card size="small" title="Bộ lọc ký gửi">
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <SearchFilters
                            value={logic.filters}
                            onChange={(patch) => logic.setFilters(f => ({ ...f, ...patch }))}
                            onSubmit={() => logic.refresh()}
                        />
                    </Space>
                </Card>

                {(!loading && total === 0) ? (
                    <EmptyState onRefresh={logic.refresh} />
                ) : (
                    <Card size="small" title={`Danh sách ký gửi (${total?.toLocaleString?.("vi-VN") || 0})`}>
                        <ListingTable
                            rows={rows}
                            loading={loading}
                            page={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={logic.onTableChange}
                        />
                    </Card>
                )}
            </Space>
        </div>

    );
}