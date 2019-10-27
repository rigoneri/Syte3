import React from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export default function Modal({ id = 'modal-mount', children, onClose }) {
    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={e => e.stopPropagation()}>
                {children}
            </div>
            <button className={styles.close} onClick={onClose}>
                ✕
            </button>
        </div>,
        document.getElementById(id)
    )
}

export function ModalMount() {
    return <aside id="modal-mount" className={styles.modal} />
}
