import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavigationSheet } from "@/components/navigation-sheet";
import Link from "next/link";
import ThemeToggleButton from "./theme-toggle";

const Navbar = () => {
  return (
    <div className="min-h-screen bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop Menu */}

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href={"/login"}>Portail patient</Link>
            </Button>

            <Button variant={"default"} className="hidden sm:inline-flex">
              <Link href={"/login"}>Portail praticien</Link>
            </Button>
            <ThemeToggleButton className="hidden md:block" />

            {/* Mobile Menu */}
            <div className="md:hidden flex space-x-2">
              <ThemeToggleButton />
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
