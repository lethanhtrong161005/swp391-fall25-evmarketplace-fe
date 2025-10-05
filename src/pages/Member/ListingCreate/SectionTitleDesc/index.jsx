import React from "react";
import { Form, Input, Typography, Alert } from "antd";
import { useSectionTitleDesc } from "@hooks/useSectionTitleDesc";
import styles from "./index.module.scss";

const { TextArea } = Input;

export default function SectionTitleDesc() {
    const { showHint, onTitleChange, onTitleFocus, onTitleBlur,
        descWordCount, descriptionRules, descriptionMinWords } =
  useSectionTitleDesc({ descriptionMinWords: 20 })
    return (
        <>
            <Form.Item
                rootClassName={styles.inputRoot}
                className={styles.formItem}
                label="Tiêu đề tin đăng"
                name="title"
                rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề" },
                    { max: 50, message: "Tối đa 50 ký tự" },
                ]}
            >
                <Input
                    className={styles.input}
                    showCount
                    maxLength={50}
                    placeholder="VD: VinFast VF e34 2022 – Đen - 15.000 km"
                    onFocus={onTitleFocus}
                    onBlur={onTitleBlur}
                    onChange={onTitleChange}
                />
            </Form.Item>

            {showHint && (
                <Alert
                    type="info"
                    showIcon
                    className={styles.hint}
                    message={
                        <div>
                            <Typography.Text strong>Tiêu đề tốt nên có:</Typography.Text>
                            <div>
                                Thương hiệu + Model + Năm + <u>Màu sắc</u> + Quãng đường
                            </div>
                            <div>
                                <em>Ví dụ:</em> “VinFast VF3 2024 Đen - 5.000 km”
                            </div>
                        </div>
                    }
                />
            )}

            <Form.Item
                className={styles.formItem}
                label="Mô tả chi tiết"
                name="description"
                rules={descriptionRules}
                validateTrigger={["onBlur", "onSubmit"]}
                extra={
                    <Typography.Text type="secondary">
                        {descWordCount} từ • tối thiểu {descriptionMinWords} từ
                    </Typography.Text>
                }
            >
                <TextArea
                    className={styles.textarea}
                    rows={6}
                    showCount
                    maxLength={1500}
                    placeholder={[
                        "- Xuất xứ, tình trạng chiếc xe/pin",
                        "- Chính sách bảo hành, bảo trì, đổi trả",
                        "- Địa điểm xem xe/giao dịch",
                        "- Thời gian sử dụng, cam kết",
                        "- Bảo trì xe: bao lâu/lần, tại hãng hay không?",
                    ].join("\n")}
                />
            </Form.Item>
        </>
    );
}
