import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFollowupIORComponent } from './search-followup-ior.component';

describe('SearchFollowupIorComponent', () => {
  let component: SearchFollowupIORComponent;
  let fixture: ComponentFixture<SearchFollowupIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFollowupIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFollowupIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
