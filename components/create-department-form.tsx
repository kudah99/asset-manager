"use client";

import { useState } from "react";
import { Button, Input, Form } from "antd";
import { toast } from "sonner";

export function CreateDepartmentForm() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDepartment = async (values: { name: string; description?: string }) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/create-department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create department");
      }

      toast.success("Department created successfully!");
      form.resetFields();
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
      onFinish={handleCreateDepartment}
      autoComplete="off"
    >
      <Form.Item
        label="Department Name"
        name="name"
        rules={[{ required: true, message: "Please enter department name" }]}
      >
        <Input placeholder="e.g., IT, HR, Finance, Operations" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea
          rows={3}
          placeholder="Optional description for this department"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Create Department
        </Button>
      </Form.Item>
    </Form>
  );
}

