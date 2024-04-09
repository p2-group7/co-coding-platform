import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const tags = [
  "1: n > 5",
  "2: n > 30",
  "3: Compiled",
  "4: n > 100",
  "5: n > 500",
  "6: n > 1000",
  "7: n > 5000",
  "8: n > 10000",
];

export function ScrollAreaDemo() {
  return (
    <div className="h-full w-full overflow-auto rounded-md border bg-secondary">
      <div className="p-4 pb-2">
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="flex items-center justify-between">
              <div>{tag}</div>
              <Button>Play</Button>
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ScrollAreaDemo;
