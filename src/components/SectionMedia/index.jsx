import { Form, Upload, Typography, Space } from "antd";
import { PlusOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import {
  useSectionMedia,
  MAX_IMAGES,
  MAX_VIDEOS,
  MAX_VIDEO_MB,
} from "@hooks/useSectionMedia";

export default function SectionMedia({
  messageApi,
  images = [],
  setImages,
  videos = [],
  setVideos,
}) {
  const {
    beforeUploadImage,
    normImages,
    beforeUploadVideo,
    normVideos,
    onDragStart,
    onDragOver,
    onDrop,
  } = useSectionMedia(messageApi);

  const handleImageChange = ({ fileList }) => {
    setImages?.(fileList || []);
  };

  const handleVideoChange = ({ fileList }) => {
    setVideos?.(fileList || []);
  };

  return (
    <Space direction="vertical" size={16} className={styles.wrapper}>
      <div>
        <Typography.Text className={styles.header}>
          Hình ảnh và Video sản phẩm
        </Typography.Text>
        <Typography.Paragraph className={styles.subtle}>
          Xem thêm về{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Quy định ảnh và video
          </a>
        </Typography.Paragraph>
      </div>

      <div className={styles.box}>
        <Typography.Text className={styles.sectionLabel}>
          Hình ảnh hợp lệ
        </Typography.Text>

        <Form.Item
          name="images"
          valuePropName="fileList"
          getValueFromEvent={normImages}
          className={styles.formItemTight}
          rules={[
            { required: true, message: "Vui lòng tải lên ít nhất 3 ảnh" },
            {
              validator: (_, lst) =>
                (lst?.length ?? 0) >= 3
                  ? Promise.resolve()
                  : Promise.reject(new Error("Cần tối thiểu 3 ảnh.")),
            },
          ]}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            multiple
            maxCount={MAX_IMAGES}
            showUploadList={{ showPreviewIcon: false }}
            beforeUpload={beforeUploadImage}
            fileList={images}
            onChange={handleImageChange}
            itemRender={(originNode, file) => (
              <div
                className={styles.draggable}
                draggable
                onDragStart={(e) => onDragStart(e, file)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, file)}
              >
                {originNode}
              </div>
            )}
          >
            <div className={styles.addCard}>
              <PlusOutlined />
              <div>Tối đa {MAX_IMAGES} ảnh</div>
            </div>
          </Upload>
        </Form.Item>

        <Typography.Paragraph className={styles.note}>
          Nhấn và giữ để di chuyển hình ảnh
        </Typography.Paragraph>
      </div>

      <div className={styles.videoBox}>
        <Typography.Text className={styles.sectionLabel}>
          Bán nhanh hơn với video
        </Typography.Text>

        <Form.Item
          name="videos"
          valuePropName="fileList"
          getValueFromEvent={normVideos}
          className={styles.formItemTight}
        >
          <Upload
            accept="video/*"
            listType="picture-card"
            multiple
            maxCount={MAX_VIDEOS}
            beforeUpload={beforeUploadVideo}
            fileList={videos}
            onChange={handleVideoChange}
          >
            <div className={styles.addCard}>
              <VideoCameraAddOutlined />
              <div>
                Tối đa {MAX_VIDEOS} video • ≤ {MAX_VIDEO_MB}MB
              </div>
            </div>
          </Upload>
        </Form.Item>
      </div>
    </Space>
  );
}
