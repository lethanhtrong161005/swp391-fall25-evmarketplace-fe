import { Table, Tag, Space, Button, Tooltip } from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    CloudOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import styles from "./ListingTable.module.scss";

const ListingTable = ({ items, onView, onEdit, onDelete, onPay, pagination, onChange }) => {
    const columns = [
        {
            title: "Mã tin",
            dataIndex: "id",
            width: 160,
            render: (v, r) => (
                <Space>
                    {r._localDraft && (
                        <Tooltip title="Nháp cục bộ">
                            <CloudOutlined style={{ opacity: 0.7 }} />
                        </Tooltip>
                    )}
                    <span>{v}</span>
                </Space>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            render: (_, r) => (
                <div className={styles.titleCell}>
                    <div className={styles.title}>{r.title}</div>
                    <div className={styles.sub}>{r.category} • {r.location}</div>
                </div>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            width: 160,
            render: (v) =>
                (Number(v) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        { title: "Cập nhật", dataIndex: "updatedAt", width: 180 },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 160,
            render: (s, r) => {
                const map = {
                    ACTIVE: "Đang hiển thị",
                    PENDING: "Chờ duyệt",
                    APPROVED: "Đã duyệt (chờ thanh toán)",
                    REJECTED: "Bị từ chối",
                    EXPIRED: "Hết hạn",
                    SOLD: "Đã bán",
                    RESERVED: "Đang giữ chỗ",
                    HIDDEN: "Đã ẩn",
                    DRAFT: r._localDraft ? "Nháp (trên máy)" : "Tin nháp",
                };
                const color =
                    s === "ACTIVE" ? "green" :
                        s === "APPROVED" ? "blue" :
                            s === "PENDING" ? "gold" :
                                s === "REJECTED" ? "red" : "default";
                return <Tag color={color}>{map[s] || s}</Tag>;
            },
        },
        {
            title: "Thao tác",
            key: "action",
            width: 320,
            render: (_, r) => {
                if (r.status === "APPROVED") {
                    return (
                        <Tooltip title="Thanh toán để kích hoạt tin">
                            <Button
                                type="primary"
                                size="small"
                                icon={<CreditCardOutlined />}
                                onClick={() => onPay?.(r)}
                            >
                                Thanh toán
                            </Button>
                        </Tooltip>
                    );
                }

                return (
                    <Space wrap>
                        <Button size="small" icon={<EyeOutlined />} onClick={() => onView?.(r)}>Xem</Button>
                        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit?.(r)}>Sửa</Button>
                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete?.(r)}>Xoá</Button>
                    </Space>
                );
            },
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
            />
        </div>
    );
};

export default ListingTable;
