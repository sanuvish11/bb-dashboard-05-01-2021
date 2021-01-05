import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { PositionsService } from 'src/app/service/positions.service';
import { ChatService } from '../service/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  ischatpanel = true;
  @Output() thischat = new EventEmitter();
//@Output() thischat1 = new EventEmitter();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  toggleclosebtn() {
    // this.ischatpanel = !this.ischatpanel;
    this.thischat.emit({status:false,isclose:1});
  
  }


  newMessage: string = '';
  messageList: string[] = [];
  load = true;
  name: string = "";
  typingUser: any;
  typing = false;
  sentTime: string = "";
  confessorName:any;
  room:any;
  status:any;
  constructor(private chatService: ChatService, private posServ: PositionsService, private http: HttpClient) {
    this.confessorName = localStorage.getItem("confessorName");

    this.room = localStorage.getItem("roomId");

    this.initiate();
    this.getTyping();
    this.stopTyping();

    this.getMessages();
    setInterval(() => {
      this.timeNow = new Date();
    }, 1);
  }


  options: any;
  dashboard: Array<GridsterItem> = [{ cols: 5, rows: 5, x: 0, y: 0 }]
  loaded = true;
  singleChatData: any;
  ngOnInit() {

    let body = {
      "ROOM_ID_FK": this.room
    };
    this.http.post("http://ec2-3-23-105-251.us-east-2.compute.amazonaws.com:8080/api/auth/chatdetail", body, this.httpOptions).subscribe(data => {
      this.singleChatData = data;
      console.log(data);
      console.log(this.singleChatData);
    });

    this.options = {
      setGridSize: true,
      gridType: GridType.Fit,
      //compactType: CompactType.None,
      fixedRowHeight: 100,
      minRows: 1,
      maxRows: 100,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      minItemRows: 1,
      maxItemRows: 100,
      defaultItemRows: 1,
      minCols: 1,
      maxCols: 100,
      maxItemCols: 100,
      fixedColWidth: 105,
      scrollToNewItems: false,
      minItemCols: 1,
      defaultItemCols: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      swap: true,
      displayGrid: 'onDrag&Resize',
      compactType: 'none', // 'compactUp&Left',compactLeft&Up'
      pushItems: true,
      resizable: { enabled: true },
      draggable: {
        enabled: true
      },

      itemChangeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => this.itemChange(item, itemComponent),
      itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => this.itemResize(item, itemComponent),
    };

    this.dashboard = [
      { "x": 0, "y": 0, "cols": 3, "rows": 3 },
    ]

    // hiding the gridster untill positions are loaded
    this.loaded = false;

    this.posServ.getPositions().subscribe((positions) => {
      this.dashboard = positions;
      this.loaded = true;
    })

  }  public show: boolean = false;
  public buttonName: any = 'Show';
  isShowDiv = true;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  public todayString = new Date();
  ScheeduleDate(e: any) {
    console.log(e)
    this.todayString = e.value
  }

  initiate() {
    this.name = localStorage.getItem("adminname") || "father";
    this.chatService.initiateChat(this.name,this.room);
    this.load = false;
  }

  sendMessage() {
    let date: Date = new Date();
    this.chatService.sendMessage({ sender: this.name, msg: this.newMessage, time: date.toISOString(), sender_id: 1 ,room :this.room,status:0});
    this.newMessage = '';
// this.messageList = [];    
    
  }

  update() {
    this.chatService.updateStatus(this.name);
  }

  getMessages(){

    this.chatService
    .getMessages()
    .subscribe((message: any) => {
      console.log(message);
      this.messageList.push(message);
    });
    
  }

  stopTyping() {
    this.chatService.stopTyping(this.name).subscribe((name: any) => {

      if (this.name !== name.username) {

        this.typingUser = name;
        this.typing = false;
      } else {
        this.typing = false;
      }
    });
  }

  getTyping() {
    this.chatService.getTypingStatus().subscribe((name: any) => {

      if (this.name !== name.username) {

        this.typingUser = name;
        this.typing = true;
      }
      setTimeout(() => {
        this.typing = false;
      }, 3000);

    });

  }



  static itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    throw new Error('Method not implemented.');
  }
  static itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    throw new Error('Method not implemented.');
  }
  timeNow: Date = new Date();
  itemChange(item: any, itemComponent: any) {
    console.info(`state: ${JSON.stringify(this.dashboard, null, 5)}`);
    this.posServ.savePositions(this.dashboard)
  }

  itemResize(item: any, itemComponent: any) {
    console.info('itemResized', item, itemComponent);
  }
  onSelect() {
    this.thischat.emit({status:true,isclose:0});
  }

}