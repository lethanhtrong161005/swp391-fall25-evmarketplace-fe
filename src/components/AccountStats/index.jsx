import React from "react";
import { Card, Row, Col, Statistic, theme, Skeleton, Tooltip } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  TeamOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { ROLES, ROLE_LABELS } from "@config/roles";
import s from "./AccountStats.module.scss";

// Component hiển thị thống kê tổng quan tài khoản
const AccountStats = ({
  stats = {
    total: 0,
    active: 0,
    locked: 0,
    verified: 0,
    roleStats: {
      ADMIN: 0,
      MANAGER: 0,
      INSPECTOR: 0,
      STAFF: 0,
      MEMBER: 0,
      GUEST: 0,
    },
  },
  loading = false,
  onFilter = () => {},
  currentFilters = {},
}) => {
  const { token } = theme.useToken();

  // Cấu hình icon và màu sắc cho từng role
  const roleConfig = {
    [ROLES.ADMIN]: { icon: <CrownOutlined />, color: "#ff4d4f" },
    [ROLES.MANAGER]: { icon: <TeamOutlined />, color: "#1890ff" },
    [ROLES.INSPECTOR]: { icon: <ToolOutlined />, color: "#fa8c16" },
    [ROLES.STAFF]: { icon: <UsergroupAddOutlined />, color: "#52c41a" },
    [ROLES.MEMBER]: { icon: <UserAddOutlined />, color: "#13c2c2" },
    [ROLES.GUEST]: { icon: <UserOutlined />, color: "#d9d9d9" },
  };

  // Xử lý click vào thẻ thống kê
  const handleStatClick = (filterType, filterValue) => {
    // Xử lý logic đặc biệt cho verified
    if (filterType === "verified") {
      if (filterValue === true) {
        // Lọc chỉ những account đã verify cả phone và email
        onFilter({ verified: true });
      } else {
        // Reset filter
        onFilter({ verified: undefined });
      }
    } else {
      // Xử lý các filter khác
      if (filterValue === "" || filterValue === null) {
        // Reset filter
        onFilter({ [filterType]: undefined });
      } else {
        onFilter({ [filterType]: filterValue });
      }
    }
  };

  // Kiểm tra thẻ có đang được lọc không
  const isFiltered = (filterType, filterValue) => {
    if (filterType === "verified") {
      return currentFilters.verified === true;
    }
    return currentFilters[filterType] === filterValue;
  };

  if (loading) {
    return (
      <div className={s.statsContainer}>
        <div className={s.section}>
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map((i) => (
              <Col xs={12} sm={6} key={i}>
                <Card className={s.statCard}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div className={s.section}>
          <Skeleton.Input
            active
            style={{ width: 200, height: 24, marginBottom: 16 }}
          />
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Col xs={12} sm={8} md={4} key={i}>
                <Card className={s.statCard}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }

  return (
    <div className={s.statsContainer}>
      {/* Thống kê tổng quan */}
      <div className={s.section}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Tooltip title="Click để xem tất cả tài khoản" placement="top">
              <Card
                className={`${s.statCard} ${s.clickable} ${
                  isFiltered("status", "") ? s.active : ""
                }`}
                onClick={() => handleStatClick("status", "")}
              >
                <Statistic
                  title="Tổng tài khoản"
                  value={stats.total}
                  prefix={
                    <UserOutlined style={{ color: token.colorPrimary }} />
                  }
                  valueStyle={{ color: token.colorPrimary }}
                />
              </Card>
            </Tooltip>
          </Col>

          <Col xs={12} sm={6}>
            <Tooltip
              title="Click để lọc tài khoản đang hoạt động"
              placement="top"
            >
              <Card
                className={`${s.statCard} ${s.clickable} ${
                  isFiltered("status", "ACTIVE") ? s.active : ""
                }`}
                onClick={() => handleStatClick("status", "ACTIVE")}
              >
                <Statistic
                  title="Đang hoạt động"
                  value={stats.active}
                  prefix={
                    <CheckCircleOutlined
                      style={{ color: token.colorSuccess }}
                    />
                  }
                  valueStyle={{ color: token.colorSuccess }}
                />
              </Card>
            </Tooltip>
          </Col>

          <Col xs={12} sm={6}>
            <Tooltip title="Click để lọc tài khoản bị khóa" placement="top">
              <Card
                className={`${s.statCard} ${s.clickable} ${
                  isFiltered("status", "LOCKED") ? s.active : ""
                }`}
                onClick={() => handleStatClick("status", "LOCKED")}
              >
                <Statistic
                  title="Bị khóa"
                  value={stats.locked}
                  prefix={<LockOutlined style={{ color: token.colorError }} />}
                  valueStyle={{ color: token.colorError }}
                />
              </Card>
            </Tooltip>
          </Col>

          <Col xs={12} sm={6}>
            <Tooltip title="Click để lọc tài khoản đã xác minh" placement="top">
              <Card
                className={`${s.statCard} ${s.clickable} ${
                  isFiltered("verified", true) ? s.active : ""
                }`}
                onClick={() => handleStatClick("verified", true)}
              >
                <Statistic
                  title="Đã xác minh"
                  value={stats.verified}
                  prefix={
                    <SafetyCertificateOutlined
                      style={{ color: token.colorPrimary }}
                    />
                  }
                  valueStyle={{ color: token.colorPrimary }}
                />
              </Card>
            </Tooltip>
          </Col>
        </Row>
      </div>

      {/* Thống kê theo vai trò */}
      <div className={s.section}>
        <h3 className={s.sectionTitle}>Phân bố theo vai trò</h3>
        <Row gutter={[16, 16]}>
          {Object.entries(ROLE_LABELS).map(([role, label]) => {
            const config = roleConfig[role];
            const count = stats.roleStats[role];

            return (
              <Col xs={12} sm={8} md={4} key={role}>
                <Tooltip
                  title={`Click để lọc theo vai trò ${label}`}
                  placement="top"
                >
                  <Card
                    className={`${s.statCard} ${s.clickable} ${
                      isFiltered("role", role) ? s.active : ""
                    }`}
                    onClick={() => handleStatClick("role", role)}
                  >
                    <Statistic
                      title={label}
                      value={count}
                      prefix={React.cloneElement(config.icon, {
                        style: { color: config.color },
                      })}
                      valueStyle={{ color: config.color }}
                    />
                  </Card>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default AccountStats;
