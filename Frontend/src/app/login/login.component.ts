import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private toastService: ToastService) { }

  async login() {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: this.email,
        Password: this.password
      });

      if (response.data.status === 200) {
        sessionStorage.setItem('accountid', response.data.user.accountid);
        sessionStorage.setItem('role', response.data.user.role);
        console.log('accountid:', response.data.user.accountid);
        console.log('role:', response.data.user.role);
        this.toastService.successToast('Login successful');
        console.log('Login successful');
        this.router.navigate(['/home']);
      } else {
        this.toastService.failedToast('Email or password is incorrect');
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
}