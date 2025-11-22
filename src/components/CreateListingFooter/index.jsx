import { Button, Layout, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const { Footer } = Layout;

const CreateListingFooter = ({
  currentPostType,
  currentMode,
  onChoosePostType,
  onPreview, // eslint-disable-line no-unused-vars
  onDraft,
  onSubmit,
  submitting,
  maxWidth = 1024,
  isEdit = false,
  mode = "normal", // normal | agreement | agreement-update
  inModal = false, // Nếu Footer nằm trong Modal
}) => {
  const displayMode = currentPostType || currentMode || "NORMAL";
  const label =
    displayMode === "BOOSTED"
      ? "Đăng tin trả phí"
      : "Đăng tin thường (Miễn phí)";

  const handleDraftClick = () => {
    if (submitting) return;
    onDraft && onDraft({ status: "DRAFT" });
  };

  const handleSubmitClick = () => {
    if (submitting) return;

    if (mode === "agreement-update") {
      onSubmit && onSubmit({ status: "ACTIVE" });
    } else if (mode === "agreement") {
      onSubmit && onSubmit({ status: "ACTIVE" });
    } else {
      onSubmit && onSubmit({ status: "PENDING" });
    }
  };

  const showDraftButton =
    !isEdit && mode !== "agreement" && mode !== "agreement-update";

  return (
    <Footer 
      className={`${styles.footer} ${inModal ? styles.footerInModal : ''}`} 
      style={{ "--max-w": `${maxWidth}px` }}
    >
      <div className={styles.footerContent}>
        <Space size="middle" wrap className={styles.footerActions}>
          {onChoosePostType && (
            <Button
              onClick={onChoosePostType}
              size="large"
              className={styles.postTypeBtn}
            >
              {label} <DownOutlined />
            </Button>
          )}
          <Space size="small">
            {showDraftButton && (
              <Button
                size="large"
                onClick={handleDraftClick}
                disabled={submitting}
              >
                Lưu nháp
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              onClick={handleSubmitClick}
              loading={submitting}
            >
              {mode === "agreement-update"
                ? "Cập nhật tin"
                : isEdit
                ? "Cập nhật tin"
                : "Đăng tin"}
            </Button>
          </Space>
        </Space>
      </div>
    </Footer>
  );
};

export default CreateListingFooter;
