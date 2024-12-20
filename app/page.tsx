import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LogInButton from "@/components/auth/LogInButton";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center  ">
      <div className="space-y-y6 text-center py-3">
        <h1 className={cn(font.className)}>Auth</h1>
        <p>Nextjs Authentication</p>
      </div>
      <LogInButton>
        <Button variant={"outline"} size={"lg"}>
          Sign In
        </Button>
      </LogInButton>
    </main>
  );
}
