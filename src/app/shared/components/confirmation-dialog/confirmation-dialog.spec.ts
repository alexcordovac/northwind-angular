import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog';

describe('ConfirmationDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<ConfirmationDialogComponent>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  function createComponent(data?: ConfirmationDialogData): ConfirmationDialogComponent {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data ?? {} });
    dialogRef.close.calls.reset();
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    const instance = fixture.componentInstance;
    fixture.detectChanges();
    return instance;
  }

  it('should display default labels and message when no data supplied', () => {
    createComponent();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain('Confirm action');
    const buttons = Array.from(element.querySelectorAll('button')).map((btn) => btn.textContent?.trim());
    expect(buttons).toContain('Cancel');
    expect(buttons).toContain('Confirm');
  });

  it('should render custom dialog data and apply busy state', () => {
    createComponent({
      title: 'Delete order',
      message: 'Are you sure?',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      confirmColor: 'warn',
      busy: true,
    });

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent).toContain('Delete order');
    expect(element.querySelector('mat-dialog-content p')?.textContent).toContain('Are you sure?');

    const [cancelBtn, confirmBtn] = Array.from(element.querySelectorAll('button'));
    expect(cancelBtn.getAttribute('disabled')).toBeDefined();
    expect(confirmBtn.getAttribute('disabled')).toBeDefined();
    expect(confirmBtn.className).toContain('mat-warn');
    expect(element.querySelector('mat-progress-spinner')).not.toBeNull();
  });

  it('should close the dialog with the chosen result', () => {
    const component = createComponent();

    component.close(true);
    expect(dialogRef.close).toHaveBeenCalledWith(true);

    dialogRef.close.calls.reset();

    component.close(false);
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
