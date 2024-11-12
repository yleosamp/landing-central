'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../RegistrationPage.css'

export default function RegistrationPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Step 1 fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 fields
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [cidade, setCidade] = useState('')
  const [enderecoMaps, setEnderecoMaps] = useState('')
  const [precoMedio, setPrecoMedio] = useState(0)
  const [totalSemanal, setTotalSemanal] = useState(0)
  const [imagemBanner, setImagemBanner] = useState(null)
  const [imagemAvatar, setImagemAvatar] = useState(null)
  const [horarioAbertura, setHorarioAbertura] = useState('')
  const [horarioFechamento, setHorarioFechamento] = useState('')
  const [CNPJ, setCNPJ] = useState('')

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('nome', nome)
    formData.append('endereco', endereco)
    formData.append('cidade', cidade)
    formData.append('enderecoMaps', enderecoMaps)
    formData.append('precoMedio', precoMedio.toString())
    formData.append('totalSemanal', totalSemanal.toString())
    formData.append('horarioFuncionamento', `${horarioAbertura} - ${horarioFechamento}`)
    formData.append('abertoFechado', '1')
    formData.append('nivelUsuario', '2')
    formData.append('nivelEmpresa', '1')
    formData.append('CNPJ', CNPJ)
    if (imagemBanner) formData.append('imagemBanner', imagemBanner)
    if (imagemAvatar) formData.append('imagemAvatar', imagemAvatar)

    try {
      const response = await fetch('http://168.138.151.78:3000/api/autenticacao/registro', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.token) {
        const authorization = `Bearer ${data.token}`
        localStorage.setItem('authorization', authorization)
        navigate('/empresa', { 
          state: { token: authorization }
        })
      } else {
        setError(data.message || 'Erro ao registrar. Por favor, tente novamente.')
      }
    } catch (error) {
      setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">Registro de Empresa</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="registration-form">
          {step === 1 ? (
            <>
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
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="submit-button">
                Próximo
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="nome">Nome da Empresa</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Nome da Empresa"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input
                  id="endereco"
                  type="text"
                  placeholder="Endereço da Empresa"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  type="text"
                  placeholder="Cidade da Empresa"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="enderecoMaps">Link do Mapa</label>
                <input
                  id="enderecoMaps"
                  type="text"
                  placeholder="Link do Google Maps"
                  value={enderecoMaps}
                  onChange={(e) => setEnderecoMaps(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="precoMedio">Preço Médio</label>
                <input
                  id="precoMedio"
                  type="number"
                  placeholder="Preço Médio"
                  value={precoMedio}
                  onChange={(e) => setPrecoMedio(Number(e.target.value))}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="totalSemanal">Total Semanal</label>
                <input
                  id="totalSemanal"
                  type="number"
                  placeholder="Total Semanal"
                  value={totalSemanal}
                  onChange={(e) => setTotalSemanal(Number(e.target.value))}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="imagemBanner">Imagem Banner</label>
                <input
                  id="imagemBanner"
                  type="file"
                  onChange={(e) => setImagemBanner(e.target.files ? e.target.files[0] : null)}
                  required
                  className="form-input"
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="imagemAvatar">Imagem Avatar</label>
                <input
                  id="imagemAvatar"
                  type="file"
                  onChange={(e) => setImagemAvatar(e.target.files ? e.target.files[0] : null)}
                  required
                  className="form-input"
                />
              </div> */}
              <div className="form-group">
                <label htmlFor="horarioAbertura">Horário de Abertura</label>
                <input
                  id="horarioAbertura"
                  type="time"
                  value={horarioAbertura}
                  onChange={(e) => setHorarioAbertura(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="horarioFechamento">Horário de Fechamento</label>
                <input
                  id="horarioFechamento"
                  type="time"
                  value={horarioFechamento}
                  onChange={(e) => setHorarioFechamento(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="CNPJ">CNPJ</label>
                <input
                  id="CNPJ"
                  type="text"
                  placeholder="CNPJ da Empresa"
                  value={CNPJ}
                  onChange={(e) => setCNPJ(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrar'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}