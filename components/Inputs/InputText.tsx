import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export interface InputTextProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, type = 'text', label, error, id, readOnly, disabled, ...props }, ref) => {
    const isReadOnly = readOnly || disabled;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <Label htmlFor={id} className="text-sm font-normal text-slate-800">
            {label}
          </Label>
        )}

        <Input
          id={id}
          ref={ref}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          className={cn(
            // Base
            'w-full h-9 px-2 text-sm shadow-none rounded-sm transition-colors focus-visible:outline-none',
            // Estilo Normal (Editável)
            'bg-white  border-slate-300  focus-visible:ring-1',
            // Estilo para ReadOnly / Disabled (Fundo cinza, sem borda e sem sombra)
            isReadOnly && 'bg-gray-300 text-black cursor-default ',
            className
          )}
          {...props}
        />

        {error && (
          <span className="text-destructive text-xs font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

InputText.displayName = 'InputText';