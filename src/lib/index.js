import ng from 'angular';
import taskPanelDirective from './directive';
import taskCard from '../task.card';

export default ng.module('taskPanel', [taskCard])
  .directive('taskPanel', taskPanelDirective)
  .name;
