"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  category?: string;
  department?: string;
  date_purchased?: string;
  cost?: number;
  status?: string;
  description?: string;
  created_at?: string;
}

export function MyAssetsList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/assets");
      const data = await response.json();

      if (response.ok) {
        setAssets(data.assets || []);
      } else {
        const errorMsg = data.error || "Failed to fetch assets";
        if (errorMsg.includes("table") && errorMsg.includes("not found")) {
          toast.error(
            "Database tables not set up. Please run the SQL schema in Supabase.",
            { duration: 5000 }
          );
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      toast.error("An error occurred while fetching assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [refreshTrigger]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "default";
      case "maintenance":
        return "orange";
      case "retired":
        return "red";
      default:
        return "blue";
    }
  };

  const columns: ColumnsType<Asset> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Date Purchased",
      dataIndex: "date_purchased",
      key: "date_purchased",
      render: (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => {
        if (cost === null || cost === undefined) return "-";
        return `$${parseFloat(cost.toString()).toFixed(2)}`;
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || "active"}</Tag>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button icon={<ReloadOutlined />} onClick={fetchAssets} loading={loading}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={assets}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

