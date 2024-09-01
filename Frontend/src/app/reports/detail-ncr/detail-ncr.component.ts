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

enum probanalis {
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
  problem_analysis: string,
  answer_due_date: string,
  issue_ian: boolean | string,
  ian_no: string,
  encountered_condition: string,
  audit_by: string,
  audit_date: string,
  acknowledge_by: string,
  acknowledge_date: string,
  status: string,
  ncr_reply: any[],
  documentid: string
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
    problem_analysis: '',
    answer_due_date: '',
    issue_ian: '',
    ian_no: '',
    encountered_condition: '',
    audit_by: '',
    audit_date: '',
    acknowledge_by: '',
    acknowledge_date: '',
    status: '',
    ncr_reply: [],
    documentid: ''
  }
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
  role: string | null = null;
  currentNCRInitID = '';
  replyExist: boolean = false;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
      console.log('Retrieved role:', this.role);
    }

    const ncr_init_id = localStorage.getItem('ncr_init_id');
    if (ncr_init_id) {
      this.currentNCRInitID = ncr_init_id;
    }
    this.fetchNCR();
    this.fetchReplyNCR();
  }

  async fetchNCR() {
    try {
      const response = await axios.post('http://localhost:4040/ncr/show',
        { ncr_init_id: this.currentNCRInitID }
      );
      this.ncrData = response.data.showProduct[0];
      this.ncrData.responsibility_office = this.convertEnumValue(responoffice, this.ncrData.responsibility_office);
      this.ncrData.to_uic = this.convertEnumValue(uic, this.ncrData.to_uic);
      this.ncrData.level_finding = this.convertEnumValue(level, this.ncrData.level_finding);
      this.ncrData.problem_analysis = this.convertEnumValue(probanalis, this.ncrData.problem_analysis);
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
      const response = await axios.post('http://localhost:4040/ncr/reply/show', {
        ncr_init_id: this.currentNCRInitID
      });
      if (response.data.message === 'Showing NCR Reply') {
        this.replyExist = true;
        this.replyNCR = response.data.showProduct;
        this.replyNCR.identified_date = this.replyNCR.identified_date.slice(0, 10);
        this.replyNCR.auditor_accept_date = this.replyNCR.auditor_accept_date.slice(0, 10);
      } else {
        console.error('Error message:', response.data.message);
        this.replyExist = false;
      }
    } catch (error) {
      console.error('Error:', error);
      this.replyExist = false;
    }
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

  navigateEditNCR() {
    window.location.href = '/editNCR';
  }

  navigateAddReply() {
    window.location.href = '/addReplyNCR';
  }

  navigateEditReply() {
    window.location.href = '/editReplyNCR';
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}