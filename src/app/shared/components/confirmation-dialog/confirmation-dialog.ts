import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgTemplateOutlet } from '@angular/common';

export interface ConfirmationDialogData<T = unknown> {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'primary' | 'warn';
  busy?: boolean;
  template?: TemplateRef<any>;
  context?: T;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgTemplateOutlet],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
})
export class ConfirmationDialogComponent<T = unknown> {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent<T>>);
  protected readonly data = inject<ConfirmationDialogData<T>>(MAT_DIALOG_DATA, {
    optional: true,
  }) ?? {};

  protected readonly title = this.data.title ?? 'Confirm action';
  protected readonly message = this.data.message ?? '';
  protected readonly confirmLabel = this.data.confirmLabel ?? 'Confirm';
  protected readonly cancelLabel = this.data.cancelLabel ?? 'Cancel';
  protected readonly confirmColor = this.data.confirmColor ?? 'primary';
  protected readonly busy = signal<boolean>(this.data.busy ?? false);

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}

