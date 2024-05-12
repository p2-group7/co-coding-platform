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
  lectureName: z.string().min(2, {
    message: "Lecture name must be at least 2 characters.",
  }),
  lectureDescription: z.string().min(1, {
    message: "Please provide a description.",
  }),
});
//Initialize so current course id can be passed to the create lecture function
type CreateLectureCardProps = {
  course: number;
};

// Body of CreateLectureCard component
const CreateLectureCard: React.FC<CreateLectureCardProps> = ({ course }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lectureName: "",
      lectureDescription: "",
    },
  });
  const router = useRouter();

  // Function to create new lecture in database using mutation and refresh page
  const createLecture = api.lecture.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // Function to handle form submission utilizing the createLecture mutation
  // Also passes the defines Zod schema to the form
  function onSubmit(values: z.infer<typeof FormSchema>) {
    const data = {
      lectureName: values.lectureName,
      lectureDescription: values.lectureDescription,
      courseId: course,
    };

    createLecture.mutate(data);
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
          <SheetTitle>Create Lecture</SheetTitle>
          <SheetDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control} // Passes the form control to the form field with {...field}
                  name="lectureName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lecture name</FormLabel>{" "}
                      {/* Changed label text */}
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
                  name="lectureDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lecture description</FormLabel>{" "}
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

export default CreateLectureCard;
