// src/validators/address.rules.js
export const addressRule = [
    { required: true, message: "Vui lòng nhập địa chỉ" },
    {
        validator: (_, addr) => {
            if (!addr) return Promise.reject("Chưa chọn địa chỉ");
            if (!addr.province || !addr.district || !addr.ward) {
                return Promise.reject("Địa chỉ phải đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã");
            }
            return Promise.resolve();
        },
    },
];
