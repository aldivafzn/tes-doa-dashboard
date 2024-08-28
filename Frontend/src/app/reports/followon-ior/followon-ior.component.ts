import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

interface JwtPayload {
  email: string,
  sub: string,
  iat: number,
  exp: number
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
  subjectIOR: string = '';

  async fetchDataBySubject() {
    try {
      const response = await axios.post('http://localhost:4040/ior/search', { input: this.subjectIOR });
      if (response.data.status === 200) {
        const ior_id = response.data.showProduct[0].id_ior;
        return ior_id;
      } else {
        this.toastService.failedToast('No IOR of that subject is found');
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async submitFollowIOR() {
    this.followIORData.id_IOR = await this.fetchDataBySubject();
    if (!this.followIORData.id_IOR) {
      return;
    }
    this.followIORData.follup_date = new Date(this.followIORData.follup_date);
    // this.followIORData.follup_datarefer = !!this.followIORData.follup_datarefer;
    console.log("Sending data:", this.followIORData);
    try {
      const response = await axios.post('http://localhost:4040/ior/follow-up/add', this.followIORData);

      if (response.data.status === 200) {
        this.toastService.successToast('Follow on NCR added successfully');
        console.log('Follow on NCR added successfully');
      } else {
        this.toastService.failedToast('Failed to add Follow on NCR');
        console.error('Failed to add Follow on NCR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Follow on NCR');
      console.error('There was an error adding Follow on NCR', error);
    }
  }
}
