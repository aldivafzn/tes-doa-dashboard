import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Add this for HTTP testing
import { DetailNCRComponent } from './detail-ncr.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";

describe('DetailNCRComponent', () => {
  let component: DetailNCRComponent;
  let fixture: ComponentFixture<DetailNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule, // Add this
        DetailNCRComponent,
        NavbarComponent,
        FooterComponent
      ],
      declarations: [
        DetailNCRComponent,
        NavbarComponent,
        FooterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
