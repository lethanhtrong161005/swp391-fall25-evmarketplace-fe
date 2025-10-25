// src/pages/Member/ProductDetail/components/ProductMedia/components/NavigationButtons.jsx
import React, { memo, useCallback } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./NavigationButtons.scss";

const NavigationButtons = memo(
  ({
    onPrevious,
    onNext,
    disabled = false,
    showLeft = true,
    showRight = true,
  }) => {
    const handlePrevious = useCallback(() => {
      if (!disabled) {
        onPrevious?.();
      }
    }, [onPrevious, disabled]);

    const handleNext = useCallback(() => {
      if (!disabled) {
        onNext?.();
      }
    }, [onNext, disabled]);

    const handleKeyDown = useCallback((e, action) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        action();
      }
    }, []);

    return (
      <>
        {showLeft && (
          <Button
            size="large"
            shape="circle"
            icon={<LeftOutlined />}
            className="nav-buttons__button nav-buttons__button--left"
            onClick={handlePrevious}
            onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
            disabled={disabled}
            aria-label="Previous media"
            tabIndex={0}
          />
        )}
        {showRight && (
          <Button
            size="large"
            shape="circle"
            icon={<RightOutlined />}
            className="nav-buttons__button nav-buttons__button--right"
            onClick={handleNext}
            onKeyDown={(e) => handleKeyDown(e, handleNext)}
            disabled={disabled}
            aria-label="Next media"
            tabIndex={0}
          />
        )}
      </>
    );
  }
);

NavigationButtons.displayName = "NavigationButtons";

export default NavigationButtons;
