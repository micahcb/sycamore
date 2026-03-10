import { PlaidLinkSection } from "@/components/plaid-link-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="mx-auto max-w-5xl px-4 py-12">
        <PlaidLinkSection />
      </main>
    </div>
  );
}
