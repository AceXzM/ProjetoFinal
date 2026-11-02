import { Router } from 'express';
import { z } from 'zod';
import { validarCPF } from '../utils/cpf';
import { ApiError, UserService } from '../services/UserService';

export const usersRouter = Router();

const schema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório.' }).trim().min(2, 'Informe pelo menos 2 caracteres.').max(120),
  email: z.string({ required_error: 'E-mail é obrigatório.' }).trim().email('E-mail inválido.').max(254),
  cpf: z.string({ required_error: 'CPF é obrigatório.' }).refine(validarCPF, 'CPF inválido.'),
  senha: z.string({ required_error: 'Senha é obrigatória.' })
    .min(8, 'Senha deve ter pelo menos 8 caracteres.')
    .max(72, 'Senha deve ter no máximo 72 caracteres.')
    .regex(/[A-Z]/, 'Senha precisa de letra maiúscula.')
    .regex(/[a-z]/, 'Senha precisa de letra minúscula.')
    .regex(/\d/, 'Senha precisa de número.')
    .regex(/[^A-Za-z0-9]/, 'Senha precisa de caractere especial.'),
}).strict();

usersRouter.post('/', async (req, res, next) => {
  try {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      res.status(400).json({ message: 'Verifique os dados informados.', errors: resultado.error.flatten().fieldErrors });
      return;
    }
    const usuario = await UserService.cadastrar(resultado.data);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso.', usuario });
  } catch (error) {
    next(error instanceof Error ? error : new ApiError(500, 'Erro interno.'));
  }
});
