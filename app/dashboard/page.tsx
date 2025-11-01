import { auth } from "@/auth";
import SignOutBtn from "@/components/sign-out-btn";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import Link from "next/link";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div>
        Not authenticated please
        <Button asChild>
          <Link href={"/login"}>Se connecter </Link>
        </Button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex space-x-4">
        <h1>User data</h1>
        <SignOutBtn />
      </div>

      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
