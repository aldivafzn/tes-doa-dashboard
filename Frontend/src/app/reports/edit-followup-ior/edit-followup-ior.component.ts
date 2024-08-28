import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import axios from 'axios';

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
  selector: 'app-edit-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-followup-ior.component.html',
  styleUrl: './edit-followup-ior.component.css'
})
export class EditFollowupIORComponent implements OnInit{
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentAccountID = '';
  currentFollupIorID = '';
  follupData: FollowUpIOR = {
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

  ngOnInit() {
    const id_follup_ior = localStorage.getItem('id_follup_ior');
    if (id_follup_ior) {
      this.currentFollupIorID = id_follup_ior;
      console.log('Retrieved id_follup_ior:', id_follup_ior);
      this.fetchFollowupIOR();
    } else {
      window.location.href = '/searchFollowupIOR';
    }
  }

  async fetchFollowupIOR() {
    try {
      const response = await axios.post('http://localhost:4040/ior/follow-up/show',
        { id_follup: this.currentFollupIorID }
      );
      this.follupData = response.data.result;
      this.follupData.follup_date = this.follupData.follup_date.toString().slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching IOR');
      console.error('There was an error fetching IOR:', error);
    }
  }

  async updateFollowupIOR() {
    this.follupData.id_IOR = this.currentFollupIorID;
    this.follupData.follup_date = new Date(this.follupData.follup_date)
    console.log("Sending data:", this.follupData);
    try {
      const response = await axios.put('http://localhost:4040/ior/follow-up/update', this.follupData);
      if (response.data.status === 200) {
        this.toastService.successToast('Followup IOR updated successfully');
        console.log('Followup IOR updated successfully');
        localStorage.removeItem('id_follup_ior');
        window.location.href = '/searchFollowupIOR';
      } else {
        this.toastService.failedToast('Failed to update Followup IOR');
        console.error('Failed to update Followup IOR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating Followup IOR');
      console.error('There was an error updating Followup IOR', error);
    }
  }
}
