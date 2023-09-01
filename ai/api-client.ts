import { env } from './utils'

type ListModelsResponse = Record<string, string[] | undefined>

export type APIClientOptions = {
  /**
   * Defaults to the `LUSAT_API_KEY` environment variable.
   *
   * Log in at https://rysana.com to get your API key.
   */
  apiKey?: string
  /**
   * Override the default API base URL.
   */
  baseUrl?: string
}

export class LusatAI {
  apiKey: string
  baseUrl: string
  /**
   * API Client for the Lusat AI API.
   *
   * ```ts
   * import { LusatAI } from 'lusat/ai'
   * const ai = new LusatAI()
   * ```
   */
  constructor({
    apiKey = env('LUSAT_API_KEY'),
    baseUrl = 'https://rysana.com/api/lusat',
  }: APIClientOptions = {}) {
    if (!apiKey) {
      throw new Error('Missing LUSAT_API_KEY environment variable.')
    }

    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }
  models = {
    /**
     * List all available models categorized by resource type.
     */
    list: async () => {
      const response = await fetch(`${this.baseUrl}/models-v1`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      })
      const parsed = await response.json()
      return parsed as unknown as ListModelsResponse
    },
  }
}
