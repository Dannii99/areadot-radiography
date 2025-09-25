import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneratePointsService {

 /**
   * Genera n puntos aleatorios dentro de los límites del canvas
   */
  generateRandomPoints(
    n: number,
    width: number,
    height: number
  ): { x: number; y: number }[] {
    const points = [];

    for (let i = 0; i < n; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      points.push({ x, y });
    }

    return points;
  }

  /**
   * Verifica si un punto está sobre una "mancha" blanca en el canvas
   */
  isPointOnStain(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D
  ): boolean {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;

    // Se considera blanco si RGB están cerca de 255
    return r >= 225 && g >= 225 && b >= 225;
  }
}
