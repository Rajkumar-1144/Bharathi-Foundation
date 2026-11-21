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
    sm: 'w-32 sm:w-36 h-9 sm:h-10',
    md: 'w-36 sm:w-40 xl:w-40 2xl:w-52 h-10 sm:h-11 xl:h-11 2xl:h-14',
    lg: 'w-56 sm:w-64 h-14 sm:h-16',
    xl: 'w-64 sm:w-80 h-16 sm:h-20',
  }[size];

  const content = (
    <div className={`relative ${sizeClasses} transition-transform hover:opacity-95 shrink-0 ${className}`}>
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
