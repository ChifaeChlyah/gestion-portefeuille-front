import {Component, OnInit, ViewChild} from '@angular/core';
import {GanttEditorComponent, GanttEditorOptions} from "ng-gantt";
import {FormBuilder} from "@angular/forms";
import {DayPilot} from "daypilot-pro-angular";
declare var $ :any

declare var angular: any;
@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements OnInit {

  // config: any = {
  //   cellWidthSpec: "Fixed",
  //   cellWidth: 40,
  //   timeHeaders: [
  //     {
  //       "groupBy": "Month"
  //     },
  //     {
  //       "groupBy": "Day",
  //       "format": "d"
  //     }
  //   ],
  //   scale: "Day",
  //   days: DayPilot.Date.today().daysInMonth(),
  //   startDate: DayPilot.Date.today().firstDayOfMonth(),
  //   taskHeight: 30,
  //   rowHeaderHideIconEnabled: true,
  //   rowMoveHandling: "Update",
  //   onRowMoved: (args) => {
  //     args.control.message("Row moved: " + args.source.text());
  //   },
  //   taskMoveHandling: "Update",
  //   onTaskMoved: (args) => {
  //     args.control.message("Task moved to: " + args.newStart);
  //   },
  //   linkCreateHandling: "Update",
  //   onLinkCreated: (args) => {
  //     args.control.message("Link created, type: " + args.type);
  //   },
  //   rowCreateHandling: "Enabled",
  //   onRowCreate: (args) => {
  //     args.control.tasks.add(new DayPilot.Task({
  //       id: DayPilot.guid(),
  //       text: args.text,
  //       start: new DayPilot.Date().getDatePart(),
  //       end: new DayPilot.Date().getDatePart().addDays(1)
  //     }));
  //   },
  //   tasks:
  //     [
  //       {
  //         "id": 1,
  //         "text": "Group 1",
  //         "complete": 35,
  //         "children": [
  //           {
  //             "id": 3,
  //             "start": "2022-07-11T00:00:00",
  //             "end": "2022-07-16T00:00:00",
  //             "text": "Task 2",
  //             "complete": 0
  //           },
  //           {
  //             "id": 2,
  //             "start": "2022-07-04T00:00:00",
  //             "end": "2022-07-09T00:00:00",
  //             "text": "Task 1",
  //             "complete": 60
  //           },
  //           {
  //             "id": 4,
  //             "start": "2022-07-16T00:00:00",
  //             "type": "Milestone",
  //             "text": "Milestone 1",
  //             "end": "2022-07-16T00:00:00"
  //           }
  //         ],
  //         "start": "2022-07-04T00:00:00",
  //         "end": "2022-07-16T00:00:00",
  //         "row": {
  //           "collapsed": false
  //         }
  //       },
  //       {
  //         "id": "66bb5126-e3e3-d278-059c-27dba18fb743",
  //         "text": "test",
  //         "start": "2022-07-14T00:00:00",
  //         "end": "2022-07-20T00:00:00"
  //       }
  //     ],
  //   links:
  //     [
  //       {
  //         "from": 2,
  //         "to": 3,
  //         "type": "FinishToStart"
  //       },
  //       {
  //         "from": 1,
  //         "to": 1,
  //         "type": "FinishToFinish",
  //         "id": null
  //       }
  //     ]
  // }


  // @ViewChild("editor") editor: GanttEditorComponent;
  // public editorOptions: GanttEditorOptions;
  // public data: any;

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
  //   this.data = this.initialData();
  //   this.editorOptions = {
  //     vFormat: "day",
  //     vEditable: true,
  //     vEventsChange: {
  //       taskname: () => {
  //         console.log("taskname");
  //       }
  //     }
  //   };
  // }
  //
  // changeData() {
  //   this.data = [... this.data,
  //     { pID: Math.random() * 100,
  //
  //       pName: "new item", }];
  // }
  //
  //
  // initialData() {
  //   return [
  //     {
  //       pID: 1,
  //       pName: "Define Chart API",
  //       pStart: "",
  //       pEnd: "",
  //       pClass: "ggroupblack",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 0,
  //       pGroup: 1,
  //       pParent: 0,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: "Some Notes text"
  //     },
  //     {
  //       pID: 11,
  //       pName: "Chart Object",
  //       pStart: "2017-02-20",
  //       pEnd: "2017-02-20",
  //       pClass: "gmilestone",
  //       pLink: "",
  //       pMile: 1,
  //       pRes: "Shlomy",
  //       pComp: 100,
  //       pGroup: 0,
  //       pParent: 1,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 12,
  //       pName: "Task Objects",
  //       pStart: "",
  //       pEnd: "",
  //       pClass: "ggroupblack",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Shlomy",
  //       pComp: 40,
  //       pGroup: 1,
  //       pParent: 1,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 121,
  //       pName: "Constructor Proc #1234 of February 2017",
  //       pStart: "2017-02-21",
  //       pEnd: "2017-03-09",
  //       pClass: "gtaskblue",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian T.",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 12,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 122,
  //       pName: "Task Variables",
  //       pStart: "2017-03-06",
  //       pEnd: "2017-03-11",
  //       pClass: "gtaskred",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 12,
  //       pOpen: 1,
  //       pDepend: 121,
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 123,
  //       pName: "Task by Minute/Hour",
  //       pStart: "2017-03-09",
  //       pEnd: "2017-03-14 12: 00",
  //       pClass: "gtaskyellow",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Ilan",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 12,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 124,
  //       pName: "Task Functions",
  //       pStart: "2017-03-09",
  //       pEnd: "2017-03-29",
  //       pClass: "gtaskred",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Anyone",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 12,
  //       pOpen: 1,
  //       pDepend: "123SS",
  //       pCaption: "This is a caption",
  //       pNotes: null
  //     },
  //     {
  //       pID: 2,
  //       pName: "Create HTML Shell",
  //       pStart: "2017-03-24",
  //       pEnd: "2017-03-24",
  //       pClass: "gtaskyellow",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 20,
  //       pGroup: 0,
  //       pParent: 0,
  //       pOpen: 1,
  //       pDepend: 122,
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 3,
  //       pName: "Code Javascript",
  //       pStart: "",
  //       pEnd: "",
  //       pClass: "ggroupblack",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 0,
  //       pGroup: 1,
  //       pParent: 0,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 31,
  //       pName: "Define Variables",
  //       pStart: "2017-02-25",
  //       pEnd: "2017-03-17",
  //       pClass: "gtaskpurple",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 30,
  //       pGroup: 0,
  //       pParent: 3,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 32,
  //       pName: "Calculate Chart Size",
  //       pStart: "2017-03-15",
  //       pEnd: "2017-03-24",
  //       pClass: "gtaskgreen",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Shlomy",
  //       pComp: 40,
  //       pGroup: 0,
  //       pParent: 3,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 33,
  //       pName: "Draw Task Items",
  //       pStart: "",
  //       pEnd: "",
  //       pClass: "ggroupblack",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Someone",
  //       pComp: 40,
  //       pGroup: 2,
  //       pParent: 3,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 332,
  //       pName: "Task Label Table",
  //       pStart: "2017-03-06",
  //       pEnd: "2017-03-09",
  //       pClass: "gtaskblue",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 33,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 333,
  //       pName: "Task Scrolling Grid",
  //       pStart: "2017-03-11",
  //       pEnd: "2017-03-20",
  //       pClass: "gtaskblue",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 0,
  //       pGroup: 0,
  //       pParent: 33,
  //       pOpen: 1,
  //       pDepend: "332",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 34,
  //       pName: "Draw Task Bars",
  //       pStart: "",
  //       pEnd: "",
  //       pClass: "ggroupblack",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Anybody",
  //       pComp: 60,
  //       pGroup: 1,
  //       pParent: 3,
  //       pOpen: 0,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 341,
  //       pName: "Loop each Task",
  //       pStart: "2017-03-26",
  //       pEnd: "2017-04-11",
  //       pClass: "gtaskred",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 34,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 342,
  //       pName: "Calculate Start/Stop",
  //       pStart: "2017-04-12",
  //       pEnd: "2017-05-18",
  //       pClass: "gtaskpink",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 34,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 343,
  //       pName: "Draw Task Div",
  //       pStart: "2017-05-13",
  //       pEnd: "2017-05-17",
  //       pClass: "gtaskred",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 34,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 344,
  //       pName: "Draw Completion Div",
  //       pStart: "2017-05-17",
  //       pEnd: "2017-06-04",
  //       pClass: "gtaskred",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 34,
  //       pOpen: 1,
  //       pDepend: "342,343",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 35,
  //       pName: "Make Updates",
  //       pStart: "2017-07-17",
  //       pEnd: "2017-09-04",
  //       pClass: "gtaskpurple",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 30,
  //       pGroup: 0,
  //       pParent: 3,
  //       pOpen: 1,
  //       pDepend: "333",
  //       pCaption: "",
  //       pNotes: ""
  //     }
  //   ];
  //


  }
}
