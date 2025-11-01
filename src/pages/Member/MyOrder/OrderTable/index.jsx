import React from "react";
import s from "./OrderTable.module.scss";
import { Card, Table, Tag, Space, Tooltip, Progress, Button, Grid, Typography, Dropdown, message } from "antd";
import dayjs from "dayjs";
import {
    FileTextOutlined, ClockCircleOutlined, FileDoneOutlined,
    DollarCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
    DownloadOutlined, MoreOutlined
} from "@ant-design/icons";
import { STATUS_META } from "../constants";

const toVnd = (n) =>
    typeof n === "number" ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : n;

const StatusTag = ({ st }) => {
    const meta = STATUS_META[st] || { color: "default", label: st };
    const iconMap = {
        PENDING_PAYMENT: <ClockCircleOutlined />,
        PAID: <DollarCircleOutlined />,
        CONTRACT_SIGNED: <FileDoneOutlined />,
        COMPLETED: <CheckCircleOutlined />,
        CANCELED: <CloseCircleOutlined />,
        PAYMENT_FAILED: <CloseCircleOutlined />,
    };
    return (
        <Tag color={meta.color} icon={iconMap[st]}>
            {meta.label}
        </Tag>
    );
};

function getMemberActions(order) {
    const remain = Math.max(0, Number(order.amount || 0) - Number(order.paidAmount || 0));
    const actions = [{ key: 'detail', label: 'Xem chi tiết', icon: <FileTextOutlined /> }];

    // PENDING_PAYMENT: Show both "Thanh toán ngay" and "Huỷ đơn"
    if (order.status === 'PENDING_PAYMENT' && remain > 0) {
        actions.push(
            { key: 'pay', label: 'Thanh toán ngay', icon: <DollarCircleOutlined /> },
            { key: 'cancel', label: 'Huỷ đơn', icon: <CloseCircleOutlined /> }
        );
    }

    // PAYMENT_FAILED: Allow retry payment
    if (order.status === 'PAYMENT_FAILED' && remain > 0) {
        actions.push({ key: 'pay', label: 'Thanh toán lại', icon: <DollarCircleOutlined /> });
    }

    // CONTRACT_SIGNED and COMPLETED: Show download contract
    if (['CONTRACT_SIGNED', 'COMPLETED'].includes(order.status) || order.contractAvailable) {
        actions.push({ key: 'contract', label: 'Tải hợp đồng', icon: <DownloadOutlined /> });
    }

    return actions;
}

