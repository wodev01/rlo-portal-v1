'use strict';
app.controller('worksheetCtrl',
	function ($scope, $http, $timeout, $mdSidenav, toastr, $log, $rootScope, $cookies, $state, $mdDialog, $filter, worksheetServices) {

		$scope.rightView = 'views/authenticated/worksheet/newWorksheet.html';
		var currentMonthFirstDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		var currentMonthLastDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

		$scope.isProcessing = false;

		/*---------------- create new worksheet new ------------------*/
		function parseDateFormat(date) {
			return $filter('date')(date, 'yyyy-MM-dd');
		}

		$scope.newWorksheet = {
			'definition_id': 1,
			'definition_name': 'Composite Worksheet',
			'version': 2,
			'partner_id': CarglyPartner.user.partnerId,
			'location_id': '',
			'period_start': '',
			'period_end': '',
			'values': []
		};

		$scope.locations = [{id: '', name: '-- select location --'}];
		// Locations
		$scope.fetchLocations = function () {
			var subscriptionsArr = typeof CarglyPartner.user.subscriptions === 'string' ? JSON.parse(CarglyPartner.user.subscriptions) : [];
			angular.forEach(subscriptionsArr, function (obj) {
				angular.forEach(obj.subscriptions, function (value) {
					if (value === 'rlo_standard') {
						$scope.locations.push(obj);
					}
				});
			});
		};

		$scope.fetchLocations();

		$scope.fnNewWorksheet = function () {
			$scope.newWorksheet.period_start = parseDateFormat(currentMonthFirstDate);
			$scope.newWorksheet.period_end = parseDateFormat(currentMonthLastDate);
			$scope.openSwapForNewWorksheet();
		};

		//Swapping view open function for newWorksheet
		$scope.openSwapForNewWorksheet = function () {
			setTimeout(function () {
				$scope.rightView = '';
				$scope.$apply();
				$scope.rightView = 'views/authenticated/worksheet/newWorksheet.html';
				$scope.$apply();
				$mdSidenav('right').open()
					.then(function () {
					});
			});
		};

		//Swapping view close function
		$scope.closeSwap = function () {
			$mdSidenav('right').close()
				.then(function () {
				});
		};

		$scope.fnCreateWorksheet = function (newWorksheet) {
			if (newWorksheet.location_id === '') {
				toastr.error('Please select location.');
			} else {
				$scope.isProcessing = true;
				worksheetServices.createWorksheet(newWorksheet).then(function () {
					toastr.success('Worksheet successfully created.');
					$scope.getPagedDataAsync($scope.worksheetPagingOptions.pageSize, $scope.worksheetPagingOptions.currentPage);
					$scope.isProcessing = false;
				});
			}
		};

		/*---- Date picker Dialog-------*/
		$scope.openDatePicker = function (ev, newWorksheet, dateField) {

			var DatePickerDialogController = ['$scope', '$mdDialog', function ($scope, $mdDialog) {
				if (dateField === 'period_start') {
					if (newWorksheet.period_start) {
						$scope.dateValue = newWorksheet.period_start;
					}
				} else if (dateField === 'period_end') {
					if (newWorksheet.period_end) {
						$scope.dateValue = newWorksheet.period_end;
					}
				}

				$scope.fnSave = function (val) {
					if (dateField === 'period_start') {
						newWorksheet.period_start = parseDateFormat(val);
					} else if (dateField === 'period_end') {
						newWorksheet.period_end = parseDateFormat(val);
					}
					$scope.hide();
				};

				$scope.fnCancel = function () {
					$scope.hide();
				};

				$scope.hide = function () {
					$mdDialog.hide();
				};
			}];

			$mdDialog.show({
				controller: DatePickerDialogController,
				templateUrl: 'views/authenticated/worksheet/datePickerDialog.html',
				targetEvent: ev
			});
		};

		/*---------- End of new worksheet -----------*/

		/* ----- worksheet grid start --------*/
		$scope.worksheetFilterOptions = {
			filterText: '',
			useExternalFilter: false
		};

		$scope.worksheetTotalServerItems = 0;
		$scope.worksheetPagingOptions = {
			pageSizes: [5, 10, 25, 50],
			pageSize: 10,
			currentPage: 1
		};

		$scope.setPagingData = function (data, page, pageSize) {
			var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
			$scope.worksheetData = pagedData;
			$scope.worksheetTotalServerItems = data.length;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};
		$scope.isWorksheetData = false;
		$scope.getPagedDataAsync = function (pageSize, page, searchText) {
			setTimeout(function () {
				if (searchText) {
					//search filter
				} else {
					worksheetServices.fetchWorksheet().then(function (data) {
						angular.forEach(data, function (key) {
							var loc_id = key.location_id;
							var worksheet_key = key;
							angular.forEach($scope.locations, function (key) {
								if (loc_id === key.id) {
									worksheet_key.location_name = key.name;
								}
							});
						});
						if (data.length !== 0) {
							$scope.isWorksheetData = true;
							$scope.setPagingData(data, page, pageSize);
						} else {
							$scope.isWorksheetData = false;
							$scope.isWorksheetMsgShow = true;
						}
					});
				}
			}, 100);
		};

		$scope.getPagedDataAsync($scope.worksheetPagingOptions.pageSize, $scope.worksheetPagingOptions.currentPage);

		$scope.$watch('worksheetPagingOptions', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
					$scope.worksheetPagingOptions.currentPage = 1;
				} else {
					$scope.getPagedDataAsync($scope.worksheetPagingOptions.pageSize, $scope.worksheetPagingOptions.currentPage, $scope.worksheetFilterOptions.filterText);
				}
			}
		}, true);

		$scope.$watch('filterOptions', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.getPagedDataAsync($scope.worksheetPagingOptions.pageSize, $scope.worksheetPagingOptions.currentPage, $scope.worksheetFilterOptions.filterText);
			}
		}, true);

		$scope.worksheetAction = '<div layout="row">' +
			'<md-button class="md-icon-button md-primary" aria-label="open" ng-click="grid.appScope.openWorksheet(row,$event)">' +
			'<md-icon md-font-set="fa fa-lg fa-fw fa-eye"></md-icon>' +
			'<md-tooltip ng-if="$root.isMobile === null" md-direction="top">Open</md-tooltip></md-button>' +
			'<md-button class="md-icon-button md-warn" aria-label="remove" ng-click="grid.appScope.fnWorksheetDelete(row,$event)">' +
			'<md-icon md-font-set="fa fa-lg fa-fw fa-trash"></md-icon>' +
			'<md-tooltip ng-if="$root.isMobile === null" md-direction="top">Remove</md-tooltip></md-button>' +
			'</div>';
		$scope.worksheetGridOptions = {
			data: 'worksheetData',
			enablePaginationControls: true,
			filterOptions: $scope.worksheetFilterOptions,
			rowHeight: 50,
			multiSelect: false,
			enableRowSelection: true,
			enableRowHeaderSelection: false,
			paginationPageSizes: [5, 10, 25, 50],
			paginationPageSize: 10,
			enableVerticalScrollbar: 0,
			enableFiltering: true,
			columnDefs: [
				{
					field: 'period_start',
					displayName: 'Month And Year',
					minWidth: 100,
					cellFilter: 'date:\'MM-yyyy\'',
					enableHiding: false
				},
				{field: 'location_name', displayName: 'Location', minWidth: 100, enableHiding: false},
				{field: 'status', displayName: 'Status', minWidth: 100, enableHiding: false},
				/*{field: 'reviewed_by', displayName: 'Reviewed By',minWidth:100, enableHiding: false},*/
				{
					name: 'action',
					displayName: '',
					cellTemplate: $scope.worksheetAction,
					width: 100,
					enableSorting: false,
					enableColumnMenu: false,
					enableFiltering: false
				}
			]
		};

		$scope.fnWorksheetDelete = function (row, event) {
			var confirm = $mdDialog.confirm()
				.title('Delete')
				.content('Would you like to delete this worksheet?')
				.ariaLabel('Delete')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event);
			$mdDialog.show(confirm).then(function () {
				worksheetServices.deleteWorksheet(row.entity.id).then(function () {
					$scope.getPagedDataAsync($scope.worksheetPagingOptions.pageSize, $scope.worksheetPagingOptions.currentPage);
				});
			}, function () {

			});
		};
		/* ----- worksheet grid end --------*/

		/*------- Manage Worksheet start----------------*/
		$scope.manageWorksheetView = 'views/authenticated/worksheet/manageWorksheet.html';
		$scope.isWorksheetDefinition = false;
		$scope.openWorksheet = function (row, event) {
			$scope.openSwapForManageWorksheet(row, event);
		};
		//Swapping view open function for manageWorksheet
		$scope.openSwapForManageWorksheet = function (row) {
			$scope.isWorksheetDefinition = false;
			setTimeout(function () {
				$scope.manageWorksheetView = '';
				$scope.$apply();
				$scope.manageWorksheetView = 'views/authenticated/worksheet/manageWorksheet.html';
				$scope.$apply();
				$mdSidenav('manageWorksheetView').open()
					.then(function () {
						worksheetServices.setWorksheetObj(row.entity);
						worksheetServices.fetchOneWorksheetDefinitions(row.entity.definition_id).then(function (res) {
							worksheetServices.setWorksheetDefinitionsObj(res);
							$scope.worksheetDefinitionName = res.name;
							$scope.isWorksheetDefinition = true;
						});
					});
			});
		};

		//Swapping view close function for manageWorksheet
		$scope.closeSwapForManageWorksheet = function () {
			$mdSidenav('manageWorksheetView').close()
				.then(function () {
				});
		};
		/*--------------- Manage Worksheet End ----------------------*/
	});