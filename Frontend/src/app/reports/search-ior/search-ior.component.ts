import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

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
  occur_date: string,
  reference_ior: string,
  to_uic: string,
  cc_uic: string,
  category_occur: string,
  type_or_pnbr: string,
  level_type: string,
  detail_occurance: string,
  reportedby: string,
  reporter_uic: string,
  report_date: string,
  reporter_identity: string,
  data_reference: string,
  hirac_process: string,
  initial_probability: string,
  initial_severity: string,
  initial_riskindex: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string
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
  constructor(private authService: AuthService) { }

  items: Occurence[] = [];
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
    console.log('Filter by:', this.filterBy);
    console.log('Search term:', this.searchTerm);
    this.fetchDataBySearchTerm();
  }

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
      console.log('Retrieved role:', this.role);
    }
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:4040/ior/show-all');
      if (response.data.status === 200) {
        this.items = response.data.result;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].occur_date = this.items[i].occur_date.slice(0, 10);
          this.items[i].report_date = this.items[i].report_date.slice(0, 10);
        }
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
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

  navigateEdit(id_ior: string) {
    localStorage.setItem('id_ior', id_ior);
    window.location.href = '/editIOR';
  }
}