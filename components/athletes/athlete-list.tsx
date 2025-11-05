'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database.types'
import { Search, Edit, Trash2 } from 'lucide-react'
import { deleteAthlete } from '@/app/dashboard/athletes/actions'
import { useRouter } from 'next/navigation'

type Athlete = Database['public']['Tables']['athletes']['Row']

interface AthleteListProps {
  athletes: Athlete[]
  canManage: boolean
}

export function AthleteList({ athletes, canManage }: AthleteListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [weightClassFilter, setWeightClassFilter] = useState<string>('all')
  const router = useRouter()

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch =
      athlete.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || athlete.status === statusFilter
    const matchesWeightClass =
      weightClassFilter === 'all' || athlete.weight_class === weightClassFilter

    return matchesSearch && matchesStatus && matchesWeightClass
  })

  const weightClasses = Array.from(
    new Set(athletes.map((a) => a.weight_class).filter(Boolean))
  )

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this athlete?')) {
      return
    }

    const result = await deleteAthlete(id)
    if (result?.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  if (athletes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No athletes yet</p>
          {canManage && (
            <Button asChild>
              <Link href="/dashboard/athletes/new">Add your first athlete</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={weightClassFilter} onValueChange={setWeightClassFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Weight Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Weight Classes</SelectItem>
            {weightClasses.map((wc) => (
              <SelectItem key={wc} value={wc || ''}>
                {wc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAthletes.map((athlete) => (
          <Card key={athlete.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {athlete.first_name} {athlete.last_name}
                  </h3>
                  {athlete.grade && (
                    <p className="text-sm text-muted-foreground">Grade {athlete.grade}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    athlete.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {athlete.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {athlete.weight_class && (
                  <div>
                    <span className="text-muted-foreground">Weight Class: </span>
                    <span className="font-medium">{athlete.weight_class}</span>
                  </div>
                )}
                {athlete.weight && (
                  <div>
                    <span className="text-muted-foreground">Weight: </span>
                    <span className="font-medium">{athlete.weight} lbs</span>
                  </div>
                )}
                {athlete.experience_level && (
                  <div>
                    <span className="text-muted-foreground">Experience: </span>
                    <span className="font-medium">{athlete.experience_level}</span>
                  </div>
                )}
              </div>

              {canManage && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/athletes/${athlete.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(athlete.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAthletes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No athletes match your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
