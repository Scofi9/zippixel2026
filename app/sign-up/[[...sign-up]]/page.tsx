import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl items-start justify-center px-4 py-14">
      <SignUp />
    </div>
  );
}
