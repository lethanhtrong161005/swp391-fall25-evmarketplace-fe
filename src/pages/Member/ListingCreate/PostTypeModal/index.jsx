import { Modal, Radio, Typography } from "antd";
import styles from "./index.module.scss";
import FeeModal from "./FeeModal";
import { useState } from "react";


const PostTypeModal = ({ open, onCancel, onOk, value, onChange }) => {
    const [feeModalOpen, setFeeModalOpen] = useState(false);

    return (
        <>
            <Modal
                open={open}
                onCancel={onCancel}
                onOk={onOk}
                okText="Áp dụng"
                title="Chọn loại hiển thị tin"
                className={styles.modal}
                destroyOnClose
            >
                <Radio.Group className={styles.group} value={value} onChange={(e) => onChange?.(e.target.value)}>
                    <div className={styles.optionBox}>
                        <Radio value="NORMAL">
                            Đăng tin thường ( Miễn phí )
                            <Typography.Text type="secondary" className={styles.desc}>
                                Loại tin: Tin thường (áp dụng 1 lần cho thành viên mới)
                            </Typography.Text>
                        </Radio>
                    </div>

                    <div className={styles.optionBox}>
                        <Radio value="BOOSTED">
                            Đăng tin trả phí
                            <Typography.Text type="secondary" className={styles.desc}>
                                Trả phí để có thêm lượt đăng tin / hiển thị nổi bật {""}
                            </Typography.Text>
                        </Radio>
                    </div>

                    <div>
                        <Typography.Link
                            onClick={() => setFeeModalOpen(true)}
                            style={{ marginLeft: 4 }}
                        >
                            Xem chi tiết
                        </Typography.Link>
                    </div>
                </Radio.Group>
            </Modal>

            <FeeModal
                open={feeModalOpen}
                onCancel={() => setFeeModalOpen(false)}
                zIndex={2000}
            />
        </>
    );
};

export default PostTypeModal;
