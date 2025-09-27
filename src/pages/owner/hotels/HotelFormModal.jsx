// src/pages/owner/hotels/HotelFormModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Space,
  message,
  Row,
  Col,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { hotelApi } from "../../../apis/hotelApi";

const { TextArea } = Input;

// Predefined amenities list
const AMENITIES_LIST = [
  "Wifi",
  "Kitchen",
  "Jacuzzi",
  "Balcony",
  "TV",
  "AC",
  "Safe",
  "Spa",
  "Pool",
  "Parking",
  "Restaurant",
  "Gym",
  "Beach",
  "Bar",
  "Bida",
];

// Predefined cities list
const CITIES_LIST = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Sapa",
  "Hội An",
  "Nha Trang",
];

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
        country: data.country || "VietNam",
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.status,
        amenities: data.amenities || [],
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
      // Set default country when creating
      form.setFieldsValue({ country: "VietNam" });
      setFileList([]);
    }
  }, [open, data]);

  const customUpload = ({ file, onSuccess }) =>
    setTimeout(() => onSuccess({ url: URL.createObjectURL(file) }), 100);

  const submit = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();

      // Add text fields to FormData
      fd.append("name", values.name);
      fd.append("description", values.description);
      fd.append("address", values.address);
      fd.append("city", values.city);
      fd.append("country", values.country);
      fd.append("latitude", values.latitude);
      fd.append("longitude", values.longitude);
      fd.append("status", values.status);

      // Add amenities to FormData
      if (values.amenities && values.amenities.length > 0) {
        fd.append("amenities", JSON.stringify(values.amenities));
      }

      fileList.forEach((f, idx) => {
        if (f.originFileObj)
          fd.append("images", f.originFileObj, f.name || `image-${idx}.png`);
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
            <Form.Item
              name="name"
              label="Hotel Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="VinnStay Riverside" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="images" label="Hotel Images">
          <Upload
            customRequest={customUpload}
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            onRemove={(file) =>
              setFileList((p) => p.filter((i) => i.uid !== file.uid))
            }
            multiple
            accept="image/*"
            beforeUpload={(file) => {
              const ok =
                file.type.startsWith("image/") && file.size / 1024 / 1024 < 5;
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
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Select placeholder="Select a city">
                {CITIES_LIST.map((city) => (
                  <Select.Option key={city} value={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true }]}
            >
              <Input defaultValue="VietNam" readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="amenities" label="Amenities">
          <Checkbox.Group>
            <div className="grid grid-cols-3 gap-2">
              {AMENITIES_LIST.map((amenity) => (
                <Checkbox key={amenity} value={amenity}>
                  {amenity}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={12}>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true }]}
            >
              <Input type="number" step="any" />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ required: true }]}
            >
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
