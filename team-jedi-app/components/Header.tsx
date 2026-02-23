import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white p-4">
        <div className="flex items-center justify-between w-full">
            <a href="/" className="text-3xl font-bold">
                Team Jedi
            </a>

            <nav className="navbar">
                <a href="/about" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Home
                </a>
                <a href="/about" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Apply
                </a>
                <a href="/requirements/page.tsx" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                    Requirments
                </a>
                <a href="/contact" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700"> 
                    Contact
                </a>
            </nav>
        </div>

        </header>
  );
};

export default Header;
