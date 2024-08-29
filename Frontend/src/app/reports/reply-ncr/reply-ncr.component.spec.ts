import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyNCRComponent } from './reply-ncr.component';

describe('ReplyNCRComponent', () => {
  let component: ReplyNCRComponent;
  let fixture: ComponentFixture<ReplyNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyNCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
