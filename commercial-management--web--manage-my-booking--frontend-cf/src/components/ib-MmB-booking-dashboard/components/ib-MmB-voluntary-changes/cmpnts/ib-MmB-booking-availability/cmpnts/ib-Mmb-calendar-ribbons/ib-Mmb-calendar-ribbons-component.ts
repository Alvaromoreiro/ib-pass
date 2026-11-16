@Component(
    'ib-Mmb-calendar-ribbons-module',
    'ibMmbCalendarRibbons',
    {
        controllerAs: 'calendarRibbonCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-Mmb-calendar-ribbons-view.html';
        }],
        bindings: {
            calendarData: '<',
            index: '<',
            selectedCarousel: '<',
            id: '<'
        }
    },
    ['$scope', '$timeout', '$rootScope'],
[])
export class ibMmbCalendarRibbons {

    calendarData;
    index;
    selectedCarousel;
    id;
    SLIDES_TO_SHOW: number = 7;
    SLIDES_TO_SCROLL: number = 1;
    animationRunning: boolean;
    loadingData: boolean;
    currentSlides;
    carouselOptions;
    initialSlideIndex;
    currentSelectedSlide;

    constructor(
        private $scope,
        private $timeout,
        private $rootScope) {
            this.$scope.$on('changeNextSlide', this.nextSlide);
            this.$scope.$on('changePreviousSlide', this.previousSlide);
            this.$scope.$on('setSlide', this.setSlide);
            this.$scope.$on('nextSlickAnimationEnds', this.nextSlickAnimationEnds);
            this.$scope.$on('previousSlickAnimationEnds', this.previousSlickAnimationEnds);
            this.$scope.$on('finishLoadingSlides', this.finishLoadingSlides);
            this.$scope.$on('disableButtonSlides', this.disableButtonSlides);
            this.$scope.$on('changeCurrentSelectedIndex', this.resetCalendarData);
        }

    $onInit = (): void => {
        let i, shownSlidesLength;
        this.animationRunning = false;
        this.loadingData = false;
        if (this.calendarData) {
            this.currentSlides = this.calendarData.currentSlides;
            this.initialSlideIndex = Math.max(0, this.calendarData.currentInitialSlide - Math.floor(this.SLIDES_TO_SHOW / 2));
            shownSlidesLength = Math.min(this.initialSlideIndex + this.SLIDES_TO_SHOW, this.calendarData.slides.length);
            if (!this.currentSlides.length) {
                for (i = this.initialSlideIndex; i < shownSlidesLength; i++) {
                    this.currentSlides.push(this.calendarData.slides[i]);
                }
            }
            this.carouselOptions = {};
        }
    }

    /**
     * Emits a 'slideSelected' event with the selected slide Information and the origin destination index
     * @param {Object} slide the selected Slide information
     * @param {BOOL} isReturn Type of flight to search (Flight out or flight back)
     */
    searchSlideAvailability = (slide) => {
        var prevSlide = this.calendarData.slides[this.calendarData.selectedSlide];
        var offsetSlides = this.calendarData.currentInitialSlide - slide.slidePosition;
        var isNext = offsetSlides < 0;
        if (!this.animationRunning && !this.loadingData) {
            this.animationRunning = true;
            this.disableButtonSlides();
            this.loadingData = true;
            if (isNext) {
                this.addNextCalendarSlides(Math.abs(offsetSlides));
            } else {
                this.addPreviousCalendarSlides(Math.abs(offsetSlides));
            }
            this.calendarData.selectedSlide = slide.slidePosition;
            this.currentSelectedSlide = slide;
            this.$scope.$broadcast('slickSlideSelected', Math.abs(offsetSlides), isNext);
            this.loadingData = false;
            this.finishLoadingSlides();
            this.$scope.$emit('slideSelected', slide, this.index, prevSlide);
        }
        this.$rootScope.$broadcast('cleanSortedSelection');
    }

    setSlide = (event, data): void => {
        const slide = data.slide;
        const index = data.index;
        const offsetSlides = this.calendarData.currentInitialSlide - slide?.slidePosition;
        const isNext = offsetSlides < 0;
        if(this.id === index && slide){
            event.preventDefault();
            if (!this.animationRunning && !this.loadingData) {
                this.animationRunning = true;
                this.disableButtonSlides();
                this.loadingData = true;
                if (isNext) {
                    this.addNextCalendarSlides(Math.abs(offsetSlides));
                } else {
                    this.addPreviousCalendarSlides(Math.abs(offsetSlides));
                }
                this.calendarData.selectedSlide = slide.slidePosition;
                this.currentSelectedSlide = slide;
                this.$scope.$broadcast('slickSlideSelected', Math.abs(offsetSlides), isNext);
                this.loadingData = false;
                this.finishLoadingSlides();
                this.$scope.$emit('slideSelected', slide, this.index);
            }
            this.$rootScope.$broadcast('cleanSortedSelection');
        }
    }

