sap.ui.define([
	"delaware/scpupload/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"delaware/scpupload/formatter/formatter"
], function (BaseController, MessageToast, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("delaware.scpupload.controller.Overview", {
		
		formatter:formatter,
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf delaware.scpupload.view.Overview
		 */
		onInit: function(oEvent) {
			this._smartFilterBar = this.getView().byId("smartFilterBar");
			this.getView().setBusyIndicatorDelay(0);
		},
		
		/**
		 * Handles the selection of a table row in the overview page
		 *
		 * @public
		 * @param {object} oEvent
		 */
		onRowPress: function(oEvent) {
			var oListItem = oEvent.getParameter("listItem"),
				sId = oListItem.getBindingContext().getObject().UploadId;
			this.getOwnerComponent().getRouter().navTo("UploadDetails", {UploadId: sId}, true);
		},
		
		/**
		 * Navigate to the upload errors page.
		 *
		 * @public
		 * @param {object} oEvent
		 */
		onShowErrorsPress: function(oEvent) {
			var sId = oEvent.getSource().getParent().getParent().getBindingContext().getObject().UploadId;
			this.getOwnerComponent().getRouter().navTo("UploadErrors", {UploadId: sId}, true);
		},
		
		/**
		 * Reset upload status for reprocessing of allocations
		 *
		 * @public
		 * @param {object} oEvent
		 */
		onReprocessPress: function(oEvent) {
			this._changeUploadStatus(oEvent, "0");
			/*this.getView().setBusy(true);
			var self = this,
				sId = oEvent.getSource().getParent().getParent().getBindingContext().getObject().UploadId,
				sMsg;
			this.saveEntity("/UpdateUploadStatus", {
				"UPLOADID": sId,
				"UPLOADSTATUS": "0"
			}).then(function(oData) {
				self.getView().byId("tblUploadLines").rebindTable();
				self.getView().setBusy(false);
				sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgReprocessSuccess");
				MessageToast.show(sMsg);
			}).catch(function(oError) {
				self.getView().setBusy(false);
				sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgReprocessFailed");
				MessageToast.show(sMsg);
			});*/
		},
		
		/**
		 * Set upload status to 4 in order to disable processing to 
		 *
		 * @public
		 * @param {object} oEvent
		 */
		onDisableUploadToS4HPress: function(oEvent) {
			this._changeUploadStatus(oEvent, "4");
		},
		
		/**
		 * Send a trigger to CPI to collect all allocation lines with given
		 * UploadId and sync them to S4/H.
		 *
		 * @public
		 * @param {object} oEvent
		 */
		onUploadToS4HPress: function(oEvent) {
			var self = this,
				sId = oEvent.getSource().getParent().getParent().getBindingContext().getObject().UploadId,
				sMsg;
			self.getView().setBusy(true);
			this.postToCPI("/", { "UploadId": sId}).then(function(oData) {
				self.getView().setBusy(false);
				if(oData.ok) {
					self.getView().byId("tblUploadLines").rebindTable();
					sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgUploadToS4Started");
				} else {
					sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgUploadToS4Failed");
				}
				MessageToast.show(sMsg);
			}).catch(function(oError) {
				self.getView().setBusy(false);
				sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgUploadToS4Failed");
				MessageToast.show(sMsg);
			});
		},
		
		/**
		 * Called when a user clicks the "add" button on the uploads
		 * SmartTable. Opens a dialog to set the details for a new upload.
		 *
		 * @public
		 * @param {object} oEvent event which triggered the rebind
		 */
		onAddUploadPress: function(oEvent) {
			this._getNewUploadDialog().open();
			this.getOwnerComponent().getModel("newUploadModel").setData({
				"UploadName": ""
			});
		},
		
		/**
		 * Called when a user clicks the "confirm" button in the
		 * new upload Dialog. Gets the details to create the upload.
		 *
		 * @public
		 */
		onCreateNewUpload: function() {
			this.getView().setBusy(true);
			var oFileUploader = this.getView().byId("allocationUploader");
			oFileUploader.setAdditionalData(this.getOwnerComponent().getModel("newUploadModel").getProperty("/UploadName")); 
			oFileUploader.upload();
		},
		
		/**
		 * Called when a user clicks the "cancel" button in the new upload
		 * Dialog. Closes the Dialog.
		 *
		 * @public
		 * @param {object} oEvent event which triggered the close
		 */
		onCancelNewUpload: function() {
			this._getNewUploadDialog().close();
		},
		
		/**
		 * Before the SmartTable rebinds, we want to set a filter
		 * for the selected status
		 * overview.
		 *
		 * @public
		 * @param {object} oEvent event which triggered the rebind
		 */
		onBeforeRebindTable: function(oEvent) {
			var oBinding = oEvent.getParameter("bindingParams"),
				oFilter;
			if (this._smartFilterBar) {
				var oCtrl = this._smartFilterBar.determineControlByName("UploadStatus");
				if(oCtrl &&  oCtrl.getSelectedKey() !== "999") {
					oFilter	= new sap.ui.model.Filter("UploadStatus", sap.ui.model.FilterOperator.EQ, parseInt(oCtrl.getSelectedKey(),10));
					oBinding.filters.push(oFilter);
				}
			}
			
		},
		
		/**
		 * Function which is called when the upload is finished.
		 * Shows an appropriate message to the user.
		 *
		 * @public
		 * @param {object} oEvent event which triggers the upload complete
		 */
		handleUploadComplete: function(oEvent) {
			this.getView().setBusy(false);
			var sResponse = oEvent.getParameter("response"),
				sMsg;
				
			if(sResponse.search("\"SUCCESS\"") !== -1) {
				sMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgUploadSuccessful");
				this.getView().byId("tblUploadLines").rebindTable();
				MessageToast.show(sMsg);
			} else {
				try {
					sMsg = JSON.parse(sResponse.match(/\{([^}]+)\}/g)).ERROR;
				} catch(error) {
					sMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgUploadFailed");
				}
				MessageBox.show(sMsg, {});
			}
			
			this._getNewUploadDialog().close();
			oEvent.getSource().clear();
		},
		
		/**
		 * Function which is called when the user selects
		 * a file with an unsupported file type.
		 *
		 * @public
		 * @param {object} oEvent event which triggers the upload complete
		 */
		handleTypeMissmatch: function(oEvent) {
			MessageToast.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgUnsupportedFileType"));
		},


		/**
		 * Return the Dialog xml fragment to upload a new file
		 * @private
		 * @return {object} returns a Dialog
		 */
		_getNewUploadDialog: function() {
			var self = this;
			if(!this._oNewUploadDialog) {
				this._oNewUploadDialog = sap.ui.xmlfragment(this.getView().getId(),"delaware.scpupload.view.fragment.UploadDialog", this);
				this.getView().addDependent(this._oNewUploadDialog);
				this._oNewUploadDialog.setEscapeHandler(function(oPromise) {
					var controller = self;
					controller.getView().getController().onCancelNewUpload();
				});
			}
			
			return this._oNewUploadDialog;
		},
		
		/**
		 * Update the status of an upload header
		 *
		 * @public
		 * @param {object} oEvent - event passed along from the event handling function
		 * @param {string} sStatus - status we want to set for the upload header
		 */
		_changeUploadStatus: function(oEvent, sStatus) {
			this.getView().setBusy(true);
			var self = this,
				sId = oEvent.getSource().getParent().getParent().getBindingContext().getObject().UploadId,
				sMsg,
				sTranslationSucces,
				sTranslationError;

			switch(sStatus) {
				case "0":
					sTranslationSucces = "msgReprocessSuccess";
					sTranslationError = "msgReprocessFailed";
					break;
				case "4":
					sTranslationSucces = "msgDisableSuccess";
					sTranslationError = "msgDisableFailed";
					break;
				default:
					sTranslationSucces = "msgSuccessDefault";
					sTranslationError = "msgFailedDefault";
					break;
			}
			
			this.saveEntity("/UpdateUploadStatus", {
				"UPLOADID": sId,
				"UPLOADSTATUS": sStatus
			}).then(function(oData) {
				self.getView().byId("tblUploadLines").rebindTable();
				self.getView().setBusy(false);
				sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTranslationSucces);
				MessageToast.show(sMsg);
			}).catch(function(oError) {
				self.getView().setBusy(false);
				sMsg = self.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTranslationError);
				MessageToast.show(sMsg);
			});
		}
	});

});