import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

enum uic {
  Chief_Design_Office = "Chief Design Office",
  Chief_Airworthiness_Office = "Chief Airworthiness Office",
  Chief_Independent_Monitoring = "Chief Independent Monitoring",
  Head_of_DOA = "Head of DOA"
}

interface FollowonIOR {
  id_follup: string,
  id_ior: string,
  follup_detail: string,
  follupby: string,
  follup_uic: string,
  follup_date: string,
  follup_datarefer: boolean | string,
  follup_status: string,
  nextuic_follup: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string
}

interface Filters {
  category_ior: string,
  type_or_phone_number: string,
  level_type: string,
  report_identify: string,
  data_reference: string,
  hirac_process: string,
  initial_probability: string,
  initial_severity: string,
  initial_riskindex: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string
}

@Component({
  selector: 'app-search-followon-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-followon-ior.component.html',
  styleUrls: ['./search-followon-ior.component.css']
})
export class SearchFollowonIORComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }

  items: FollowonIOR[] = [];
  searchTerm: string = '';
  filterBy: Filters = { 
    category_ior : '',
    type_or_phone_number : '',
    level_type : '',
    report_identify : '',
    data_reference : '',
    hirac_process : '',
    initial_probability : '',
    initial_severity : '',
    initial_riskindex : '',
    current_probability: '',
    current_severity: '',
    current_riskindex: ''
  }; // Filter terms
  showFilters: boolean = false;

  currentIORId = '';

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  search() {
    //console.log('Filter by:', this.filterBy);
    console.log('Search term:', this.searchTerm);
    this.fetchDataBySearchTerm();
  }

  ngOnInit() {
    const id_ior = sessionStorage.getItem('id_ior');
    if (id_ior) {
      this.currentIORId = id_ior;
      console.log('Retrieved id_ior:', id_ior);
    } else {
      this.toastService.failedToast("There was an error fetching IOR Follow On");
      window.location.href = '/searchIOR';
    }
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:4040/ior/follow-up/show-all');
      if (response.data.status === 200) {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id_ior === this.currentIORId) {
            this.items.push(response.data.result[i]);
          }
        }
        // this.items = response.data.result;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].follup_uic = this.convertEnumValue(uic, this.items[i].follup_uic);
          this.items[i].nextuic_follup = this.convertEnumValue(uic, this.items[i].nextuic_follup);
          this.items[i].follup_date = this.items[i].follup_date.slice(0, 10);
          this.items[i].follup_datarefer = this.items[i].follup_datarefer ? "Yes" : "No";
        }
      } else {
        console.error('Error Message:', response.data.message);
        this.toastService.failedToast("Failed to fetch IOR Follow On");
      }
    } catch (error) {
      console.error('Error:', error);
      this.toastService.failedToast("There was an error fetching IOR Follow On");
      window.location.href = '/searchIOR';
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post('http://localhost:4040/ior/search', { input: this.searchTerm });
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
      } else {
        console.error('Error Message:', response.data.message);
        this.items = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.items = [];
    }
  }

  exportToExcel(): void {
    const table = document.getElementById('data-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const fileName = `IOR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  async navigateAdd() {
    window.location.href = '/addFollowonIOR';
  }

  async navigatePreview(documentId: string) {
    try {
      sessionStorage.setItem('document_id', documentId);
      console.log(documentId);
      const response = await axios.post('http://localhost:4040/getPDFDrive', {documentId});
      console.log(response.data.message);
      if (response.data.status === 200) {
        window.location.href = response.data.message;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  navigateEdit(id_follup: string) {
    sessionStorage.setItem('id_follup_ior', id_follup);
    window.location.href = '/editFollowonIOR';
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}
