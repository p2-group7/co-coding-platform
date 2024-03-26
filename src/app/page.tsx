import { api } from "@/trpc/server";
import CodeEditor from "@/components/ui/CodeEditor";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
   
    <main>
       <div>
      <CodeEditor roomId="testtt" />
    </div>
      <div>
        <Navbar />
      </div>
    </main>
  );
}
