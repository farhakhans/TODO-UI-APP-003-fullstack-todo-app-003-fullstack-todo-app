import React from 'react';

interface NavbarLayoutProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  header?: React.ReactNode;
}

const NavbarLayout = ({ children, navbar, header }: NavbarLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-subtle wave-bg">
      {/* Navbar */}
      {navbar}

      {/* Main content */}
      <main className="flex-1">
        <div className="py-6">
          {header && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {header}
            </div>
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NavbarLayout;