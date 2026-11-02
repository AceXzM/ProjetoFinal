import { validarCPF } from '../utils/cpf';

/** Objeto de domínio: estado privado e somente leitura pública. */
export class Usuario {
  #nome: string;
  #email: string;
  #cpf: string;

  constructor(nome: string, email: string, cpf: string) {
    const nomeNormalizado = nome.trim().replace(/\s+/g, ' ');
    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = cpf.replace(/\D/g, '');
    if (nomeNormalizado.length < 2 || nomeNormalizado.length > 120) throw new Error('Nome deve ter entre 2 e 120 caracteres.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado) || emailNormalizado.length > 254) throw new Error('E-mail inválido.');
    if (!validarCPF(cpfNormalizado)) throw new Error('CPF inválido.');
    this.#nome = nomeNormalizado;
    this.#email = emailNormalizado;
    this.#cpf = cpfNormalizado;
  }

  get nome(): string { return this.#nome; }
  get email(): string { return this.#email; }
  get cpf(): string { return this.#cpf; }
  // Sem setters: alteração apenas via regras explícitas de negócio.
}
