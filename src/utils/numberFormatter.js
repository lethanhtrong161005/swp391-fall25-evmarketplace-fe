export function formatNumberVN(value, options = {}) {
  if (value == null || value === "" || !Number.isFinite(Number(value))) {
    return "";
  }

  const numValue = Number(value);

  let minimumFractionDigits = options.minimumFractionDigits ?? 0;
  let maximumFractionDigits = options.maximumFractionDigits;

  if (maximumFractionDigits === undefined) {
    const hasDecimal = numValue % 1 !== 0;
    if (hasDecimal) {
      const decimalPart = numValue.toString().split(".")[1];
      maximumFractionDigits = decimalPart
        ? Math.min(decimalPart.length, 10)
        : 2;
      minimumFractionDigits = Math.min(
        minimumFractionDigits,
        maximumFractionDigits
      );
    } else {
      maximumFractionDigits = minimumFractionDigits;
    }
  }

  try {
    const formatter = new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits,
      maximumFractionDigits,
      ...options,
    });
    return formatter.format(numValue);
  } catch {
    return numValue.toString();
  }
}

export function formatNumberWithUnit(value, unit, options = {}) {
  const formatted = formatNumberVN(value, options);
  if (!formatted) return "";
  return `${formatted} ${unit}`;
}
