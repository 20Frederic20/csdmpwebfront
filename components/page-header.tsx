interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-5xl mx-auto">
      <h1 className="font-bold text-lg tracking-tight text-foreground">{title}</h1>
      <div className="w-10" />
    </div>
  );
}
