import {Component, OnInit} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TaskDto} from '../../client/model/taskDto';
import {TasksService} from '../../services/tasks.service';

export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE'
}
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
      const updatedTask : TaskDto = event.container.data[event.currentIndex];
      updatedTask.status = this.getStatusForContainer(event.container.id);
      this.tasksService.updateTaskStatus(updatedTask).then(() => {
        console.log('Task updated successfully:');
      }).catch(error => {
        console.error('Failed to update task:', error);
      });
    }

  }

  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  ngOnInit() {
    this.tasksService.getTasks().then(tasks => {
      this.todo = tasks.filter(task => task.status === 'TODO');
      this.done = tasks.filter(task => task.status === 'DONE');
      this.doing = tasks.filter(task => task.status === 'DOING');
    });

  }

  private getStatusForContainer(containerId: string): TaskStatus{
    switch (containerId){
      case 'todoList': return TaskStatus.TODO;
      case 'doingList': return TaskStatus.DOING;
      case 'doneList': return TaskStatus.DONE;
      default: return  TaskStatus.DOING;
    }
  }
}
