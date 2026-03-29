import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminGetStats, useAdminGetUsers, useAdminGetOrganizers, useApproveOrganizer, useRejectOrganizer, useAdminGetEvents, useAdminCreateAnnouncement } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Users, Building, Calendar as CalendarIcon, CheckCircle, XCircle, Megaphone, Activity } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { data: stats } = useAdminGetStats();
  const { data: users } = useAdminGetUsers();
  const { data: organizers } = useAdminGetOrganizers();
  const { data: events } = useAdminGetEvents();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveMut = useApproveOrganizer({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/organizers"] }) }
  });
  const rejectMut = useRejectOrganizer({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/organizers"] }) }
  });
  const announceMut = useAdminCreateAnnouncement({
    mutation: { onSuccess: () => { toast({ title: "Sent" }); setAnn({title:"", message:""}); } }
  });

  const [ann, setAnn] = useState({ title: "", message: "" });

  const chartData = [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Organizers', value: stats?.totalOrganizers || 0 },
    { name: 'Events', value: stats?.totalEvents || 0 },
    { name: 'Registrations', value: stats?.totalRegistrations || 0 },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Control Panel</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border border-border/50 h-auto p-1.5 rounded-xl shadow-sm mb-8 flex-wrap">
          <TabsTrigger value="overview" className="rounded-lg py-2 px-4"><Activity className="w-4 h-4 mr-2"/>Overview</TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg py-2 px-4"><Users className="w-4 h-4 mr-2"/>Users</TabsTrigger>
          <TabsTrigger value="organizers" className="rounded-lg py-2 px-4"><Building className="w-4 h-4 mr-2"/>Organizers</TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg py-2 px-4"><CalendarIcon className="w-4 h-4 mr-2"/>Events</TabsTrigger>
          <TabsTrigger value="announcements" className="rounded-lg py-2 px-4"><Megaphone className="w-4 h-4 mr-2"/>Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Users", val: stats?.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Total Organizers", val: stats?.totalOrganizers, icon: Building, color: "text-cyan-500", bg: "bg-cyan-500/10" },
              { label: "Pending Approvals", val: stats?.pendingOrganizers, icon: CheckCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Active Events", val: stats?.activeEvents, icon: CalendarIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((s, i) => (
              <Card key={i} className="p-6 border-border/50 shadow-md flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                  <h3 className="text-2xl font-bold">{s.val || 0}</h3>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="p-6 border-border/50 shadow-md h-96">
            <h3 className="text-lg font-bold mb-6">Platform Metrics</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <Card className="overflow-hidden border-border/50 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">College</th>
                    <th className="px-6 py-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {users?.map(u => (
                    <tr key={u.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">{u.fullName}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{u.collegeName || '-'}</td>
                      <td className="px-6 py-4 text-right">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="organizers" className="mt-0">
          <Card className="overflow-hidden border-border/50 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Contact Person</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {organizers?.map(o => (
                    <tr key={o.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">{o.organizationName}</td>
                      <td className="px-6 py-4">{o.name} <br/><span className="text-xs text-muted-foreground">{o.email}</span></td>
                      <td className="px-6 py-4">
                        {o.isApproved ? <span className="text-emerald-600 font-medium">Approved</span> : 
                         o.isRejected ? <span className="text-red-600 font-medium">Rejected</span> : 
                         <span className="text-amber-600 font-medium">Pending</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {!o.isApproved && !o.isRejected && (
                          <>
                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => approveMut.mutate({id: o.id})}><CheckCircle className="w-4 h-4 mr-1"/> Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectMut.mutate({id: o.id})}><XCircle className="w-4 h-4 mr-1"/> Reject</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <Card className="overflow-hidden border-border/50 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Organizer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {events?.map(e => (
                    <tr key={e.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">{e.name}</td>
                      <td className="px-6 py-4">{e.organizationName || e.organizerName}</td>
                      <td className="px-6 py-4">{format(new Date(e.eventDate), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 capitalize">{e.status.replace("_", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="mt-0">
          <Card className="p-8 max-w-2xl border-border/50 shadow-lg">
            <h3 className="text-xl font-bold mb-6">Platform-Wide Broadcast</h3>
            <form onSubmit={(e) => { e.preventDefault(); announceMut.mutate({data: ann}); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={ann.title} onChange={e=>setAnn({...ann, title: e.target.value})} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea required value={ann.message} onChange={e=>setAnn({...ann, message: e.target.value})} className="h-32" />
              </div>
              <Button type="submit" className="h-12 w-full" disabled={announceMut.isPending}>
                Send to All Users
              </Button>
            </form>
          </Card>
        </TabsContent>

      </Tabs>
    </DashboardLayout>
  );
}
