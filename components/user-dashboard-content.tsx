"use client";

import { UserDashboardLayout } from "@/components/user-dashboard-layout";
import { Card, Statistic, Row, Col, Button } from "antd";
import { PlusOutlined, FileOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function UserDashboardContent({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  return (
    <UserDashboardLayout userEmail={userEmail} activeKey="1">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          User Dashboard
        </h1>
        <p style={{ color: "rgba(0, 0, 0, 0.45)" }}>
          Welcome back, {userEmail}
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="My Assets"
              value={0}
              valueStyle={{ color: "#20b2aa" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Pending Requests"
              value={0}
              valueStyle={{ color: "#20b2aa" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Recent Activity"
              value={0}
              suffix="last 24h"
              valueStyle={{ color: "#20b2aa" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card
            title="Quick Actions"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push("/assets/user/add")}
              >
                Add Asset
              </Button>
            }
          >
            <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: 16 }}>
              Create a new asset or view your existing assets.
            </p>
            <Button
              icon={<FileOutlined />}
              onClick={() => router.push("/assets/user")}
              block
              style={{ marginTop: 8 }}
            >
              View My Assets
            </Button>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <p style={{ color: "rgba(0, 0, 0, 0.45)" }}>
              No recent activity to display.
            </p>
          </Card>
        </Col>
      </Row>
    </UserDashboardLayout>
  );
}

