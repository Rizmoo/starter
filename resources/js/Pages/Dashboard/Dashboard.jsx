import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { StatCard } from '@/Components/ui/stat-card';
import OverviewChart from '@/Components/dashboard/overview-chart';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard overview.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            icon={DollarSign}
            subtitle="This month"
            change="+20.1% from last month"
            changeType="increase"
            colorScheme="green"
          />
          <StatCard
            title="Active Users"
            value="2,350"
            icon={Users}
            subtitle="Currently active"
            change="+180 new this week"
            changeType="increase"
            colorScheme="blue"
          />
          <StatCard
            title="Total Orders"
            value="12,234"
            icon={ShoppingCart}
            subtitle="All time"
            change="+19% from last month"
            changeType="increase"
            colorScheme="purple"
          />
          <StatCard
            title="Growth Rate"
            value="+12.5%"
            icon={TrendingUp}
            subtitle="Quarter over quarter"
            change="-2.1% from last quarter"
            changeType="decrease"
            colorScheme="amber"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Alice Johnson', action: 'created a new order', time: '2 minutes ago' },
                  { name: 'Bob Smith', action: 'updated product pricing', time: '15 minutes ago' },
                  { name: 'Carol White', action: 'exported the sales report', time: '1 hour ago' },
                  { name: 'David Brown', action: 'added a new customer', time: '3 hours ago' },
                  { name: 'Eve Davis', action: 'completed inventory check', time: '5 hours ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {activity.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.name}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Conversion Rate', value: '3.2%', bar: 32 },
                  { label: 'Avg. Order Value', value: '$142.50', bar: 57 },
                  { label: 'Customer Satisfaction', value: '94%', bar: 94 },
                  { label: 'Inventory Turnover', value: '8.5x', bar: 85 },
                  { label: 'Return Rate', value: '2.1%', bar: 21 },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className="text-sm font-medium">{stat.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${stat.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
