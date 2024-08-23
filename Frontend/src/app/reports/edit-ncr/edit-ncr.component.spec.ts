import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNCRComponent } from './edit-ncr.component';

describe('EditNCRComponent', () => {
  let component: EditNCRComponent;
  let fixture: ComponentFixture<EditNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
