import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      email,
      password,
      codigoVerificacao: verificationCode ? parseInt(verificationCode) : null
    };

    try {
      const response = await fetch('http://localhost:4444/api/autenticacao/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Login successful, store token and redirect to /businessManagement
        const authorization = `Bearer ${data.token}`;
        localStorage.setItem('authorization', authorization);
        navigate('/empresa', { 
          state: { token: authorization }
        });
      } else {
        setError(data.message || 'Erro ao fazer login. Por favor, tente novamente.');
      }
    } catch (error) {
      setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="verificationCode">Código de Verificação</label>
            <input
              id="verificationCode"
              type="text"
              placeholder="Deixe vazio para enviar"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;