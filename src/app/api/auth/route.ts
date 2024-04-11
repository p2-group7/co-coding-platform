// Importing necessary types from Next.js
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

type auth = {
  username: string;
  password: string;
};

const prisma = new PrismaClient();
// Default handler function for the API route
const handler = (req: NextApiRequest) => { 
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  JSON.parse(req.body).then(({ username, password }: auth) => {
    try {
      const isAuthorized = checkUserCredentials(username, password).then(
        (isAuthorized) => {
          if (isAuthorized) {
            return NextResponse.json({ authorized: true });
          } else {
            return NextResponse.json({ authorized: false });
          }
        },
      );
    } catch (error) {
      return NextResponse.error();
    }
  });
};

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
export { handler as POST };
