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
      this.filtered_todo = this.todo;
      this.filtered_done = this.done;
      this.filtered_doing = this.doing;
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


  // The filter is based on the following website: https://v17.angular.io/tutorial/first-app/first-app-lesson-13
  filtered_todo: TaskDto[] = [];
  filtered_done: TaskDto[] = [];
  filtered_doing: TaskDto[] = [];

  filterResults(text: string){
    console.log(text);
    if(!text || text == ""){
      this.filtered_todo = this.todo;
      this.filtered_done = this.done;
      this.filtered_doing = this.doing;
      return;
    }
    this.filtered_todo = this.todo.filter(
      task =>
        task.title.toLowerCase().includes(text.toLowerCase()) ||
        task.description.toLowerCase().includes(text.toLowerCase()) ||
        (task.assignee?.name.toLowerCase().includes(text.toLowerCase()) ?? false)
    )
    this.filtered_done = this.done.filter(
      task =>
        task.title.toLowerCase().includes(text.toLowerCase()) ||
        task.description.toLowerCase().includes(text.toLowerCase()) ||
        (task.assignee?.name.toLowerCase().includes(text.toLowerCase()) ?? false)
    )
    this.filtered_doing = this.doing.filter(
      task =>
        task.title.toLowerCase().includes(text.toLowerCase()) ||
        task.description.toLowerCase().includes(text.toLowerCase()) ||
        (task.assignee?.name.toLowerCase().includes(text.toLowerCase()) ?? false)
    )
  }
}
