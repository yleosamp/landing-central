'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Image, ChevronLeft, ChevronRight, Clock, DollarSign, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Horario {
  id: number
  hora: string
  dia: string
}

const horariosIniciais: Horario[] = [
  { id: 1, hora: '13:00', dia: 'segunda' },
  { id: 2, hora: '14:00', dia: 'segunda' },
  { id: 3, hora: '15:00', dia: 'segunda' },
  { id: 4, hora: '16:00', dia: 'segunda' },
  { id: 5, hora: '17:00', dia: 'segunda' },
  { id: 6, hora: '18:00', dia: 'segunda' },
  { id: 7, hora: '19:00', dia: 'segunda' },
  { id: 8, hora: '13:00', dia: 'terca' },
  { id: 9, hora: '14:00', dia: 'terca' },
  { id: 10, hora: '15:00', dia: 'terca' },
  { id: 11, hora: '16:00', dia: 'terca' },
  { id: 12, hora: '17:00', dia: 'terca' },
  { id: 13, hora: '18:00', dia: 'terca' },
  { id: 14, hora: '19:00', dia: 'terca' },
  { id: 15, hora: '13:00', dia: 'quarta' },
  { id: 16, hora: '14:00', dia: 'quarta' },
  { id: 17, hora: '15:00', dia: 'quarta' },
  { id: 18, hora: '16:00', dia: 'quarta' },
  { id: 19, hora: '17:00', dia: 'quarta' },
  { id: 20, hora: '18:00', dia: 'quarta' },
  { id: 21, hora: '19:00', dia: 'quarta' },
  { id: 22, hora: '13:00', dia: 'quinta' },
  { id: 23, hora: '14:00', dia: 'quinta' },
  { id: 24, hora: '15:00', dia: 'quinta' },
  { id: 25, hora: '16:00', dia: 'quinta' },
  { id: 26, hora: '17:00', dia: 'quinta' },
  { id: 27, hora: '18:00', dia: 'quinta' },
  { id: 28, hora: '19:00', dia: 'quinta' },
  { id: 29, hora: '13:00', dia: 'sexta' },
  { id: 30, hora: '14:00', dia: 'sexta' },
  { id: 31, hora: '15:00', dia: 'sexta' },
  { id: 32, hora: '16:00', dia: 'sexta' },
  { id: 33, hora: '17:00', dia: 'sexta' },
  { id: 34, hora: '18:00', dia: 'sexta' },
  { id: 35, hora: '19:00', dia: 'sexta' },
]

export default function ModalCampo({ onClose, token }: { onClose: () => void, token: string }) {
  const [nomeCampo, setNomeCampo] = useState('')
  const [preco, setPreco] = useState('')
  const [disponivel, setDisponivel] = useState<boolean | null>(null)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<{ [dia: string]: string[] }>({
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: [],
  })
  const [sliderPosition, setSliderPosition] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const handleHorarioToggle = (id: number) => {
    setHorariosDisponiveis(prev => {
      const horario = horariosIniciais.find(horario => horario.id === id)
      if (horario) {
        const newHorarios = { ...prev }
        if (newHorarios[horario.dia].includes(horario.hora)) {
          newHorarios[horario.dia] = newHorarios[horario.dia].filter(h => h !== horario.hora)
        } else {
          newHorarios[horario.dia] = [...newHorarios[horario.dia], horario.hora].sort()
        }
        return newHorarios
      }
      return prev
    })
  }

  const handleSliderMove = (direction: 'left' | 'right') => {
    setSliderPosition(prev => {
      const newPosition = direction === 'left' ? prev - 1 : prev + 1
      return Math.max(0, Math.min(newPosition, horariosIniciais.length - 5))
    })
  }

  const handleBannerClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const enviarInformacoes = async () => {
    const formData = new FormData()
    formData.append('nomeCampo', nomeCampo)
    formData.append('preco', preco)
    formData.append('disponibilidade', disponivel ? '1' : '0')
    formData.append('horarios', JSON.stringify(horariosDisponiveis))
    if (bannerFile) {
      formData.append('bannerCampo', bannerFile)
    }

    try {
      const response = await fetch('http://168.138.151.78:3000/api/businessManagement/campo', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('Informações enviadas com sucesso!', responseData)
        onClose()
      } else {
        const errorData = await response.json()
        console.error('Erro ao enviar as informações:', errorData.message)
      }
    } catch (error) {
      console.error('Erro ao enviar as informações:', error)
    }
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
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors z-10"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <div className="h-full overflow-y-auto px-4 custom-scrollbar">
          <h2 className="text-3xl font-bold text-green-400 mb-6">Adicionar Novo Campo</h2>

          <div className="space-y-6">
            <div 
              onClick={handleBannerClick}
              className="relative h-48 mb-6 bg-zinc-700 bg-cover bg-center rounded-xl cursor-pointer overflow-hidden group"
            >
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image size={48} className="text-green-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-green-400 font-semibold">
                  {bannerPreview ? 'Alterar banner' : 'Enviar banner'}
                </span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <div className="space-y-2">
              <label htmlFor="nomeCampo" className="block text-sm font-medium text-gray-400">Nome do campo</label>
              <input
                id="nomeCampo"
                type="text"
                placeholder="Ex: Campo Principal"
                value={nomeCampo}
                onChange={(e) => setNomeCampo(e.target.value)}
                className="w-full bg-zinc-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="preco" className="block text-sm font-medium text-gray-400">Preço por hora</label>
              <div className="relative">
                <DollarSign size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="preco"
                  type="number"
                  placeholder="0.00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full bg-zinc-700 text-white p-4 pl-12 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-400">Disponibilidade</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDisponivel(true)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-colors ${
                    disponivel === true
                      ? 'bg-green-600 text-white'
                      : 'bg-zinc-700 text-green-400 hover:bg-zinc-600'
                  }`}
                >
                  Disponível
                </button>
                <button
                  onClick={() => setDisponivel(false)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-colors ${
                    disponivel === false
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-700 text-red-400 hover:bg-zinc-600'
                  }`}
                >
                  Indisponível
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-400">Horários disponíveis</span>
              <div className="relative">
                <button
                  onClick={() => handleSliderMove('left')}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 text-green-400 p-2 z-10"
                  disabled={sliderPosition === 0}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="overflow-hidden mx-8">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${sliderPosition * 20}%)`,
                    }}
                  >
                    {horariosIniciais.map((horario) => (
                      <button
                        key={horario.id}
                        onClick={() => handleHorarioToggle(horario.id)}
                        className={`flex-shrink-0 w-1/5 p-3 m-1 rounded-xl transition-colors ${
                          horariosDisponiveis[horario.dia].includes(horario.hora)
                            ? 'bg-green-600 text-white'
                            : 'bg-zinc-700 text-green-400 hover:bg-zinc-600'
                        }`}
                      >
                        <Clock size={16} className="inline-block mr-2" />
                        {horario.hora}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleSliderMove('right')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-green-400 p-2 z-10"
                  disabled={sliderPosition === horariosIniciais.length - 5}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <button
              onClick={enviarInformacoes}
              className="w-full bg-green-500 text-white py-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Check size={20} className="mr-2" />
              Salvar Campo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}