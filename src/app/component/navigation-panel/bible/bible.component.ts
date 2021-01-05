import { templateJitUrl, ThrowStmt } from '@angular/compiler';
import {
  Component, EventEmitter, OnInit, Output
} from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-bible',
  templateUrl: './bible.component.html',
  styleUrls: ['./bible.component.css']
})
export class BibleComponent implements OnInit {
  book: any;
  chapter: any;
  version = "ESV";
  isbible = true;
  strongs = false;
  strongsList = [];
  versesList = [];
  sts = new Array();
  selectedVerse: string = "";
  selectedVerseMessage: string = "";
  collapse: boolean = false;
  @Output() isbiblecom = new EventEmitter();
  form: any = {};
  newTestament: boolean = false;
  oldTestament: boolean = false;
  public show: boolean = false;
  public buttonName: any = 'Show';
  isShowDiv = true;
  public show1: boolean = false;
  public buttonName1: any = 'Show';
  isShowDiv1 = true;
  public show2: boolean = false;
  public buttonName2: any = 'Show';
  isShowDiv2 = true;
  searchQuery = "";
  searchResults: any;
  preResult: any;
  optResults = new Array();

  BibleVerses:any

  constructor(private apiService: AuthService) {
  }

  ngOnInit() { }

  togglecloseb() {
    this.isbiblecom.emit(false);
  }
  toggleTestament(tab: number) {
    console.log(tab);
    if (tab === 1) {
      this.oldTestament = !this.oldTestament;
      this.newTestament = false;
    }

    if (tab === 2) {
      this.newTestament = !this.newTestament;
      this.oldTestament = false;
    }
  }
  toggleDisplayDiv1(bookNAme: any) {
    this.book = bookNAme;
    this.isShowDiv1 = !this.isShowDiv1;
  }
  toggleDisplayDiv2() {

    this.isShowDiv2 = !this.isShowDiv2;
  }
  value: any;
  search() {
    // this.form.schedule_date = this.bible;
    console.log(this.searchQuery + " " + this.version);
    this.apiService.fetchBibleData(this.searchQuery, this.version).subscribe((message) => {
      console.log(message);
      this.searchResults = message.json.results;
      this.preResult = message.jsonresponse;
      this.strongsList = message.strongs;

      this.versesList = message.verses;
      this.value = message.verses;
      console.log(this.value.value)
      // console.log(this.searchResults.length);
      let i = 0;
      this.optResults = [];
      this.searchResults.forEach((response: any) => {
        let jd: any = JSON.stringify(response);

        let data: Result = ({ "key": response.key || "", "preview": this.extractContent(response.key, this.preResult[i]) || "" });
        this.optResults.push(data);
        i++;
      });
    });
  }

  extractContent(key: string, text: any) {
    let res = text.replace(key, '');
    return res; //new DOMParser().parseFromString(text, "text/html") . documentElement . textContent;

  }

  toggleStrong(index: any) {

    let query = this.optResults[index].key;

    //console.log(index + " " + query);
    this.sts = this.strongsList.filter(function (element: any) {
      return element.verse == query;
    });

    this.selectedVerse = query;
    this.selectedVerseMessage = this.optResults[index].preview;
    //console.log({"sts": this.sts});
    this.collapse = true;
  }

  updateToggle() {
    this.collapse = false;
  }
  onSelect(strong: any) {
    this.isbiblecom.emit({ status: true, isclose: 0 });
    console.log(strong);
    localStorage.setItem("version", this.version);
    localStorage.setItem("strong", JSON.stringify(strong));
    //  localStorage.setItem("value", JSON.stringify(this.value));
  }
  getBibele(Chapter:any) {
    this.chapter =  Chapter;
    // console.log( this.book , this.chapter , this.version)
    // this.form.book=this.book
    // this.form.chapte=this.chapter
    this.apiService.getBible(this.version, this.book, this.chapter).subscribe((message) => {
      this.BibleVerses =message
      console.log(this.BibleVerses)

    })
  }


}

export interface Result {
  key: string;
  preview: string;
}