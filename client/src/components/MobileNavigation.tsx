import { Link } from "wouter";
import { TrendingUp, Newspaper, BarChart } from "lucide-react";

interface MobileNavigationProps {
  currentPath: string;
}

export default function MobileNavigation({ currentPath }: MobileNavigationProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-10">
      <div className="flex justify-around">
        <Link href="/signals">
          <a className={`flex flex-col items-center py-2 flex-1 ${currentPath === "/signals" || currentPath === "/" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}>
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs mt-1">Signals</span>
          </a>
        </Link>
        <Link href="/news">
          <a className={`flex flex-col items-center py-2 flex-1 ${currentPath === "/news" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}>
            <Newspaper className="h-5 w-5" />
            <span className="text-xs mt-1">News</span>
          </a>
        </Link>
        <Link href="/dashboard">
          <a className={`flex flex-col items-center py-2 flex-1 ${currentPath === "/dashboard" ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}>
            <BarChart className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
