import React from "react";
import { Modal, Form, Input, DatePicker, Upload, Button, Space, Alert, Grid } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import s from "./ContractCreateModal.module.scss";

const FMT = "YYYY-MM-DDTHH:mm:ss";

export default function ContractCreateModal({ open, onCancel, order, staffId, onSubmit }) {
    const [form] = Form.useForm();
    const disabled = !order;
    const screens = Grid.useBreakpoint(); // để set width modal theo breakpoint

    const normFile = (e) => (Array.isArray(e) ? e : e?.fileList?.slice(-1));
    const beforeUpload = () => false;
    const onOk = () => form.submit();

    return (
        <Modal
            open={open}
            title={`Tạo hợp đồng — ${order?.orderNo || ""}`}
            onCancel={onCancel}
            okText="Tạo hợp đồng"
            onOk={onOk}
            okButtonProps={{ disabled }}
            destroyOnClose
            width={screens.lg ? 860 : screens.md ? 720 : 520} // responsive width
            className={s.modalWrap} // tinh chỉnh body/padding nếu cần
        >
            <div className={s.root}>
                <Space direction="vertical" size="small" className={s.stack}>
                    <Alert
                        type="info"
                        showIcon
                        message="Yêu cầu"
                        description="Chỉ tạo hợp đồng cho đơn đã thanh toán đủ (PAID hoặc CONTRACT_SIGNED). Đính kèm file hợp đồng bản giấy (PDF/Ảnh)."
                        className={s.alert}
                    />

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            range: [dayjs(), dayjs().add(12, "month")],
                            note: "",
                            file: [],
                        }}
                        onFinish={(vals) => {
                            const [from, to] = vals.range || [];
                            const fileObj = vals.file?.[0]?.originFileObj;
                            onSubmit?.({
                                file: fileObj,
                                note: vals.note?.trim() || undefined,
                                effectiveFrom: from?.format(FMT),
                                effectiveTo: to?.format(FMT),
                            });
                        }}
                        className={s.form}
                    >
                        <div className={s.formGrid}>
                            {/* Cột trái */}
                            <div className={s.card}>
                                <Form.Item
                                    label="Hiệu lực"
                                    name="range"
                                    rules={[
                                        { required: true, message: "Chọn khoảng thời gian hiệu lực" },
                                        () => ({
                                            validator(_, v) {
                                                if (!v || v.length !== 2) return Promise.reject("Chọn đủ từ ngày & đến ngày");
                                                const [f, t] = v;
                                                if (!f || !t) return Promise.reject("Chọn đủ từ ngày & đến ngày");
                                                if (t.isBefore(f)) return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <DatePicker.RangePicker
                                        className={s.fullWidth}
                                        showTime
                                        format="DD/MM/YYYY HH:mm"
                                    />
                                </Form.Item>

                                <Form.Item label="Ghi chú" name="note">
                                    <Input.TextArea rows={4} placeholder="Ghi chú nội bộ (tuỳ chọn)" />
                                </Form.Item>
                            </div>

                            {/* Cột phải */}
                            <div className={s.card}>
                                <Form.Item
                                    label="File hợp đồng (PDF/Ảnh)"
                                    name="file"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: "Vui lòng đính kèm file hợp đồng" }]}
                                >
                                    <Upload.Dragger
                                        accept=".pdf,image/*"
                                        maxCount={1}
                                        multiple={false}
                                        beforeUpload={beforeUpload}
                                        className={s.dragger}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Kéo thả hoặc bấm để chọn file</p>
                                        <p className="ant-upload-hint">Hỗ trợ PDF, JPG, PNG. Tối đa 10MB.</p>
                                    </Upload.Dragger>
                                </Form.Item>

                                <div className={s.tips}>
                                    <div>• Tên file nên gồm: <b>orderNo</b> + <b>ngày</b> (VD: <i>ORDER-20251026_2025-10-26.pdf</i>)</div>
                                    <div>• Nếu có nhiều trang ảnh, nên hợp nhất thành 1 PDF trước khi tải lên.</div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Space>
            </div>
        </Modal>
    );
}
