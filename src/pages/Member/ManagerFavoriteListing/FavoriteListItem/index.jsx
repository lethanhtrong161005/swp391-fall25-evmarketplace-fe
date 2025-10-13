import React from "react";
import { Button, Tag, Typography } from "antd";
import { HeartFilled, EyeOutlined  } from "@ant-design/icons";
import styles from "./FavoriteListItem.module.scss";

const { Text } = Typography;

const FavoriteListItem = ({ item, onToggleFavorite, onChat }) => {
    return (
        <div className={styles.item}>
            <div className={styles.thumbWrap}>
                <img className={styles.thumb} src={item.thumbnailUrl} alt={item.title} />
                {item.mediaCount ? <div className={styles.mediaBadge}>{item.mediaCount}</div> : null}
            </div>

            <div className={styles.content}>
                <div className={styles.titleRow}>
                    <a className={styles.title} href={`/listing/${item.id}`} title={item.title}>
                        {item.title}
                    </a>
                    <div className={styles.actions}>
                        <Button
                            icon={<EyeOutlined  />}
                            onClick={onChat}
                            size="middle"
                            type="default"
                        >
                            Xem
                        </Button>
                        <Button
                            shape="circle"
                            type="text"
                            aria-label="toggle-favorite"
                            onClick={onToggleFavorite}
                            className={styles.heartBtn}
                            icon={<HeartFilled className={styles.heartIcon} />}
                        />
                    </div>
                </div>

                <div className={styles.metaRow}>
                    <Text className={styles.price}>{item.priceFormatted}</Text>
                    {item.isPriority && <Tag color="green">Tin ưu tiên</Tag>}
                </div>

                <div className={styles.subRow}>
                    <Text type="secondary">{item.sellerType}</Text>
                    <span className={styles.dot} />
                    <Text type="secondary">{item.location}</Text>
                    {item.timeAgo && (
                        <>
                            <span className={styles.dot} />
                            <Text type="secondary">{item.timeAgo}</Text>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoriteListItem;
