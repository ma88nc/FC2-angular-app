import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestConfig } from '../tests/test-config';

@Injectable()
export class DataService {
  constructor() { }  

  /* --------------------Domain source----------------- */
  private domainSource = new BehaviorSubject<number>(0);
  currentDomain = this.domainSource.asObservable();

  changeDomain(domain: number)
  {
    this.domainSource.next(domain);
  }

   /* --------------------Test config----------------- */
   private testConfig = new BehaviorSubject<TestConfig>(null);
   currentTestConfig = this.testConfig.asObservable();

  changeTestConfig(testConfig: TestConfig)
  {
    this.testConfig.next(testConfig);
  }
}
