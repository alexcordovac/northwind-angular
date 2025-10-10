import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { EntityLookupComponent } from './entity-lookup';

describe('EntityLookupComponent', () => {
  let component: EntityLookupComponent<any>;
  let fixture: ComponentFixture<EntityLookupComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityLookupComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

