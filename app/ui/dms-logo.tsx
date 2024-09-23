import { GiBurningSkull } from "react-icons/gi";

export default function DmsLogo() {
  return (
    <div
      className="flex flex-row items-center leading-none text-green-400"
    >
      <GiBurningSkull className="h-12 w-12 rotate-[15deg]" color="green-400" />
      <p className="text-[28px] text-green-400">Dead Mans Switch</p>
    </div>
  );
}
