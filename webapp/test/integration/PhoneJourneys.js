jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"com/spc/fiori/test/integration/NavigationJourneyPhone",
		"com/spc/fiori/test/integration/NotFoundJourneyPhone",
		"com/spc/fiori/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});