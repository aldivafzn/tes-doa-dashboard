import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

interface FollowUpIOR {
  id_IOR: string,
  follup_detail: string,
  follupby: string,
  follup_uic: string,
  follup_date: Date | string,
  follup_datarefer: string | boolean,
  follup_status: string,
  nextuic_follup: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string
}

@Component({
  selector: 'app-followon-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './followon-ior.component.html',
  styleUrl: './followon-ior.component.css'
})

export class FollowonIORComponent {
  constructor(private toastService: ToastService, private authService: AuthService) { }

  followIORData: FollowUpIOR = {
    id_IOR: '',
    follup_detail: '',
    follupby: '',
    follup_uic: '',
    follup_date: '',
    follup_datarefer: '',
    follup_status: '',
    nextuic_follup: '',
    current_probability: '',
    current_severity: '',
    current_riskindex: ''
  };
  currentAccountID: string = '';

  account: any = {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { userId } = jwtDecode<JwtPayload>(token);
      this.currentAccountID = userId;
      console.log('Retrieved accountid:', this.currentAccountID);
    }
    if (this.currentAccountID) {
      this.getAccountInfo();
    }

    const id_ior = sessionStorage.getItem('id_ior');
    if (id_ior) {
      this.followIORData.id_IOR = id_ior;
    }
  }

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:4040/account/show', { accountid: this.currentAccountID });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }

  async submitFollowIOR() {
    this.followIORData.follupby = this.account.name;
    this.followIORData.follup_date = new Date(this.followIORData.follup_date);
    console.log("Sending data:", this.followIORData);
    const generatingToastElement = this.toastService.generatingToast('Generating IOR Follow On...');
    try {
      const response = await axios.post('http://localhost:4040/ior/follow-up/add', this.followIORData);

      if (response.data.status === 200) {
        this.toastService.successToast('Follow on NCR added successfully');
        console.log('Follow on NCR added successfully');
        window.location.href = '/detailIOR';
      } else {
        this.toastService.failedToast('Failed to add Follow on NCR');
        console.error('Failed to add Follow on NCR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Follow on NCR');
      console.error('There was an error adding Follow on NCR', error);
    }
    document.removeChild(generatingToastElement);
  }
}
