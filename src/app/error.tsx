'use client';
import { useEffect } from 'react';
// import ErrorFallback from '@/components/ErrorFallback';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // TODO: replace with Sentry later
    console.error('[App Error]', error);
  }, [error]);

  return <div>Error occurred</div>;
}
