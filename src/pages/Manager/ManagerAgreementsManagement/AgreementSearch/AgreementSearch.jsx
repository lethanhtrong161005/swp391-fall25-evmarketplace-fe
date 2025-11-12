import React, { useState } from "react";
import { Button, Col, Input, Row, Space, Table, message } from "antd";
import { searchManagerAgreementsByPhone } from "@services/agreement.service";
import { Card } from "antd";

export default function AgreementSearch() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    if (!phone.trim()) {
      message.warning("Vui lòng nhập số điện thoại để tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      const res = await searchManagerAgreementsByPhone(phone.trim());
      setData(res || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm thấy hợp đồng với số điện thoại này");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhone("");
    setData([]);
  };

  return (
    <Card size="small" title="Bộ lọc hợp đồng">
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
          <Col xs={24} md={12} className={s.right}>
            <Space>
              <Button type="primary" loading={loading} onClick={handleSearch}>
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
