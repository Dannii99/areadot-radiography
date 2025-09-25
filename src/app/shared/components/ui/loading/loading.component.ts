import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit, OnDestroy {

  @Input() visible: boolean = false; // mostrar cargamndo
  @Input() message: string = 'Cargando..'; // mensaje controlado

  ngOnInit(): void {
    document.body.classList.add('overflow-hidden');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overflow-hidden');
  }

}
