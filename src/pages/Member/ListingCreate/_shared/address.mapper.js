// pages/listing/_shared/address.mapper.js
export const SEND_ADDRESS_BY = "name"; // "name" | "code"

export function normalizeAddressForBE(addr) {
    if (!addr) return { province: "", district: "", ward: "", address: "" };

    const pick = (opt) =>
        SEND_ADDRESS_BY === "code" ? (opt?.value ?? "") : (opt?.label ?? "");

    return {
        province: pick(addr.province),
        district: pick(addr.district),
        ward: pick(addr.ward),
        address: (addr.line || "").trim(),
    };
}
