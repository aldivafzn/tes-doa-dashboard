import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPersonnelComponent } from './search-personnel.component';

describe('SearchPersonnelComponent', () => {
  let component: SearchPersonnelComponent;
  let fixture: ComponentFixture<SearchPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPersonnelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
