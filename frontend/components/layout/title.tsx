import { ZapIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export function Title({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-10">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary">
        <ZapIcon className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
