import React from "react";
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
import s from "./MediaGallery.module.scss";
import { useMediaGallery } from "./logic";

const { Text } = Typography;

export default function MediaGallery({ images = [] }) {
  const { data, active, ref, handlePrev, handleNext, handleGoTo } =
    useMediaGallery(images);

  if (!data.length) return <Empty description="Chưa có hình ảnh" />;

  return (
    <div className={s.container}>
      {/* Nút prev/next overlay */}
      <Button
        shape="circle"
        size="large"
        icon={<LeftOutlined />}
        onClick={handlePrev}
        className={s.navButton}
        style={{ left: 8 }}
      />
      <Button
        shape="circle"
        size="large"
        icon={<RightOutlined />}
        onClick={handleNext}
        className={s.navButton}
        style={{ right: 8 }}
      />

      <Image.PreviewGroup>
        {/* Ảnh lớn dạng carousel */}
        <Carousel
          ref={ref}
          dots={false}
          beforeChange={(_, next) => handleGoTo(next)}
          className={s.carousel}
        >
          {data.map((url, i) => (
            <div key={`main-${i}`}>
              <Image
                src={url}
                alt={`image-${i + 1}`}
                width="100%"
                height={380}
                className={s.mainImage}
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
                  className={`${s.thumbnail} ${i === active ? s.active : ""}`}
                >
                  <Image
                    src={url}
                    alt={`thumb-${i + 1}`}
                    width={76}
                    height={76}
                    className={s.thumbImage}
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
