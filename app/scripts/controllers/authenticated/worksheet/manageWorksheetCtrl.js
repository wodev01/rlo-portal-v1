'use strict';

app.controller('manageWorksheetCtrl',
	function ($scope, toastr, worksheetServices) {

		$scope.worksheetDefinitions = {};
		$scope.updateWorksheet = {};
		$scope.isUpdateWorksheetInProgress = false;

		$scope.fnInitWorksheetDefinitions = function () {
			$scope.updateWorksheet = worksheetServices.getWorksheetObj();
			$scope.worksheetDefinitions = worksheetServices.getWorksheetDefinitionsObj();

			$scope.fnWorksheetFieldValAssign($scope.updateWorksheet, $scope.worksheetDefinitions);
		};

		$scope.fnUpdateWorksheet = function (data) {
			$scope.updateWorksheet.values = [];
			angular.forEach(data.categories, function (key) {
				angular.forEach(key.fields, function (key) {
					var fieldObj = {};
					fieldObj.field_definition_id = key.id;
					fieldObj.label = key.label;
					fieldObj.type = key.type;
					fieldObj.source = key.source;
					if (key.value) {
						fieldObj.value = key.value;
					}
					$scope.updateWorksheet.values.push(fieldObj);
				});
			});

			delete $scope.updateWorksheet.location_name;

			$scope.isUpdateWorksheetInProgress = true;
			worksheetServices.updateWorksheet($scope.updateWorksheet.id, $scope.updateWorksheet)
				.then(function () {
					$scope.isUpdateWorksheetInProgress = false;
					toastr.success('Worksheet updated successfully.');
				});
		};

		$scope.fnWorksheetFieldValAssign = function (worksheet, worksheetDef) {
			//if worksheet field have value
			if (worksheet.values.length > 0) {
				angular.forEach(worksheet.values, function (key) {
					var field_id = key.field_definition_id;
					var wFieldVal = key.value;
					var wFieldSource = key.source;
					//assign value to worksheet definition fields
					angular.forEach(worksheetDef.categories, function (key) {
						angular.forEach(key.fields, function (key) {
							if (key.id === field_id) {
								key.value = wFieldVal;
								key.source = wFieldSource;
							}
						});
					});
				});
			}
		};
	});