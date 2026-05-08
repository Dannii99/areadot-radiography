import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  validateGrayscaleImage(pixels: Uint8ClampedArray, tolerance = 15): boolean {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
      const isGray = Math.abs(r - g) <= tolerance && Math.abs(g - b) <= tolerance;
      if (!isGray) return false;
    }
    return true;
  }

  async processFile(file: File): Promise<{
    imagePreviewUrl: string | null;
    isGrayscale: boolean;
    width: number;
    height: number;
    imageData?: ImageData;
  }> {
    const img = new Image();
    const reader = new FileReader();

    const imagePreviewUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsDataURL(file);
    });

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = imagePreviewUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const isGrayscale = this.validateGrayscaleImage(imageData.data);

    return {
      imagePreviewUrl: isGrayscale ? imagePreviewUrl : null,
      isGrayscale,
      width: img.width,
      height: img.height,
      imageData: isGrayscale ? imageData : undefined
    };
  }

}
