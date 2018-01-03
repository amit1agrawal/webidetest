/*global location */
sap.ui.define([
		"com/spc/fiori/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/spc/fiori/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("com.spc.fiori.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},

			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				// Store Bol ID with this
				this._oObjectId = sObjectId;                       
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("BolDocHdrS", {
						BolSerial :  sObjectId
					});
					this._bindView("/" + sObjectPath);
					//TEST CODE
					//var obj = this.getModel().getObject("/" + sObjectPath);
					
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				// Code added By Rabi
				this.getModel().refresh();
				// Code Ended By Rabi
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function (oEvent) {
				// Code added By Rabi
				this.getModel().refresh();
				// Code Ended By Rabi
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.BolSerial,
					sObjectName = oObject.Vssl,
					oViewModel = this.getModel("detailView");
				// Load Item data in another structure
				// This is a workaround as oView.getModel().getObject() is not returning expanded entities
				this._fetchItems(sPath);
				this._showHideTableColumns(sPath);
				
				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},
			_showHideTableColumns: function(sPath){
				
					var oObject = this.getView().getModel().getObject(sPath);
					if (oObject.PrdctType === "02"){
						this.getView().byId("idBarrelColumn").setVisible(false);
						this.getView().byId("idAPIColumn").setVisible(false);
						this.getView().byId("idDensityColumn").setVisible(true);
						this.getView().byId("idMTonColumn").setVisible(true);
						this.getView().byId("idLTonColumn").setVisible(true);
					}
					else{
						this.getView().byId("idBarrelColumn").setVisible(true);
						this.getView().byId("idAPIColumn").setVisible(true);
						this.getView().byId("idDensityColumn").setVisible(false);
						this.getView().byId("idMTonColumn").setVisible(false);
						this.getView().byId("idLTonColumn").setVisible(true);
					}
				
			},
			
			_fetchItems: function(sObjectPath){
				var that = this;
				var aModel = this.getOwnerComponent().getModel();
				aModel.read(sObjectPath + "/HdrToItms" , {
				  	success: function(oData, response){
				  		that._itemData = oData.results;
				  		if (that._itemData.length !== 0){
							var aDensityTotal = 0.00, aBarrelTotal = 0.00, aLTonTotal = 0.00, aMTonTotal = 0.00, aAPITotal = 0.00;
							var length = that._itemData.length;
							
							for (var i = 0; i < length; i++) { 
	    						aDensityTotal = aDensityTotal + parseFloat(that._itemData[i].Dnsty);
	    						aBarrelTotal = aBarrelTotal + parseFloat(that._itemData[i].Barrl);
	    						aLTonTotal = aLTonTotal + parseFloat(that._itemData[i].LTon);
	    						aMTonTotal = aMTonTotal + parseFloat(that._itemData[i].MTon);
	    						aAPITotal = aAPITotal + parseFloat(that._itemData[i].Api);
							}
							/*aDensityTotal = aDensityTotal.toFixed(2);
							aBarrelTotal = aBarrelTotal.toFixed(0);
							aLTonTotal = aLTonTotal.toFixed(2);
							aMTonTotal = aMTonTotal.toFixed(2);
							aAPITotal = aAPITotal.toFixed(2);*/
							
							
    						aBarrelTotal = parseFloat(parseFloat(aBarrelTotal).toFixed(2));
    						aLTonTotal = parseFloat(parseFloat(aLTonTotal).toFixed(3));
    						aMTonTotal = parseFloat(parseFloat(aMTonTotal).toFixed(3));
    						
							that.byId("idNumberBarrel").setNumber(aBarrelTotal);
							that.byId("idNumberLTon").setNumber(aLTonTotal);
							that.byId("idNumberMTon").setNumber(aMTonTotal);
							//that.byId("idNumberAPI").setNumber(parseFloat(aAPITotal).toFixed(6));
							//that.byId("idNumberDensity").setNumber(parseFloat(aDensityTotal).toFixed(6));
						}
						else{
							that.byId("idNumberBarrel").setNumber(null);
							that.byId("idNumberLTon").setNumber(null);
							that.byId("idNumberMTon").setNumber(null);
							//that.byId("idNumberAPI").setNumber(null);
							//that.byId("idNumberDensity").setNumber(null);
						}
					}, 
					error: function(oError){
						that._itemData = [];
					}
				});	
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			},
			
			onEditButtonPress: function(){
				
				//var bReplace = !Device.system.phone;
				this.getRouter().navTo("edit", {
					objectId : this._oObjectId
				});
				
			},
			
			onAfterRendering: function(){
				/*var that = this;
				this.getModel().metadataLoaded().then( function() {
					if (that._itemData.length !== 0){
						var aDensityTotal, aBarrelTotal, aLTonTotal, aMTonTotal, aAPITotal;
						var length = that._itemData.length;
						
						for (var i = 0; i < length; i++) { 
    						aDensityTotal = aDensityTotal + that._itemData[i].Dnsty;
    						aBarrelTotal = aBarrelTotal + that._itemData[i].Barrl;
    						aLTonTotal = aLTonTotal + that._itemData[i].LTon;
    						aMTonTotal = aMTonTotal + that._itemData[i].MTon;
    						aAPITotal = aAPITotal + that._itemData[i].Api;
						}
						
						that.byId("idNumberBarrel").setNumber(aBarrelTotal);
						that.byId("idNumberLTon").setNumber(aLTonTotal);
						that.byId("idNumberMTon").setNumber(aMTonTotal);
						that.byId("idNumberAPI").setNumber(aAPITotal);
						that.byId("idNumberDensity").setNumber(aDensityTotal);
					}
				});*/
			}

		});

	}
);