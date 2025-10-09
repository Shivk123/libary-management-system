import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className={`mb-8 ${actions ? 'flex justify-between items-center' : ''}`}>
      <div>
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-xl font-sans text-muted-foreground">
          {description}
        </p>
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}