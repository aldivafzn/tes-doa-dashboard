import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFollowonIORComponent } from './search-followon-ior.component';

describe('SearchFollownIORComponent', () => {
  let component: SearchFollowonIORComponent;
  let fixture: ComponentFixture<SearchFollowonIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFollowonIORComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFollowonIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
