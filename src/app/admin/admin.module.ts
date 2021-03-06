import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionMaintenanceComponent } from './question-maintenance.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [QuestionMaintenanceComponent],
  imports: [
    CommonModule,
    FormsModule,
    TreeviewModule.forRoot(),
    AgGridModule.withComponents(null),
    RouterModule.forChild([
      { path: 'admin', component: QuestionMaintenanceComponent }
  ])
]
})
export class AdminModule { }
