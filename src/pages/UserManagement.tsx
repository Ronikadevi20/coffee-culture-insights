import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Store,
  Mail,
  Calendar,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api, { getErrorMessage } from '@/lib/api';
import { getUploadUrl, PLATFORM_ADMIN_ROUTES } from '@/config/api.routes';

interface PendingCafeAdmin {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  cafe?: {
    id: string;
    name: string;
    address: string;
    city: string;
    imageUrl?: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  membershipType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  accountStatus: string;
  hasCompletedOnboarding?: boolean;
  lastLogin?: string;
  createdAt: string;
  _count: {
    stamps: number;
    cafeCards: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);

  // Pending cafe admins state
  const [pendingAdmins, setPendingAdmins] = useState<PendingCafeAdmin[]>([]);
  const [pendingPagination, setPendingPagination] = useState<Pagination | null>(null);

  // All users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<PendingCafeAdmin | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch pending cafe admins
  const fetchPendingAdmins = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get(PLATFORM_ADMIN_ROUTES.CAFE_ADMINS_PENDING, {
        params: { page, limit: 10 },
      });

      setPendingAdmins(response.data.data);
      setPendingPagination(response.data.data.pagination);
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch all users
  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.accountStatus = statusFilter;

      const response = await api.get(PLATFORM_ADMIN_ROUTES.USERS, { params });
      setUsers(response.data.data);
      setUsersPagination(response.data.pagination);
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, searchQuery, roleFilter, statusFilter]);

  // Initial fetch
  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingAdmins();
    } else {
      fetchUsers();
    }
  }, [activeTab, fetchPendingAdmins, fetchUsers]);

  // Handle approve
  const handleApprove = async (admin: PendingCafeAdmin) => {
    setActionLoading(true);
    try {
      await api.post(PLATFORM_ADMIN_ROUTES.CAFE_ADMIN_APPROVE(admin.id));
      toast({
        title: 'Success',
        description: `${admin.username}'s account has been approved. They will receive an email notification.`,
      });
      fetchPendingAdmins();
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedAdmin) return;

    setActionLoading(true);
    try {
      await api.post(PLATFORM_ADMIN_ROUTES.CAFE_ADMIN_REJECT(selectedAdmin.id), {
        reason: rejectReason || undefined,
      });
      toast({
        title: 'Account Rejected',
        description: `${selectedAdmin.username}'s account has been rejected. They will receive an email notification.`,
      });
      setRejectDialogOpen(false);
      setSelectedAdmin(null);
      setRejectReason('');
      fetchPendingAdmins();
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Open reject dialog
  const openRejectDialog = (admin: PendingCafeAdmin) => {
    setSelectedAdmin(admin);
    setRejectDialogOpen(true);
  };

  // Handle user activate/deactivate
  const handleToggleUserStatus = async (user: User) => {
    setActionLoading(true);
    try {
      const endpoint = user.isActive
        ? PLATFORM_ADMIN_ROUTES.USER_DEACTIVATE(user.id)
        : PLATFORM_ADMIN_ROUTES.USER_ACTIVATE(user.id);

      await api.post(endpoint);
      toast({
        title: 'Success',
        description: `User ${user.isActive ? 'deactivated' : 'activated'} successfully.`,
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return <Badge className="bg-purple-100 text-purple-800">Platform Admin</Badge>;
      case 'CAFE_ADMIN':
        return <Badge className="bg-blue-100 text-blue-800">Cafe Admin</Badge>;
      case 'USER':
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, approve cafe admins, and control access.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => activeTab === 'pending' ? fetchPendingAdmins() : fetchUsers()}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Approvals
            {pendingPagination && pendingPagination.total > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingPagination.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users
          </TabsTrigger>
        </TabsList>

        {/* Pending Approvals Tab */}
        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : pendingAdmins.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  All Caught Up!
                </h3>
                <p className="text-muted-foreground text-center">
                  There are no pending cafe admin approvals at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingAdmins.map((admin) => (
                <Card key={admin.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {admin.cafe.imageUrl ? (
                            <img
                              src={getUploadUrl(admin.cafe.imageUrl)}
                              alt={admin.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{admin.username}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {admin.email}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {admin.hasCompletedOnboarding ? (
                          <Badge className="bg-green-100 text-green-800">
                            Onboarding Complete
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">
                            Onboarding Incomplete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Cafe Info */}
                    {admin.cafe && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                        <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                          {admin.cafe.imageUrl ? (
                            <img
                              src={getUploadUrl(admin.cafe.imageUrl)}
                              alt={admin.cafe.name}
                              className="w-16 h-16 object-cover"
                            />
                          ) : (
                            <Store className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {admin.cafe.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {admin.cafe.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {admin.cafe.city}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Applied: {formatDate(admin.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleApprove(admin)}
                        disabled={actionLoading || !admin.hasCompletedOnboarding}
                        className="flex-1"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openRejectDialog(admin)}
                        disabled={actionLoading}
                        className="flex-1"
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                    {!admin.hasCompletedOnboarding && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Cannot approve until onboarding is complete
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {pendingPagination && pendingPagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingPagination.page <= 1}
                    onClick={() => fetchPendingAdmins(pendingPagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {pendingPagination.page} of {pendingPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pendingPagination.hasMore}
                    onClick={() => fetchPendingAdmins(pendingPagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* All Users Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Roles</option>
              <option value="USER">Users</option>
              <option value="CAFE_ADMIN">Cafe Admins</option>
              <option value="PLATFORM_ADMIN">Platform Admins</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <Button onClick={() => fetchUsers()}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          User
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Active
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Joined
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-foreground">
                                  {user.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(user.accountStatus)}
                            </td>
                            <td className="py-3 px-4">
                              {user.isActive ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleUserStatus(user)}
                                disabled={actionLoading}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              {/* Pagination */}
              {usersPagination && usersPagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersPagination.page <= 1}
                    onClick={() => fetchUsers(usersPagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {usersPagination.page} of {usersPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!usersPagination.hasMore}
                    onClick={() => fetchUsers(usersPagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Cafe Admin Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedAdmin?.username}'s application?
              They will receive an email notification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Reason for rejection (optional)
              </label>
              <Textarea
                placeholder="Enter a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason('');
                setSelectedAdmin(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
