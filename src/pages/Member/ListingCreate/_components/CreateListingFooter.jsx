import React from "react";
import { Affix, Row, Col, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function CreateListingFooter({
  currentPostType = "FREE",
  onChoosePostType,
  onPreview,
  onDraft,
  onSubmit,
  submitting,
  maxWidth = 1024,
}) {
  const BAR_H = 52;
  const label =
    currentPostType === "PAID"
      ? "Đăng tin trả phí"
      : "Đăng tin thường (Miễn phí)";

  return (
    <Affix offsetBottom={0}>
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth,
            margin: "0 auto",
            padding: "10px 16px",
          }}
        >
          <Row align="middle" justify="space-between" gutter={12} wrap>
            {/* Chọn loại đăng tin (trái) */}
            <Col flex="1 1 auto">
              <Button
                onClick={onChoosePostType}
                size="large"
                style={{
                  minWidth: 280,
                  height: 40,
                  textAlign: "left",
                }}
              >
                {label} <DownOutlined />
              </Button>
            </Col>

            {/* Nhóm action (phải) */}
            <Col>
              <Row gutter={8} wrap={false}>
                <Col>
                  <Button
                    size="large"
                    style={{ height: 40 }}
                    onClick={onPreview}
                  >
                    Xem trước
                  </Button>
                </Col>
                <Col>
                  <Button size="large" style={{ height: 40 }} onClick={onDraft}>
                    Lưu nháp
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    size="large"
                    style={{ height: 40 }}
                    onClick={onSubmit}
                    loading={submitting}
                  >
                    Đăng tin
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Affix>
  );
}
