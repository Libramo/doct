import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserType } from "@/db/schema";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import SignOutBtn from "./sign-out-btn";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export function NavUser({ user }: { user: UserType }) {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"), router.refresh();
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
            >
              <Avatar className="size-8">
                <AvatarImage src={user.image as string} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-5 text-muted-foreground/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) bg-sidebar"
            side="top"
            align="end"
            sideOffset={0}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
                {/* <RiUserLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                /> */}
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
                {/* <RiGroupLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                /> */}
                Accounts
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 focus:bg-sidebar-accent">
                {/* <RiSparklingLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                /> */}
                Upgrade
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-3 focus:bg-sidebar-accent"
              >
                <LogOutIcon
                  size={20}
                  className="rotate-180 size-5 text-muted-foreground/80"
                />
                Déconnexion
                {/* <Button variant={"ghost"}>Décon</Button> */}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
