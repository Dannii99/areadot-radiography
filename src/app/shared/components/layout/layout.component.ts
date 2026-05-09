import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalculator, faClockRotateLeft, faImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  selectedTabIndex: number = 0;

  faImage = faImage;
  faCalculator = faCalculator;
  faClockRotateLeft = faClockRotateLeft;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentSegment = this.router.url.split('/')[1];
    const childRoutes = this.router.config.find(r => r.component === LayoutComponent)?.children || [];
    const activeIndex = childRoutes.findIndex(route => route.path === currentSegment);

    this.onTabChange(activeIndex);
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.router.navigate([`/${this.router.config[0].children?.[index].path}`]);
  }

}
