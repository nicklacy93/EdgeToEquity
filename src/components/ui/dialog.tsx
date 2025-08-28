'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40' />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 grid w-full max-w-lg gap-4 border border-zinc-700 bg-black p-6 text-white shadow-xl rounded-xl',
        'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className='absolute right-4 top-4 text-zinc-400 hover:text-white'>
        <X className='h-5 w-5' />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = 'DialogContent';

export { Dialog, DialogTrigger, DialogContent };
