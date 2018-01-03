sap.ui.define([
		"com/spc/fiori/model/GroupSortState",
		"sap/ui/model/json/JSONModel"
	], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("Grt").length, 1, "The sorting by Grt returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("Vssl").length, 1, "The sorting by Vssl returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("Grt").length, 1, "The group by Grt returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to Grt if the user groupes by Grt", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("Grt");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "Grt", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by Vssl and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "Grt");

		this.oGroupSortState.sort("Vssl");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});