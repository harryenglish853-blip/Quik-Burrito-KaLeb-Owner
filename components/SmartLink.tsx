'use client';

import React from 'react';
import Link from 'next/link';
import { IS_PREVIEW, href as resolveHref } from '@/lib/preview';

/**
 * An internal link that still works in the single-page preview build.
 *
 * In the real site this is next/link. In the preview it becomes a plain anchor
 * to the matching chapter of the homepage, so no navigation is ever a dead end.
 */
export function SmartLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const target = resolveHref(href);

  if (IS_PREVIEW) {
    return (
      <a href={target} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={target} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
