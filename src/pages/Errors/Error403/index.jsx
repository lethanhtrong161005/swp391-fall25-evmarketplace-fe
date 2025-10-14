import React from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import innerHeaderError from "../../../assets/images/Error/inner_header_error.jpg";

const { Title, Paragraph } = Typography;

const Error403 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top Section - Background Image */}
      <section
        style={{
          height: "50vh",
          backgroundImage: `url(${innerHeaderError})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "white",
            zIndex: 2,
          }}
        >
          <Title
            level={1}
            style={{
              color: "white",
              fontSize: "72px",
              fontWeight: "bold",
              marginBottom: "10px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            403
          </Title>
          <Title
            level={2}
            style={{
              color: "white",
              fontSize: "48px",
              fontWeight: "300",
              marginBottom: "20px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Access Denied
          </Title>
          <div
            style={{
              fontSize: "18px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Button
              type="link"
              onClick={handleGoHome}
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "18px",
                padding: "8px 16px",
                height: "auto",
                lineHeight: "inherit",
                borderRadius: "6px",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "white";
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.textShadow = "0 2px 4px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "rgba(255,255,255,0.9)";
                e.target.style.backgroundColor = "transparent";
                e.target.style.transform = "translateY(0)";
                e.target.style.textShadow = "none";
              }}
              onMouseDown={(e) => {
                e.target.style.transform = "translateY(0) scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.target.style.transform = "translateY(-2px) scale(1)";
              }}
            >
              Trang chủ
            </Button>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px" }}>
              // 403
            </span>
          </div>
        </div>
      </section>

      {/* Bottom Section - White Content */}
      <section
        style={{
          height: "50vh",
          backgroundColor: "white",
          padding: "80px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Title
            level={2}
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            Oops! Truy cập bị từ chối
          </Title>

          <Paragraph
            style={{
              fontSize: "18px",
              color: "#666",
              lineHeight: "1.6",
              marginBottom: "40px",
            }}
          >
            Xin lỗi, bạn không có quyền truy cập vào khu vực này của ReEV. Trang
            này có thể đã bị di chuyển, xóa hoặc bạn không có quyền truy cập.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            onClick={handleGoHome}
            style={{
              background: "linear-gradient(45deg, #52c41a, #73d13d)",
              border: "none",
              borderRadius: "8px",
              height: "50px",
              padding: "0 40px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(82, 196, 26, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
            }}
          >
            Trang chủ ReEV
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Error403;
