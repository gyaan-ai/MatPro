'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/helpers'
import { Users, Settings, CreditCard, BarChart3, LayoutDashboard } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Athletes', href: '/dashboard/athletes', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
]

export function Sidebar({ organizationName }: { organizationName: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">MP</span>
          </div>
          <span className="font-bold text-lg">MatPro.ai</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-2 truncate">
          {organizationName}
        </p>
      </div>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
