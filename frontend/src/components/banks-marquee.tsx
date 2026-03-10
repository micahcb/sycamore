"use client";

const BANKS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citi",
  "Capital One",
  "US Bank",
  "PNC",
  "TD Bank",
  "Truist",
  "Ally Bank",
  "Discover",
  "American Express",
  "Navy Federal",
  "USAA",
  "Charles Schwab",
  "Fidelity",
  "Vanguard",
  "Ally",
  "Huntington",
  "Fifth Third",
  "KeyBank",
  "M&T Bank",
  "Citizens Bank",
  "Regions Bank",
  "BMO Harris",
  "SunTrust",
  "BB&T",
  "Santander",
  "Synchrony",
  "Barclays",
  "Marcus",
  "SoFi",
  "Chime",
  "Varo",
  "Current",
  "Aspiration",
  "Simple",
  "Betterment",
  "Wealthfront",
  "Robinhood",
  "Coinbase",
  "Kraken",
  "Credit Karma",
  "PayPal",
  "Venmo",
  "Cash App",
  "Zelle",
];

export function BanksMarquee() {
  const list = [...BANKS, ...BANKS];

  return (
    <section className="w-full py-12" aria-label="Banks and institutions supported via Plaid">
      <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Connect with 12,000+ institutions
      </h2>
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-banks-scroll gap-8">
          {list.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-card-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
