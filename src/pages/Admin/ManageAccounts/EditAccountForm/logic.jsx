import { useState, useEffect } from "react";
import { Form, message } from "antd";

export function useEditAccountForm({ account, onFinish }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Set form values when account changes
  useEffect(() => {
    if (account) {
      form.setFieldsValue({
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
        role: account.role,
        status: account.status,
      });
    }
  }, [account, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      await onFinish({ ...values, id: account?.id });
      message.success("Cập nhật tài khoản thành công");
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật tài khoản");
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
