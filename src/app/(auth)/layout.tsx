import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Prompt } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "700",
  display: "swap",
});

const prompt = Prompt({
  weight: ["400", "600", "700"],
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบ ล็อกอิน",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn(
        inter.variable,
        interHeading.variable,
        prompt.variable,
        jetbrainsMono.variable,
        "font-sans",
        "dark"
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
