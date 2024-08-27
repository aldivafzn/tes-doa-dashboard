import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  sub: string,
  iat: number,
  exp: number
}

interface AccountData {
  name: string;
  email: string;
  unit: string;
  role: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements OnInit {

  constructor(private toastService: ToastService, private authService: AuthService) { }

  selectedTab: string = 'account-info';
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  accountid: string | null = null;
  role: string | null = null;
  account: any = {};

  currentAccountID = '';
  Account_data: AccountData = {
    name: '',
    email: '',
    unit: '',
    role: ''
  };
  allAccounts: any[] = [];
  ChangePass = {
    email: '',
    currentPass: '',
    newPass: ''
  };
  DeleteAccount = {
    email: '',
    password: ''
  };

  async ngOnInit() {
    const token = this.authService.getToken();
    this.role = 'Admin';
    if (token) {
      const { sub } = jwtDecode<JwtPayload>(token);
      this.accountid = sub;
      console.log('Retrieved accountid:', this.accountid);
      if (this.accountid) {
        this.getAccountInfo();
        this.fetchAllAccounts();
      }
    }
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:4040/account/show', { accountid: this.accountid });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }

  async fetchAllAccounts() {
    try {
        const response = await axios.get('http://localhost:4040/account/show-all');
        console.log("Fetched accounts:", response.data.accounts);
        this.allAccounts = response.data.accounts;
        console.log(this.allAccounts);
    } catch (error) {
        console.error("Error fetching all accounts:", error);
        console.error("Entire error object:", error);
    }
  }

  async changePassword() {
    try {
        const response = await axios.post('http://localhost:4040/account/update-password', {
            email: this.ChangePass.email,
            currentPass: this.ChangePass.currentPass,
            newPass: this.ChangePass.newPass
        });

        if (response.data.status === 200) {
            console.log('Password updated successfully');
            this.toastService.successToast('Password updated successfully');
        } else {
            console.log('Email or password is incorrect');
            this.toastService.failedToast('Email or password is incorrect');
        }

    } catch (error) {
        console.log("Error updating password:", error);
        this.toastService.failedToast('Failed to update password');
    }
  }

  async deleteAccount() {
    try {
        const response = await axios.post('http://localhost:4040/account/delete', {
          email: this.DeleteAccount.email,
          password: this.DeleteAccount.password
        });

        console.log("Delete Password :", response.data.account);

        if (response.data.status === 200) {
            console.log('Account successfully Deleted');
            this.toastService.successToast('Account successfully Deleted');
        } else {
            console.log('Email or password is incorrect');
            this.toastService.failedToast('Email or password is incorrect');
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        this.toastService.failedToast('Error deleting account');
    }
  }
}