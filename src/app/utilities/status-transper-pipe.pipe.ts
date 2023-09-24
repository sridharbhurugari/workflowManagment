import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTransperPipe'
})
export class StatusTransperPipePipe implements PipeTransform {

  transform(value: unknown, elem:string) {
    if(elem == "1"){
      return value ? 'Active' : 'Inactive';
    }
    else{
    return value? 'Yes' : '';
    }
  }

}
