import { Modal, Typography, List } from "antd";
import {getFeeListing} from "@services/listing.service.js";
import { useState, useEffect } from "react";

const FeeModal = ({ open, onCancel }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchFeeData();
        }
    }, [open]);

    const fetchFeeData = async () => {
        try {
            setLoading(true);
            const res = await getFeeListing();

            if (res?.success && res?.data) {
                const { activeDayBoosted, fee, activeDayNormal } = res.data;

                const mappedData = [
                    {
                        title: "Tin thường",
                        price: `Miễn phí / ${activeDayNormal.cfgValue} ngày `,
                        duration: `${activeDayNormal.cfgValue} ngày`,
                    },
                    {
                        title: "Tin trả phí",
                        price: `${fee.cfgValue} VNĐ / ${activeDayBoosted.cfgValue} ngày`,
                        duration: `${activeDayBoosted.cfgValue} ngày`,
                    },
                ];

                setData(mappedData);
            }
        } catch (err) {
            console.error("Error loading fee data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Bảng giá đăng tin"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Typography.Paragraph>
                Chọn gói đăng tin phù hợp để tăng khả năng hiển thị và tiếp cận khách hàng.
            </Typography.Paragraph>

            <List
                bordered
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text strong>{item.title}</Typography.Text>
                        <span>{item.price}</span>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default FeeModal;
