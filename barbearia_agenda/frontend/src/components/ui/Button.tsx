import type { ButtonHTMLAttributes, ReactNode } from 'react';
export function Button({children,variant='primary',...props}:{children:ReactNode;variant?:'primary'|'secondary'|'danger'}&ButtonHTMLAttributes<HTMLButtonElement>){return <button className={`btn btn-${variant}`} {...props}>{children}</button>;}
