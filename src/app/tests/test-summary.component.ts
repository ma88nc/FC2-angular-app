import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';
import { Test } from './test';
import { TestQuestion } from './TestQuestion';

@Component({
  selector: 'app-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.css']
})
export class TestSummaryComponent implements OnInit {
  selectedoption: TestQuestion = null;
  numberCorrect: number;
  numberIncorrect: number;
  numberUnmarked: number;

  constructor(private testsvc : TestService) { }

  ngOnInit() {
    this.testsvc.currentTest.subscribe(test => this.test = test);

    //Would like to do this earlier (in testquestion component)
    for (var i=0; i < this.test.Questions.length; i++)
    {
      this.test.Questions[i].OrderInTest = i+1;
      console.log("In testsummary: add index "+ i+1);
      if (this.test.Questions[i].UserAnswer.toLowerCase() == this.test.Questions[i].answer.toLowerCase())
      {
        this.test.Questions[i].IsCorrect = true;
      }
      else
      {
        this.test.Questions[i].IsCorrect = null;
      }
    }    
    // Show the number of questions correct and unanswered. 
    this.numberCorrect = this.test.Questions.filter(q => q.IsCorrect == true).length;  
    this.numberIncorrect = this.test.Questions.filter(q => q.IsCorrect == false).length; //expect this to be zero since none automatically marked wrong
    this.numberUnmarked = this.test.Questions.filter(q => q.IsCorrect == null).length;
  }

  private test: Test;

  getValue(choice: number, questionnum: number)
  {
    this.selectedoption = this.test.Questions.filter((item) => item.OrderInTest == questionnum)[0];
    
    console.log("In testsummary: choice is " + choice + " questionnumber = " + questionnum + " selectedoption is " + this.selectedoption.OrderInTest);
    // this.test.Questions[questionnum-1].IsCorrect 
    switch (choice)
    {
      case 1:
        this.test.Questions[questionnum-1].IsCorrect = true;
        break;
      case -1:
        this.test.Questions[questionnum-1].IsCorrect = false;
        break;
      case 0: 
        this.test.Questions[questionnum-1].IsCorrect = null;
        break;                     
    }

    // Calculate the number of questions correct, incorrect and unmarked.
    this.numberCorrect = this.test.Questions.filter(q => q.IsCorrect == true).length;
    this.numberIncorrect = this.test.Questions.filter(q => q.IsCorrect == false).length;
    this.numberUnmarked = this.test.Questions.filter(q => q.IsCorrect == null).length;
  }

}
