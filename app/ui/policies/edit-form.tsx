'use client';

import { Policy } from '@/app/lib/definitions';
import {
  DocumentIcon,
  PencilSquareIcon,
  UserCircleIcon,
  PaperClipIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { LuUnplug } from "react-icons/lu";
import { PiPlugsConnectedBold } from "react-icons/pi";
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updatePolicy } from '@/app/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"

export default function EditPolicyForm({
  policy,
}: {
  policy: Policy;
}) {
  const router = useRouter();
  const options = [{value: 'active', label: 'Active'}, {value: 'inactive', label: 'Inactive'}]
  const updatePolicyWithId = updatePolicy.bind(null, policy.id);

  // Expect comma separated string
  const initialAttachments = (policy.attachments as unknown as string).split(',');

  var initialState: any[] | (() => any[]) = [];
  if (initialAttachments[0] === '') {
    initialState = [];
  } else {
    initialState = initialAttachments;
  }

  const [attachmentList, setAttachmentList] = useState(initialState);
  const [expirationDate, setExpirationDate] = useState<Date>(new Date(policy.expiration_date));
  const [recipients, setRecipients] = useState(policy.recipients);
  const [subject, setSubject] = useState(policy.subject);
  const [body, setBody] = useState(policy.body);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [status, setStatus] = useState(policy.status);

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

  function handleExpirationDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target 
    if (target === null) {
      throw new Error("target is null")
    }
    setExpirationDate(new Date(target.value))
  }

  function handleAttachmentsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target 
    if (files === null) {
      throw new Error("target is null")
    }
    const selected = files as FileList;
    setAttachments(selected)
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target 
    if (target === null) {
      throw new Error("target is null")
    }
    setStatus(target.value)
  }

  function handleClick(attachment: string) {
    console.log(`Deleting attachment: ${attachment} sucka`);

    setAttachmentList(attachmentList.filter((a) => (a !== attachment)))
    console.log(`current attachments: ${attachmentList}`)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    console.log(recipients);
    console.log(subject);
    console.log(body);
    console.log(expirationDate);
    console.log(attachments);
    console.log(fileNameStr);
    console.log(status);

    const response = await fetch(`${URL}/auth/users/me/policies`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify({
        id: policy.id,
        recipients: recipients,
        subject: subject,
        body: body,
        expiration_date: expirationDate.toLocaleDateString(),
        attachments: fileNameStr,
        status: status
      })
    })

    if (response.ok && attachments) {
      const createJson = await response.json();
      const policyId = createJson.id;
      const uploadFormData = new FormData();
      uploadFormData.append('policy_id', policyId)
      for (let i = 0; i < attachments.length; i++) {
        uploadFormData.append('files', attachments[i])
      }
      // Call to file upload api
      const fileUploadResponse = await fetch(`${URL}/auth/users/me/policies/files`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        },
        body: uploadFormData
      })
      console.log(fileUploadResponse)
      if (fileUploadResponse.ok) {
        router.push("/dashboard/policies")
      } else {
        alert('Failed to attach files to policy.')
        console.error(fileUploadResponse)
        router.push("/dashboard/policies")
      }
    } else {
      router.push("/dashboard/policies")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-800 p-4 md:p-6">
        {/* Recipients */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Enter the recipients of your Dead Man's Switch policy (space separated)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
                id="recipients"
                name="recipients"
                defaultValue={policy.recipients}
                value={recipients}
                onChange={handleRecipientsChange}
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
                defaultValue={policy.subject}
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
                placeholder="Enter email body"
                rows={10}
                defaultValue={policy.body}
                value={body}
                onChange={handleBodyChange}
                className="peer block w-full rounded-sm border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Existing Attachments */}
        <div className="mb-4">
          <label htmlFor="currentAttachments" className="mb-2 block text-sm font-medium text-green-400">
            Current Collateral
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <ul>
                {attachmentList.map(attachment => (
                    <li key={attachment} className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-start gap-3">
                            <button type="button" className="rounded-md border p-2 hover:bg-gray-100" onClick={handleClick.bind(null, attachment)}>
                                <span className="sr-only">Delete Collateral</span>
                                <TrashIcon className="w-5" />
                            </button>
                            <label>{attachment}</label>
                        </div>
                    </li>
                ))}
              </ul>
              <input type="hidden" id="existingAttachments" name="existingAttachments" value={attachmentList} />
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

        {/* Dead man's Expiration Date */}
        <div className="mb-4">
          <label htmlFor="expirationDate" className="mb-2 block text-sm font-medium text-green-400">
            Enter the date after which the dead man's switch will trigger and the email will be sent
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
                type="date"
                id="expirationDate"
                name="expirationDate"
                defaultValue={expirationDate.toISOString().substring(0,10)}
                onChange={handleExpirationDateChange}
              />
            </div>
          </div>
        </div>

        {/* Policy Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the policy status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="inactive"
                  name="status"
                  type="radio"
                  value="inactive"
                  defaultChecked={policy.status === 'inactive'}
                  onChange={handleStatusChange}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="inactive"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Inactive <LuUnplug className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="active"
                  name="status"
                  type="radio"
                  value="active"
                  defaultChecked={policy.status === 'active'}
                  onChange={handleStatusChange}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="active"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Active <PiPlugsConnectedBold className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/policies"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
