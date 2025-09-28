// Chuẩn hoá sang { value, label } cho AntD Select
import subVn from "sub-vn";

export const getProvinces = () =>
  subVn.getProvinces().map(p => ({ value: p.code, label: p.name }));

export const getDistrictsByProvinceCode = (provinceCode) =>
  subVn.getDistrictsByProvinceCode(provinceCode).map(d => ({ value: d.code, label: d.name }));

export const getWardsByDistrictCode = (districtCode) =>
  subVn.getWardsByDistrictCode(districtCode).map(w => ({ value: w.code, label: w.name }));
