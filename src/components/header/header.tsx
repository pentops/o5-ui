import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-8xl mx-auto">
        <div className="p-4 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
          <div className="relative flex items-center">
            <span className="flex gap-1 mr-3 flex-none font-medium text-accent-foreground">
              <Link to="/dead-letter">Dante</Link>
            </span>
            <div className="relative flex items-center ml-auto">
              <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
                <ul className="flex space-x-8">
                  <li>
                    <Link to="/dead-letter">Dead Letters</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
