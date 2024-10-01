'use client';

import Link from 'next/link';
import {
  CalendarIcon,
  DocumentIcon,
  PencilSquareIcon,
  UserCircleIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { LuUnplug } from "react-icons/lu";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { Button } from '@/app/ui/button';
import { createPolicy } from '@/app/lib/actions';
import { DatePicker } from '@nextui-org/date-picker';
import React from 'react';
import { getLocalTimeZone, today } from '@internationalized/date'

export default function Form() {
  const [expirationDate, setExpirationDate] = React.useState(new Date())
  
  return (
    <form action={createPolicy}>
      <div className="rounded-sm bg-gray-800 p-4 md:p-6">
        {/* Recipients */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-green-400">
            Enter the recipients of your Dead Man's Switch policy (space separated)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="recipients"
                name="recipients"
                type="string"
                placeholder="Enter email addresses"
                className="peer block w-full rounded-sm border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Policy Email Subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="mb-2 block text-sm font-medium text-green-400">
            Enter the subject for your triggered policy email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
                id="subject"
                name="subject"
                type="string"
                placeholder="Enter email subject"
                className="peer block w-full rounded-sm border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Policy Email Body */}
        <div className="mb-4">
          <label htmlFor="subject" className="mb-2 block text-sm font-medium text-green-400">
            Enter the body for your triggered policy email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea 
                id="body"
                name="body"
                placeholder="Enter email body"
                rows={10}
                className="peer block w-full rounded-sm border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-4">
          <label htmlFor="attachments" className="mb-2 block text-sm font-medium text-green-400">
            Enter the collateral to attach to your policy email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="attachments"
                name="attachments"
                type="file"
                multiple
                className="peer block w-full rounded-sm border border-gray-200 py-2 pl-10 text-sm outline-2 text-green-400"
              />
              <PaperClipIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-green-400 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Dead man's switch duration */}
        <div className="mb-4">
          <label htmlFor="expirationDate" className="mb-2 block text-sm font-medium text-green-400">
            Enter the period after which the dead man's switch will trigger and the email will be sent
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
                type="date"
                id="expirationDate"
                name="expirationDate"
              />
              {/* <DatePicker
               label="Expiration Date" 
               variant="bordered"
               labelPlacement="inside"
               isRequired={true}
               className="peer block w-full rounded-sm border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
               minValue={today(getLocalTimeZone())}
               value={expirationDate}
               onChange={(value) => setExpirationDate(value)}
              /> */}
              {/* <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-green-400 peer-focus:text-gray-900" /> */}
            </div>
          </div>
        </div>

        {/* Policy Status */}
        {/* <fieldset>
          <legend className="mb-2 block text-sm font-medium text-green-400">
            Set the policy status
          </legend>
          <div className="rounded-sm border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
            <div className="flex items-center">
                <input
                  id="active"
                  name="status"
                  type="radio"
                  value="active"
                  defaultChecked
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="active"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Active <PiPlugsConnectedBold className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="inactive"
                  name="status"
                  type="radio"
                  value="inactive"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="inactive"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Inactive <LuUnplug className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset> */}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/policies"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Policy</Button>
      </div>
    </form>
  );
}
