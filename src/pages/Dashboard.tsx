import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  TrendingUp,
  DollarSign,
  UserPlus,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Define types for the data
interface DailyData {
  date: string;
  users: number;
}

interface DailyBusiness {
  date: string;
  business: number;
}

interface UserStats {
  totalUsers: number;
  todaysJoinings: number;
  dailyUserData: DailyData[];
  dailyBusinessData: DailyBusiness[];
  totalBusiness: string; // Using string for BigInt serialization
  todayBusiness: string; // Using string for BigInt serialization
}

const Dashboard = () => {
  const [users, setUsers] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<string>('0');
  const [todayTokens, setTodayTokens] = useState<string>('0');
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [dailyBusiness, setDailyBusiness] = useState<DailyBusiness[]>([]);
  
  // Get the current date
  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<UserStats>('https://dashboard.azzxcoin.com/api/admin/userstats');
        setUsers(res.data?.totalUsers || 0);
        setNewUsers(res.data?.todaysJoinings || 0);
        setDailyData(res.data.dailyUserData || []);
        setDailyBusiness(res.data.dailyBusinessData || []);
        setTotalTokens(res.data.totalBusiness || '0');
        setTodayTokens(res.data.todayBusiness || '0');
        // console.log("this is response", res.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // Convert BigInt string to number for display
  const formatBigInt = (value: string): number => {
    try {
      return Number(BigInt(value) / BigInt(1e18));
    } catch {
      return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {format(today, 'MMMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newUsers}</div>
            <div className="text-xs text-gray-500 mt-1">
              New registrations today
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tokens Raised</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatBigInt(todayTokens)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatBigInt(totalTokens)}</div>
            <div className="text-xs text-gray-500 mt-1">
              Lifetime revenue
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Daily new user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value: string) => value.split(' ')[1] || value}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value} users`, 'Users']}
                    labelFormatter={(label: string) => <span style={{ color: 'blue' }}>Date: {label}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Business Revenue</CardTitle>
            <CardDescription>Daily business revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyBusiness}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value: string) => value.split(' ')[1]}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label: string) => <span style={{ color: 'green' }}>Date: {label}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="business"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      </div>
    </div>
  );
};

export default Dashboard;