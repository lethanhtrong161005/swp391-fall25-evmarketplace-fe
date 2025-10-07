import { Form, Row, Col, InputNumber } from "antd";
import {
    vehicleBatteryCapacityRule,
    vehicleSOHRule,
    mileageRule,
    vehiclePriceRule,
} from "@/validators/vehicle.rules";
import styles from "./index.module.scss";

const SectionDetailVehicle = () => {
    return (
        <>
            <Row gutter={16} className={styles.row}>
                <Col xs={24} md={12}>
                    <Form.Item
                        className={styles.formItem}
                        label="Dung lượng pin (kWh)"
                        name="battery_capacity_kwh"
                        rules={vehicleBatteryCapacityRule}
                    >
                        <InputNumber
                            controls={false}
                            min={0}
                            step={0.1}
                            className={styles.number}
                            placeholder="VD: 42"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        className={styles.formItem}
                        label="Tình trạng pin (%SOH)"
                        name="soh_percent"
                        rules={vehicleSOHRule}
                    >
                        <InputNumber
                            controls={false}
                            min={0}
                            max={100}
                            step={0.1}
                            className={styles.number}
                            placeholder="VD: 95.5"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16} className={styles.row}>
                <Col xs={24} md={12}>
                    <Form.Item
                        className={styles.formItem}
                        label="Số Km đã đi"
                        name="mileage_km"
                        rules={mileageRule}
                    >
                        <InputNumber
                            controls={false}
                            min={0}
                            className={styles.number}
                            placeholder="VD: 15000"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        className={styles.formItem}
                        label="Giá bán (VND)"
                        name="price"
                        rules={vehiclePriceRule}
                    >
                        <InputNumber
                            controls={false}
                            min={0}
                            step={100000}
                            className={styles.number}
                            placeholder="VD: 460000000"
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}

export default SectionDetailVehicle;