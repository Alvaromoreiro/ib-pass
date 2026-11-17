describe('low-coverage reusable component behaviors', function () {
    describe('content parser services', function () {
        var parser, preprocessor, $sce;

        beforeEach(function () {
            angular.mock.module('ib-content-parser-module');
            inject(function (_ContentParserUtilsService_, _ContentPreprocessorService_, _$sce_) {
                parser = _ContentParserUtilsService_;
                preprocessor = _ContentPreprocessorService_;
                $sce = _$sce_;
            });
        });

        it('classifies external, internal, and modal links', function () {
            expect(parser.isExternalLink({ href: 'https://example.test' })).toBe(true);
            expect(parser.isExternalLink({ href: '#section' })).toBe(false);
            expect(parser.isInternalLink({ href: '#section' })).toBe(true);
            expect(parser.isInternalLink({ href: '#' })).toBe(false);
            expect(parser.isModalLink({})).toBe(true);
            expect(parser.isModalLink({ href: 'https://example.test' })).toBe(false);
        });

        it('looks up modal content by code or returns the first item', function () {
            var info = [{ code: 'one' }, { code: 'two' }];

            expect(parser.searchModalContent(info, 'two')).toBe(info[1]);
            expect(parser.searchModalContent(info, 'unknown')).toEqual({});
            expect(parser.searchModalContent(info)).toBe(info[0]);
            expect(parser.searchModalContent()).toEqual({});
        });

        it('sanitizes link attributes and adds the content parser directive', function () {
            var result = preprocessor.processContent('<a href="#" target="_blank">text</a>', 'details');

            expect($sce.getTrustedHtml(result).replace(/\s+>/g, '>')).toBe('<a ib-link-content-parser data-content-info="details">text</a>');
        });
    });

    describe('simple controllers and models', function () {
        var $controller, flightNowModel, boardingCardsModel;

        beforeEach(function () {
            angular.mock.module(
                'ib-view-more-old-module',
                'ib-flight-now-module',
                'ib-boarding-cards-module',
                'ib-checkin-main-footer-module',
                'ib-dropdown-select-module'
            );
            inject(function (_$controller_, _FlightNowModel_, _BoardingsCardsModel_) {
                $controller = _$controller_;
                flightNowModel = _FlightNowModel_;
                boardingCardsModel = _BoardingsCardsModel_;
            });
        });

        it('toggles the view-more label and state', function () {
            var controller = $controller('ViewMoreOldController');

            expect(controller.text).toBe('IBCOSE_LEER_MAS');
            controller.changeText(false);
            expect(controller.text).toBe('IBCOSE_LEER_MENOS');
            expect(controller.a).toBe(true);
            controller.changeText(true);
            expect(controller.text).toBe('IBCOSE_LEER_MAS');
            expect(controller.a).toBe(false);
        });

        it('initializes flight-now model state', function () {
            flightNowModel.initializeModel();
            expect(flightNowModel.flightInfo).toEqual({});
            expect(flightNowModel.selectedTab).toBe(0);
        });

        it('initializes the boarding cards model service', function () {
            boardingCardsModel.initializeModel();
            expect(boardingCardsModel).toBeDefined();
        });

        it('sets the footer year from the current date', function () {
            var controller = $controller('IbCheckinMainFooterController');

            expect(controller.year).toBe(new Date().getFullYear());
        });

        it('selects the initial user and prevents the default click action', function () {
            var constructor;
            var users = [{ id: 1 }, { id: 2 }];
            var event = { preventDefault: jasmine.createSpy('preventDefault') };
            constructor = $controller('ibDropdownSelectController', {}, true);
            constructor.instance.users = users;
            var controller = constructor();

            expect(controller.selectedUsers).toBe(users[0]);
            controller.clickUsers(users[1], event);
            expect(controller.selectedUsers).toBe(users[1]);
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('flight-now tab slices controller', function () {
        var $controller, scope;

        beforeEach(function () {
            angular.mock.module('ib-tab-slices-fn-module');
            inject(function (_$controller_, $rootScope) {
                $controller = _$controller_;
                scope = $rootScope.$new();
                spyOn(scope, '$emit');
            });
        });

        it('sorts slices, toggles sort direction, and emits selected segments', function () {
            var controller;
            var model = { slices: [{ departureDateTime: '2024-02-01' }, { departureDateTime: '2024-01-01' }] };
            controller = $controller('TabSlicesFnController', { $scope: scope });

            controller.originDestinationModel = model;
            controller.$onInit();
            expect(controller.listFilters.length).toBe(4);
            expect(controller.originDestinationModel.slices[0].departureDateTime).toBe('2024-01-01');

            controller.activateFilter('departureDateTime');
            expect(controller.filterReverse).toBe(true);
            expect(controller.originDestinationModel.slices[0].departureDateTime).toBe('2024-02-01');

            controller.activateFilter('arrivalDateTime');
            expect(controller.filterReverse).toBe(false);
            controller.selectSegment(model.slices[0]);
            expect(scope.$emit).toHaveBeenCalledWith('selectSegment', model.slices[0]);
        });
    });

    describe('collapse details controller', function () {
        var $controller, scope, timeout, controller;

        beforeEach(function () {
            angular.mock.module('ib-collapse-details-module');
            inject(function (_$controller_, $rootScope, $timeout) {
                $controller = _$controller_;
                timeout = $timeout;
                scope = $rootScope.$new();
                spyOn(scope, '$emit');
                controller = $controller('CollapseDetailsController', { $scope: scope });
            });
        });

        it('updates labels, toggles state, and emits close when initially open', function () {
            controller.initCollapse('show', 'hide');
            expect(controller.text).toBe('show');
            controller.toggle();
            expect(controller.isCollapsed).toBe(true);
            expect(controller.text).toBe('hide');
            controller.toggle();
            expect(controller.text).toBe('show');
            scope.$broadcast('updateCollapseText', 'updated');
            expect(controller.closedText).toBe('updated');
            expect(controller.text).toBe('updated');
            controller.init = true;
            controller.closeContent();
            expect(scope.$emit).toHaveBeenCalledWith('closeContent');

            scope.$broadcast('initSeatCollapse');
            expect(controller.isCollapsed).toBe(true);
        });

        it('clicks the collapse control for a baggage wrapper', function () {
            var wrapper = document.createElement('div');
            var button = document.createElement('button');
            var target = document.createElement('span');
            wrapper.className = 'fc_ibe-baggages_item-wrapper';
            button.className = 'fc-collapse__more-details';
            wrapper.appendChild(button);
            button.appendChild(target);
            spyOn(button, 'click');

            controller.externalToggle({ target: target });
            timeout.flush();

            expect(button.click).toHaveBeenCalled();
        });
    });

    describe('focusin directive', function () {
        var directive, element;

        beforeEach(function () {
            angular.mock.module('ib-focusin');
            inject(function (focusinDirective) {
                directive = focusinDirective[0];
            });
            element = angular.element('<input>');
            directive.link({}, element, {});
        });

        it('toggles the focus class from pointer and keyboard events', function () {
            element.triggerHandler('keyup');
            expect(element.hasClass('focus')).toBe(true);
            element.triggerHandler('mousedown');
            expect(element.hasClass('focus')).toBe(false);
            element.triggerHandler('keyup');
            element.triggerHandler('focusout');
            expect(element.hasClass('focus')).toBe(false);
        });
    });

    describe('equal-height directive', function () {
        var directive, componentUtils, timeout, windowElement, element;

        beforeEach(function () {
            angular.mock.module('ib-equal-height-module', function ($provide) {
                componentUtils = { equalHeight: jasmine.createSpy('equalHeight') };
                $provide.value('ComponentUtils', componentUtils);
            });
            inject(function (equalHeightDirective, $timeout, $window) {
                directive = equalHeightDirective[0];
                timeout = $timeout;
                windowElement = angular.element($window);
            });
            element = angular.element('<div>');
        });

        it('uses immediate recalculation mode when requested and on resize', function () {
            directive.link({}, element, { equalHeightReload: 'true' });
            timeout.flush();
            expect(componentUtils.equalHeight).toHaveBeenCalledWith(element[0], true);
            windowElement.triggerHandler('resize');
            expect(componentUtils.equalHeight).toHaveBeenCalledTimes(2);
        });

        it('uses deferred recalculation mode without the reload attribute', function () {
            directive.link({}, element, {});
            timeout.flush();
            expect(componentUtils.equalHeight).toHaveBeenCalledWith(element[0]);
            windowElement.triggerHandler('resize');
            expect(componentUtils.equalHeight).toHaveBeenCalledWith(element[0]);
        });
    });

    describe('scroll directives', function () {
        var autoScrollDirective, headerResizeDirective, scope, windowElement, $window;

        beforeEach(function () {
            angular.mock.module('ib-scroll-module', 'ib-equal-height-module');
            inject(function (ibAutoScrollTopDirective, _headerResizeDirective_, $rootScope, _$window_) {
                autoScrollDirective = ibAutoScrollTopDirective[0];
                headerResizeDirective = _headerResizeDirective_[0];
                scope = $rootScope.$new();
                spyOn(scope, '$emit');
                $window = _$window_;
                windowElement = angular.element($window);
            });
        });

        it('scrolls the window to the element scroll position', function () {
            spyOn($window, 'scrollTo');

            autoScrollDirective.link({}, { scrollTop: 45 });
            expect($window.scrollTo).toHaveBeenCalledWith(0, 45);
        });

        it('emits a resize event when the browser window resizes', function () {
            headerResizeDirective.link(scope, angular.element('<div>'), {});
            windowElement.triggerHandler('resize');
            expect(scope.$emit).toHaveBeenCalledWith('headerResize', windowElement);
        });
    });

    describe('comment directive', function () {
        var directive, scope, element;

        beforeEach(function () {
            angular.mock.module('ib-comment-module');
            inject(function (ibCommentDirective, $rootScope) {
                directive = ibCommentDirective[0];
                scope = $rootScope.$new();
            });
            element = { replaceWith: jasmine.createSpy('replaceWith') };
        });

        it('replaces its comment after datalayer updates using the current scope value', function () {
            scope.label = 'updated';
            directive.link(scope, element, { ibComment: 'Hello {{label}}' });

            scope.$broadcast('updateDatalayer');
            expect(element.replaceWith).toHaveBeenCalledWith('<!-- Hello updated-->');
        });
    });

    describe('hover opacity directive', function () {
        var directive, timeout;

        beforeEach(function () {
            angular.mock.module('ib-hover-opacity-module');
            inject(function (ibHoverOpacityDirective, $timeout) {
                directive = ibHoverOpacityDirective[0];
                timeout = $timeout;
            });
        });

        it('highlights a hovered child and restores all child opacities on leave', function () {
            var host = document.createElement('div');
            var first = document.createElement('span');
            var second = document.createElement('span');
            host.appendChild(first);
            host.appendChild(second);

            directive.link({}, angular.element(host), {});
            timeout.flush();
            angular.element(first).triggerHandler('mouseover');
            expect(first.style.opacity).toBe('1');
            expect(second.style.opacity).toBe('0.4');
            angular.element(first).triggerHandler('mouseleave');
            expect(first.style.opacity).toBe('1');
            expect(second.style.opacity).toBe('1');
        });
    });

    describe('collapse directives', function () {
        var collapseDirective, closeContentDirective, scope, timeout, rootScope, q, animate;

        beforeEach(function () {
            animate = {
                addClass: jasmine.createSpy('addClass').and.callFake(function () { return q.when(); }),
                removeClass: jasmine.createSpy('removeClass')
            };
            angular.mock.module('ib-collapse', function ($provide) {
                $provide.value('$animate', animate);
            });
            inject(function (_collapseDirective_, collapseCloseContentDirective, $rootScope, $timeout, $q) {
                collapseDirective = _collapseDirective_[0];
                closeContentDirective = collapseCloseContentDirective[0];
                rootScope = $rootScope;
                scope = rootScope.$new();
                timeout = $timeout;
                q = $q;
            });
        });

        it('expands on an outside click and ignores a click inside the popup', function () {
            var host = document.createElement('div');
            var child = document.createElement('span');
            host.appendChild(child);
            scope.collapseCtrl = { isCollapsed: true };
            collapseDirective.link(scope, angular.element(host), { outSideClick: 'true' });
            angular.element(host).triggerHandler({ type: 'click', target: child });
            expect(scope.collapseCtrl.isCollapsed).toBe(true);
            angular.element(host).triggerHandler({ type: 'click', target: document.body });
            expect(scope.collapseCtrl.isCollapsed).toBe(false);
        });

        it('animates content closed after the close event', function () {
            closeContentDirective.link(scope, angular.element('<div>'), {});
            scope.$broadcast('closeContent');
            rootScope.$digest();
            timeout.flush();

            expect(animate.addClass).toHaveBeenCalledWith(jasmine.any(Object), 'fadeInDown');
            expect(animate.removeClass).toHaveBeenCalledWith(jasmine.any(Object), 'fadeInDown');
            expect(animate.addClass).toHaveBeenCalledWith(jasmine.any(Object), 'fadeOutDown');
        });
    });

    describe('height directives', function () {
        var directive, timeout;

        beforeEach(function () {
            angular.mock.module('ib-calculate-height-module', 'ib-affix-module');
            inject(function (ibCalculateHeightDirective, $timeout) {
                directive = ibCalculateHeightDirective[0];
                timeout = $timeout;
            });
        });

        describe('affix directive', function () {
            var directive, timeout;

            beforeEach(function () {
                inject(function (ibAffixDirective, $timeout) {
                    directive = ibAffixDirective[0];
                    timeout = $timeout;
                });
            });

            it('initializes sticky behavior and updates the node after reaching the bottom', function () {
                var node = document.createElement('div');
                var nodeElement = window.$(node);
                spyOn(window.$.fn, 'stick_in_parent').and.returnValue(nodeElement);

                directive.link({}, nodeElement, { ibAffix: 'sidebar' });
                nodeElement.triggerHandler('sticky_kit:bottom');
                expect(node.style.bottom).toBe('0px');
                nodeElement.triggerHandler('sticky_kit:unbottom');
                expect(node.style.bottom).toBe('auto');
                timeout.flush();
            });
        });

        it('sets the minimum child height to the tallest element', function () {
            var host = document.createElement('div');
            var first = document.createElement('span');
            var second = document.createElement('span');
            first.className = second.className = 'item';
            Object.defineProperty(first, 'clientHeight', { configurable: true, value: 35 });
            Object.defineProperty(second, 'clientHeight', { configurable: true, value: 64 });
            host.appendChild(first);
            host.appendChild(second);

            directive.link({}, angular.element(host), { selector: '.item' });
            timeout.flush();

            expect(first.style.minHeight).toBe('64px');
            expect(second.style.minHeight).toBe('64px');
        });
    });

    describe('boarding card check directive', function () {
        var directive, timeout, scope, windowElement, componentUtils;

        beforeEach(function () {
            componentUtils = { resizeHeightListElements: jasmine.createSpy('resizeHeightListElements') };
            angular.mock.module('ib-boarding-card-check-module', function ($provide) {
                $provide.value('ComponentUtils', componentUtils);
            });
            inject(function (ibBoardingCardCheckDirective, $timeout, $rootScope, $window) {
                directive = ibBoardingCardCheckDirective[0];
                timeout = $timeout;
                scope = $rootScope.$new();
                windowElement = angular.element($window);
            });
        });

        it('recalculates heights initially and unregisters resize handling on destroy', function () {
            directive.link(scope, angular.element('<div>'), {});
            timeout.flush();
            expect(componentUtils.resizeHeightListElements).toHaveBeenCalledWith('.ibe-boarding-card__custom-check');
            expect(componentUtils.resizeHeightListElements).toHaveBeenCalledWith('.paragraph__regular');
            componentUtils.resizeHeightListElements.calls.reset();
            scope.$destroy();
            windowElement.triggerHandler('resize');
            expect(componentUtils.resizeHeightListElements).not.toHaveBeenCalled();
        });
    });

    describe('ui selectize directive', function () {
        var directive, handler, componentUtils, host, dateParent, searchCollection;

        beforeEach(function () {
            dateParent = document.createElement('div');
            dateParent.className = 'ibe-form__date';
            searchCollection = {
                on: jasmine.createSpy('on').and.callFake(function (events, callback) {
                    handler = callback;
                })
            };
            host = document.createElement('div');
            host.querySelectorAll = jasmine.createSpy('querySelectorAll').and.returnValue(searchCollection);
            componentUtils = {
                get_parents: jasmine.createSpy('get_parents').and.returnValue(dateParent)
            };
            angular.mock.module('ib-ui-selectize-module', function ($provide) {
                $provide.value('ComponentUtils', componentUtils);
            });
            inject(function (ibUiSelectizeDirective) {
                directive = ibUiSelectizeDirective[0];
            });
        });

        it('adds and removes the date focus class on search input focus changes', function () {
            directive.link({}, host, {});
            handler({ type: 'focus' });
            expect(dateParent.classList.contains('ibe-form__date--focus')).toBe(true);
            handler({ type: 'focusout' });
            expect(dateParent.classList.contains('ibe-form__date--focus')).toBe(false);
        });
    });

    describe('cookies directive', function () {
        var directive, closeButton, banner;

        beforeEach(function () {
            closeButton = angular.element('<button>');
            var documentMock = { querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([closeButton[0]]) };
            banner = angular.element('<div>');
            document.body.appendChild(banner[0]);
            angular.mock.module('ib-cookies-module', function ($provide) {
                $provide.value('$document', documentMock);
            });
            inject(function (ibCookiesDirective) {
                directive = ibCookiesDirective[0];
            });
        });

        it('prevents the close link default action and removes the cookie banner', function () {
            directive.link({}, banner);
            var event = new Event('click', { bubbles: true, cancelable: true });
            spyOn(event, 'preventDefault').and.callThrough();
            closeButton[0].dispatchEvent(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(document.body.contains(banner[0])).toBe(false);
        });
    });

    describe('element scroll directive', function () {
        var directive, animate;

        beforeEach(function () {
            angular.mock.module('ib-element-scroll-module');
            inject(function (ibElementScrollDirective) {
                directive = ibElementScrollDirective[0];
            });
            animate = jasmine.createSpy('animate');
            spyOn(window.$.fn, 'animate').and.callFake(animate);
        });

        it('scrolls to the requested element when an id is provided', function () {
            var target = document.createElement('div');
            target.id = 'target';
            document.body.appendChild(target);

            var button = angular.element('<button>');
            directive.link({}, button, { ibElementScroll: 'target' });
            button.triggerHandler('click');

            expect(animate).toHaveBeenCalledWith(jasmine.objectContaining({ scrollTop: jasmine.any(Number) }));
            document.body.removeChild(target);
        });

        it('scrolls relative to the clicked element when attributes are absent', function () {
            var button = angular.element('<button>');
            document.body.appendChild(button[0]);
            directive.link({}, button, undefined);

            expect(animate).toHaveBeenCalledWith(jasmine.objectContaining({ scrollTop: jasmine.any(Number) }));
            document.body.removeChild(button[0]);
        });
    });

    describe('form scroll-to-error directive', function () {
        var directive, timeout;

        beforeEach(function () {
            angular.mock.module('ib-scroll-module');
            inject(function (ibFormScrollToErrorDirective, $timeout) {
                directive = ibFormScrollToErrorDirective[0];
                timeout = $timeout;
            });
            spyOn(window.$.fn, 'animate');
        });

        it('scrolls to the first invalid control after form submission', function () {
            var form = window.$('<form><input class="ng-invalid"></form>');
            document.body.appendChild(form[0]);

            directive.link({}, form, {});
            form.triggerHandler('submit');
            timeout.flush();

            expect(window.$.fn.animate).toHaveBeenCalledWith(jasmine.objectContaining({ scrollTop: jasmine.any(Number) }));
            document.body.removeChild(form[0]);
        });
    });
});
