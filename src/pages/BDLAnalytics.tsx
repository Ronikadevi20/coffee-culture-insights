import { Camera, Globe, Lock, Users, Clock, TrendingUp, Heart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { motion } from 'framer-motion';

const postsByHour = [
  { hour: '6am', posts: 12 },
  { hour: '8am', posts: 45 },
  { hour: '10am', posts: 89 },
  { hour: '12pm', posts: 178 },
  { hour: '2pm', posts: 156 },
  { hour: '4pm', posts: 134 },
  { hour: '6pm', posts: 245 },
  { hour: '8pm', posts: 312 },
  { hour: '10pm', posts: 189 },
];

const visibilityData = [
  { name: 'Public', value: 45, color: 'hsl(24, 35%, 48%)' },
  { name: 'Friends Only', value: 35, color: 'hsl(28, 60%, 55%)' },
  { name: 'Private', value: 20, color: 'hsl(32, 44%, 72%)' },
];

const topCafes = [
  { name: 'The Roastery', posts: 342, likes: 2840 },
  { name: 'Café Brew', posts: 289, likes: 2156 },
  { name: 'Bean Scene', posts: 234, likes: 1892 },
  { name: 'Mocha House', posts: 198, likes: 1654 },
  { name: 'Latte Art', posts: 167, likes: 1342 },
];

const weekdayData = [
  { day: 'Mon', posts: 1245 },
  { day: 'Tue', posts: 1180 },
  { day: 'Wed', posts: 1320 },
  { day: 'Thu', posts: 1456 },
  { day: 'Fri', posts: 1890 },
  { day: 'Sat', posts: 2340 },
  { day: 'Sun', posts: 2120 },
];

const recentPosts = [
  { id: 1, cafe: 'The Roastery', time: '2 min ago', visibility: 'public', likes: 24 },
  { id: 2, cafe: 'Café Brew', time: '5 min ago', visibility: 'friends', likes: 18 },
  { id: 3, cafe: 'Bean Scene', time: '8 min ago', visibility: 'public', likes: 32 },
  { id: 4, cafe: 'Mocha House', time: '12 min ago', visibility: 'private', likes: 0 },
  { id: 5, cafe: 'Latte Art', time: '15 min ago', visibility: 'public', likes: 45 },
];

const BDLAnalytics = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">BDL Analytics</h1>
        <p className="text-muted-foreground">BeReal-style photo sharing insights and engagement metrics.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Posts Today" value="1,892" change={12.4} icon={<Camera className="w-6 h-6" />} delay={0} />
        <MetricCard title="Public Posts" value="852" change={8.2} icon={<Globe className="w-6 h-6" />} delay={0.05} />
        <MetricCard title="Friends Only" value="662" change={15.3} icon={<Users className="w-6 h-6" />} delay={0.1} />
        <MetricCard title="Private Posts" value="378" change={-3.1} icon={<Lock className="w-6 h-6" />} delay={0.15} />
        <MetricCard title="Avg Post Time" value="7:42 PM" change={0} icon={<Clock className="w-6 h-6" />} delay={0.2} />
        <MetricCard title="Total Likes" value="12.4K" change={22.8} icon={<Heart className="w-6 h-6" />} delay={0.25} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Posts Timeline" subtitle="BDL posts throughout the day" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={postsByHour}>
              <defs>
                <linearGradient id="postsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis dataKey="hour" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="posts" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#postsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekday vs Weekend" subtitle="Posting patterns by day of week" delay={0.35}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weekdayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Bar dataKey="posts" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Visibility Distribution" subtitle="Post privacy breakdown" delay={0.4}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={visibilityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {visibilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {visibilityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Most Photographed Cafés" subtitle="Top locations for BDL posts" delay={0.45} className="lg:col-span-2">
          <div className="space-y-3">
            {topCafes.map((cafe, index) => (
              <motion.div
                key={cafe.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-foreground">{cafe.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{cafe.posts}</p>
                    <p className="text-xs text-muted-foreground">posts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3 text-accent" />
                      {cafe.likes.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">likes</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Posts Feed */}
      <ChartCard title="Recent BDL Posts" subtitle="Live feed of latest posts" delay={0.5}>
        <div className="space-y-3">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.cafe}</p>
                  <p className="text-sm text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`badge-coffee ${post.visibility === 'public' ? 'bg-primary/10 text-primary' : post.visibility === 'friends' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                  {post.visibility === 'public' && <Globe className="w-3 h-3 mr-1" />}
                  {post.visibility === 'friends' && <Users className="w-3 h-3 mr-1" />}
                  {post.visibility === 'private' && <Lock className="w-3 h-3 mr-1" />}
                  {post.visibility}
                </span>
                {post.likes > 0 && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ChartCard>
    </DashboardLayout>
  );
};

export default BDLAnalytics;
