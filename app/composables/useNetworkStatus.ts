import { useOnline } from '@vueuse/core'

/**
 * Composable for detecting network connectivity status
 * Uses VueUse's useOnline() which monitors navigator.onLine
 * and online/offline events
 */
export const useNetworkStatus = () => {
    const isOnline = useOnline()

    return {
        isOnline
    }
}
