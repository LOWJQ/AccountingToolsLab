"use client";

import { PaymentDetailsFields } from "@/components/invoice/PaymentDetailsFields";
import type { InvoicePaymentDetails } from "@/lib/invoice/invoice-types";

type InvoicePaymentSectionProps = {
  onChange: (field: keyof InvoicePaymentDetails, value: string | undefined) => void;
  payment: InvoicePaymentDetails;
  paymentErrors: Partial<Record<keyof InvoicePaymentDetails, string>>;
};

export function InvoicePaymentSection({
  onChange,
  payment,
  paymentErrors
}: InvoicePaymentSectionProps) {
  return (
    <PaymentDetailsFields
      onChange={onChange}
      payment={payment}
      paymentErrors={paymentErrors}
    />
  );
}
