import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'stepper',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {

  @Input() steps: { label: string; description?: string; done: boolean }[] = [];
  @Input() currentStepIndex = 0;

  faCheck: IconDefinition = faCheck;

  avanzarPaso() {
    if (this.currentStepIndex < this.steps.length) {
      this.steps[this.currentStepIndex].done = true;
      this.currentStepIndex++;
    }
  }

  setPaso(index: number) {
    this.steps = this.steps.map((step, i) => ({
      ...step,
      done: i < index,
    }));
    this.currentStepIndex = index;
  }

}
