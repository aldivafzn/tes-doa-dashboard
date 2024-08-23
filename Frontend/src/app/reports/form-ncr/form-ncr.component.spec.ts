import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNCRComponent } from './form-ncr.component';

describe('FormNCRComponent', () => {
  let component: FormNCRComponent;
  let fixture: ComponentFixture<FormNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
