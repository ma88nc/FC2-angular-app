import { Component, OnInit } from '@angular/core';
import { DomainService } from './domain.service';
import { Domain } from './domain';
import 'rxjs/add/operator/map';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: [DomainService]
})
export class WelcomeComponent implements OnInit {

  domains: Domain[]; 
  selectedDomainId: number;
  infoMessage : string;

  constructor(private domainService: DomainService, private data: DataService ) { }

  ngOnInit() {
  //  this.domains = this.domainService.getAll();
    this.domainService.getAll()
      .subscribe(domains => this.domains = domains);
    //  , error => this.errorMessage = <any>error);
      
  }

  loadDomain(domainId: number) {
    this.selectedDomainId = domainId;
    //Save domain in shared service.
    this.data.changeDomain(this.selectedDomainId);
    console.log('selected domain is ' + this.selectedDomainId.toString() )
  //  this.infoMessage = "You have selected " + (string)domainName;
  }

}