export default function OrderTable({
    loading,
    rows,
    total,
    page,
    size,
    onTableChange,
    onViewDetail,
    onPay,
    onDownloadContract,
    onCancel,
}) {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.xl;
    const { Text } = Typography;

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "orderNo",
            key: "orderNo",
            fixed: "left",
            width: 240,
            onCell: () => ({ style: { whiteSpace: "normal", wordBreak: "break-all" } }),
            render: (val, record) => (
                <Space direction="vertical" size={2} className={s.orderNoCell}>
                    <Tooltip title={val}>
                        <Text className={s.orderNo} code copyable={{ text: val }} ellipsis={{ tooltip: val }}>
                            {val}
                        </Text>
                    </Tooltip>
                    {record?.orderCode != null && (
                        <Tooltip title="orderCode có thể vượt Number.MAX_SAFE_INTEGER trong JS">
                            <span className={s.subtle}>code: {String(record.orderCode)}</span>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
        {
            title: "Sản phẩm",
            dataIndex: "listingTitle",
            key: "listingTitle",
            ellipsis: true,
            width: isMobile ? 220 : 260,
            render: (title, r) => (
                <Space size={4} direction="vertical">
                    <span className={s.strong} title={title}>{title}</span>
                    <span className={s.subtle}>#{r.listingId}</span>
                </Space>
            ),
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            sorter: true,
            width: isMobile ? 120 : 140,
            render: (v) => <span className={s.mono}>{toVnd(v)}</span>,
        },
        {
            title: "Thanh toán",
            dataIndex: "paidAmount",
            key: "paidAmount",
            sorter: true,
            width: isMobile ? 180 : 200,
            render: (_ignored, r) => {
                const pctRaw = r?.paymentProcessPercent ?? (r?.amount ? (r.paidAmount / r.amount) * 100 : 0);
                const pct = Math.min(100, Math.max(0, Math.round(pctRaw)));
                const successStates = new Set(["PAID", "CONTRACT_SIGNED", "COMPLETED"]);
                const exceptionStates = new Set(["CANCELED", "PAYMENT_FAILED"]);
                const progressStatus = exceptionStates.has(r?.status)
                    ? "exception"
                    : successStates.has(r?.status) || pct === 100
                        ? "success"
                        : "active";

                return (
                    <Space direction="vertical" size={0} className={s.payCol}>
                        <Progress percent={pct} size={isMobile ? "small" : "default"} status={progressStatus} />
                        <span className={s.subtle}>{toVnd(r.paidAmount)} / {toVnd(r.amount)}</span>
                    </Space>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 160,
            render: (st) => <StatusTag st={st} />,
        },
        {
            title: "Giữ chỗ đến",
            dataIndex: "reservedUntil",
            key: "reservedUntil",
            sorter: true,
            width: 170,
            responsive: ["lg"],
            render: (v, r) => r.isReservedActive ? dayjs(v).format("DD/MM/YYYY HH:mm") : <span className={s.subtle}>—</span>,
        },
        {
            title: "Tạo lúc",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            defaultSortOrder: "descend",
            width: isMobile ? 150 : 170,
            render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            sorter: true,
            width: 170,
            responsive: ["md"],
            render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Thao tác",
            key: "actions",
            fixed: "right",
            width: 120,
            render: (_, r) => {
                const actions = getMemberActions(r);
                const items = actions.map(action => ({
                    key: action.key,
                    label: action.label,
                    icon: action.icon,
                }));

                const onMenuClick = ({ key, domEvent }) => {
                    domEvent?.stopPropagation?.();
                    if (key === "detail") return onViewDetail?.(r);
                    if (key === "pay") return onPay?.(r);
                    if (key === "contract") return onDownloadContract?.(r);
                    if (key === "cancel") return onCancel?.(r);
                };

                return (
                    <Dropdown
                        menu={{ items, onClick: onMenuClick }}
                        overlayClassName={s.actionMenu}
                        trigger={["click"]}
                        getPopupContainer={() => document.body}
                    >
                        <Button
                            size="small"
                            type="text"
                            className={s.moreBtn}
                            icon={<MoreOutlined />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Dropdown>
                );
            },
        }
    ];

    const tableSize = isMobile ? "small" : (isTablet ? "middle" : "large");
    const scrollX = isMobile ? 900 : 1200;

    return (
        <Card className={s.root} bordered={false}>
            <Table
                rowKey={(r) => r.id}
                size={tableSize}
                loading={loading}
                columns={columns}
                dataSource={rows}
                onChange={onTableChange}
                pagination={{
                    current: page,
                    pageSize: size,
                    total,
                    showSizeChanger: true,
                    pageSizeOptions: isMobile ? [5, 10, 20] : [5, 10, 20, 50],
                    showTotal: (t) => `Tổng ${t} đơn`,
                    showLessItems: isMobile,
                    size: isMobile ? "small" : "default",
                }}
                scroll={{ x: scrollX }}
                sticky
                className={s.table}
            />
        </Card>
    );
}

export function useOrderSorting(defaultField = "createdAt", defaultOrder = "descend") {
    const ReactRef = React;
    const { useState } = ReactRef;
    const [sortField, setSortField] = useState(defaultField);
    const [sortOrder, setSortOrder] = useState(defaultOrder);
    const resetSorting = () => { setSortField(defaultField); setSortOrder(defaultOrder); };
    const applySorter = (sorter) => {
        if (sorter?.field) setSortField(sorter.field);
        if (sorter?.order) setSortOrder(sorter.order); else resetSorting();
    };
    return { sortField, sortOrder, setSortField, setSortOrder, resetSorting, applySorter };
}

export function usePagination(defaultSize = 10) {
    const ReactRef = React;
    const { useState } = ReactRef;
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(defaultSize);
    const applyPagination = (pagination) => {
        setPage(pagination?.current || 1);
        setSize(pagination?.pageSize || defaultSize);
    };
    const resetPagination = () => { setPage(1); setSize(defaultSize); };
    return { page, size, setPage, setSize, applyPagination, resetPagination };
}

export { default as useOrders } from "./useOrders";

