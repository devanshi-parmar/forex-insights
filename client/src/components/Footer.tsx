import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Forex News Suggester. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="#">
              <a className="text-gray-600 dark:text-gray-400 hover:text-primary">
                Terms of Service
              </a>
            </Link>
            <Link href="#">
              <a className="text-gray-600 dark:text-gray-400 hover:text-primary">
                Privacy Policy
              </a>
            </Link>
            <Link href="#">
              <a className="text-gray-600 dark:text-gray-400 hover:text-primary">
                Contact Us
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
