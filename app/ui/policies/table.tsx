import Image from 'next/image';
import { UpdatePolicy, DeletePolicy } from '@/app/ui/policies/buttons';
import PolicyStatus from '@/app/ui/policies/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredPolicies } from '@/app/lib/data';
import { Policy } from '@/app/lib/definitions';

export default async function PoliciesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const policies = await fetchFilteredPolicies(query, currentPage);

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
                    <DeletePolicy id={policy.id} />
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
                    {policy.expirationDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PolicyStatus status={policy.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePolicy id={policy.id} />
                      <DeletePolicy id={policy.id} />
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
