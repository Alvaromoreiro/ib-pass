import { TestBed } from "@angular/core/testing";
import { commonsTranslateLoader } from "ib-web-commons/utils";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import {
  HttpClientModule,
  HttpClient,
  HttpHandler,
} from "@angular/common/http";
import { Observable } from "rxjs";

describe("TranslateFactoryService", () => {
  function createTranslateLoader(http: HttpClient) {
    return commonsTranslateLoader(http, [
      "/iberia-web-content/literales/",
      "/iberia-web-content/literales/general/",
    ]);
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      imports: [HttpClientModule],
    });
  });
  it("#setLanguage should call to set language", () => {
    const next: any = {
      handle: () => {
        return new Observable((subscriber) => {
          subscriber.complete();
        });
      },
    };
    const http = new HttpClient(next);
    const result = createTranslateLoader(http);
    expect(result).toBeTruthy();
  });
});
