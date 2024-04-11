"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "@/actions/cookies";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters",
  }),
  password: z.string().min(5, {
    message: "password must be at least 5 characters",
  }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.authorized === false) {
          form.setError("username", {
            type: "manual",
            message: "Invalid username or password",
          });
        } else {
          setCookie("authorization", "true");
        }
      })
      .catch((err) => {
        form.setError("username", {
          type: "manual",
          message: "Something went wrong",
        });
      });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password below to login to your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username" // Change from "name" to "lectureName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel> {/* Changed label text */}
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
                name="password" // Change from "name" to "lectureName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel> {/* Changed label text */}
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign in</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
