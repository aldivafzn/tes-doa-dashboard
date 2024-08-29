import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Add this for HTTP testing
import { ShowReplyNCRComponent } from './show-reply-ncr.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";

describe('ShowReplyNCRComponent', () => {
  let component: ShowReplyNCRComponent;
  let fixture: ComponentFixture<ShowReplyNCRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule, // Add this
        ShowReplyNCRComponent,
        NavbarComponent,
        FooterComponent
      ],
      declarations: [
        ShowReplyNCRComponent,
        NavbarComponent,
        FooterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowReplyNCRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here
});
