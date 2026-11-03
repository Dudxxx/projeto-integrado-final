import type { ReactNode, SelectHTMLAttributes } from 'react';
export function SelectField({label,children,...props}:{label:string;children:ReactNode}&SelectHTMLAttributes<HTMLSelectElement>){return <label className="field"><span>{label}</span><select {...props}>{children}</select></label>;}
