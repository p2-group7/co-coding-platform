"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

// Interface for an exercise object
export interface Exercise {
  value: string;
  label: string;
}
// btw this is mostly chatGPT. I think the problem is still fetching the exercies line 26-43

// Combobox component that fetches and displays exercises
export function Combobox({ lectureId }: { lectureId: number }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  // Fetch exercises belonging to the lecture
  React.useEffect(() => {
    async function fetchExercises() {
      try {
        // Call the API to fetch exercises by lectureId
        const fetchedExercises = await api.exercises.getByLectureId(lectureId);
        // Update the state with fetched exercises
        setExercises(fetchedExercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }

    // Fetch exercises only if lectureId is provided
    if (lectureId) {
      fetchExercises();
    }
  }, [lectureId]);

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
            ? exercises.find((exercise) => exercise.value === value)?.label
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
                  key={exercise.value}
                  value={exercise.value}
                  onSelect={(currentValue) => {
                    // Update selected exercise when clicked
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false); // Close the popover
                  }}
                >
                  {/* Display exercise label */}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === exercise.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {exercise.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
