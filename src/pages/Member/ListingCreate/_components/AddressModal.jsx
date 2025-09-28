import React, { useMemo, useState } from "react";
import { Modal, Form, Select } from "antd"; // ⬅️ bỏ Input
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "@/services/address.service";

export default function AddressModal({ open, onCancel, onOk }) {
  const provinces = useMemo(() => getProvinces(), []);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  const districts = useMemo(
    () => (province ? getDistrictsByProvinceCode(province.value) : []),
    [province]
  );
  const wards = useMemo(
    () => (district ? getWardsByDistrictCode(district.value) : []),
    [district]
  );

  const handleOk = () => {
    if (!province || !district || !ward) return;
    // Không còn line
    const addrObj = { province, district, ward };
    const display = [ward?.label, district?.label, province?.label]
      .filter(Boolean)
      .join(", ");
    onOk(addrObj, display);
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
        <Form.Item label="Tỉnh, thành phố *" required>
          <Select
            showSearch
            options={provinces}
            placeholder="Chọn tỉnh/thành"
            onChange={(_, option) => {
              setProvince(option);
              setDistrict(null);
              setWard(null);
            }}
            value={province?.value}
          />
        </Form.Item>

        <Form.Item label="Quận, huyện, thị xã *" required>
          <Select
            showSearch
            options={districts}
            placeholder="Chọn quận/huyện"
            onChange={(_, option) => {
              setDistrict(option);
              setWard(null);
            }}
            value={district?.value}
            disabled={!province}
          />
        </Form.Item>

        <Form.Item label="Phường, xã, thị trấn *" required>
          <Select
            showSearch
            options={wards}
            placeholder="Chọn phường/xã"
            onChange={(_, option) => setWard(option)}
            value={ward?.value}
            disabled={!district}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
