import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TreeviewItem, TreeItem, TreeviewConfig } from 'ngx-treeview';
import { Question } from '../shared/question';
import { Title } from '../shared/title';
import { TitlesService } from '../shared/titles.service';
import { DataService } from '../shared/data.service';
import { TagsService } from '../shared/tags.service';
import { Tag } from '../shared/tag';
import { QuestionsService } from '../shared/questions.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'app-question-maintenance',
  templateUrl: './question-maintenance.component.html',
  styleUrls: ['./question-maintenance.component.css']
})
export class QuestionMaintenanceComponent implements OnInit {
  newQid: any;
  tags: TreeviewItem[];
  isUpdate: boolean;
  question : Question;
  titles: Title[];
  selectedDomain: number;
  hasImage: boolean;
  skipUpload: boolean;
  newTitle: Title;

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

    // Data for ag-grid
    private paginationPageSize;
    @ViewChild('agGrid') agGrid: AgGridNg2;
    columnDefs = [
      {headerName: 'Question ID', field: 'questionId', sortable: false, filter: true, checkboxSelection: true},
      {headerName: 'Title', field: 'titleDescription', sortable: true, filter: true},
      {headerName: 'Question Text', field: 'questionText', sortable: true, filter: true},
      {headerName: 'Answer', field: 'answer', sortable: true, filter: true}
    ];
    rowData: any[];

    public modalRef: BsModalRef;
    
  constructor(private data: DataService, private titlesvc: TitlesService, private tagsvc: TagsService, 
    private questionsvc: QuestionsService, private modalService: BsModalService) { }

  ngOnInit() {
    this.data.currentDomain.subscribe(domain => this.selectedDomain = domain);  
    console.log("in setup: selected domain is " + this.selectedDomain);

    this.paginationPageSize = 10;
    this.isUpdate = false;

    //temp to call tags
    this.tagsvc.getAll(this.selectedDomain)
    .do((data) => console.log('Map to tree node fields (from caller): ' + JSON.stringify(data)))
    //  .map((response) => new TreeviewItem(response.tagDescription)
      .subscribe(tags => this.tags = tags);
    //  .map((response) => new TreeNode(response.tagDescription, response.tagId, response.children))
    //  .map((response) => this.tags = response)
    ;
   
       console.log("tags: "+ JSON.stringify(this.tags));

    this.titlesvc.getTitles(this.selectedDomain)
      .subscribe(titles => this.titles = titles);

    this.questionsvc.getQuestions(this.selectedDomain)
      .subscribe(questions => this.rowData = questions);  

    this.question = new Question();
    this.question.domainId = this.selectedDomain;
  }

  setTitle(titleId : number) {
    console.log("Selected title: " + titleId);
    this.question.titleId = titleId;
  }

  saveTitle(event) {
    console.log("saveTitle clicked!! title desc = "+ this.newTitle.description);
    this.titlesvc.addTitle(this.selectedDomain, this.newTitle)
    .subscribe((data: any) => {
      this.question.titleId = data['titleId'];
      console.log("New titleId is " + this.question.titleId);  
    })
  }

  saveClicked(event)
  {
    this.question.questionTags = this.formTagList(this.values);
    console.log("Selected tags are: " + JSON.stringify(this.question.questionTags));
    console.log("Question object: "+ JSON.stringify(this.question));
    console.log("SAVE clicked!!");

    if (!this.isUpdate)
    {
      this.questionsvc.postQuestion(this.selectedDomain, this.question)
        .subscribe((data: any) => {
          this.newQid = data['questionId'];
          console.log("New question Id is " + this.newQid);
          this.clearEntries();
      });
    }
    else
    {
      this.questionsvc.putQuestion(this.selectedDomain, this.question)
      .subscribe((data: any) => {
          // Nothing returned by PUT
          this.clearEntries();
    });
    }
  }

  onTVSelectedChange(event) {
    console.log("In onTVselectedchange!!");
    console.log(event);
    this.values = event;
    console.log("selected " + this.values.length + " with these values " + this.values);
  }

  public openModal(template: TemplateRef<any>) {
    // Instantiate a new Title object and set the domainId.
    this.newTitle = new Title();
    this.newTitle.domainId = this.selectedDomain;
    this.modalRef = this.modalService.show(template); 
  }

  private formTagList(selectedTags: any[]) : Tag[]
  {
    if (selectedTags.length == 0) {
      return null;
    }
    //var tags : Tag[];
    var tags : Tag[] = [];
    for (var i=0; i < selectedTags.length; ++i) {
      var t = new Tag();
      t.TagId = selectedTags[i];
      tags.push(t);
    }
    return tags;
    
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map( node => node.data )
      .map(node => this.question = node);
  }

  clearEntries() {
    this.question = new Question();
    this.question.domainId = this.selectedDomain;
  }

}
