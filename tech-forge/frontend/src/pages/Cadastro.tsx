/// <reference types="vite/client" />
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validarCPF } from '../utils/cpf';

type Campos = { nome: string; email: string; cpf: string; senha: string; confirmarSenha: string };
type Chave = keyof Campos;
const vazio: Campos = { nome: '', email: '', cpf: '', senha: '', confirmarSenha: '' };
const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function formatarCPF(value: string) {
  const n = value.replace(/\D/g, '').slice(0, 11);
  return n.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function validar(c: Campos): Partial<Record<Chave, string>> {
  const e: Partial<Record<Chave, string>> = {};
  if (c.nome.trim().length < 2 || c.nome.trim().length > 120) e.nome = 'Informe um nome entre 2 e 120 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()) || c.email.length > 254) e.email = 'Digite um e-mail válido.';
  if (!validarCPF(c.cpf)) e.cpf = 'CPF inválido.';
  if (c.senha.length < 8 || c.senha.length > 72 || !/[A-Z]/.test(c.senha) || !/[a-z]/.test(c.senha) || !/\d/.test(c.senha) || !/[^A-Za-z0-9]/.test(c.senha)) {
    e.senha = 'Use 8 a 72 caracteres, com maiúscula, minúscula, número e símbolo.';
  }
  if (c.confirmarSenha !== c.senha) e.confirmarSenha = 'As senhas não coincidem.';
  return e;
}

export default function Cadastro() {
  const [campos, setCampos] = useState<Campos>(vazio);
  const [erros, setErros] = useState<Partial<Record<Chave, string>>>({});
  const [erroAPI, setErroAPI] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function alterar(chave: Chave, valor: string) {
    setCampos(c => ({ ...c, [chave]: chave === 'cpf' ? formatarCPF(valor) : valor }));
    setErros(e => ({ ...e, [chave]: undefined }));
    setErroAPI('');
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const encontrados = validar(campos);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;
    setEnviando(true);
    setErroAPI('');
    try {
      const response = await fetch(`${api}/api/usuarios`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: campos.nome, email: campos.email, cpf: campos.cpf.replace(/\D/g, ''), senha: campos.senha }),
      });
      const data: { message?: string; errors?: Partial<Record<Chave, string[]>> } = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const fieldErrors: Partial<Record<Chave, string>> = {};
          (Object.keys(data.errors) as Chave[]).forEach(k => { fieldErrors[k] = data.errors?.[k]?.[0]; });
          setErros(fieldErrors);
        }
        setErroAPI(data.message ?? 'Não foi possível cadastrar.');
        return;
      }
      navigate('/login?cadastro=sucesso', { replace: true });
    } catch {
      setErroAPI('Não foi possível conectar à API. Verifique se o servidor está ativo.');
    } finally { setEnviando(false); }
  }

  const itens: { chave: Chave; titulo: string; tipo: string; autoComplete: string }[] = [
    { chave: 'nome', titulo: 'Nome completo', tipo: 'text', autoComplete: 'name' },
    { chave: 'email', titulo: 'E-mail', tipo: 'email', autoComplete: 'email' },
    { chave: 'cpf', titulo: 'CPF', tipo: 'text', autoComplete: 'off' },
    { chave: 'senha', titulo: 'Senha', tipo: 'password', autoComplete: 'new-password' },
    { chave: 'confirmarSenha', titulo: 'Confirmar senha', tipo: 'password', autoComplete: 'new-password' },
  ];

  return <main className="container"><section className="panel">
    <p className="eyebrow">TECH FORGE</p><h1>Crie sua conta</h1><p className="muted">Preencha os campos para se cadastrar.</p>
    <form onSubmit={enviar} noValidate>
      {itens.map(({ chave, titulo, tipo, autoComplete }) => <div className="field" key={chave}>
        <label htmlFor={chave}>{titulo}</label>
        <input id={chave} type={tipo} autoComplete={autoComplete} required value={campos[chave]}
          placeholder={chave === 'cpf' ? '000.000.000-00' : undefined}
          maxLength={chave === 'cpf' ? 14 : chave === 'nome' ? 120 : chave === 'email' ? 254 : 72}
          aria-invalid={Boolean(erros[chave])} aria-describedby={erros[chave] ? `${chave}-erro` : undefined}
          onChange={e => alterar(chave, e.target.value)} />
        {erros[chave] && <small id={`${chave}-erro`} className="error">{erros[chave]}</small>}
      </div>)}
      {erroAPI && <p className="api-error" role="alert">{erroAPI}</p>}
      <button type="submit" disabled={enviando}>{enviando ? 'Cadastrando...' : 'Cadastrar'}</button>
    </form>
    <p className="footer">Já tem conta? <Link to="/login">Ir para login</Link></p>
  </section></main>;
}
