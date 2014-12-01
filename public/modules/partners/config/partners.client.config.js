'use strict';

// Configuring the Articles module
angular.module('partners').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Partners', 'partners', 'dropdown', '/partners(/create)?');
		Menus.addSubMenuItem('topbar', 'partners', 'List Partners', 'partners');
		Menus.addSubMenuItem('topbar', 'partners', 'New Partner', 'partners/create');
	}
]);