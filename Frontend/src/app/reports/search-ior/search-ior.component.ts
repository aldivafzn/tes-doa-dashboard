import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

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
  document_id: string
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
  templateUrl: './search-ior.component.html',
  styleUrls: ['./search-ior.component.css']
})
export class SearchIORComponent implements OnInit {
  items: Occurence[] = [];
  searchData = { input: '' };
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

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  search() {
    console.log('Filter by:', this.filterBy);
    console.log('Search term:', this.searchTerm);
    this.fetchDataBySearchTerm();
  }

  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:4040/ior/show-all');
      if (response.data.status === 200) {
        this.items = response.data.result;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post('http://localhost:4040/ior/search', this.searchData);
      if (response.data.status === 200) {
        this.items = response.data.result;
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

  navigateEdit(id_ior: string) {
    localStorage.setItem('id_ior', id_ior);
    window.location.href = '/editIOR';
  }
}
