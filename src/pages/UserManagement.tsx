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
  Eye,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Shield,
  Coffee,
  CreditCard,
  Activity,
  Navigation,
  Tag,
  Info,
  Hash,
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

interface CafeDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  instagram?: string | null;
  website?: string | null;
  verificationMethod?: string;
  amenities?: string[] | null;
  openingHours?: Array<{ day: string; open: string; close: string; isClosed: boolean }> | Record<string, string> | null;
  stampsRequired?: number;
  rewardDescription?: string;
  rewardTerms?: string | null;
  onboardingComplete?: boolean;
  qrCode?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PendingCafeAdmin {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  cafe?: CafeDetails;
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

interface UserDetail extends User {
  profileImageUrl?: string;
  updatedAt?: string;
  managedCafes?: { cafe: CafeDetails }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/** Renders all fields of a cafe — used in both pending approval and user detail dialogs */
const CafeDetailView = ({ cafe }: { cafe: CafeDetails }) => {
  const imageUrl = getUploadUrl(cafe.imageUrl);

  return (
    <div className="space-y-5">
      {/* Cover image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted border">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cafe.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Store className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Identity */}
      <Section title="Identity" icon={<Store className="w-4 h-4" />}>
        <Row label="Cafe Name" value={cafe.name} />
        <Row label="Cafe ID" value={<span className="font-mono text-xs">{cafe.id}</span>} />
        <Row label="Status">
          {cafe.isActive
            ? <Badge className="bg-green-100 text-green-800">Active</Badge>
            : <Badge className="bg-red-100 text-red-800">Inactive</Badge>}
        </Row>
        {cafe.onboardingComplete !== undefined && (
          <Row label="Onboarding">
            {cafe.onboardingComplete
              ? <Badge className="bg-green-100 text-green-800">Complete</Badge>
              : <Badge className="bg-amber-100 text-amber-800">Incomplete</Badge>}
          </Row>
        )}
        {cafe.description && <Row label="Description" value={cafe.description} full />}
      </Section>

      {/* Location */}
      <Section title="Location" icon={<MapPin className="w-4 h-4" />}>
        <Row label="Address" value={cafe.address} full />
        <Row label="City" value={cafe.city} />
        {cafe.latitude != null && <Row label="Latitude" value={String(cafe.latitude)} />}
        {cafe.longitude != null && <Row label="Longitude" value={String(cafe.longitude)} />}
        {cafe.latitude != null && cafe.longitude != null && (
          <Row label="Map" full>
            <a
              href={`https://www.google.com/maps?q=${cafe.latitude},${cafe.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline flex items-center gap-1 text-sm"
            >
              <Navigation className="w-3 h-3" />
              Open in Google Maps
            </a>
          </Row>
        )}
      </Section>

      {/* Contact */}
      <Section title="Contact" icon={<Phone className="w-4 h-4" />}>
        {cafe.phone && <Row label="Phone" value={cafe.phone} />}
        {cafe.email && <Row label="Email" value={cafe.email} />}
        {cafe.website && (
          <Row label="Website">
            <a href={cafe.website} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
              <Globe className="w-3 h-3" /> {cafe.website}
            </a>
          </Row>
        )}
        {cafe.instagram && (
          <Row label="Instagram">
            <span className="flex items-center gap-1 text-sm"><Instagram className="w-3 h-3" /> {cafe.instagram}</span>
          </Row>
        )}
      </Section>

      {/* Loyalty & Rewards */}
      <Section title="Loyalty & Rewards" icon={<Tag className="w-4 h-4" />}>
        <Row label="Verification" value={<span className="capitalize">{cafe.verificationMethod || '—'}</span>} />
        <Row label="Stamps Required" value={String(cafe.stampsRequired ?? 10)} />
        <Row label="Reward" value={cafe.rewardDescription ?? 'Free Coffee'} />
        {cafe.rewardTerms && <Row label="Reward Terms" value={cafe.rewardTerms} full />}
      </Section>

      {/* Amenities */}
      {cafe.amenities && cafe.amenities.length > 0 && (
        <Section title="Amenities" icon={<Info className="w-4 h-4" />}>
          <div className="col-span-2 flex flex-wrap gap-2">
            {cafe.amenities.map((a) => (
              <Badge key={a} variant="outline">{a}</Badge>
            ))}
          </div>
        </Section>
      )}

      {/* Opening Hours */}
      {cafe.openingHours && (
        Array.isArray(cafe.openingHours)
          ? cafe.openingHours.length > 0 && (
            <Section title="Opening Hours" icon={<Clock className="w-4 h-4" />}>
              {(cafe.openingHours as Array<{ day: string; open: string; close: string; isClosed: boolean }>)
                .sort((a, b) => DAY_ORDER.indexOf(a.day.toLowerCase()) - DAY_ORDER.indexOf(b.day.toLowerCase()))
                .map((h) => (
                  <Row
                    key={h.day}
                    label={h.day.charAt(0).toUpperCase() + h.day.slice(1)}
                    value={h.isClosed ? 'Closed' : `${h.open} – ${h.close}`}
                  />
                ))}
            </Section>
          )
          : Object.keys(cafe.openingHours as Record<string, string>).length > 0 && (
            <Section title="Opening Hours" icon={<Clock className="w-4 h-4" />}>
              {DAY_ORDER
                .filter((d) => (cafe.openingHours as Record<string, string>)[d])
                .map((day) => (
                  <Row key={day} label={day.charAt(0).toUpperCase() + day.slice(1)} value={(cafe.openingHours as Record<string, string>)[day]} />
                ))}
            </Section>
          )
      )}

      {/* System */}
      <Section title="System" icon={<Hash className="w-4 h-4" />}>
        {cafe.qrCode && <Row label="QR Code" value={<span className="font-mono text-xs break-all">{cafe.qrCode}</span>} full />}
        {cafe.createdAt && <Row label="Created" value={new Date(cafe.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />}
        {cafe.updatedAt && <Row label="Last Updated" value={new Date(cafe.updatedAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />}
      </Section>
    </div>
  );
};

/** Section wrapper */
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <h5 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
      {icon} {title}
    </h5>
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-3 border rounded-lg bg-muted/20">
      {children}
    </div>
  </div>
);

/** Single label/value row */
const Row = ({
  label,
  value,
  full,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  full?: boolean;
  children?: React.ReactNode;
}) => (
  <div className={full ? 'col-span-2' : ''}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="text-sm font-medium text-foreground mt-0.5">{children ?? value ?? '—'}</div>
  </div>
);

/** Reusable card for awaiting-approval pending admins */
const PendingAdminCard = ({
  admin,
  actionLoading,
  formatDate,
  onApprove,
  onReject,
  onViewDetails,
}: {
  admin: PendingCafeAdmin;
  actionLoading: boolean;
  formatDate: (d?: string) => string;
  onApprove: (a: PendingCafeAdmin) => void;
  onReject: (a: PendingCafeAdmin) => void;
  onViewDetails: (a: PendingCafeAdmin) => void;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {admin.profileImageUrl
              ? <img src={getUploadUrl(admin.profileImageUrl)} alt={admin.username} className="w-12 h-12 rounded-full object-cover" />
              : <Users className="w-6 h-6 text-primary" />}
          </div>
          <div>
            <CardTitle className="text-lg">{admin.username}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> {admin.email}
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">Onboarding Complete</Badge>
      </div>
    </CardHeader>
    <CardContent>
      {admin.cafe && (
        <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg mb-4">
          <div className="w-14 h-14 rounded-lg bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
            {admin.cafe.imageUrl
              ? <img src={getUploadUrl(admin.cafe.imageUrl)} alt={admin.cafe.name} className="w-14 h-14 object-cover" />
              : <Store className="w-7 h-7 text-muted-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{admin.cafe.name}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" /> {admin.cafe.address}, {admin.cafe.city}
            </p>
            {admin.cafe.phone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3 flex-shrink-0" /> {admin.cafe.phone}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Applied: {formatDate(admin.createdAt)}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(admin)}>
          <Eye className="w-4 h-4 mr-2" /> View Full Details
        </Button>
        <Button onClick={() => onApprove(admin)} disabled={actionLoading} className="flex-1">
          <UserCheck className="w-4 h-4 mr-2" /> Approve
        </Button>
        <Button variant="outline" onClick={() => onReject(admin)} disabled={actionLoading} className="flex-1">
          <UserX className="w-4 h-4 mr-2" /> Reject
        </Button>
      </div>
    </CardContent>
  </Card>
);

// ─── Main component ────────────────────────────────────────────────────────────

const UserManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);

  // Pending cafe admins state — split into two groups
  const [awaitingApproval, setAwaitingApproval] = useState<PendingCafeAdmin[]>([]);
  const [incompleteOnboarding, setIncompleteOnboarding] = useState<PendingCafeAdmin[]>([]);
  const [pendingPagination, setPendingPagination] = useState<Pagination | null>(null);

  // All users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Reject dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<PendingCafeAdmin | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // User detail dialog state
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserDetail | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);

  // Pending admin detail dialog state
  const [pendingDetailOpen, setPendingDetailOpen] = useState(false);
  const [selectedPendingAdmin, setSelectedPendingAdmin] = useState<PendingCafeAdmin | null>(null);

  // Fetch pending cafe admins
  const fetchPendingAdmins = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get(PLATFORM_ADMIN_ROUTES.CAFE_ADMINS_PENDING, {
        params: { page, limit: 50 },
      });
      const payload = response.data.data;
      setAwaitingApproval(payload.awaitingApproval ?? []);
      setIncompleteOnboarding(payload.incompleteOnboarding ?? []);
      setPendingPagination(payload.pagination ?? null);
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
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
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, searchQuery, roleFilter, statusFilter]);

  // Fetch single user detail
  const fetchUserDetail = async (userId: string) => {
    setUserDetailLoading(true);
    setUserDetailOpen(true);
    try {
      const response = await api.get(PLATFORM_ADMIN_ROUTES.USER_BY_ID(userId));
      setSelectedUserDetail(response.data.data);
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
      setUserDetailOpen(false);
    } finally {
      setUserDetailLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingAdmins();
    } else {
      fetchUsers();
    }
  }, [activeTab, fetchPendingAdmins, fetchUsers]);

  const handleApprove = async (admin: PendingCafeAdmin) => {
    setActionLoading(true);
    try {
      await api.post(PLATFORM_ADMIN_ROUTES.CAFE_ADMIN_APPROVE(admin.id));
      toast({ title: 'Success', description: `${admin.username}'s account has been approved.` });
      setPendingDetailOpen(false);
      fetchPendingAdmins();
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReminder = async (admin: PendingCafeAdmin) => {
    setActionLoading(true);
    try {
      await api.post(PLATFORM_ADMIN_ROUTES.CAFE_ADMIN_REMIND(admin.id));
      toast({ title: 'Reminder Sent', description: `A reminder email has been sent to ${admin.username}.` });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAdmin) return;
    setActionLoading(true);
    try {
      await api.post(PLATFORM_ADMIN_ROUTES.CAFE_ADMIN_REJECT(selectedAdmin.id), {
        reason: rejectReason || undefined,
      });
      toast({ title: 'Account Rejected', description: `${selectedAdmin.username}'s account has been rejected.` });
      setRejectDialogOpen(false);
      setPendingDetailOpen(false);
      setSelectedAdmin(null);
      setRejectReason('');
      fetchPendingAdmins();
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (admin: PendingCafeAdmin) => {
    setSelectedAdmin(admin);
    setRejectDialogOpen(true);
  };

  const handleToggleUserStatus = async (user: User | UserDetail) => {
    setActionLoading(true);
    try {
      const endpoint = user.isActive
        ? PLATFORM_ADMIN_ROUTES.USER_DEACTIVATE(user.id)
        : PLATFORM_ADMIN_ROUTES.USER_ACTIVATE(user.id);
      await api.post(endpoint);
      toast({ title: 'Success', description: `User ${user.isActive ? 'deactivated' : 'activated'} successfully.` });
      fetchUsers();
      if (selectedUserDetail?.id === user.id) {
        setSelectedUserDetail(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      }
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'PENDING':  return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'REJECTED': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:         return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PLATFORM_ADMIN': return <Badge className="bg-purple-100 text-purple-800">Platform Admin</Badge>;
      case 'CAFE_ADMIN':     return <Badge className="bg-blue-100 text-blue-800">Cafe Admin</Badge>;
      case 'USER':           return <Badge variant="outline">User</Badge>;
      default:               return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts, approve cafe admins, and control access.</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending
            {(awaitingApproval.length + incompleteOnboarding.length) > 0 && (
              <Badge variant="secondary" className="ml-1">{awaitingApproval.length + incompleteOnboarding.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users
          </TabsTrigger>
        </TabsList>

        {/* ── Pending Approvals Tab ── */}
        <TabsContent value="pending" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : awaitingApproval.length === 0 && incompleteOnboarding.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground text-center">No pending cafe admin applications.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Group 1 — Awaiting Approval */}
              {awaitingApproval.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Awaiting Approval</h3>
                    <Badge className="bg-blue-100 text-blue-800">{awaitingApproval.length}</Badge>
                    <p className="text-xs text-muted-foreground">— onboarding complete, ready to review</p>
                  </div>
                  {awaitingApproval.map((admin) => (
                    <PendingAdminCard
                      key={admin.id}
                      admin={admin}
                      actionLoading={actionLoading}
                      formatDate={formatDate}
                      onApprove={handleApprove}
                      onReject={openRejectDialog}
                      onViewDetails={(a) => { setSelectedPendingAdmin(a); setPendingDetailOpen(true); }}
                    />
                  ))}
                </div>
              )}

              {/* Group 2 — Incomplete Onboarding */}
              {incompleteOnboarding.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Incomplete Onboarding</h3>
                    <Badge className="bg-amber-100 text-amber-800">{incompleteOnboarding.length}</Badge>
                    <p className="text-xs text-muted-foreground">— registered but haven't set up their cafe yet</p>
                  </div>
                  {incompleteOnboarding.map((admin) => (
                    <Card key={admin.id} className="border-amber-200 bg-amber-50/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                              {admin.profileImageUrl
                                ? <img src={getUploadUrl(admin.profileImageUrl)} alt={admin.username} className="w-12 h-12 rounded-full object-cover" />
                                : <Users className="w-6 h-6 text-amber-600" />}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{admin.username}</CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {admin.email}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800">Setup Incomplete</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Registered: {formatDate(admin.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-amber-700 flex items-center gap-1 mb-4">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          This user registered but has not created their cafe profile yet. They can still log in to complete their setup.
                        </p>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendReminder(admin)}
                            disabled={actionLoading}
                          >
                            <Mail className="w-4 h-4 mr-2" /> Send Reminder
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRejectDialog(admin)}
                            disabled={actionLoading}
                          >
                            <UserX className="w-4 h-4 mr-2" /> Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ── All Users Tab ── */}
        <TabsContent value="all" className="space-y-4">
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
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border rounded-md bg-background">
              <option value="">All Roles</option>
              <option value="USER">Users</option>
              <option value="CAFE_ADMIN">Cafe Admins</option>
              <option value="PLATFORM_ADMIN">Platform Admins</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-md bg-background">
              <option value="">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <Button onClick={() => fetchUsers()}><Search className="w-4 h-4 mr-2" /> Search</Button>
          </div>

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
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Active</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">No users found</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-medium text-foreground">{user.username}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </td>
                            <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                            <td className="py-3 px-4">{getStatusBadge(user.accountStatus)}</td>
                            <td className="py-3 px-4">
                              {user.isActive
                                ? <CheckCircle className="w-5 h-5 text-green-500" />
                                : <XCircle className="w-5 h-5 text-red-500" />}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => fetchUserDetail(user.id)}>
                                  <Eye className="w-4 h-4 mr-1" /> View
                                </Button>
                                {user.role !== 'PLATFORM_ADMIN' && (
                                  <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(user)} disabled={actionLoading}>
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              {usersPagination && usersPagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t">
                  <Button variant="outline" size="sm" disabled={usersPagination.page <= 1} onClick={() => fetchUsers(usersPagination.page - 1)}>Previous</Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">Page {usersPagination.page} of {usersPagination.totalPages}</span>
                  <Button variant="outline" size="sm" disabled={!usersPagination.hasMore} onClick={() => fetchUsers(usersPagination.page + 1)}>Next</Button>
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Reject Dialog ── */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Cafe Admin Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedAdmin?.username}'s application? They will receive an email notification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <label className="text-sm font-medium text-foreground">Reason for rejection (optional)</label>
            <Textarea placeholder="Enter a reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialogOpen(false); setRejectReason(''); setSelectedAdmin(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Pending Admin Full Detail Dialog ── */}
      <Dialog open={pendingDetailOpen} onOpenChange={setPendingDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cafe Application — Full Details</DialogTitle>
            <DialogDescription>Everything about this pending cafe admin application.</DialogDescription>
          </DialogHeader>

          {selectedPendingAdmin && (
            <div className="space-y-6">
              {/* Admin header */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedPendingAdmin.profileImageUrl
                    ? <img src={getUploadUrl(selectedPendingAdmin.profileImageUrl)} alt={selectedPendingAdmin.username} className="w-16 h-16 rounded-full object-cover" />
                    : <Users className="w-8 h-8 text-primary" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPendingAdmin.username}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedPendingAdmin.email}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" /> Applied: {formatDate(selectedPendingAdmin.createdAt)}</p>
                  <div className="mt-2">
                    {selectedPendingAdmin.hasCompletedOnboarding
                      ? <Badge className="bg-green-100 text-green-800">Onboarding Complete</Badge>
                      : <Badge className="bg-amber-100 text-amber-800">Onboarding Incomplete</Badge>}
                  </div>
                </div>
              </div>

              {/* Full cafe details */}
              {selectedPendingAdmin.cafe
                ? <CafeDetailView cafe={selectedPendingAdmin.cafe} />
                : <p className="text-sm text-muted-foreground text-center py-4">No cafe created yet.</p>}
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setPendingDetailOpen(false)}>Close</Button>
            {selectedPendingAdmin && (
              <>
                <Button variant="outline" onClick={() => openRejectDialog(selectedPendingAdmin)} disabled={actionLoading}>
                  <UserX className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button onClick={() => handleApprove(selectedPendingAdmin)} disabled={actionLoading || !selectedPendingAdmin.hasCompletedOnboarding}>
                  <UserCheck className="w-4 h-4 mr-2" /> Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── User Detail Dialog ── */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Full information for this account.</DialogDescription>
          </DialogHeader>

          {userDetailLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedUserDetail ? (
            <div className="space-y-6">
              {/* Profile header */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedUserDetail.profileImageUrl
                    ? <img src={getUploadUrl(selectedUserDetail.profileImageUrl)} alt={selectedUserDetail.username} className="w-16 h-16 rounded-full object-cover" />
                    : <Users className="w-8 h-8 text-primary" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{selectedUserDetail.username}</h3>
                    {getRoleBadge(selectedUserDetail.role)}
                    {getStatusBadge(selectedUserDetail.accountStatus)}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {selectedUserDetail.email}
                  </p>
                </div>
              </div>

              {/* Account info */}
              <Section title="Account Information" icon={<Shield className="w-4 h-4" />}>
                <Row label="Membership" value={<span className="capitalize">{selectedUserDetail.membershipType || '—'}</span>} />
                <Row label="Email Verified">
                  {selectedUserDetail.isEmailVerified
                    ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Yes</span>
                    : <span className="flex items-center gap-1"><XCircle className="w-4 h-4 text-red-500" /> No</span>}
                </Row>
                <Row label="Active">
                  {selectedUserDetail.isActive
                    ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Yes</span>
                    : <span className="flex items-center gap-1"><XCircle className="w-4 h-4 text-red-500" /> No</span>}
                </Row>
                {selectedUserDetail.role === 'CAFE_ADMIN' && (
                  <Row label="Onboarding" value={selectedUserDetail.hasCompletedOnboarding ? 'Complete' : 'Incomplete'} />
                )}
                <Row label="Member Since" value={formatDate(selectedUserDetail.createdAt)} />
                <Row label="Last Login" value={formatDateTime(selectedUserDetail.lastLogin)} />
                {selectedUserDetail.updatedAt && (
                  <Row label="Last Updated" value={formatDateTime(selectedUserDetail.updatedAt)} />
                )}
              </Section>

              {/* Activity — regular users */}
              {selectedUserDetail._count && (
                <Section title="Activity" icon={<Activity className="w-4 h-4" />}>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Coffee className="w-9 h-9 text-primary p-2 bg-primary/10 rounded-lg" />
                      <div>
                        <p className="text-2xl font-bold">{selectedUserDetail._count.stamps}</p>
                        <p className="text-xs text-muted-foreground">Total Stamps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-9 h-9 text-primary p-2 bg-primary/10 rounded-lg" />
                      <div>
                        <p className="text-2xl font-bold">{selectedUserDetail._count.cafeCards}</p>
                        <p className="text-xs text-muted-foreground">Completed Cards</p>
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {/* Managed cafes — cafe admins */}
              {selectedUserDetail.role === 'CAFE_ADMIN' &&
                selectedUserDetail.managedCafes &&
                selectedUserDetail.managedCafes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4" /> Managed {selectedUserDetail.managedCafes.length > 1 ? `Cafes (${selectedUserDetail.managedCafes.length})` : 'Cafe'}
                  </h4>
                  <div className="space-y-5">
                    {selectedUserDetail.managedCafes.map(({ cafe }, i) => (
                      <div key={cafe.id}>
                        {selectedUserDetail.managedCafes!.length > 1 && (
                          <p className="text-xs font-medium text-muted-foreground mb-2">Cafe {i + 1}</p>
                        )}
                        <CafeDetailView cafe={cafe} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            {selectedUserDetail && selectedUserDetail.role !== 'PLATFORM_ADMIN' && (
              <Button variant="outline" onClick={() => handleToggleUserStatus(selectedUserDetail)} disabled={actionLoading}>
                {selectedUserDetail.isActive ? 'Deactivate User' : 'Activate User'}
              </Button>
            )}
            <Button onClick={() => setUserDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
