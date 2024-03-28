import CodeEditor from "@/components/ui/CodeEditor";
import Navbar from "@/components/Navbar";
import { getGroups } from "@/server/api/routers/group";
import type { GroupInfo } from "@/components/Navbar";

// Make a database call to fetch groups data
const groupsData = await getGroups();

// Map the retrieved data to GroupInfo interface
const groups: GroupInfo[] = groupsData.map((group: GroupInfo) => ({
  id: group.id,
  name: group.name,
  href: `/codespace`, // Assuming href is constructed based on group id
}));
export default async function Home() {
  return (
    <main>
      <div>
        <Navbar groups={groups} /> {/* Pass groups data to Navbar component */}
      </div>
      <div>
        <CodeEditor roomId="testtt" />
      </div>
    </main>
  );
}
