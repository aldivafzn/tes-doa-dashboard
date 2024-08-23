import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIORComponent } from './form-ior.component';

describe('FormIORComponent', () => {
  let component: FormIORComponent;
  let fixture: ComponentFixture<FormIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
