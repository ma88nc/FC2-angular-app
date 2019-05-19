import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
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
import { ImagesService } from '../shared/images.service';

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
  //qtags: number[] = []; // [73,79,88];

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

    // For image upload
    acceptedMimeTypes = [
      'image/gif',
      'image/jpeg',
      'image/png'
    ];

    @ViewChild('fileInput') fileInput: ElementRef;
    fileDataUri : any;
    errorMsg = '';
    fileName:string = '';
    
  constructor(private data: DataService, private titlesvc: TitlesService, private tagsvc: TagsService, 
    private questionsvc: QuestionsService, private modalService: BsModalService, private imgsvc: ImagesService) { }

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
    },
    err => {},
    () => {
      this.titlesvc.getTitles(this.selectedDomain)
      .subscribe(titles => this.titles = titles);
    }
)
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
      },
      err => {
        console.log("Got an error back from POST question.");
      },
      () => {
        if (this.question.hasImage && !this.skipUpload) {
          this.uploadFile();
        }
        this.clearEntries();
        this.questionsvc.getQuestions(this.selectedDomain)
        .subscribe(questions => this.rowData = questions);  
      }
    );
    }
    else
    {
      this.questionsvc.putQuestion(this.selectedDomain, this.question)
      .subscribe((data: any) => {
          // Nothing returned by PUT
       //   this.clearEntries();
    },
    err => {
      console.log("Got an error back from PUT question.");
    },
    () => {
      if (this.question.hasImage && !this.skipUpload) {
        this.uploadFile();
      }
      this.clearEntries();
      this.questionsvc.getQuestions(this.selectedDomain)
      .subscribe(questions => this.rowData = questions);  
    }
  );
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

    // Call service to get tags already set for this question
    //this.values = [73,79,88];
    this.tagsvc.getTagsByQuestion(this.question.questionId)
    .subscribe(
      res => {
        // handle success
        // let result = objArray.map(a => a.foo);
        console.log("Response from tag/question before mapping is " + JSON.stringify(res)); 
        this.values = res.map(a => a['tagId']) ;
        console.log("Tags after mapping are " + JSON.stringify(this.values));       
      },
      err => {
        this.errorMsg = 'Error retrieving tags for question.';
      },
      () => { 
        this.setTreeViewFromList(this.values, this.tags);
      }
    );
    
  }

  clearEntries() {
    this.question = new Question();
    this.question.domainId = this.selectedDomain;
    this.setTreeViewFromList([], this.tags);
  }

  // For image upload
  previewFile() {
    const file = this.fileInput.nativeElement.files[0];
    if (file && this.validateFile(file)) {

      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {
        this.fileDataUri = reader.result;
        console.log("Full file name is " + this.fileInput.nativeElement.value);
       // this.fileName = this.fileInput.nativeElement.value;
        this.fileName = this.fileInput.nativeElement.value.split('\\').pop().split('/').pop();
        console.log("Short file name is " + this.fileName);
      }
    } else {
      this.errorMsg = 'File must be jpg, png, or gif and cannot be exceed 500 KB in size'
    }
  }

  validateFile(file) {
    return this.acceptedMimeTypes.includes(file.type) && file.size < 500000;
  }

  uploadFile() {
  //  event.preventDefault();

    // get only the base64 file and post it
    if (this.fileDataUri.length > 0) {
      const base64File = this.fileDataUri.split(',')[1];
      // const data = {'image': base64File, 'fullFileName' : `science/`+this.fileName};
      // console.log(`${environment.apiUrl}/upload-image`)
     // this.http.post(`${environment.apiUrl}/upload-image`, data)
     console.log("In uploadFile() saving " + this.question.imagePath);
      
      this.imgsvc.addImage(this.question.imagePath, base64File)
        .subscribe(
          res => {
            // handle success
            // reset file input
            this.fileInput.nativeElement.value = '';
          },
          err => {
            this.errorMsg = 'Could not upload image.';
          }
        );
    }

  }

  newChanged(evt) {
    var target = evt.target;
    if (target.checked) {
     // this.question = new Question();
      this.clearEntries();
    //  this.setTreeViewFromList([], this.tags);
    }
  }

  updateChanged(evt) {
    var target = evt.target;
    if (target.checked) {

    }
  }  

private setTreeViewFromList(qtags: any[], tv: TreeviewItem[])  {
//  console.log("Calling setTreeViewFromList");
  for (var i=0; i < tv.length; i++ ) {
    var tvi : TreeviewItem = tv[i];
//    console.log("Value is "+ tvi2.value)
    if (qtags.some(t => t === tvi.value)) {
      console.log("Setting " + tvi.value);
        tvi.checked = true;
        }
    else {
      tvi.checked = false;
    }        
    if (tvi.children != null) {
      this.setTreeViewFromList(qtags, tvi.children);
    }
  }
}

}
