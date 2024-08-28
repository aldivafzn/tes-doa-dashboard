import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIORComponent } from './edit-ior.component';

describe('EditIORComponent', () => {
  let component: EditIORComponent;
  let fixture: ComponentFixture<EditIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
