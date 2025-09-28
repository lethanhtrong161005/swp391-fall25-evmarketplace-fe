import React, { useEffect, useState } from "react";
import { Card, Descriptions, Avatar, Button, Spin, Alert, Row, Col } from "antd";
import { EditOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import UpdateProfileModal from "@components/Modal/UpdateProfileModal";
// import { getUserProfile } from "../../../services/accountService";
import { getAxiosErrorMessage, getErrorMessage, isValidErrorCode } from "../../../config/errorMessage";

// import { calc } from "antd/es/theme/internal";
export default function InfoUser() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fakeUserData = {
        fullName: "Nguyễn Văn An",
        email: "nguyenvan.an@example.com",
        phoneNumber: "0987654321",
        province: "TP. Hồ Chí Minh",
        addressLine: "123 Đường ABC, Phường 1, Quận 1",
        dateOfBirth: "1995-08-15",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces",
        role: "Member"
    };


    useEffect(() => {
        let cancelled = false

        async function loadProfile() {
            try {
                setLoading(true)
                setApiError("")

                // FAKE DATA
                await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network delay
                if (!cancelled) setProfile(fakeUserData);
                // END FAKE DATA

                // const res = await getUserProfile();

                // const data = res && res.data !== undefined ? res.data : res

                // if (data?.message) {
                //     const msg = isValidErrorCode(data.message)
                //         ? getErrorMessage(data.message)
                //         : String(data.message);
                //     if (!cancelled)
                //         setApiError(msg)
                //     return
                // }
                // if (!cancelled) setProfile(data)
            } catch (error) {
                if (!cancelled) {
                    const msg = getAxiosErrorMessage(error)
                    setApiError(msg)
                }
            } finally {
                if (!cancelled)
                    setLoading(false)
            }
        }

        loadProfile()
        return () => { cancelled = true }
    }, [])

    const handleRetry = () => {
        setApiError("");
        setLoading(true);

        setTimeout(() => {
            setProfile(fakeUserData); // replace with real fetch call
            setLoading(false);
        }, 400)
    }

    if (loading) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: 12, color: "#666" }}>Đang tải...</div>
            </div>
        )
    }
    if (apiError) {
        return (
            <div style={{ padding: 24, maxWidth: 640, margin: "24px auto" }}>
                <Alert
                    type="error"
                    showIcon
                    message="Lỗi"
                    description={apiError}
                    action={<Button icon={<ReloadOutlined />} onClick={handleRetry}>Thử lại</Button>}
                />
            </div>
        );
    }
    if (!profile) {
        return (
            <div style={{ padding: 24, textAlign: "center" }}>
                <Alert type="info" showIcon message="Không có dữ liệu hồ sơ" />
                <div style={{ marginTop: 12 }}>
                    <Button onClick={handleRetry}>Tải lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
            <Card
                title="Thông tin cá nhân"
                extra={
                    <Button type="primary" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)}>
                        Chỉnh sửa
                    </Button>
                }
            >
                <Row gutter={24}>
                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                        <Avatar size={130} src={profile.avatarUrl} icon={<UserOutlined />} style={{ marginBottom: 12 }} />
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{profile.fullName}</div>
                        <div style={{ color: "#888" }}>{profile.role}</div>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Descriptions column={1} bordered size="middle">
                            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{profile.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Tỉnh/Thành phố">{profile.province}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{profile.addressLine}</Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN") : "-"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            <UpdateProfileModal
                isOpen={isModalOpen}
                initialData={profile}
                onClose={() => setIsModalOpen(false)}
                onUpdated={(updated) => {
                    setProfile((p) => ({ ...p, ...updated }));
                    setIsModalOpen(false);
                }}
            />
        </div>
    )


}


