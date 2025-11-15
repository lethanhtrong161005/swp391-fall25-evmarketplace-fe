import React, { useState, useRef } from "react";
import { Input, Button, Upload, Space, Image, message as antMessage } from "antd";
import { SendOutlined, PictureOutlined, VideoCameraOutlined, CloseOutlined } from "@ant-design/icons";
import s from "./ChatInput.module.scss";

const { TextArea } = Input;

// Giới hạn dung lượng file
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Hàm format dung lượng file
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const ChatInput = ({
  onSendText,
  onSendMedia,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
}) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleSendText = () => {
    if (!text.trim() || disabled) return;
    onSendText?.(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      antMessage.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      antMessage.error(
        `Kích thước ảnh không được vượt quá ${formatFileSize(MAX_IMAGE_SIZE)}. File của bạn: ${formatFileSize(file.size)}`
      );
      return;
    }

    setPreviewFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setVideoPreview(null);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      antMessage.error("Vui lòng chọn file video");
      return;
    }

    // Validate file size
    if (file.size > MAX_VIDEO_SIZE) {
      antMessage.error(
        `Dung lượng video không được vượt quá ${formatFileSize(MAX_VIDEO_SIZE)}. File của bạn: ${formatFileSize(file.size)}`
      );
      // Clear input để người dùng có thể chọn file khác
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
      return;
    }

    setPreviewFile(file);
    setImagePreview(null);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSendImage = () => {
    if (!previewFile || disabled) return;
    onSendMedia?.(previewFile, "IMAGE");
    clearPreview();
  };

  const handleSendVideo = () => {
    if (!previewFile || disabled) return;
    
    // Kiểm tra lại dung lượng trước khi gửi (double check)
    if (previewFile.size > MAX_VIDEO_SIZE) {
      antMessage.error(
        `Dung lượng video không được vượt quá ${formatFileSize(MAX_VIDEO_SIZE)}. File của bạn: ${formatFileSize(previewFile.size)}`
      );
      clearPreview();
      return;
    }
    
    onSendMedia?.(previewFile, "VIDEO");
    clearPreview();
  };

  const clearPreview = () => {
    setImagePreview(null);
    setVideoPreview(null);
    setPreviewFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const imageUploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    showUploadList: false,
    accept: "image/*",
    onChange: handleImageChange,
  };

  const videoUploadProps = {
    beforeUpload: (file) => {
      // Validate file size trước khi xử lý
      if (file.size > MAX_VIDEO_SIZE) {
        antMessage.error(
          `Dung lượng video không được vượt quá ${formatFileSize(MAX_VIDEO_SIZE)}. File của bạn: ${formatFileSize(file.size)}`
        );
        return Upload.LIST_IGNORE; // Prevent file from being added
      }
      return false; // Prevent auto upload
    },
    showUploadList: false,
    accept: "video/*",
    onChange: handleVideoChange,
  };

  return (
    <div className={s.chatInput}>
      {(imagePreview || videoPreview) && (
        <div className={s.previewContainer}>
          {imagePreview && (
            <div className={s.imagePreview}>
              <Image src={imagePreview} alt="Preview" className={s.previewImage} />
              <div className={s.previewActions}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendImage}
                  disabled={disabled}
                >
                  Gửi ảnh
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={clearPreview}
                  disabled={disabled}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
          {videoPreview && (
            <div className={s.videoPreview}>
              <video src={videoPreview} controls className={s.previewVideo} />
              <div className={s.previewActions}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendVideo}
                  disabled={disabled}
                >
                  Gửi video
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={clearPreview}
                  disabled={disabled}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className={s.inputContainer}>
        <Space.Compact className={s.inputGroup} style={{ width: "100%" }}>
          <Upload {...imageUploadProps}>
            <Button
              icon={<PictureOutlined />}
              disabled={disabled}
              className={s.uploadButton}
            />
          </Upload>
          <Upload {...videoUploadProps}>
            <Button
              icon={<VideoCameraOutlined />}
              disabled={disabled}
              className={s.uploadButton}
            />
          </Upload>
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className={s.textInput}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendText}
            disabled={disabled || !text.trim()}
            className={s.sendButton}
          >
            Gửi
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};

export default ChatInput;

