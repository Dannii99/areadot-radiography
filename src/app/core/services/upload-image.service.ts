import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  /**
   * Valida si una imagen es binaria.
   * Es binaria si todos los píxeles son blanco puro (255,255,255) o negro puro (0,0,0).
   *
   * @param pixels Array de píxeles RGBA (cada 4 valores es un píxel)
   * @returns true si la imagen es estrictamente binaria, false en caso contrario
   */
  validateBinaryImage(pixels: Uint8ClampedArray): boolean {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
      const isBlack = r === 0 && g === 0 && b === 0; // negro
      const isWhite = r === 255 && g === 255 && b === 255; // blanco

      // Si encuentra un color que no sea blanco o negro, la imagen no es binaria
      if (!isBlack && !isWhite) return false;
    }
    return true;
  }


/**
 * Procesa un archivo de imagen cargado por el usuario.
 * Genera una vista previa, extrae la data de píxeles y verifica si es una imagen binaria.
 *
 * @param file Archivo de imagen cargado (desde input type="file")
 * @returns Objeto con información de la imagen, vista previa, tamaño y estado binario
 */
  async processFile(file: File): Promise<{
    imagePreviewUrl: string | null;
    isBinary: boolean;
    width: number;
    height: number;
    imageData?: ImageData;
  }> {
    const img = new Image();
    const reader = new FileReader();

     // Paso 1: Leer archivo como DataURL (base64)
    const imagePreviewUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsDataURL(file);
    });

    // Paso 2: Esperar a que se cargue la imagen en memoria
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = imagePreviewUrl;
    });

    // Paso 3: Dibujar la imagen en un canvas oculto para extraer los píxeles
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const isBinary = this.validateBinaryImage(imageData.data);

    // Paso 4: Devolver los datos procesados
    return {
      imagePreviewUrl: isBinary ? imagePreviewUrl : null,
      isBinary,
      width: img.width,
      height: img.height,
      imageData: isBinary ? imageData : undefined
    };
  }

}
