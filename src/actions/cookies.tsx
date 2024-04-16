"use server";

import { cookies } from "next/headers";

export const setCookie = (name: string, value: string) => {
  cookies().set(name, value, {
    sameSite: "strict",
    secure: true,
  });
};
