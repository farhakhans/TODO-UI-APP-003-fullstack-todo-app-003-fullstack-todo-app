import React from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  current: boolean;
}

interface MobileNavProps {
  navigation: NavItem[];
  userNavigation: NavItem[];
  onSignOut: () => void;
}

const MobileNav = ({ navigation, userNavigation, onSignOut }: MobileNavProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex-shrink-0 flex items-center px-4">
        <h1 className="text-xl font-semibold text-gray-900">Todo App</h1>
      </div>
      <div className="mt-5 flex-1 h-0 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-base font-medium rounded-md`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <nav className="px-2 space-y-1">
            {userNavigation.map((item) => (
              <button
                key={item.name}
                onClick={item.name === 'Sign out' ? onSignOut : undefined}
                className={`text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;