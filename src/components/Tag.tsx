import { cn } from "@lib/utils";

interface Props {
  isActive: () => boolean;
  text: string;
  onClick?: () => void;
}

function Tag({ isActive, text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      class={cn(
        isActive() ? "bg-accent" : "bg-secondary",
        isActive() ? "text-main" : "text-white",
        "relative grid select-none items-center whitespace-nowrap rounded-lg  py-1.5 px-3 font-sans text-xs font-bold uppercase"
      )}
    >
      <span class="">{text}</span>
    </button>
  );
}

export default Tag;
