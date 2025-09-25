import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageSignalStateService {

  toastVisible = signal(false); // Signal para controlar la visibilidad del toast flotante
  isBlur = signal(false);  // Signal para aplicar o quitar el efecto blur en la interfaz

  private toastTimeout: any;  // Controlador del timeout del toast para poder limpiarlo si se vuelve a mostrar


/**
 * Muestra el toast durante un tiempo determinado.
 * Si se vuelve a invocar antes de terminar, reinicia el tiempo.
 *
 * @param duration Duración en milisegundos que se mostrará el toast (por defecto 4000 ms)
 */
  showToast(duration = 4000): void {
    this.toastVisible.set(true);

    // Limpiar timeout anterior si existe
    clearTimeout(this.toastTimeout);

    // Ocultar el toast luego del tiempo definido
    this.toastTimeout = setTimeout(() => {
      this.toastVisible.set(false);
    }, duration);
  }

  /**
 * Establece el estado del blur en la interfaz.
 *
 * @param value `true` para activar blur, `false` para desactivarlo
 */
  setBlur(value: boolean): void {
    this.isBlur.set(value);
  }

}
