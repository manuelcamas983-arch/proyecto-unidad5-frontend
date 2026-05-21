export async function getApiUrl() {
  const response = await fetch(import.meta.env.BASE_URL + 'config.json', { cache: 'no-store' })
  if (!response.ok) throw new Error('No se pudo leer config.json')
  const config = await response.json()
  if (!config.API_URL) throw new Error('API_URL no definida en config.json')
  return config.API_URL
}