import Link from "next/link";

import { api } from "@/trpc/server";
import CodeEditor from "@/components/ui/CodeEditor";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <div>
      <CodeEditor roomId="testtt" />
    </div>
  );
}
