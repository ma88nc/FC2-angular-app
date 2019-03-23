import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestSetupComponent } from './test-setup.component';
import { RouterModule } from '@angular/router';
import { TestQuestionComponent } from './test-question.component';
import { TestService } from './test.service';
import { TestSummaryComponent } from './test-summary.component';
import { SidebarModule } from 'ng-sidebar';
import { TreeviewModule } from 'ngx-treeview';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule.forRoot(),
    TreeviewModule.forRoot(),
    RouterModule.forChild([
      { path: 'tests', component: TestSetupComponent }, //todo: send back to welcome
      { path: 'tests/run', component: TestQuestionComponent },
      { path: 'tests/summary', component: TestSummaryComponent },
      { path: 'tests/:id', 
     //   canActivate: [ TestGuardService ],
        component: TestSetupComponent }
  ]),
  ],
  declarations: [TestSetupComponent, TestQuestionComponent, TestSummaryComponent],
  providers: [TestService]
})
export class TestModule { }
