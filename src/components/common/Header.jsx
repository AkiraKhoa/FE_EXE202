import React from "react";

const Header = ({ title, children }) => {
  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
        {children}
      </div>
    </header>
  );
};

export default Header;