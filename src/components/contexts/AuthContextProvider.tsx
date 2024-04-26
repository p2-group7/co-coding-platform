"use client";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";
import React from "react";

import { createContext, useContext, useState } from "react";

const authContext = createContext({
  user: null as null | string,
  userId: null as null | number,
});

export async function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<null | string>(null);
  const [userId, setUserId] = useState<null | number>(null);

  const session = await getSession();
  if (session) {
    if (session.user) {
      setUser(session.user as string);
    }
    if (session.id) {
      setUserId(session.id as number);
    }
  }

  return (
    <authContext.Provider
      value={{
        user,
        userId,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export default AuthContextProvider;
