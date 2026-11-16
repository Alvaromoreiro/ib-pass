import { fakeAsync, tick } from '@angular/core/testing';
import { CountdownTimer } from '@core/utils/CountdownTimer';

describe('CountdownTimer', () => {
    let timer: CountdownTimer;
    let stepCallback: jasmine.Spy;
    let startCallback: jasmine.Spy;
    let endCallback: jasmine.Spy;
    let pauseCallback: jasmine.Spy;
    const interval = 25;
    const duration = 4*interval - 10; // 100ms - 10ms

    beforeEach(() => {
        timer = new CountdownTimer(interval, duration); // step: 25ms, duration: 75ms
        stepCallback = jasmine.createSpy('stepCallback');
        startCallback = jasmine.createSpy('startCallback');
        endCallback = jasmine.createSpy('endCallback');
        pauseCallback = jasmine.createSpy('pauseCallback');

        timer.onTimerStep = stepCallback;
        timer.onTimerStart = startCallback;
        timer.onTimerEnd = endCallback;
        timer.onTimerPause = pauseCallback;
    });

    it('should behave as infinite interval if timer is declared without duration', fakeAsync(() => {
        const interval = 25;
        const timerNoDuration = new CountdownTimer(interval); // duración no especificada, por defecto 0
        timerNoDuration.onTimerStep = stepCallback;
        timerNoDuration.onTimerEnd = endCallback;
        timerNoDuration.start();
        tick(interval * 5); // Avanzar 5 intervalos
        expect(stepCallback.calls.count()).toBe(5); // Se llama 5 veces
        expect(endCallback).not.toHaveBeenCalled(); // Nunca se llama
        timerNoDuration.pause(); // Parar el intervalo para no dejarlo corriendo
    }));

    it('should behave as interval whith duration end condition', fakeAsync(() => {
        timer.start();
        tick(interval * 5); // Avanzar 5 intervalos
        expect(stepCallback.calls.count()).toBe(4); // Se llama 4 veces
        expect(endCallback).toHaveBeenCalled(); // Se llama al final
    }));

    it('resume should continue the countdown from where it was paused', fakeAsync(() => {
        timer.start();
        tick(interval * 2); // Avanzar 2 intervalos
        timer.pause();
        expect(pauseCallback).toHaveBeenCalled();
        timer.resume();
        tick(interval * 3);
        expect(stepCallback.calls.count()).toBe(4); // Se llama 4 veces
        expect(endCallback).toHaveBeenCalled(); // Se llama al final
    }));

    it('start should reset the countdown if it was already started', fakeAsync(() => {
        timer.start();
        tick(interval * 2); // Avanzar 2 intervalos
        timer.start(); // Reiniciar
        tick(interval * 5);
        expect(stepCallback.calls.count()).toBe(6); // Se llama 4 veces
        expect(endCallback).toHaveBeenCalled(); // Se llama al final
    }));

   
});