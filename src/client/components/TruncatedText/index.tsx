import { useState } from "react";

export default function TruncatedText({
  text,
  maxLength = 300,
  className,
}: {
  text: string;
  maxLength?: number;
  className?: string;
}) {
  const [viewAll, setViewAll] = useState(false);

  return (
    <p className={className}>
      {text.length > maxLength ? (
        <>
          {viewAll ? text : `${text.slice(0, maxLength).trim()}...`}

          <button
            className="underline hover:text-zinc-100 text-zinc-400"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "View less" : "View all"}
          </button>
        </>
      ) : (
        text
      )}
    </p>
  );
}
