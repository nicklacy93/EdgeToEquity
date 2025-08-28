'use client';

interface Props {
  loading: boolean;
  error?: string | null;
}

export default function TradeJournalErrorLoading({ loading, error }: Props) {
  if (loading) {
    return <div className='p-4 text-center text-blue-500'>Loading trade journal analysis...</div>;
  }

  if (error) {
    return <div className='p-4 text-center text-red-500'>Error: {error}</div>;
  }

  return null;
}
