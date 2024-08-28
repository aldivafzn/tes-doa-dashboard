import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowonIorComponent } from './followon-ior.component';

describe('FollowonIorComponent', () => {
  let component: FollowonIorComponent;
  let fixture: ComponentFixture<FollowonIorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowonIorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowonIorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
