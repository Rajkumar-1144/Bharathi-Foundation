import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLink?: boolean;
  priority?: boolean;
  href?: string;
}

export function Logo({
  className = '',
  size = 'md',
  showLink = true,
  priority = false,
  href = '/',
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-36 h-10',
    md: 'w-48 sm:w-56 h-12 sm:h-14',
    lg: 'w-56 sm:w-64 h-14 sm:h-16',
    xl: 'w-64 sm:w-80 h-16 sm:h-20',
  }[size];

  const content = (
    <div className={`relative ${sizeClasses} transition-transform hover:opacity-95 ${className}`}>
      <Image
        src="/images/bharathi-logo.png"
        alt="BHARATHI FOUNDATION - WE LOVE TO SERVE"
        fill
        className="object-contain object-left"
        priority={priority}
        sizes="(max-width: 640px) 180px, 300px"
      />
    </div>
  );

  if (!showLink) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex items-center group cursor-pointer" aria-label="Bharathi Foundation Home">
      {content}
    </Link>
  );
}

export default Logo;
