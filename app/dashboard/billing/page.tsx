import type { Metadata } from "next"
import { Check, CreditCard, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = { title: "Billing" }

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and billing.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-primary/30 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Pro Plan</CardTitle>
              <CardDescription>$12/month - Renews March 1, 2026</CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Images used this month</span>
                <span className="font-mono text-foreground">2,847 / 5,000</span>
              </div>
              <Progress value={57} className="mt-2 h-2" />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">Change Plan</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                <CreditCard className="size-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Visa ending in 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/2027</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {[
              { date: "Feb 1, 2026", amount: "$12.00", status: "Paid" },
              { date: "Jan 1, 2026", amount: "$12.00", status: "Paid" },
              { date: "Dec 1, 2025", amount: "$12.00", status: "Paid" },
            ].map((invoice) => (
              <div key={invoice.date} className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{invoice.date}</span>
                  <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
