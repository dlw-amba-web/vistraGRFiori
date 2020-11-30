sap.ui.define([
	], function () {
		"use strict";

		return {
		
			/**
			 * Converts the given status into a human-readable text
			 *
			 * @public
			 * @param {string} sUploadStatus value to be converted
			 * @returns {string} converted text
			 */
			uploadStatusText: function(sUploadStatus) {
				switch(sUploadStatus) {
					case "0":
						return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("lblUploadInitial");
					case "1":
						return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("lblUploadSyncRunning");
					case "2":
						return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("lblUploadSuccessful");
					case "3":
						return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("lblUploadFailed");
					case "4":
						return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("lblUploadDisabled");
					default:
						return "Unknown";
				}
			},
			
			/**
			 * Converts the given status into a state for the ObjectStatus control
			 *
			 * @public
			 * @param {string} sUploadStatus value to be converted
			 * @returns {string} converted status
			 */
			uploadStatusState: function(sUploadStatus) {
				switch(sUploadStatus) {
					case "0":
						return "None";
					case "1":
						return "Warning";
					case "2":
						return "Success";
					case "3":
						return "Error";
					case "4":
						return "Error";
					default:
						return "None";
				}
			},
			
			/**
			 * Converts the given status into an icon for the ObjectStatus control
			 *
			 * @public
			 * @param {string} sUploadStatus value to be converted
			 * @returns {string} converted status
			 */
			uploadStatusIcon: function(sUploadStatus) {
				switch(sUploadStatus) {
					case "0":
						return "sap-icon://home";
					case "1":
						return "sap-icon://synchronize";
					case "2":
						return "sap-icon://upload-to-cloud";
					case "3":
						return "sap-icon://status-error";
					case "4":
						return "sap-icon://cancel";
					default:
						return "sap-icon://sys-help";
				}
			}
		};

	}
);