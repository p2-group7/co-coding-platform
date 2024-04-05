import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

import { ThemeProvider } from "@/components/theme-provider";

import { api } from "@/trpc/server";
import Navbar from "@/components/Navbar";
import type { GroupInfo } from "@/components/Navbar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "CoCoding",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/coconut.png" }],
};

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetGroupsOutput = RouterOutput["group"]["getGroups"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Make a database call to fetch groups data
  const groupsData: GetGroupsOutput = await api.group.getGroups();

  // Map the retrieved data to GroupInfo interface
  const groups: GroupInfo[] = groupsData.map((group: GetGroupsOutput[0]) => ({
    id: group.id,
    name: group.name,
    href: `/codespace/` + group.id,
  }));

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TRPCReactProvider>
            <div>
              <div className="w-full">
                <div className="ml-4">
                <Navbar groups={groups} />{" "}
                {/* Pass groups data to Navbar component */}
                </div>
              </div>
              {children}
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
