// src/validators/vehicle.rules.js

// Dung lượng pin (kWh)
export const vehicleBatteryCapacityRule = [
    { required: true, message: "Nhập dung lượng pin (kWh)" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n <= 0) {
                return Promise.reject(new Error("Dung lượng pin phải > 0"));
            }
            return Promise.resolve();
        },
    },
];

// SOH (%)
export const vehicleSOHRule = [
    { required: true, message: "Nhập tình trạng pin (%SOH)" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n <= 0 || n > 100) {
                return Promise.reject(new Error("SOH phải trong khoảng (0; 100]"));
            }
            return Promise.resolve();
        },
    },
];

// Số km đã đi
export const mileageRule = [
    { required: true, message: "Nhập số Km đã đi" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n < 0) {
                return Promise.reject(new Error("Số Km phải ≥ 0"));
            }
            if (n > 1_000_000) {
                return Promise.reject(new Error("Km không hợp lệ (> 1,000,000)"));
            }
            return Promise.resolve();
        },
    },
];

// Giá bán
export const vehiclePriceRule = [
    { required: true, message: "Nhập giá bán" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n < 1_000_000) {
                return Promise.reject(new Error("Giá bán phải ≥ 1,000,000 VND"));
            }
            return Promise.resolve();
        },
    },
];
