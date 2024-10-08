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
  corrective_act: string,
  preventive_act: string,
  identified_by: string,
  identified_date: Date | string,
  accept_by: string,
  audit_accept: Date | string,
  temporarylink: string
}

@Component({
  selector: 'app-reply-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-reply-ncr.component.html',
  styleUrl: './edit-reply-ncr.component.css'
})
export class EditReplyNCRComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentReplyID = '';
  replyNCRData: ReplyNCR = {
    ncr_init_id: '',
    rca_problem: '',
    corrective_act: '',
    preventive_act: '',
    identified_by: '',
    identified_date: '',
    accept_by: '',
    audit_accept: '',
    temporarylink: '',
  }

  ngOnInit() { 
    const id_ncr_reply = sessionStorage.getItem('id_ncr_reply');
    if (id_ncr_reply) {
      this.currentReplyID = id_ncr_reply;
    }
    this.fetchReply();
  }

  async fetchReply() {
    try {
      const response = await axios.post('http://localhost:4040/ncr/reply/show', {
        id_ncr_reply: this.currentReplyID
      });
      if (response.data.message === 'Showing NCR Reply') {
        this.replyNCRData = response.data.showProduct;
        this.replyNCRData.identified_by = response.data.showProduct.identified_by_auditee;
        this.replyNCRData.accept_by = response.data.showProduct.accept_by_auditor;
        this.replyNCRData.audit_accept = response.data.showProduct.auditor_accept_date;
        this.replyNCRData.corrective_act = response.data.showProduct.corrective_action;
        this.replyNCRData.preventive_act = response.data.showProduct.preventive_action;
        this.replyNCRData.identified_date = this.replyNCRData.identified_date.toString().slice(0, 10);
        this.replyNCRData.audit_accept = this.replyNCRData.audit_accept.toString().slice(0, 10);
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async updateReplyNCR() {
    this.replyNCRData.identified_date = new Date(this.replyNCRData.identified_date);
    this.replyNCRData.audit_accept = new Date(this.replyNCRData.audit_accept);
    console.log("Sending data:", this.replyNCRData);
    const generatingToastElement = this.toastService.generatingToast('Updating NCR Reply...');
    try {
      const response = await axios.put('http://localhost:4040/ncr/reply/update', this.replyNCRData);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR Reply updated successfully');
        console.log('NCR Reply updated successfully');
        window.location.href = '/detailNCR';
      } else {
        this.toastService.failedToast('Failed to update NCR Reply');
        console.error('Failed to update NCR Reply:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating NCR Reply');
      console.error('There was an error updating NCR Reply', error);
    }
    document.removeChild(generatingToastElement);
  }
}
