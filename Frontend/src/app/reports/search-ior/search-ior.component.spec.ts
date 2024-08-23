import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIORComponent } from './search-ior.component';

describe('SearchNcrComponent', () => {
  let component: SearchIORComponent;
  let fixture: ComponentFixture<SearchIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
