sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function(Controller) {
	"use strict";

	return Controller.extend("delaware.scpupload.controller.BaseController", {
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},
		/**
		 * Create a specific entity (CRUD Create operation)
		 * @public
		 * @param {string} the path for our post (= OData endpoint)
		 * @param {object} oData data we want to send
		 * @param {object} oSettings additional settings for the OData request
		 */
		saveEntity: function(sPath, oData, oSettings) {
			var self = this;
			return new Promise(function (resolve, reject) {
				var oModel = self.getModel(),
					oDefaultSettings = {
						success: function(oData) {
							resolve(oData);
						},
						error: function(oError) {
							reject(oError);
						}
					};
				if(!oSettings) {
					oSettings= oDefaultSettings;
				}
				oModel.create(sPath, oData, oSettings);
			});
		},
		/**
		 * Do a post to CPI to trigger allocation sync
		 * @public
		 * @param {string} the path for our post (= OData endpoint)
		 * @param {object} oObject data we want to send
		 */
		postToCPI: function(sPath, oData) {
			sPath = "/sap/fiori/uploadtoscp/api-cpi" + sPath;
			//sPath = "/api-cpi" + sPath;
			var oSettings = {
				headers: {
					"content-type": "application/json; charset=UTF-8"
				},
				body: JSON.stringify(oData),
				method: "POST",
				credentials: "include"
			};
			return fetch(sPath, oSettings);
		}
		
	});
});