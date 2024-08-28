import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../../auth.service';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

interface FollupIOR {
  id_follup: string,
  id_ior: string,
  follup_detail: string,
  follupby: string,
  follup_uic: string,
  follup_date: string,
  follup_datarefer: string,
  follup_status: string,
  nextuic_follup: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string,
  subject_ior: string
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
  selector: 'app-search-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-followup-ior.component.html',
  styleUrls: ['./search-followup-ior.component.css']
})
export class SearchFollowupIORComponent implements OnInit {
  constructor(private authService: AuthService) { }

  items: FollupIOR[] = [];
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

  role: string | null = null;

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  search() {
    //console.log('Filter by:', this.filterBy);
    console.log('Search term:', this.searchTerm);
    this.fetchDataBySearchTerm();
  }

  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:4040/ior/follow-up/show-all');
      if (response.data.status === 200) {
        this.items = response.data.result;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].follup_date = this.items[i].follup_date.slice(0, 10);
          this.items[i].subject_ior = await this.fetchIORSubject(this.items[i].id_ior);
        }

      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchIORSubject(id_ior: string) {
    try{
      const response = await axios.post('http://localhost:4040/ior/show', {
        id_IOR: id_ior
      });
      if (response.data.status === 200) {
        return response.data.result.id_ior;
      } else {
        console.error('Error Message:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
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

  async navigatePreview(documentId: string) {
    try {
      localStorage.setItem('document_id', documentId);
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
    localStorage.setItem('id_follup_ior', id_follup);
    window.location.href = '/editFollowupIOR';
  }
}
