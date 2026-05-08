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
  // Try to get from usePage if available, otherwise use initialAuth
  let auth = initialAuth;
  let sharedCompany = null;
  let sharedBranchContext = null;

  try {
    const page = usePage();
    auth = page.props.auth || initialAuth;
    sharedCompany = page.props.company ?? null;
    sharedBranchContext = page.props.branch_context ?? null;
  } catch (e) {
    // usePage not available, use initialAuth
  }

  const user = auth?.user || null;
  const companyName = sharedCompany?.name || 'Company';
  const companyDetails = sharedCompany || { name: companyName };
  const branches = sharedBranchContext?.branches || [];
  const currentBranch = sharedBranchContext?.current_branch || null;
  const branchScopeMode = sharedBranchContext?.mode || 'single';

  return (
    <AppContext.Provider
      value={{
        user,
        currency: sharedCompany?.settings?.currency || 'USD',
        companyName,
        companyDetails,
        branches,
        currentBranch,
        branchScopeMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
