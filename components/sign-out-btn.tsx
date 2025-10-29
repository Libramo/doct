"use client";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { refresh } from "next/cache";
import { useRouter } from "next/navigation";

const SignOutBtn = () => {
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
  return <Button onClick={handleSignOut}>Déconnexion</Button>;
};

export default SignOutBtn;
