import { Table, Tag, Space, Button, Tooltip, Popconfirm, Dropdown, Modal } from "antd";
import {
    EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined,
    CloudOutlined, CreditCardOutlined, FieldTimeOutlined, RollbackOutlined,
    MoreOutlined
} from "@ant-design/icons";
import styles from "./ListingTable.module.scss";
import { fmtVN, getPurgeInfo } from "@utils/formatDate.js";

const ICONS = {
    view: <EyeOutlined />,
    hide: <EyeInvisibleOutlined />,
    pay: <CreditCardOutlined />,
    edit: <EditOutlined />,
    extend: <FieldTimeOutlined />,
    restore: <RollbackOutlined />,
    delete: <DeleteOutlined />,
};

const ListingTable = ({
    items, onView, onEdit, onDelete, onPay, onRestore,
    pagination, onChange, deletingId, isTrash = false
}) => {
    const statusLabel = (s, r) => ({
        ACTIVE: "Đang hiển thị", PENDING: "Chờ duyệt",
        APPROVED: "Chờ thanh toán", REJECTED: "Bị từ chối",
        EXPIRED: "Hết hạn", HIDDEN: "Đã ẩn", SOFT_DELETED: "Đã xoá",
        DRAFT: r?._localDraft ? "Nháp (máy)" : "Tin nháp",
    }[s] || s);

    const statusColor = (s) =>
        s === "ACTIVE" ? "green"
            : s === "APPROVED" ? "blue"
                : s === "PENDING" ? "gold"
                    : s === "REJECTED" ? "red"
                        : s === "EXPIRED" ? "volcano"
                            : s === "SOFT_DELETED" ? "magenta"
                                : "default";

    const dateLine = (label, val, className) => (
        <div className={styles.timeRow}>
            <span className={styles.timeLabel}>{label}</span>
            <span className={className || styles.timeVal}>{val || "—"}</span>
        </div>
    );

    /** --------- 1) Unified rules: status → actions ---------- */
    const computeActions = (r) => {
        const s = String(r?.status || "").toUpperCase();

        if (isTrash || s === "SOFT_DELETED") {
            // Thùng rác chỉ cho khôi phục (có thể thêm "xoá vĩnh viễn" sau)
            return ["restore"];
        }

        switch (s) {
            case "APPROVED": return ["pay", "delete"];
            case "PENDING":
            case "REJECTED": return ["edit", "delete"];
            case "EXPIRED": return ["extend", "delete"];
            case "HIDDEN": return ["restore", "delete"];
            case "ACTIVE": return ["view", "hide"];
            default: return ["view"];
        }
    };

    /** --------- 2) Unified handlers ---------- */
    const invokeAction = (key, r) => {
        switch (key) {
            case "view": onView?.(r); break;
            case "hide": onRestore?.(r, "hide"); break;         
            case "pay": onPay?.(r); break;
            case "edit": onEdit?.(r); break;
            case "extend": onEdit?.(r); break;                    
            case "restore": onRestore?.(r, "restore"); break;       
            case "delete":
                Modal.confirm({
                    title: "Xoá bài đăng",
                    content: <>Bạn chắc chắn muốn xoá <b>{r.title}</b>?<br />Bài sẽ chuyển sang “Đã xoá”.</>,
                    okText: "Xoá",
                    cancelText: "Huỷ",
                    okButtonProps: { danger: true },
                    onOk: () => onDelete?.(r),
                });
                break;
            default: break;
        }
    };

    /** --------- 3) Desktop actions (dựa trên computeActions) ---------- */
    const DesktopActions = ({ r }) => {
        const actions = computeActions(r);

        const ButtonByKey = ({ keyAct }) => {
            if (keyAct === "delete") {
                return (
                    <Popconfirm
                        title="Xoá bài đăng"
                        description={<>Bạn chắc chắn muốn xoá <b>{r.title}</b>?<br />Bài sẽ chuyển sang “Đã xoá”.</>}
                        okText="Xoá" cancelText="Huỷ"
                        okButtonProps={{ danger: true, loading: deletingId === r.id }}
                        onConfirm={() => onDelete?.(r)}
                        getPopupContainer={() => document.body}
                        zIndex={10000}
                    >
                        <Button size="small" danger icon={ICONS.delete} loading={deletingId === r.id}>
                            <span className={styles.btnLabel}>Xoá</span>
                        </Button>
                    </Popconfirm>
                );
            }

            if (keyAct === "pay") {
                return (
                    <Tooltip title="Thanh toán để kích hoạt tin">
                        <Button size="small" type="primary" icon={ICONS.pay} onClick={() => onPay?.(r)}>
                            <span className={styles.btnLabel}>Thanh toán</span>
                        </Button>
                    </Tooltip>
                );
            }

            const labelMap = {
                view: "Xem",
                hide: "Ẩn",
                edit: "Sửa",
                extend: "Gia hạn",
                restore: "Khôi phục",
            };
            const onClickMap = {
                view: () => onView?.(r),
                hide: () => onRestore?.(r, "hide"),
                edit: () => onEdit?.(r),
                extend: () => onEdit?.(r),
                restore: () => onRestore?.(r, "restore"),
            };

            return (
                <Button size="small" icon={ICONS[keyAct]} onClick={onClickMap[keyAct]}>
                    <span className={styles.btnLabel}>{labelMap[keyAct]}</span>
                </Button>
            );
        };

        return (
            <div className={styles.actions}>
                {actions.map((k) => <ButtonByKey key={k} keyAct={k} />)}
            </div>
        );
    };

    /** --------- 4) Mobile menu (dựa trên cùng computeActions) ---------- */
    const ActionCell = ({ r }) => {
        const actions = computeActions(r);
        const menu = {
            items: actions.map((k) => ({
                key: k,
                icon: ICONS[k],
                label:
                    k === "view" ? "Xem" :
                        k === "hide" ? "Ẩn" :
                            k === "pay" ? "Thanh toán" :
                                k === "edit" ? "Sửa" :
                                    k === "extend" ? "Gia hạn" :
                                        k === "restore" ? "Khôi phục" :
                                            k === "delete" ? <span style={{ color: "#ff4d4f" }}>Xoá</span> : k,
            })),
            onClick: ({ key }) => invokeAction(key, r),
        };

        return (
            <div className={styles.actionCell}>
                <div className={styles.desktopOnly}><DesktopActions r={r} /></div>
                <div className={styles.mobileOnly}>
                    <Dropdown menu={menu} placement="bottomRight" trigger={["click"]}>
                        <Button size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                </div>
            </div>
        );
    };

    const columns = [
        {
            title: "Mã tin",
            dataIndex: "id",
            width: 120,
            ellipsis: true,
            responsive: ["md"],
            render: (v, r) => (
                <Space>
                    {r._localDraft && (
                        <Tooltip title="Nháp cục bộ">
                            <CloudOutlined style={{ opacity: 0.7 }} />
                        </Tooltip>
                    )}
                    <span className={styles.idText}>{v}</span>
                </Space>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            ellipsis: true,
            render: (_, r) => (
                <div className={styles.titleCell}>
                    <div className={styles.title} title={r.title}>{r.title}</div>
                    {/* FIX template string thiếu $ */}
                    <div className={styles.sub} title={`${r.category} • ${r.location}`}>
                        {r.category} • {r.location}
                    </div>
                </div>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            width: 120,
            align: "right",
            ellipsis: true,
            render: (v) =>
                (Number(v) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
        },
        {
            title: "Thời gian",
            key: "times",
            width: 260,
            ellipsis: true,
            render: (_, r) => {
                const { deadline, leftDays } = getPurgeInfo(r);
                return (
                    <div className={styles.timeCol}>
                        {dateLine("Tạo", r.createdAtDisplay)}
                        {dateLine("Sửa", r.updatedAtDisplay)}
                        {dateLine("Hết hạn", r.expiresAtDisplay, r.expiresAt ? styles.timeWarn : undefined)}
                        <div className={styles.hideOnSm}>
                            {dateLine("Nổi bật", r.promotedUntilDisplay)}
                        </div>

                        {r.status === "SOFT_DELETED" && (
                            <>
                                {dateLine("Xoá vĩnh viễn", fmtVN(deadline), styles.timeDanger)}
                                {dateLine("Còn", (leftDays ?? "—") + " ngày", styles.timeWarn)}
                            </>
                        )}
                    </div>
                );
            },
            sorter: (a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 120,
            ellipsis: true,
            render: (s, r) => <Tag className={styles.statusTag} color={statusColor(s)}>{statusLabel(s, r)}</Tag>,
        },
        {
            title: "Thao tác",
            key: "action",
            width: 240,
            render: (_, r) => <ActionCell r={r} />,
        },
    ];

    return (
        <div className={styles.container}>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                pagination={pagination}
                onChange={onChange}
                size="middle"
                tableLayout="fixed"
                scroll={{ x: 800 }}
                sticky
            />
        </div>
    );
};

export default ListingTable;
