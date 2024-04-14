import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";

type User = {
  username: string;
  password: string;
};

const secret = "secret";
const expiryTime = 60 * 5;

async function encrypt(user: User, expiresIn: number) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const token = sign(user, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  });
  return token;
}
export async function decrypt(input: string): Promise<any> {
  const result = verify(input, secret, {
    algorithms: ["HS256"],
  });
  return result;
}

export async function login(user: User) {
  if (!user.username || !user.password) {
    return "Username or password is not valid";
  }

  const isAuthorized = await checkUserCredentials(user.username, user.password);
  console.log(isAuthorized);

  if (isAuthorized) {
    const session = await encrypt(user, expiryTime);
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
    console.log("Checking user credentials");
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
