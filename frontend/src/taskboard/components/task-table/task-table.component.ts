import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import {TaskDto} from '../../client/model/taskDto';
import {TasksService} from '../../services/tasks.service';

/**
 * @title Drag&Drop connected sorting
 * Source of this component: https://material.angular.io/cdk/drag-drop/overview#transferring-items-between-lists
 * And the original task-table
 */
@Component({
  selector: 'taskboard-task-table',
  templateUrl: 'task-table.component.html',
  styleUrl: 'task-table.component.css',
  imports: [CdkDropList, CdkDrag],
})
export class TaskTableComponent  implements OnInit {
  todo: TaskDto[] = [];
  done: TaskDto[] = [];
  doing: TaskDto[] = [];

  drop(event: CdkDragDrop<TaskDto[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

  }

  displayedColumns: string[] = ['title', 'description', 'status', 'assignee'];
  dataSource = new MatTableDataSource<TaskDto>([]);

  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  ngOnInit() {
    this.tasksService.getTasks().then(tasks => {
      this.dataSource.data = tasks;
      this.todo = tasks.filter(task => task.status === 'TODO');
      this.done = tasks.filter(task => task.status === 'DONE');
      this.doing = tasks.filter(task => task.status === 'DOING');
    });

  }
}
