"use client";

import { Button } from "@/components/ui/button";

export function PrintInvoiceButton() {
  return (
    <Button size="sm" variant="secondary" onClick={() => window.print()}>
      Print invoice
    </Button>
  );
}
