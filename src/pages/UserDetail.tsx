import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  User,
  Calendar,
  DollarSign,
  ExternalLink,
  Clock,
  Copy,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";

// Define interfaces for data structures
interface User {
  name?: string;
  email?: string;
  createdAt?: string;
}

interface TokenPurchase {
  _id: string;
  amount: number;
  usdtPaid: number;
  transactionHash: string;
  price: number;
  createdAt: string;
}

interface ReferralReward {
  _id: string;
  rewardFrom: string;
  rewardedUser: string;
  rewardAmount: number;
  transactionHash?: string;
  createdAt?: string;
}

interface ApiResponse {
  user: User;
  totalTokenPurchased: string;
  totalReferralIncome: string;
  tokenPurchases: TokenPurchase[];
  referralRewards: ReferralReward[];
}

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>({});
  const [totalTokenbuy, setTotalIncomeBuy] = useState<string>("0");
  const [totalReferralincome, setTotalReferralIncome] = useState<string>("0");
  const [tokenPurchase, setTokenPurchase] = useState<TokenPurchase[]>([]);
  const [ReferralData, setReferralData] = useState<ReferralReward[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await axios.post<ApiResponse>(
            "http://localhost:5000/api/admin/userdata",
            { walletAddress: userId }
          );
          if (response.data) {
            setUserData(response.data.user || {});
            setTotalIncomeBuy(response.data.totalTokenPurchased || "0");
            setTotalReferralIncome(response.data.totalReferralIncome || "0");
            setTokenPurchase(response.data.tokenPurchases || []);
            setReferralData(response.data.referralRewards || []);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) {
    return <div>Loading user data...</div>;
  }

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast.success("Address copied to clipboard");
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
            {userData.name || "Unknown User"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {userData.createdAt
              ? format(new Date(userData.createdAt), "MMMM d, yyyy")
              : "N/A"}
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
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {/* User Info Card */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Address</p>
                <div className="flex items-center gap-3 mt-1">
                  <p
                    className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]"
                    title={userId}
                  >
                    {userId}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                onClick={() => copyToClipboard(userId)}
              >
                {isCopied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p
                  className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px] mt-1"
                  title={userData.email}
                >
                  {userData.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Join Date</p>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {userData.createdAt
                    ? format(new Date(userData.createdAt), "MMMM d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Overview Card */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Income Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tokens Buy</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(parseFloat(totalTokenbuy) / 1e18).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Referral Income</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(parseFloat(totalReferralincome) / 1e18).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Transactions and Referrals */}
      <Tabs defaultValue="sponser" className="w-full">
        <TabsList className="w-full flex sm:grid sm:grid-cols-2">
          <TabsTrigger value="sponser" className="min-w-max">
            Token Buy
          </TabsTrigger>
          <TabsTrigger value="first" className="min-w-max">
            Referral
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
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Usdt Paid</TableHead>
                      <TableHead>Trx Hash</TableHead>
                      <TableHead className="text-center">Coin Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokenPurchase.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-gray-500"
                        >
                          No transactions found for this user
                        </TableCell>
                      </TableRow>
                    ) : (
                      tokenPurchase.map((transaction, index) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="capitalize">{index + 1}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              {transaction.createdAt
                                ? format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")
                                : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]">
                            {(transaction.amount / 1e18).toFixed(2)}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]">
                            {(transaction.usdtPaid / 1e18).toFixed(2)}
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px]">
                            <a
                              href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {transaction.transactionHash}
                            </a>
                          </TableCell>
                          <TableCell className="capitalize truncate max-w-[100px] text-center">
                            {(transaction.price / 100000).toFixed(2)}
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
              <CardTitle>Recent Referral Income</CardTitle>
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
                      <TableHead>Reward From</TableHead>
                      <TableHead>Rewarded User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tx Hash</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ReferralData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-gray-500"
                        >
                          No transactions found for this user
                        </TableCell>
                      </TableRow>
                    ) : (
                      ReferralData.map((transaction, index) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="capitalize">{index + 1}</TableCell>
                          <TableCell
                            className="capitalize truncate max-w-[100px]"
                            title={transaction.rewardFrom}
                          >
                            {transaction.rewardFrom}
                          </TableCell>
                          <TableCell
                            className="capitalize truncate max-w-[100px]"
                            title={transaction.rewardedUser}
                          >
                            {transaction.rewardedUser}
                          </TableCell>
                          <TableCell className="capitalize">
                            {(transaction.rewardAmount / 1e18).toFixed(2)}
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
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              {transaction.createdAt
                                ? format(new Date(transaction.createdAt), "MMM dd, yyyy")
                                : "N/A"}
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