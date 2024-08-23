import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-edit-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-ior.component.html',
  styleUrl: './edit-ior.component.css'
})
export class EditIORComponent implements OnInit{
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  currentIorID = '';
  iorData = {
    id_ior: '',
    subjectIOR: '',
    occurNo: '',
    occurDate: '',
    referenceIOR: '',
    toUIC: '',
    ccUIC: '',
    categoryOccur: '',
    typeOrPnbr: '',
    levelType: '',
    detailOccurence: '',
    reportedBy: '',
    reporterUIC: '',
    reportDate: '',
    reporterIdentity: '',
    dataReference: '',
    hiracProcess: '',
    initialProbability: '',
    initialSeverity: '',
    initialRiskIndex: '',
    documentId: ''
  };

  ngOnInit() {
    const accountID = sessionStorage.getItem('accountid');
    if (accountID) {
      this.currentAccountID = accountID;
      console.log('Retrieved accountid:', accountID);
    } else {
      window.location.href = '/login';
    }

    const id_ior = sessionStorage.getItem('id_ior');
    if (id_ior) {
      this.currentIorID = id_ior;
      console.log('Retrieved id_ior:', id_ior);
      this.fetchIOR();
    }
  }

  async fetchIOR() {
    try {
      const response = await axios.post('http://localhost:3000/showOccurence',
        { id_ior: this.currentIorID }
      );
      this.iorData = response.data.showProduct[0];
      this.iorData.occurDate = this.iorData.occurDate.slice(0, 10);
      this.iorData.reportDate = this.iorData.reportDate.slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching IOR');
      console.error('There was an error fetching IOR:', error);
    }
  }

  async updateIOR() {
    console.log("Sending data:", this.iorData);
    try {
      const response = await axios.put('http://localhost:3000/updateOccurence', this.iorData);
      if (response.data.status === 200) {
        this.toastService.successToast('IOR updated successfully');
        console.log('IOR updated successfully');
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
