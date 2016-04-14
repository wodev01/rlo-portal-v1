'use strict';
app.factory('worksheetServices',['$q', '$rootScope','localStorage',
    function($q, $rootScope, localStorage) {
        var worksheetServices = {};

        var userObj = JSON.parse(localStorage.getItem('userObj'));
        var pId = userObj.partnerId;

        /*------------------------ Worksheet API call ----------------------------*/

        //Get all worksheet data
        worksheetServices.fetchWorksheet = function(){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheets',
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get one worksheet data
        worksheetServices.fetchOneWorksheet = function(worksheetId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheets/'+worksheetId,
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //save or create worksheet
        worksheetServices.createWorksheet = function(newWorksheet){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheets',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(newWorksheet),
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //update worksheet
        worksheetServices.updateWorksheet = function(worksheetId,updateWorksheet){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheets/'+worksheetId,
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(updateWorksheet),
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //delete worksheet
        worksheetServices.deleteWorksheet = function(worksheetId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheets/'+worksheetId,
                type: 'DELETE',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    $rootScope.fnCheckStatus(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        /*-------------------- Worksheet Definition API Call ---------------------*/

        //Get all worksheet-definitions data
        worksheetServices.fetchWorksheetDefinitions = function(){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-definitions',
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //Get one worksheet-definitions data
        worksheetServices.fetchOneWorksheetDefinitions = function(definitionId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-definitions/'+definitionId,
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //save or create worksheet-definitions
        worksheetServices.createWorksheetDefinitions = function(newWorksheetDefinitions){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-definitions',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(newWorksheetDefinitions),
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //update worksheet-definitions
        worksheetServices.updateWorksheetDefinitions = function(definitionId, updateWorksheetDefinitions){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-definitions/'+definitionId,
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(updateWorksheetDefinitions),
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //delete worksheet-definitions
        worksheetServices.deleteWorksheetDefinitions = function(definitionId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-definitions/'+definitionId,
                type: 'DELETE',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        /*-------------------- Worksheet Field Definition API Call ---------------------*/

        //Get all worksheet-field-definitions data
        worksheetServices.fetchWorksheetFieldDefinitions = function(){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-field-definitions',
                type: 'GET',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //save or create worksheet-field-definitions
        worksheetServices.createWorksheetFieldDefinitions = function(newWorksheetFieldDefinitions){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-field-definitions',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(newWorksheetFieldDefinitions),
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        //delete worksheet-field-definitions
        worksheetServices.deleteWorksheetFieldDefinitions = function(definitionId){
            var defer = $q.defer();
            CarglyPartner.ajax({
                url: '/partners/api/'+pId+'/worksheet-field-definitions/'+definitionId,
                type: 'DELETE',
                success: function (data) {
                    defer.resolve(data);
                },
                error:function(error) {
                    ErrorMsg.CheckStatusCode(error.status);
                    defer.resolve(error);
                }
            });
            return defer.promise;
        };

        /*--------------- Getter and Setter Method ----------------*/
        var worksheetDefinitionsObj = {}, worksheetObj = {};
        worksheetServices.setWorksheetObj = function(newObj){
            worksheetObj = newObj;
        };
        worksheetServices.getWorksheetObj = function(){
            return worksheetObj;
        };

        worksheetServices.setWorksheetDefinitionsObj = function(newObj){
            worksheetDefinitionsObj = newObj;
        };
        worksheetServices.getWorksheetDefinitionsObj = function(){
            return worksheetDefinitionsObj;
        };
        return worksheetServices;
    }
]);
