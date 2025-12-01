"use client";

import { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateCategoryFormProps {
  onSuccess?: () => void;
}

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCategory = async (values: { name: string; description?: string }) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      toast.success("Asset category created successfully!");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleCreateCategory}
      autoComplete="off"
    >
      <Form.Item
        label="Category Name"
        name="name"
        rules={[{ required: true, message: "Please enter category name" }]}
      >
        <Input placeholder="e.g., Laptops, Furniture, Vehicles" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea
          rows={3}
          placeholder="Optional description for this category"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Create Category
        </Button>
      </Form.Item>
    </Form>
  );
}

