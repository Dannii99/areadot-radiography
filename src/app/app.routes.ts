import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    title: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        title: 'Home',
        loadChildren: () => import('./pages/home/home.routes').then((m) => m.routes)
      },
      {
        path: 'record',
        title: 'Record',
        loadChildren: () => import('./pages/record/record.routes').then((m) => m.routes)
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ]
  },
  {
      path: '**',
      redirectTo: '/home',
      pathMatch: 'full',
  },
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
  }
];
