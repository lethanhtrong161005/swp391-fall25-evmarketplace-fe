import { useState } from "react";
import { Upload, Form } from "antd";

export const MAX_IMAGES = 8;
export const MAX_VIDEOS = 2;
export const MAX_VIDEO_MB = 200;

export function useSectionMedia(messageApi) {
    const form = Form.useFormInstance();
    const msg = messageApi;

    const beforeUploadImage = (file, fileList = []) => {
        if (!file?.type?.startsWith("image/")) {
            msg?.error?.("Chỉ cho phép tập tin ảnh.");
            return Upload.LIST_IGNORE;
        }
        const current = form?.getFieldValue("images") || [];
        const indexInBatch = fileList.findIndex((f) => f.uid === file.uid);
        const willCount = current.length + (indexInBatch + 1);
        if (willCount > MAX_IMAGES) {
            msg?.warning?.(`Tối đa ${MAX_IMAGES} ảnh. Ảnh vượt mức sẽ bị bỏ qua.`);
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    const normImages = (e) => {
        let files = Array.isArray(e) ? e : e?.fileList || [];
        if (files.length > MAX_IMAGES) {
            files = files.slice(0, MAX_IMAGES);
            msg?.warning?.(`Chỉ lưu tối đa ${MAX_IMAGES} ảnh.`);
        }
        return files;
    };

    const beforeUploadVideo = (file, fileList = []) => {
        if (!file?.type?.startsWith("video/")) {
            msg?.error?.("Chỉ cho phép tập tin video.");
            return Upload.LIST_IGNORE;
        }
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_VIDEO_MB) {
            msg?.error?.(`Video > ${MAX_VIDEO_MB}MB: ${file.name}`);
            return Upload.LIST_IGNORE;
        }
        const current = form?.getFieldValue("videos") || [];
        const indexInBatch = fileList.findIndex((f) => f.uid === file.uid);
        const willCount = current.length + (indexInBatch + 1);
        if (willCount > MAX_VIDEOS) {
            msg?.warning?.(`Tối đa ${MAX_VIDEOS} video.`);
            return Upload.LIST_IGNORE;
        }
        return false;
    };

    const normVideos = (e) => {
        let files = Array.isArray(e) ? e : e?.fileList || [];
        if (files.length > MAX_VIDEOS) {
            msg?.warning?.(`Chỉ lưu tối đa ${MAX_VIDEOS} video.`);
            files = files.slice(0, MAX_VIDEOS);
        }
        return files;
    };

    const [dragUid, setDragUid] = useState(null);
    const onDragStart = (_, file) => setDragUid(file.uid);
    const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
    const onDrop = (e, targetFile) => {
        e.preventDefault();
        const list = form?.getFieldValue("images") || [];
        const from = list.findIndex((f) => f.uid === dragUid);
        const to = list.findIndex((f) => f.uid === targetFile.uid);
        if (from < 0 || to < 0 || from === to) return;
        const next = [...list];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        form?.setFieldsValue({ images: next });
        setDragUid(null);
    };

    return {
        MAX_IMAGES, MAX_VIDEOS, MAX_VIDEO_MB,

        beforeUploadImage, normImages,

        beforeUploadVideo, normVideos,

        onDragStart, onDragOver, onDrop,
    };
}
