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
  sub: string,
  iat: number,
  exp: number
}

interface Occurence {
  id_ior: string,
  subject_ior: string,
  occur_nbr: string | null,
  occur_date: Date | null,
  reference_ior: string | null,
  to_uic: string | null,
  cc_uic: string | null,
  category_occur: string | null,
  type_or_pnbr: string | null,
  level_type: string | null,
  detail_occurrance: string | null,
  reportedby: string | null,
  reporter_uic: string | null,
  report_date: Date | null,
  report_identity: string | null,
  data_reference: string | null,
  hirac_process: string | null,
  initial_probability: string | null,
  initial_severity: string | null,
  initial_riskindex: string | null,
  current_probability: string | null,
  current_severity: string | null,
  current_riskindex: string | null
  document_id: string | null
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
    category_occur: null,
    occur_nbr: null,
    occur_date: null,
    reference_ior: null,
    type_or_pnbr: null,
    to_uic: null,
    cc_uic: null,
    level_type: null,
    detail_occurrance: null,
    reportedby: null,
    reporter_uic: null,
    report_date: null,
    report_identity: null,
    data_reference: null,
    hirac_process: null,
    initial_probability: null,
    initial_severity: null,
    initial_riskindex: null,
    current_probability: null,
    current_severity: null,
    current_riskindex: null,
    document_id: null
  };

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { sub } = jwtDecode<JwtPayload>(token);
      this.currentAccountID = sub;
      // console.log('Retrieved accountid:', accountID);
      // insert functions to decode token and fetch accountid & role with token
    } else {
      window.location.href = '/login';
    }

    const id_ior = localStorage.getItem('id_ior');
    if (id_ior) {
      this.currentIorID = id_ior;
      console.log('Retrieved id_ior:', id_ior);
      this.fetchIOR();
    }
  }

  async fetchIOR() {
    try {
      const response = await axios.post('http://localhost:4040/ior/show',
        { id_IOR: this.currentIorID }
      );
      this.iorData = response.data.result[0];
      // this.iorData.occur_date = this.iorData.occur_date.slice(0, 10);
      // this.iorData.report_date = this.iorData.report_date.slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching IOR');
      console.error('There was an error fetching IOR:', error);
    }
  }

  async updateIOR() {
    console.log("Sending data:", this.iorData);
    try {
      const response = await axios.put('http://localhost:4040/ior/update', this.iorData);
      if (response.data.status === 200) {
        this.toastService.successToast('IOR updated successfully');
        console.log('IOR updated successfully');
        localStorage.removeItem('id_ior');
        window.location.href = '/searchIOR';
      } else {
        this.toastService.failedToast('Failed to update IOR');
        console.error('Failed to update IOR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating IOR');
      console.error('There was an error updating IOR', error);
    }
  }
}
