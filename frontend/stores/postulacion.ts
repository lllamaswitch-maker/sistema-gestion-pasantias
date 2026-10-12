import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostulacionStore = defineStore('postulacion', () => {
  const archivos = ref<Record<string, File>>({})
  const documentosSubidos = ref<{ tipo_documento: string; archivo_url: string }[]>([])

  const guardarArchivos = (nuevosArchivos: Record<string, File>) => {
    archivos.value = nuevosArchivos
  }

  const setDocumentosSubidos = (docs: { tipo_documento: string; archivo_url: string }[]) => {
    documentosSubidos.value = docs
  }

  const reset = () => {
    archivos.value = {}
    documentosSubidos.value = []
  }

  return {
    archivos,
    documentosSubidos,
    guardarArchivos,
    setDocumentosSubidos,
    reset
  }
})