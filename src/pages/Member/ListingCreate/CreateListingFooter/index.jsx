import { Affix, Row, Col, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

const CreateListingFooter = ({
    currentPostType = "NORMAL",
    onChoosePostType,
    onPreview,
    onDraft,
    onSubmit,
    submitting,
    maxWidth = 1024,
}) => {
    const label =
        currentPostType === "BOOSTED" ? "Đăng tin trả phí" : "Đăng tin thường (Miễn phí)";

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
                        <Col flex="1 1 auto">
                            <Button
                                onClick={onChoosePostType}
                                size="large"
                                className={styles.postTypeBtn}
                            >
                                {label} <DownOutlined />
                            </Button>
                        </Col>

                        <Col>
                            <Row gutter={8} wrap={false} className={styles.actionsRow}>
                                <Col>
                                    <Button size="large" className={styles.actionBtn} onClick={onPreview}>
                                        Xem trước
                                    </Button>
                                </Col>
                                <Col>
                                    <Button size="large" className={styles.actionBtn} onClick={onDraft}>
                                        Lưu nháp
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className={styles.actionBtn}
                                        onClick={onSubmit}
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
