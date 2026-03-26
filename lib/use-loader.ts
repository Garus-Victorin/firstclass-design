import { useLoading } from '@/components/loading-provider'

export function useLoader() {
  const { isLoading, setIsLoading } = useLoading()

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return {
    isLoading,
    showLoader,
    hideLoader,
  }
}
