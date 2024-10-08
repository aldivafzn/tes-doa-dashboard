import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../../auth.service';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

enum responoffice {
  AO__Airworthiness_Office = "AO: Airworthiness Office",
  DO__Design_Office = "DO: Design Office",
  IM__Independent_Monitoring = "IM: Independent Monitoring",
  PR__Partner = "PR: Partner",
  SC__Subcontractor = "SC: Subcontractor",
  BR__BRIN = "BR: BRIN",
  GF__GMF_AeroAsia = "GF: GMF AeroAsia",
  BA__BIFA_Flying_School = "BA: BIFA Flying School",
  EL__Elang_Lintas_Indonesia = "EL: Elang Lintas Indonesiaa"
}

enum uic {
  Chief_Design_Office = "Chief Design Office",
  Chief_Airworthiness_Office = "Chief Airworthiness Office",
  Chief_Independent_Monitoring = "Chief Independent Monitoring",
  Head_of_DOA = "Head of DOA"
}

enum level {
  ONE = "1",
  TWO = "2",
  THREE = "3"
}

enum pa_req {
  Required = "Required",
  Not_Required = "Not Required"
}

interface NCRInitial {
  accountid: string,
  ncr_init_id: string,
  regulationbased: string,
  subject: string,
  audit_plan_no: string,
  ncr_no: string,
  issued_date: string,
  responsibility_office: string,
  audit_type: string,
  audit_scope: string,
  to_uic: string,
  attention: string,
  require_condition_reference: string,
  level_finding: string,
  pa_requirement: string,
  answer_due_date: string,
  issue_ian: boolean | string,
  ian_no: string,
  encountered_condition: string,
  audit_by: string,
  audit_date: string,
  acknowledge_by: string,
  acknowledge_date: string,
  status: string,
  document_id: string
}

interface Filters {
  regulationBased: string,
  responsibilityOffice: string,
  auditType: string,
  auditScope: string,
  toUIC: string,
  levelFinding: string,
  problemAnalysis: string,
  issueIAN: string,
  status: string
}

@Component({
  selector: 'app-search-ncr',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-ncr.component.html',
  styleUrls: ['./search-ncr.component.css']
})
export class SearchNCRComponent implements OnInit {
  constructor(private authService: AuthService) { }

  items: NCRInitial[] = [];
  searchTerm = '';
  filterBy: Filters = { 
    regulationBased : '',
    responsibilityOffice : '',
    auditType : '',
    auditScope : '',
    toUIC : '',
    levelFinding : '',
    problemAnalysis : '',
    issueIAN : '',
    status : ''
  }; // Filter terms
  showFilters: boolean = false; // Toggle for filter visibility
  replyExist: boolean = false;

  isInitialized: boolean = false;
  
  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:4040/ncr/show-all');
      if (response.data.status === 200) {
        this.items = response.data.ncrs;
        for (let i = 0; this.items.length; i++) {
          this.items[i].responsibility_office = this.convertEnumValue(responoffice, this.items[i].responsibility_office);
          this.items[i].to_uic = this.convertEnumValue(uic, this.items[i].to_uic);
          this.items[i].level_finding = this.convertEnumValue(level, this.items[i].level_finding);
          this.items[i].pa_requirement = this.convertEnumValue(pa_req, this.items[i].pa_requirement);
          this.items[i].issued_date = this.items[i].issued_date.slice(0, 10);
          this.items[i].answer_due_date = this.items[i].answer_due_date.slice(0, 10);
          this.items[i].audit_date = this.items[i].audit_date.slice(0, 10);
          this.items[i].acknowledge_date = this.items[i].acknowledge_date.slice(0, 10);
          this.items[i].issue_ian = this.items[i].issue_ian ? "Yes" : "No";
        }
        this.isInitialized = true;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    this.isInitialized = true;
  }

  async fetchDataBySearchTerm() {
    this.isInitialized = false;
    try {
      const response = await axios.post('http://localhost:4040/ncr/search', {
        input: this.searchTerm
        //filterBy: this.filterBy // Include filter criteria in the request
      });
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
        for (let i = 0; this.items.length; i++) {
          this.items[i].responsibility_office = this.convertEnumValue(responoffice, this.items[i].responsibility_office);
          this.items[i].to_uic = this.convertEnumValue(uic, this.items[i].to_uic);
          this.items[i].level_finding = this.convertEnumValue(level, this.items[i].level_finding);
          this.items[i].pa_requirement = this.convertEnumValue(pa_req, this.items[i].pa_requirement);
          this.items[i].issued_date = this.items[i].issued_date.slice(0, 10);
          this.items[i].answer_due_date = this.items[i].answer_due_date.slice(0, 10);
          this.items[i].audit_date = this.items[i].audit_date.slice(0, 10);
          this.items[i].acknowledge_date = this.items[i].acknowledge_date.slice(0, 10);
          this.items[i].issue_ian = this.items[i].issue_ian ? "Yes" : "No";
        }
      } else {
        console.error('Error Message:', response.data.message);
        this.items = [];
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error:', error);
      this.items = [];
      window.location.href = '/login';
    }
    this.isInitialized = true;
  }

  exportToExcel(): void {
    const table = document.getElementById('export-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const fileName = `NCR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  async navigatePreview(documentId: string) {
    try {
      const response = await axios.post('http://localhost:3000/getPDFDrive', { documentId });
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

  navigateEdit(ncr_init_id: string) {
    sessionStorage.setItem('ncr_init_id', ncr_init_id);
    window.location.href = '/editNCR';
  }

  navigateDetail(ncr_init_id: string) {
    sessionStorage.setItem('ncr_init_id', ncr_init_id);
  }

  search() {
    this.fetchDataBySearchTerm();
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }

  // Add this method to handle view details functionality
  viewDetails(documentId: string) {
    sessionStorage.setItem('document_id', documentId);
    window.location.href = 'details-NCR.html'; // Change this to the actual path where details are displayed
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}
