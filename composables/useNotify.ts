import { useQuasar } from 'quasar'

export function useNotify() {
  const $q = useQuasar()

  function success(message: string) {
    $q.notify({ type: 'positive', message, icon: 'mdi-check-circle' })
  }

  function error(message: string) {
    $q.notify({ type: 'negative', message, icon: 'mdi-alert-circle' })
  }

  function warning(message: string) {
    $q.notify({ type: 'warning', message, icon: 'mdi-alert' })
  }

  function info(message: string) {
    $q.notify({ type: 'info', message, icon: 'mdi-information' })
  }

  return { success, error, warning, info }
}
