import React from "react";
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./CTABanner.module.scss";

const { Title, Paragraph } = Typography;

export default function CTABanner() {
  const navigate = useNavigate();

  const handleStartSelling = () => {
    navigate("/consignment/new");
  };

  return (
    <section className={styles.ctaBanner}>
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
          <div className={styles.imageSection}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBicow53OdbrVQT5OyvZfo9osMHxax2PIi0s1yOg5RMJwuStZlsBDGjFjTxx3x8PpSb7i5vQ6GRCN_DLQ9CRvjf6FnETTenakrHttfenXXzPdX4YAY_6ePFhFe6Yux1ZJA1FPg6B_EQmYLPc1gGvmV89t45ovo3r56DrFz1GWfTO8bRuhI0P-Tj5vu5jC6uqKNBU_O91p6CsiU6OoZu_8dLygBUs57DVkNFf4FhOxfTHrj0q9lRBNeNLqy8k9qjyrEYV1WxYTliTPJS"
              alt="Car key"
              className={styles.keyImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
