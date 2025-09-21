import React from "react";
import { Typography, Result, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Motor = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <Result
        icon={<UserOutlined style={{ color: "#1890ff", fontSize: "72px" }} />}
        title={
          <Title level={2} style={{ color: "#1890ff", marginBottom: "16px" }}>
            Trang Xe Máy Điện
          </Title>
        }
        subTitle={
          <div>
            <Typography.Text
              style={{
                fontSize: "16px",
                color: "#666",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Tính năng đang được phát triển
            </Typography.Text>
            <Typography.Text style={{ fontSize: "14px", color: "#999" }}>
              Chúng tôi đang xây dựng kho xe máy điện đa dạng cho quý khách. Hẹn
              gặp lại sau!
            </Typography.Text>
          </div>
        }
        extra={
          <Button type="primary" size="large" onClick={() => navigate("/")}>
            Về Trang Chủ
          </Button>
        }
      />
    </div>
  );
};

export default Motor;
