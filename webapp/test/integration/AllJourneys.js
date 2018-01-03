jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 BolDocHdrS in the list
// * All 3 BolDocHdrS have at least one HdrToItms

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/spc/fiori/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/spc/fiori/test/integration/pages/App",
	"com/spc/fiori/test/integration/pages/Browser",
	"com/spc/fiori/test/integration/pages/Master",
	"com/spc/fiori/test/integration/pages/Detail",
	"com/spc/fiori/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.spc.fiori.view."
	});

	sap.ui.require([
		"com/spc/fiori/test/integration/MasterJourney",
		"com/spc/fiori/test/integration/NavigationJourney",
		"com/spc/fiori/test/integration/NotFoundJourney",
		"com/spc/fiori/test/integration/BusyJourney",
		"com/spc/fiori/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});