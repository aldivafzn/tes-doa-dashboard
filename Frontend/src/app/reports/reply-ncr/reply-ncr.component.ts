import { Component, OnInit } from '@angular/core';
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

interface ReplyNCR {
  ncr_init_id: string,
  rca_problem: string,
  corrective_action: string,
  preventive_act: string,
  identified_by: string,
  identified_date: Date | string,
  accept_by: string,
  audit_accept: Date | string,
  temporarylink: string,
  recommend_corrective_action: string
}

@Component({
  selector: 'app-reply-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './reply-ncr.component.html',
  styleUrl: './reply-ncr.component.css'
})
export class ReplyNCRComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentNCRInitId = '';
  replyNCRData: ReplyNCR = {
    ncr_init_id: '',
    rca_problem: '',
    corrective_action: '',
    preventive_act: '',
    identified_by: '',
    identified_date: '',
    accept_by: '',
    audit_accept: '',
    temporarylink: '',
    recommend_corrective_action: ''
  }

  ngOnInit() { 
    const ncr_init_id = sessionStorage.getItem('ncr_init_id');
    if (ncr_init_id) {
      this.currentNCRInitId = ncr_init_id;
    }
  }

  async submitReplyNCR() {
    this.replyNCRData.ncr_init_id = this.currentNCRInitId;
    this.replyNCRData.identified_date = new Date(this.replyNCRData.identified_date);
    this.replyNCRData.audit_accept = new Date(this.replyNCRData.audit_accept);
    console.log("Sending data:", this.replyNCRData);
    const generatingToastElement = this.toastService.generatingToast('Generating NCR Reply...');
    try {
      const response = await axios.post('http://localhost:4040/ncr/reply/add', this.replyNCRData);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR Reply added successfully');
        console.log('NCR Reply added successfully');
        window.location.href = '/detailNCR';
      } else {
        this.toastService.failedToast('Failed to add NCR Reply');
        console.error('Failed to add NCR Reply:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding NCR Reply');
      console.error('There was an error adding NCR Reply', error);
    }
    document.removeChild(generatingToastElement);
  }
}
