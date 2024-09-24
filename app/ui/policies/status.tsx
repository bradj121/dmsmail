import { LuUnplug } from "react-icons/lu";
import { PiPlugsConnectedBold } from "react-icons/pi";
import clsx from 'clsx';

export default function PolicyStatus({ is_active }: { is_active: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': is_active === false,
          'bg-green-500 text-white': is_active === true,
        },
      )}
    >
      {is_active === false ? (
        <>
          Inactive
          <LuUnplug className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {is_active === true ? (
        <>
          Active
          <PiPlugsConnectedBold className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
