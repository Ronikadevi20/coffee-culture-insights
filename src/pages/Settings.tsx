import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { User, Bell, Shield, Palette, Users, Key, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const teamMembers = [
  { id: 1, name: 'Ahmed Khan', email: 'ahmed@coffeeculture.pk', role: 'Admin', avatar: 'AK' },
  { id: 2, name: 'Sara Malik', email: 'sara@coffeeculture.pk', role: 'Analyst', avatar: 'SM' },
  { id: 3, name: 'Bilal Ahmed', email: 'bilal@coffeeculture.pk', role: 'Viewer', avatar: 'BA' },
  { id: 4, name: 'Fatima Noor', email: 'fatima@coffeeculture.pk', role: 'Admin', avatar: 'FN' },
];

export default function Settings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    alerts: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your dashboard preferences</p>
        </div>

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
              <div className="space-y-6 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">AD</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Admin User" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@coffeeculture.pk" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Administrator" disabled />
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </ChartCard>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <ChartCard title="Notification Preferences" subtitle="Control how you receive updates">
              <div className="space-y-6 max-w-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary emails</p>
                    </div>
                    <Switch
                      checked={notifications.weekly}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">Immediate alerts for issues</p>
                    </div>
                    <Switch
                      checked={notifications.alerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, alerts: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
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

                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{member.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          member.role === 'Admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {member.role}
                        </span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
                        <p className="text-sm font-medium text-foreground">Chrome on MacOS</p>
                        <p className="text-xs text-muted-foreground">Karachi, Pakistan • Current session</p>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground">Karachi, Pakistan • 2 hours ago</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
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
