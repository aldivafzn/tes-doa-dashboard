import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFollowupIORComponent } from './edit-followup-ior.component';

describe('EditFollowupIORComponent', () => {
  let component: EditFollowupIORComponent;
  let fixture: ComponentFixture<EditFollowupIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFollowupIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFollowupIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
