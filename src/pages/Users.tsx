import { useState,useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Search,
  MoreHorizontal,
  UserCog,
  UserX,
  Wallet,
  Eye,
  UserPlus,
  ExternalLink,
  Check,
  Ban
} from 'lucide-react';
import { format, set } from 'date-fns';
import { toast } from 'sonner';
import { blockUnblockuser,isUnlocked } from '../config/web3'
import { useAccount, useWalletClient } from "wagmi";
import ConnectWallet from './ConnectWallet';


const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [registrationDisabled, setRegistrationDisabled] = useState(false);
  const [activationDisabled, setActivationDisabled] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isFreePlacementDialogOpen, setIsFreePlacementDialogOpen] = useState(false);
  const [freeUserId, setFreeUserId] = useState('');
  const [userIdValidation, setUserIdValidation] = useState({
    valid: false,
    message: 'Enter a user ID',
  });

  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const {isConnected,address}=useAccount();


useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://harvesthubai.com/api/admin/userlist?page=${page}&limit=10&search=${search}`
      );
      console.log("this is response", res.data);
      if (page === 1) {
        setFilteredUsers(res.data.users);
      } else {
        setFilteredUsers((prev) => [...prev, ...res.data.users]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  fetchData();
}, [page, search]);

  // Handle search input change
  const handleSearchChange = (e) => {
    console.log("this is search")
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle blocking/unblocking a user
  const handleToggleBlockUser = async(address) => {
    if(!isConnected){
      toast.error("please connect your wallet");
      return;
    }
    const status=await isUnlocked(address);
    if(status){
      toast.error("User Allready Blocked");
      return;
      }
    console.log("this is address", address)
    
    try {
      const toastId = toast.loading("Blocking user...");
      const block = await new Promise(async (resolve, reject) => {
        try {
          const result = await blockUnblockuser(address, true);
          console.log("this is block", result);
          if (result) {
            console.log("user blocked");
            toast.success("User Blocked", { id: toastId });
            resolve(result);
          } else {
            toast.error("Blocking operation failed", { id: toastId });
            reject(new Error("Blocking operation failed"));
          }
        } catch (error) {
          toast.error("Failed to block user", { id: toastId });
          reject(error);
        }
      });
    } catch (error) {
      console.error("Error blocking user:", error);
    }
    // const updatedUsers = filteredUsers.map(u => {
    //   if (u.id === user.id) {
    //     const newStatus = u.status === 'active' ? 'blocked' : 'active';
    //     const actionVerb = newStatus === 'blocked' ? 'blocked' : 'unblocked';

    //     toast.success(`User ${user.name} successfully ${actionVerb}`);
    //     return { ...u, status: newStatus };
    //   }
    //   return u;
    // });

    // setFilteredUsers(updatedUsers);
  };

  const handleChangeAddress = () => {
    if (!selectedUser || !newAddress.trim() || !newAddress.startsWith('0x')) {
      toast.error('Please enter a valid address');
      return;
    }

    const updatedUsers = filteredUsers.map(u => {
      if (u.id === selectedUser.id) {
        toast.success(`Address changed for user ${selectedUser.name}`);
        return { ...u, address: newAddress };
      }
      return u;
    });

    setFilteredUsers(updatedUsers);
    setIsAddressDialogOpen(false);
    setNewAddress('');
  };

  // Handle free user placement
  const handleFreePlacement = () => {
    if (!userIdValidation.valid) {
      toast.error(userIdValidation.message);
      return;
    }

    toast.success(`User ${freeUserId} has been placed for free`);
    setIsFreePlacementDialogOpen(false);
    setFreeUserId('');
    setUserIdValidation({ valid: false, message: 'Enter a user ID' });
  };

  // Validate user ID for free placement
  const validateUserId = (id: string) => {
    setFreeUserId(id);

    if (!id.trim()) {
      setUserIdValidation({ valid: false, message: 'User ID is required' });
      return;
    }

    // Check if ID exists in our users array
    const exists = users.some(user => user.id === id);

    if (exists) {
      setUserIdValidation({ valid: true, message: 'Valid user ID' });
    } else {
      setUserIdValidation({ valid: false, message: 'User ID does not exist' });
    }
  };

  // Toggle registration status
  const toggleRegistration = () => {
    setRegistrationDisabled(!registrationDisabled);
    toast.success(`User registration has been ${registrationDisabled ? 'enabled' : 'disabled'}`);
  };

  // Toggle activation status
  const toggleActivation = () => {
    setActivationDisabled(!activationDisabled);
    toast.success(`User activation has been ${activationDisabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        {/* <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button
            variant={registrationDisabled ? "destructive" : "outline"}
            onClick={toggleRegistration}
            className="flex items-center gap-2"
          >
            {registrationDisabled ? (
              <Ban className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {registrationDisabled
              ? "Registration Disabled"
              : "Registration Enabled"}
          </Button>
          <Button
            variant={activationDisabled ? "destructive" : "outline"}
            onClick={toggleActivation}
            className="flex items-center gap-2"
          >
            {activationDisabled ? (
              <Ban className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {activationDisabled ? "Activation Disabled" : "Activation Enabled"}
          </Button>
          <ConnectWallet/>
        </div> */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users by ID, name, email, or address..."
            className="pl-9"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Dialog
          open={isFreePlacementDialogOpen}
          onOpenChange={setIsFreePlacementDialogOpen}
        >
          <DialogTrigger asChild>
            <ConnectWallet />
            {/* <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" /> Place User for Free
            </Button> */}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place User for Free</DialogTitle>
              <DialogDescription>
                Enter the user ID to place for free activation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="e.g. USR1001"
                  value={freeUserId}
                  onChange={(e) => validateUserId(e.target.value)}
                />
                <p
                  className={`text-xs ${userIdValidation.valid ? "text-green-500" : "text-red-500"}`}
                >
                  {userIdValidation.message}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsFreePlacementDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFreePlacement}
                disabled={!userIdValidation.valid}
              >
                Confirm Placement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            Manage all users in the system. You can view details, change
            addresses, or block users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  {/* <TableHead>Name</TableHead> */}
                  <TableHead className="">Address</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Sponser Address
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    TRX Hash
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Join Date
                  </TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.userID}
                      </TableCell>
                      {/* <TableCell>{user.name}</TableCell> */}
                      <TableCell className="font-mono text-xs truncate max-w-[100px]">
                        {user.userAddress}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs truncate max-w-[100px]">
                        {user.sponsorAddress}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs truncate max-w-[50px]">
                        {user.transactionHash}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      {/* <TableCell>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                          className={`${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Active' : 'Blocked'}
                        </Badge>
                      </TableCell> */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/users/${user.userAddress}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Dashboard
                              </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAddressDialogOpen(true);
                              }}
                            >
                              <UserCog className="h-4 w-4 mr-2" />
                              Change Address
                            </DropdownMenuItem> */}
                            {/* <DropdownMenuItem asChild>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <div
                                    className={`flex items-center cursor-pointer ${
                                      user.status === "active"
                                        ? "text-red-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    {user.status === "active"
                                      ? "Block User"
                                      : "Unblock User"}
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {user.status === "active"
                                        ? "Block User"
                                        : "Unblock User"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {user.status === "active"
                                        ? "This will block the user from receiving any income. All income will be redirected to admin. This action can be reversed later."
                                        : "This will unblock the user and allow them to receive income again."}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleToggleBlockUser(user.userAddress)
                                      }
                                      className={
                                        user.status === "active"
                                          ? "bg-red-600"
                                          : "bg-green-600"
                                      }
                                    >
                                      {user.status === "active"
                                        ? "Block"
                                        : "Unblock"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem> */}
                            <DropdownMenuItem asChild>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <div className="flex items-center cursor-pointer text-red-600">
                                    <UserX className="h-4 w-4 mr-2" />
                                    Block User
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Block User
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will block the user from receiving
                                      any income. All income will be redirected
                                      to admin. This action can be reversed
                                      later.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleToggleBlockUser(user.userAddress)
                                      }
                                      className="bg-red-600"
                                    >
                                      Block
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Button
                                variant="none"
                                className="flex items-center gap-2"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={`https://bscscan.com/address/${user.userAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View in Explorer
                                </a>
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {page < totalPages && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Address Dialog */}
      {/* <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Address</DialogTitle>
            <DialogDescription>
              Enter the new blockchain address for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentAddress">Current Address</Label>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-xs truncate">
                {selectedUser?.address}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newAddress">New Address</Label>
              <Input
                id="newAddress"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddressDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleChangeAddress}>Update Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default UsersPage;
