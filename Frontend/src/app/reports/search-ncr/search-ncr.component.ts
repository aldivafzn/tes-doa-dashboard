import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

interface NCRInitial {
  ncr_init_id: string,
  regulationbased: string,
  subject: string,
  audit_plan_no: string,
  ncr_no: string,
  issued_date: string,
  responsibility_office: string,
  audit_type: string,
  to_uic: string,
  require_condition_reference: string,
  level_finding: string,
  problem_analysis: string,
  answer_due_date: string,
  issue_ian: string,
  ian_no: string,
  encountered_condition: string,
  audit_by: string,
  audit_date: string,
  acknowledge_by: string,
  acknowledge_date: string,
  status: string,
  documentid: string
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
  
  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:3000/showNCRInit');
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post('http://localhost:3000/searchNCR', {
        input: this.searchTerm,
        filterBy: this.filterBy // Include filter criteria in the request
      });
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
        for (let i = 0; this.items.length; i++) {
          this.items[i].issued_date = this.items[i].issued_date.slice(0, 10);
          this.items[i].answer_due_date = this.items[i].answer_due_date.slice(0, 10);
          this.items[i].audit_date = this.items[i].audit_date.slice(0, 10);
          this.items[i].acknowledge_date = this.items[i].acknowledge_date.slice(0, 10);
        }
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
    const fileName = `NCR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  async navigatePreview(documentId: string) {
    try {
      sessionStorage.setItem('document_id', documentId);
      console.log(documentId);
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
}
