import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreatePolicy() {
  return (
    <Link
      href="/dashboard/policies/create"
      className="flex h-10 items-center rounded-sm bg-gray-800 px-4 text-sm font-medium text-green-400 transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Policy</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePolicy({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/policies/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
