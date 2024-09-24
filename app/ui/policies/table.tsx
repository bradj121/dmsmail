import Image from 'next/image';
import { UpdatePolicy, DeletePolicy } from '@/app/ui/policies/buttons';
import InvoiceStatus from '@/app/ui/policies/status';
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
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {policies?.map((policy: Policy) => (
              <div
                key={policy.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src=""  //{policy.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt="" // {`${policy.name}'s profile picture`}
                      />
                      <p>{policy.subject}</p>
                    </div>
                    <p className="text-sm text-gray-500">{policy.recipients}</p>
                  </div>
                  {/* <InvoiceStatus status={policy.is_active} /> */}
                </div>
                {/* <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(policy.amount)}
                    </p>
                    <p>{formatDateToLocal(policy.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdatePolicy id={policy.id} />
                    <DeletePolicy id={policy.id} />
                  </div>
                </div> */}
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {policies?.map((policy: Policy) => (
                <tr
                  key={policy.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src=""  // {policy.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        // alt={`${policy.name}'s profile picture`}
                        alt="test"
                      />
                      <p>{policy.subject}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {policy.recipients}
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(policy.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(policy.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={policy.is_active} />
                  </td> */}
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
