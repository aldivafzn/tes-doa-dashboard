import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReplyNCRComponent } from './edit-reply-ncr.component';

describe('EditReplyNCRComponent', () => {
  let component: EditReplyNCRComponent;
  let fixture: ComponentFixture<EditReplyNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReplyNCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReplyNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
