import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Add this for HTTP testing
import { DetailIORComponent } from './detail-ior.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";

describe('DetailIORComponent', () => {
  let component: DetailIORComponent;
  let fixture: ComponentFixture<DetailIORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule, // Add this
        DetailIORComponent,
        NavbarComponent,
        FooterComponent
      ],
      declarations: [
        DetailIORComponent,
        NavbarComponent,
        FooterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailIORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
