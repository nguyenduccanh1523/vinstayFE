// src/pages/owner/hotels/HotelFormModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, Space, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { hotelApi } from "../../../apis/hotelApi";

const { TextArea } = Input;

export default function HotelFormModal({ open, onClose, data, onSuccess }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        check_in_time: data.check_in_time,
        check_out_time: data.check_out_time,
        status: data.status,
      });
      const existing =
        data.images?.map((url, i) => ({
          uid: `h-${i}`,
          name: `image-${i}`,
          status: "done",
          url,
          response: { url },
        })) || [];
      setFileList(existing);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [open, data]);

  const customUpload = ({ file, onSuccess }) =>
    setTimeout(() => onSuccess({ url: URL.createObjectURL(file) }), 100);

  const submit = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v != null && fd.append(k, v));

      fileList.forEach((f, idx) => {
        if (f.originFileObj) fd.append("images", f.originFileObj, f.name || `image-${idx}.png`);
        else if (f.url && data) fd.append("existingImages", f.url);
      });

      if (data?._id) await hotelApi.updateHotel(data._id, fd);
      else await hotelApi.createHotel(fd);

      onSuccess?.();
    } catch (e) {
      message.error("Save hotel failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={data ? "Edit Hotel" : "Create Hotel"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Hotel Name" rules={[{ required: true }]}>
              <Input placeholder="VinnStay Riverside" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="images" label="Hotel Images">
          <Upload
            customRequest={customUpload}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            onRemove={(file) => setFileList((p) => p.filter((i) => i.uid !== file.uid))}
            multiple
            accept="image/*"
            beforeUpload={(file) => {
              const ok = file.type.startsWith("image/") && file.size / 1024 / 1024 < 5;
              if (!ok) message.error("Only images and <5MB");
              return ok;
            }}
          >
            {fileList.length >= 8 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={12}>
            <Form.Item name="check_in_time" label="Check-in Time" rules={[{ required: true }]}>
              <Input placeholder="14:00" />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name="check_out_time" label="Check-out Time" rules={[{ required: true }]}>
              <Input placeholder="12:00" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={12}>
            <Form.Item name="latitude" label="Latitude" rules={[{ required: true }]}>
              <Input type="number" step="any" />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name="longitude" label="Longitude" rules={[{ required: true }]}>
              <Input type="number" step="any" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {data ? "Update" : "Create"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
