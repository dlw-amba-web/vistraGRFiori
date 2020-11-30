/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"delaware/scpupload/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});