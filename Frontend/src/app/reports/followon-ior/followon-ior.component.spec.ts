import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowonIORComponent } from './followon-ior.component';

describe('FollowonIORComponent', () => {
  let component: FollowonIORComponent;
  let fixture: ComponentFixture<FollowonIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowonIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowonIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
