import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeros',
  standalone: true
})
export class NumerosPipe implements PipeTransform {

  transform(value: any ): any {
    if(!isNaN(value)){
      value = value?.toString().replaceAll('.', ',');
      value = value.split(',');
      value[0] = value[0]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return value.join(',');
    }
    return value;
  }

}
