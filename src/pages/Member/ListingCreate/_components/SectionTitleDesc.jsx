/**
 * SectionTitleDesc
 * - Tạo tiêu đề tự động từ brand/model/year/mileage_km.
 * - Khi user gõ tay khác gợi ý → sẽ giữ theo người dùng.
 * - Mô tả có placeholder checklist, max 1500 ký tự.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Input, Typography, Alert } from "antd";
const { TextArea } = Input;

function buildAutoTitle({ brand, model, year, mileage_km }) {
  if (!brand && !model && !year && !mileage_km) return "";
  const left = [brand, model, year].filter(Boolean).join(" ");
  const right = mileage_km ? ` - ${mileage_km} km` : "";
  return `${left}${right}`.trim();
}

export default function SectionTitleDesc() {
  const form = Form.useFormInstance();
  const [showHint, setShowHint] = useState(false);

  const brand = Form.useWatch("brand", form);
  const model = Form.useWatch("model", form);
  const year = Form.useWatch("year", form);
  const mileage_km = Form.useWatch("mileage_km", form);

  // Ghi nhớ: user đã sửa tay chưa?
  const userEditedTitleRef = useRef(false);

  const computedTitle = useMemo(
    () => buildAutoTitle({ brand, model, year, mileage_km }),
    [brand, model, year, mileage_km]
  );

  // Nếu chưa sửa tay → luôn cập nhật theo gợi ý
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
          placeholder="VD: VinFast VF3 2024 - 2.000 km"
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
                Loại xe + Thương hiệu + Model + Năm + Màu sắc + Tình trạng +
                Quãng đường
              </div>
              <div>
                <em>Ví dụ:</em> “VinFast VF3 2024 đen đã lăn bánh 6 tháng -
                5.000 km”
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
