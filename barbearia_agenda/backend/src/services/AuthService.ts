import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository.js';
import { assertCpf, assertEmail, assertPassword, assertRequiredText } from '../utils/validators.js';
import { ConflictError, UnauthorizedError, ValidationError } from '../errors/AppError.js';
import { signAccessToken } from '../utils/jwt.js';

export class AuthService {
    public constructor(private readonly users = new UserRepository()) {}

    public async register(data: {nome:string;email:string;senha:string;cpf:string}) {
        const nome = assertRequiredText(data.nome,'nome',2);
        const email = assertEmail(data.email);
        assertPassword(data.senha);
        const cpf = assertCpf(data.cpf);
        if (await this.users.findByEmail(email)) throw new ConflictError('E-mail já cadastrado.');
        if (await this.users.existsByCpf(cpf)) throw new ConflictError('CPF já cadastrado.');
        const hash = await bcrypt.hash(data.senha, 12);
        const user = await this.users.create({nome,email,cpf,senhaHash:hash,nivel:'USER'});
        return { user: this.serialize(user), token: signAccessToken({sub:String(user.id),email:user.emailAddress,nivel:user.nivel}) };
    }

    public async login(data: {email:string;senha:string}) {
        const email = assertEmail(data.email);
        if (!data.senha) throw new ValidationError('Senha é obrigatória.');
        const user = await this.users.findByEmail(email);
        if (!user || !(await bcrypt.compare(data.senha,user.hash))) throw new UnauthorizedError('E-mail ou senha inválidos.');
        return { user: this.serialize(user), token: signAccessToken({sub:String(user.id),email:user.emailAddress,nivel:user.nivel}) };
    }

    public async me(userId:number) {
        const user=await this.users.findById(userId);
        if(!user) throw new UnauthorizedError('Usuário não encontrado.');
        return this.serialize(user);
    }

    public async updateProfile(userId:number,data:{nome:string;cpf:string;senha:string;email?:string}){
        const nome=assertRequiredText(data.nome,'nome',2); const cpf=assertCpf(data.cpf); assertPassword(data.senha);
        if(data.email!==undefined) throw new ValidationError('O e-mail não pode ser alterado.');
        if(await this.users.existsByCpf(cpf,userId)) throw new ConflictError('CPF já cadastrado por outro usuário.');
        const hash=await bcrypt.hash(data.senha,12); const user=await this.users.updateProfile(userId,{nome,cpf,senhaHash:hash}); return this.serialize(user);
    }

    private serialize(user: Awaited<ReturnType<UserRepository['findById']>> extends infer U ? U extends null ? never : U : never) {
        return { id:user.id, nome:user.nome, email:user.emailAddress, cpf:user.documento, nivel:user.nivel, createdAt:user.created };
    }
}
