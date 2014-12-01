'use strict';

// Partners controller
angular.module('partners').controller('PartnersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Partners',
	function($scope, $stateParams, $location, Authentication, Partners) {
		$scope.authentication = Authentication;

		// Create new Partner
		$scope.create = function() {
			// Create new Partner object
			var partner = new Partners ({
				name: this.name
			});

			// Redirect after save
			partner.$save(function(response) {
				$location.path('partners/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Partner
		$scope.remove = function(partner) {
			if ( partner ) { 
				partner.$remove();

				for (var i in $scope.partners) {
					if ($scope.partners [i] === partner) {
						$scope.partners.splice(i, 1);
					}
				}
			} else {
				$scope.partner.$remove(function() {
					$location.path('partners');
				});
			}
		};

		// Update existing Partner
		$scope.update = function() {
			var partner = $scope.partner;

			partner.$update(function() {
				$location.path('partners/' + partner._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Partners
		$scope.find = function() {
			$scope.partners = Partners.query();
		};

		// Find existing Partner
		$scope.findOne = function() {
			$scope.partner = Partners.get({ 
				partnerId: $stateParams.partnerId
			});
		};
	}
]);