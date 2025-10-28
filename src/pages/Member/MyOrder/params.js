import dayjs from "dayjs";
import { SORT_FIELD_WHITELIST } from "./constants";

const FMT = "YYYY-MM-DDTHH:mm:ss";

function normalizeRange(range) {
    const [rawStart, rawEnd] = range || [];
    let s = rawStart ? dayjs(rawStart) : null;
    let e = rawEnd ? dayjs(rawEnd) : null;

    // Nếu end không có giờ (00:00:00) => nới tới 23:59:59 của ngày đó
    if (e && e.hour() === 0 && e.minute() === 0 && e.second() === 0) {
        e = e.endOf("day");
    }
    return {
        start: s ? s.format(FMT) : undefined,
        end: e ? e.format(FMT) : undefined,
    };
}

export function buildQueryParams({
    page, size, orderNo, status, dateRange, sortField, sortOrder,
}) {
    const dir = sortOrder === "ascend" ? "asc" : "desc";
    const sort = SORT_FIELD_WHITELIST.has(sortField) ? sortField : "createdAt";
    const { start, end } = normalizeRange(dateRange);

    return {
        page: Math.max(0, (page ?? 1) - 1),
        size,
        dir,
        sort,
        orderNo: orderNo?.trim() || undefined,
        status: status || undefined,
        start,
        end,
    };
}

