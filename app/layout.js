import "./globals.css";
import { ThemeProvider } from "./ThemeContext";

export const metadata = {
  title: "Todo List",
  description: "A cool looking todo list app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
