import React from 'react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWhoAmI } from '@/data/api';
import { useSelectedRealmId, useSetRealmId } from '@/context/api-context.ts';

export function Header() {
  const { data } = useWhoAmI();
  const realmId = useSelectedRealmId();
  const setRealmId = useSetRealmId();

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-8xl mx-auto">
        <div className="p-4 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
          <div className="relative flex items-center">
            <span className="flex gap-1 mr-3 flex-none font-medium text-accent-foreground">
              <Link to="/dead-letter">o5</Link>
            </span>
            <div className="relative flex items-center ml-auto">
              <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
                <ul className="flex space-x-8">
                  {(data?.realmAccess?.length || 0) > 1 && (
                    <li>
                      <Select
                        onValueChange={(value: string) => {
                          setRealmId(value);
                        }}
                        value={realmId}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Realm" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.realmAccess?.map((realm) => (
                            <SelectItem key={realm.realmId} value={realm.realmId}>
                              {realm.realmName || realm.realmId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </li>
                  )}
                  <li>
                    <Link to="/deployment">Deployments</Link>
                  </li>
                  <li>
                    <Link to="/stack">Stacks</Link>
                  </li>
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
