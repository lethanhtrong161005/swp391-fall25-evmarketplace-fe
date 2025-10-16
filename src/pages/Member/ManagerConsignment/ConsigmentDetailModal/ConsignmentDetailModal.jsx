import React from "react";
import { Modal, Descriptions, Divider, Image } from "antd";
import "./ConsignmentDetailModal.scss";

const ConsignmentDetailModal = ({ item, onClose }) => {
  if (!item) return null;

  const mediaList = item.mediaUrls || item.media_url || [];

  return (
    <Modal
      open={!!item}
      onCancel={onClose}
      footer={null}
      title="Chi tiết ký gửi"
      width={800}
      className="modal"
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Số điện thoại">{item.accountPhone}</Descriptions.Item>
        <Descriptions.Item label="Tên chủ sở hữu">{item.accountName}</Descriptions.Item>
        <Descriptions.Item label="Loại sản phẩm">{item.itemType}</Descriptions.Item>
        <Descriptions.Item label="Danh mục">{item.category}</Descriptions.Item>
        <Descriptions.Item label="Hãng">{item.brand}</Descriptions.Item>
        <Descriptions.Item label="Model">{item.model}</Descriptions.Item>
        <Descriptions.Item label="Năm sản xuất">{item.year}</Descriptions.Item>
        <Descriptions.Item label="Dung lượng pin (kWh)">{item.batteryCapacityKwh}</Descriptions.Item>
        <Descriptions.Item label="SOH (%)">{item.sohPercent}</Descriptions.Item>
        <Descriptions.Item label="Quãng đường (km)">{item.mileageKm}</Descriptions.Item>
        <Descriptions.Item label="Chi nhánh ưu tiên">{item.preferredBranchName}</Descriptions.Item>
        <Descriptions.Item label="Giá mong muốn">
          {item.ownerExpectedPrice?.toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{item.status}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(item.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      {mediaList.length > 0 && (
        <>
          <Divider className="dividerdivider">Hình ảnh & Video</Divider>
          <div className="mediaGrid">
            <Image.PreviewGroup>
              {mediaList.map((url, index) =>
                /\.(mp4|mov|avi|webm)$/i.test(url) ? (
                  <video
                    key={index}
                    src={url}
                    controls
                    className="video"
                  />
                ) : (
                  <Image
                    key={index}
                    src={url}
                    alt={`media-${index}`}
                    className="image"
                  />
                )
              )}
            </Image.PreviewGroup>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConsignmentDetailModal;
