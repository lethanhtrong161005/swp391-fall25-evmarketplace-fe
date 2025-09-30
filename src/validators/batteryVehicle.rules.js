// src/validators/battery.rules.js
export const batterySOHRule = [
    { required: true, message: "Nhập SOH (%)" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n)) return Promise.reject("SOH không hợp lệ");
            if (n <= 0 || n > 100) return Promise.reject("SOH phải trong khoảng (0;100]");
            return Promise.resolve();
        },
    },
];

export const voltageRule = [
    { required: true, message: "Nhập điện áp (V)" },
    {
        validator: (_, v) => {
            if (!v || v <= 0) return Promise.reject("Điện áp không hợp lệ");
            if (v > 1000) return Promise.reject("Điện áp >1000V không khả thi");
            return Promise.resolve();
        },
    },
];

export const chemistryRule = [
    { required: true, message: "Nhập hóa học pin (LFP, NMC,…)" },
    { max: 20, message: "Tối đa 20 ký tự" },
];


