import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { EditOutlined, CloseCircleFilled } from "@ant-design/icons";
import AddressModal from "../AddressModal";
import styles from "./index.module.scss";

const cn = (...xs) => xs.filter(Boolean).join(" ");

const AddressField = ({ form: externalForm }) => {
    const form = (Form.useFormInstance?.() || externalForm) ?? null;

    const [open, setOpen] = useState(false);
    const [display, setDisplay] = useState("");

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
        form?.validateFields?.(["address"]).catch(() => { });
    };

    const addressErrors = form?.getFieldError?.("address") || [];
    const hasError = addressErrors.length > 0;

    return (
        <>
            <Form.Item
                className={styles.fieldItem}
                label="Địa chỉ"
                required
                validateStatus={hasError ? "error" : undefined}
                help={hasError ? addressErrors[0] || "Vui lòng nhập địa chỉ" : undefined}
            >
                <Input
                    readOnly
                    placeholder="Địa chỉ *"
                    onClick={() => setOpen(true)}
                    value={display}
                    className={cn(styles.input, hasError && styles.inputError)}
                    rootClassName={cn(styles.input, hasError && styles.inputError)} // ⬅️ quan trọng

                    suffix={
                        display ? (
                            <CloseCircleFilled
                                onClick={handleClear}
                                className={cn(styles.suffixIcon, styles.clearIcon)}
                            />
                        ) : (
                            <EditOutlined className={styles.suffixIcon} />
                        )
                    }
                />
            </Form.Item>

            {/* Field ẩn để Form validate/submit */}
            <Form.Item
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                hidden
                // optional: chỉ validate khi submit (tránh validate sớm)
                validateTrigger={["onSubmit"]}
            >
                <Input />
            </Form.Item>

            <AddressModal
                open={open}
                onCancel={() => setOpen(false)}
                initialAddress={address}
                onOk={(addrObj, displayText) => {
                    form?.setFieldsValue({ address: addrObj });
                    setDisplay(displayText);
                    setOpen(false);
                    form?.validateFields?.(["address"]).catch(() => { });
                }}
            />
        </>
    );
}

export default AddressField;
