import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MyRuntimeProvider } from "./MyRuntimeProvider";
import { SourcesPanelWrapper } from "./SourcesPanelWrapper";
import { WebSearchProvider } from "@/components/assistant-ui/web-search-context";
import { KnowledgeSourcesProvider } from "@/components/assistant-ui/knowledge-sources-context";
import { ModelConfigProvider } from "@/components/assistant-ui/model-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Property Assistant",
  description: "Property Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebSearchProvider>
          <KnowledgeSourcesProvider>
            <ModelConfigProvider>
              <SourcesPanelWrapper>
                <MyRuntimeProvider>
                  {children}
                </MyRuntimeProvider>
              </SourcesPanelWrapper>
            </ModelConfigProvider>
          </KnowledgeSourcesProvider>
        </WebSearchProvider>
      </body>
    </html>
  );
}
