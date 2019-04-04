import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { TestConfig } from './test-config';
import { TestService } from './test.service';
import { Question } from '../shared/question';
import { Router } from '@angular/router';
import { TagsService } from '../shared/tags.service';
import { TreeviewItem, TreeItem, TreeviewConfig } from 'ngx-treeview';
import { TreeNode } from '../shared/tag';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-test-setup',
  templateUrl: './test-setup.component.html',
  styleUrls: ['./test-setup.component.css']
})
export class TestSetupComponent implements OnInit {
  pageTitle: string = 'Take a Test';
  //todo: move these to separate config class??
  numberOfQuestions: number;
  isTimed: boolean;
  secondsPerQuestion: number = 15;
  selectedDomain: number;

  //temp
  questions: Question[];
  /* tags: TreeviewItem[] =  [
   new TreeviewItem({
    text: 'Teen', value: 2, collapsed: false, disabled: false, children: [
        { text: 'Adventure', value: 21 },
        { text: 'Science', value: 22 }
    ]
}) ]; */
tags: TreeviewItem[];

  constructor(private data: DataService, private test: TestService, private router: Router, private tagsvc: TagsService) { }

  ngOnInit() {
    this.data.currentDomain.subscribe(domain => this.selectedDomain = domain);
        
    console.log("in setup: selected domain is " + this.selectedDomain);

    //temp to call tags
     this.tagsvc.getAll(this.selectedDomain)
     .do((data) => console.log('Map to tree node fields (from caller): ' + JSON.stringify(data)))
    //  .map((response) => new TreeviewItem(response.tagDescription)
      .subscribe(tags => this.tags = tags);
    //  .map((response) => new TreeNode(response.tagDescription, response.tagId, response.children))
    //  .map((response) => this.tags = response)
     ;

    console.log("tags: "+ JSON.stringify(this.tags));
  }

  private _opened: boolean = false;
  
    // for tree-view 
    items: TreeviewItem[];
    values: number[];
    config = TreeviewConfig.create({
        hasAllCheckBox: true,
        hasFilter: true,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    private formTagList(selectedTags: any[])
    {
      if (selectedTags.length == 0) {
        return null;
      }
      var xmlList : string = '<tags>';
      for (var i=0; i < selectedTags.length; ++i) {
        xmlList += '<tag>' + selectedTags[i].toString() + '</tag>'
      }
      xmlList += '</tags>'
      return xmlList;
    }
    
     private _toggleSidebar() {
       this._opened = !this._opened;
       console.log('Toggle called. Value of opened flag is ' + this._opened);
     }

    onSelectedChange(event) {
      console.log("In onselectedchange!!");
      console.log(event);
      this.values = event;
      console.log("selected " + this.values.length + " with these values " + this.values);
    }

  startClicked(event) {
    console.log("start clicked!! number of questions="+this.numberOfQuestions.toString());
     if (this.isTimed) 
     { 
       console.log("timed with #seconds=" + this.secondsPerQuestion.toString()) 
      }
    else 
    {
      console.log("is not timed"); 
    } 

    //Instantiate an object to hold config values.
    let config = new TestConfig(); 
    config.numberOfQuestions = this.numberOfQuestions;
    config.IsTimed = this.isTimed;
    config.DomainID = this.selectedDomain;
    config.secondsPerQuestion = (this.isTimed == true) ? this.secondsPerQuestion : 0;
    config.tagList = this.formTagList(this.values); //null;

    console.log("XML for selected tags is " + config.tagList);

    //Save the config object to shared data service. It will be retrieved in
    //the test page after moving there.
    this.data.changeTestConfig(config);

   /*  this.test.getNewTest(config)
    .subscribe(questions => this.questions = questions); */

    //  .subscribe(domains => this.domains = domains);

    this.router.navigateByUrl('/tests/run');
  }

}
