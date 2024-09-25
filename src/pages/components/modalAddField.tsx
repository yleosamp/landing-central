import React, { useState, useRef } from 'react'
import { X, Image, ChevronLeft, ChevronRight } from 'lucide-react'

interface Horario {
  id: number
  hora: string
}

const horariosIniciais: Horario[] = [
  { id: 1, hora: '13:00' },
  { id: 2, hora: '14:00' },
  { id: 3, hora: '15:00' },
  { id: 4, hora: '16:00' },
  { id: 5, hora: '17:00' },
  { id: 6, hora: '18:00' },
  { id: 7, hora: '19:00' },
]

export default function ModalCampo({ onClose }: { onClose: () => void }) {
  const [nomeCampo, setNomeCampo] = useState('')
  const [preco, setPreco] = useState('')
  const [disponivel, setDisponivel] = useState<boolean | null>(null)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<number[]>([])
  const [sliderPosition, setSliderPosition] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const handleHorarioToggle = (id: number) => {
    setHorariosDisponiveis(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
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
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-500 hover:text-green-600"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-center mb-4">
          <button
            onClick={handleBannerClick}
            className="bg-zinc-800 text-green-500 p-4 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition-colors"
          >
            <Image size={24} className="mr-2" />
            Envie seu banner
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {bannerFile && (
          <p className="text-center text-green-500 mb-4">
            Banner selecionado: {bannerFile.name}
          </p>
        )}

        <input
          type="text"
          placeholder="Nome do campo"
          value={nomeCampo}
          onChange={(e) => setNomeCampo(e.target.value)}
          className="w-full bg-zinc-800 text-white p-2 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full bg-zinc-800 text-white p-2 rounded-lg mb-4"
        />

        <div className="flex justify-between items-center mb-4">
          <span className="text-white">Campo disponível?</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setDisponivel(true)}
              className={`px-4 py-2 rounded-lg ${
                disponivel === true
                  ? 'bg-green-600 text-white'
                  : 'bg-zinc-800 text-green-500'
              }`}
            >
              Sim
            </button>
            <button
              onClick={() => setDisponivel(false)}
              className={`px-4 py-2 rounded-lg ${
                disponivel === false
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-red-500'
              }`}
            >
              Não
            </button>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-white block mb-2">Horários</span>
          <div className="flex items-center">
            <button
              onClick={() => handleSliderMove('left')}
              className="text-green-500 p-2"
              disabled={sliderPosition === 0}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1 overflow-hidden">
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
                    className={`flex-shrink-0 w-1/5 p-2 m-1 rounded-lg transition-colors ${
                      horariosDisponiveis.includes(horario.id)
                        ? 'bg-transparent border-2 border-green-500 text-green-500'
                        : 'bg-green-500 text-black'
                    }`}
                  >
                    {horario.hora}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleSliderMove('right')}
              className="text-green-500 p-2"
              disabled={sliderPosition === horariosIniciais.length - 5}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}