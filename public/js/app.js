var eveapiModule = angular.module('eveapi', ['ngResource']);



eveapiModule.factory('Character', ['$resource',
  function($resource){
    return $resource('/eve/user/', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
}]);

eveapiModule.factory('Contacts', ['$resource',
  function($resource){
    return $resource('/eve/contacts', {}, {
      query: {method:'GET', params:{charid: $resource.charid}, isArray:false}
    });
}]);

eveapiModule.factory('Netvalue', ['$resource',
  function($resource){
    return $resource('/eve/netvalue', {}, {
      query: {method:'GET', params:{charid: $resource.charid}, isArray:false}
    });
}]);

eveapiModule.controller('AppController', ['$scope', function($scope){
}]);

eveapiModule.controller('CharacterController', ['$scope', 'Character', function($scope, Character){
  $scope.character = Character.query(function(){
  });
}]);

eveapiModule.controller('NetvalueController', ['$scope', 'Netvalue', function($scope, Netvalue){
  $scope.$parent.$watch('character.CharacterID', function(charid){
    $scope.netvalue = Netvalue.query({charid: charid }).$promise.then(function(v, value){
      $scope.value = v.networth.toLocaleString();
    });
  });
}]);

eveapiModule.controller('ContactsController', ['$scope', 'Contacts', function($scope, Contacts){
  $scope.$parent.$watch('character.CharacterID', function(charid){
    $scope.contacts = Contacts.query({charid: charid });
  });
}]);
