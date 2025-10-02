import React, { useState } from "react";
import { Form, Upload, Typography, Space } from "antd";       // ⬅️ bỏ { message }
import { PlusOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

const MAX_IMAGES = 8;
const MAX_VIDEOS = 2;
const MAX_VIDEO_MB = 200;

export default function SectionMedia({ messageApi }) {
  const form = Form.useFormInstance();           // có vì component nằm trong <Form>
  const msg = messageApi;                        // ❗ KHÔNG fallback về static message

  // ---------- IMAGE RULES ----------
  const beforeUploadImage = (file, batch = []) => {
    if (!file?.type?.startsWith("image/")) {
      msg?.error("Chỉ cho phép tập tin ảnh.");
      return Upload.LIST_IGNORE;
    }
    const current = form?.getFieldValue("images") || [];
    const indexInBatch = batch.findIndex((f) => f.uid === file.uid);
    const willCount = current.length + (indexInBatch + 1);
    if (willCount > MAX_IMAGES) {
      msg?.warning(`Tối đa ${MAX_IMAGES} ảnh. Ảnh vượt mức sẽ bị bỏ qua.`);
      return Upload.LIST_IGNORE;
    }
    return false;                                 // không auto-upload
  };

  const normImages = (e) => {
    let files = Array.isArray(e) ? e : e?.fileList || [];
    if (files.length > MAX_IMAGES) {
      files = files.slice(0, MAX_IMAGES);
      msg?.warning(`Chỉ lưu tối đa ${MAX_IMAGES} ảnh.`);
    }
    return files;
  };

  // ---------- VIDEO RULES ----------
  const beforeUploadVideo = (file, batch = []) => {
    if (!file?.type?.startsWith("video/")) {
      msg?.error("Chỉ cho phép tập tin video.");
      return Upload.LIST_IGNORE;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_VIDEO_MB) {
      msg?.error(`Video > ${MAX_VIDEO_MB}MB: ${file.name}`);
      return Upload.LIST_IGNORE;
    }
    const current = form?.getFieldValue("videos") || [];
    const indexInBatch = batch.findIndex((f) => f.uid === file.uid);
    const willCount = current.length + (indexInBatch + 1);
    if (willCount > MAX_VIDEOS) {
      msg?.warning(`Tối đa ${MAX_VIDEOS} video.`);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const normVideos = (e) => {
    let files = Array.isArray(e) ? e : e?.fileList || [];
    if (files.length > MAX_VIDEOS) {
      msg?.warning(`Chỉ lưu tối đa ${MAX_VIDEOS} video.`);
      files = files.slice(0, MAX_VIDEOS);
    }
    return files;
  };

  // ---------- drag & drop reorder ----------
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

  const boxStyle = { border: "1px dashed #e5e7eb", borderRadius: 8, padding: 12 };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div>
        <Typography.Text strong>Hình ảnh và Video sản phẩm</Typography.Text>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          Xem thêm về <a href="#" onClick={(e)=>e.preventDefault()}>Quy định đăng tin</a>
        </Typography.Paragraph>
      </div>

      {/* IMAGES */}
      <div style={boxStyle}>
        <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
          Hình ảnh hợp lệ
        </Typography.Text>

        <Form.Item
          name="images"
          valuePropName="fileList"
          getValueFromEvent={normImages}
          rules={[{ required: true, message: "Vui lòng tải lên ít nhất 3 ảnh" }, {
            validator: (_, lst) =>
              (lst?.length ?? 0) >= 3 ? Promise.resolve() :
              Promise.reject(new Error("Cần tối thiểu 3 ảnh.")),
          }]}
          style={{ margin: 0 }}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            multiple
            maxCount={MAX_IMAGES}
            showUploadList={{ showPreviewIcon: false }}  // bỏ nút “mắt”
            beforeUpload={beforeUploadImage}
            itemRender={(originNode, file) => (
              <div
                draggable
                onDragStart={(e) => onDragStart(e, file)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, file)}
                style={{ cursor: "grab" }}
              >
                {originNode}
              </div>
            )}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tối đa {MAX_IMAGES} ảnh</div>
            </div>
          </Upload>
        </Form.Item>

        <Typography.Paragraph type="secondary" style={{ marginTop: 6 }}>
          Nhấn và giữ để di chuyển hình ảnh
        </Typography.Paragraph>
      </div>

      {/* VIDEOS */}
      <div style={{ ...boxStyle, background: "#fff7e6", borderColor: "#fde3cf" }}>
        <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
          Bán nhanh hơn với video
        </Typography.Text>

        <Form.Item
          name="videos"
          valuePropName="fileList"
          getValueFromEvent={normVideos}
          style={{ margin: 0 }}
        >
          <Upload
            accept="video/*"
            listType="picture-card"
            multiple
            maxCount={MAX_VIDEOS}
            beforeUpload={beforeUploadVideo}
          >
            <div>
              <VideoCameraAddOutlined />
              <div style={{ marginTop: 8 }}>
                Tối đa {MAX_VIDEOS} video • ≤ {MAX_VIDEO_MB}MB
              </div>
            </div>
          </Upload>
        </Form.Item>
      </div>
    </Space>
  );
}
