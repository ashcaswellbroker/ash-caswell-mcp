export default function Home() {
  return (
    <>
      <header>
        <div className="wrap">
          <img src="/logo.png" alt="Ash Caswell & Company logo" style={{height:90,background:"#fff",borderRadius:8,padding:8,marginBottom:12}} />
          <h1>Ash Caswell &amp; Company — Emerald Coast Real Estate</h1>
          <p>A connector for Claude, ChatGPT and other AI assistants</p>
        </div>
      </header>
      <main>
        <p>
          This connector gives AI assistants local real estate tools for Destin, Okaloosa Island, Miramar Beach,
          Santa Rosa Beach and Scenic 30A on Florida&apos;s Emerald Coast. It comes from Ash Caswell &amp; Company,
          a boutique brokerage run by a sixth-generation local broker.
        </p>
        <p>It&apos;s free, needs no account and doesn&apos;t ask for personal information.</p>

        <h2>Connect it</h2>
        <p>Server URL:</p>
        <pre>https://mcp.ashcaswellcompany.com/mcp</pre>
        <p>
          <strong>Claude:</strong> find &quot;Ash Caswell &amp; Company&quot; in the connector directory, or go to
          Customize → Connectors → Add custom connector and paste the URL above.
        </p>
        <p>
          <strong>ChatGPT:</strong> find &quot;Ash Caswell &amp; Company&quot; in the plugin directory, or, in developer
          mode, add a custom MCP server with the URL above.
        </p>
        <p>
          <strong>Grok, Gemini and other MCP-compatible assistants:</strong> add a custom MCP connector with the URL
          above.
        </p>

        <h2>Tools</h2>
        <div className="tool">
          <strong>analyze_vacation_rental</strong> — Estimates rental income, expenses, cap rate, mortgage payment,
          cash flow, cash-on-cash return and break-even occupancy for a short-term rental.
          <br />
          <em>Try: &quot;Would a $1.2M Miramar Beach condo renting at $450 a night with 60% occupancy cash flow?&quot;</em>
        </div>
        <div className="tool">
          <strong>estimate_florida_closing_taxes</strong> — Florida deed and note documentary stamps, intangible
          tax and the promulgated owner&apos;s title insurance premium.
          <br />
          <em>Try: &quot;What are the Florida doc stamps on a $900,000 purchase with a $700,000 loan?&quot;</em>
        </div>
        <div className="tool">
          <strong>get_rental_tax_rates</strong> — Short-term rental tax rates for Okaloosa County and South Walton,
          with official sources.
          <br />
          <em>Try: &quot;What&apos;s the tourist tax on a vacation rental on 30A?&quot;</em>
        </div>
        <div className="tool">
          <strong>get_area_guide</strong> — Neighborhoods, property types and rental notes for each area.
          <br />
          <em>Try: &quot;Compare Destin and Santa Rosa Beach for a second home.&quot;</em>
        </div>
        <div className="tool">
          <strong>get_broker_contact</strong> — How to reach Ash Caswell &amp; Company.
          <br />
          <em>Try: &quot;Who&apos;s a local broker I can talk to about buying on 30A?&quot;</em>
        </div>

        <h2>Limits</h2>
        <p>
          Results are estimates for education, not tax, legal, lending or investment advice. Tax rates come from
          the Florida Department of Revenue and the Okaloosa and Walton County Clerks and are checked every year.
          Live MLS listing search isn&apos;t included.
        </p>

        <h2>Support</h2>
        <p>
          Email <a href="mailto:ashcaswellrealtor@gmail.com">ashcaswellrealtor@gmail.com</a> or call or text (850)
          419-5934. See the <a href="/privacy">privacy policy</a>, <a href="/terms">terms of service</a> and <a href="/support">support page</a>.
        </p>
        <footer>© {new Date().getFullYear()} Ash Caswell &amp; Company · Destin, Florida · Licensed Florida real estate brokerage</footer>
      </main>
    </>
  );
}
