import { Affix, Row, Col, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const CreateListingFooter = ({
    currentPostType,          // optional
    currentMode,              // optional (bạn đang truyền cái này = visibility)
    onChoosePostType,
    onPreview,
    onDraft,
    onSubmit,
    submitting,
    maxWidth = 1024,
}) => {
    // chấp nhận cả currentPostType hoặc currentMode (NORMAL/BOOSTED)
    const mode = currentPostType || currentMode || "NORMAL";
    const label = mode === "BOOSTED" ? "Đăng tin trả phí" : "Đăng tin thường (Miễn phí)";

    const handleDraftClick = () => {
        if (submitting) return;
        onDraft && onDraft({ status: "DRAFT" });        // ➜ gửi status cho BE
    };

    const handleSubmitClick = () => {
        if (submitting) return;
        onSubmit && onSubmit({ status: "PENDING" });    // ➜ gửi status cho BE
    };

    return (
        <Affix offsetBottom={0}>
            <div className={styles.bar}>
                <div className={styles.inner} style={{ "--max-w": `${maxWidth}px` }}>
                    <Row align="middle" justify="space-between" gutter={12} wrap className={styles.layoutRow}>
                        <Col flex="1 1 auto">
                            <Button onClick={onChoosePostType} size="large" className={styles.postTypeBtn}>
                                {label} <DownOutlined />
                            </Button>
                        </Col>

                        <Col>
                            <Row gutter={8} wrap={false} className={styles.actionsRow}>
                                <Col>
                                    <Button size="large" className={styles.actionBtn} onClick={handleDraftClick} disabled={submitting}>
                                        Lưu nháp
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className={styles.actionBtn}
                                        onClick={handleSubmitClick}
                                        loading={submitting}
                                    >
                                        Đăng tin
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
