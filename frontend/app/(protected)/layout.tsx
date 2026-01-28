import React from 'react';
import ProtectedContent from './ProtectedContent';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedContent>{children}</ProtectedContent>;
};

export default ProtectedLayout;