// import { getDoctors } from "@/actions/admin";
// import prisma from "@/lib/prisma";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  const session = await getCurrentUser();

  console.log(session);

  if (!session) {
    return (
      <div>
        <Navbar />
      </div>
    );
  }
  // console.log(doctors);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Trouvez un docteur</h1>
      {/* <SearchBar initialResults={doctors} /> */}
      Search content
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div>{`MY JSON OBJECT ${JSON.stringify(session)}`}</div>
      </div>
    </div>
  );
}
