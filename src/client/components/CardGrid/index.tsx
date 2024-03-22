export default function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {children}
    </div>
  );
}
