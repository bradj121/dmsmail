'use client';

import { UpdatePolicy } from '@/app/ui/policies/buttons';
import { TrashIcon } from '@heroicons/react/24/outline';
import PolicyStatus from '@/app/ui/policies/status';
import { formatDateToLocal } from '@/app/lib/utils';
import { Policy } from '@/app/lib/definitions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Countdown from './timer';

const URL = process.env.API_URL ? `https://${process.env.API_URL}/api` : "http://localhost:3000/api"

export default function PoliciesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [policies, setPolicies] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    fetchFilteredPolicies(query, currentPage)
  }, [])

  async function fetchFilteredPolicies(query: string, currentPage: number) {
    try {
      const response = await fetch(`${URL}/auth/users/me/policies`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        },
      })
      if (response.ok) {
        const policiesJson = await response.json();
        setPolicies(policiesJson);
      }
    } catch(error) {
      console.error("Failed to get policies for user ", error)
    }
  }

  async function deletePolicy(policyId: number) {
    try {
      const response = await fetch(`${URL}/auth/users/me/policies/${policyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        }
      })
      if (response.ok) {
        alert(`Policy ${policyId} deleted`)
        fetchFilteredPolicies(query, currentPage)
        router.push("/dashboard/policies")
      }

    } catch(error) {
      console.error(`Failed to delete policy ${policyId}`, error)
    }
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-sm bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden">
            {policies?.map((policy: Policy) => (
              <div
                key={policy.id}
                className="mb-2 w-full rounded-sm bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-sm">{policy.recipients}</p>
                  <PolicyStatus status={policy.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      test {/* {formatCurrency(policy.amount)} */}
                    </p>
                    <p>
                      test {/* {formatDateToLocal(policy.date)} */}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePolicy id={policy.id} />
                    <button 
                        className="rounded-md border p-2 hover:bg-gray-100"
                        onClick={async () => await deletePolicy(policy.id)}>
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="w-5" />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-sm text-left text-md text-green-400 font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Recipients
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Subject
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Expiration Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Time to Trigger
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-yellow-50">
              {policies?.map((policy: Policy) => (
                <tr
                  key={policy.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {policy.recipients}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {policy.subject}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    { formatDateToLocal(policy.expiration_date) }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Countdown targetDate={new Date(policy.expiration_date)} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PolicyStatus status={policy.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePolicy id={policy.id} />
                      <button 
                        className="rounded-md border p-2 hover:bg-gray-100"
                        onClick={async () => await deletePolicy(policy.id)}>
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
