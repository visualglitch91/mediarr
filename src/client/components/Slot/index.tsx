export type Slots<K extends string> = Partial<Record<K, React.ReactNode>>;

export default function Slot<
  T extends Partial<Record<string, React.ReactNode>>
>({
  slots,
  name,
  children,
}: {
  slots: T;
  name: keyof T;
  children?: React.ReactNode;
}) {
  return slots[name] || children || null;
}
