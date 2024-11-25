import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Step 1 fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 fields
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [precoMedio, setPrecoMedio] = useState('');
  const [imagemBanner, setImagemBanner] = useState(null);
  const [horarioAbertura, setHorarioAbertura] = useState('');
  const [horarioFechamento, setHorarioFechamento] = useState('');
  const [CNPJ, setCNPJ] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setStep(2);
  };

  const formatarCNPJ = (value) => {
    const apenasNumeros = value.replace(/\D/g, '');
    if (apenasNumeros.length <= 14) {
      return apenasNumeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleCNPJChange = (event) => {
    const formattedCNPJ = formatarCNPJ(event.target.value);
    setCNPJ(formattedCNPJ);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação do preço médio
    const precoMedioNumerico = parseFloat(precoMedio) || 0; // Se não for um número válido, usa 0

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nome', nome);
    formData.append('endereco', endereco);
    formData.append('cidade', cidade);
    formData.append('enderecoMaps', '');
    formData.append('precoMedio', precoMedioNumerico.toString()); // Converte para string após validação
    formData.append('totalSemanal', '0'); // Valor padrão para evitar string vazia
    formData.append('horarioFuncionamento', `${horarioAbertura} - ${horarioFechamento}`);
    formData.append('abertoFechado', '1');
    formData.append('nivelUsuario', '2');
    formData.append('nivelEmpresa', '1');
    formData.append('CNPJ', CNPJ);
    if (imagemBanner) formData.append('imagemBanner', imagemBanner);

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/registro', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const authorization = `Bearer ${data.token}`;
        localStorage.setItem('authorization', authorization);
        navigate('/empresa');
      } else {
        setError(data.message || 'Erro ao registrar. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registro de Empresa</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} style={styles.form}>
          {step === 1 ? (
            <>
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
              <div style={styles.inputGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>Confirmar Senha</label>
                <div style={styles.inputContainer}>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>🔒</span>
                </div>
              </div>
              <button type="submit" style={styles.button}>
                Próximo
              </button>
            </>
          ) : (
            <>
              <div style={styles.inputGroup}>
                <label htmlFor="nome" style={styles.label}>Nome da Empresa</label>
                <div style={styles.inputContainer}>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Nome da Empresa"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>🏢</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="endereco" style={styles.label}>Endereço</label>
                <div style={styles.inputContainer}>
                  <input
                    id="endereco"
                    type="text"
                    placeholder="Endereço da Empresa"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>📍</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="cidade" style={styles.label}>Cidade</label>
                <div style={styles.inputContainer}>
                  <input
                    id="cidade"
                    type="text"
                    placeholder="Cidade da Empresa"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>🌆</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="precoMedio" style={styles.label}>Preço Médio</label>
                <div style={styles.inputContainer}>
                  <input
                    id="precoMedio"
                    type="number"
                    placeholder="Preço Médio"
                    value={precoMedio}
                    onChange={(e) => setPrecoMedio(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>💰</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="imagemBanner" style={styles.label}>Imagem Banner</label>
                <div style={styles.inputContainer}>
                  <label htmlFor="imagemBanner" style={styles.fileInputLabel}>
                    <span style={styles.icon}>🖼️</span>
                    {imagemBanner ? imagemBanner.name : 'Escolher arquivo...'}
                  </label>
                  <input
                    id="imagemBanner"
                    type="file"
                    onChange={(e) => setImagemBanner(e.target.files ? e.target.files[0] : null)}
                    required
                    accept="image/*"
                    style={styles.fileInputHidden}
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="horarioAbertura" style={styles.label}>Horário de Abertura</label>
                <div style={styles.inputContainer}>
                  <input
                    id="horarioAbertura"
                    type="time"
                    value={horarioAbertura}
                    onChange={(e) => setHorarioAbertura(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>🌅</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="horarioFechamento" style={styles.label}>Horário de Fechamento</label>
                <div style={styles.inputContainer}>
                  <input
                    id="horarioFechamento"
                    type="time"
                    value={horarioFechamento}
                    onChange={(e) => setHorarioFechamento(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>🌙</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="CNPJ" style={styles.label}>CNPJ</label>
                <div style={styles.inputContainer}>
                  <input
                    id="CNPJ"
                    type="text"
                    placeholder="CNPJ da Empresa"
                    value={CNPJ}
                    onChange={handleCNPJChange}
                    required
                    style={styles.input}
                  />
                  <span style={styles.icon}>📄</span>
                </div>
              </div>
              <button type="submit" style={styles.button} disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrar'}
              </button>
            </>
          )}
        </form>
      </div>
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
  fileInput: {
    width: '100%',
    padding: '0.5rem 1rem',
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
  fileInputLabel: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.5rem 1rem 0.5rem 2.5rem',
    backgroundColor: '#27272a',
    border: '1px solid #3f3f46',
    color: '#d4d4d8',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    position: 'relative',
    minHeight: '2.5rem',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: '#3f3f46',
      borderColor: '#52525b',
    },
  },
  fileInputHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0',
  },
};

export default RegistrationPage;