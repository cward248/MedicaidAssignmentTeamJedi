import React from "react";
import Link from "next/link";

// Created by Alec Schulte

const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white p-4">
        <div className="flex items-center justify-between w-full">
            <a href="/" className="text-3xl font-bold">
                Team Jedi
            </a>

            {/* fixed the routing for the header to use react Links instead of a tags, which react does not like for app routing.  */}

            <nav className="navbar">
                <Link href="/" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Home
                </Link>
                <Link href="/apply" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Apply
                </Link>
                <Link href="/requirements" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Requirements
                </Link>
                <Link href="/" className="px-3 py-2 rounded-sd text-lg font-medium hover:bg-gray-700"> 
                    Contact
                </Link>
            </nav>
        </div>

    </header>
  );
};

export default Header;
