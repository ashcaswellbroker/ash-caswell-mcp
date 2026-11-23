export const metadata = { title: "Privacy Policy — Ash Caswell & Company AI Connector" };

export default function Privacy() {
  return (
    <>
      <header>
        <div className="wrap">
          <h1>Privacy Policy</h1>
          <p>Ash Caswell &amp; Company AI connector · Effective November 23, 2026</p>
        </div>
      </header>
      <main>
        <p>
          This policy covers the Ash Caswell &amp; Company MCP connector (the &quot;Connector&quot;) at
          mcp.ashcaswellcompany.com, which AI assistants such as Claude and ChatGPT use to answer real estate
          questions. It doesn&apos;t cover ashcaswellcompany.com, which has its own policy.
        </p>

        <h2>What we collect</h2>
        <p>
          The Connector has no accounts and asks for no names, emails, phone numbers or other personal
          information. When an AI assistant calls a tool, it sends only that tool&apos;s inputs, such as a purchase
          price, nightly rate or area name. We don&apos;t receive your conversation, chat history, memory or files.
        </p>

        <h2>How we use it</h2>
        <p>
          Tool inputs are used only to calculate and return the answer for that request. Our hosting provider,
          Vercel, keeps standard technical logs (such as time of request, IP address and error messages) to run
          and secure the service.
        </p>

        <h2>Storage and retention</h2>
        <p>
          We don&apos;t store tool inputs or results in a database. Hosting logs are kept only as long as Vercel&apos;s
          standard log retention, and we use them only to fix problems and measure overall usage.
        </p>

        <h2>Sharing</h2>
        <p>
          We don&apos;t sell, rent or share data from the Connector. The only third party that handles requests is
          our hosting provider, Vercel Inc., acting as our service provider. We may disclose information if the law
          requires it.
        </p>

        <h2>Contacting us yourself</h2>
        <p>
          If you choose to call, text or email Ash Caswell &amp; Company using the contact details the Connector
          provides, that contact is handled like any other inquiry to our brokerage and isn&apos;t part of the
          Connector.
        </p>

        <h2>Children</h2>
        <p>The Connector isn&apos;t directed at children under 13 and doesn&apos;t knowingly collect their information.</p>

        <h2>Changes</h2>
        <p>If this policy changes, we&apos;ll update it on this page and change the effective date.</p>

        <h2>Contact</h2>
        <p>
          Ash Caswell &amp; Company, Destin, Florida ·{" "}
          <a href="mailto:ashcaswellrealtor@gmail.com">ashcaswellrealtor@gmail.com</a> · (850) 419-5934
        </p>
        <p><a href="/">← Back to connector documentation</a></p>
      </main>
    </>
  );
}
