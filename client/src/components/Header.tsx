import { Link } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Euro } from "lucide-react";

interface HeaderProps {
  currentPath: string;
}

export default function Header({ currentPath }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Euro className="mr-2" />
          <h1 className="text-xl font-bold">Forex News Suggester</h1>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary-dark"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <div className="hidden md:flex ml-6">
            <nav className="flex space-x-6">
              <Link href="/signals">
                <a className={`py-2 border-b-2 ${currentPath === "/signals" || currentPath === "/" ? "border-white" : "border-transparent hover:border-white"} font-medium`}>
                  Signals
                </a>
              </Link>
              <Link href="/news">
                <a className={`py-2 border-b-2 ${currentPath === "/news" ? "border-white" : "border-transparent hover:border-white"} font-medium`}>
                  News
                </a>
              </Link>
              <Link href="/dashboard">
                <a className={`py-2 border-b-2 ${currentPath === "/dashboard" ? "border-white" : "border-transparent hover:border-white"} font-medium`}>
                  Dashboard
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
