import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, map } from "rxjs";

export function commonsTranslateLoader(http: HttpClient, array: string[]) {
  const i18Routes = array.map((route) => {
    return { prefix: route, suffix: ".json" };
  });
  return new MultiTranslateHttpLoader(http, i18Routes);
}

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    public resources: { prefix: string; suffix: string }[] = [
      { prefix: "/iberia-web-content/literales/general/", suffix: ".json" },
    ],
  ) {}

  public getTranslation(lang: string): any {
    return forkJoin(
      this.resources.map((config) => {
        return this.http.get(`${config.prefix}${lang}${config.suffix}`);
      }),
    ).pipe(
      map((response) => {
        return response.reduce((a, b) => {
          return Object.assign(a, b);
        });
      }),
    );
  }
}
