import { buildMetadata } from "@/lib/utils/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="content-wrap py-10 md:py-14">
      <div className="rounded-[32px] border border-line/70 bg-white/72 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)] md:p-10">
        <h1 className="font-display text-5xl leading-none text-foreground">Privacy Policy</h1>
        <div className="mt-6 grid gap-6 text-sm leading-8 text-muted md:text-base">
          <p>
            Arteez Collection collects only the information needed to respond to
            customer inquiries, coordinate delivery, support customer accounts, and
            improve the shopping experience.
          </p>
          <p>
            Information such as your name, email, phone number, address, and order details
            is used for WhatsApp inquiries, delivery communication, account support,
            and customer assistance.
          </p>
          <p>
            We do not sell personal information to third parties. Payments are not
            processed inside this storefront. Final purchase coordination happens
            directly with Arteez Collection after the customer reaches out.
          </p>
          <p>
            You may contact us to request updates to your account information or to ask
            questions about how your data is used.
          </p>
        </div>
      </div>
    </div>
  );
}
