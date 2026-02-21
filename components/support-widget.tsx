"use client";

import * as React from "react";
import { MessageSquare, Bug, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n-provider";

/**
 * Support widget button + dialog.
 * Render it inline (e.g., in a footer). No fixed positioning here on purpose.
 */
export function SupportWidget() {
  const [open, setOpen] = React.useState(false);
  const { t } = useI18n();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-11 rounded-full px-4 shadow-md hover:shadow-lg"
        aria-label={t("support_button")}
        variant="secondary"
      >
        <MessageSquare className="mr-2 size-4" />
        <span className="text-sm font-semibold">{t("support_button")}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-border/60 bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>{t("support_title")}</DialogTitle>
            <DialogDescription>{t("support_desc")}</DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid gap-2">
            <Button variant="outline" className="justify-start" disabled>
              <Mail className="mr-2 size-4" />
              {t("support_email")}
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              <Bug className="mr-2 size-4" />
              {t("support_report")}
            </Button>

            <p className="mt-2 text-xs text-muted-foreground">
              {t("support_note")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
