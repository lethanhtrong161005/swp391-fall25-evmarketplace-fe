export const normalizeAddressForBE = (addr = {}) => ({
    province: addr?.province?.label ?? addr?.province ?? "",
    district: addr?.district?.label ?? addr?.district ?? "",
    ward: addr?.ward?.label ?? addr?.ward ?? "",
    address: addr?.line ?? "",
});