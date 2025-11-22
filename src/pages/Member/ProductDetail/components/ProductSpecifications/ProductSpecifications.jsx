// src/pages/Member/ProductDetail/components/ProductSpecifications/ProductSpecifications.jsx
import React from "react";
import { Card, Typography } from "antd";
import { formatMileage, formatPercentage } from "../../utils/productFormatters";
import { SPECIFICATION_LABELS, CATEGORY_LABELS } from "../../utils/productConstants";
import { CATEGORIES } from "@utils/constants";
import { formatNumberWithUnit } from "@utils/numberFormatter";
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

    // Thêm danh mục nếu có - map từ code sang tên hiển thị
    if (product.categoryName) {
      // Map category code (E_BIKE, EV_CAR, etc.) sang tên hiển thị
      const categoryCode = product.categoryName.toUpperCase();
      const categoryLabel = 
        CATEGORY_LABELS[categoryCode] || 
        CATEGORIES[categoryCode] || 
        product.categoryName;
      
      specs.push({
        label: SPECIFICATION_LABELS.CATEGORY,
        value: categoryLabel,
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
      // Thông số pin - ưu tiên từ listing (root level), sau đó từ productBattery (catalog)
      const capacityKwh = product.batteryCapacityKwh ?? product.productBattery?.capacityKwh;
      if (capacityKwh != null) {
        specs.push({
          label: SPECIFICATION_LABELS.CAPACITY,
          value: formatNumberWithUnit(capacityKwh, "kWh"),
        });
      }
      
      const voltage = product.voltage ?? product.productBattery?.voltage;
      if (voltage != null) {
        specs.push({
          label: SPECIFICATION_LABELS.VOLTAGE,
          value: formatNumberWithUnit(voltage, "V"),
        });
      }
      
      const weightKg = product.massKg ?? product.productBattery?.weightKg;
      if (weightKg != null) {
        specs.push({
          label: SPECIFICATION_LABELS.WEIGHT,
          value: formatNumberWithUnit(weightKg, "kg"),
        });
      }
      
      const dimension = product.dimensions ?? product.productBattery?.dimension;
      if (dimension) {
        specs.push({
          label: SPECIFICATION_LABELS.DIMENSION,
          value: dimension,
        });
      }
      
      // Hóa học pin - ưu tiên từ listing, sau đó từ productBattery (catalog)
      const chemistry = product.batteryChemistry ?? product.productBattery?.chemistry;
      if (chemistry) {
        specs.push({
          label: SPECIFICATION_LABELS.CHEMISTRY,
          value: chemistry,
        });
      }
    } else {
      // Thông số xe - ưu tiên từ listing (root level), sau đó từ productVehicle (catalog)
      if (product.year != null) {
        specs.push({ label: SPECIFICATION_LABELS.YEAR, value: product.year });
      }
      
      // powerKw chỉ có từ catalog (productVehicle), không có trong listing
      if (product.powerKw != null) {
        specs.push({
          label: SPECIFICATION_LABELS.POWER,
          value: formatNumberWithUnit(product.powerKw, "kW"),
        });
      }
      
      // batteryCapacityKwh - đã được ưu tiên trong transform function
      if (product.batteryCapacityKwh != null) {
        specs.push({
          label: SPECIFICATION_LABELS.BATTERY_CAPACITY,
          value: formatNumberWithUnit(product.batteryCapacityKwh, "kWh"),
        });
      }

      // Các thông số chỉ có trong catalog (productVehicle)
      const vehicle = product.productVehicle;
      
      if (vehicle?.rangeKm != null) {
        specs.push({
          label: SPECIFICATION_LABELS.RANGE,
          value: formatNumberWithUnit(vehicle.rangeKm, "km"),
        });
      }
      if (vehicle?.acChargingKw != null) {
        specs.push({
          label: SPECIFICATION_LABELS.AC_CHARGING,
          value: formatNumberWithUnit(vehicle.acChargingKw, "kW"),
        });
      }
      if (vehicle?.dcChargingKw != null) {
        specs.push({
          label: SPECIFICATION_LABELS.DC_CHARGING,
          value: formatNumberWithUnit(vehicle.dcChargingKw, "kW"),
        });
      }
      if (vehicle?.acConnector) {
        specs.push({
          label: SPECIFICATION_LABELS.AC_CONNECTOR,
          value: vehicle.acConnector,
        });
      }
      if (vehicle?.dcConnector) {
        specs.push({
          label: SPECIFICATION_LABELS.DC_CONNECTOR,
          value: vehicle.dcConnector,
        });
      }

      // Thông số bike - từ product.bike hoặc product.productVehicle.bike
      const bike = product.bike || product.productVehicle?.bike || product.productVehicle?.bikeDetail;
      
      if (bike) {
        if (bike.motorLocation) {
          specs.push({
            label: SPECIFICATION_LABELS.MOTOR_LOCATION,
            value: bike.motorLocation,
          });
        }
        if (bike.wheelSize) {
          specs.push({
            label: SPECIFICATION_LABELS.WHEEL_SIZE,
            value: bike.wheelSize,
          });
        }
        if (bike.brakeType) {
          specs.push({
            label: SPECIFICATION_LABELS.BRAKE_TYPE,
            value: bike.brakeType,
          });
        }
        if (bike.weightKg != null) {
          specs.push({
            label: SPECIFICATION_LABELS.BIKE_WEIGHT,
            value: formatNumberWithUnit(bike.weightKg, "kg"),
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
