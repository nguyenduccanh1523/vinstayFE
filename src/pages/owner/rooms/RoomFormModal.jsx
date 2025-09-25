// src/pages/owner/rooms/RoomFormModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch, Upload, Button, Space, message, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { roomApi } from "../../../apis/roomApi";

const { TextArea } = Input;

export default function RoomFormModal({ open, onClose, hotels, defaultHotelId, data, onSuccess }) {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (data) {
      form.setFieldsValue({
        hotel_id: typeof data.hotel_id === "object" ? data.hotel_id?._id : data.hotel_id,
        room_number: data.room_number,
        room_type: data.room_type,
        price: data.price,
        capacity: data.capacity,
        is_available: data.is_available,
        amenities: data.amenities || [],
        description: data.description || "",
      });
      setFiles(
        (data.images || []).map((url, i) => ({
          uid: `r-${i}`,
          name: `image-${i}`,
          status: "done",
          url,
          response: { url },
        }))
      );
    } else {
      form.resetFields();
      form.setFieldValue("hotel_id", defaultHotelId);
      setFiles([]);
    }
  }, [open, data, defaultHotelId]);

  const customUpload = ({ file, onSuccess }) =>
    setTimeout(() => onSuccess({ url: URL.createObjectURL(file) }), 100);

  const submit = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("hotel_id", values.hotel_id);
      fd.append("room_number", values.room_number);
      fd.append("room_type", values.room_type);
      fd.append("price", values.price);
      fd.append("capacity", values.capacity);
      fd.append("is_available", values.is_available);

      if (values.description) fd.append("description", values.description);
      (values.amenities || []).forEach((a) => fd.append("amenities", a));

      files.forEach((f, i) => {
        if (f.originFileObj) fd.append("images", f.originFileObj, f.name || `image-${i}.png`);
        else if (f.url && data) fd.append("existingImages", f.url);
      });

      if (data?._id) await roomApi.updateRoom(data._id, fd);
      else await roomApi.createRoom(fd);

      onSuccess?.();
    } catch {
      message.error("Save room failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={data ? "Edit Room" : "Create Room"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={820}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item name="hotel_id" label="Hotel" rules={[{ required: true }]}>
              <Select
                options={hotels.map((h) => ({ value: h._id, label: `${h.name} (${h.city})` }))}
                showSearch
                optionFilterProp="label"
                placeholder="Select hotel"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="room_number" label="Room Number" rules={[{ required: true }]}>
              <Input placeholder="101" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="room_type" label="Room Type" rules={[{ required: true }]}>
              <Input placeholder="Deluxe / Suite / ..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="price" label="Price (USD)" rules={[{ required: true }]}>
              <Input type="number" step="any" min={0} placeholder="120" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
              <Input type="number" min={1} placeholder="2" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="is_available" label="Availability" valuePropName="checked" initialValue>
          <Switch checkedChildren="Available" unCheckedChildren="Unavailable" />
        </Form.Item>

        <Form.Item name="amenities" label="Amenities">
          <Select mode="tags" placeholder="WiFi, TV, Mini-bar..." />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Room description..." />
        </Form.Item>

        <Form.Item name="images" label="Room Images">
          <Upload
            customRequest={customUpload}
            listType="picture-card"
            fileList={files}
            onChange={({ fileList }) => setFiles(fileList)}
            onRemove={(file) => setFiles((p) => p.filter((i) => i.uid !== file.uid))}
            multiple
            accept="image/*"
            beforeUpload={(file) => {
              const ok = file.type.startsWith("image/") && file.size / 1024 / 1024 < 5;
              if (!ok) message.error("Only images and <5MB");
              return ok;
            }}
          >
            {files.length >= 8 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

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
