export default class TaskPanelController {
  constructor() {
    'ngInject';
  }

  $onDestroy() {
    // remove event listeners
    // this.$document.removeEventListener('scroll', this.scrollListener);
  }

}
