import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MenuItem } from './shared/models/menu-item.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly menuCollapsed = signal<boolean>(false);
  protected readonly menuItems = signal<MenuItem[]>([
    {
      label: 'Orders',
      icon: 'shopping_cart',
      route: '/orders',
    },
    {
      label: 'Products',
      icon: 'inventory_2',
      route: '/products',
    },
  ]);

  protected readonly collapseTooltip = computed(() =>
    this.menuCollapsed() ? 'Expand navigation' : 'Collapse navigation',
  );

  protected toggleMenu(): void {
    this.menuCollapsed.update((value) => !value);
  }
}
