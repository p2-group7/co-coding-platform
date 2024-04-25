"use client";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

// Define Zod schema for form validation
const FormSchema = z.object({
  exerciseName: z.string().min(2, {
    message: "Exercise name must be at least 2 characters.",
  }),
  exerciseDescription: z.string().min(1, {
    message: "Please provide a description.",
  }),
});

//Initialize so current lecture id can be passed to the create exercise function
type CreateExerciseCardProps = {
  lecture: number;
};

// Body of CreateExerciseCard component
const CreateExerciseCard: React.FC<CreateExerciseCardProps> = ({ lecture }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exerciseName: "",
      exerciseDescription: "",
    },
  });
  const router = useRouter();

  const createExercise = api.exercise.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const data = {
      exerciseName: values.exerciseName,
      exerciseDescription: values.exerciseDescription,
      lectureId: lecture,
    };
    console.log("Data to be sent:", data);
    createExercise.mutate(data);
  }
  // Sheet and form from shadcn
  return (
    <Sheet>
      <SheetTrigger>
        <Card className="flex h-[140px] cursor-pointer items-center justify-center rounded-md p-4 shadow-md hover:bg-secondary">
          <div className="plus-sign h-16 w-16 items-center justify-center rounded-full bg-primary p-3 text-center text-white">
            <span className="text-3xl font-bold">+</span>
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Exercise</SheetTitle>
          <SheetDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control} // Passes the form control to the form field with {...field}
                  name="exerciseName" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise name</FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control} // Passes the form control to the form field with {...field}
                  name="exerciseDescription" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise description</FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetClose>
                  <Button type="submit">Submit</Button>  {/* initialize submit function */}
                </SheetClose>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CreateExerciseCard;
