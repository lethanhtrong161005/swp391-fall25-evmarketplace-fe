// src/validators/listing.rules.js
export const requiredText = (field, max = 255) => ([
    { required: true, message: `Vui lòng nhập ${field}` },
    { max, message: `${field} tối đa ${max} ký tự` },
]);

export const requiredSelect = (field) => ([
    { required: true, message: `Vui lòng chọn ${field}` },
]);

export const priceRule = [
    { required: true, message: "Vui lòng nhập giá bán" },
    {
        validator: (_, v) => {
            if (!v || Number(v) <= 0) return Promise.reject("Giá phải lớn hơn 0");
            if (Number(v) < 1000000) return Promise.reject("Giá tối thiểu 1.000.000đ");
            return Promise.resolve();
        },
    },
];

export const mileageRule = [
    { required: true, message: "Nhập số Km đã đi" },
    {
        validator: (_, v) => {
            if (v === undefined || v === null) return Promise.reject("Nhập số Km đã đi");
            if (Number(v) < 0) return Promise.reject("Số Km không hợp lệ");
            if (Number(v) > 500000) return Promise.reject("Xe đã đi quá 500.000 km?");
            return Promise.resolve();
        },
    },
];
