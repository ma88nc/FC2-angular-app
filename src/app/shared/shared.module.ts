import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';
import { TagsService } from './tags.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [DataService, TagsService]
})
export class SharedModule { }
