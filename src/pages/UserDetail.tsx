import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ChevronLeft,
  User,
  Calendar,
  DollarSign,
  ExternalLink,
  Clock,
  Copy,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isCopied, setIsCopied] = useState(false);
  const [userData,setUserData]=useState([]);
  const [level1, setLevel1] = useState("0");
  const [level2, setLevel2] = useState("0");
  const [level3, setLevel3] = useState("0");
  const [firstLevelMatrixIncome, setFirstLevelMatrixIncome] = useState("0");
  const [secondLevelMatrixIncome, setSecondLevelMatrixIncome] = useState("0");
  const [sponserIncome, setSponserIncome] = useState("0");
  const [totalIncome, setTotalIncome] = useState("0");
  const [sponserData,setSponserData]=useState([]);
  const [uplineData,setUplineData]=useState([]);
  const [firstMatrix,setfirstMatrix]=useState([]);
  const [secondMatrix,setSecondMatrix]=useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
          try {
          const response = await axios.post('https://harvesthubai.com/api/admin/userdata',{walletaddress:userId});
          if (response) {
            // console.log('this is user', response.data);
            setUserData(response.data.registrationData[0])
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }

        try {
          const totalSponserIncome = await axios.post('https://harvesthubai.com/api/admin/sponserincome',{walletaddress:userId});
          if (totalSponserIncome.data) {
            // console.log('this is responce<<<<<<<',totalSponserIncome)
            setSponserIncome(totalSponserIncome.data.totalSponserIncomeInEther);
            setFirstLevelMatrixIncome(
              totalSponserIncome.data.totalfirstlevelmatrisincome
            );
           
            setSecondLevelMatrixIncome(
              totalSponserIncome.data.totalsecondlevelmatrix
            );
            setLevel1(totalSponserIncome.data.uplineLevelIncome.level1);
            setLevel2(totalSponserIncome.data.uplineLevelIncome.level2);
            setLevel3(totalSponserIncome.data.uplineLevelIncome.level3);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
        try {
          const response = await axios.post('https://harvesthubai.com/api/admin/user-income',{walletaddress:userId});
          if (response) {
            // console.log('this is user-Income', response.data);
            setUplineData(response.data.uplineLevelIncomeData);
            setfirstMatrix(response.data.firstLevelMatrixData);
            setSponserData(response.data.sponserIncomeData);
            setSecondMatrix(response.data.secondLevelMatrixData);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) {
    return <div>Loading user data...</div>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/users" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
        </Button>
      </div>

      {/* User Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-6 w-6" />
            User {userData.userID}
            {/* <Badge
              variant={user.status === 'active' ? 'default' : 'destructive'}
              className={`ml-2 ${
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {user.status === 'active' ? 'Active' : 'Blocked'}
            </Badge> */}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            User ID: {userData.userID} | Joined:{" "}
            {format(
              userData.createdAt ? new Date(userData.createdAt) : new Date(),
              "MMMM d, yyyy"
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
            asChild
          >
            <a
              href={`https://bscscan.com/address/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              View in Explorer
            </a>
          </Button>
        </div>
      </div>

      {/* User Profile and Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {/* <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p>{user.email}</p> */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Wallet Address
              </p>
              <div className="flex items-center gap-2">
                <p
                  className="font-mono text-xs truncate max-w-[100px]"
                  title={userId}
                >
                  {userId}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(userId)}
                >
                  {isCopied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Registration Hash
              </p>
              <p
                className="font-mono text-xs truncate max-w-[100px]"
                title={userData.transactionHash}
              >
                {userData.transactionHash}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Join Date
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p>
                  {userData.createdAt
                    ? format(new Date(userData.createdAt), "MMMM d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals & Team */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sesonser
                </p>
                <p className="text-2xl font-bold">{sponserIncome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  1 Level Matrix
                </p>
                <p className="text-2xl font-bold">{firstLevelMatrixIncome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  2 Level Matrix
                </p>
                <p className="text-2xl font-bold">{secondLevelMatrixIncome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Available
                </p>
                <p className="text-2xl font-bold">{totalIncome}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Stats */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Claimed
                </p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Uni Level 1
                </p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <p className="text-2xl font-bold">{level1}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Uni Level 2
                </p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <p className="text-2xl font-bold">{level2}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Uni Level 3
                </p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <p className="text-2xl font-bold">{level3}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Chart */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Business Activity</CardTitle>
          <CardDescription>Daily business volume over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
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
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(' ')[1]}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`$${value}`, 'Business']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="business"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

      {/* Tabs for Transactions and Referrals */}
      <Tabs defaultValue="sponser" className="w-full">
        <TabsList className="w-full overflow-x-auto flex sm:grid sm:grid-cols-4">
          <TabsTrigger value="sponser" className="min-w-max">
            Sponsor Income
          </TabsTrigger>
          <TabsTrigger value="first" className="min-w-max">
            First Matirx
          </TabsTrigger>
          <TabsTrigger value="second" className="min-w-max">
            Second Matrix
          </TabsTrigger>
          <TabsTrigger value="upline" className="min-w-max">
            Upline Income
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sponser" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Income</CardTitle>
              <CardDescription>
                Latest activity and transactions for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>From</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponserData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No transactions found for this user
                        </TableCell>
                      </TableRow>
                    ) : (
                      sponserData.map((transaction,index) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="capitalize">
                            {index+1}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              {format(transaction.createdAt, "MMM dd, yyyy HH:mm")}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]">
                          {transaction.amount/1e18}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]">
                            {transaction.from}
                          </TableCell>
                          <TableCell className="capitalize">
                            {transaction.to}
                          </TableCell>
                         
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="first" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Income</CardTitle>
              <CardDescription>
                Latest activity and transactions for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tx Hash</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                     
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firstMatrix.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No transactions found for this user
                        </TableCell>
                      </TableRow>
                    ) : (
                      firstMatrix.map((transaction,index) => (
                        <TableRow key={transaction._id}>
                           <TableCell className="capitalize">
                            {index+1}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]" title={transaction.from}>
                            {transaction.from}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]" title={transaction.to}>
                            {transaction.to}
                          </TableCell>
                          <TableCell className="capitalize">
                            {transaction.amount/1e18}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {transaction.transactionHash ? (
                                <>
                                  {`${transaction.transactionHash.substring(0, 6)}...${transaction.transactionHash.substring(transaction.transactionHash.length - 4)}`}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    asChild
                                  >
                                    <a 
                                      href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </>
                              ) : 'N/A'}
                            </div>
                          </TableCell>
                          
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              {transaction.createdAt ? format(transaction.createdAt, "MMM dd, yyyy") : 'NaN'}
                            </div>
                          </TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="second" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Income</CardTitle>
              <CardDescription>
                Latest activity and transactions for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tx Hash</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                     
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secondMatrix.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No transactions found for this user
                        </TableCell>
                      </TableRow>
                    ) : (
                      secondMatrix.map((transaction,index) => (
                        <TableRow key={transaction._id}>
                           <TableCell className="capitalize">
                            {index+1}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]" title={transaction.from}>
                            {transaction.from}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]" title={transaction.to}>
                            {transaction.to}
                          </TableCell>
                          <TableCell className="capitalize">
                            {transaction.amount/1e18}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {transaction.transactionHash ? (
                                <>
                                  {`${transaction.transactionHash.substring(0, 6)}...${transaction.transactionHash.substring(transaction.transactionHash.length - 4)}`}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    asChild
                                  >
                                    <a 
                                      href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </>
                              ) : 'N/A'}
                            </div>
                          </TableCell>
                          
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              {transaction.createdAt ? format(transaction.createdAt, "MMM dd, yyyy") : 'NaN'}
                            </div>
                          </TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Income</CardTitle>
              <CardDescription>
                Latest activity and transactions for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Tx Hash</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uplineData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-gray-500"
                        >
                          No transactions found for this user
                        </TableCell>
                      </TableRow>
                    ) : (
                      uplineData.map((transaction,index) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="capitalize">
                            {index+1}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]" title={transaction.from}>
                            {transaction.from}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]" title={transaction.to}>
                            {transaction.to}
                          </TableCell>
                          <TableCell className="capitalize">
                            {transaction.amount/1e18}
                          </TableCell>
                          <TableCell className="capitalize">
                            {transaction.level}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {transaction.transactionHash ? (
                                <>
                                  {`${transaction.transactionHash.substring(0, 6)}...${transaction.transactionHash.substring(transaction.transactionHash.length - 4)}`}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    asChild
                                  >
                                    <a 
                                      href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </>
                              ) : 'N/A'}
                            </div>
                          </TableCell>
                          
                          
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              {transaction.createdAt ? format(transaction.createdAt, "MMM dd, yyyy") : 'NaN'}
                            </div>
                          </TableCell>
                         
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
       
      </Tabs>
    </div>
  );
};

export default UserDetailPage;
