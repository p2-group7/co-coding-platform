"use client";
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { usePathname, useRouter } from "next/navigation";

type RouterOutput = inferRouterOutputs<AppRouter>;

type exercises = RouterOutput["exercise"]["getAllExercises"];
type exercise_name = exercises[0]["name"];

// Combobox that displays exercises
export function Combobox({
  exercises,
  selected,
}: {
  exercises: exercises;
  selected?: exercise_name;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selected);

  const router = useRouter();
  const currentPath = usePathname();

  const replaceLastPathSegment = ({ newSegment }: { newSegment: string }) => {
    const parts = currentPath.split("/");
    parts[parts.length - 1] =
      exercises
        .find((exercise) => exercise.name === newSegment)
        ?.id.toString() ?? ""; // Set the last segment to the exercise ID if found
    const newPath = parts.join("/");
    router.push(newPath);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Combobox button */}
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {/* Display selected exercise or default message */}
          {value
            ? exercises.find((exercise) => exercise.name === value)?.name
            : "Select Exercise"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Popover content */}
      <PopoverContent className="w-[200px] p-0">
        {/* Command UI for searching exercises */}
        <Command>
          <CommandInput placeholder="Search exercise..." />
          <CommandEmpty>No exercise found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {/* Iterate over exercises and render each as an option */}
              {exercises.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.name}
                  onSelect={(currentValue) => {
                    // Update selected exercise when clicked
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false); // Close the popover
                    replaceLastPathSegment({
                      newSegment: currentValue,
                    });
                  }}
                >
                  {/* Display exercise label */}
                  {/* <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === selected ? "opacity-100" : "opacity-0",
                    )}
                  /> */}
                  {exercise.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
