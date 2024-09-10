import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { ToastService } from '../../toast.service';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

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

enum effectiveness {
  Effective = "Effective",
  Not_Effective = "Not Effective",
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

interface ReplyNCR {
  id_ncr_reply: string,
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

interface ResultNCR {
  id_ncr_result: string,
  ncr_init_id: string,
  close_corrective_actions: string,
  proposed_close_auditee: string,
  proposed_close_date: string,
  is_close: boolean | string,
  effectiveness: string,
  refer_verification: string,
  sheet_no: string,
  new_ncr_issue_nbr: string,
  close_approved_by: string,
  close_approved_date: string,
  verified_chief_im: string,
  verified_date: string,
  temporarylink: string
}

@Component({
  selector: 'app-detail-ncr',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './detail-ncr.component.html',
  styleUrls: ['./detail-ncr.component.css']
})

export class DetailNCRComponent implements OnInit{
  constructor(private toastService: ToastService, private authService: AuthService) { }

  ncrData: NCRInitial = {
    accountid: '',
    ncr_init_id: '',
    regulationbased: '',
    subject: '',
    audit_plan_no: '',
    ncr_no: '',
    issued_date: '',
    responsibility_office: '',
    audit_type: '',
    audit_scope: '',
    to_uic: '',
    attention: '',
    require_condition_reference: '',
    level_finding: '',
    pa_requirement: '',
    answer_due_date: '',
    issue_ian: '',
    ian_no: '',
    encountered_condition: '',
    audit_by: '',
    audit_date: '',
    acknowledge_by: '',
    acknowledge_date: '',
    status: '',
    document_id: ''
  };
  replyNCR: ReplyNCR[] = [];
  resultNCR: ResultNCR[] = [];
  role: string | null = null;
  currentNCRInitID = '';
  isInitialized: boolean = false;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
      console.log('Retrieved role:', this.role);
    }

    const ncr_init_id = sessionStorage.getItem('ncr_init_id');
    if (ncr_init_id) {
      this.currentNCRInitID = ncr_init_id;
    }
    this.fetchNCR();
    this.fetchReplyNCR();
    this.fetchResultNCR();
  }

  async fetchNCR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/show',
        { ncr_init_id: this.currentNCRInitID }
      );
      this.ncrData = response.data;
      this.ncrData.responsibility_office = this.convertEnumValue(responoffice, this.ncrData.responsibility_office);
      this.ncrData.to_uic = this.convertEnumValue(uic, this.ncrData.to_uic);
      this.ncrData.level_finding = this.convertEnumValue(level, this.ncrData.level_finding);
      this.ncrData.pa_requirement = this.convertEnumValue(pa_req, this.ncrData.pa_requirement);
      this.ncrData.issued_date = this.ncrData.issued_date.slice(0, 10);
      this.ncrData.answer_due_date = this.ncrData.answer_due_date.slice(0, 10);
      this.ncrData.audit_date = this.ncrData.audit_date.slice(0, 10);
      this.ncrData.acknowledge_date = this.ncrData.acknowledge_date.slice(0, 10);
      this.ncrData.issue_ian = this.ncrData.issue_ian ? "Yes" : "No";
    } catch (error) {
      this.toastService.failedToast('There was an error fetching NCR');
      console.error('There was an error fetching NCR:', error);
    }
  }

  async fetchReplyNCR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/reply/show', {
        ncr_init_id: this.currentNCRInitID
      });
      if (response.data.message === 'Showing NCR Reply') {
        this.replyNCR = response.data.showProduct;
        for (let i = 0; i < this.replyNCR.length; i++) {
          this.replyNCR[i].identified_date = this.replyNCR[i].identified_date.slice(0, 10);
          this.replyNCR[i].auditor_accept_date = this.replyNCR[i].auditor_accept_date.slice(0, 10);
        }
      } else {
        console.error('Error message:', response.data.message);
        this.replyNCR = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.replyNCR = [];
    }
  }

  async fetchResultNCR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/result/show', {
        ncr_init_id: this.currentNCRInitID
      });
      if (response.data.message === 'Showing NCR Follow Result') {
        this.resultNCR = response.data.result;
        for (let i = 0; i < this.resultNCR.length; i++) {
          this.resultNCR[i].effectiveness = this.convertEnumValue(effectiveness, this.resultNCR[i].effectiveness);
          this.resultNCR[i].proposed_close_date = this.resultNCR[i].proposed_close_date.slice(0, 10);
          this.resultNCR[i].close_approved_date = this.resultNCR[i].close_approved_date.slice(0, 10);
          this.resultNCR[i].verified_date = this.resultNCR[i].verified_date.slice(0, 10);
          this.resultNCR[i].is_close = this.resultNCR[i].is_close ? "Yes" : "No";
        }
      } else {
        console.error('Error message:', response.data.message);
        this.resultNCR = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.resultNCR = [];
    }
    this.isInitialized = true;
  }

  exportToExcel(element_id: string): void {
    const table = document.getElementById(element_id);
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    if (element_id === 'export-reply-table') {
      const fileName = `Reply_${this.ncrData.ncr_no}_${formattedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } else if (element_id === 'export-result-table') {
      const fileName = `Result_${this.ncrData.ncr_no}_${formattedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
    }
  }

  async navigatePreview() {
    const generatePDFToastElement = this.toastService.generatingToast('Generating PDF');
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/getPDF', 
        { ncr_init_id: this.currentNCRInitID }
      );
      if (response.data.status === 200) {
        this.toastService.successToast('PDF generated successfully! Redirecting...');
        const preview = window.open(response.data.result.data.document_id, '_blank');
        if (preview) {
          preview.focus();
        }
      } else {
        this.toastService.failedToast('There was an error while generating PDF');
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('Failed to generate PDF');
      console.error('Error:', error);
    }
    document.body.removeChild(generatePDFToastElement);
  }

  navigateEditNCR() {
    window.location.href = '/editNCR';
  }

  navigateAddReply() {
    window.location.href = '/addReplyNCR';
  }

  navigateEditReply(id_ncr_reply: string) {
    sessionStorage.setItem('id_ncr_reply', id_ncr_reply);
    window.location.href = '/editReplyNCR';
  }

  navigateAddResult() {
    window.location.href = '/addResultNCR';
  }

  navigateEditResult(id_ncr_result: string) {
    sessionStorage.setItem('id_ncr_result', id_ncr_result);
    window.location.href = '/editResultNCR';
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }

  closeDetails(element_id: string) {
    const element = document.getElementById(element_id);
    if (element) {
      element.removeAttribute('open');
    }
  }
}