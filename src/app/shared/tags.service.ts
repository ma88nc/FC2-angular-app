import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Tag, TreeNode } from './tag';
import { TreeviewItem, TreeItem } from 'ngx-treeview';

@Injectable()
export class TagsService {
  ch: any;

  constructor(private _http: HttpClient) { }

  tagUrl : string = "http://localhost:57193/api/Tags?DomainId=";
  // http://localhost:57193/api/Tags?DomainId=1
  tagQuestionUrl : string = "http://localhost:57193/api/tags/Questions/";

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

  getTagsByQuestion(questionId: string) : Observable<Tag[]> {
    return this._http.get<Tag[]>(this.tagQuestionUrl+questionId)
    .do(data => console.log('Incoming Tags for ' + questionId + ' - ' + JSON.stringify(data)))
    .catch(this.handleError); 
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err.message);
  }


  private unflatten(arr: any[]) : any[] {
    var lookup = {};
    var rootNodes : any = [];
    var item : any;
    console.log("Input to unflatten " + JSON.stringify(arr));
  
    for (var i=0, len = arr.length; i < len; i++) {
  
      
      // Add us to lookup
    //  var ourNode : Node;
      var ourNode : TreeviewItem;
      item = arr[i];
      console.log("   **top of loop for "+ item['tagDescription']);
      if (lookup.hasOwnProperty(item['tagId']))
      {
        ourNode = lookup[item['tagId']];
      //  ourNode.Source = item;
        ourNode.text = item['tagDescription'];
        ourNode.value = item['tagId'];
        ourNode.checked = false;
      //  lookup[item['tagId']] = ourNode; // ???
      }
      else
      {
    //    ourNode = new Node();
    //    chld = new TreeviewItem({ text: child["tagDescription"], value: child["tagId"], checked: false});
        console.log("Before creating treeviewitem for "+ item['tagDescription'] + " and tagid " + item['tagId']);
        ourNode = new TreeviewItem({ text: item['tagDescription'], value: item['tagId'], checked: false });

        if (item['parentTagId'] == null)
        {
          ourNode['rootlevel'] = 1;
        }
     //   ourNode.children = [];
     //   ourNode.Source = item;
        console.log("PUSHING TO LOOKUP (LN 76): "+item['tagId'] + item['tagDescription']);
        lookup[item['tagId']] = ourNode;
      }
  
      console.log("Processing item "+ i.toString() + " "+ JSON.stringify(item));
      // Hook into parent
      console.log("     parentId="+item['parentTagId']);
      if (item['parentTagId'] == null) {
        // Is a root node
        console.log("Pushing to root: " + JSON.stringify(ourNode));
      //  rootNodes.push(ourNode);
        console.log("ROOTNODES: " + JSON.stringify(rootNodes));
      }
      else
      {
        // is a child row, so we have a parent
      //  var parentNode: Node;
        var parentNode: TreeviewItem;
        if (!lookup.hasOwnProperty(item['parentTagId']))
        {
          // Unknown parent, construct preliminary parent
       //   parentNode = new Node();
          console.log("Creating preliminary parent with ID "+ item['parentTagId']);
          parentNode = new TreeviewItem({ text: '', value: item['parentTagId'], checked: false });
     //     parentNode['rootlevel'] = 1;
        }
        else
        {
          console.log("Found parent with ID "+ item['parentTagId'])
          parentNode = lookup[item['parentTagId']];
        }
     //   console.log("Pushing child " + item.TagDescription + " to " + parentNode.Source.TagDescription || 'undefined');
        console.log("Pushing child " + item['tagDescription'] + ' to parentNode ' + JSON.stringify(parentNode));
        var chlist : TreeviewItem[];
        if (parentNode.children != null) {
          chlist = parentNode.children;
        }
        else {
          chlist = [];
        }
        console.log("******* adding child " + item['tagDescription'] + " to parent"  )
        chlist.push(new TreeviewItem({ text: item['tagDescription'], value: item['tagId'], checked: false }))
        parentNode.children = chlist;
     //   parentNode['rootlevel'] = 1;
        console.log("Children list length = " + parentNode.children.length);
        // Remove from lookup table.
        // lookup[item['tagId']] = null;
      //  parentNode.children.push(ourNode);
     // console.log('Paitem['tagId']rentNode children list ' + parentNode.children.length);
     //   ourNode.Parent = parentNode;
     if (!lookup.hasOwnProperty(item['parentTagId']))          
     {
      console.log("PUSHING PARENT TO LOOKUP (LN 125): "+item['parentTagId']);
      lookup[item['parentTagId']] = parentNode;
     }
      }
    }
    
    console.log("############LOOKUP TABLE:" + JSON.stringify(lookup));
    for (var key in lookup) {
      var tvi : TreeviewItem = lookup[key];
      if ((tvi != null) && (tvi["rootlevel"] == 1)) {
        console.log("    Processing " + tvi["text"]);
        // console.log("    " + tvi.children.length + " children found. Looping...");
        if (tvi.children != null) {
        for (var child of tvi.children) {
          var chld : TreeviewItem = lookup[child['value']];
          console.log("        looking up child: JSON " + JSON.stringify(child));
          if (chld != null) {
            console.log("        Parent " + tvi["text"] + "- child " + chld["text"] + " - JSON: "+ JSON.stringify(chld));
            if (chld.children != null) 
            {
              console.log("        Copying children!!");
              child.children = chld.children;
            }
        }
        }
      }
        rootNodes.push(tvi);
      }
    }
    console.log("Returning from flatten: " + JSON.stringify(rootNodes));
    return rootNodes;
  }


  private unflattenXXX(arr) : any[] {
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
