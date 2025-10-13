import React, { useEffect, useState } from "react";
import { Card, Descriptions, Avatar, Button, Spin, Alert, Row, Col } from "antd";
import { EditOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import UpdateProfileModal from "@components/Modal/UpdateProfileModal";
import { getUserProfile } from "@services/accountService";
import { getAxiosErrorMessage, getErrorMessage, isValidErrorCode } from "@config/errorMessage";

const getAvatarUrl = (filename) => {
        if (!filename) return null;
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089';
        return `${API_BASE}/api/accounts/image/${filename}/avatar`;
    }
    
export default function InfoUser() {
    const [profile, setProfile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            try {
                setLoading(true);
                setApiError("");

                const res = await getUserProfile();
                // apiCaller returns res.data directly. Expect envelope: { status, success, data, message }
                if (res?.success && res?.data) {
                    if (!cancelled) setProfile(res.data);
                } else {
                    const errorMsg = res?.message || "Lỗi không xác định";
                    const msg = isValidErrorCode(errorMsg) ? getErrorMessage(errorMsg) : errorMsg;
                    if (!cancelled) setApiError(msg);
                }
            } catch (error) {
                if (!cancelled) {
                    const msg = getAxiosErrorMessage(error);
                    setApiError(msg);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadProfile();
        return () => { cancelled = true; };
    }, [])



    const handleRetry = () => {
        // Re-run the effect logic by simply resetting state and calling API again
        setApiError("");
        setLoading(true);
        (async () => {
            try {
                const res = await getUserProfile();
                if (res?.success && res?.data) {
                    setProfile(res.data);
                } else {
                    const errorMsg = res?.message || "Lỗi không xác định";
                    const msg = isValidErrorCode(errorMsg) ? getErrorMessage(errorMsg) : errorMsg;
                    setApiError(msg);
                }
            } catch (e) {
                setApiError(getAxiosErrorMessage(e));
            } finally {
                setLoading(false);
            }
        })();
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

// console.log('User Profile:', profile);
// console.log('Avatar URL:', getAvatarUrl(profile?.profile?.avatarUrl));

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
                        <Avatar size={130} src={getAvatarUrl(profile?.profile?.avatarUrl)} icon={<UserOutlined />} style={{ marginBottom: 12 }} />
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{profile?.profile?.fullName}</div>
                        <div style={{ color: "#888" }}>{profile?.role}</div>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Descriptions column={1} bordered size="middle">
                            <Descriptions.Item label="Họ và tên">{profile?.profile?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{profile?.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Tỉnh/Thành phố">{profile?.profile?.province}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{profile?.profile?.addressLine}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            <UpdateProfileModal
                isOpen={isModalOpen}
                initialData={profile}
                onClose={() => setIsModalOpen(false)}
                onUpdated={(updated) => {
                    // Merge updated fields safely into current profile state
                    setProfile((p) => ({
                        ...p,
                        ...updated,
                        profile: {
                            ...p?.profile,
                            ...updated?.profile,
                        }
                    }));
                    setIsModalOpen(false);
                }}
            />
        </div>
    )


}


