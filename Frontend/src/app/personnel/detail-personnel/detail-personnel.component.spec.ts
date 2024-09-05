import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Add this for HTTP testing
import { DetailPersonnelComponent } from './detail-personnel.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";

describe('DetailPersonnelComponent', () => {
  let component: DetailPersonnelComponent;
  let fixture: ComponentFixture<DetailPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule, // Add this
        DetailPersonnelComponent,
        NavbarComponent,
        FooterComponent
      ],
      declarations: [
        DetailPersonnelComponent,
        NavbarComponent,
        FooterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
