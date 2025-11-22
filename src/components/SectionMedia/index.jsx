import { Form, Upload, Typography, Space } from "antd";
import { PlusOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import {
  useSectionMedia,
  MAX_IMAGES,
  MAX_VIDEOS,
  MAX_VIDEO_MB,
} from "@hooks/useSectionMedia";

export default function SectionMedia({ messageApi }) {
  const form = Form.useFormInstance();
  const images = Form.useWatch("images", form);

  const {
    beforeUploadImage,
    normImages,
    beforeUploadVideo,
    normVideos,
    onDragStart,
    onDragOver,
    onDrop,
  } = useSectionMedia(messageApi);

  // Kiểm tra xem file có phải là ảnh đầu tiên không
  const isFirstImage = (file) => {
    const imageList = images || [];
    return imageList.length > 0 && imageList[0]?.uid === file?.uid;
  };

  return (
    <Space direction="vertical" size={16} className={styles.wrapper}>
      <div>
        <Typography.Text className={styles.header}>
          Hình ảnh và Video sản phẩm
        </Typography.Text>
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
            itemRender={(originNode, file) => {
              const isCover = isFirstImage(file);
              return (
                <div
                  className={styles.draggable}
                  draggable
                  onDragStart={(e) => onDragStart(e, file)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, file)}
                >
                  {originNode}
                  {isCover && (
                    <div className={styles.coverBadge}>
                      <span className={styles.coverText}>Hình bìa</span>
                    </div>
                  )}
                </div>
              );
            }}
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
