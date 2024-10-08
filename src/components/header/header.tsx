import React from 'react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelectedRealmId, useSetRealmId, useWhoAmI } from '@/context/api-context.ts';

export function Header() {
  const { data } = useWhoAmI();
  const realmId = useSelectedRealmId();
  const setRealmId = useSetRealmId();

  return (
    <header
      className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
      style={{ height: 'var(--o5ui-header-height)' }}
    >
      <div className="max-w-8xl mx-auto">
        <div className="p-4 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10">
          <div className="relative flex items-center">
            <span className="flex gap-1 mr-3 flex-none font-medium text-accent-foreground">
              <Link className="no-underline" to="/dead-letter">
                o5
              </Link>
            </span>
            <div className="relative flex items-center ml-auto">
              <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
                <ul className="flex space-x-8">
                  {(data?.realms?.length || 0) > 1 && (
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
                          {data?.realms?.map((realmAccess) => (
                            <SelectItem key={realmAccess.realm.realmId} value={realmAccess.realm.realmId || ''}>
                              {realmAccess.realm.data.spec?.name || realmAccess.realm.realmId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </li>
                  )}
                  <li>
                    <Link className="no-underline" to="/stack">
                      Stacks
                    </Link>
                  </li>
                  <li>
                    <Link className="no-underline" to="/deployment">
                      Deployments
                    </Link>
                  </li>
                  <li>
                    <Link className="no-underline" to="/dead-letter">
                      Dead Letters
                    </Link>
                  </li>
                  <li>
                    <Link className="no-underline" to="/environment">
                      Environments
                    </Link>
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
