import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

type User = {
  username: string;
  password: string;
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
  const { payload, protectedHeader } = await jwtVerify(input, secret, {
    algorithms: [algorithm],
  });
  return payload;
}

export async function login(user: User) {
  if (!user.username || !user.password) {
    return "Username or password is not valid";
  }

  const isAuthorized = await checkUserCredentials(user.username, user.password);

  if (isAuthorized) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiryTime);
    const session = await encrypt({ user, expires }, expires);
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
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Could not retrieve user", error);
  }
}
