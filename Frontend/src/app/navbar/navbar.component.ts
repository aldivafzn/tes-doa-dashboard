import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  sub: string,
  iat: number,
  exp: number
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) { }

  accountId: string | null = null;
  role: string | null = null;

  ngOnInit() {
    if (window.location.href !== '/ior/edit') {
      localStorage.removeItem('id_ior');
    }
    const token = this.authService.getToken();
    if (token) {
      const { sub } = jwtDecode<JwtPayload>(token);
      this.accountId = sub;
      console.log('Retrieved accountid:', this.accountId);
      if (this.accountId) {
        this.getRole();
        if (this.role) {
          localStorage.setItem('role', this.role.toString());
        }
      }
    } else {
      window.location.href = '/login';
    }
  }

  async getRole() {
    try {
      const response = await axios.post('http://localhost:4040/account/show', { accountid: this.accountId });
      if (response.data.status === 200 && response.data.account) {
        this.role = response.data.account.role;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }

  logout() {
    axios.post(`http://localhost:4040/account/logout`)
      .then(response => {
        this.authService.removeToken();
        localStorage.removeItem('role');
        this.router.navigate(['/login']);
        this.toastService.successToast('Logout successful');
        console.log(response.data);
      })
      .catch(error => {
        console.error('Logout failed:', error);
        this.toastService.failedToast('Logout failed');
      });
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}
