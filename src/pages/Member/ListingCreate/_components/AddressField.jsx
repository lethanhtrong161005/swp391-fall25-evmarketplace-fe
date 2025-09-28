/**
 * AddressField
 * - Mapping DB: listing.province/listing.city lấy từ address.province/district.
 */
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import AddressModal from "./AddressModal";

export default function AddressField({ form: externalForm }) {
  // Lấy instance Form từ context (ưu tiên prop truyền vào)
  const form = (Form.useFormInstance?.() || externalForm) ?? null;

  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("");

  // Theo dõi object address trong Form để hiển thị chuỗi địa chỉ đẹp
  const address = Form.useWatch?.("address", form);

  useEffect(() => {
    if (!address) return;
    const { line, ward, district, province } = address || {};
    const text = [line, ward?.label, district?.label, province?.label]
      .filter(Boolean)
      .join(", ");
    setDisplay(text);
  }, [address]);

  return (
    <>
      {/* Input chỉ để mở modal; dữ liệu lưu ở field ẩn "address" */}
      <Form.Item label="Địa chỉ" required>
        <Input
          readOnly
          placeholder="Địa chỉ *"
          onClick={() => setOpen(true)}
          value={display}
        />
      </Form.Item>

      {/* Field ẩn giữ object address để Form validate/submit */}
      <Form.Item
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        hidden
      >
        <Input />
      </Form.Item>

      <AddressModal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={(addrObj, displayText) => {
          form?.setFieldsValue({ address: addrObj });
          setDisplay(displayText);
          setOpen(false);
        }}
      />
    </>
  );
}
