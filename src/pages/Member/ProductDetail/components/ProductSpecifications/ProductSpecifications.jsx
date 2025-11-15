// src/pages/Member/ProductDetail/components/ProductSpecifications/ProductSpecifications.jsx
import React from "react";
import { Card, Typography } from "antd";
import { formatMileage, formatPercentage } from "../../utils/productFormatters";
import { SPECIFICATION_LABELS } from "../../utils/productConstants";
import "./ProductSpecifications.styles.scss";

const { Title } = Typography;

export default function ProductSpecifications({ product, isBattery }) {
  if (!product) return null;

  // Tạo danh sách specifications
  const getSpecifications = () => {
    const specs = [
      { label: SPECIFICATION_LABELS.BRAND, value: product.brand },
      { label: SPECIFICATION_LABELS.MODEL, value: product.model },
    ];

    // Thêm danh mục nếu có
    if (product.categoryName) {
      specs.push({
        label: SPECIFICATION_LABELS.CATEGORY,
        value: product.categoryName,
      });
    }

    // Thêm màu sắc nếu có
    if (product.color) {
      specs.push({
        label: SPECIFICATION_LABELS.COLOR,
        value: product.color,
      });
    }

    if (isBattery) {
      // Thông số pin
      if (product.productBattery?.capacityKwh != null) {
        specs.push({
          label: SPECIFICATION_LABELS.CAPACITY,
          value: `${product.productBattery.capacityKwh} kWh`,
        });
      }
      if (product.productBattery?.voltage != null) {
        specs.push({
          label: SPECIFICATION_LABELS.VOLTAGE,
          value: `${product.productBattery.voltage} V`,
        });
      }
      if (product.productBattery?.weightKg != null) {
        specs.push({
          label: SPECIFICATION_LABELS.WEIGHT,
          value: `${product.productBattery.weightKg} kg`,
        });
      }
      if (product.productBattery?.dimension) {
        specs.push({
          label: SPECIFICATION_LABELS.DIMENSION,
          value: product.productBattery.dimension,
        });
      }
      // Hóa học pin - ưu tiên từ productBattery, sau đó từ listing
      const chemistry =
        product.productBattery?.chemistry || product.batteryChemistry;
      if (chemistry) {
        specs.push({
          label: SPECIFICATION_LABELS.CHEMISTRY,
          value: chemistry,
        });
      }
    } else {
      // Thông số xe
      if (product.year != null) {
        specs.push({ label: SPECIFICATION_LABELS.YEAR, value: product.year });
      }
      if (product.powerKw != null) {
        specs.push({
          label: SPECIFICATION_LABELS.POWER,
          value: `${product.powerKw} kW`,
        });
      }
      if (product.batteryCapacityKwh != null) {
        specs.push({
          label: SPECIFICATION_LABELS.BATTERY_CAPACITY,
          value: `${product.batteryCapacityKwh} kWh`,
        });
      }

      // Thông số xe - chỉ hiển thị khi có productVehicle
      if (product.productVehicle) {
        if (product.productVehicle.rangeKm != null) {
          specs.push({
            label: SPECIFICATION_LABELS.RANGE,
            value: `${product.productVehicle.rangeKm} km`,
          });
        }
        if (product.productVehicle.acChargingKw != null) {
          specs.push({
            label: SPECIFICATION_LABELS.AC_CHARGING,
            value: `${product.productVehicle.acChargingKw} kW`,
          });
        }
        if (product.productVehicle.dcChargingKw != null) {
          specs.push({
            label: SPECIFICATION_LABELS.DC_CHARGING,
            value: `${product.productVehicle.dcChargingKw} kW`,
          });
        }
        if (product.productVehicle.acConnector) {
          specs.push({
            label: SPECIFICATION_LABELS.AC_CONNECTOR,
            value: product.productVehicle.acConnector,
          });
        }
        if (product.productVehicle.dcConnector) {
          specs.push({
            label: SPECIFICATION_LABELS.DC_CONNECTOR,
            value: product.productVehicle.dcConnector,
          });
        }
      }
    }

    return specs;
  };

  // Tạo danh sách tình trạng xe
  const getVehicleCondition = () => {
    const conditions = [];

    if (product.sohPercent != null) {
      conditions.push({
        label: "Tình trạng sức khỏe của pin(%SOH)",
        value: formatPercentage(product.sohPercent),
      });
    }

    if (product.mileageKm != null) {
      conditions.push({
        label: "Số Km đã đi",
        value: `${formatMileage(product.mileageKm)} km`,
      });
    }

    return conditions;
  };

  const specifications = getSpecifications();
  const vehicleConditions = getVehicleCondition();

  return (
    <>
      <Card className="product-specifications">
        <Title level={4} className="product-specifications__title">
          Thông số kỹ thuật
        </Title>
        <div className="product-specifications__grid">
          {specifications.map((spec, index) => (
            <div key={index} className="product-specifications__item">
              <div className="product-specifications__label">{spec.label}:</div>
              <div className="product-specifications__value">{spec.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {vehicleConditions.length > 0 && (
        <Card className="product-specifications">
          <Title level={4} className="product-specifications__title">
            Tình trạng Xe
          </Title>
          <div className="product-specifications__grid">
            {vehicleConditions.map((condition, index) => (
              <div key={index} className="product-specifications__item">
                <div className="product-specifications__label">
                  {condition.label}:
                </div>
                <div className="product-specifications__value">
                  {condition.value}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
