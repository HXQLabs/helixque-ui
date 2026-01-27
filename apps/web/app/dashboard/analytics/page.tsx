"use client";

import * as React from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

// Mock Data
const STATS = [
  {
    title: "Total Profile Views",
    value: "2,450",
    change: "+12%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Mentorship Hours",
    value: "48h",
    change: "+5%",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Network Growth",
    value: "156",
    change: "-2%",
    trend: "down",
    icon: Users,
  },
];

// CSS-based Bar Chart Mock
const ACTIVITY_DATA = [40, 65, 35, 80, 50, 90, 45, 70, 55, 60, 85, 95];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground">
          Track your performance and community engagement.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs flex items-center mt-1 ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart (Mock) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Profile Activity</CardTitle>
            <CardDescription>
              Views and interactions over the last 12 weeks.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full flex items-end justify-between gap-2 px-4">
              {ACTIVITY_DATA.map((value, i) => (
                <div
                  key={i}
                  className="group relative w-full flex flex-col justify-end items-center gap-2"
                >
                  <div
                    className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/80 transition-all duration-500"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    W{i + 1}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    {value} views
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Visitors */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Viewers</CardTitle>
            <CardDescription>
              People from these companies viewed you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Mock Company List */}
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xs font-bold text-blue-600">G</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Google</p>
                  <p className="text-sm text-muted-foreground">
                    3 recruiters viewed your profile
                  </p>
                </div>
                <div className="ml-auto font-medium">+12%</div>
              </div>
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-xs font-bold text-orange-600">A</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Amazon</p>
                  <p className="text-sm text-muted-foreground">
                    1 senior engineer viewed you
                  </p>
                </div>
                <div className="ml-auto font-medium">+5%</div>
              </div>
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
                  <span className="text-xs font-bold text-black">N</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Netflix</p>
                  <p className="text-sm text-muted-foreground">
                    2 designers viewed you
                  </p>
                </div>
                <div className="ml-auto font-medium">+8%</div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">
              View All Visitors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
