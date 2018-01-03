sap.ui.define([
	"com/spc/fiori/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter"
], function(BaseController, JSONModel, History, MessageBox, MessageToast, Filter) {
	"use strict";

	return BaseController.extend("com.spc.fiori.controller.AddNew", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.spc.fiori.view.view.AddNew
		 */
		onInit: function() {
			//"BolDate":"",
			this._data = new JSONModel({
				"BolSerial": "",
				"BolDate": "",
				"VsslName": "",
				"Vssl": "",
				"LodComncdAt": "",
				"LodCompltAt": "",
				"Agent": "",
				"AgentName": "",
				"Grt": "",
				"Sdwt": "",
				"VsslSldAt": "",
				"TerminalDesc": "",
				"Terminal": "",
				"PrvsBolNo": "",
				"PrdctTypeDesc": "",
				"PrdctType": "",
				"DocType": "",
				"Carryfwd": false,
				"SrNo": "",
				"HdrToItms": [
					/*{
						"PrdctName": "Crude",
						"Prdct": "PD003",
						"Partner": "Test",
						"Destination": "TestDest",
						"Land1": "",
						"Landx": "",
						"Barrels": "",
						"LTons":"",
						"MTon":"",
						"Dnsty":""
					}*/
				]
			});

			this.getView().setModel(this._data);
			this.getView().bindElement("/");
			// For Total Amount calculation
			this._itemData = new JSONModel({
				"Dnsty": 0.00,
				"Barrl": 0.00,
				"LTon": 0.00,
				"MTon": 0.00,
				"Api": 0.00
			});
			this.getOwnerComponent().getRouter().getRoute("object").attachPatternMatched(this._onAddNewMatched, this);
			this.getView().setModel(this.getOwnerComponent().getModel(), "default");
			// Code Added By Rabi
			//var bolSysDate = new Date();
			this.getView().setModel(new JSONModel({
				"bolSysDate": ""
			}), 'bolSysDate');
			// Code Ended By Rabi

		},
		
		resetViewData: function(){
			this._data = new JSONModel({
				"BolSerial": "",
				"BolDate": "",
				"VsslName": "",
				"Vssl": "",
				"LodComncdAt": "",
				"LodCompltAt": "",
				"Agent": "",
				"AgentName": "",
				"Grt": "",
				"Sdwt": "",
				"VsslSldAt": "",
				"TerminalDesc": "",
				"Terminal": "",
				"PrvsBolNo": "",
				"PrdctTypeDesc": "",
				"PrdctType": "",
				"DocType": "",
				"Carryfwd": false,
				"SrNo": "",
				"HdrToItms": []
			});
			
		},

		_onAddNewMatched: function(parameters) {
			this._objectId = parameters.getParameters().arguments.objectId;
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.spc.fiori.view.view.AddNew
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.spc.fiori.view.view.AddNew
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.spc.fiori.view.view.AddNew
		 */
		onExit: function() {
			this._data = null;
			this.getView().destroyContent();
		},

		onCancelDialog: function(oEvent) {
			//var source = oEvent.getSource();
			// Close the fragment
			//source.close();
			this._addNewItemPage.close();
			this._addNewItemPage.destroy(true);
			this._addNewItemPage = null;
		},

		handleAddItemPress: function() {

			// Code added By Rabi
			var ProductListModel = this.getOwnerComponent().getModel("ProductListModel");
			// Code ended by rabi

			if (this._data.getData().PrdctType === "" || this._data.getData().PrdctType === undefined) {
				MessageToast.show("Product Type should be selected before entering Cargo detail information.");
				return;
			}
			if (!this._addNewItemPage) {
				this._addNewItemPage = sap.ui.xmlfragment('NewCargoInfo', "com.spc.fiori.view.fragments.NewCargoInfo", this);
				this.getView().addDependent(this._addNewItemPage);
			}
			// Code added By Rabi
			this._addNewItemPage.setModel(ProductListModel);
			// Code ended By Rabi

			//Disable some fields based on ProductType. BusinessRequirement
			if (this._data.getData().PrdctType === "01") { // Crude
				sap.ui.core.Fragment.byId("NewCargoInfo", "inpMTon").setVisible(false);
				sap.ui.core.Fragment.byId("NewCargoInfo", "inpDensity").setVisible(false);
			} else if (this._data.getData().PrdctType === "02") { //Gas
				sap.ui.core.Fragment.byId("NewCargoInfo", "inpBarrels").setVisible(false);
				sap.ui.core.Fragment.byId("NewCargoInfo", "inpAPI").setVisible(false);
				sap.ui.core.Fragment.byId("NewCargoInfo", "inpLTons").setEditable(false);
			}

			/*this._addNewItemPage.setModel(this.getModel());
			this._addNewItemPage.bindElement("/HdrToItms/0");*/
			this._addNewItemPage.setModel(new JSONModel({
				"BolSerial": "",
				"PrdctName": "",
				"Prdct": "",
				"Prtnr": "",
				"Api": "",
				"Dest": "",
				"DestName": "",
				"Barrl": "",
				"LTon": "",
				"MTon": "",
				"Dnsty": "",
				"PrtnrName": ""
			}));

			this._addNewItemPage.bindElement("/");

			/*this._addNewItemPage.setModel(new JSONModel({
							"PartnerCollection": [
								{
									"Partner": "Partner1",
									"Destination": "destination1",
									"Barrels": "1001",
									"LTons":"111",
									"MTon":"222",
									"Dnsty":"4333"
								}
							]
						}));
			
						this._addNewItemPage.bindElement("/PartnerCollection/0");*/

			this._addNewItemPage.open();
		},

		_replaceNullWithZeros: function(sValues) {
			if (sValues.Dnsty === "") {
				sValues.Dnsty = 0.00;
			}
			if (sValues.Api === "") {
				sValues.Api = 0.00;
			}
			if (sValues.LTon === "") {
				sValues.LTon = 0.00;
			}
			if (sValues.MTon === "") {
				sValues.MTon = 0.00;
			}
			if (sValues.Barrl === "") {
				sValues.Barrl = 0.00;
			}
			return sValues;
		},

		onCloseDialog: function(oEvent) {

			var aNewValues = this._addNewItemPage.getModel().getJSON();
			aNewValues = JSON.parse(aNewValues);
			aNewValues = this._replaceNullWithZeros(aNewValues);
			//aNewValues.BolSerial = this._data.getData().BolSerial;
			// Set precision of 6 for API & Density and 3 for MTon & LTon
			// Remove trailing Zeros
			aNewValues.Dnsty = parseFloat(parseFloat(aNewValues.Dnsty).toFixed(6));
			aNewValues.Api = parseFloat(parseFloat(aNewValues.Api).toFixed(6));
			aNewValues.Barrl = parseFloat(parseFloat(aNewValues.Barrl).toFixed(2));
			aNewValues.LTon = parseFloat(parseFloat(aNewValues.LTon).toFixed(3));
			aNewValues.MTon = parseFloat(parseFloat(aNewValues.MTon).toFixed(3));

			this._data.getData().HdrToItms.push(aNewValues);
			this.getView().getModel().refresh();

			this._itemData.getData().Dnsty = this._itemData.getData().Dnsty + aNewValues.Dnsty;
			this._itemData.getData().Barrl = this._itemData.getData().Barrl + aNewValues.Barrl;
			this._itemData.getData().LTon = this._itemData.getData().LTon + aNewValues.LTon;
			this._itemData.getData().MTon = this._itemData.getData().MTon + aNewValues.MTon;
			this._itemData.getData().Api = this._itemData.getData().Api + aNewValues.Api;

			this._itemData.getData().Dnsty = parseFloat(this._itemData.getData().Dnsty.toFixed(6));
			this._itemData.getData().Barrl = parseFloat(this._itemData.getData().Barrl.toFixed(2));
			this._itemData.getData().LTon = parseFloat(this._itemData.getData().LTon.toFixed(3));
			this._itemData.getData().MTon = parseFloat(this._itemData.getData().MTon.toFixed(3));
			this._itemData.getData().Api = parseFloat(this._itemData.getData().Api.toFixed(6));

			this.byId("idNumberBarrel").setNumber(this._itemData.getData().Barrl);
			this.byId("idNumberLTon").setNumber(this._itemData.getData().LTon);
			this.byId("idNumberMTon").setNumber(this._itemData.getData().MTon);
			/*this.byId("idNumberBarrel").setNumber(parseFloat(this._itemData.getData().Barrl).toFixed(2));
			this.byId("idNumberLTon").setNumber(parseFloat(this._itemData.getData().LTon).toFixed(3));
			this.byId("idNumberMTon").setNumber(parseFloat(this._itemData.getData().MTon).toFixed(3));*/
			//this.byId("idNumberAPI").setNumber(parseFloat(this._itemData.getData().Api).toFixed(6));
			//this.byId("idNumberDensity").setNumber(parseFloat(this._itemData.getData().Dnsty).toFixed(6));

			//this.getView().setModel(this._data);
			//this.byId("idCargoInfoTable").refresh();
			// Close the fragment
			this._addNewItemPage.close();
			this._addNewItemPage.destroy(true);
			this._addNewItemPage = null;
			this.checkTotalLTonGTGRT();
		},
		
		checkTotalLTonGTGRT: function(){
			var aTotalLTon = this.byId("idNumberLTon").getNumber();
			if (aTotalLTon !== undefined || aTotalLTon !== ""){
					var errorMessage = "The Total LTon should be less than GRT of the Vessel.";
					if (parseFloat(aTotalLTon) > parseFloat(this._data.getData().Grt)){
						MessageBox.show(errorMessage, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {}
							});
					}
			}
		},
		
		handleItemCancelPress: function(oEvent) {
			var aItemPath = oEvent.getSource().getParent().getBindingContextPath();
			var res = aItemPath.split("/");
			this._itemData.getData().Dnsty = this._itemData.getData().Dnsty - parseFloat(this._data.getData().HdrToItms[res[2]].Dnsty);
			this._itemData.getData().Barrl = this._itemData.getData().Barrl - parseFloat(this._data.getData().HdrToItms[res[2]].Barrl);
			this._itemData.getData().LTon = this._itemData.getData().LTon - parseFloat(this._data.getData().HdrToItms[res[2]].LTon);
			this._itemData.getData().MTon = this._itemData.getData().MTon - parseFloat(this._data.getData().HdrToItms[res[2]].MTon);
			this._itemData.getData().Api = this._itemData.getData().Api - parseFloat(this._data.getData().HdrToItms[res[2]].Api);
			// Change the value in UI
			this.byId("idNumberBarrel").setNumber(parseFloat(this._itemData.getData().Barrl).toFixed(2));
			this.byId("idNumberLTon").setNumber(parseFloat(this._itemData.getData().LTon).toFixed(2));
			this.byId("idNumberMTon").setNumber(parseFloat(this._itemData.getData().MTon).toFixed(2));
			//this.byId("idNumberAPI").setNumber(parseFloat(this._itemData.getData().Api).toFixed(2));
			//this.byId("idNumberDensity").setNumber(parseFloat(this._itemData.getData().Dnsty).toFixed(2));

			// Delete the element from JSON Model
			this._data.getData().HdrToItms.splice(res[2], 1);
			this.getView().getModel().refresh();
			this.checkTotalLTonGTGRT();
		},

		handleCancelPress: function() {

			var that = this;

			MessageBox.show("All changes will be lost. Do you still want to Cancel?", {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Cancel",
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {

						// Code added by Rabi
						that.getView().byId("idBolSerial").setValue("");
						that.getView().byId("idPrevBolSerial").setValue("");
						that.getView().byId("idSerialNo").setValue("");
						that.getView().byId("idVessel").setValue("");
						that.getView().byId("idAgent").setValue("");
						that.getView().byId("idProductType").setValue("");
						that.getView().byId("idTerminal").setValue("");
						that.getView().byId("idCommencedAt").setValue("");
						that.getView().byId("idCompletedAt").setValue("");
						that.getView().byId("idSealedAt").setValue("");
						that.getView().byId("idBolDate").setValue("");
						that.getView().byId("grtregId").setValue("");
						that.getView().byId("sumdedId").setValue("");
						that.getView().byId("ChkboxId").setSelected(false);
						var t = that._data.getData().HdrToItms.length;
						for (var i = 0; i < t; i++) {
							that._data.getData().HdrToItms.splice(i, t);
						}
						that.byId("idNumberBarrel").setNumber();
						that.byId("idNumberLTon").setNumber();
						that.byId("idNumberMTon").setNumber();
						that.getModel().refresh();
						that.getView().getModel().refresh();

						// code ended by Rabi

						var oHistory = History.getInstance();
						var sPreviousHash = oHistory.getPreviousHash();
						var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
						if (sPreviousHash !== undefined) {
							// It's going to Home page. TODO: Correct this later on.
							//window.history.go(-1);
							oRouter.navTo("master", true);
							//oRouter.navTo("object", {objectId : this._objectId}, true);
						} else {
							//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							// Navigation to defaul view
							oRouter.navTo("master", true);
						}
					} else if (oAction === sap.m.MessageBox.Action.CANCEL) {}
				}
			});
		},

		onSavePress: function() {
			// Get data from this._data and fire oData query to save all details
			//var today = new Date();
			/*var dateSeparator = "-";
			var timeSeparator = ":";
			var month = today.getMonth() + 1;
			this._data.oData.BolDate = today.getFullYear() + dateSeparator + month + dateSeparator +
				today.getDate() + "T" + today.getHours() + timeSeparator + today.getMinutes() + timeSeparator +
				today.getSeconds();*/
			// TODO: Added hardcoded date as backend is only allowing dates before November	
			//this._data.getData().BolDate = today.toISOString().slice(0,-5);
			//this._data.getData().BolDate = "2017-10-02T07:51:56";
			//this._data.getData().BolDate = this.getView().getModel('bolSysDate').getData().bolSysDate;

			// DocType N for new record
			this._data.getData().DocType = "N";
			this._data.getData().Status = "S";
			// Remove it after the property is available in backend
			//delete this._data.oData.VsslName;
			//delete this._data.oData.IMO;

			for (var i = 0; i < this._data.getData().HdrToItms.length; i++) {
				this._data.getData().HdrToItms[i].BolSerial = this._data.getData().BolSerial;
				this._data.getData().HdrToItms[i].Dnsty = this._data.getData().HdrToItms[i].Dnsty.toString();
				this._data.getData().HdrToItms[i].Barrl = this._data.getData().HdrToItms[i].Barrl.toString();
				this._data.getData().HdrToItms[i].LTon = this._data.getData().HdrToItms[i].LTon.toString();
				this._data.getData().HdrToItms[i].MTon = this._data.getData().HdrToItms[i].MTon.toString();
				this._data.getData().HdrToItms[i].Api = this._data.getData().HdrToItms[i].Api.toString();
			}

			/*this._data.oData.LodComncdAt = this._data.oData.LodComncdAt.concat("T00:00:00");
			this._data.oData.LodCompltAt = this._data.oData.LodCompltAt.concat("T00:00:00");
			this._data.oData.VsslSldAt = this._data.oData.VsslSldAt.concat("T00:00:00");*/

			if (this._data.getData().Carryfwd === true) {
				this._data.getData().Carryfwd = "X";
			} else {
				this._data.getData().Carryfwd = " ";
			}

			// Check for Null Values and return if any value is null
			if (this._containsNullValues() === true) {
				MessageToast.show("Fill in all mandatory fields before saving.");
				return;
			}

			var oViewModel = this.getOwnerComponent().getModel();
			var that = this;
			oViewModel.create('/BolDocHdrS', this._data.oData, {
				success: function(oData, oResponse) {

					MessageToast.show("Request created successfully");
					that._data = null;
					that.getRouter().navTo("object", {
						objectId: oData.BolSerial
					}, true);
				},
				error: function(oData, oResponse) {
					/*var errorMessage = JSON.parse(oData.responseText).error.innererror.errordetails[0].message;
					MessageBox.show(errorMessage, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {}
					});*/
				}
			});
		},

		handleAgentNoValueHelp: function() {
			if (!this._agentListDialog) {
				this._agentListDialog = sap.ui.xmlfragment('plantListDialog', "com.spc.fiori.view.fragments.AgentNo", this);
				this.getView().addDependent(this._agentListDialog);
			}

			//TODO: Uncomment the following lines once real oData service is available.
			/*this._agentListDialog.setModel(this.getModel(), 'AgentListModel');
			this._agentListDialog.bindElement("SH_AGENT");*/

			/*this._agentListDialog.setModel(new JSONModel([{
				"NameOrg1": "Agent1",
				"Partner": "001"
			}, {
				"NameOrg1": "Agent2",
				"Partner": "002"
			}, {
				"NameOrg1": "Agent3",
				"Partner": "003"
			}]), 'AgentListModel');*/

			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_AGENTSet", {
				success: function(oData, response) {
					that._agentListDialog.setModel(new JSONModel(oData.results), 'AgentListModel');
				},
				error: function(oError) {}
			});
			this._agentListDialog.open();
		},

		handleAgentDialogClose: function(oEvent) {

			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('AgentListModel');
			this._data.getData().Agent = selectedItemContext.getProperty("Partner");
			this._data.getData().AgentName = selectedItemContext.getProperty("NameOrg1");
			this.byId("idAgent").setValueState(sap.ui.core.ValueState.None);
			this.getModel().refresh();
		},

		handleVesselValueHelp: function() {
			if (!this._vesselListDialog) {
				this._vesselListDialog = sap.ui.xmlfragment('plantListDialog', "com.spc.fiori.view.fragments.Vessel", this);
				this.getView().addDependent(this._vesselListDialog);
			}

			/*this._vesselListDialog.setModel(new JSONModel([{
				"VsslName": "Vessel1",
				"Vssl": "001"
			}, {
				"VsslName": "Vessel2",
				"Vssl": "002"
			}, {
				"VsslName": "Vessel3",
				"Vssl": "003"
			}]), 'VesselListModel');*/

			// Below is the code for fetching Vessel Information from backend master data
			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_VSSLSet", {
				success: function(oData, response) {
					that._vesselListDialog.setModel(new JSONModel(oData.results), 'VesselListModel');
				},
				error: function(oError) {}
			});

			this._vesselListDialog.open();
		},

		handleVesselDialogClose: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('VesselListModel');
			var selectedItemIndex = oEvent.getParameter("selectedContexts")[0].sPath.split("/")[1];

			this._data.getData().Vssl = selectedItemContext.getProperty("ShipCode");
			this._data.getData().VsslName = selectedItemContext.getProperty("Ltext");

			this._data.getData().Sdwt = this._vesselListDialog.getModel('VesselListModel').getData()[selectedItemIndex].Sdwt;
			this._data.getData().Grt = this._vesselListDialog.getModel('VesselListModel').getData()[selectedItemIndex].Grt;
			this.getModel().refresh();

			MessageToast.show("Gross Registerd Tonnage and Summer Dead Weight Tonnage values have been updated");
			this.byId("idVessel").setValueState(sap.ui.core.ValueState.None);

			/*var aModel = this.getOwnerComponent().getModel();
			var that = this;
			var aFilters = new Array();
			var aVesselFilter = new sap.ui.model.Filter({
                     path: "ShipCode",
                     operator: sap.ui.model.FilterOperator.EQ,
                     value1: selectedItemContext.getProperty("ShipCode")
              });
            aFilters.push(aVesselFilter);
			aModel.read("/SH_VSSLSet" , {
					filters: aFilters,
				  	success: function(oData, response){
				  		that.getModel().getData().Grt = oData.results[0].Grt;
				  		that.getModel().getData().Sdwt = oData.results[0].Sdwt;
				  		that.getModel().refresh();
					}, 
					error: function(oError){}
			});*/
		},

		handleTerminalValueHelp: function(oEvent) {
			if (!this._TerminalListDialog) {
				this._TerminalListDialog = sap.ui.xmlfragment('terminalListDialog', "com.spc.fiori.view.fragments.Terminal", this);
				this.getView().addDependent(this._TerminalListDialog);
			}

			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_TerminalSet", {
				success: function(oData, response) {
					that._TerminalListDialog.setModel(new JSONModel(oData.results), 'TerminalListModel');
				},
				error: function(oError) {}
			});

			this._TerminalListDialog.open();
		},

		handleTerminalDialogClose: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('TerminalListModel');
			this._data.oData.Terminal = selectedItemContext.getProperty("Term");
			this._data.oData.TerminalDesc = selectedItemContext.getProperty("TermTxt");
			this.byId("idTerminal").setValueState(sap.ui.core.ValueState.None);
			this.getModel().refresh();
		},

		handlePartnerValueHelp: function(oEVent) {
			if (!this._PartnerListDialog) {
				this._PartnerListDialog = sap.ui.xmlfragment('PartnerListDialog', "com.spc.fiori.view.fragments.Partner", this);
				this.getView().addDependent(this._PartnerListDialog);
			}

			/*this._PartnerListDialog.setModel(new JSONModel([{
				"NameOrg1": "Partner1",
				"Partner": "001"
			}, {
				"NameOrg1": "Partner2",
				"Partner": "002"
			}, {
				"NameOrg1": "Partner3",
				"Partner": "003"
			}]), 'PartnerListModel');*/

			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			var aFilters = new Array();

			if (this._data.getData().Terminal === "") {
				MessageToast.show("Terminal is a mandatory field for Partner");
				return;
			}
			if (this._data.getData().PrdctType === "") {
				MessageToast.show("Product Type is a mandatory field for Partner");
				return;
			}
			if (this._addNewItemPage.getModel().getData().Prdct === "") {
				MessageToast.show("Product is a mandatory field for Partner");
				return;
			}

			var aTerminalFilter = new sap.ui.model.Filter({
				path: "Terminal",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this._data.getData().Terminal
			});
			var aProductTypeFilter = new sap.ui.model.Filter({
				path: "ProdType",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this._data.getData().PrdctType
			});
			var aPartnerFilter = new sap.ui.model.Filter({
				path: "Prtnr",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this._addNewItemPage.getModel().getData().Prdct
			});

			aFilters.push(aTerminalFilter);
			aFilters.push(aProductTypeFilter);
			aFilters.push(aPartnerFilter);

			aModel.read("/SH_PROD_PART_CMPSet", {
				filters: aFilters,
				success: function(oData, response) {
					that._PartnerListDialog.setModel(new JSONModel(oData.results), 'PartnerListModel');
				},
				error: function(oError) {}
			});
			this._PartnerListDialog.open();
		},

		handlePartnerDialogClose: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('PartnerListModel');
			this._addNewItemPage.getModel().getData().Prtnr = selectedItemContext.getProperty("Prtnr");
			this._addNewItemPage.getModel().getData().PrtnrName = selectedItemContext.getProperty("PrtnrName");
			this._addNewItemPage.getModel().refresh();

			/*this._data.oData.HdrToItms[0].Partner = selectedItemContext.getProperty("Partner");
			this._data.oData.HdrToItms[0].NameOrg1 = selectedItemContext.getProperty("NameOrg1");
			this.getModel().refresh();*/
		},

		handleDestinationValueHelp: function(oEvent) {
			if (!this._DestinationListDialog) {
				this._DestinationListDialog = sap.ui.xmlfragment('DestinationListDialog', "com.spc.fiori.view.fragments.Destination", this);
				this.getView().addDependent(this._DestinationListDialog);
			}

			//TODO: Uncomment the following lines once real oData service is available.
			/*this._agentListDialog.setModel(this.getModel(), 'VesselListModel');
			this._agentListDialog.bindElement("SH_VSSL");*/

			/*this._DestinationListDialog.setModel(new JSONModel([{
				"Land1": "UAE",
				"Landx": "Emirates"
			}, {
				"Land1": "IND",
				"Landx": "India"
			}, {
				"Land1": "EGY",
				"Landx": "Egypt"
			},
			{
				"Land1": "PAK",
				"Landx": "Pakistan"
			}
			]), 'DestinationListModel');*/

			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_DESTSet", {
				success: function(oData, response) {
					that._DestinationListDialog.setModel(new JSONModel(oData.results), 'DestinationListModel');
				},
				error: function(oError) {}
			});

			this._DestinationListDialog.open();
		},

		handleDestinationDialogClose: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('DestinationListModel');
			this._addNewItemPage.getModel().oData.DestName = selectedItemContext.getProperty("Landx");
			this._addNewItemPage.getModel().oData.Dest = selectedItemContext.getProperty("Land1");
			this._addNewItemPage.getModel().refresh();
		},

		handleProductTypeValueHelp: function() {
			if (!this._ProductTypeListDialog) {
				this._ProductTypeListDialog = sap.ui.xmlfragment('ProductTypeListDialog', "com.spc.fiori.view.fragments.ProductType", this);
				this.getView().addDependent(this._ProductTypeListDialog);
			}

			//TODO: Uncomment the following lines once real oData service is available.
			/*this._agentListDialog.setModel(this.getModel(), 'VesselListModel');
			this._agentListDialog.bindElement("SH_VSSL");*/

			/*this._ProductTypeListDialog.setModel(new JSONModel([{
				"PrdctTypeDesc": "Crude Oil",
				"PrdctType": "01"
			}, {
				"PrdctTypeDesc": "Diesel",
				"PrdctType": "02"
			}, {
				"PrdctTypeDesc": "Gasoline",
				"PrdctType": "03"
			}]), 'ProductTypeListModel');*/

			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_PROD_TYPESet", {
				success: function(oData, response) {
					that._ProductTypeListDialog.setModel(new JSONModel(oData.results), 'ProductTypeListModel');
				},
				error: function(oError) {}
			});

			this._ProductTypeListDialog.open();
		},

		handleProductTypeDialogClose: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('ProductTypeListModel');
			this._data.getData().PrdctTypeDesc = selectedItemContext.getProperty("PrdctTypeDesc");
			this._data.getData().PrdctType = selectedItemContext.getProperty("PrdctType");
			this.byId("idProductType").setValueState(sap.ui.core.ValueState.None);
			this.getModel().refresh();
			// Code Added By Rabi
			this._showHideCargoTableColumns(this._data.getData().PrdctType);
			//var barrelId,apiId,dencityId,mtonId;
			//Code Ended By Rabi
		},

		_showHideCargoTableColumns: function(sProdType) {
			if (sProdType === "02") { //Gas
				this.getView().byId("idBarrelColumn").setVisible(false);
				this.getView().byId("idAPIColumn").setVisible(false);
				this.getView().byId("idDensityColumn").setVisible(true);
				this.getView().byId("idMTonColumn").setVisible(true);
				this.getView().byId("idLTonColumn").setVisible(true);
			} else {
				this.getView().byId("idBarrelColumn").setVisible(true);
				this.getView().byId("idAPIColumn").setVisible(true);
				this.getView().byId("idDensityColumn").setVisible(false);
				this.getView().byId("idMTonColumn").setVisible(false);
				this.getView().byId("idLTonColumn").setVisible(true);
			}
		},

		handleProductValueHelp: function(oEvent) {
			if (!this._ProductListDialog) {
				this._ProductListDialog = sap.ui.xmlfragment('ProductListDialog', "com.spc.fiori.view.fragments.Product", this);
				this.getView().addDependent(this._ProductListDialog);
			}

			/*this._ProductListDialog.setModel(new JSONModel([{
				"PrdctName": "Abu Albukoosh Crude",
				"Prdct": "001"
			}, {
				"PrdctName": "Bundug Crude",
				"Prdct": "002"
			}, {
				"PrdctName": "Crude",
				"Prdct": "003"
			}]), 'ProductListModel');*/

			var that = this;
			var aFilters = new Array();
			if (this._data.getData().Terminal === "") {
				MessageToast.show("Terminal is a mandatory field for Product");
				return;
			}
			if (this._data.getData().PrdctType === "") {
				MessageToast.show("Product Type is a mandatory field for Product");
				return;
			}

			var aTerminalFilter = new sap.ui.model.Filter({
				path: "Terminal",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this._data.getData().Terminal
			});
			var aProductTypeFilter = new sap.ui.model.Filter({
				path: "ProdType",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: this._data.getData().PrdctType
			});
			aFilters.push(aTerminalFilter);
			aFilters.push(aProductTypeFilter);
			var aModel = this.getOwnerComponent().getModel();

			aModel.read("/SH_PROD_PART_CMPSet", {
				filters: aFilters,
				success: function(oData, response) {
					that._ProductListDialog.setModel(new JSONModel(oData.results), 'ProductListModel');
				},
				error: function(oError) {}
			});
			this._ProductListDialog.open();
		},
		// Code Added By rabi
		handleSearch: function(oEvent) {

			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("BolSerial", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("BolSerial", sap.ui.model.FilterOperator.Contains, searchString)
				], false);
			}

			oEvent.getSource().getBinding("items").filter(filters);

		},
		handleSearchVessel: function(oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("ShipCode", sap.ui.model.FilterOperator.Contains, searchString)
				], false);
			}

			oEvent.getSource().getBinding("items").filter(filters);
		},
		handleSearchProdType: function(oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("PrdctTypeDesc", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("PrdctType", sap.ui.model.FilterOperator.Contains, searchString)
				], false);
			}

			oEvent.getSource().getBinding("items").filter(filters);
		},

		handleTerminalSearch: function(oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("TermTxt", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("Term", sap.ui.model.FilterOperator.Contains, searchString)
				], false);
			}

			oEvent.getSource().getBinding("items").filter(filters);
		},

		handleSearchProd: function(oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("PrdctName", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("Prdct", sap.ui.model.FilterOperator.Contains, searchString)
				], false);

			}

			oEvent.getSource().getBinding("items").filter(filters);

		},
		handleSearchPartner: function(oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("PrtnrName", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("Prtnr", sap.ui.model.FilterOperator.Contains, searchString)
				], false);

			}

			oEvent.getSource().getBinding("items").filter(filters);

		},

		handleSearchDes: function(oEvent) {
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
				filters = new sap.ui.model.Filter([new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, searchString),
					new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.Contains, searchString)
				], false);

			}

			oEvent.getSource().getBinding("items").filter(filters);

		},

		// Code Ended By Rabi

		handleProductDialogClose: function(oEvent) {

			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('ProductListModel');
			this._addNewItemPage.getModel().oData.PrdctName = selectedItemContext.getProperty("PrdctName");
			this._addNewItemPage.getModel().oData.Prdct = selectedItemContext.getProperty("Prdct");
			this._addNewItemPage.getModel().refresh();

			//var aNewValues = JSON.parse(this._addNewItemPage.getModel().getJSON());
			//this._data.oData.HdrToItms[0].PrdctName = selectedItemContext.getProperty("PrdctName");
			//this._data.oData.HdrToItms[0].Prdct = selectedItemContext.getProperty("Prdct");
			//this._addNewItemPage.setModel(aNewValues);
			/*this._addNewItemPage.getModel().refresh();
			this.getModel().refresh();*/
		},

		handleBoLValueHelp: function() {
			if (!this._BoLListDialog) {
				this._BoLListDialog = sap.ui.xmlfragment('BoLListDialog', "com.spc.fiori.view.fragments.BoL", this);
				this.getView().addDependent(this._BoLListDialog);
			}

			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/BolDocHdrS", {
				urlParameters: {
					"$select": "BolSerial"
				},
				success: function(oData, response) {
					that._BoLListDialog.setModel(new JSONModel(oData.results), 'BoLListModel');
				},
				error: function(oError) {}
			});

			this._BoLListDialog.open();
		},

		handleBoLDialogClose: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('BoLListModel');
			this._data.getData().PrvsBolNo = selectedItemContext.getProperty("BolSerial");
			this.getModel().refresh();
		},

		onMTonChange: function(oEvent) {
			// Apply formula to convert MTons to LTons
			var aLTon = parseFloat((parseFloat(oEvent.getSource().getValue()) * 0.98421).toFixed(3));
			this._addNewItemPage.getModel().getData().LTon = aLTon;
			this._addNewItemPage.getModel().refresh();
		},

		_containsNullValues: function() {
			//|| this._data.getData().BolDate === "" 
			if (this._data.getData().BolDate === "" || this._data.getData().BolSerial === "" || this._data.getData().VsslName === "" || this._data
				.getData().Vssl === "" || this._data
				.getData().LodComncdAt === "" || this._data.getData().LodCompltAt === "" || this._data.getData().Agent === "" || this._data.getData()
				.AgentName === "" || this._data.getData().Grt === "" || this._data.getData().Sdwt === "" || this._data.getData().VsslSldAt ===
				"" ||
				this._data.getData().TerminalDesc === "" || this._data.getData().Terminal === "" || this._data.getData().PrdctTypeDesc === "" ||
				this._data.getData().PrdctType === "") {
				if (this._data.getData().BolSerial === "") {
					this.byId("idBolSerial").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().BolDate === "") {
					this.byId("idBolDate").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().VsslName === "") {
					this.byId("idVessel").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().Vssl === "") {
					this.byId("idVessel").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().LodComncdAt === "") {
					this.byId("idCommencedAt").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().LodCompltAt === "") {
					this.byId("idCompletedAt").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().Agent === "") {
					this.byId("idAgent").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().AgentName === "") {
					this.byId("idAgent").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().VsslSldAt === "") {
					this.byId("idSealedAt").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().TerminalDesc === "") {
					this.byId("idTerminal").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().Terminal === "") {
					this.byId("idTerminal").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().PrdctTypeDesc === "") {
					this.byId("idProductType").setValueState(sap.ui.core.ValueState.Error);
				}
				if (this._data.getData().PrdctType === "") {
					this.byId("idProductType").setValueState(sap.ui.core.ValueState.Error);
				}
				/*if (this._data.getData().SrNo === "") {
					this.byId("idSerialNo").setValueState(sap.ui.core.ValueState.Error);
				}*/
				return true;
			}
			return false;
		},

		_containsNullValues2: function() {
			for (var key in this._data.getData()) {
				if (this._data.getData().hasOwnProperty(key) && this._data.getData()[key] === "") {
					return true;
				}
			}
		},

		resetValueState: function(oEvent) {
			var aSource = oEvent.getSource();
			aSource.setValueState(sap.ui.core.ValueState.None);
		},
		
		resetValueStateLdCmpltAt: function(oEvent){
			var aSource = oEvent.getSource();
			var oCmplDate = new Date(aSource.getValue());
			
			if ( this._data.getData().LodComncdAt !== "" || this._data.getData().LodComncdAt !== undefined ){
				var oCmmcdDate = new Date(this._data.getData().LodComncdAt);
				if ( oCmplDate < oCmmcdDate){
					MessageToast.show("Loading Completed Date should be after Loading commenced date");
					aSource.setValueState(sap.ui.core.ValueState.Error);
					aSource.setValue("");
					return;
				}
			}
			aSource.setValueState(sap.ui.core.ValueState.None);
		},
		
		resetValueStateSldAt: function(oEvent){
			var aSource = oEvent.getSource();
			var oSldAtDate = new Date(aSource.getValue());
			
			if ( this._data.getData().LodCompltAt !== "" || this._data.getData().LodCompltAt !== undefined ){
				var oCmmcdDate = new Date(this._data.getData().LodCompltAt);
				if ( oSldAtDate < oCmmcdDate){
					MessageToast.show("Vessel sealed Date should be after Loading completed date");
					aSource.setValueState(sap.ui.core.ValueState.Error);
					aSource.setValue("");
					return;
				}
			}
			aSource.setValueState(sap.ui.core.ValueState.None);
		},

		onVesselSuggestedItemSelected: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('default');

			this._data.getData().Vssl = selectedItemContext.getProperty("ShipCode");
			this._data.getData().VsslName = selectedItemContext.getProperty("Ltext");

			this._data.getData().Sdwt = selectedItemContext.getProperty("Sdwt");
			this._data.getData().Grt = selectedItemContext.getProperty("Grt");
			this.getModel().refresh();
			MessageToast.show("Gross Registerd Tonnage and Summer Dead Weight Tonnage values have been updated");
			this.byId("idVessel").setValueState(sap.ui.core.ValueState.None);
		},

		onAgentSuggestedItemSelected: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('default');
			this._data.getData().Agent = selectedItemContext.getProperty("Partner");
			this._data.getData().AgentName = selectedItemContext.getProperty("NameOrg1");
			this.getModel().refresh();
			this.byId("idAgent").setValueState(sap.ui.core.ValueState.None);
		},

		onProdTypeSuggestedItemSelected: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('default');
			this._data.getData().PrdctType = selectedItemContext.getProperty("PrdctType");
			this._data.getData().PrdctTypeDesc = selectedItemContext.getProperty("PrdctTypeDesc");
			this.getModel().refresh();
			this._showHideCargoTableColumns(this._data.getData().PrdctType);
			this.byId("idProductType").setValueState(sap.ui.core.ValueState.None);
		},

		onTerminalSuggestedItemSelected: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('default');
			this._data.getData().Terminal = selectedItemContext.getProperty("Term");
			this._data.getData().TerminalDesc = selectedItemContext.getProperty("TermTxt");
			this.getModel().refresh();
			this.byId("idTerminal").setValueState(sap.ui.core.ValueState.None);
		},

		// Code added By rabi
		onProductSuggestedItemSelected: function(oEvent) {
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('default');
			this._data.getData().PrdctName = selectedItemContext.getProperty("PrdctName");
			this._data.getData().Prdct = selectedItemContext.getProperty("Prdct");
			this.getModel().refresh();
			//this.byId("ProductListDialog").setValueState(sap.ui.core.ValueState.None);
		},

		handleProductSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("PrdctName", sap.ui.model.FilterOperator.StartsWith, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},
		// Code Ended By Rabi

		handleVesselSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
		}

	});

});