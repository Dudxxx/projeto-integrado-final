import type { InputHTMLAttributes } from 'react';
export function TextField({label,error,...props}:{label:string;error?:string}&InputHTMLAttributes<HTMLInputElement>){return <label className="field"><span>{label}</span><input {...props}/>{error&&<small className="field-error">{error}</small>}</label>;}
