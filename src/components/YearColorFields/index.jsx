import { Row, Col, Form, Select, AutoComplete, InputNumber } from "antd";
import { YEARS_EXTENDED } from "@utils/constants";
import { priceRule } from "@validators/common.rules";
import styles from "./index.module.scss";

export default function YearColorFields({ isBattery, mode = "listing" }) {
  const priceFieldName = mode === "consignment" ? "ownerExpectedPrice" : "price";
  const priceLabel = mode === "consignment" ? "Giá dự kiến (VND)" : "Giá bán (VND)";

  return (
    <Row gutter={[16, 0]}>
      <Col xs={24} md={12}>
        <Form.Item
          className={styles.formItem}
          label="Năm sản xuất"
          name="year"
          rules={[{ required: true, message: "Chọn năm" }]}
        >
          <Select
            className={styles.select}
            popupClassName={styles.dropdown}
            showSearch
            placeholder="Chọn năm"
            options={YEARS_EXTENDED}
            filterOption={(input, option) =>
              String(option?.label || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        {isBattery ? (
          <Form.Item
            className={styles.formItem}
            label={priceLabel}
            name={priceFieldName}
            rules={priceRule}
          >
            <InputNumber
              className={styles.number}
              controls={false}
              min={0}
              step={100000}
              placeholder="VD: 15.000.000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        ) : (
          <Form.Item
            className={styles.formItem}
            label="Màu sắc (tùy chọn)"
            name="color"
          >
            <AutoComplete
              className={styles.autoComplete}
              popupClassName={styles.dropdown}
              allowClear
              options={[
                { value: "Trắng", label: "Trắng" },
                { value: "Đen", label: "Đen" },
                { value: "Đỏ", label: "Đỏ" },
                { value: "Xanh", label: "Xanh" },
              ]}
            />
          </Form.Item>
        )}
      </Col>
    </Row>
  );
}
