export const priceRule = [
    { required: true, message: "Nhập giá bán" },
    {
        validator: (_, v) => {
            const n = Number(v);
            if (Number.isNaN(n) || n <= 0) {
                return Promise.reject("Giá bán phải > 0");
            }
            if (n < 100000) {
                return Promise.reject("Giá bán tối thiểu 100.000 VND");
            }
            if (n > 10000000000) {
                return Promise.reject("Giá bán quá lớn (tối đa 10 tỷ)");
            }
            return Promise.resolve();
        },
    },
];
