import axios from 'axios'

// إنشاء instance من axios بإعدادات افتراضية
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3', // رابط الـ TMDB مثلاً
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// إضافة Interceptor لو عايز تضيف API Key تلقائيًا
api.interceptors.request.use((config) => {
  config.params = config.params || {}
  config.params['api_key'] = 'YOUR_TMDB_API_KEY' // ← غيّرها بمفتاحك
  return config
})

export default api
