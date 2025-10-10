import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MenuItem } from './shared/models/menu-item.model';
import { notificationsFeature } from '@core/state/notifications/notifications.reducer';
import { NotificationsActions } from '@core/state/notifications/notifications.actions';

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
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);
  private readonly latestMessage = toSignal(
    this.store.select(notificationsFeature.selectMessage),
    { initialValue: null },
  );
  private readonly showNotificationsEffect = effect(() => {
    const message = this.latestMessage();
    if (message) {
      this.snackBar.open(message, 'Dismiss', { duration: 4000 });
      this.store.dispatch(NotificationsActions.clearMessage());
    }
  });

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
