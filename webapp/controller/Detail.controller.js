sap.ui.define([
	"delaware/scpupload/controller/BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("delaware.scpupload.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf delaware.scpupload.view.Detail
		 */
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("UploadDetails").attachPatternMatched(this._onDetailMatched, this);
		},
		
		/**
		 * Before the SmartTable rebinds, we want to set a filter
		 * so data is being fetch for the UploadId selected in the
		 * overview.
		 *
		 * @public
		 * @param {object} oEvent event which triggered the rebind
		 */
		onBeforeRebindTable: function(oEvent) {
			var oBinding = oEvent.getParameter("bindingParams"),
				oFilter = new sap.ui.model.Filter("UploadId", sap.ui.model.FilterOperator.EQ, this._sUploadId);
	    	oBinding.filters.push(oFilter);
		},
		
		/**
		 * Handles the back button click.
		 * Go back to the overview page
		 *
		 * @public
		 * @param {object} oEvent event which triggered the navigation
		 */
		onNavBack: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("Overview", true);
		},
		
		/**
		 * Triggered when the Detail route is hit.
		 * Indicates which UploadId was selected in the overview
		 * so we can derive it when rebinding the SmartTable.
		 * @internal
		 * @param {object} oEvent event which triggered the navigation
		 */
		_onDetailMatched: function(oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			this._sUploadId = oEvent.getParameter("arguments").UploadId;
			if (sPreviousHash !== undefined) {
				this._getSmartTable().rebindTable();
			}
		},
		
		/**
		 * Return the Overview page SmartTable
		 * @private
		 * @return {object} returns a SmartTable
		 */
		_getSmartTable: function() {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("tblUploadLineItems");
			}
			return this._oSmartTable;
		}

	});

});