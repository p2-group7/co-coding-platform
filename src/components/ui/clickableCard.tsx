import React from 'react';
import Link from 'next/link';

type ClickableCardProps = {
  href: string;
  children: React.ReactNode;
};

const ClickableCard: React.FC<ClickableCardProps> = ({ href, children }) => {
  return (
      <Link href={href}>
          {children}
      </Link>
  );
};

export default ClickableCard;