import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from "axios"

declare module 'axios' {
  interface AxiosRequestConfig {
    sendFormData?: boolean
  }
}

export type ClientRequestConfig = AxiosRequestConfig

export type ClientApiResponse<T = any> = {
  code: number
  message: string
  data: T
}

class ApiClient {

  internal: AxiosInstance

  constructor(config?: CreateAxiosDefaults) {
    this.internal = axios.create(config)
    this.interceptResponse()
    this.interceptSendFormData()
  }

  request<T = any>(config: ClientRequestConfig): Promise<T> {
    return this.internal.request<any, T>(config)
  }

  interceptResponse() {
    this.internal.interceptors.response.use(
      (response) => {
        const res = response.data
        return res
      },
    )
  }

  interceptSendFormData() {
    this.internal.interceptors.request.use(
      (config) => {
        const { data } = config
        const formData = new FormData()
        for (const [key, value] of Object.entries(data)) {
          if (value instanceof Blob) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        }
        config.data = formData
        return config
      },
      null,
      {
        runWhen: config => Boolean(config.sendFormData),
      },
    )
  }

}


const client = new ApiClient({
  baseURL: '/stage-api',
  timeout: 6e4
})
export default client



