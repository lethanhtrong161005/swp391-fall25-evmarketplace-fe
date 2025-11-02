import { Affix, Row, Col, Button } from "antd";
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
  mode = "normal", // 🔹 thêm prop mới
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
    if (mode === "agreement") {
      onSubmit && onSubmit("agreement"); // 🔹 gọi đúng mode agreement
    } else {
      onSubmit && onSubmit({ status: "PENDING" });
    }
  };

  return (
    <Affix offsetBottom={0}>
      <div className={styles.bar}>
        <div className={styles.inner} style={{ "--max-w": `${maxWidth}px` }}>
          <Row
            align="middle"
            justify="space-between"
            gutter={12}
            wrap
            className={styles.layoutRow}
          >
            {onChoosePostType && (
              <Col flex="1 1 auto">
                <Button
                  onClick={onChoosePostType}
                  size="large"
                  className={styles.postTypeBtn}
                >
                  {label} <DownOutlined />
                </Button>
              </Col>
            )}
            <Col style={{ marginLeft: "auto" }}>
              <Row gutter={8} wrap={false} className={styles.actionsRow}>
                {!isEdit && (
                  <Col>
                    <Button
                      size="large"
                      className={styles.actionBtn}
                      onClick={handleDraftClick}
                      disabled={submitting}
                    >
                      Lưu nháp
                    </Button>
                  </Col>
                )}
                <Col>
                  <Button
                    type="primary"
                    size="large"
                    className={styles.actionBtn}
                    onClick={handleSubmitClick}
                    loading={submitting}
                  >
                    {isEdit ? "Cập nhật tin" : "Đăng tin"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Affix>
  );
};

export default CreateListingFooter;
