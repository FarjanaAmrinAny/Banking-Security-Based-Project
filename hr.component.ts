import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">HR & Payroll</h1>
        <p class="page-subtitle">Manage your workforce</p>
      </div>
      <button class="btn btn-primary" (click)="openModal()">+ Add Employee</button>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="card stat-card">
        <div class="stat-label">Total Employees</div>
        <div class="stat-value" style="color:#2563eb">{{employees.length}}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Active</div>
        <div class="stat-value" style="color:#16a34a">{{activeCount}}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Monthly Payroll</div>
        <div class="stat-value" style="color:#d97706">\${{totalPayroll | number:'1.0-0'}}</div>
      </div>
    </div>

    <div class="card">
      <div class="table-toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input class="form-control" [(ngModel)]="search" placeholder="Search employees..." (ngModelChange)="loadEmployees()">
        </div>
        <select class="form-control" style="width:160px" [(ngModel)]="filterDept" (ngModelChange)="filterByDept()">
          <option value="">All Departments</option>
          <option *ngFor="let d of departments">{{d}}</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Job Title</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let emp of displayedEmployees">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="avatar">{{emp.firstName[0]}}{{emp.lastName[0]}}</div>
                <div>
                  <div style="font-weight:500">{{emp.firstName}} {{emp.lastName}}</div>
                  <div style="font-size:11px;color:#64748b">{{emp.email}}</div>
                </div>
              </div>
            </td>
            <td><span class="badge badge-info">{{emp.department}}</span></td>
            <td>{{emp.jobTitle}}</td>
            <td style="font-weight:500">\${{emp.salary | number:'1.0-0'}}</td>
            <td>
              <span class="badge" [class]="getStatusClass(emp.status)">{{emp.status}}</span>
            </td>
            <td>
              <button class="btn btn-outline btn-sm" (click)="editEmployee(emp)">Edit</button>
              <button class="btn btn-danger btn-sm" style="margin-left:6px" (click)="deleteEmployee(emp.id)">Delete</button>
            </td>
          </tr>
          <tr *ngIf="displayedEmployees.length === 0">
            <td colspan="6" style="text-align:center;color:#94a3b8;padding:32px">No employees found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{editingId ? 'Edit Employee' : 'Add New Employee'}}</h3>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input class="form-control" [(ngModel)]="form.firstName" placeholder="First name">
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input class="form-control" [(ngModel)]="form.lastName" placeholder="Last name">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-control" type="email" [(ngModel)]="form.email" placeholder="email@company.com">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Department</label>
              <input class="form-control" [(ngModel)]="form.department" placeholder="e.g. Engineering">
            </div>
            <div class="form-group">
              <label class="form-label">Job Title</label>
              <input class="form-control" [(ngModel)]="form.jobTitle" placeholder="e.g. Software Engineer">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Salary (USD)</label>
              <input class="form-control" type="number" [(ngModel)]="form.salary" placeholder="75000">
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-control" [(ngModel)]="form.status">
                <option>ACTIVE</option><option>ON_LEAVE</option><option>INACTIVE</option><option>TERMINATED</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveEmployee()">{{editingId ? 'Update' : 'Create'}} Employee</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-toolbar { display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border); }
    .avatar { width:34px;height:34px;border-radius:50%;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0; }
  `]
})
export class HrComponent implements OnInit {
  employees: any[] = [];
  displayedEmployees: any[] = [];
  departments: string[] = [];
  search = '';
  filterDept = '';
  showModal = signal(false);
  editingId: number | null = null;
  form: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.api.getEmployees(this.search).subscribe({ next: (r: any) => {
      this.employees = r.data || [];
      this.departments = [...new Set(this.employees.map((e: any) => e.department).filter(Boolean))];
      this.filterByDept();
    }});
  }

  filterByDept() {
    this.displayedEmployees = this.filterDept
      ? this.employees.filter((e: any) => e.department === this.filterDept)
      : [...this.employees];
  }

  get activeCount() { return this.employees.filter((e: any) => e.status === 'ACTIVE').length; }
  get totalPayroll() { return this.employees.reduce((s: number, e: any) => s + (e.salary || 0), 0); }

  getStatusClass(s: string) {
    return { 'ACTIVE': 'badge-success', 'INACTIVE': 'badge-gray', 'ON_LEAVE': 'badge-warning', 'TERMINATED': 'badge-danger' }[s] || 'badge-gray';
  }

  openModal() { this.form = { status: 'ACTIVE' }; this.editingId = null; this.showModal.set(true); }
  closeModal() { this.showModal.set(false); this.form = {}; this.editingId = null; }

  editEmployee(emp: any) { this.form = { ...emp }; this.editingId = emp.id; this.showModal.set(true); }

  saveEmployee() {
    const obs = this.editingId ? this.api.updateEmployee(this.editingId, this.form) : this.api.createEmployee(this.form);
    obs.subscribe({ next: () => { this.loadEmployees(); this.closeModal(); } });
  }

  deleteEmployee(id: number) {
    if (confirm('Delete this employee?')) this.api.deleteEmployee(id).subscribe(() => this.loadEmployees());
  }
}
