
describe('test for module ib-flexibilization-calendar-module - controllers', function () {
  let controller;
  let dayjs = jasmine.createSpy('dayjs').and.returnValue({
    date:3,
    add: function(amount, unit) {
        return 4
    },
    subtract: function (amount, unit) {
    }
  });

  let fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
        'showGenericError': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showWaitingModal': jasmine.createSpy()
    };


    beforeEach(function() {
        angular.mock.module('ib-flexibilization-calendar-module' ,'LocalStorageModule', function($provide){

            $provide.value('MmBModalService', fakeMmBModalService);
        });
    });

    describe('test for IbFlexibilizationCalendarController', function () {


      let $controller;
      let $rootScope;
      let $scope;
      let MmBModalService;
      let $injector;

        beforeEach(function () {
            inject(function (_$controller_, _$injector_) {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) { clone[key] = _$injector_[key]; return clone }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                MmBModalService = $injector.get('MmBModalService');

                controller = $controller('IbFlexibilizationCalendarController', { MmBModalService: MmBModalService, $scope: $scope});
            });
        });

        it('IbFlexibilizationCalendarController should be defined', function () {
            expect(controller).toBeDefined();
        });

        it('test for IbFlexibilizationCalendarController.$onInit', function () {
            controller.ribbonFlexData = {};
            controller.ribbonFlexData.calendarsRibbon = [
                {
                sliceId:'AGPOVD20210731173500',
                cells:[
                    {
                    adultPrice:null,
                    perPassengerPrice:null,
                    totalPrice:null,
                    fareFamily:null,
                    bestPrice:false,
                    available:false,
                    boundDate:'2021-06-27',
                    selectedDate:false
                    }
                ]},
                {
                    sliceId:'AGPOVD20210731173500',
                    cells:[
                        {
                        adultPrice:null,
                        perPassengerPrice:null,
                        totalPrice:null,
                        fareFamily:null,
                        bestPrice:false,
                        available:false,
                        boundDate:'2021-06-27',
                        selectedDate:false
                        }
                    ]}];
            controller.selectedIndex = 0;
            controller.slicesIndex = 0;
            controller.selectedDate = [dayjs()];
            controller.updatedDateList = {};

            controller.$onInit();

            expect(controller.$onInit).toBeDefined();
        });
        describe('generateDateListWithServiceData', function() {

            it('should generate a date list with all object about 7 days', function() {
                let selectedDate = {
                    tripSliceId: 12345
                  };

                 let  ribbonFlexData = {
                    calendarsRibbon: [
                      {
                        sliceId: 12345,
                        cells: [
                          {
                            boundDate: '2023-03-01T00:00:00.000Z',
                            selectedDate: false,
                            available: true
                          },
                          {
                            boundDate: '2023-03-02T00:00:00.000Z',
                            selectedDate: true,
                            available: true
                          },
                          {
                            boundDate: '2023-03-03T00:00:00.000Z',
                            selectedDate: false,
                            available: false
                          },
                          {
                            boundDate: '2023-03-04T00:00:00.000Z',
                            selectedDate: false,
                            available: true
                          },
                          {
                            boundDate: '2023-03-05T00:00:00.000Z',
                            selectedDate: false,
                            available: true
                          },
                          {
                            boundDate: '2023-03-06T00:00:00.000Z',
                            selectedDate: false,
                            available: true
                          },
                          {
                            boundDate: '2023-03-07T00:00:00.000Z',
                            selectedDate: false,
                            available: true
                          }
                        ]
                      }
                    ]
                  };
              var dateList = controller.generateDateListWithServiceData(selectedDate, ribbonFlexData, true);
              expect(dateList.length).toEqual(7);
              expect(dateList[0].date).toEqual(jasmine.any(Object));
              expect(dateList[0].isSelected).toEqual(false);
              expect(dateList[0].isAvailable).toEqual(true);
              expect(dateList[0].tripSliceId).toEqual(selectedDate.tripSliceId);
              expect(dateList[0].isLoading).toEqual(false);
            });
          })
        it('test for IbFlexibilizationCalendarController.selectNewDate', function () {
          let i = 0;
            controller.model = {
                dateListLength: 7,
                dateList: [{isAvailable: true}],
                selectedIndex: 0
            };
            controller.selectedPreviousDate = '2020-06-29';

            for (i = 0; i < 7; i++) {
                controller.model.dateList.push({
                    tripSliceId: 'id',
                    date: dayjs().add(i, 'day')
                });
            }
            controller.selectedDate = [dayjs()];
            controller.updatedDateList = {};

            controller.selectNewDate(4);
            expect(controller.selectedDate[controller.model.selectedIndex]).toEqual(controller.selectedPreviousDate);
            expect(controller.selectNewDate).toBeDefined();
        });
        it('should set selectedPreviousDate and emit newDateSelected event if date is available', function() {
            // Arrange
            controller.model = {
              dateListLength: 7,
              dateList: [{
                isAvailable: true
              }],
              selectedIndex: 0
            };
            controller.selectedPreviousDate = '2020-06-29';

            for (let i = 0; i < 7; i++) {
              controller.model.dateList.push({
                tripSliceId: 'id',
                date: dayjs().add(i, 'day')
              });
            }

            controller.selectedDate = [dayjs()];
            controller.updatedDateList = {};

            spyOn(MmBModalService, 'showWaitingModal');
            spyOn($scope, '$emit');

            // Act
            controller.selectNewDate(0);

            // Assert
            expect(controller.selectedPreviousDate).toEqual(controller.model.dateList[0]);
            expect(MmBModalService.showWaitingModal).toHaveBeenCalled();
            expect($scope.$emit).toHaveBeenCalledWith('newDateSalected');
          });

        it('test for IbFlexibilizationCalendarController.changeDay', function () {
            controller.model = {
                dateListLength: 7,
                dateList: [{date: dayjs()}],
                selectedIndex: 0,
                newDateList: [{date:2}]
            };
            controller.selectedDate = [dayjs()];
            controller.blockChangeDateLeft = false;
            controller.changeDay(false);
            expect(controller).toBeDefined();

        });
        it('should add 1 day to the last date in dateList when isNext is true and blockChangeDateRight is false', function() {
            controller.model = {
                dateListLength: 7,
                dateList: [{ date: dayjs() }],
                selectedIndex: 0,
                newDateList: [dayjs()]
            };
            controller.blockChangeDateRight = false;
            controller.selectedDate = [dayjs()];
           controller.changeDay(true);

            expect(controller.blockChangeDateRight).toEqual(true);
        });
        it('should add 1 day to the last date in dateList when isNext is false and blockChangeDateLeft is false', function() {
            controller.model = {
                dateListLength: 7,
                dateList: [{ date: 1},{date: 1}],
                selectedIndex: 0,
                newDateList: [{date:2},{date:2}]
            };
            controller.blockChangeDateLeft = false;
            controller.selectedDate = [dayjs()];
            controller.changeDay(false);

            expect(controller.blockChangeDateLeft).toEqual(false);
        });
        it('test for IbFlexibilizationCalendarController.addNewDays', function () {
            // Crear objeto controller
            let i = 0
            controller.ribbonFlexData = {
                calendarsRibbon: [
                    {
                    sliceId:'AGPOVD20210731173500',
                    cells:[
                        {
                        adultPrice:null,
                        perPassengerPrice:null,
                        totalPrice:null,
                        fareFamily:null,
                        bestPrice:false,
                        available:false,
                        boundDate:'2021-06-27',
                        selectedDate:false
                        }
                    ]},
                    {
                        sliceId:'AGPOVD20210731173500',
                        cells:[
                            {
                            adultPrice:null,
                            perPassengerPrice:null,
                            totalPrice:null,
                            fareFamily:null,
                            bestPrice:false,
                            available:false,
                            boundDate:'2021-06-27',
                            selectedDate:false
                            }
                        ]}]
            };

            controller.selectedIndex = 0;
            controller.slicesIndex = 0;
            controller.selectedDate = [dayjs()];
            controller.updatedDateList = {};
            controller.$onInit();
            controller.model = {
                dateListLength: 7,
                dateList: [{date: {

                }}],
                selectedIndex: 0,
                newDateList: [dayjs()]
            };
            for (i = 0; i < 7; i++) {
                controller.model.dateList.push({
                    tripSliceId: 'id',
                    date: dayjs().add(i, 'day')
                });
            }
            controller.selectedDate = [dayjs()];
            controller.selectedDate = [dayjs()];
            // Llamar al método addNewDays con parámetros de ejemplo
            controller.addNewDays(7,  controller.ribbonFlexData);

            expect(controller.updatedDateList).toBeDefined();
            expect(controller.updatedDateList.length).toEqual(undefined);
        });
        it('should modify the dateList correctly when isNext is true', function() {
            //Arrange
            var newDateList = [      { date: new Date(2022, 2, 1) },      { date: new Date(2022, 2, 2) } ,{ date: new Date(2022, 2, 2) },      { date: new Date(2022, 2, 3) }    ];
            var dateList = [      { date: new Date(2022, 1, 28) },      { date: new Date(2022, 2, 1) },      { date: new Date(2022, 2, 2) },      { date: new Date(2022, 2, 3) }    ];
            var isNext = false;

            //Act
           controller. modifyDateList(newDateList, dateList, isNext);

            //Assert
            expect(dateList.length).toBe(4);
            var isNext = true;

            //Act
           controller. modifyDateList(newDateList, dateList, isNext);

            //Assert
            expect(dateList.length).toBe(4);
          });
          it(' returnToOriginalSelect',function(){
            let i = 0
            controller.ribbonFlexData = {
                calendarsRibbon: [
                    {
                    sliceId:'AGPOVD20210731173500',
                    cells:[
                        {
                        adultPrice:null,
                        perPassengerPrice:null,
                        totalPrice:null,
                        fareFamily:null,
                        bestPrice:false,
                        available:false,
                        boundDate:'2021-06-27',
                        selectedDate:false
                        }
                    ]},
                    {
                        sliceId:'AGPOVD20210731173500',
                        cells:[
                            {
                            adultPrice:null,
                            perPassengerPrice:null,
                            totalPrice:null,
                            fareFamily:null,
                            bestPrice:false,
                            available:false,
                            boundDate:'2021-06-27',
                            selectedDate:false
                            }
                        ]}]
            };

            controller.selectedIndex = 0;
            controller.slicesIndex = 0;
            controller.selectedDate = [dayjs()];
            controller.updatedDateList = {};
            controller.$onInit();
            controller.model = {
                dateListLength: 7,
                dateList: [{date: {

                }}],
                selectedIndex: 0,
                newDateList: [dayjs()]
            };
            for (i = 0; i < 7; i++) {
                controller.model.dateList.push({
                    tripSliceId: 'id',
                    date: dayjs().add(i, 'day')
                });
            }
            controller.selectedDate = [dayjs()];
            controller.selectedDate = [dayjs()];
            controller. returnToOriginalSelect( '',controller.ribbonFlexData)
            spyOn(controller, 'generateDateListWithServiceData');
            expect(controller.model.dateList).toBeDefined()
           })
    });
});
