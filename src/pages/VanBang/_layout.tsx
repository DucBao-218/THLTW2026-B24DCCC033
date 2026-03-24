import React from 'react';

interface VanBangLayoutProps {
  children: React.ReactNode;
}

const VanBangLayout: React.FC<VanBangLayoutProps> = (props) => {

    return <>{props.children}</>; 
};

export default VanBangLayout;