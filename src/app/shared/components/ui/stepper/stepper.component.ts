import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'stepper',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {

  @Input() steps: { label: string; done: boolean }[] = []; //Lista de pasos del stepper.
  @Input() currentStepIndex = 0; //Índice actual del paso activo en el stepper.

  // Icons
  faCheck: IconDefinition = faCheck;
  faCircle: IconDefinition = faCircle;

/**
 * Marca el paso actual como completado y avanza al siguiente paso.
 *
 */
  avanzarPaso() {
    if (this.currentStepIndex < this.steps.length) {
      this.steps[this.currentStepIndex].done = true;
      this.currentStepIndex++;
    }
  }

  /**
 * Establece manualmente el paso actual y actualiza los pasos como completados
 * si están antes del índice seleccionado.
 *
 * @param index Índice del paso que se desea establecer como actual
 */
  setPaso(index: number) {
    this.steps = this.steps.map((step, i) => ({
      ...step,
      done: i < index,
    }));
    this.currentStepIndex = index;
  }

}
