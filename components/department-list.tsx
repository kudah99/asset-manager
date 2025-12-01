"use client";

import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface DepartmentListProps {
  refreshTrigger?: number;
}

export function DepartmentList({ refreshTrigger }: DepartmentListProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/departments");
      const data = await response.json();
      
      if (response.ok) {
        setDepartments(data.departments || []);
      } else {
        toast.error(data.error || "Failed to fetch departments");
      }
    } catch (error) {
      toast.error("An error occurred while fetching departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [refreshTrigger]);

  const columns: ColumnsType<Department> = [
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
        <h3 style={{ margin: 0 }}>All Departments ({departments.length})</h3>
        <Button onClick={fetchDepartments} loading={loading} icon={<ReloadOutlined />}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={departments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} departments` }}
      />
    </div>
  );
}

