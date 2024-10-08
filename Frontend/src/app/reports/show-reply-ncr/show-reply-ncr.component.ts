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

interface ReplyNCR {
  ncr_init_id: string,
  rca_problem: string,
  corrective_action: string,
  preventive_action: string,
  identified_by_auditee: string,
  identified_date: string,
  accept_by_auditor: string,
  auditor_accept_date: string,
  temporarylink: string,
  recommend_corrective_action: string
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
  templateUrl: './show-reply-ncr.component.html',
  styleUrls: ['./show-reply-ncr.component.css']
})
export class ShowReplyNCRComponent implements OnInit {
  constructor(private authService: AuthService) { }

  replyNCR: ReplyNCR = {
    ncr_init_id: '',
    rca_problem: '',
    corrective_action: '',
    preventive_action: '',
    identified_by_auditee: '',
    identified_date: '',
    accept_by_auditor: '',
    auditor_accept_date: '',
    temporarylink: '',
    recommend_corrective_action: ''
  };
  currentNCRInitId = '';
  
  ngOnInit() {
    const ncrInitId = sessionStorage.getItem('ncr_init_id');
    if (ncrInitId) {
      this.currentNCRInitId = ncrInitId;
    }
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.post('http://localhost:4040/ncr/reply/show', {
        ncr_init_id: this.currentNCRInitId
      });
      if (response.data.message === 'Showing NCR Reply') {
        this.replyNCR = response.data.showProduct;
        this.replyNCR.identified_date = this.replyNCR.identified_date.slice(0, 10);
        this.replyNCR.auditor_accept_date = this.replyNCR.auditor_accept_date.slice(0, 10);
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
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

  navigateEdit() {
    window.location.href = '/editReplyNCR';
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