    nextSlide = (event, throwEvent): void => {
        if (!this.animationRunning) {
            this.initialSlideIndex = Math.max(0, this.calendarData.currentInitialSlide - 3);
            this.addNextCalendarSlides(this.SLIDES_TO_SCROLL);
            this.$scope.$emit('nextSlideDate', true);
            if (throwEvent) {
                this.$timeout(() => {
                    this.$scope.$broadcast('slickNextElement');
                });
            }
            this.animationRunning = true;
        }
    }

    previousSlide = (event, throwEvent): void => {
        if (!this.animationRunning) {
            this.initialSlideIndex = Math.max(0, this.calendarData.currentInitialSlide - 3);
            this.addPreviousCalendarSlides(this.SLIDES_TO_SCROLL);
            this.$scope.$emit('nextSlideDate', false);
            if (throwEvent) {
                this.$timeout(() => {
                    this.$scope.$broadcast('slickPreviousElement');
                });
            }
            this.animationRunning = true;
        }
    }

    nextSlickAnimationEnds = (event, eventData): void => {
        this.removeNextCalendarSlides(eventData);
        this.animationRunning = false;
        this.$scope.$apply();
    }

    previousSlickAnimationEnds = (event, eventData): void => {
        this.removePreviousCalendarSlides(eventData);
        this.animationRunning = false;
        this.$scope.$apply();
    }

    addNextCalendarSlides = (quantity): void => {
        quantity = quantity < 0 ? 0 : quantity;
        for (let i = 0; i < quantity; i++) {
            this.currentSlides.push(this.calendarData.slides[this.initialSlideIndex + this.SLIDES_TO_SHOW]);
            this.initialSlideIndex++;
        }
        for (let k = 0; k < this.calendarData.slides.length; k++) {
            for (let j = 0; j < this.currentSlides.length; j++) {
                if (this.calendarData.slides[k].serviceDate === this.currentSlides[j].serviceDate) {
                    this.currentSlides[j].slidePosition = this.calendarData.slides[k].slidePosition;
                    this.currentSlides[j].state = this.calendarData.slides[k].state;
                }
            }
        }
        this.calendarData.currentInitialSlide = this.initialSlideIndex + 3;
    }

    addPreviousCalendarSlides = (quantity): void => {
        quantity = quantity < 0 ? 0 : quantity;
        for (let i = 0; i < quantity; i++) {
            this.currentSlides.unshift(this.calendarData.slides[this.initialSlideIndex - 1]);
            this.initialSlideIndex--;
        }
        for (let k = 0; k < this.calendarData.slides.length; k++) {
            for (let j = 0; j < this.currentSlides.length; j++) {
                if (this.calendarData.slides[k].serviceDate === this.currentSlides[j].serviceDate) {
                    this.currentSlides[j].slidePosition = this.calendarData.slides[k].slidePosition;
                    this.currentSlides[j].state = this.calendarData.slides[k].state;
                }
            }
        }
        this.calendarData.currentInitialSlide = this.initialSlideIndex + 3;
    }

    removeNextCalendarSlides = (quantity): void => {
        quantity = quantity < 0 ? 0 : quantity;
        for (let i = 0; i < quantity; i++) {
            if(this.currentSlides.length > this.SLIDES_TO_SHOW) {
                this.currentSlides.shift();
            }
        }
        this.calendarData.currentSlides = this.currentSlides;
    }

    removePreviousCalendarSlides = (quantity): void => {
        quantity = quantity < 0 ? 0 : quantity;
        for (let i = 0; i < quantity; i++) {
            if(this.currentSlides.length > this.SLIDES_TO_SHOW) {
                this.currentSlides.pop();
            }
        }
        this.calendarData.currentSlides = this.currentSlides;
    }

    finishLoadingSlides = (): void => {
        this.loadingData = false;
        this.carouselOptions.prevButtonDisabled = false;
        this.carouselOptions.nextButtonDisabled = false;
    }

    disableButtonSlides = (): void => {
        this.carouselOptions.prevButtonDisabled = true;
        this.carouselOptions.nextButtonDisabled = true;
    }

    resetCalendarData = (event, index): void => {
        if (this.index === index) {
            this.$onInit();
        }
    }
}