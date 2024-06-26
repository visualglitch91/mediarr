import { Link } from "wouter";
import type { Genre } from "$lib/discover";

export default function GenreCard({ genre }: { genre: Genre }) {
  return (
    <Link
      href={`/genre/${genre.key}`}
      className="rounded-xl overflow-hidden relative shadow-2xl shrink-0 aspect-[21/9] selectable h-40 block max-w-[100%]"
    >
      <div className="h-full w-full flex flex-col items-center justify-center cursor-pointer p-2 px-3 relative z-[1] peer hover:text-white sm:hover:text-current">
        <h1 className="font-bold text-2xl tracking-wider">{genre.title}</h1>
      </div>
      <div
        style={{ backgroundImage: `url('/genres/${genre.key}.jpg')` }}
        className="absolute inset-0 bg-center bg-cover sm:peer-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-darken bg-opacity-60" />
    </Link>
  );
}
