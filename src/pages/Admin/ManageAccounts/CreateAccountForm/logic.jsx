import { useState } from "react";
import { Form, message } from "antd";

export function useCreateAccountForm({ onFinish }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      await onFinish(values);
      form.resetFields();
      message.success("Tạo tài khoản thành công");
    } catch {
      message.error("Có lỗi xảy ra khi tạo tài khoản");
    } finally {
      setLoading(false);
    }
  };

  // Override form's onFinish to use our handler
  const formProps = {
    ...form,
    submit: () => form.validateFields().then(handleFinish),
  };

  return {
    form: formProps,
    loading,
  };
}