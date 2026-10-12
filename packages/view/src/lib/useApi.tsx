import { useCallback, useEffect, useRef, useState } from "react"
import { apiFetch } from "./api"
import { toast } from "@/components/ui/toast"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface UseApiOptions<TBody> {
  method?: Method
  body?: TBody
  immediate?: boolean
}

export default function useApi<TResult = unknown, TBody = unknown>(
  route: string,
  { method = "GET", body, immediate = false }: UseApiOptions<TBody> = {},
) {
  const [data, setData] = useState<TResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const bodyRef = useRef(body)
  bodyRef.current = body

  const submit = useCallback(
    async (overrideBody?: TBody): Promise<TResult | null> => {
      setLoading(true)
      setError(null)
      try {
        const payload = overrideBody ?? bodyRef.current
        const res = await apiFetch(route, {
          method,
          body: payload === undefined ? undefined : JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const json = res.status === 204 ? null : ((await res.json()) as TResult)
        setData(json)
        return json
      } catch {
        setError("Une erreur est survenue.")
        return null
      } finally {
        setLoading(false)
      }
    },
    [route, method],
  )

  useEffect(() => {
    if (immediate) submit()
  }, [immediate, submit])

  return { data, error, loading, submit }
}
