@Directives(
  "ib-commons-directives-module",
  ["$timeout", "$window", "CommonsComponentUtils"],
  [],
)
class ngFileSelect implements ng.IDirective {
  scope = {
    ngChangeImg: "<",
  };
  restrict = "A";
  link = (scope: any, elem: any, attrs: any): void => {
    elem.bind("change", (event: any) => {
      const files = event.target.files;
      const file = files[0];
      const reader: any = new FileReader();
      reader.onload = () => {
        const arrayFile: any = new Uint8Array(reader.result);
        const raw: string = String.fromCharCode.apply(null, arrayFile);
        scope.ngChangeImg(file);
      };
      reader.readAsDataURL(file);
    });
    elem.bind("click", (event: any) => {
      elem[0].value = "";
    });
  };
}
