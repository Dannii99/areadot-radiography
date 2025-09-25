import { Injectable } from '@angular/core';
import { ResultRow } from '@core/models/result.interface';
import { GeneratePointsService } from '@core/services/generate-points.service';

@Injectable({
  providedIn: 'root'
})
export class CalculateAreaService {

  constructor(private generatePointsService: GeneratePointsService) {}

  /**
 * Calcula el área estimada de una mancha blanca en el canvas usando muestreo aleatorio.
 *
 * @param ctx Contexto 2D del canvas principal
 * @param width Ancho del canvas
 * @param height Alto del canvas
 * @param n Número de puntos aleatorios a generar para el muestreo
 * @returns Objeto con el resultado del cálculo y los puntos generados
 */

  calculateAreaFromCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    n: number
  ): { result: ResultRow; points: { x: number; y: number }[] } {
    const points = this.generatePointsService.generateRandomPoints(n, width, height);

    let pointsOnStain = 0;

    // Contar cuántos puntos cayeron sobre la mancha (color blanco)
    for (const point of points) {
      if (this.generatePointsService.isPointOnStain(point.x, point.y, ctx)) {
        pointsOnStain++;
      }
    }

    // Calcular área total de la imagen
    const totalArea = width * height;

    // Estimar área de la mancha como proporción de puntos que cayeron sobre ella
    const estimatedStainArea = totalArea * (pointsOnStain / n);

    // Estructura de resultado para mostrar o almacenar
    const result: ResultRow = {
      totalPoints: n,
      pointsOnStain,
      totalArea,
      estimatedStainArea,
      date: new Date()
    };

    return { result, points };
  }

  /**
 * Guarda un nuevo resultado en el historial almacenado en localStorage.
 *
 * @param result Objeto con el resultado de un cálculo
 * @returns Historial actualizado de resultados
 */
  saveToHistory(result: ResultRow): ResultRow[] {
    // Agregar el nuevo resultado al historial
    const existing = JSON.parse(localStorage.getItem('historial') || '[]');
    const updatedHistory = [...existing, result];
    localStorage.setItem('historial', JSON.stringify(updatedHistory));

    return updatedHistory;
  }
}
