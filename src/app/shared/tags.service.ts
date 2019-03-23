import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Tag, TreeNode } from './tag';
import { TreeviewItem, TreeItem } from 'ngx-treeview';

@Injectable()
export class TagsService {
  ch: any;

  constructor(private _http: HttpClient) { }

  tagUrl : string = "http://localhost:57193/api/Tags?DomainId="
  // http://localhost:57193/api/Tags?DomainId=1

  tags : any[];

  //not used
  getAllHierarchical(domainId: number) : any[] {
   
    this.getAll(domainId)
      .subscribe(tags => this.tags = tags);

      console.log('After getAll, before unflatten: ' + JSON.stringify(this.tags));
    return this.unflatten(this.tags);
   
  }

  getAll(domainId : number) : Observable<any[]> {
    return this._http.get<any[]>(this.tagUrl + domainId.toString())    
      .do(data => console.log('Incoming Tags: ' + JSON.stringify(data)))
      .do(data => this.tags = this.unflatten(data))
    //  .map((response) => new TreeNode(response.tagDescription, response.tagId, response.children))
        .map((response) => response = this.tags)
      .do((data) => console.log('Map to tree node fields: ' + JSON.stringify(this.tags)))
    .catch(this.handleError); 
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }

  private unflatten(arr) : any[] {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem,
        ch : any,
        chList : any[],
        chld : TreeviewItem,
        tvi: TreeviewItem;

        console.log('Entry to unflatten array length: ' + arr.length);
        console.log('Entry to unflatten array: ' + JSON.stringify(arr));

    // First map the nodes of the array to an object -> create a hash table.
    for(var i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.tagId] = arrElem;
    //  console.log('mapping in mappedArr: index='+i + ', tag is ' + arrElem.tagId + ', JSON of arrElem is ' + JSON.stringify(arrElem));
      mappedArr[arrElem.tagId]['children'] = [];
    }

  //  console.log('after mappedArr set: 7th is ' + mappedArr[7].tagDescription + ', 3rd is ' + mappedArr[3].tagDescription);
   // console.log('Unflatten: mappedArr length ' + mappedArr.toString() );

    for (var id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
     //   tvi = new TreeviewItem({ text : mappedElem.tagDescription, value : mappedElem.tagId});

        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parentTagId) {
          mappedArr[mappedElem['parentTagId']]['children'].push(mappedElem);
          console.log('   *Not at root - '+ JSON.stringify(mappedArr[id]) + ', parent is ' + mappedElem.parentTagId);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
      //    tree.push(tvi);
          console.log('*At root level - ' + JSON.stringify(mappedArr[id]));
        }
      }
    }
    //console.log("**** mapped array for religion: " + JSON.stringify(mappedArr[3]));
    //console.log("**** mapped array for literature: " + JSON.stringify(mappedArr[4]));

    for (var id in mappedArr)
    {
      if (mappedArr.hasOwnProperty(id)) {
        console.log("Processing this id "+ id);
        mappedElem = mappedArr[id];
        if (!mappedElem.parentTagId) {    
    //      tvi = new TreeviewItem({ text : mappedElem.tagDescription, value : mappedElem.tagId, checked: false, children : []});
     //     console.log(JSON.stringify(tvi));
         // chList = JSON.parse(mappedElem);
         console.log("****children list is: " + JSON.stringify(mappedElem.children));
         //ch = JSON.stringify(mappedElem.children);
     //    chList = JSON.parse(mappedElem.children);
          console.log("**** children length is " + mappedElem.children.length)
       //   for (var child in mappedElem.children)
       chList = new Array<any>();
          for (i=0; i < mappedElem.children.length; i++)
          {
            var child = mappedElem.children[i];
            console.log("*******Child of " + mappedElem.tagDescription + " is " + JSON.stringify(child));
            console.log("****tagid = "+ child["tagId"]+ ", tagdesc = "+ child["tagDescription"]);
           // this.ch = JSON.parse(child);
         //   tvi.children[0] =  new TreeviewItem({ text: child.tagDescription, value: ch.tagId })
 
        //  chld = new TreeviewItem({ text: ch.tagDescription, value: ch.tagId })
        chld = new TreeviewItem({ text: child["tagDescription"], value: child["tagId"], checked: false});
          console.log(JSON.stringify(chld));
      //    chList[0] = chld;
      
            chList[i] = chld;
      //    tvi.children = new Array<TreeviewItem>();
      //    tvi.children[0] = chld;
       //   tvi.children.push(chld);
          }
          tvi = new TreeviewItem({ text : mappedElem.tagDescription, value : mappedElem.tagId, checked: false, children : chList});
        //  tvi.children = chList;
        tree.push(tvi);
        } 
      }  
      else {
        console.log("Ignored this id "+ id);
      }       
    }
    console.log('Unflatten: tree length ' + tree.length );
    console.log('Unflatten: ' + JSON.stringify(tree));
    return tree;
  }

}