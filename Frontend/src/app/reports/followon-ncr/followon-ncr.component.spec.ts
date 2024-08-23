import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowonNcrComponent } from './followon-ncr.component';

describe('FollowonNcrComponent', () => {
  let component: FollowonNcrComponent;
  let fixture: ComponentFixture<FollowonNcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowonNcrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowonNcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
