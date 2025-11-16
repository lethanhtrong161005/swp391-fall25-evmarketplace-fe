
export function getAbsoluteMediaUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function pickUrl(m) {
    if (!m) return "";
    if (typeof m === "string") return m;
    return m.url || m.mediaUrl || m.src || ""; 
}

function pickType(m) {
    if (!m) return "";
 
    const raw = (m.type || m.mediaType || m.mime || "").toString().toUpperCase();

    if (raw.includes("IMAGE")) return "IMAGE";
    if (raw.includes("VIDEO")) return "VIDEO";

    const url = pickUrl(m).toLowerCase();
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|heic|avif)(\?|#|$)/.test(url);
    const isVideo = /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)(\?|#|$)/.test(url);
    if (isImage) return "IMAGE";
    if (isVideo) return "VIDEO";
    return "";
}

export function mapMediaToUploadFormat(mediaArray, type) {
    if (!Array.isArray(mediaArray)) return [];

    return mediaArray
        .filter((m) => {
            if (!m) return false;
            const t = pickType(m);
            if (t) return t === type;

            // Trường hợp m là string, đoán theo ext:
            if (typeof m === "string") {
                const u = m.toLowerCase();
                if (type === "IMAGE") {
                    return /\.(jpg|jpeg|png|gif|webp|bmp|heic|avif)(\?|#|$)/.test(u);
                }
                if (type === "VIDEO") {
                    return /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)(\?|#|$)/.test(u);
                }
            }
            return false;
        })
        .map((m, index) => {
            const urlRaw = pickUrl(m);
            const urlAbs = getAbsoluteMediaUrl(urlRaw);

            const id =
                (typeof m === "object" && (m.id || m.uid)) || `media_${index}`;
            const nameFromUrl =
                (urlRaw && urlRaw.split("/").pop()) || `media_${index}`;
            const name =
                (typeof m === "object" && (m.filename || m.name)) || nameFromUrl;

            return {
                uid: String(id),
                name,
                status: "done",
                url: urlAbs,
                thumbUrl: type === "IMAGE" ? urlAbs : undefined,
                origin: "server",
                _raw: m,
            };
        });
}


export function debugMediaMapping(mediaArray) {
    if (!Array.isArray(mediaArray)) {
        return;
    }
    const images = mapMediaToUploadFormat(mediaArray, "IMAGE");
    const videos = mapMediaToUploadFormat(mediaArray, "VIDEO");
}
