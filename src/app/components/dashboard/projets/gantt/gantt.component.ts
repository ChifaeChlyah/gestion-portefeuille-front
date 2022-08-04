import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GanttEditorComponent, GanttEditorOptions} from "ng-gantt";
import {FormBuilder} from "@angular/forms";
import Gantt from 'frappe-gantt';
declare var $ :any

declare var angular: any;
@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements OnInit {
  @ViewChild('gantt') ganttEl: ElementRef;
  ngOnInit(): void {
    this.gantt = new Gantt('#gantt', this.tasks, {
      on_click: function (task) {
        console.log(task);
      },
      on_hover: function (task) {
        console.log(task);
      },
      on_date_change: function(task, start, end) {
        console.log(task, start, end);
      },
      on_progress_change: function(task, progress) {
        console.log(task, progress);
      },
      on_view_change: function(mode) {
        console.log(mode);
      },
    //   custom_popup_html: function(task) {
    //
    //   // const end_date = task._end.format('MMM D');
    //   return `
		// <div class="details-container">
		//   <h5>${task.name}</h5>
		//   <p>Expected to finish by </p>
		//   <p>${task.progress}% completed!</p>
		// </div>
	  // `}
    });

  }
    gantt;
    tasks = [
      {
        id: 'Task 1',
        name: 'Redesign website',
        start: '2016-12-28',
        end: '2016-12-31',
        progress: 20,
        dependencies: '',
      },
      {
        id: 'Task 2',
        name: 'Redesign website',
        start: '2016-12-28',
        end: '2016-12-31',
        progress: 20,
        dependencies: 'Task 1',
      },
    ];


}
