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

const DEMO_COMPANY = {
  name: 'BizFlow',
  address: '123 Business St, Suite 100',
  phone: '+1 (555) 000-0000',
  email: 'hello@bizflow.com',
};

export function AppProvider({ children, initialAuth }) {
  // Try to get from usePage if available, otherwise use initialAuth
  let auth = initialAuth;
  try {
    const page = usePage();
    auth = page.props.auth || initialAuth;
  } catch (e) {
    // usePage not available, use initialAuth
  }

  const user = auth?.user || null;

  return (
    <AppContext.Provider
      value={{
        user,
        currency: 'USD',
        companyName: DEMO_COMPANY.name,
        companyDetails: DEMO_COMPANY,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
