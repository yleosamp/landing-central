import '../index.css'; // Ajuste o caminho se necessário
import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Settings, Briefcase } from 'lucide-react'
import ModalCampo from './components/modalv2'; // Importa o componente ModalCampo

interface Agendamento {
  id: number
  idcliente: number
  idcampo: number
  quantidadepessoas: number
  semana: string
  horario: {
    [dia: string]: string[]
  }
  idempresa: number
}

interface Profile {
  id: number
  nomereal: string
}

interface Preco {
  [idcampo: number]: number; // Armazena os preços dos campos
}

const agendamentosIniciais: Agendamento[] = []

export default function InterfaceAgendamento() {
  const [expandido, setExpandido] = useState(false)
  const [agendamentos, setAgendamentos] = useState(agendamentosIniciais)
  const [perfis, setPerfis] = useState<Record<number, Profile>>({}) // Armazena os perfis dos clientes
  const [precos, setPrecos] = useState<Preco>({}) // Armazena os preços dos campos
  const [semanaAtual, setSemanaAtual] = useState(1)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [lucroSemanal, setLucroSemanal] = useState(0) // Armazena o lucro semanal
  const [modalAberto, setModalAberto] = useState(false); // Estado para controlar a abertura do modal

  useEffect(() => {
    const fetchAgendamentos = async () => {
      const response = await fetch('http://localhost:4444/api/businessManagement/agendamentos', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzI3MDQyOTgwfQ.obc2iG__NqWyoUltoN0AFzqI1DByHVAU_CQp7dcDU_A'
        }
      })
      const data = await response.json()
      setAgendamentos(data.agendamentos || []) // Se não existir nenhum agendamento, faça um json vazio

      // Busca os perfis dos clientes
      const perfilPromises = data.agendamentos.map((agendamento: Agendamento) =>
        fetch(`http://localhost:4444/api/accountmanagement/profile/${agendamento.idcliente}`)
          .then(res => res.json())
          .then(profileData => {
            setPerfis(prev => ({ ...prev, [agendamento.idcliente]: profileData.profile }));
          })
      );

      // Busca os preços dos campos
      const precoPromises = data.agendamentos.map((agendamento: Agendamento) =>
        fetch(`http://localhost:4444/api/home/campos/${agendamento.idcampo}`)
          .then(res => res.json())
          .then(precoData => {
            setPrecos(prev => ({ ...prev, [agendamento.idcampo]: precoData[0].preco })); // Armazena o preço
          })
      );

      await Promise.all(perfilPromises);
      await Promise.all(precoPromises);
    }
    fetchAgendamentos()
  }, [])

  useEffect(() => {
    setLucroSemanal(agendamentos.reduce((total, agendamento) => total + (precos[agendamento.idcampo] || 0), 0));
  }, [agendamentos, precos]);

  const toggleExpandido = () => {
    setExpandido(!expandido)
  }

  const toggleDropdown = () => {
    setDropdownAberto(!dropdownAberto)
  }

  const selecionarSemana = (semana: number) => {
    setSemanaAtual(semana)
    setDropdownAberto(false)
  }

  const apagarAgendamento = async (id: number) => {
    const response = await fetch(`http://localhost:4444/api/businessManagement/delete-agendamento/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzI3MDQyOTgwfQ.obc2iG__NqWyoUltoN0AFzqI1DByHVAU_CQp7dcDU_A'
      }
    })
    if (response.ok) {
      setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id))
    }
  }

  const abrirModal = () => {
    setModalAberto(true);
  }

  const fecharModal = () => {
    setModalAberto(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col space-y-6">
      {agendamentos.length > 0 ? (
        <div className="space-y-4">
          {agendamentos.map((agendamento, index) => (
            <div key={index} className="bg-zinc-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <span className="text-lg font-semibold mb-2 sm:mb-0">
                {perfis[agendamento.idcliente]?.nomereal || agendamento.idcliente} {/* Exibe o nome real ou o ID */}
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(agendamento.horario).map((dia, diaIndex) => (
                  <div key={diaIndex} className="flex items-center">
                    <span className="bg-green-600 text-black px-3 py-1 rounded-full text-sm mr-2">
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </span>
                    <span className="bg-green-600 text-black px-3 py-1 rounded-full text-sm">
                      {agendamento.horario[dia].map(horario => horario.charAt(0).toUpperCase() + horario.slice(1)).join(', ')}
                    </span>
                    <span className="bg-green-600 text-black px-3 py-1 rounded-full text-sm ml-2">
                      R$ {precos[agendamento.idcampo] || 'N/A'} {/* Exibe o preço ou 'N/A' se não disponível */}
                    </span>
                    <button 
                      onClick={() => apagarAgendamento(agendamento.id).then(() => window.location.reload())}
                      className="bg-red-600 text-white px-3 py-1 rounded-full text-sm ml-2"
                    >
                      Apagar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg font-semibold">
          Não existe agendamento.
        </div>
      )}

      <button 
        onClick={toggleExpandido} 
        className="flex justify-center w-full focus:outline-none"
        aria-label={expandido ? "Recolher" : "Expandir"}
      >
        <ChevronDown size={24} className={`text-gray-400 transition-transform duration-300 ${expandido ? 'transform rotate-180' : ''}`} />
      </button>

      <div className="bg-zinc-900 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold">Lucro semanal</h2>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-zinc-800 rounded-full px-3 py-1 flex items-center"
                >
                  <span>{semanaAtual}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {dropdownAberto && (
                  <div className="absolute top-full left-0 mt-1 bg-zinc-800 rounded-lg shadow-lg z-10">
                    {[1, 2, 3, 4].map((semana) => (
                      <button
                        key={semana}
                        onClick={() => selecionarSemana(semana)}
                        className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                      >
                        {semana}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">R${lucroSemanal.toFixed(2)}</div> {/* Exibe o lucro semanal com duas casas decimais */}
              <div className="w-full sm:w-64 bg-zinc-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
          <div className="space-y-2 w-full sm:w-auto">
            <button 
              onClick={abrirModal} 
              className="w-full sm:w-auto bg-green-600 text-black px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              Adicionar campo
            </button>
            <button className="w-full sm:w-auto bg-green-600 text-black px-4 py-2 rounded-lg flex items-center justify-center">
              <Settings size={16} className="mr-2" />
              Gerenciar campos
            </button>
            <button className="w-full sm:w-auto bg-green-600 text-black px-4 py-2 rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="mr-2" />
              Gerenciar empresa
            </button>
          </div>
        </div>
      </div>
      {modalAberto && <ModalCampo onClose={fecharModal} />}
    </div>
  )
}