import React, { useMemo, useRef, useState } from "react";
import {
  Button,
  Carousel,
  Col,
  Empty,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Text } = Typography;

/** Gallery: Carousel hiển thị ảnh lớn, click thumbnail để goTo(index).
 *  Vẫn gắn PreviewGroup để phóng to toàn bộ album.
 */
export default function MediaGallery({ images = [] }) {
  const data = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  if (!data.length) return <Empty description="Chưa có hình ảnh" />;

  return (
    <div style={{ position: "relative" }}>
      {/* Nút prev/next overlay */}
      <Button
        shape="circle"
        size="large"
        icon={<LeftOutlined />}
        onClick={() => ref.current?.prev()}
        style={{ position: "absolute", top: "45%", left: 8, zIndex: 2 }}
      />
      <Button
        shape="circle"
        size="large"
        icon={<RightOutlined />}
        onClick={() => ref.current?.next()}
        style={{ position: "absolute", top: "45%", right: 8, zIndex: 2 }}
      />

      <Image.PreviewGroup>
        {/* Ảnh lớn dạng carousel (ẩn dots để gọn) */}
        <Carousel
          ref={ref}
          dots={false}
          beforeChange={(_, next) => setActive(next)}
          style={{
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
          }}
        >
          {data.map((url, i) => (
            <div key={`main-${i}`}>
              <Image
                src={url}
                alt={`image-${i + 1}`}
                width="100%"
                height={380}
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </Carousel>

        {/* Thumbnails */}
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            {data.map((url, i) => (
              <Col key={`thumb-${i}`}>
                <div
                  onClick={() => ref.current?.goTo(i)}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 6,
                    overflow: "hidden",
                    border: `2px solid ${i === active ? "#1677ff" : "#f0f0f0"}`,
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={url}
                    alt={`thumb-${i + 1}`}
                    width={76}
                    height={76}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Col>
            ))}
          </Row>
          <Text type="secondary">
            {active + 1}/{data.length}
          </Text>
        </Space>

        {/* Ẩn thêm ảnh để PreviewGroup gom đủ khi phóng to */}
        <div style={{ display: "none" }}>
          {data.map((u, i) => (
            <Image key={`hidden-${i}`} src={u} />
          ))}
        </div>
      </Image.PreviewGroup>
    </div>
  );
}
