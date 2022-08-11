import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GanttEditorComponent, GanttEditorOptions} from "ng-gantt";
import {FormBuilder} from "@angular/forms";
import Gantt from 'frappe-gantt';
import {Tache} from "../../../../model/Tache.model";
import {DatePipe} from "@angular/common";
import {colors} from "@angular/cli/src/utilities/color";
declare var $ :any

declare var angular: any;
@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements OnInit {
  @ViewChild("editor") editor: GanttEditorComponent;
  @Input() tachesProjetInput?: Tache[] ;
  public editorOptions: GanttEditorOptions;
  public data: any;

  constructor(public fb: FormBuilder,public datepipe: DatePipe) {}

  ngOnInit() {

    this.data = this.initialData();
    this.editorOptions = {
      vFormat: "day",
      vEditable: false,
      vEventsChange: {
        taskname: () => {
          console.log("taskname");
        }
      },
      vShowEndDate:false,
      vShowStartDate:false,
      vShowRes:false,
      vShowDur:false,
      vShowComp:false
    };

  }



  initialData() {
    let tasks=new Array();
    this.tachesProjetInput.forEach(tache=>{
      let ressources=new Array();
      tache.interventions.forEach(
        i=>{
          ressources.push(i.intervenant.nom+" "+i.intervenant.prenom)
        }
      )
      var childColors = ["gtaskpink","gtaskblue","gtaskgreen","gtaskyellow"];
      var randColor = childColors[Math.floor(Math.random() * childColors.length)];
      var parent=null;
      if(tache.tacheMere!=null)
        parent=tache.tacheMere.idTache;
      var dependances=""
      for(let i=0;i<tache.dependances.length;i++)
      {
        if(i!=0)
          dependances+=","+tache.dependances[i].idTache.toString();
        else
          dependances+=tache.dependances[i].idTache.toString();
      }
      var pClass="";
      var mere=false;
      this.tachesProjetInput.forEach(
        t=>{
          if(t.tacheMere!=null&&t.tacheMere.idTache==tache.idTache)
            mere=true;
        }
      );
      if(mere)
        pClass="ggroupblack";
      else
        pClass=randColor;
      var t={
        pID: tache.idTache,
        pName: tache.titre,
        pStart: this.datepipe.transform(tache.dateDebutPrevue, 'yyyy-MM-dd'),
        pEnd: this.datepipe.transform(tache.dateFinPrevue, 'yyyy-MM-dd'),
        pClass: pClass,
        pLink: "",
        pMile: 0,
        pRes: ressources,
        pComp: tache.avancement,
        pGroup: (mere)?1:0,
        pParent: (parent==null)?"":parent,
        pOpen: 1,
        pDepend: dependances,
        pCaption: "",
        pNotes: tache.description
      }
      tasks.push(t);
    });
    console.log(tasks)
    return tasks;

  // console.log(this.tachesProjetInput)
  //   return [
  //     // {
  //     //   pID: 0,
  //     //   pName: this.tachesProjetInput[0].titre,
  //     //   pStart: this.datepipe.transform(this.tachesProjetInput[0].dateDebutPrevue, 'yyyy-MM-dd'),
  //     //   pEnd: this.datepipe.transform(this.tachesProjetInput[0].dateFinPrevue, 'yyyy-MM-dd'),
  //     //   pClass: "ggroupblack",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "",
  //     //   pComp: this.tachesProjetInput[0].avancement,
  //     //   pGroup: 1,
  //     //   pParent: "",
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: this.tachesProjetInput[0].description
  //     // },{
  //     //   pID: 1,
  //     //   pName: this.tachesProjetInput[1].titre,
  //     //   pStart: this.datepipe.transform(this.tachesProjetInput[1].dateDebutPrevue, 'yyyy-MM-dd'),
  //     //   pEnd: this.datepipe.transform(this.tachesProjetInput[1].dateFinPrevue, 'yyyy-MM-dd'),
  //     //   pClass: "gmilestone",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "",
  //     //   pComp: this.tachesProjetInput[1].avancement,
  //     //   pGroup: 0,
  //     //   pParent: 1,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: this.tachesProjetInput[1].description
  //     // },
  //     // {
  //     //   pID: 11,
  //     //   pName: "Chart Object",
  //     //   pStart: "2017-02-20",
  //     //   pEnd: "2017-02-20",
  //     //   pClass: "gmilestone",
  //     //   pLink: "",
  //     //   pMile: 1,
  //     //   pRes: "Shlomy",
  //     //   pComp: 100,
  //     //   pGroup: 0,
  //     //   pParent: 1,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     {
  //       pID: 1,
  //       pName: this.tachesProjetInput[0].titre,
  //       pStart: this.datepipe.transform(this.tachesProjetInput[0].dateDebutPrevue, 'yyyy-MM-dd'),
  //       pEnd: this.datepipe.transform(this.tachesProjetInput[0].dateFinPrevue, 'yyyy-MM-dd'),
  //       pClass: "ggroupblack",
  //       pLink: "",
  //       pRes: "Shlomy",
  //       pComp: 40,
  //       pGroup: 1,
  //       pParent: "",
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 2,
  //       pName: this.tachesProjetInput[1].titre,
  //       pStart: this.datepipe.transform(this.tachesProjetInput[1].dateDebutPrevue, 'yyyy-MM-dd'),
  //       pEnd: this.datepipe.transform(this.tachesProjetInput[1].dateFinPrevue, 'yyyy-MM-dd'),
  //       pClass: "gtaskblue",
  //       pLink: "",
  //       pRes: "Brian T.",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 1,
  //       pOpen: 1,
  //       pDepend: "",
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     {
  //       pID: 3,
  //       pName: this.tachesProjetInput[2].titre,
  //       pStart: this.datepipe.transform(this.tachesProjetInput[2].dateDebutPrevue, 'yyyy-MM-dd'),
  //       pEnd: this.datepipe.transform(this.tachesProjetInput[2].dateFinPrevue, 'yyyy-MM-dd'),
  //       pClass: "gtaskred",
  //       pLink: "",
  //       pMile: 0,
  //       pRes: "Brian",
  //       pComp: 60,
  //       pGroup: 0,
  //       pParent: 1,
  //       pOpen: 1,
  //       pDepend: ['121FS'],
  //       pCaption: "",
  //       pNotes: ""
  //     },
  //     // {
  //     //   pID: 123,
  //     //   pName: "Task by Minute/Hour",
  //     //   pStart: "2017-03-09",
  //     //   pEnd: "2017-03-14 12: 00",
  //     //   pClass: "gtaskyellow",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Ilan",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 12,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 124,
  //     //   pName: "Task Functions",
  //     //   pStart: "2017-03-09",
  //     //   pEnd: "2017-03-29",
  //     //   pClass: "gtaskred",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Anyone",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 12,
  //     //   pOpen: 1,
  //     //   pDepend: "123SS",
  //     //   pCaption: "This is a caption",
  //     //   pNotes: null
  //     // },
  //     // {
  //     //   pID: 2,
  //     //   pName: "Create HTML Shell",
  //     //   pStart: "2017-03-24",
  //     //   pEnd: "2017-03-24",
  //     //   pClass: "gtaskyellow",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 20,
  //     //   pGroup: 0,
  //     //   pParent: 0,
  //     //   pOpen: 1,
  //     //   pDepend: 122,
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 3,
  //     //   pName: "Code Javascript",
  //     //   pStart: "",
  //     //   pEnd: "",
  //     //   pClass: "ggroupblack",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 0,
  //     //   pGroup: 1,
  //     //   pParent: 0,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 31,
  //     //   pName: "Define Variables",
  //     //   pStart: "2017-02-25",
  //     //   pEnd: "2017-03-17",
  //     //   pClass: "gtaskpurple",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 30,
  //     //   pGroup: 0,
  //     //   pParent: 3,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 32,
  //     //   pName: "Calculate Chart Size",
  //     //   pStart: "2017-03-15",
  //     //   pEnd: "2017-03-24",
  //     //   pClass: "gtaskgreen",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Shlomy",
  //     //   pComp: 40,
  //     //   pGroup: 0,
  //     //   pParent: 3,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 33,
  //     //   pName: "Draw Task Items",
  //     //   pStart: "",
  //     //   pEnd: "",
  //     //   pClass: "ggroupblack",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Someone",
  //     //   pComp: 40,
  //     //   pGroup: 2,
  //     //   pParent: 3,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 332,
  //     //   pName: "Task Label Table",
  //     //   pStart: "2017-03-06",
  //     //   pEnd: "2017-03-09",
  //     //   pClass: "gtaskblue",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 33,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 333,
  //     //   pName: "Task Scrolling Grid",
  //     //   pStart: "2017-03-11",
  //     //   pEnd: "2017-03-20",
  //     //   pClass: "gtaskblue",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 0,
  //     //   pGroup: 0,
  //     //   pParent: 33,
  //     //   pOpen: 1,
  //     //   pDepend: "332",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 34,
  //     //   pName: "Draw Task Bars",
  //     //   pStart: "",
  //     //   pEnd: "",
  //     //   pClass: "ggroupblack",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Anybody",
  //     //   pComp: 60,
  //     //   pGroup: 1,
  //     //   pParent: 3,
  //     //   pOpen: 0,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 341,
  //     //   pName: "Loop each Task",
  //     //   pStart: "2017-03-26",
  //     //   pEnd: "2017-04-11",
  //     //   pClass: "gtaskred",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 34,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 342,
  //     //   pName: "Calculate Start/Stop",
  //     //   pStart: "2017-04-12",
  //     //   pEnd: "2017-05-18",
  //     //   pClass: "gtaskpink",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 34,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 343,
  //     //   pName: "Draw Task Div",
  //     //   pStart: "2017-05-13",
  //     //   pEnd: "2017-05-17",
  //     //   pClass: "gtaskred",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 34,
  //     //   pOpen: 1,
  //     //   pDepend: "",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 344,
  //     //   pName: "Draw Completion Div",
  //     //   pStart: "2017-05-17",
  //     //   pEnd: "2017-06-04",
  //     //   pClass: "gtaskred",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 60,
  //     //   pGroup: 0,
  //     //   pParent: 34,
  //     //   pOpen: 1,
  //     //   pDepend: "342,343",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // },
  //     // {
  //     //   pID: 35,
  //     //   pName: "Make Updates",
  //     //   pStart: "2017-07-17",
  //     //   pEnd: "2017-09-04",
  //     //   pClass: "gtaskpurple",
  //     //   pLink: "",
  //     //   pMile: 0,
  //     //   pRes: "Brian",
  //     //   pComp: 30,
  //     //   pGroup: 0,
  //     //   pParent: 3,
  //     //   pOpen: 1,
  //     //   pDepend: "333",
  //     //   pCaption: "",
  //     //   pNotes: ""
  //     // }
  //   ];
  }


// ngOnInit(): void {
  //   this.gantt = new Gantt('#gantt', this.tasks, {
  //     on_click: function (task) {
  //       console.log(task);
  //     },
  //     on_hover: function (task) {
  //       console.log(task);
  //     },
  //     on_date_change: function(task, start, end) {
  //       console.log(task, start, end);
  //     },
  //     on_progress_change: function(task, progress) {
  //       console.log(task, progress);
  //     },
  //     on_view_change: function(mode) {
  //       console.log(mode);
  //     },
  //   //   custom_popup_html: function(task) {
  //   //
  //   //   // const end_date = task._end.format('MMM D');
  //   //   return `
	// 	// <div class="details-container">
	// 	//   <h5>${task.name}</h5>
	// 	//   <p>Expected to finish by </p>
	// 	//   <p>${task.progress}% completed!</p>
	// 	// </div>
	//   // `}
  //   });
  //
  // }
  //   gantt;
  //   tasks = [
  //     {
  //       id: 'Task 1',
  //       name: 'Redesign website',
  //       start: '2016-12-28',
  //       end: '2016-12-31',
  //       progress: 20,
  //       dependencies: '',
  //     },
  //     {
  //       id: 'Task 2',
  //       name: 'Redesign website',
  //       start: '2016-12-28',
  //       end: '2016-12-31',
  //       progress: 20,
  //       dependencies: 'Task 1',
  //     },
  //   ];


}
