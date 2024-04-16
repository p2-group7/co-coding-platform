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

// Changed here
const FormSchema = z.object({
  exerciseName: z.string().min(2, {
    message: "Exercise name must be at least 2 characters.",
  }),
});

type CreateExerciseCardProps = {
  lecture: number;
};

// Changed here
const CreateExerciseCard: React.FC<CreateExerciseCardProps> = ({ lecture }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exerciseName: "",
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
      lectureId: lecture,
    };

    createExercise.mutate(data);
  }

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
                  control={form.control}
                  name="exerciseName" // Change from "name" to "lectureName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise name</FormLabel>{" "}
                      {/* Changed label text */}
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetClose>
                  <Button type="submit">Submit</Button>
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
