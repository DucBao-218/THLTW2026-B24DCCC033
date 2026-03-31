import React from 'react';

interface CauLacBoLayoutProps {
  children: React.ReactNode;
}

const CauLacBoLayout: React.FC<CauLacBoLayoutProps> = ({ children }) => {
  return (
    <div style={{ margin: 24 }}>
      {children}
    </div>
  );
};

export default CauLacBoLayout;