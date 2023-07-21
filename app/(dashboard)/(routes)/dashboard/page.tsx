import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <>
      <div>
      <h1 className="text-3xl font-bold underline text-green-700">
        Dashboard(Protected)
      </h1>
      <UserButton afterSignOutUrl="/"/>
      </div>
    </>
  );
}
