import { createServerComponentClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Users, TrendingUp, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return null
  }

  // Get athlete count
  const { count: athleteCount } = await supabase
    .from('athletes')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', profile.organization_id)
    .eq('status', 'active')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your wrestling club
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Active Athletes"
          value={athleteCount || 0}
          icon={Users}
          description="Total active athletes in your club"
        />
        <StatsCard
          title="Tournaments"
          value={0}
          icon={Calendar}
          description="Upcoming tournaments"
        />
        <StatsCard
          title="Win Rate"
          value="0%"
          icon={TrendingUp}
          description="Season win rate"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Add Athlete</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a new athlete to your roster
            </p>
            <a
              href="/dashboard/athletes"
              className="text-sm text-primary hover:underline"
            >
              Go to Athletes →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Manage Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update your organization settings
            </p>
            <a
              href="/dashboard/settings"
              className="text-sm text-primary hover:underline"
            >
              Go to Settings →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
