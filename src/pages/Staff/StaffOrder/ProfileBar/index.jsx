import React, { useMemo } from "react";
import s from "./ProfileBar.module.scss";
import { Card, Row, Col, Statistic, Tooltip } from "antd";
import {
    ShoppingCartOutlined,
    CheckCircleOutlined,
    WalletOutlined,
    PercentageOutlined,
} from "@ant-design/icons";
import { useProfileBar, useStaffId } from "./useProfileBar";

export default function ProfileBar({ rows = [], loading }) {
    const staffId = useStaffId();
    const { totalOrders, totalAmount, paidCount } = useProfileBar(rows, loading);

    const { paidSum, successRate } = useMemo(() => {
        const paidSum = rows?.reduce((s, r) => s + (r?.paidAmount || 0), 0);
        const successRate = totalOrders > 0 ? Math.round((paidCount / totalOrders) * 100) : 0;
        return { paidSum, successRate };
    }, [rows, totalOrders, paidCount]);

    const fmtVnd = (n) =>
        Number(n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    return (
        <Card className={s.root} size="small" bordered={false}>
            <div className={s.header}>
                <div className={s.title}>Tổng quan đơn hàng</div>
                {staffId && (
                    <div className={s.subtle}>
                        Staff ID:&nbsp;<b>{staffId}</b>
                    </div>
                )}
            </div>

            <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                    <div className={s.kpi}>
                        <div className={`${s.kpiIcon} ${s.blue}`}>
                            <ShoppingCartOutlined />
                        </div>
                        <Statistic title="Đơn trong trang" value={totalOrders} />
                    </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                    <div className={s.kpi}>
                        <div className={`${s.kpiIcon} ${s.green}`}>
                            <CheckCircleOutlined />
                        </div>
                        <Statistic title="Đơn đã thanh toán" value={paidCount} />
                    </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                    <div className={s.kpi}>
                        <div className={`${s.kpiIcon} ${s.purple}`}>
                            <WalletOutlined />
                        </div>
                        <Statistic title="Đã thu (trang)" value={paidSum} formatter={fmtVnd} />
                    </div>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                    <div className={s.kpi}>
                        <div className={`${s.kpiIcon} ${s.orange}`}>
                            <PercentageOutlined />
                        </div>
                        <Tooltip title="Tỷ lệ số đơn đã thanh toán trên tổng đơn trong trang">
                            <Statistic title="Tỷ lệ thanh toán" value={successRate} suffix="%" />
                        </Tooltip>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}
