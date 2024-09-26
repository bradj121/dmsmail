import { LuUnplug } from "react-icons/lu";
import { PiPlugsConnectedBold } from "react-icons/pi";
import clsx from 'clsx';

export default function PolicyStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === "active",
          'bg-green-500 text-white': status === "inactive",
        },
      )}
    >
      {status === "active" ? (
        <>
          Inactive
          <LuUnplug className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === "inactive" ? (
        <>
          Active
          <PiPlugsConnectedBold className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
