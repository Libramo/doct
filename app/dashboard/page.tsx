import { getDashboardData } from "@/actions";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import BigCalendar from "@/components/big-calendar";
import SignOutBtn from "@/components/sign-out-btn";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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

  // 2. Extract the Doctor's ID
  // Assuming the user object in the session now contains the doctor's ID and role
  const userId = session.user.id;

  const { appointments, profile, user } = await getDashboardData(userId);

  return (
    // <div>
    //   <div className="flex space-x-4">
    //     <h1>User data</h1>
    //     <SignOutBtn />
    //   </div>

    //   <pre>{JSON.stringify(session.user, null, 2)}</pre>
    // </div>

    <SidebarProvider>
      <AppSidebar data={{ appointments, profile, user }} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
          <BigCalendar appointments={appointments} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardPage;
