namespace ButtonSetModel {
  export class buttonSetItem {
    public type: string;
    public icon: string;
    public title: string;
    public text: string;
    public url: string;
    public id: string;
    public modifier: string;
    public callback: Function;
    public action: Function;
    /**
     * @param title Title for the button
     * @param text Text to show on button
     * @param function Function to run it will be set on the child form
     * @param type Type of input
     * @param icon Icon path
     * @param url Url
     * @param id Unique id
     * @param modifier Extra class modifier
     */
    constructor(
      title: string,
      text: string,
      callback: Function,
      type: string,
      icon: string,
      url: string,
      id: string,
      modifier: string,
    ) {
      this.type = type || "";
      this.icon = icon || "";
      this.title = title;
      this.text = text;
      this.url = url || "javascript:void(0)";
      this.id = id || "#";
      this.modifier = modifier || "";
      this.callback = callback;
    }
  }
}
window.ButtonSetModel = ButtonSetModel;
