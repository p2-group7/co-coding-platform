import { api } from "@/trpc/server";
import Navbar from "@/components/Navbar";
import type { GroupInfo } from "@/components/Navbar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { getServerAuthSession } from "@/server/auth";


export default async function Home() {
  return (
    <main>
      <div>
      </div>
    </main>
  );
}
