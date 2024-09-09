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
  selector: 'app-edit-result-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-result-ncr.component.html',
  styleUrl: './edit-result-ncr.component.css'
})
export class EditResultNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentResultId = '';
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
    const id_ncr_result = sessionStorage.getItem('id_ncr_result');
    if (id_ncr_result) {
      this.currentResultId = id_ncr_result;
    }
  }

  async fetchResult() {
    try {
      const response = await axios.post('http://localhost:4040/ncr/result/show', {
        id_ncr_result: this.currentResultId
      });
      if (response.data.message === 'Showing NCR Follow Result') {
        this.resultNCRData = response.data.result;
        this.resultNCRData.proposed_close_date = this.resultNCRData.proposed_close_date.toString().slice(0, 10);
        this.resultNCRData.close_approved_date = this.resultNCRData.close_approved_date.toString().slice(0, 10);
        this.resultNCRData.verified_date = this.resultNCRData.verified_date.toString().slice(0, 10);
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async updateResultNCR() {
    this.resultNCRData.proposed_close_date = new Date(this.resultNCRData.proposed_close_date);
    this.resultNCRData.close_approved_date = new Date(this.resultNCRData.close_approved_date);
    this.resultNCRData.verified_date = new Date(this.resultNCRData.verified_date);
    console.log("Sending data:", this.resultNCRData);
    const generatingToastElement = this.toastService.generatingToast('Updating NCR Follow Up Result...');
    try {
      const response = await axios.post('http://localhost:4040/ncr/result/update', this.resultNCRData);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR Follow Up Result updated successfully');
        console.log('NCR Follow Up Result updated successfully');
        window.location.href = '/detailNCR';
      } else {
        this.toastService.failedToast('Failed to update NCR Follow Up Result');
        console.error('Failed to update NCR Follow Up Result:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating NCR Follow Up Result');
      console.error('There was an error updating NCR Follow Up Result', error);
    }
    document.removeChild(generatingToastElement);
  }
}
