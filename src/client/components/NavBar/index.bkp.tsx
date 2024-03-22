import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import SearchDialog from "$components/SearchDialog";
import useModal from "$lib/useModal";

export default function NabBar() {
  const mount = useModal();

  return (
    <div className="w-full mt-8 px-4 lg:px-8 2xl:px-16">
      <div className="self-start bg-[#33333388] backdrop-blur-xl rounded overflow-hidden flex flex-col flex-1 drop-shadow-xl">
        <div className="flex text-zinc-200 items-center p-3 px-5 gap-4">
          <MagnifyingGlassIcon
            width={20}
            height={20}
            className="text-zinc-400"
          />
          <input
            className="flex-1 bg-transparent font-light outline-none"
            placeholder="Start typing to search for movies and TV shows"
            onFocus={(e) => {
              e.preventDefault();
              mount((_, unmount) => <SearchDialog onClose={unmount} />);
            }}
          />
        </div>
      </div>
    </div>
  );
}
