export const EMAIL_REGEX=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const normalizeCpf=(value:string)=>value.replace(/\D/g,'');
export const isCpfValid=(value:string)=>{const cpf=normalizeCpf(value);if(cpf.length!==11||/^([0-9])\1{10}$/.test(cpf))return false;const digit=(base:string,factor:number)=>{const sum=[...base].reduce((acc,d,i)=>acc+Number(d)*(factor-i),0);const rest=(sum*10)%11;return rest===10?0:rest;};return digit(cpf.slice(0,9),10)===Number(cpf[9])&&digit(cpf.slice(0,10),11)===Number(cpf[10]);};
export const isStrongPassword=(value:string)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
