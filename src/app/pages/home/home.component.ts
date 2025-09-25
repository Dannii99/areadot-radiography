import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBullseye, faCalculator, faChartArea, faCheckCircle, faDraftingCompass, faEyeSlash, faHashtag, faRulerCombined, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumerosPipe } from '@core/utils/pipes/numeros.pipe';
import { ResultRow } from '@core/models/result.interface';
import { LoadingComponent } from '@shared/components/ui/loading/loading.component';
import { ModalService } from '@core/services/modal.service';
import { AlertDialogComponent } from '@shared/components/ui/alert-dialog/alert-dialog.component';
import { Dialog } from '@core/models/dialog.interface';
import { StepperComponent } from '@shared/components/ui/stepper/stepper.component';
import { UploadImageService } from '@core/services/upload-image.service';
import { ImageSignalStateService } from '@core/services/image-signal-state.service';
import { GeneratePointsService } from '@core/services/generate-points.service';
import { CalculateAreaService } from '@core/services/calculate-area.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatButtonModule, ReactiveFormsModule, FormsModule, NumerosPipe, LoadingComponent, StepperComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {

  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('pointsCanvas', { static: false }) pointsCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild(StepperComponent) stepper!: StepperComponent;

  //ICONS
  faEyeSlash = faEyeSlash;
  faCalculator = faCalculator;
  faHashtag = faHashtag;
  faCheckCircle = faCheckCircle;
  faRulerCombined = faRulerCombined;
  faChartArea = faChartArea;
  faTriangleExclamation = faTriangleExclamation;
  faBullseye = faBullseye;
  faDraftingCompass = faDraftingCompass;

  isBinary: boolean | null = null; // validacion image
  imagePreviewUrl: string | null = null; // visaluzar imagen binaria
  pointsCount: number = 10000; // Valor inicial por defecto
  lastResult: ResultRow | null = null; // validacion y visaulizar imagen con puntos
  resultHistory: ResultRow[] = []; // array de resultados ya calculados

  // Cargando
  isLoading = false;
  loadingMessage = '';

  // Pasos
  steps = [
    { label: 'Subir imagen', done: false },
    { label: 'Validar imagen', done: false },
    { label: 'Generar puntos', done: false },
    { label: 'Contar puntos en mancha', done: false },
    { label: 'Estimar área', done: false },
  ];


  constructor(
    private modalservice: ModalService,
    private uploadImageService: UploadImageService,
    private generatePointsService: GeneratePointsService,
    private calculateAreaService: CalculateAreaService,
    public imageSignalStateService: ImageSignalStateService
  ) {
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      document.body.classList.remove('overflow-hidden');
    }, 500);
  }

  /**
 * Evento disparado al seleccionar un archivo de imagen.
 * Procesa la imagen, la carga en el canvas y valida si es binaria (solo blanco y negro).
 */

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    // Limpiar estado previo
    this.lastResult = null;
    this.stepper.setPaso(0);
    this.imageSignalStateService.setBlur(true);

    const file = input.files[0];

    try {
      // Procesar la imagen
      const result = await this.uploadImageService.processFile(file);

      const canvasEl = this.canvas.nativeElement;
      const ctx = canvasEl.getContext('2d')!;
      canvasEl.width = result.width;
      canvasEl.height = result.height;




      this.isBinary = result.isBinary;

      // Si no es binaria, limpiar la vista y mostrar mensaje
      if (!this.isBinary) {
        this.imagePreviewUrl = null;
        this.lastResult = null;
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        this.imageSignalStateService.showToast();
        return;
      }

      // Dibujar la imagen analizada en el canvas
      ctx.putImageData(result.imageData!, 0, 0);
       console.log('ctx:: ', ctx);
       console.log('imageData:: ', result.imageData);
      this.imagePreviewUrl = result.imagePreviewUrl;
      console.log('imagePreviewUrl:: ', this.imagePreviewUrl);


      // Mostrar toast con mensaje y avanzar paso
      setTimeout(() => {
        this.imageSignalStateService.showToast();
        //this.isBlur = false;
        this.imageSignalStateService.setBlur(false);
        this.stepper.setPaso(2);
      }, 1000);

      this.stepper.setPaso(1);
    } catch (error) {
      console.error('Error procesando la imagen', error);
    }
  }

/**
 * Verifica si un punto del canvas está sobre una mancha (píxel blanco).
 */
  isPointOnStain(x: number, y: number, ctx: CanvasRenderingContext2D): boolean {
    return this.generatePointsService.isPointOnStain(x, y, ctx);
  }

/**
 * Calcula el área estimada de la mancha blanca sobre la imagen usando muestreo aleatorio.
 * Se apoya en los servicios para calcular el área y guardar el historial.
 */
  calculateStainArea(n: number): void {
    // Si no hay imagen cargada, mostrar alerta
    if (!this.imagePreviewUrl) {
      const data: Dialog = {
        data: {
          title: 'Alerta',
          message: 'Primero debes cargar una imagen binaria para poder calcular el área estimada'
        },
        width: '31.25rem',
        disableClose: true,
      };
      this.modalservice.open(AlertDialogComponent, data).afterClosed().subscribe();
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Verificando imagen…';

    setTimeout(() => {
      this.loadingMessage = 'Calculando puntos…';

      const canvasEl = this.canvas.nativeElement;
      const ctx = canvasEl.getContext('2d')!;
      const width = canvasEl.width;
      const height = canvasEl.height;

      // Ejecutar cálculo del área estimada con el servicio
      const { result, points } = this.calculateAreaService.calculateAreaFromCanvas(ctx, width, height, n);

      // Guardar resultado y actualizar historial
      this.lastResult = result;
      this.resultHistory = this.calculateAreaService.saveToHistory(result);

      setTimeout(() => {
        this.loadingMessage = 'Resultados listos';

        const pointsCanvasEl = this.pointsCanvas.nativeElement;
        const pointsCtx = pointsCanvasEl.getContext('2d')!;
        pointsCanvasEl.width = width;
        pointsCanvasEl.height = height;

        // Dibuja la imagen original
        pointsCtx.drawImage(canvasEl, 0, 0);

        // Dibuja los puntos sobre la imagen
        for (const point of points) {
          const isStain = this.generatePointsService.isPointOnStain(point.x, point.y, ctx);
          pointsCtx.fillStyle = isStain ? 'rgba(0, 200, 0, 0.8)' : 'rgba(255, 0, 0, 0.5)';
          pointsCtx.fillRect(point.x, point.y, 1, 1);
        }

        // Finalizar carga y avanzar pasos
        setTimeout(() => {
          this.isLoading = false;
          this.stepper.setPaso(5);
        }, 800);

        this.stepper.setPaso(4);
      }, 1000);

      this.stepper.setPaso(3);
    }, 1000);
  }


/**
 * Verifica si la proporción de puntos sobre la mancha es muy baja (menor al 1%).
 * Útil para advertencias o alertas al usuario sobre posibles errores de muestreo.
 */
  isSampleTooLow(): boolean {
    if (!this.lastResult) return false;
    return this.lastResult.pointsOnStain / this.lastResult.totalPoints < 0.01;
  }

}
