import { Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const CreateListingFooter = ({
  currentPostType,
  currentMode,
  onChoosePostType,
  onPreview,
  onDraft,
  onSubmit,
  submitting,
  maxWidth = 1024,
  isEdit = false,
}) => {
  const mode = currentPostType || currentMode || "NORMAL";
  const label =
    mode === "BOOSTED" ? "Đăng tin trả phí" : "Đăng tin thường (Miễn phí)";

  const handleDraftClick = () => {
    if (submitting) return;
    onDraft && onDraft({ status: "DRAFT" });
  };

  const handleSubmitClick = () => {
    if (submitting) return;
    onSubmit && onSubmit({ status: "PENDING" });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.inner} style={{ "--max-w": `${maxWidth}px` }}>
        <div className={styles.contentWrapper}>
          {onChoosePostType && (
            <Button
              onClick={onChoosePostType}
              size="large"
              className={styles.postTypeBtn}
            >
              {label} <DownOutlined />
            </Button>
          )}

          <div className={styles.actionsWrapper}>
            {!isEdit && (
              <Button
                size="large"
                className={styles.actionBtn}
                onClick={handleDraftClick}
                disabled={submitting}
              >
                Lưu nháp
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              className={styles.actionBtn}
              onClick={handleSubmitClick}
              loading={submitting}
            >
              {isEdit ? "Cập nhật tin" : "Đăng tin"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingFooter;
