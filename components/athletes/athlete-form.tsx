'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Database } from '@/types/database.types'

type Athlete = Database['public']['Tables']['athletes']['Row']

interface AthleteFormProps {
  athlete?: Athlete
  action: (formData: FormData) => Promise<{ error?: string }>
}

export function AthleteForm({ athlete, action }: AthleteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Sync hidden inputs before form submission
    const gradeInput = document.getElementById('grade-value') as HTMLInputElement
    const experienceInput = document.getElementById('experienceLevel-value') as HTMLInputElement
    const statusInput = document.getElementById('status-value') as HTMLInputElement

    const formData = new FormData(e.currentTarget)
    
    // Ensure hidden inputs are included
    if (gradeInput) formData.set('grade', gradeInput.value)
    if (experienceInput) formData.set('experienceLevel', experienceInput.value)
    if (statusInput) formData.set('status', statusInput.value)

    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // If successful, redirect happens in server action
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{athlete ? 'Edit Athlete' : 'Add New Athlete'}</CardTitle>
        <CardDescription>
          {athlete ? 'Update athlete information' : 'Add a new athlete to your roster'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={athlete?.first_name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={athlete?.last_name}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={athlete?.date_of_birth || ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <input type="hidden" name="grade" id="grade-value" />
              <Select
                defaultValue={athlete?.grade || ''}
                onValueChange={(value) => {
                  const input = document.getElementById('grade-value') as HTMLInputElement
                  if (input) input.value = value
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="K">Kindergarten</SelectItem>
                  <SelectItem value="1">1st</SelectItem>
                  <SelectItem value="2">2nd</SelectItem>
                  <SelectItem value="3">3rd</SelectItem>
                  <SelectItem value="4">4th</SelectItem>
                  <SelectItem value="5">5th</SelectItem>
                  <SelectItem value="6">6th</SelectItem>
                  <SelectItem value="7">7th</SelectItem>
                  <SelectItem value="8">8th</SelectItem>
                  <SelectItem value="9">9th</SelectItem>
                  <SelectItem value="10">10th</SelectItem>
                  <SelectItem value="11">11th</SelectItem>
                  <SelectItem value="12">12th</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                defaultValue={athlete?.weight || ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightClass">Weight Class</Label>
              <Input
                id="weightClass"
                name="weightClass"
                placeholder="e.g., 106, 113, 120"
                defaultValue={athlete?.weight_class || ''}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <input type="hidden" name="experienceLevel" id="experienceLevel-value" />
              <Select
                defaultValue={athlete?.experience_level || ''}
                onValueChange={(value) => {
                  const input = document.getElementById('experienceLevel-value') as HTMLInputElement
                  if (input) input.value = value
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {athlete && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <input type="hidden" name="status" id="status-value" defaultValue={athlete.status} />
                <Select
                  defaultValue={athlete.status}
                  onValueChange={(value) => {
                    const input = document.getElementById('status-value') as HTMLInputElement
                    if (input) input.value = value
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : athlete ? 'Update Athlete' : 'Create Athlete'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
