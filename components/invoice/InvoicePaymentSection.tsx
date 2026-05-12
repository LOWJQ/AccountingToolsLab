"use client";

import { PaymentDetailsFields } from "@/components/invoice/PaymentDetailsFields";
import type { InvoicePaymentDetails } from "@/lib/invoice/invoice-types";

type InvoicePaymentSectionProps = {
  onChange: (field: keyof InvoicePaymentDetails, value: string | undefined) => void;
  payment: InvoicePaymentDetails;
  paymentLinkError: string;
};

export function InvoicePaymentSection({
  onChange,
  payment,
  paymentLinkError
}: InvoicePaymentSectionProps) {
  return (
    <PaymentDetailsFields
      onChange={onChange}
      payment={payment}
      paymentLinkError={paymentLinkError}
    />
  );
}
