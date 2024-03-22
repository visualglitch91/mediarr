import { ChevronLeftIcon } from "@radix-ui/react-icons";
import CardGrid from "$components/CardGrid";

export default function GridPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pt-24 p-8 bg-black">
        <div className="flex flex-col gap-1 items-start">
          <button
            className="flex items-center cursor-pointer hover:text-zinc-200 text-zinc-400 transition-colors"
            onClick={() => window?.history?.back()}
          >
            <ChevronLeftIcon width={18} height={18} />
            <h2 className="text-sm">Back</h2>
          </button>
          <h1 className="font-bold text-5xl">{title}</h1>
        </div>
      </div>

      <div className="p-8">
        <CardGrid>{children}</CardGrid>
      </div>
    </>
  );
}
