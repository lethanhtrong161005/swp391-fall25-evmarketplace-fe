import React, { useState } from "react";
import { Typography, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import LoginModal from "@components/Modal/LoginModal";
import styles from "./CTABanner.module.scss";
import ctaBannerImage from "@assets/images/Banner/CTABanner.jpg";

const { Title, Paragraph } = Typography;

export default function CTABanner() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleStartSelling = () => {
    if (isLoggedIn) {
      navigate("/consignment/new");
    } else {
      setRedirectAfterLogin("/consignment/new");
      messageApi.info("Vui lòng đăng nhập để ký gửi");
      setOpenLogin(true);
    }
  };

  const handleLoginSubmit = async (dto) => {
    const result = await login(dto);
    if (result) {
      setOpenLogin(false);
      setTimeout(() => {
        if (redirectAfterLogin) {
          navigate(redirectAfterLogin, { replace: true });
          setRedirectAfterLogin(null);
        }
      }, 100);
    }
    return result;
  };

  return (
    <>
      {contextHolder}
      <section 
        className={styles.ctaBanner}
        style={{ backgroundImage: `url(${ctaBannerImage})` }}
      >
        <div className={styles.overlay} />
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.textSection}>
              <Title level={2} className={styles.title}>
                Sẵn sàng bán xe điện của bạn?
              </Title>
              <Paragraph className={styles.description}>
                Ký gửi với chúng tôi để tiếp cận hàng ngàn người mua tiềm năng một
                cách dễ dàng và nhanh chóng.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                className={styles.ctaButton}
                onClick={handleStartSelling}
              >
                Bắt đầu ký gửi
              </Button>
            </div>
          </div>
        </div>
      </section>
      <LoginModal
        open={openLogin}
        onClose={() => {
          setOpenLogin(false);
          setRedirectAfterLogin(null);
        }}
        onSubmit={handleLoginSubmit}
      />
    </>
  );
}
