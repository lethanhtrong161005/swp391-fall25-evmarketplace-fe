import { Form, Row, Col, InputNumber, Input } from "antd";
import {
    batteryCapacityRule,
    batterySOHRule,
    voltageRule,
    chemistryOptionalRule,
    weightOptionalRule,
    dimensionOptionalRule,
} from "@/validators/battery.rules";
import styles from "./index.module.scss";

const SectionDetailBattery = () => {
    return (
        <>
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
                            placeholder="VD: 95"
                        />
                    </Form.Item>
                </Col>
            </Row>

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
                        label="Hoá học pin (tùy chọn)"
                        name="chemistry"
                        rules={chemistryOptionalRule}
                    >
                        <Input className={styles.input} placeholder="VD: LFP, NMC…" />
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
                        <Input className={styles.input} placeholder="VD: 1700x1200x180" />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}

export default SectionDetailBattery;
