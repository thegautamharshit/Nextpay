import { Button } from "@repo/ui/button";
import { prisma } from "@repo/db";

export default async function Home() {
  const user = await prisma.user.findFirst()
  return (
    <div className="flex flex-col justify-center h-screen bg-amber-200">
      <div className="flex justify-center">
        Hello, Finally It is working now.
      </div>
      <div>
      {user?.name ?? "No user added yet"}
      </div>
      <Button />
    </div>
  );
}
