import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../shared/data.service';
import { TestConfig } from './test-config';
import { TestService } from './test.service';
import { TestQuestion } from './TestQuestion';
import { Router } from '@angular/router';
import { Test } from './test';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-test-question',
  templateUrl: './test-question.component.html',
  styleUrls: ['./test-question.component.css']
})
export class TestQuestionComponent implements OnInit {

  constructor(private data: DataService, private testsvc: TestService, private router: Router) { }

 // private testConfig: TestConfig;
 // private questionList: TestQuestion[];
  private test: Test = new Test(); 
  secondsPerQuestion = 0;
  @ViewChild(CountdownComponent) counter: CountdownComponent;

  private pager = {
    index: 0,
    size: 1,
    count: 1
  };
  private index: number = 1;
  private theUserAnswer: string = "";
  action: string;
  private baseImageUrl: string = "https://s3.us-east-2.amazonaws.com/fc2-images/";

  ngOnInit() {
    //Get the config object from shared data service.
    this.data.currentTestConfig.subscribe(config => this.test.testConfig = config);
    this.secondsPerQuestion = this.test.testConfig.secondsPerQuestion;
    console.log("In TestQuestion component. Config: isTimed = " + this.test.testConfig.IsTimed);
    console.log("In TestQuestion component. Config: #secondsperQ = " + this.test.testConfig.secondsPerQuestion);
    console.log("In TestQuestion component. Config: #questions = " + this.test.testConfig.numberOfQuestions);

    this.test.testDate = Date.now();

    //Get test questions from test service, passing config object.
    this.testsvc.getNewTestQuestions(this.test.testConfig)
      .subscribe(questions => { this.test.Questions = questions; this.pager.count = questions.length; } );
     // .map(this.questionList.forEach((x) => { x.OrderInTest = this.index++;}));

      //It doesn't get here!!
 /*      console.log("questionList count: "+ this.test.Questions.length);

    for (var i=0; i < this.test.Questions.length; i++)
    {
      this.test.Questions[i].OrderInTest = i+1;
      console.log("add index "+ i+1);
    }       */
  }

  onEvent(event){    
    this.action = event.action;
    console.log(event);
    if (this.action == 'finished')
    {
      console.log("Timer popped");
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    console.log("In goTo: index=" + index + " and pager.Count=" + this.pager.count);    

    this.test.Questions[index-1].UserAnswer = this.theUserAnswer;
    this.theUserAnswer = "";
    // if (this.test.Questions[index-1].hasImage == true)
    // {  
    //   this.fullImagePath = this.baseImageUrl + this.test.Questions[index-1].imagePath;
    //   console.log("full image path is "+this.fullImagePath)
    // }

    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      setTimeout(() => this.counter.restart());
      console.log("In goTo: pager.index=" + this.pager.index);
      console.log("User answer is " + this.theUserAnswer); 
    }

    //If done with the test, navigate to the summary.
    if (index == this.pager.count)
    {
      this.testsvc.changeTest(this.test);
      this.router.navigateByUrl('/tests/summary');
    }
  }

  get filteredQuestions() {
    return (this.test.Questions) ?
      this.test.Questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

}
