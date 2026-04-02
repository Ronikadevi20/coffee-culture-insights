import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  RefreshCw,
  Search,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Send,
  Users,
  Filter,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import api, { getErrorMessage } from '@/lib/api';
import { SUPPORT_ROUTES, PLATFORM_ADMIN_ROUTES } from '@/config/api.routes';

// ─── Types ───────────────────────────────────────────────────────────────────

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: string;
  category?: string;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface TicketStats {
  total: number;
  byStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const getStatusBadge = (status: TicketStatus) => {
  switch (status) {
    case 'OPEN':
      return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
    case 'IN_PROGRESS':
      return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
    case 'RESOLVED':
      return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
    case 'CLOSED':
      return <Badge className="bg-gray-100 text-gray-600">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
    case 'HIGH':
      return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
    case 'MEDIUM':
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    case 'LOW':
      return <Badge className="bg-gray-100 text-gray-600">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case 'OPEN':
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
    case 'IN_PROGRESS':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'RESOLVED':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'CLOSED':
      return <XCircle className="w-4 h-4 text-gray-400" />;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SupportManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tickets');
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Ticket list state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<TicketStats | null>(null);

  // Ticket detail panel
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('');

  // Bulk email state
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [bulkAudience, setBulkAudience] = useState<'ALL' | 'ALL_USERS' | 'CAFE_ADMINS'>('ALL');
  const [bulkLoading, setBulkLoading] = useState(false);

  // ── Fetch tickets ────────────────────────────────────────────────────────

  const fetchTickets = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params: Record<string, string> = {
          page: String(page),
          limit: '20',
        };
        if (statusFilter) params.status = statusFilter;

        const response = await api.get(SUPPORT_ROUTES.TICKETS, { params });
        setTickets(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        toast({
          title: 'Error',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, statusFilter]
  );

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get(SUPPORT_ROUTES.TICKET_STATS);
      setStats(response.data.data);
    } catch {
      // stats are optional
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
      fetchStats();
    }
  }, [activeTab, fetchTickets, fetchStats]);

  // ── Open ticket detail ───────────────────────────────────────────────────

  const openTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyMessage('');
    setNewStatus('');
    setDetailOpen(true);
  };

  // ── Send reply ───────────────────────────────────────────────────────────

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setActionLoading(true);
    try {
      const payload: Record<string, string> = { message: replyMessage };
      if (newStatus) payload.status = newStatus;

      const response = await api.post(
        SUPPORT_ROUTES.TICKET_REPLY(selectedTicket.id),
        payload
      );

      toast({
        title: 'Reply sent',
        description: 'Your response has been emailed to the user.',
      });

      // Update ticket in list
      const updated: SupportTicket = response.data.data;
      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setSelectedTicket(updated);
      setReplyMessage('');
      setNewStatus('');
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

  // ── Update status only ───────────────────────────────────────────────────

  const handleStatusUpdate = async (ticket: SupportTicket, status: TicketStatus) => {
    setActionLoading(true);
    try {
      const response = await api.put(SUPPORT_ROUTES.TICKET_UPDATE(ticket.id), {
        status,
      });

      const updated: SupportTicket = response.data.data;
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      if (selectedTicket?.id === updated.id) setSelectedTicket(updated);

      toast({
        title: 'Status updated',
        description: `Ticket marked as ${status.replace('_', ' ').toLowerCase()}.`,
      });
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

  // ── Bulk email ───────────────────────────────────────────────────────────

  const handleSendBulkEmail = async () => {
    if (!bulkSubject.trim() || !bulkMessage.trim()) {
      toast({
        title: 'Validation error',
        description: 'Subject and message are required.',
        variant: 'destructive',
      });
      return;
    }

    setBulkLoading(true);
    try {
      const response = await api.post(PLATFORM_ADMIN_ROUTES.SEND_BULK_EMAIL, {
        subject: bulkSubject,
        message: bulkMessage,
        audience: bulkAudience,
      });

      const { sent, failed, total } = response.data.data;
      toast({
        title: 'Bulk email sent',
        description: `${sent}/${total} emails delivered${failed > 0 ? `, ${failed} failed` : ''}.`,
      });

      setBulkSubject('');
      setBulkMessage('');
      setBulkAudience('ALL');
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setBulkLoading(false);
    }
  };

  // ── Filtered tickets for local search display ────────────────────────────

  const displayedTickets = searchQuery
    ? tickets.filter(
        (t) =>
          t.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tickets;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Support Management
          </h1>
          <p className="text-muted-foreground">
            Manage user support tickets and send bulk communications.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchTickets();
            fetchStats();
          }}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Open</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.byStatus.open}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.byStatus.inProgress}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Resolved</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.byStatus.resolved}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="bulk-email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Bulk Email
          </TabsTrigger>
        </TabsList>

        {/* ── Tickets Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <Button onClick={() => fetchTickets()} size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Ticket List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : displayedTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No tickets found
                </h3>
                <p className="text-muted-foreground text-center">
                  {statusFilter
                    ? `No ${statusFilter.toLowerCase().replace('_', ' ')} tickets at this time.`
                    : 'No support tickets have been submitted yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          User
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Subject
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Created
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => openTicket(ticket)}
                        >
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs text-muted-foreground">
                              #{ticket.id.slice(0, 8)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {ticket.user.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {ticket.user.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-foreground max-w-[220px] truncate">
                              {ticket.subject}
                            </p>
                            <p className="text-xs text-muted-foreground max-w-[220px] truncate">
                              {ticket.description}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-muted-foreground capitalize">
                              {ticket.category || 'general'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {getPriorityBadge(ticket.priority)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(ticket.status)}
                              {getStatusBadge(ticket.status)}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openTicket(ticket);
                              }}
                            >
                              View
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 p-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchTickets(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasMore}
                    onClick={() => fetchTickets(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        {/* ── Bulk Email Tab ───────────────────────────────────────────────── */}
        <TabsContent value="bulk-email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Send Bulk Email
              </CardTitle>
              <CardDescription>
                Compose and send an email to all users or a specific group.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Audience */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Audience
                </label>
                <div className="flex flex-wrap gap-3">
                  {(
                    [
                      { value: 'ALL', label: 'All Active Users', icon: Users },
                      { value: 'ALL_USERS', label: 'Regular Users Only', icon: Users },
                      { value: 'CAFE_ADMINS', label: 'Cafe Admins Only', icon: Users },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setBulkAudience(value)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        bulkAudience === value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Subject
                </label>
                <Input
                  placeholder="Email subject..."
                  value={bulkSubject}
                  onChange={(e) => setBulkSubject(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Write your message here..."
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Plain text is supported. Line breaks will be preserved.
                </p>
              </div>

              {/* Preview summary */}
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground mb-1">Summary</p>
                <p className="text-sm text-muted-foreground">
                  Sending to:{' '}
                  <strong>
                    {bulkAudience === 'ALL'
                      ? 'All active users'
                      : bulkAudience === 'CAFE_ADMINS'
                      ? 'All active cafe admins'
                      : 'All active regular users'}
                  </strong>
                </p>
                {bulkSubject && (
                  <p className="text-sm text-muted-foreground">
                    Subject: <strong>{bulkSubject}</strong>
                  </p>
                )}
              </div>

              <Button
                onClick={handleSendBulkEmail}
                disabled={bulkLoading || !bulkSubject.trim() || !bulkMessage.trim()}
                className="w-full sm:w-auto"
              >
                {bulkLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {bulkLoading ? 'Sending...' : 'Send Email'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Ticket Detail Dialog ─────────────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-lg">
                    #{selectedTicket.id.slice(0, 8)} — {selectedTicket.subject}
                  </DialogTitle>
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <DialogDescription>
                  Submitted by {selectedTicket.user.username} &middot;{' '}
                  {formatDate(selectedTicket.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* User info */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                  <p className="text-sm font-medium text-foreground">User Information</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Name:</strong> {selectedTicket.user.username}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedTicket.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    <strong>Category:</strong> {selectedTicket.category || 'general'}
                  </p>
                </div>

                {/* Full message */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Message
                  </p>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>

                {/* Resolution (if any) */}
                {selectedTicket.resolution && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Resolution Notes
                    </p>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 whitespace-pre-wrap">
                        {selectedTicket.resolution}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status update */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Update Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as TicketStatus[]).map(
                      (s) => (
                        <Button
                          key={s}
                          variant={selectedTicket.status === s ? 'default' : 'outline'}
                          size="sm"
                          disabled={actionLoading || selectedTicket.status === s}
                          onClick={() => handleStatusUpdate(selectedTicket, s)}
                        >
                          {s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {/* Reply area */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Send Reply via Email
                  </p>
                  <Textarea
                    placeholder={`Reply to ${selectedTicket.user.username}...`}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={5}
                    className="mb-3"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">
                        Also set status:
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) =>
                          setNewStatus(e.target.value as TicketStatus | '')
                        }
                        className="px-3 py-1.5 border rounded-md bg-background text-sm"
                      >
                        <option value="">No change</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                    <Button
                      onClick={handleSendReply}
                      disabled={actionLoading || !replyMessage.trim()}
                    >
                      {actionLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportManagement;
