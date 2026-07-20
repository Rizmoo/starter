import React, { createContext, useContext } from 'react';
import { usePage } from '@inertiajs/react';

const AppContext = createContext(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children, initialAuth }) {
  let auth = initialAuth;

  try {
    const page = usePage();
    auth = page.props.auth || initialAuth;
  } catch (e) {
    // usePage not available, use initialAuth
  }

  const user = auth?.user || null;
  const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

  return (
    <AppContext.Provider
      value={{
        user,
        currency: 'USD',
        companyName: appName,
        companyDetails: { name: appName },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
