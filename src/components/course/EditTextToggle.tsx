"use client";
import {
  Form,
  FormItem,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Toggle } from "@/components/ui/toggle";
import { zodResolver } from "@hookform/resolvers/zod";


const FormSchema = z.object({
  description: z.string().min(1),
});

const TextEditor = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: ""
    },
  });

  
  return (
    <Form {...form}>
      <Toggle>Edit</Toggle>
      <br /><br />
        <form className="text-white-700 rounded-lg border-2 border-secondary bg-secondary bg-gradient-to-b from-muted/50 to-muted p-6 text-lg no-underline outline-none focus:shadow-md">
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormControl>
                <Input placeholder="Course Description" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        </form>
    </Form>
  );
};

export default TextEditor;
