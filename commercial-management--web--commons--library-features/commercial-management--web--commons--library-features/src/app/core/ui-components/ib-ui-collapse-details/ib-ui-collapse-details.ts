@Controller("ib-ui-collapse-details", [], [])
class CollapseDetailsController implements ng.IController {
  isCollapsed: boolean;
  text: string;
  closedText: string;
  openedText: string;

  constructor() {
    this.isCollapsed = false;
    this.text = "";
    this.closedText = "";
    this.openedText = "";
  }

  initCollapse = (closedText: string, openedText: string): void => {
    this.closedText = closedText;
    this.text = closedText;
    this.openedText = openedText;
  };

  externalChangeText = (text: string): void => {
    this.text = !this.isCollapsed ? text : text;
    this.closedText = text;
  };

  toggle = (): void => {
    this.isCollapsed = !this.isCollapsed;
    this.text = this.isCollapsed ? this.openedText : this.closedText;
  };
}
