export const fmtVN = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

export const getPurgeInfo = (r) => {
    const deadline = r?.purgeAt ? new Date(r.purgeAt) : null;
    if (!deadline || isNaN(deadline)) return { deadline: null, leftDays: null, isExpired: false };
    const diffMs = deadline - new Date();
    return { deadline, leftDays: Math.ceil(diffMs / (24 * 60 * 60 * 1000)), isExpired: diffMs <= 0 };
};