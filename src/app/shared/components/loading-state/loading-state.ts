import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
})
export class LoadingState {
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly retry = input<(() => void) | null>(null);
  readonly loadingLabel = input<string>('Loading');
  readonly retryLabel = input<string>('Retry');

  protected readonly isError = computed(() => !this.loading() && !!this.error());

  protected onRetry(): void {
    const retryFn = this.retry();
    if (retryFn) {
      retryFn();
    }
  }
}
