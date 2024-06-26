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
import { get } from "http";
import { getSession } from "@/lib/auth";
import { useEffect } from "react";

// PLEASE CHECK "CREATELECTURECARD" FILE FOR CLARIFICATIONS, THERE ARE MORE COMMENTS.

// Define Zod schema for form validation
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Course name must be at least 2 characters.",
  }),
  abrev: z.string().min(1).max(10),
});

type CreateCourseCardProps = {
  userId: number;
};

// Body of CourseCreatorCard component
const CreateCourseCard: React.FC<CreateCourseCardProps> = ({ userId }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      abrev: "",
    },
  });
  const router = useRouter();

  const createCourse = api.course.create.useMutation({
    onSuccess: (course) => {
      router.refresh();
    },
    onError: (error) => {
      console.log("Error creating course and assigning user to it:", error);
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    createCourse.mutate({ ...values, userId });
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
          <SheetTitle>Create Course</SheetTitle>
          <SheetDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="abrev"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course name abbreviated</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetClose>
                  <Button type="submit">Submit</Button>{" "}
                  {/* initialize submit function */}
                </SheetClose>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCourseCard;
