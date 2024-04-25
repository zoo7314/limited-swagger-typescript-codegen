import axios, { AxiosRequestConfig } from "axios"


export type ClientRequestConfig = AxiosRequestConfig
export type ApiResObject<T = any> = {
  code: number
  message: string
  data: T
}


const client = axios.create({
  baseURL: '/stage-api',
  timeout: 6e4,
})
client.interceptors.request.use(
  (config) => {
    return config
  },
)
client.interceptors.response.use(
  (response) => {
    return response
  },
)


export function transformParamsToFormData(data: any) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Blob) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  }
  return formData
}




export default client



