import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFollowonIORComponent } from './edit-followon-ior.component';

describe('EditFollowonIORComponent', () => {
  let component: EditFollowonIORComponent;
  let fixture: ComponentFixture<EditFollowonIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFollowonIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFollowonIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
