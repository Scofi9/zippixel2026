"use client";

import * as React from "react";
import { MessageSquare, Bug, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n-provider";

export function SupportWidget() {
  const [open, setOpen] = React.useState(false);
  const { t } = useI18n();

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[60]">
        <Button
          onClick={() => setOpen(true)}
          className="h-12 rounded-full px-4 shadow-lg hover:shadow-xl"
          aria-label={t("support_button")}
        >
          <MessageSquare className="mr-2 size-4" />
          <span className="text-sm font-semibold">{t("support_button")}</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-border/60 bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{t("support_title")}</span>
            </DialogTitle>
            <DialogDescription>{t("support_desc")}</DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid gap-3">
            <Button variant="secondary" className="justify-start" onClick={() => setOpen(false)}>
              <Mail className="mr-2 size-4" />
              {t("support_contact")}
              <span className="ml-auto text-xs text-muted-foreground">soon</span>
            </Button>

            <Button variant="secondary" className="justify-start" onClick={() => setOpen(false)}>
              <Bug className="mr-2 size-4" />
              {t("support_report")}
              <span className="ml-auto text-xs text-muted-foreground">soon</span>
            </Button>

            <Button variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
              <X className="mr-2 size-4" />
              {t("support_close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
