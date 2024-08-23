import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private toastService: ToastService) { }

  accountid: string | null = null;
  role: string | null = null;

  ngOnInit() {
    this.accountid = sessionStorage.getItem('accountid');
    this.role = sessionStorage.getItem('role');
    console.log('Retrieved accountid:', this.accountid);
    console.log('Retrieved role:', this.role);
  }

  logout() {
    axios.post(`http://localhost:3000/logout`)
      .then(response => {
        sessionStorage.removeItem('accountid');
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
