/**
 * AddressField
 * - Lưu object address trong field ẩn "address"
 * - Hiển thị chuỗi đẹp và validate trực quan trên input hiển thị
 */
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { EditOutlined, CloseCircleFilled } from "@ant-design/icons";
import AddressModal from "./AddressModal";

export default function AddressField({ form: externalForm }) {
  const form = (Form.useFormInstance?.() || externalForm) ?? null;

  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("");

  // Theo dõi object address trong Form
  const address = Form.useWatch?.("address", form);

  useEffect(() => {
    const { line, ward, district, province } = address || {};
    const text = [line, ward?.label, district?.label, province?.label]
      .filter(Boolean)
      .join(", ");
    setDisplay(text || "");
  }, [address]);

  const handleClear = (e) => {
    e.stopPropagation();
    form?.setFieldsValue({ address: undefined });
    setDisplay("");
  };

  const hasError = !address; // chưa có address → báo lỗi

  return (
    <>
      {/* Input hiển thị + validate trực quan */}
      <Form.Item
        label="Địa chỉ"
        required
        validateStatus={hasError ? "error" : undefined}
        help={hasError ? "Vui lòng nhập địa chỉ" : undefined}
      >
        <Input
          readOnly
          placeholder="Địa chỉ *"
          onClick={() => setOpen(true)}
          value={display}
          suffix={
            display ? (
              <CloseCircleFilled onClick={handleClear} style={{ color: "#999" }} />
            ) : (
              <EditOutlined style={{ color: "#999" }} />
            )
          }
        />
      </Form.Item>

      {/* Field ẩn để Form validate/submit */}
      <Form.Item
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        hidden
      >
        <Input />
      </Form.Item>

      {/* Modal: truyền initialAddress để có thể sửa lại */}
      <AddressModal
        open={open}
        onCancel={() => setOpen(false)}
        initialAddress={address}
        onOk={(addrObj, displayText) => {
          form?.setFieldsValue({ address: addrObj });
          setDisplay(displayText);
          setOpen(false);
        }}
      />
    </>
  );
}
