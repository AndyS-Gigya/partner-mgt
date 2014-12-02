'use strict';

// Partners controller
angular.module('partners').controller('PartnersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Partners', '$upload',
	function($scope, $stateParams, $location, Authentication, Partners, $upload) {
		$scope.authentication = Authentication;

		// Create new Partner
		$scope.create = function() {
			// Create new Partner object
			var partner = new Partners ({
				name: this.name,
				type: this.type
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

		$scope.$watch('logo', function() {
			var file = (file = $scope.logo) && file[0];
			if (!file) return;

			$scope.upload = $upload.upload({
				url: '/partners/' + $scope.partner._id + '/logo',
				method: 'PUT',
				file: file
			}).progress(function(evt) {
				console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% of '+ evt.config.file.name);
			}).success(function(data, status, headers, config) {
				$scope.partner = data;
			}).error(function(data, status, headers, config) {
				$scope.error = 'error on uploading file ' + config.file.name;
			});
		});
		

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