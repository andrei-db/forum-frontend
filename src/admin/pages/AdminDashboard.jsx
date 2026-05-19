import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts";
import {
  Users,
  MessageCircle,
  FileText,
  Folder,
  Activity,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await api("/dashboard-data");
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="p-8 text-neutral-400">
        Loading dashboard...
      </section>
    );
  }

  if (!data) {
    return (
      <section className="p-8 text-red-400">
        Failed to load dashboard.
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-300 p-4 md:p-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-8">
        <div>
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">
            Admin Control Panel
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-neutral-100 mt-1">
            Forum Overview
          </h1>
          <p className="text-neutral-500 mt-2">
            Monitor activity, members, forums and community growth.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="w-fit flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 font-bold"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard icon={<Users />} label="Members" value={data.stats.members} trend="+12%" />
        <StatCard icon={<FileText />} label="Topics" value={data.stats.topics} trend="+8%" />
        <StatCard icon={<MessageCircle />} label="Posts" value={data.stats.posts} trend="+21%" />
        <StatCard icon={<Folder />} label="Forums" value={data.stats.forums} trend="Stable" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mb-6">
        <Panel title="Community Activity" subtitle="Posts and topics from the last 7 days">
          <div className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.activity}>
                <XAxis dataKey="day" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip
                  contentStyle={{
                    background: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.18}
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="topics"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.14}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Groups" subtitle="Member distribution by group">
          <div className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.groups}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                />
                <Tooltip
                  contentStyle={{
                    background: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_1fr] gap-6">
        <Panel title="Most Active Forums" subtitle="Forums ranked by post activity">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topForums}>
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip
                  contentStyle={{
                    background: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="posts" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Quick Actions" subtitle="Common admin shortcuts">
          <div className="grid gap-3">
            <QuickAction to="/admin/forums/add" title="Create Forum" icon={<Folder />} />
            <QuickAction to="/admin/members/add" title="Create Member" icon={<Users />} />
            <QuickAction to="/admin/groups" title="Manage Groups" icon={<ShieldCheck />} />
            <QuickAction to="/admin/forums" title="Manage Forums" icon={<Activity />} />
          </div>
        </Panel>

        <Panel title="Recent Topics" subtitle="Newest community discussions">
          <div className="space-y-2">
            {data.recentTopics.map((topic) => (
              <ActivityRow
                key={topic.id}
                title={topic.title}
                subtitle={topic.author?.username}
                color={topic.author?.group?.color}
                date={topic.createdAt}
                to={`/topics/${topic.id}`}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Recent Posts" subtitle="Latest replies across the forum">
          <div className="space-y-2">
            {data.recentPosts.map((post) => (
              <ActivityRow
                key={post.id}
                title={post.topic?.title || "Untitled topic"}
                subtitle={post.author?.username}
                color={post.author?.group?.color}
                date={post.createdAt}
                to={`/topics/${post.topic?.id}`}
              />
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-5 shadow-xl">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-blue-400">
          {icon}
        </div>

        <div className="flex items-center gap-1 text-xs text-green-400 font-bold">
          <TrendingUp size={14} />
          {trend}
        </div>
      </div>

      <p className="relative mt-5 text-sm text-neutral-500 font-bold uppercase">
        {label}
      </p>
      <p className="relative text-3xl font-black text-neutral-100 mt-1">
        {value}
      </p>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-800">
        <h2 className="text-lg font-black text-neutral-100">{title}</h2>
        {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function QuickAction({ to, icon, title }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 p-4 transition"
    >
      <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
        {icon}
      </div>
      <span className="font-bold text-neutral-100">{title}</span>
    </Link>
  );
}

function ActivityRow({ title, subtitle, color, date, to }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-neutral-800 transition border border-transparent hover:border-neutral-700"
    >
      <div className="min-w-0">
        <p className="font-bold text-neutral-100 truncate">{title}</p>
        <p className="text-sm text-neutral-500">
          by{" "}
          <span className={`${color || "text-neutral-300"} font-bold`}>
            {subtitle || "Unknown"}
          </span>
        </p>
      </div>

      <span className="text-xs text-neutral-500 shrink-0">
        {date ? new Date(date).toLocaleDateString() : "—"}
      </span>
    </Link>
  );
}