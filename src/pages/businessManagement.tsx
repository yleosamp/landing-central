import React, { useState, useEffect } from 'react'
import { ChevronDown, Plus, Settings, Briefcase, Moon, Sun, Trash2 } from 'lucide-react'
import ModalCampo from './components/modalv2'
import ModalGerenciamentoCampos from './components/modalCampos'

interface Agendamento {
  id: number
  idcliente: number
  idcampo: number
  nomecampo: string
  quantidadepessoas: number
  semana: string
  horario: {
    [dia: string]: string[]
  }
  idempresa: number
  precocampo: number
  nomecliente: string
  pago: boolean
}

interface Profile {
  id: number
  nomereal: string
}

export default function InterfaceAgendamento() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [perfis, setPerfis] = useState<Record<number, Profile>>({})
  const [semanaAtual, setSemanaAtual] = useState(1)
  const [lucroSemanal, setLucroSemanal] = useState(0)
  const [modalCampoAberto, setModalCampoAberto] = useState(false)
  const [modalGerenciamentoAberto, setModalGerenciamentoAberto] = useState(false)
  const [naoAutenticado, setNaoAutenticado] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [modoEscuro, setModoEscuro] = useState(true)

  useEffect(() => {
    const fetchAgendamentos = async () => {
      const token = localStorage.getItem('authorization');
      setToken(token);
      if (!token) {
        setNaoAutenticado(true);
        return;
      }
      
      try {
        const response = await fetch('http://168.138.151.78:3000/api/businessManagement/agendamentos', {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        
        const agendamentosData = data.agendamentos || [];
        setAgendamentos(agendamentosData);

        const perfilPromises = agendamentosData
          .filter(agendamento => agendamento.idcliente)
          .map((agendamento: Agendamento) =>
            fetch(`http://168.138.151.78:3000/api/accountmanagement/profile/${agendamento.idcliente}`, {
              headers: {
                'Authorization': token
              }
            })
              .then(async res => {
                if (!res.ok) throw new Error('Falha ao buscar perfil');
                const perfilData = await res.json();
                setPerfis(prev => ({
                  ...prev,
                  [agendamento.idcliente]: {
                    id: agendamento.idcliente,
                    nomereal: perfilData.profile?.nomereal || `Cliente ${agendamento.idcliente}`
                  }
                }));
              })
              .catch((error) => {
                console.error(`Erro ao buscar perfil ${agendamento.idcliente}:`, error);
                setPerfis(prev => ({
                  ...prev,
                  [agendamento.idcliente]: {
                    id: agendamento.idcliente,
                    nomereal: `Cliente ${agendamento.idcliente}`
                  }
                }));
              })
          );

        await Promise.all(perfilPromises);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setAgendamentos([]);
      }
    };

    fetchAgendamentos()
  }, [])

  useEffect(() => {
    setLucroSemanal(agendamentos.reduce((total, agendamento) => total + (agendamento.precocampo || 0), 0))
  }, [agendamentos])

  const apagarAgendamento = async (id: number) => {
    if (!token) {
      setNaoAutenticado(true)
      return
    }
    const response = await fetch(`http://168.138.151.78:3000/api/businessManagement/delete-agendamento/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    })
    if (response.ok) {
      setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id))
    }
  }

  const toggleModoEscuro = () => {
    setModoEscuro(!modoEscuro)
  }

  const fecharModalCampo = () => {
    console.log('Fechando modal campo')
    setModalCampoAberto(false)
  }

  const fecharModalGerenciamento = () => {
    console.log('Fechando modal gerenciamento')
    setModalGerenciamentoAberto(false)
  }

  const atualizarStatusPagamento = async (idAgendamento: number, pago: boolean) => {
    try {
      const response = await fetch('http://168.138.151.78:3000/api/businessManagement/atualizar-pagamento', {
        method: 'PUT',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idAgendamento,
          pago
        })
      });

      if (response.ok) {
        setAgendamentos(prev => prev.map(agendamento => 
          agendamento.id === idAgendamento 
            ? { ...agendamento, pago } 
            : agendamento
        ));
      } else {
        console.error('Erro ao atualizar status do pagamento');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className={`min-h-screen ${modoEscuro ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-500">Central da Resenha</h1>
          <button onClick={() => { localStorage.removeItem('authorization'); window.location.href = '/login'; }} className="p-2 text-white ml-auto">Sair</button>
          <button
            onClick={toggleModoEscuro}
            className={`p-2 rounded-full ${modoEscuro ? 'bg-white text-black' : 'bg-black text-white'}`}
          >
            {modoEscuro ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        {naoAutenticado ? (
          <div className="text-center text-xl font-semibold bg-red-500 text-white p-4 rounded-lg">
            NÃO AUTENTICADO
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className={`p-6 rounded-lg ${modoEscuro ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                <h2 className="text-2xl font-bold mb-4">Lucro semanal</h2>
                <div className="text-4xl font-bold mb-2 text-green-500">R$ {lucroSemanal.toFixed(2)}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className={`p-6 rounded-lg ${modoEscuro ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                <h2 className="text-2xl font-bold mb-4">Ações rápidas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setModalCampoAberto(true)}
                    className="w-full sm:w-auto bg-green-600 text-black px-4 py-2 rounded-lg flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar campo
                  </button>
                  <button
                    onClick={() => setModalGerenciamentoAberto(true)}
                    className="w-full sm:w-auto bg-green-600 text-black px-4 py-2 rounded-lg flex items-center justify-center"
                  >
                    <Settings size={16} className="mr-2" />
                    Gerenciar campos
                  </button>
                  <button className="bg-green-500 text-black px-4 py-2 rounded-lg flex items-center justify-center">
                    <Briefcase size={20} className="mr-2" />
                    Gerenciar empresa
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Agendamentos</h2>
            {agendamentos.length > 0 ? (
              <div className="space-y-4">
                {agendamentos.map((agendamento, index) => (
                  <div key={index} className={`p-4 rounded-lg ${modoEscuro ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold mb-2 sm:mb-0">
                        {agendamento.nomecliente}
                      </span>
                      <div className="flex items-center">
                        <button 
                          onClick={() => apagarAgendamento(agendamento.id)}
                          className={`bg-red-600 text-white px-3 py-1 rounded-full text-sm ml-2 ${modoEscuro ? 'bg-red-200 text-black' : 'bg-red-600 text-white'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-black">
                        {agendamento.nomecampo || `Campo ${agendamento.idcampo}`}
                      </span>
                      {Object.entries(agendamento.horario).map(([dia, horarios]) => (
                        <span key={dia} className="px-3 py-1 rounded-full text-sm bg-blue-500 text-black">
                          {dia.charAt(0).toUpperCase() + dia.slice(1)} {horarios.join(', ')}
                        </span>
                      ))}
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-black">
                        R$ {agendamento.precocampo.toFixed(2)}
                      </span>
                      <select
                        value={agendamento.pago ? 'pago' : 'pendente'}
                        onChange={(e) => atualizarStatusPagamento(agendamento.id, e.target.value === 'pago')}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer
                          ${modoEscuro 
                            ? 'bg-zinc-800 border border-zinc-700' 
                            : 'bg-white border border-gray-300'} 
                          ${agendamento.pago 
                            ? 'text-green-600' 
                            : 'text-yellow-500'}`
                        }
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xl font-semibold bg-yellow-500 text-black p-4 rounded-lg">
                Não existe agendamento.
              </div>
            )}
          </>
        )}
      </div>

      {modalCampoAberto && token && (
        <ModalCampo 
          onClose={() => setModalCampoAberto(false)} 
          token={token} 
        />
      )}
      {modalGerenciamentoAberto && token && (
        <ModalGerenciamentoCampos 
          aoFechar={() => setModalGerenciamentoAberto(false)} 
          token={token} 
        />
      )}
    </div>
  )
}