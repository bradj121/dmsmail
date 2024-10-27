import Pagination from '@/app/ui/policies/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/policies/table';
import { PolicyTableSkeleton } from '@/app/ui/skeletons';
import { CreatePolicy } from '@/app/ui/policies/buttons';
import { Suspense } from 'react';
 
export default async function Page(
  props: {
    searchParams?: Promise<{
      query?: string; 
      page?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = 1;
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Dead Man's Switch Policies</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search policies..." />
        <CreatePolicy />
      </div>
      <Suspense key={query + currentPage} fallback={<PolicyTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}