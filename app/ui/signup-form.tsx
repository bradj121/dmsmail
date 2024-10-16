'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { createUser } from '../lib/actions';

export default function LoginForm() {
  // const [errorMessage, formAction, isPending] = useActionState(createUser, undefined);

  const isPending = false;
  const errorMessage = "error";

  return (
    <form action={createUser} className="space-y-3">
      <div className="flex-1 rounded-sm bg-gray-800 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl text-green-400">
          Sign up to create your own Dead Man's Switch
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-green-200"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-green-400"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-green-400 peer-focus:text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-sm font-medium text-green-400"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-green-400"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-green-400 peer-focus:text-green-600" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Sign Up <PencilSquareIcon className="ml-auto h-5 w-5 text-green-400" />
        </Button>
        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}