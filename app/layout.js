import "./globals.css";

export const metadata = {
  title: "Todo List",
  description: "A cool looking todo list app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Asimovian&family=Kode+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
