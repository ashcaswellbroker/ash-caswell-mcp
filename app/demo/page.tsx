export const metadata = { title: "Demo — Ash Caswell & Company AI Connector" };

export default function Demo() {
  return (
    <>
      <header>
        <div className="wrap">
          <h1>Connector demo</h1>
          <p>Five test cases and one out-of-scope case, run live against mcp.ashcaswellcompany.com/mcp</p>
        </div>
      </header>
      <main>
        <video src="/demo.mp4" controls playsInline style={{ width: "100%", borderRadius: 8 }} />
        <p><a href="/demo.mp4">Download the video (MP4)</a> · <a href="/">Documentation</a></p>
      </main>
    </>
  );
}
