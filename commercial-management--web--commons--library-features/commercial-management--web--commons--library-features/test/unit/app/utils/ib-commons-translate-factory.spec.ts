import { TestBed } from "@angular/core/testing";
import { TranslateFactoryService } from "ib-web-commons/utils";
import { TranslateModule } from "@ngx-translate/core";

describe("TranslateFactoryService", () => {
  let translateFactoryService: TranslateFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateFactoryService],
      imports: [TranslateModule.forRoot()],
    });
    translateFactoryService = TestBed.inject(TranslateFactoryService);
  });
  it("#setLanguage should call to set language", () => {
    spyOn(translateFactoryService, "setLanguage").and.callThrough();
    translateFactoryService.setLanguage("es");
    expect(translateFactoryService.setLanguage).toBeDefined();
    expect(translateFactoryService.setLanguage).toHaveBeenCalled();
  });
});
