import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

interface ResultNCR {
  ncr_init_id: string,
  close_corrective_actions: string,
  proposed_close_auditee: string,
  proposed_close_date: Date | string,
  is_close: boolean | string,
  effectiveness: string,
  refer_verification: string,
  sheet_no: string,
  new_ncr_issue_nbr: string,
  close_approved_by: string,
  close_approved_date: Date | string,
  verified_chief_im: string,
  verified_date: Date | string,
  temporarylink: string
}

@Component({
  selector: 'app-result-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './result-ncr.component.html',
  styleUrl: './result-ncr.component.css'
})
export class ResultNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentNCRInitId = '';
  resultNCRData: ResultNCR = {
    ncr_init_id: '',
    proposed_close_auditee: '',
    close_corrective_actions: '',
    proposed_close_date: '',
    is_close: '',
    effectiveness: '',
    refer_verification: '',
    sheet_no: '',
    new_ncr_issue_nbr: '',
    close_approved_by: '',
    close_approved_date: '',
    verified_chief_im: '',
    verified_date: '',
    temporarylink: ''
  }

  ngOnInit() { 
    const ncr_init_id = localStorage.getItem('ncr_init_id');
    if (ncr_init_id) {
      this.currentNCRInitId = ncr_init_id;
    }
  }

  async submitResultNCR() {
    this.resultNCRData.ncr_init_id = this.currentNCRInitId;
    this.resultNCRData.proposed_close_date = new Date(this.resultNCRData.proposed_close_date);
    this.resultNCRData.close_approved_date = new Date(this.resultNCRData.close_approved_date);
    this.resultNCRData.verified_date = new Date(this.resultNCRData.verified_date);
    console.log("Sending data:", this.resultNCRData);
    try {
      const response = await axios.post('http://localhost:4040/ncr/result/add', this.resultNCRData);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR Follow Result added successfully');
        console.log('NCR Follow Result added successfully');
        window.location.href = '/detailNCR';
      } else {
        this.toastService.failedToast('Failed to add NCR Follow Result');
        console.error('Failed to add NCR Follow Result:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding NCR Follow Result');
      console.error('There was an error adding NCR Follow Result', error);
    }
  }
}
