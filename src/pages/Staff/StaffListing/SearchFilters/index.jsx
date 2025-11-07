import React from "react";
import { Button, Col, Input, Row, Space } from "antd";
import s from "./styles.module.scss";

export default function SearchFilters({ value = {}, onChange, onSubmit }) {
    const v = value || {};
    const set = (patch) => onChange && onChange(patch);

    return (
        <div className={s.root}>
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} md={12}>
                        <Input
                            allowClear
                            placeholder="Tìm kiếm tiêu đề, mô tả, địa chỉ..."
                            value={v.q}
                            onChange={(e) => set({ q: e.target.value })}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Space>
                            <Button type="primary" onClick={onSubmit}>
                                Tìm kiếm
                            </Button>
                            <Button
                                onClick={() =>
                                    onChange && onChange({ q: "" })
                                }
                            >
                                Làm mới
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Space>
        </div>
    );
}
