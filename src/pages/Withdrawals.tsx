import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  DollarSign,
  ArrowDownCircle,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock withdrawal data
const generateWithdrawals = () => {
  const statuses = ['pending', 'processing', 'completed', 'failed'];
  const withdrawals = [];

  for (let i = 1; i <= 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    const amount = Math.floor(Math.random() * 1000) + 100;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    withdrawals.push({
      id: `WTH${10000 + i}`,
      userId: `USR${1000 + i}`,
      userName: `User ${i}`,
      withdrawalType: Math.random() > 0.5 ? 'BNB' : 'USDT',
      amount,
      amountInUSD: amount,
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      date,
      status,
      txHash: status === 'completed' ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
    });
  }

  return withdrawals.sort((a, b) => b.date.getTime() - a.date.getTime());
};

type Withdrawal = {
  id: string;
  userId: string;
  userName: string;
  withdrawalType: string;
  amount: number;
  amountInUSD: number;
  wallet: string;
  date: Date;
  status: string;
  txHash: string | null;
};

const withdrawals = generateWithdrawals() as Withdrawal[];

// Balance data
const balances = {
  bnb: 23.45,
  usdt: 18750.20,
  bnbInUSD: 23.45 * 650, // Assume 1 BNB = $650
};

const WithdrawalsPage = () => {
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>(withdrawals);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState<boolean>(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalAddress, setWithdrawalAddress] = useState<string>('');
  const [withdrawalType, setWithdrawalType] = useState<string>('BNB');
  const [txHash, setTxHash] = useState<string>('');

  // Calculate pending withdrawal totals
  const pendingBNB = withdrawals
    .filter(w => w.status === 'pending' && w.withdrawalType === 'BNB')
    .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

  const pendingUSDT = withdrawals
    .filter(w => w.status === 'pending' && w.withdrawalType === 'USDT')
    .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredWithdrawals(withdrawals);
      return;
    }

    const filtered = withdrawals.filter(
      withdrawal =>
        withdrawal.id.toLowerCase().includes(term) ||
        withdrawal.userId.toLowerCase().includes(term) ||
        withdrawal.userName.toLowerCase().includes(term) ||
        withdrawal.wallet.toLowerCase().includes(term)
    );

    setFilteredWithdrawals(filtered);
  };

  // Filter by status
  const filterByStatus = (status: string) => {
    if (status === 'all') {
      setFilteredWithdrawals(withdrawals);
    } else {
      const filtered = withdrawals.filter(withdrawal => withdrawal.status === status);
      setFilteredWithdrawals(filtered);
    }
  };

  // Handle withdrawal processing
  const processWithdrawal = () => {
    if (!selectedWithdrawal) return;

    if (!txHash.trim()) {
      toast.error('Please enter a transaction hash');
      return;
    }

    const updatedWithdrawals = filteredWithdrawals.map(w => {
      if (w.id === selectedWithdrawal.id) {
        toast.success(`Withdrawal ${selectedWithdrawal.id} has been processed successfully`);
        return { ...w, status: 'completed', txHash };
      }
      return w;
    });

    setFilteredWithdrawals(updatedWithdrawals);
    setIsProcessingDialogOpen(false);
    setTxHash('');
  };

  // Handle withdrawal rejection
  const rejectWithdrawal = () => {
    if (!selectedWithdrawal) return;

    const updatedWithdrawals = filteredWithdrawals.map(w => {
      if (w.id === selectedWithdrawal.id) {
        toast.success(`Withdrawal ${selectedWithdrawal.id} has been rejected`);
        return { ...w, status: 'failed' };
      }
      return w;
    });

    setFilteredWithdrawals(updatedWithdrawals);
    setIsProcessingDialogOpen(false);
  };

  // Handle admin withdrawal
  const handleAdminWithdrawal = () => {
    const amount = Number.parseFloat(withdrawalAmount);

    if (!withdrawalAmount || Number.isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!withdrawalAddress.trim() || !withdrawalAddress.startsWith('0x')) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    // Check if enough balance
    if (withdrawalType === 'BNB' && amount > balances.bnb) {
      toast.error('Insufficient BNB balance');
      return;
    }

    if (withdrawalType === 'USDT' && amount > balances.usdt) {
      toast.error('Insufficient USDT balance');
      return;
    }

    toast.success(`Withdrawal of ${amount} ${withdrawalType} initiated successfully`);
    setIsWithdrawDialogOpen(false);
    setWithdrawalAmount('');
    setWithdrawalAddress('');
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", className: string, icon: React.ReactNode }> = {
      pending: {
        variant: 'outline',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      processing: {
        variant: 'secondary',
        className: 'bg-blue-100 text-blue-800',
        icon: <ArrowDownCircle className="h-3 w-3 mr-1" />,
      },
      completed: {
        variant: 'default',
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      failed: {
        variant: 'destructive',
        className: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
    };

    const { variant, className, icon } = variants[status] || variants.pending;

    return (
      <Badge variant={variant} className={className}>
        <div className="flex items-center">
          {icon}
          <span className="capitalize">{status}</span>
        </div>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Withdrawals</h2>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BNB Balance</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balances.bnb.toFixed(4)} BNB</div>
            <div className="text-xs text-gray-500 mt-1">
              ~${balances.bnbInUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balances.usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-gray-500 mt-1">
              {balances.usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending BNB</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBNB.toFixed(4)} BNB</div>
            <div className="text-xs text-gray-500 mt-1">
              ~${(pendingBNB * 650).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending USDT</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingUSDT.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-gray-500 mt-1">
              {pendingUSDT.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by ID, user or wallet..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowDownCircle className="h-4 w-4 mr-2" /> Admin Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Withdrawal</DialogTitle>
              <DialogDescription>
                Withdraw BNB or USDT from the system wallet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawalType">Token Type</Label>
                <Select value={withdrawalType} onValueChange={setWithdrawalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BNB">BNB</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                  <div className="absolute right-3 top-2 text-sm text-gray-500">
                    {withdrawalType}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Available: {withdrawalType === 'BNB'
                    ? `${balances.bnb.toFixed(4)} BNB`
                    : `${balances.usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT`}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdminWithdrawal}>Withdraw</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Withdrawal Tabs and Table */}
      <Tabs defaultValue="all" className="w-full" onValueChange={filterByStatus}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <WithdrawalTable
            withdrawals={filteredWithdrawals}
            setSelectedWithdrawal={setSelectedWithdrawal}
            setIsProcessingDialogOpen={setIsProcessingDialogOpen}
            StatusBadge={StatusBadge}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <WithdrawalTable
            withdrawals={filteredWithdrawals}
            setSelectedWithdrawal={setSelectedWithdrawal}
            setIsProcessingDialogOpen={setIsProcessingDialogOpen}
            StatusBadge={StatusBadge}
          />
        </TabsContent>
        <TabsContent value="processing" className="mt-4">
          <WithdrawalTable
            withdrawals={filteredWithdrawals}
            setSelectedWithdrawal={setSelectedWithdrawal}
            setIsProcessingDialogOpen={setIsProcessingDialogOpen}
            StatusBadge={StatusBadge}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <WithdrawalTable
            withdrawals={filteredWithdrawals}
            setSelectedWithdrawal={setSelectedWithdrawal}
            setIsProcessingDialogOpen={setIsProcessingDialogOpen}
            StatusBadge={StatusBadge}
          />
        </TabsContent>
        <TabsContent value="failed" className="mt-4">
          <WithdrawalTable
            withdrawals={filteredWithdrawals}
            setSelectedWithdrawal={setSelectedWithdrawal}
            setIsProcessingDialogOpen={setIsProcessingDialogOpen}
            StatusBadge={StatusBadge}
          />
        </TabsContent>
      </Tabs>

      {/* Process Withdrawal Dialog */}
      <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Withdrawal</DialogTitle>
            <DialogDescription>
              Process withdrawal request {selectedWithdrawal?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User Information</Label>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">User ID:</span>
                  <span className="text-sm font-medium">{selectedWithdrawal?.userId}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Name:</span>
                  <span className="text-sm font-medium">{selectedWithdrawal?.userName}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Withdrawal Details</Label>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="text-sm font-medium">
                    {selectedWithdrawal?.amount} {selectedWithdrawal?.withdrawalType}
                    <span className="text-gray-500 ml-1">
                      (${selectedWithdrawal?.amountInUSD})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Wallet:</span>
                  <span className="text-sm font-mono truncate max-w-[200px]">
                    {selectedWithdrawal?.wallet}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm">
                    {selectedWithdrawal?.date
                      ? format(selectedWithdrawal.date, 'MMM dd, yyyy HH:mm')
                      : ''}
                  </span>
                </div>
              </div>
            </div>
            {selectedWithdrawal?.status === 'pending' && (
              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash</Label>
                <Input
                  id="txHash"
                  placeholder="0x..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Enter the transaction hash after processing the withdrawal
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsProcessingDialogOpen(false)}
            >
              Cancel
            </Button>
            {selectedWithdrawal?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={rejectWithdrawal}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={processWithdrawal}
                  disabled={!txHash.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Process
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Withdrawal Table Component
interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
  setSelectedWithdrawal: (withdrawal: Withdrawal) => void;
  setIsProcessingDialogOpen: (open: boolean) => void;
  StatusBadge: React.FC<{ status: string }>;
}

const WithdrawalTable = ({
  withdrawals,
  setSelectedWithdrawal,
  setIsProcessingDialogOpen,
  StatusBadge,
}: WithdrawalTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Wallet</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No withdrawals found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">{withdrawal.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{withdrawal.userName}</span>
                        <span className="text-xs text-gray-500">{withdrawal.userId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {withdrawal.amount} {withdrawal.withdrawalType}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${withdrawal.amountInUSD}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs truncate max-w-[150px]">
                      {withdrawal.wallet}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(withdrawal.date, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={withdrawal.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setIsProcessingDialogOpen(true);
                        }}
                      >
                        <span className="sr-only">View details</span>
                        {withdrawal.status === 'pending' ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : withdrawal.txHash ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {withdrawals.length > 10 && (
        <CardFooter className="flex justify-center border-t p-4">
          <Button variant="outline" size="sm">
            Load More
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WithdrawalsPage;
