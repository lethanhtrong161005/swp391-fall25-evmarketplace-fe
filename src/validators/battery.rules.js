// Bắt buộc
export const batteryCapacityRule = [
    { required: true, message: "Nhập dung lượng kWh" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n <= 0) return Promise.reject("Dung lượng phải > 0");
            if (n > 300) return Promise.reject("Dung lượng > 300 kWh không hợp lệ");
            return Promise.resolve();
        },
    },
];

export const batterySOHRule = [
    { required: true, message: "Nhập SOH (%)" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n <= 0 || n > 100)
                return Promise.reject("SOH phải trong khoảng (0; 100]");
            // Nếu cần loại tin rác: if (n < 70) return Promise.reject("SOH quá thấp (<70%)");
            return Promise.resolve();
        },
    },
];

export const voltageRule = [
    { required: true, message: "Nhập điện áp (V)" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n <= 0) return Promise.reject("Điện áp phải > 0");
            if (n > 1000) return Promise.reject("Điện áp > 1000V không hợp lệ");
            return Promise.resolve();
        },
    },
];

// Tuỳ chọn: chỉ kiểm nếu có nhập
export const chemistryOptionalRule = [
    {
        validator: (_, v) => {
            if (!v) return Promise.resolve();
            if (String(v).length > 20) return Promise.reject("Hóa học pin tối đa 20 ký tự");
            return Promise.resolve();
        },
    },
];

export const weightOptionalRule = [
    {
        validator: (_, v) => {
            if (v === undefined || v === null || v === "") return Promise.resolve();
            const n = Number(v);
            if (Number.isNaN(n) || n < 0) return Promise.reject("Khối lượng không hợp lệ");
            if (n > 2000) return Promise.reject("Khối lượng > 2000 kg?");
            return Promise.resolve();
        },
    },
];

export const dimensionOptionalRule = [
    {
        validator: (_, v) => {
            if (!v) return Promise.resolve();
            // chấp nhận dạng 1700x1200x180 hoặc có dấu cách
            const ok = /^\s*\d{2,5}\s*x\s*\d{2,5}\s*x\s*\d{1,5}\s*$/i.test(String(v));
            return ok ? Promise.resolve() : Promise.reject("Định dạng mm: VD 1700x1200x180");
        },
    },
];
