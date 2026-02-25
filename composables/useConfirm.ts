import { useQuasar } from 'quasar'

export function useConfirm() {
  const $q = useQuasar()

  function confirm(options: {
    title: string
    message: string
    okLabel?: string
    cancelLabel?: string
    color?: string
  }): Promise<boolean> {
    return new Promise((resolve) => {
      const d = $q.dialog({
        title: options.title,
        message: options.message,
        ok: { label: options.okLabel ?? 'Confirmar', color: options.color ?? 'negative' },
        cancel: { label: options.cancelLabel ?? 'Cancelar', flat: true },
        persistent: true,
      })
      d.onOk(() => resolve(true))
      d.onCancel(() => resolve(false))
      d.onDismiss(() => resolve(false))
    })
  }

  return { confirm }
}
