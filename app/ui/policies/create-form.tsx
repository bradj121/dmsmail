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
import { PiCableCar, PiPlugsConnectedBold } from "react-icons/pi";
import { Button } from '@/app/ui/button';
import { createPolicy } from '@/app/lib/actions';
import { DatePicker } from '@nextui-org/date-picker';
import { getLocalTimeZone, today } from '@internationalized/date'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"

export default function Form() {
  const router = useRouter();
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<FileList | null>(null);

  function handleRecipientsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target 
    if (target === null) {
      throw new Error("target is null")
    }
    setRecipients(target.value)
  }

  function handleSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target 
    if (target === null) {
      throw new Error("target is null")
    }
    setSubject(target.value)
  }

  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const target = e.target 
    if (target === null) {
      throw new Error("target is null")
    }
    setBody(target.value)
  }

  function handleAttachmentsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target 
    if (files === null) {
      throw new Error("target is null")
    }
    const selected = files as FileList;
    setAttachments(selected)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('recipients', recipients);
    formData.append('subject', subject);
    formData.append('body', body);

    const fileNameArr = [];
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        if (attachment.size > 0) {
          fileNameArr.push(attachment.name);
        }
      }
    }

    const fileNameStr = fileNameArr.join(',');
    formData.append('attachments', fileNameStr);
    formData.append('status', 'active');

    const response = await fetch(`${URL}/auth/users/me/policies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      const createJson = await response.json();
      const policyId = createJson.id;
      // Call to file upload api
    }
  }
  
  return (
    <form action={createPolicy}>
      <div className="rounded-sm bg-gray-800 p-4 md:p-6">
        {/* Recipients */}
        <div className="mb-4">
          <label htmlFor="recipients" className="mb-2 block text-sm font-medium text-green-400">
            Enter the recipients of your Dead Man's Switch policy (space separated)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="recipients"
                name="recipients"
                type="string"
                value={recipients}
                onChange={handleRecipientsChange}
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
                value={subject}
                onChange={handleSubjectChange}
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
                value={body}
                onChange={handleBodyChange}
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
                onChange={handleAttachmentsChange}
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
            </div>
          </div>
        </div>
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
