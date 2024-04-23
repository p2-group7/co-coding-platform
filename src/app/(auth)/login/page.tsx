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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import AlertDestructive from "@/components/AlertDestructive";
import { type JsonObject } from "@prisma/client/runtime/library";
import { Suspense } from "react";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "username must be at least 2 characters",
  }),
  password: z.string().min(3, {
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

  const Alert = () => {
    const searchParams = useSearchParams();

    const error = searchParams.get("error");

    if (error) {
      let desc = "Something went wrong";
      if (error === "sessionExp") {
        desc = "Your session has expired. Please login again.";
      }
      return (
        <div className="m-6">
          <AlertDestructive error="Error!" description={desc} />
        </div>
      );
    } else {
      return null;
    }
  };
  const router = useRouter();

  function onSubmit(values: z.infer<typeof FormSchema>) {
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data: JsonObject) => {
        if (data.authorized === false) {
          form.setError("username", {
            type: "manual",
            message: "Wrong username or password",
          });
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        form.setError("username", {
          type: "manual",
          message: "Something went wrong",
        });
        console.error(error);
      });
  }

  return (
    <div>
      <Suspense>
        <Alert />
      </Suspense>
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
                        <Input type="password" placeholder="" {...field} />
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
    </div>
  );
}
