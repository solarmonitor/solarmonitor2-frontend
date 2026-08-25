import Tooltip from 'bootstrap/js/dist/tooltip'
import type { Directive } from 'vue'

/** `v-tooltip="'html text'"`: a Bootstrap tooltip shown on hover, focus or click. */
export const vTooltip: Directive<HTMLElement, string> = {
  mounted(el, { value }) {
    el.setAttribute('tabindex', '0')
    new Tooltip(el, { title: value, html: true, placement: 'bottom', trigger: 'hover focus' })
  },
  updated(el, { value, oldValue }) {
    if (value !== oldValue) Tooltip.getInstance(el)?.setContent({ '.tooltip-inner': value })
  },
  beforeUnmount(el) {
    Tooltip.getInstance(el)?.dispose()
  },
}

declare module 'vue' {
  interface GlobalDirectives {
    vTooltip: typeof vTooltip
  }
}
