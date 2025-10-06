import { Modal, Radio, Typography } from "antd";
import styles from "./index.module.scss";

const PostTypeModal = ({ open, onCancel, onOk, value, onChange }) => {
    return (
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
                        Đăng tin thường (Miễn phí)
                        <Typography.Text type="secondary" className={styles.desc}>
                            Loại tin: Tin thường – 60 ngày (áp dụng 1 lần cho thành viên mới)
                        </Typography.Text>
                    </Radio>
                </div>

                <div className={styles.optionBox}>
                    <Radio value="BOOSTED">
                        Đăng tin trả phí
                        <Typography.Text type="secondary" className={styles.desc}>
                            Trả phí để có thêm lượt đăng tin / hiển thị nổi bật
                        </Typography.Text>
                    </Radio>
                </div>
            </Radio.Group>
        </Modal>
    );
};

export default PostTypeModal;
