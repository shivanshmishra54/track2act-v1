import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User, Shield, MapPin, Bell, CreditCard, Database, Globe, Lock, Palette, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsPage() {
  return (
    <div className="flex-1 p-6 flex flex-col h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-xl text-muted-foreground">Customize your Track2Act experience and account preferences</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@company.com" />
            </div>
            <Button className="w-full">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <Label className="flex flex-col">
                <span>Two-Factor Authentication</span>
                <span className="text-sm text-muted-foreground">Additional security layer</span>
              </Label>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Enter new password" />
            </div>
            <Button variant="outline" className="w-full">Update Security</Button>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Email alerts for new shipments</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Push notifications for task updates</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Weekly summary reports</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Map View</Label>
                <Select defaultValue="satellite">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="UTC">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Units</Label>
                <Select defaultValue="metric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric</SelectItem>
                    <SelectItem value="imperial">Imperial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="text-center text-muted-foreground py-12">
          <Settings className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Account Settings Ready</h3>
          <p className="max-w-2xl mx-auto">
            Full user preferences, security settings, notification controls, API keys, 
            integration settings, billing management, and theme customizations available here.
          </p>
        </div>
      </div>
    </div>
  )
}
