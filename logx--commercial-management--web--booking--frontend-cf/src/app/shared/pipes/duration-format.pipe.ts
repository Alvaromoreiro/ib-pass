import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

    transform (duration: number): string {
        let durationFormatted = '', hoursFormatted = '';
        let hours = 0, minutes = 0;

        if (duration > 0) {
            hours = Math.floor(duration / 60);
            minutes = duration % 60;
            hoursFormatted = hours < 10 ? ('0' + hours) : hours.toString();
            durationFormatted = (hours > 0 ? (hoursFormatted + 'h ') : '') + (minutes > 0 ? (minutes + 'min.') : '');
        }
        return durationFormatted;
    }

}
