import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultNCRComponent } from './result-ncr.component';

describe('ResultNCRComponent', () => {
  let component: ResultNCRComponent;
  let fixture: ComponentFixture<ResultNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultNCRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
