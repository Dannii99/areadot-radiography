import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

   selectedTabIndex: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentSegment = this.router.url.split('/')[1];
    const childRoutes = this.router.config.find(r => r.component === LayoutComponent)?.children || []; // recorrer las rutas hijas
    const activeIndex = childRoutes.findIndex(route => route.path === currentSegment); //index de la vista actual

    this.onTabChange(activeIndex);
  }

  /**
 * Maneja el cambio de pestaña (tab) y redirige a la ruta correspondiente.
 *
 * @param index Índice de la pestaña seleccionada
 */
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.router.navigate([`/${this.router.config[0].children?.[index].path}`]);
  }

}
