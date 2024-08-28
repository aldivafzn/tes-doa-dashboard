import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Add this for HTTP testing
import { SearchNCRComponent } from './search-ncr.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";

describe('SearchNCRComponent', () => {
  let component: SearchNCRComponent;
  let fixture: ComponentFixture<SearchNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule, // Add this
        SearchNCRComponent,
        NavbarComponent,
        FooterComponent
      ],
      declarations: [
        SearchNCRComponent,
        NavbarComponent,
        FooterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
