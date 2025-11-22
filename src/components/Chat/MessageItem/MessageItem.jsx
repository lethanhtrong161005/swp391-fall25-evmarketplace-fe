import React from "react";
import { Avatar, Typography, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import s from "./MessageItem.module.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Paragraph } = Typography;

const MessageItem = ({ message, isOwnMessage = false, senderInfo = null }) => {
  const messageType = message?.type?.toUpperCase() || "TEXT";
  const textContent = message?.textContent || message?.content || "";
  const mediaUrl = message?.mediaUrl;
  const createdAt = message?.createdAt;
  const senderName = senderInfo?.name || message?.senderName || "Người dùng";

  // Định dạng timestamp thành giờ:phút (HH:mm)
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return dayjs(timestamp).format("HH:mm");
  };

  return (
    <div className={`${s.messageItem} ${isOwnMessage ? s.ownMessage : s.otherMessage}`}>
      {!isOwnMessage && (
        <Avatar
          src={senderInfo?.avatarUrl}
          icon={!senderInfo?.avatarUrl && <UserOutlined />}
          className={s.avatar}
        />
      )}
      <div className={s.messageContent}>
        {!isOwnMessage && (
          <Text className={s.senderName}>{senderName}</Text>
        )}
        <div className={s.messageBubble}>
          {messageType === "TEXT" && textContent && (
            <Paragraph className={s.textContent} style={{ margin: 0 }}>
              {textContent}
            </Paragraph>
          )}
          
          {messageType === "IMAGE" && mediaUrl && (
            <Image
              src={mediaUrl}
              alt="Image"
              className={s.mediaImage}
              preview={{
                mask: "Xem ảnh",
              }}
              style={{ display: 'block' }}
            />
          )}
          
          {messageType === "VIDEO" && mediaUrl && (
            <video
              src={mediaUrl}
              controls
              className={s.mediaVideo}
              playsInline
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          )}
          
          {createdAt && (
            <Text className={s.timestamp}>{formatTime(createdAt)}</Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

