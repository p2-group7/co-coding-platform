import "@/styles/globals.css";

import Navbar from "@/components/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <div className="w-full">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
