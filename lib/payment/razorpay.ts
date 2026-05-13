import crypto from "node:crypto";

import Razorpay from "razorpay";

import { getRazorpayEnv } from "@/lib/utils/env";

type PaymentSignatureInput = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export function createRazorpayClient() {
  const { keyId, keySecret } = getRazorpayEnv();

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

function createSignature(message: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyRazorpayPaymentSignature(input: PaymentSignatureInput) {
  const { keySecret } = getRazorpayEnv();
  const expectedSignature = createSignature(
    `${input.orderId}|${input.paymentId}`,
    keySecret,
  );

  return safeCompare(expectedSignature, input.signature);
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  receivedSignature: string | null,
) {
  const { webhookSecret } = getRazorpayEnv();

  if (!webhookSecret || !receivedSignature) {
    return false;
  }

  const expectedSignature = createSignature(rawBody, webhookSecret);

  return safeCompare(expectedSignature, receivedSignature);
}
