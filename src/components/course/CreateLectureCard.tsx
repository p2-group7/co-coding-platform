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
  lectureName: z.string().min(2, {
    message: "Lecture name must be at least 2 characters.",
  }),
  description: z.string().min(1),
});

// Changed here
const CreateLectureCard = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lectureName: "",
      description: "",
    },
  });
  const router = useRouter();

  const createLecture = api.lecture.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    createLecture.mutate(values);
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
          <SheetTitle>Create Lecture</SheetTitle>
          <SheetDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="lectureName" // Change from "name" to "lectureName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lecture name</FormLabel>{" "}
                      {/* Changed label text */}
                      <FormControl>
                        <textarea
                        placeholder=""
                        {...field}
                        className="h-10 w-full resize-none rounded-md border p-2"
                        />


                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description" // Change from "abrev" to "description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>{" "}
                      {/* Changed label text */}
                      <FormControl>
                        <textarea
                          placeholder=""
                          {...field}
                          className="h-36 w-full resize-none rounded-md border p-2"
                        />
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

export default CreateLectureCard;
