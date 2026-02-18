import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = { title: "Admin — Settings" }

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform configuration and settings.</p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">General Settings</CardTitle>
          <CardDescription>Core platform configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="ZipPixel" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@zippixel.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input id="maxFileSize" type="number" defaultValue="50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="maxBatch">Max Batch Size</Label>
              <Input id="maxBatch" type="number" defaultValue="100" />
            </div>
          </div>
          <Button className="mt-6" size="sm">Save Settings</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Feature Flags</CardTitle>
          <CardDescription>Toggle platform features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">AVIF Support</div>
                <div className="text-xs text-muted-foreground">Enable AVIF format for all users.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">API Rate Limiting</div>
                <div className="text-xs text-muted-foreground">Enable rate limiting on the public API.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Maintenance Mode</div>
                <div className="text-xs text-muted-foreground">Show maintenance page to all users.</div>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">New User Registration</div>
                <div className="text-xs text-muted-foreground">Allow new user sign-ups.</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
