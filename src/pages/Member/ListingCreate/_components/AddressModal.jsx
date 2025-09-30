// pages/listing/_components/AddressModal.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Select, Input } from "antd";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "@/services/address.service";

export default function AddressModal({ open, onCancel, onOk, initialAddress }) {
  const provinces = useMemo(() => getProvinces(), []);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [line, setLine] = useState("");

  const districts = useMemo(
    () => (province ? getDistrictsByProvinceCode(province.value) : []),
    [province]
  );
  const wards = useMemo(
    () => (district ? getWardsByDistrictCode(district.value) : []),
    [district]
  );

  useEffect(() => {
    if (open && initialAddress) {
      setLine(initialAddress.line || "");
      setProvince(initialAddress.province || null);
      setDistrict(initialAddress.district || null);
      setWard(initialAddress.ward || null);
    }
  }, [open, initialAddress]);

  const handleOk = () => {
    if (!line?.trim() || !province || !district || !ward) return;
    const addrObj = { line: line.trim(), province, district, ward };
    const display = [line?.trim(), ward?.label, district?.label, province?.label]
      .filter(Boolean)
      .join(", ");
    onOk?.(addrObj, display);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="Địa chỉ"
      okText="XONG"
      destroyOnHidden
    >
      <Form layout="vertical">
        <Form.Item label="Địa chỉ chi tiết *" required>
          <Input
            placeholder="Số nhà, ngõ/ngách, tên đường, toà nhà…"
            value={line}
            maxLength={120}
            onChange={(e) => setLine(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Tỉnh, thành phố *" required>
          <Select
            showSearch
            options={provinces}
            placeholder="Chọn tỉnh/thành"
            value={province?.value}
            onChange={(_, option) => {
              setProvince(option);
              setDistrict(null);
              setWard(null);
            }}
            filterOption={(i, opt) =>
              (opt?.label ?? "").toLowerCase().includes(i.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item label="Quận, huyện, thị xã *" required>
          <Select
            showSearch
            options={districts}
            placeholder="Chọn quận/huyện"
            value={district?.value}
            disabled={!province}
            onChange={(_, option) => {
              setDistrict(option);
              setWard(null);
            }}
            filterOption={(i, opt) =>
              (opt?.label ?? "").toLowerCase().includes(i.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item label="Phường, xã, thị trấn *" required>
          <Select
            showSearch
            options={wards}
            placeholder="Chọn phường/xã"
            value={ward?.value}
            disabled={!district}
            onChange={(_, option) => setWard(option)}
            filterOption={(i, opt) =>
              (opt?.label ?? "").toLowerCase().includes(i.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
