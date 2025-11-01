import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, Spin } from "antd";
import { verifyVnpReturn } from "@services/payment.service";

const VnpReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(location.search).entries()
    );
    console.log("VNPay return params:", params);

    verifyVnpReturn(params)
      .then(({ ok, payload }) => {
        if (ok) {
          setStatus("success");
          setMessage(
            payload?.message || "Thanh toán thành công! Tin đã được cập nhật."
          );
        } else {
          setStatus("error");
          setMessage(payload?.message || "Thanh toán thất bại!");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setMessage("Không thể xác thực giao dịch.");
      });
  }, [location.search]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin tip="Đang xác thực thanh toán..." />
      </div>
    );
  }

  return (
    <Result
      status={status}
      title={
        status === "success" ? "Thanh toán thành công!" : "Thanh toán thất bại!"
      }
      subTitle={message}
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      }
    />
  );
};

export default VnpReturnPage;
