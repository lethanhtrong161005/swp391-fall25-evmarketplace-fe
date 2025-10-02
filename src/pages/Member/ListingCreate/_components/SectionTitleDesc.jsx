/**
 * SectionTitleDesc
 * - Tạo tiêu đề tự động từ brand/model/year/color/mileage_km.
 * - Khi user gõ tay khác gợi ý → sẽ giữ theo người dùng.
 * - Mô tả có placeholder checklist, max 1500 ký tự.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Input, Typography, Alert } from "antd";
const { TextArea } = Input;

function formatKm(n) {
  if (n === undefined || n === null || n === "") return "";
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("vi-VN");
}

function buildAutoTitle({ brand, model, year, color, mileage_km }) {
  if (!brand && !model && !year && !color && !mileage_km) return "";

  // Brand + Model + Year
  const left = [brand, model, year].filter(Boolean).join(" ").trim();

  // Màu sắc
  const mid = color ? ` – ${color}` : "";

  // Quãng đường
  const km = formatKm(mileage_km);
  const right = km ? ` - ${km} km` : "";

  return `${left}${mid}${right}`.trim();
}

export default function SectionTitleDesc() {
  const form = Form.useFormInstance();
  const [showHint, setShowHint] = useState(false);

  const brand = Form.useWatch("brand", form);
  const model = Form.useWatch("model", form);
  const year = Form.useWatch("year", form);
  const color = Form.useWatch("color", form);
  const mileage_km = Form.useWatch("mileage_km", form);

  const userEditedTitleRef = useRef(false);

  const computedTitle = useMemo(
    () => buildAutoTitle({ brand, model, year, color, mileage_km }),
    [brand, model, year, color, mileage_km]
  );

  // Nếu user chưa sửa tay → update auto
  useEffect(() => {
    if (!form) return;
    const current = form.getFieldValue("title");
    if (!userEditedTitleRef.current || !current) {
      form.setFieldsValue({ title: computedTitle });
    }
  }, [computedTitle, form]);

  const onTitleChange = (e) => {
    const val = e.target.value ?? "";
    userEditedTitleRef.current = val.trim().length > 0 && val !== computedTitle;
  };

  return (
    <>
      <Form.Item
        label="Tiêu đề tin đăng"
        name="title"
        rules={[
          { required: true, message: "Vui lòng nhập tiêu đề" },
          { max: 50, message: "Tối đa 50 ký tự" },
        ]}
      >
        <Input
          showCount
          maxLength={50}
          placeholder="VD: VinFast VF e34 2022 – Đen - 15.000 km"
          onFocus={() => setShowHint(true)}
          onBlur={() => setShowHint(false)}
          onChange={onTitleChange}
        />
      </Form.Item>

      {showHint && (
        <Alert
          type="info"
          showIcon
          style={{ marginTop: -8, marginBottom: 16 }}
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
        label="Mô tả chi tiết"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết" }]}
      >
        <TextArea
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
