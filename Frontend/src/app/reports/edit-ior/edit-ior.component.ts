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

interface Occurence {
  id_ior: string,
  subject_ior: string,
  occur_nbr: string,
  occur_date: Date | string,
  reference_ior: string,
  to_uic: string,
  cc_uic: string,
  category_occur: string,
  type_or_pnbr: string,
  level_type: string,
  detail_occurance: string,
  ReportedBy: string,
  reporter_uic: string,
  report_date: Date | string,
  reporter_identity: string,
  Data_reference: string,
  hirac_process: string,
  initial_probability: string,
  initial_severity: string,
  initial_riskindex: string,
  attachment: File | null
}

@Component({
  selector: 'app-edit-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-ior.component.html',
  styleUrl: './edit-ior.component.css'
})
export class EditIORComponent implements OnInit{
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentAccountID = '';
  currentIorID = '';
  iorData: Occurence = {
    id_ior: '',
    subject_ior: '',
    category_occur: '',
    occur_nbr: '',
    occur_date: '',
    reference_ior: '',
    type_or_pnbr: '',
    to_uic: '',
    cc_uic: '',
    level_type: '',
    detail_occurance: '',
    ReportedBy: '',
    reporter_uic: '',
    report_date: '',
    reporter_identity: '',
    Data_reference: '',
    hirac_process: '',
    initial_probability: '',
    initial_severity: '',
    initial_riskindex: '',
    attachment: null
  };

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      console.log('Retrieved role:', role);
      if (role !== 'Admin' && role !== 'IM') {
        this.toastService.failedToast('Unauthorized to access page');
        window.location.href = '/home';
      }
    }

    const id_ior = sessionStorage.getItem('id_ior');
    if (id_ior) {
      this.currentIorID = id_ior;
      console.log('Retrieved id_ior:', id_ior);
      this.fetchIOR();
    } else {
      window.location.href = '/searchIOR';
    }
  }

  async fetchIOR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ior/show',
        { id_IOR: this.currentIorID }
      );
      this.iorData = response.data.result;
      this.iorData.ReportedBy = response.data.result.reportedby;
      this.iorData.Data_reference = response.data.result.data_reference;
      this.iorData.occur_date = this.iorData.occur_date.toString().slice(0, 10);
      this.iorData.report_date = this.iorData.report_date.toString().slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching IOR');
      console.error('There was an error fetching IOR:', error);
    }
  }

  async updateIOR() {
    this.iorData.occur_date = new Date(this.iorData.occur_date)
    this.iorData.report_date = new Date(this.iorData.report_date)
    console.log("Sending data:", this.iorData);
    const generatingToastElement = this.toastService.generatingToast('Updating IOR...');
    try {
      const response = await axios.put('http://34.87.6.132:4040/ior/update', this.iorData);
      if (response.data.status === 200) {
        this.toastService.successToast('IOR updated successfully');
        console.log('IOR updated successfully');
        window.location.href = '/detailIOR';
      } else {
        this.toastService.failedToast('Failed to update IOR');
        console.error('Failed to update IOR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating IOR');
      console.error('There was an error updating IOR', error);
    }
    document.removeChild(generatingToastElement);
  }
}
