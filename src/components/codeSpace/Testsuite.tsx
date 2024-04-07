import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const tags = ["1: n > 5", "2: n > 30", "3: Compiled", "4: Test 4", "5: Test 5"];

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="w-80 rounded-md border bg-secondary">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tests</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="flex justify-between">
              <div>{tag}</div>
              <Button>Play</Button>
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}

export default ScrollAreaDemo;
