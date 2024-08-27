import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../auth.service';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  sub: string,
  iat: number,
  exp: number
}

@Component({
  selector: 'app-followon-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './followon-ior.component.html',
  styleUrl: './followon-ior.component.css'
})
export class FollowonIORComponent {
  accountid: string | null = null;
  account: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { sub } = jwtDecode<JwtPayload>(token);
      this.accountid = sub;
    }
  }

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:3000/showAccount', { accountid: this.accountid });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }
}
