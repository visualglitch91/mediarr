import type { Network } from "$lib/discover";
import { Link } from "wouter";

export default function NetworkCard({ name }: Network) {
  return (
    <Link href={`/discover/network/${name}`}>
      <a className="block border rounded-xl h-52 w-96 bg-zinc-900 border-stone-700 cursor-pointer p-12 text-zinc-300 hover:text-amber-200 transition-all relative group selectable flex-shrink-0 max-w-[100%]">
        <div
          className="absolute inset-10 bg-zinc-300 sm:hover:bg-amber-200 sm:group-hover:scale-105 transition-all"
          style={{
            maskImage: `url('/networks/${name}.svg')`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </a>
    </Link>
  );
}
