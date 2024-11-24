'use client'

import React, { useState, useEffect } from 'react'
import { X, Edit, Trash2, ChevronLeft, Search, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Campo {
  id: number
  idempresa: number
  nomecampo: string
  bannercampo: string
  preco: number
  disponibilidade: boolean
  tipo: string
  horarios: { [key: string]: string[] } | string
}

interface ModalGerenciamentoCamposProps {
  aoFechar: () => void
  token: string
}

export default function ModalGerenciamentoCampos({ aoFechar, token }: ModalGerenciamentoCamposProps) {
  const [campos, setCampos] = useState<Campo[]>([])
  const [camposFiltrados, setCamposFiltrados] = useState<Campo[]>([])
  const [campoSelecionado, setCampoSelecionado] = useState<Campo | null>(null)
  const [estaEditando, setEstaEditando] = useState(false)
  const [estaCarregando, setEstaCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState('')

  useEffect(() => {
    buscarCampos()
  }, [])

  useEffect(() => {
    const resultadosFiltrados = campos.filter(campo =>
      campo.nomecampo.toLowerCase().includes(termoBusca.toLowerCase())
    )
    setCamposFiltrados(resultadosFiltrados)
  }, [campos, termoBusca])

  const buscarCampos = async () => {
    setEstaCarregando(true)
    try {
      const resposta = await fetch('http://168.138.151.78:3000/api/businessManagement/campos', {
        headers: {
          'Authorization': token
        }
      })
      if (!resposta.ok) {
        throw new Error('Falha ao buscar campos')
      }
      const dados = await resposta.json()
      setCampos(dados)
      setCamposFiltrados(dados)
    } catch (err) {
      setErro('Erro ao buscar campos. Por favor, tente novamente.')
    } finally {
      setEstaCarregando(false)
    }
  }

  const handleEditar = (campo: Campo) => {
    setCampoSelecionado(campo)
    setEstaEditando(true)
  }

  const handleDeletar = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este campo?')) {
      try {
        const resposta = await fetch(`http://168.138.151.78:3000/api/businessManagement/delete-campo/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': token
          }
        })
        if (!resposta.ok) {
          throw new Error('Falha ao excluir campo')
        }
        setCampos(campos.filter(campo => campo.id !== id))
      } catch (err) {
        setErro('Erro ao excluir campo. Por favor, tente novamente.')
      }
    }
  }

  const handleSalvar = async (campoAtualizado: Campo) => {
    try {
      const dadosAtualizados = {
        nomeCampo: campoAtualizado.nomecampo,
        preco: campoAtualizado.preco,
        disponibilidade: campoAtualizado.disponibilidade,
        tipoCampo: campoAtualizado.tipo
      }

      const resposta = await fetch(`http://168.138.151.78:3000/api/businessManagement/atualizar-campo/${campoAtualizado.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
      })
      
      if (!resposta.ok) {
        throw new Error('Falha ao atualizar campo')
      }
      
      setCampos(campos.map(campo => campo.id === campoAtualizado.id ? campoAtualizado : campo))
      setEstaEditando(false)
      setCampoSelecionado(null)
    } catch (err) {
      setErro('Erro ao atualizar campo. Por favor, tente novamente.')
    }
  }

  const handleVoltar = () => {
    setEstaEditando(false)
    setCampoSelecionado(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 w-full max-w-[1000px] h-[80vh] relative overflow-hidden shadow-2xl"
      >
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        {estaCarregando ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : erro ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-500 text-lg mb-4">{erro}</p>
            <button
              onClick={aoFechar}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!estaEditando ? (
              <motion.div
                key="lista"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                <h2 className="text-green-400 text-3xl font-bold mb-6">Gerenciar Campos</h2>
                <div className="mb-4 relative">
                  <input
                    type="text"
                    placeholder="Buscar campos..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full bg-zinc-700 text-white p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <div className="overflow-y-auto flex-grow pr-4 custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                    {camposFiltrados.map(campo => (
                      <motion.div
                        key={campo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-zinc-800 rounded-xl p-4 shadow-lg transition-all duration-300 
                          hover:shadow-green-500/20 transform-gpu"
                        style={{ 
                          transformOrigin: 'center',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <img 
                          src={`http://168.138.151.78:3000/${campo.bannercampo}`} 
                          alt={campo.nomecampo} 
                          className="w-full h-40 object-cover rounded-lg mb-4" 
                        />
                        <h3 className="text-white text-xl font-semibold mb-2">{campo.nomecampo}</h3>
                        <p className="text-green-400 font-bold mb-2">R$ {campo.preco.toFixed(2)}</p>
                        <p className="text-gray-300 mb-2 capitalize">{campo.tipo}</p>
                        <p className={`mb-4 ${campo.disponibilidade ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                          {campo.disponibilidade ? 'Disponível' : 'Indisponível'}
                        </p>
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEditar(campo)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeletar(campo.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="editar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                {campoSelecionado && (
                  <>
                    <button
                      onClick={handleVoltar}
                      className="text-green-400 hover:text-green-300 mb-6 flex items-center transition-colors"
                    >
                      <ChevronLeft size={20} />
                      <span className="ml-2">Voltar para Campos</span>
                    </button>
                    <h2 className="text-green-400 text-3xl font-bold mb-6">Editar Campo</h2>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      handleSalvar(campoSelecionado)
                    }} className="space-y-6">
                      <div>
                        <label htmlFor="nomecampo" className="block text-white mb-2">Nome</label>
                        <input
                          type="text"
                          id="nomecampo"
                          value={campoSelecionado.nomecampo}
                          onChange={(e) => setCampoSelecionado({...campoSelecionado, nomecampo: e.target.value})}
                          className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="preco" className="block text-white mb-2">Preço</label>
                        <input
                          type="number"
                          id="preco"
                          value={campoSelecionado.preco}
                          onChange={(e) => setCampoSelecionado({...campoSelecionado, preco: Number(e.target.value)})}
                          className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">Disponibilidade</label>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setCampoSelecionado({...campoSelecionado, disponibilidade: true})}
                            className={`px-4 py-2 rounded-lg transition-colors ${campoSelecionado.disponibilidade ? 'bg-green-600 text-white' : 'bg-zinc-700 text-green-400'}`}
                          >
                            Disponível
                          </button>
                          <button
                            type="button"
                            onClick={() => setCampoSelecionado({...campoSelecionado, disponibilidade: false})}
                            className={`px-4 py-2 rounded-lg transition-colors ${!campoSelecionado.disponibilidade ? 'bg-red-600 text-white' : 'bg-zinc-700 text-red-400'}`}
                          >
                            Indisponível
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-white mb-2">Tipo de Campo</label>
                        <div className="flex space-x-4">
                          {['futsal', 'futebol', 'society'].map((tipo) => (
                            <button
                              key={tipo}
                              type="button"
                              onClick={() => setCampoSelecionado({...campoSelecionado, tipo})}
                              className={`px-4 py-2 rounded-lg capitalize transition-colors ${campoSelecionado.tipo === tipo ? 'bg-green-600 text-white' : 'bg-zinc-700 text-green-400'}`}
                            >
                              {tipo}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Salvar Alterações
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  )
}