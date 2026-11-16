import { Component, Input } from "@angular/core";


@Component({
  selector: 'box-any-questions',
  templateUrl: './box-any-questions-view.component.html',
  styleUrls: ['./box-any-questions.component.scss']
})

export class IbBoxAnyQuestionsComponent {
    @Input() extraClass;
    constructor() {}
}
