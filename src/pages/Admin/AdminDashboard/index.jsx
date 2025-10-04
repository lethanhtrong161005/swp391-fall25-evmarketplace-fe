import React from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  UserOutlined,
  CarOutlined,
  ExperimentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import s from "./styles.module.scss";
import { useAdminDashboard } from "./logic";

const { Title } = Typography;

export default function AdminDashboard() {
  const { stats, loading } = useAdminDashboard();

  const statisticsData = [
    {
      title: "Tổng số người dùng",
      value: stats.totalUsers || 0,
      icon: <UserOutlined style={{ color: "#1890ff" }} />,
    },
    {
      title: "Xe điện đăng bán",
      value: stats.totalVehicles || 0,
      icon: <CarOutlined style={{ color: "#52c41a" }} />,
    },
    {
      title: "Pin đăng bán",
      value: stats.totalBatteries || 0,
      icon: <ExperimentOutlined style={{ color: "#faad14" }} />,
    },
    {
      title: "Doanh thu tháng",
      value: stats.monthlyRevenue || 0,
      prefix: "₫",
      icon: <DollarOutlined style={{ color: "#f5222d" }} />,
    },
  ];

  return (
    <div className={s.container}>
      <Title level={3} className={s.title}>
        Dashboard Quản trị
      </Title>

      <Row gutter={[16, 16]} className={s.statsRow}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={s.statCard} loading={loading}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.icon}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className={s.chartsRow}>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ người dùng theo tháng" className={s.chartCard}>
            <div className={s.chartPlaceholder}>
              Biểu đồ sẽ được triển khai sau
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ bài đăng theo danh mục" className={s.chartCard}>
            <div className={s.chartPlaceholder}>
              Biểu đồ sẽ được triển khai sau
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
