export interface ModalHandler {
  open: () => void
  close: () => void
  isOpen: () => boolean
}
