import React, { useState } from "react";
import { Button, Col, Input, Row, Space, message, Card } from "antd";
import { searchConsignmentByPhone } from "../../services/consigmentService";
import { searchStaffInspectionByPhone } from "../../services/staff/staffConsignmentService";

export default function ConsignmentSearch({
  onSearch,
  onReset,
  mode = "consignment", // "consignment" | "inspection"
}) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) {
      message.warning("Vui lòng nhập số điện thoại khách hàng");
      return;
    }

    try {
      setLoading(true);

      let res;
      if (mode === "inspection") {
        res = await searchStaffInspectionByPhone(phone.trim());
      } else {
        res = await searchConsignmentByPhone(phone.trim());
      }

      const data = res?.data || res || [];
      onSearch && onSearch(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tìm kiếm dữ liệu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setPhone("");
    onReset && onReset();
  };

  return (
    <Card size="small" title="Bộ lọc ký gửi">
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={12}>
            <Input
              allowClear
              placeholder="Nhập số điện thoại khách hàng..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} md={12}>
            <Space>
              <Button
                type="primary"
                onClick={handleSearch}
                loading={loading}
              >
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>Làm mới</Button>
            </Space>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
