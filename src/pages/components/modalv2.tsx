import React, { useState, useRef } from 'react'
import { X, Image, ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function ModalCampo({ onClose }: { onClose: () => void }) {
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

  const handleHorarioToggle = (id: number) => {
    setHorariosDisponiveis(prev => {
      const horario = horariosIniciais.find(horario => horario.id === id)
      if (horario) {
        return {
          segunda: prev.segunda.includes(horario.hora) ? prev.segunda.filter(h => h !== horario.hora) : [...prev.segunda, horario.hora],
          terca: prev.terca.includes(horario.hora) ? prev.terca.filter(h => h !== horario.hora) : [...prev.terca, horario.hora],
          quarta: prev.quarta.includes(horario.hora) ? prev.quarta.filter(h => h !== horario.hora) : [...prev.quarta, horario.hora],
          quinta: prev.quinta.includes(horario.hora) ? prev.quinta.filter(h => h !== horario.hora) : [...prev.quinta, horario.hora],
          sexta: prev.sexta.includes(horario.hora) ? prev.sexta.filter(h => h !== horario.hora) : [...prev.sexta, horario.hora],
        }
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
    }
  }

  const enviarInformacoes = async () => {
    const formData = new FormData()
    formData.append('nomeCampo', nomeCampo)
    formData.append('preco', preco)
    formData.append('disponibilidade', disponivel ? '1' : '0')
    const horariosJson = JSON.stringify(horariosDisponiveis)
    formData.append('horarios', horariosJson)
    if (bannerFile) {
      formData.append('bannerCampo', bannerFile)
    }

    const response = await fetch('http://localhost:4444/api/businessManagement/campo', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTcyNzM1NTEyM30.Qxb_5razh4mP8QzdE8Ldq9f862J3YjPsq9H6Y6cF46U',
      },
      body: formData
    })

    if (response.ok) {
      console.log('Informações enviadas com sucesso!')
      onClose() // Fecha o modal após enviar as informações
    } else {
      console.error('Erro ao enviar as informações.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-[939px] h-[662px] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-500 hover:text-green-600 z-10"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <div className="relative h-48 mb-6 bg-[url('/placeholder.svg?height=192&width=939')] bg-cover bg-center rounded-t-lg">
          <button
            onClick={handleBannerClick}
            className="absolute inset-0 bg-black bg-opacity-50 text-green-500 flex items-center justify-center hover:bg-opacity-60 transition-colors"
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

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome do campo"
            value={nomeCampo}
            onChange={(e) => setNomeCampo(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg"
          />

          <div className="flex justify-between items-center">
            <span className="text-white text-lg">Campo disponível?</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setDisponivel(true)}
                className={`px-6 py-2 rounded-lg ${
                  disponivel === true
                    ? 'bg-green-600 text-white'
                    : 'bg-zinc-800 text-green-500'
                }`}
              >
                Sim
              </button>
              <button
                onClick={() => setDisponivel(false)}
                className={`px-6 py-2 rounded-lg ${
                  disponivel === false
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-red-500'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          <div>
            <span className="text-white text-lg block mb-2">Horários</span>
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
                        horariosDisponiveis[horario.dia].includes(horario.hora)
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

          <button
            onClick={enviarInformacoes}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Enviar informações
          </button>
        </div>
      </div>
    </div>
  )
}