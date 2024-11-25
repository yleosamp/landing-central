import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, codigoVerificacao: null }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setShowVerificationModal(true);
        setError('');
      } else if (response.ok) {
        handleSuccessfulLogin(data);
      } else {
        setError(data.message || 'Erro ao fazer login. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, codigoVerificacao: parseInt(verificationCode) }),
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccessfulLogin(data);
      } else {
        setError(data.message || 'Erro ao verificar o código. Por favor, tente novamente.');
      }
    } catch (error) {
      setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    const authorization = `Bearer ${data.token}`;
    localStorage.setItem('authorization', authorization);
    navigate('/empresa');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bem-vindo de volta</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <input
                id="email"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              <span style={styles.icon}>✉️</span>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Senha</label>
            <div style={styles.inputContainer}>
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <span style={styles.icon}>🔒</span>
            </div>
          </div>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Continuar'}
          </button>
        </form>
      </div>

      {showVerificationModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Digite o código de verificação</h3>
            <p style={styles.modalSubtitle}>
              Um código de 6 dígitos foi enviado para seu email
            </p>
            <form onSubmit={handleVerificationSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    // Permite apenas números e limita a 6 dígitos
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  required
                  style={{
                    ...styles.input,
                    textAlign: 'center',
                    letterSpacing: '0.5em',
                    fontSize: '1.5rem',
                    padding: '0.75rem 1rem'
                  }}
                  maxLength={6}
                />
              </div>
              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  opacity: verificationCode.length === 6 ? 1 : 0.7,
                }} 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verificando...' : 'Verificar código'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '24rem',
    border: '1px solid #27272a',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#7f1d1d',
    border: '1px solid #991b1b',
    color: '#fecaca',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#d4d4d8',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem 0.5rem 2.5rem',
    backgroundColor: '#27272a',
    border: '1px solid #3f3f46',
    color: '#fff',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  icon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  button: {
    width: '92%',
    backgroundColor: '#16a34a',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '24rem',
    border: '1px solid #27272a',
    animation: 'modalFadeIn 0.3s ease-out',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: '0.875rem',
    color: '#71717a',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
};

export default LoginPage;