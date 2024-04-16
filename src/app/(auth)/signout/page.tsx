import { signOut } from "@/lib/auth";

// force NextJs to not statically render this page due to wanting to delete cookies here instead of with fetch request.
export const dynamic = "force-dynamic";

export default async function SignoutPage() {
  try {
    signOut()
      .then()
      .catch((error) => console.log(error));
  } catch (error) {
    console.log("error with signing out");
  }

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <p>
          You signed out. Go to{" "}
          <a className="text-primary" href="/login">
            login
          </a>
          .
        </p>
      </div>
    </main>
  );
}
