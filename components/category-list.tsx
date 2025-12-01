"use client";

import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface CategoryListProps {
  refreshTrigger?: number;
}

export function CategoryList({ refreshTrigger }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        toast.error(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => description || <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>-</span>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>All Categories ({categories.length})</h3>
        <Button onClick={fetchCategories} loading={loading} icon={<ReloadOutlined />}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} categories` }}
      />
    </div>
  );
}

