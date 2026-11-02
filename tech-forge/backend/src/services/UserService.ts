import bcrypt from 'bcryptjs';
import { UniqueConstraintError } from 'sequelize';
import { UserModel } from '../models/UserModel';
import { Usuario } from './Usuario';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export class UserService {
  static async cadastrar(dados: { nome: string; email: string; cpf: string; senha: string }) {
    const usuario = new Usuario(dados.nome, dados.email, dados.cpf);
    // Regras de senha validadas na entrada; hash jamais retornado na resposta.
    const senhaHash = await bcrypt.hash(dados.senha, 12);
    try {
      const criado = await UserModel.create({
        nome: usuario.nome, email: usuario.email, cpf: usuario.cpf, senhaHash,
      });
      return { id: criado.id, nome: criado.nome, email: criado.email, cpf: criado.cpf };
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const fields = Object.keys(error.fields ?? {});
        if (fields.some(field => field.includes('email'))) throw new ApiError(409, 'E-mail já cadastrado.');
        if (fields.some(field => field.includes('cpf'))) throw new ApiError(409, 'CPF já cadastrado.');
        throw new ApiError(409, 'E-mail ou CPF já cadastrado.');
      }
      throw error;
    }
  }
}
