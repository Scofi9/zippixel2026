"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type Me = {
  fullName: string;
  email: string;
  prefs: {
    emailNotifications: boolean;
    autoDeleteOriginals: boolean;
    webhookNotifications: boolean;
  };
  apiKeyMasked: string;
  hasApiKey: boolean;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function SettingsClient() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);
  const [fullName, setFullName] = useState("");
  const [prefs, setPrefs] = useState<Me["prefs"]>({
    emailNotifications: true,
    autoDeleteOriginals: false,
    webhookNotifications: false,
  });
  const [apiKeyMasked, setApiKeyMasked] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [regenKey, setRegenKey] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/settings/me", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as Me | null;
      if (data) {
        setMe(data);
        setFullName(data.fullName ?? "");
        setPrefs(data.prefs);
        setApiKeyMasked(data.apiKeyMasked || "");
      }
      setLoading(false);
    })();
  }, []);

  const email = me?.email ?? "";

  const canSaveProfile = useMemo(() => {
    if (!me) return false;
    return fullName.trim().length >= 2 && fullName.trim() !== (me.fullName ?? "");
  }, [me, fullName]);

  const saveProfile = async () => {
    if (!canSaveProfile) return;
    setSavingProfile(true);
    const res = await fetch("/api/settings/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName }),
    });
    if (res.ok) {
      setMe((m) => (m ? { ...m, fullName } : m));
    }
    setSavingProfile(false);
  };

  const savePrefs = async () => {
    setSavingPrefs(true);
    const res = await fetch("/api/settings/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    if (res.ok) {
      setMe((m) => (m ? { ...m, prefs } : m));
    }
    setSavingPrefs(false);
  };

  const ensureApiKey = async () => {
    const res = await fetch("/api/settings/api-key", { cache: "no-store" });
    const j = await res.json().catch(() => null);
    if (j?.apiKeyMasked) setApiKeyMasked(j.apiKeyMasked);
  };

  const regenerate = async () => {
    setRegenKey(true);
    const res = await fetch("/api/settings/api-key/regenerate", { method: "POST" });
    const j = await res.json().catch(() => null);
    if (j?.apiKeyMasked) setApiKeyMasked(j.apiKeyMasked);
    // tiny delay so it feels intentional
    await sleep(250);
    setRegenKey(false);
  };

  const copyKey = async () => {
    // We only show masked key in UI for safety.
    await navigator.clipboard.writeText(apiKeyMasked);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-40 rounded-md bg-muted animate-pulse" />
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        <div className="h-28 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Profile */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} readOnly />
              <div className="text-xs text-muted-foreground">Email is managed by Clerk.</div>
            </div>
          </div>
          <Button className="mt-6" size="sm" onClick={saveProfile} disabled={!canSaveProfile || savingProfile}>
            {savingProfile ? "Saving…" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">API Key</CardTitle>
          <CardDescription>Authenticate API requests from your apps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input readOnly value={apiKeyMasked || "—"} className="font-mono text-sm" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => (apiKeyMasked ? copyKey() : ensureApiKey())}>
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={regenerate} disabled={regenKey}>
                {regenKey ? "Regenerating…" : "Regenerate"}
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            For safety we display a masked key. Use Copy if you need it.
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Fine-tune your experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">Email notifications</div>
                <div className="text-xs text-muted-foreground">Receive product updates and usage summaries.</div>
              </div>
              <Switch
                checked={prefs.emailNotifications}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, emailNotifications: v }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">Auto-delete originals</div>
                <div className="text-xs text-muted-foreground">Delete originals after compression (local only).</div>
              </div>
              <Switch
                checked={prefs.autoDeleteOriginals}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, autoDeleteOriginals: v }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">Webhook notifications</div>
                <div className="text-xs text-muted-foreground">Send a webhook when compression completes (coming soon).</div>
              </div>
              <Switch
                checked={prefs.webhookNotifications}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, webhookNotifications: v }))}
              />
            </div>
            <div className="pt-2">
              <Button size="sm" onClick={savePrefs} disabled={savingPrefs}>
                {savingPrefs ? "Saving…" : "Save preferences"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
