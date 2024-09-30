'use client'

import React, { useState, useEffect } from 'react'
import { X, Edit, Trash2, ChevronLeft } from 'lucide-react'

interface Campo {
  id: number
  idempresa: number
  nomecampo: string
  bannercampo: string
  preco: number
  disponibilidade: boolean
  tipo: string // Adicionado para armazenar o tipo de campo
  horarios: { [key: string]: string[] } | string
}

interface ModalGerenciamentoCamposProps {
  aoFechar: () => void
  token: string
}

export default function ModalGerenciamentoCampos({ aoFechar, token }: ModalGerenciamentoCamposProps) {
  const [campos, setCampos] = useState<Campo[]>([])
  const [campoSelecionado, setCampoSelecionado] = useState<Campo | null>(null)
  const [estaEditando, setEstaEditando] = useState(false)
  const [estaCarregando, setEstaCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    buscarCampos()
  }, [])

  const buscarCampos = async () => {
    setEstaCarregando(true)
    try {
      const resposta = await fetch('http://localhost:4444/api/businessManagement/campos', {
        headers: {
          'Authorization': token
        }
      })
      if (!resposta.ok) {
        throw new Error('Falha ao buscar campos')
      }
      const dados = await resposta.json()
      setCampos(dados)
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
        const resposta = await fetch(`http://localhost:4444/api/businessManagement/delete-campo/${id}`, {
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
      const resposta = await fetch(`http://localhost:4444/api/businessManagement/campo/${campoAtualizado.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campoAtualizado)
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

  if (estaCarregando) {
    return <div className="text-white">Carregando...</div>
  }

  if (erro) {
    return <div className="text-red-500">{erro}</div>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-[939px] h-[662px] relative overflow-y-auto">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-green-500 hover:text-green-600"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        {!estaEditando ? (
          <>
            <h2 className="text-white text-2xl mb-6">Gerenciar Campos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {campos.map(campo => (
                <div key={campo.id} className="bg-zinc-800 rounded-lg p-4">
                  <img src={campo.bannercampo} alt={campo.nomecampo} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <h3 className="text-white text-lg mb-2">{campo.nomecampo}</h3>
                  <p className="text-gray-400 mb-2">Preço: R${campo.preco}</p>
                  <p className="text-gray-400 mb-4">
                    Status: {campo.disponibilidade ? 'Disponível' : 'Indisponível'}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditar(campo)}
                      className="text-green-500 hover:text-green-600"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletar(campo.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          campoSelecionado && (
            <div>
              <button
                onClick={handleVoltar}
                className="text-green-500 hover:text-green-600 mb-4 flex items-center"
              >
                <ChevronLeft size={20} />
                Voltar para Campos
              </button>
              <h2 className="text-white text-2xl mb-6">Editar Campo</h2>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleSalvar(campoSelecionado)
              }}>
                <div className="mb-4">
                  <label htmlFor="nomecampo" className="block text-white mb-2">Nome</label>
                  <input
                    type="text"
                    id="nomecampo"
                    value={campoSelecionado.nomecampo}
                    onChange={(e) => setCampoSelecionado({...campoSelecionado, nomecampo: e.target.value})}
                    className="w-full bg-zinc-800 text-white p-2 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="preco" className="block text-white mb-2">Preço</label>
                  <input
                    type="number"
                    id="preco"
                    value={campoSelecionado.preco}
                    onChange={(e) => setCampoSelecionado({...campoSelecionado, preco: Number(e.target.value)})}
                    className="w-full bg-zinc-800 text-white p-2 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-white mb-2">Disponibilidade</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCampoSelecionado({...campoSelecionado, disponibilidade: true})}
                      className={`px-4 py-2 rounded-lg ${campoSelecionado.disponibilidade ? 'bg-green-600 text-white' : 'bg-zinc-800 text-green-500'}`}
                    >
                      Disponível
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampoSelecionado({...campoSelecionado, disponibilidade: false})}
                      className={`px-4 py-2 rounded-lg ${!campoSelecionado.disponibilidade ? 'bg-red-600 text-white' : 'bg-zinc-800 text-red-500'}`}
                    >
                      Indisponível
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-white mb-2">Tipo de Campo</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCampoSelecionado({...campoSelecionado, tipo: 'futsal'})}
                      className={`px-4 py-2 rounded-lg ${campoSelecionado.tipo === 'futsal' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-green-500'}`}
                    >
                      Futsal
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampoSelecionado({...campoSelecionado, tipo: 'futebol'})}
                      className={`px-4 py-2 rounded-lg ${campoSelecionado.tipo === 'futebol' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-green-500'}`}
                    >
                      Futebol
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampoSelecionado({...campoSelecionado, tipo: 'society'})}
                      className={`px-4 py-2 rounded-lg ${campoSelecionado.tipo === 'society' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-green-500'}`}
                    >
                      Society
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          )
        )}
      </div>
    </div>
  )
}