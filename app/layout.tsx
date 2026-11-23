import type { ReactNode } from "react";

export const metadata = {
  title: "Ash Caswell & Company for Claude and ChatGPT",
  description:
    "Emerald Coast real estate tools for AI assistants: vacation rental investment math, Florida closing taxes, rental tax rates and area guides for Destin, Miramar Beach, Santa Rosa Beach and 30A.",
};

const css = `
body{margin:0;font-family:Georgia,'Times New Roman',serif;color:#1c2b3a;background:#f7fafa;line-height:1.6}
header{background:#0B2545;color:#fff;padding:40px 24px}
header .wrap,main{max-width:820px;margin:0 auto}
header h1{margin:0 0 6px;font-size:30px}
header p{margin:0;color:#bfe9e6}
main{padding:28px 24px 60px}
h2{color:#0B2545;border-bottom:3px solid #2BBCB3;padding-bottom:4px;margin-top:36px}
code,pre{font-family:ui-monospace,Menlo,monospace;background:#e8f4f3;border-radius:6px}
code{padding:2px 6px}
pre{padding:12px 14px;overflow-x:auto}
a{color:#1a8c85}
.tool{background:#fff;border-left:4px solid #2BBCB3;padding:10px 16px;margin:12px 0;border-radius:4px}
footer{font-size:14px;color:#5b6b7a;margin-top:48px}
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{css}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
