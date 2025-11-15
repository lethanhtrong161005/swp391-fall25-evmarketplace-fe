import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Spin, Alert, Row, Col } from "antd";
import {
  EditOutlined,
  ReloadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import UpdateProfileModal from "@components/Modal/UpdateProfileModal";
import { getUserProfile } from "@services/accountService";
import {
  getAxiosErrorMessage,
  getErrorMessage,
  isValidErrorCode,
} from "@config/errorMessage";
import s from "./InfoUser.module.scss";

export default function InfoUser() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProfile = async (cancelRef) => {
    try {
      setLoading(true);
      setApiError("");
      const res = await getUserProfile();

      if (res?.success && res?.data) {
        if (!cancelRef.current) setProfile(res.data);
      } else {
        const msg = isValidErrorCode(res?.message)
          ? getErrorMessage(res.message)
          : res?.message || "Lỗi không xác định";
        if (!cancelRef.current) setApiError(msg);
      }
    } catch (error) {
      if (!cancelRef.current) setApiError(getAxiosErrorMessage(error));
    } finally {
      if (!cancelRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const cancelRef = { current: false };
    loadProfile(cancelRef);
    return () => {
      cancelRef.current = true;
    };
  }, []);

  if (loading) {
    return (
      <div className={s.centeredLoading}>
        <Spin size="large" />
        <div>Đang tải thông tin...</div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className={s.errorContainer}>
        <Alert
          type="error"
          showIcon
          message="Không thể tải thông tin"
          description={apiError}
          action={
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadProfile({ current: false })}
            >
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={s.centeredLoading}>
        <Alert type="info" showIcon message="Không có dữ liệu hồ sơ" />
      </div>
    );
  }

  return (
    <div className={s.container}>
      <Card className={s.profileCard}>
        {/* Avatar ở giữa */}
        <div className={s.avatarWrapper}>
          <div className={s.avatarCircle}>
            <Avatar
              size={140}
              src={profile?.profile?.avatarUrl}
              icon={<UserOutlined />}
              onError={() => false}
              className={s.avatar}
            />
          </div>
          <h2 className={s.name}>{profile?.profile?.fullName || "—"}</h2>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsModalOpen(true)}
            className={s.editBtn}
          >
            Chỉnh sửa hồ sơ
          </Button>
        </div>

        {/* Thông tin chi tiết */}
        <Row justify="center">
          <Col xs={24} sm={24} md={24} lg={24} xl={22} xxl={20} className={s.infoCol}>
            <div className={s.infoBox}>
              <div className={s.infoItem}>
                <MailOutlined className={s.icon} />
                <div>
                  <div className={s.label}>Email</div>
                  <div className={s.value}>{profile?.email || "—"}</div>
                </div>
              </div>

              <div className={s.infoItem}>
                <PhoneOutlined className={s.icon} />
                <div>
                  <div className={s.label}>Số điện thoại</div>
                  <div className={s.value}>{profile?.phoneNumber || "—"}</div>
                </div>
              </div>

              <div className={s.infoItem}>
                <EnvironmentOutlined className={s.icon} />
                <div>
                  <div className={s.label}>Tỉnh/Thành phố</div>
                  <div className={s.value}>
                    {profile?.profile?.province || "—"}
                  </div>
                </div>
              </div>
              <div className={s.infoItem}>
                <EnvironmentOutlined className={s.icon} />
                <div>
                  <div className={s.label}>Địa chỉ</div>
                  <div className={s.value}>
                    {profile?.profile?.addressLine || "—"}
                  </div>
                </div>
              </div>

              {profile?.branch && (
                <div className={s.infoItem}>
                  <ShopOutlined className={s.icon} />
                  <div>
                    <div className={s.label}>Chi nhánh</div>
                    <div className={s.value}>
                      {`${profile.branch.name} (${profile.branch.province})`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      <UpdateProfileModal
        isOpen={isModalOpen}
        initialData={profile}
        onClose={() => setIsModalOpen(false)}
        onUpdated={(updated) => {
          setProfile((p) => ({
            ...p,
            ...updated,
            profile: { ...p?.profile, ...updated?.profile },
          }));
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
