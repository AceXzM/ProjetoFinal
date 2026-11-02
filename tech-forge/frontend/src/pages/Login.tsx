import { Link, useSearchParams } from 'react-router-dom';
export default function Login() {
  const [params] = useSearchParams();
  return <main className="container"><div className="panel">
    <h1>Tech Forge</h1><h2>Login</h2>
    {params.get('cadastro') === 'sucesso' && <p className="success" role="status">Cadastro realizado! Faça login quando a autenticação estiver implementada.</p>}
    <p>A tela de login é apenas um destino de navegação. O escopo solicitado não inclui autenticação.</p>
    <Link to="/cadastro">Voltar ao cadastro</Link>
  </div></main>;
}
