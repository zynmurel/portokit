export function SectionLabel({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="text-foreground/70 flex flex-row items-center gap-5 font-mono text-xs tracking-[0.3em] uppercase">
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        <span className="text-foreground/60">[{index}]</span>
        <span>{label}</span>
      </div>
      <div className="border-foreground/70 flex-1 border-b-2" />
    </div>
  );
}
