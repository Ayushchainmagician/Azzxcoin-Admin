import { useState, useEffect } from 'react';
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
import { format } from 'date-fns';
import { toast } from 'sonner';

// Define User interface
interface User {
  _id: string;
  name: string;
  assignedWalletAddress: string;
  referrer: string;
  email: string;
  mobile: string;
}

// Define API response interface
interface ApiResponse {
  users: User[];
  totalPages: number;
}

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `http://localhost:5000/api/admin/userlist?page=${page}&limit=10&search=${search}`
        );
        // console.log("this is response", res.data);
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
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
                  <TableHead>#</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="">Address</TableHead>
                  <TableHead className="hidden md:table-cell text-center">
                    Sponsor Id
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Mobile
                  </TableHead>
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
                  filteredUsers.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[100px]">
                        {user.assignedWalletAddress}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs text-center">
                        {user.referrer}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">
                        {user.email}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.mobile}
                      </TableCell>
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
                                to={`/users/${user.assignedWalletAddress}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Dashboard
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={`https://bscscan.com/address/${user.assignedWalletAddress}`}
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
    </div>
  );
};

export default UsersPage;