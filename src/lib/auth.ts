import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";

type User = {
  username: string;
  password: string;
};

export type Session = {
  userId: number | undefined; // if not assigned to a user, it will be undefined. Check later to see if user is in a group
  user: User;
  groupId: number | undefined; // if not assigned to a group, it will be undefined. Check later to see if user is in a group
  expires: Date;
};

const secretString = "secret";
const secret = new TextEncoder().encode(secretString);
const algorithm = "HS256";
const expiryTime = 60 * 5;

// based on https://github.com/balazsorban44/auth-poc-next/blob/main/lib.ts

async function encrypt(payload: JWTPayload, expiryDate: Date) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expiryDate)
    .sign(secret);
  return token;
}
export async function decrypt(input: string) {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: [algorithm],
  });
  return payload as Session;
}

export async function signOut() {
  cookies().delete("session");
}

export async function login(user: User) {
  if (!user.username || !user.password) {
    return "Username or password is not valid";
  }

  const { isAuthorized, dbUser } = await checkUserCredentials(
    user.username,
    user.password,
  );

  if (isAuthorized) {
    const groupId = dbUser?.groupId;
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiryTime);
    const userId = dbUser?.id;
    const sessionData: Session = { userId, user, groupId, expires };
    const session = await encrypt(sessionData, expires);
    cookies().set("session", session, { httpOnly: true });
    return true;
  } else {
    return "Invalid username or password";
  }
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

const prisma = new PrismaClient();
async function checkUserCredentials(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user && user.password === password) {
      return { isAuthorized: true, dbUser: user };
    } else {
      return { isAuthorized: false, dbUser: null };
    }
  } catch (error) {
    console.log("Could not retrieve user", error);
    return { isAuthorized: false, dbUser: null };
  }
}
