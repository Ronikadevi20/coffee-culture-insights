import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { User, Bell, Shield, Users, Key, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  useUserProfile, 
  useUpdateProfile, 
  useUserPreferences, 
  useUpdatePreferences 
} from '@/hooks/useUsers';
import { useCafeAdmins } from '@/hooks/usePlatformAdmin';

// Skeleton component
const SettingsSkeleton = () => (
  <div className="space-y-6 max-w-xl animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-muted" />
      <div className="w-24 h-8 bg-muted rounded" />
    </div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="w-24 h-4 bg-muted rounded" />
          <div className="w-full h-10 bg-muted rounded" />
        </div>
      ))}
    </div>
    <div className="w-32 h-10 bg-muted rounded" />
  </div>
);

const TeamMemberSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div>
        <div className="w-32 h-5 bg-muted rounded mb-1" />
        <div className="w-40 h-4 bg-muted rounded" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-16 h-6 bg-muted rounded-full" />
      <div className="w-12 h-8 bg-muted rounded" />
    </div>
  </div>
);

export default function Settings() {
  const { toast } = useToast();
  
  // Fetch user profile and preferences
  const profile = useUserProfile();
  const preferences = useUserPreferences();
  const updateProfile = useUpdateProfile();
  const updatePreferences = useUpdatePreferences();
  const cafeAdmins = useCafeAdmins();

  // Local form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    profileImageUrl: '',
  });
  
  const [notificationState, setNotificationState] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  // Initialize form when data loads
  useState(() => {
    if (profile.data) {
      setProfileForm({
        username: profile.data.username || '',
        profileImageUrl: profile.data.profileImageUrl || '',
      });
    }
  });

  useState(() => {
    if (preferences.data) {
      setNotificationState({
        emailNotifications: preferences.data.emailNotifications,
        pushNotifications: preferences.data.pushNotifications,
        smsNotifications: preferences.data.smsNotifications,
      });
    }
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        username: profileForm.username || undefined,
        profileImageUrl: profileForm.profileImageUrl || undefined,
      });
      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences.mutateAsync(notificationState);
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = profile.isLoading || preferences.isLoading;
  const isError = profile.isError || preferences.isError;

  // Get initials for avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your dashboard preferences</p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Error State */}
        {isError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive">Failed to load settings. Please refresh the page.</p>
            <Button 
              onClick={() => {
                profile.refetch();
                preferences.refetch();
              }} 
              variant="outline" 
              size="sm" 
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ChartCard title="Profile Settings" subtitle="Manage your account information">
              {profile.isLoading ? (
                <SettingsSkeleton />
              ) : (
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {getInitials(profile.data?.username, profile.data?.email)}
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={profileForm.username || profile.data?.username || ''} 
                        onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.data?.email || ''} 
                        disabled 
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={profile.data?.role || 'User'} 
                        disabled 
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveProfile} 
                    className="gap-2"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </ChartCard>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <ChartCard title="Notification Preferences" subtitle="Control how you receive updates">
              {preferences.isLoading ? (
                <SettingsSkeleton />
              ) : (
                <div className="space-y-6 max-w-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={notificationState.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationState(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Browser push notifications</p>
                      </div>
                      <Switch
                        checked={notificationState.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationState(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Text message alerts</p>
                      </div>
                      <Switch
                        checked={notificationState.smsNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationState(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSavePreferences} 
                    className="gap-2"
                    disabled={updatePreferences.isPending}
                  >
                    {updatePreferences.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Preferences
                  </Button>
                </div>
              )}
            </ChartCard>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <ChartCard title="Team Members" subtitle="Manage dashboard access">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Users className="w-4 h-4" />
                    Invite Member
                  </Button>
                </div>

                {cafeAdmins.isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TeamMemberSkeleton key={i} />
                    ))}
                  </div>
                ) : cafeAdmins.data?.data && cafeAdmins.data.data.length > 0 ? (
                  <div className="space-y-3">
                    {cafeAdmins.data.data.map((admin, index) => (
                      <motion.div
                        key={admin.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {getInitials(admin.user.username, admin.user.email)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{admin.user.username}</p>
                            <p className="text-sm text-muted-foreground">{admin.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Cafe Admin
                          </span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No team members found</p>
                    <p className="text-sm text-muted-foreground">Invite team members to manage your cafes</p>
                  </div>
                )}
              </div>
            </ChartCard>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <ChartCard title="Security Settings" subtitle="Manage your account security">
              <div className="space-y-6 max-w-xl">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="w-5 h-5 text-primary" />
                    <Label className="text-base">Change Password</Label>
                  </div>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button size="sm">Update Password</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Label className="text-base mb-2 block">Active Sessions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Current Browser</p>
                        <p className="text-xs text-muted-foreground">Current session</p>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}