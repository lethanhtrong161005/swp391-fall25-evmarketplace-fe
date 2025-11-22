import { Form, Row, Col, InputNumber, Input } from "antd";
import {
  batteryCapacityRule,
  batterySOHRule,
  voltageRule,
  chemistryOptionalRule,
  weightOptionalRule,
  dimensionOptionalRule,
} from "@validators/battery.rules";
import styles from "./index.module.scss";

const SectionDetailBattery = ({ mode = "listing" }) => {
  const isConsignment = mode === "consignment";

  return (
    <>
      {/* ===== Hàng 1: Dung lượng + SOH ===== */}
      <Row gutter={16} className={styles.row}>
        <Col xs={24} md={12}>
          <Form.Item
            className={styles.formItem}
            label="Dung lượng (kWh)"
            name="battery_capacity_kwh"
            rules={batteryCapacityRule}
          >
            <InputNumber
              controls={false}
              min={0}
              step={0.1}
              className={styles.number}
              placeholder="VD: 52"
              formatter={(v) => {
                if (!v) return "";
                return String(v).replace(".", ",");
              }}
              parser={(v) => {
                if (!v) return "";
                return v.replace(",", ".");
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            className={styles.formItem}
            label="Tình trạng pin (%SOH)"
            name="soh_percent"
            rules={batterySOHRule}
          >
            <InputNumber
              controls={false}
              min={0}
              max={100}
              step={0.1}
              className={styles.number}
              placeholder="VD: 95,5"
              formatter={(v) => {
                if (!v) return "";
                return String(v).replace(".", ",");
              }}
              parser={(v) => {
                if (!v) return "";
                return v.replace(",", ".");
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      {!isConsignment && (
        <>
          <Row gutter={16} className={styles.row}>
            <Col xs={24} md={12}>
              <Form.Item
                className={styles.formItem}
                label="Điện áp (V)"
                name="voltage"
                rules={voltageRule}
              >
                <InputNumber
                  controls={false}
                  min={0}
                  step={1}
                  className={styles.number}
                  placeholder="VD: 355"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                className={styles.formItem}
                label="Loại hóa học pin (tùy chọn)"
                name="chemistry"
                rules={chemistryOptionalRule}
              >
                <Input
                  className={styles.input}
                  placeholder="VD: LFP, NMC, LFP (LiFePO4)…"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={styles.row}>
            <Col xs={24} md={12}>
              <Form.Item
                className={styles.formItem}
                label="Khối lượng (kg) (tùy chọn)"
                name="weight_kg"
                rules={weightOptionalRule}
              >
                <InputNumber
                  controls={false}
                  min={0}
                  step={0.1}
                  className={styles.number}
                  placeholder="VD: 220"
                  formatter={(v) => {
                    if (!v) return "";
                    return String(v).replace(".", ",");
                  }}
                  parser={(v) => {
                    if (!v) return "";
                    return v.replace(",", ".");
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                className={styles.formItem}
                label="Kích thước (mm) (tùy chọn)"
                name="dimension"
                rules={dimensionOptionalRule}
              >
                <Input
                  className={styles.input}
                  placeholder="VD: 1700x1200x180"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SectionDetailBattery;
