import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResultNCRComponent } from './edit-result-ncr.component';

describe('EditResultNCRComponent', () => {
  let component: EditResultNCRComponent;
  let fixture: ComponentFixture<EditResultNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditResultNCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditResultNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
