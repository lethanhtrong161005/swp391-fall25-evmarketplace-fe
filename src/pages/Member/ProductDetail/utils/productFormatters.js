// src/pages/Member/ProductDetail/utils/productFormatters.js

/**
 * Format số tiền sang định dạng VND
 * @param {number} n - Số tiền cần format
 * @returns {string} - Chuỗi tiền đã format
 */
export function toVND(n) {
  if (!n) return "";
  return `${Number(n).toLocaleString("vi-VN")} đ`;
}

/**
 * Format số km với dấu phẩy
 * @param {number} km - Số km
 * @returns {string} - Chuỗi km đã format
 */
export function formatMileage(km) {
  if (!km) return "";
  return km.toLocaleString("vi-VN");
}

/**
 * Format phần trăm
 * @param {number} percent - Phần trăm
 * @returns {string} - Chuỗi phần trăm
 */
export function formatPercentage(percent) {
  if (percent == null) return "";
  return `${percent}%`;
}

/**
 * Format kích thước
 * @param {string} dimension - Kích thước
 * @returns {string} - Kích thước đã format
 */
export function formatDimension(dimension) {
  if (!dimension) return "";
  return dimension;
}
