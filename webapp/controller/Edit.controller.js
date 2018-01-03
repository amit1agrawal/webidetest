sap.ui.define([
	"com/spc/fiori/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, History, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("com.spc.fiori.controller.Edit", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.spc.fiori.view.view.AddNew
		 */
			onInit: function() {
				
				this._itemData = new JSONModel({
					"Dnsty" : 0.00,
					"Barrl" : 0.00,
					"LTon" : 0.00,
					"MTon" : 0.00,
					"Api" : 0.00
				});
				this._itemData.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this.getView().setModel(this._itemData, 'totalModel');
				
				this.getOwnerComponent().getRouter().getRoute("edit").attachPatternMatched(this._onEditMatched, this);
				// Code Added By Rabi
				var bolSysDate = new Date();
				this.getView().setModel(new JSONModel({
					"bolSysDateEdit" : bolSysDate
				}), 'bolSysDateEdit');
				// Code Ended By Rabi
				
			},
			
			_onEditMatched: function(oEvent){
				//var aHeader = this.getModel().getObject( "/" + sObjectPath, null, null);
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				// Store Bol ID with this
				this._oObjectId = sObjectId;
				var sObjectPath = this.getOwnerComponent().getModel().createKey("BolDocHdrS", {
					BolSerial :  sObjectId
				});
				this._data = new JSONModel("{}");
				var aModel = this.getOwnerComponent().getModel();
				var that = this;
				aModel.read("/" + sObjectPath , {
							  	success: function(oData, response){
							  		that._data = new JSONModel(oData);
							  		that._data.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
							  		that._showHideTableColumns(that._data.getData().PrdctType);
							  		that._setLTonEditState(that._data.getData().PrdctType);
							  		
							  		aModel.read("/" + sObjectPath + "/HdrToItms" , {
									  	success: function(oData, response){
									  		that._setObjectItem(oData);
										}, 
										error: function(oError){
											var error = oError;
										}
									});
								}, 
								error: function(oError){
									var error = oError;
								}
				});
				//var aHeader = this.getModel().getObject( "/" + sObjectPath, null, null);
				//this._data = new JSONModel(aHeader);
				this.getView().setModel(this._data);		  
				this.getView().bindElement("/");
			},
			
			_setObjectItem: function(oItem){
				//var aItem = oItem;
				this._data.getData().HdrToItms = oItem.results;
				/*this.getView().setModel(this._data);		  
				this.getView().bindElement("/");*/
				//this.getView().getModel().refresh();
				this.getView().setModel(this._data);
				this._calculateTotal();
				this.getView().bindElement("/");
			},
			
			_showHideTableColumns: function(sProdType){
				if (sProdType === "02"){
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
			
			_calculateTotal: function(){
				//Reset the total
				this._itemData.getData().Dnsty = 0.00;
				this._itemData.getData().Barrl = 0.00;
				this._itemData.getData().LTon = 0.00;
				this._itemData.getData().MTon = 0.00;
				this._itemData.getData().Api = 0.00;
				// Calculate the total
				for (var i = 0 ; i< this._data.getData().HdrToItms.length; i++){
					this._itemData.getData().Dnsty = this._itemData.getData().Dnsty + parseFloat(this._data.getData().HdrToItms[i].Dnsty);
					this._itemData.getData().Barrl = this._itemData.getData().Barrl + parseFloat(this._data.getData().HdrToItms[i].Barrl);
					this._itemData.getData().LTon = this._itemData.getData().LTon + parseFloat(this._data.getData().HdrToItms[i].LTon);
					this._itemData.getData().MTon = this._itemData.getData().MTon + parseFloat(this._data.getData().HdrToItms[i].MTon);
					this._itemData.getData().Api = this._itemData.getData().Api + parseFloat(this._data.getData().HdrToItms[i].Api);
				}
				
				this._itemData.getData().Dnsty = parseFloat(this._itemData.getData().Dnsty.toFixed(6)) ;
				this._itemData.getData().Barrl = parseFloat(this._itemData.getData().Barrl.toFixed(2));
				this._itemData.getData().LTon = parseFloat(this._itemData.getData().LTon.toFixed(3));
				this._itemData.getData().MTon = parseFloat(this._itemData.getData().MTon.toFixed(3));
				this._itemData.getData().Api = parseFloat(this._itemData.getData().Api.toFixed(6));
				//refresh the model
				this.getView().getModel('totalModel').refresh();
				this.checkTotalLTonGTGRT();
			},
			
			checkTotalLTonGTGRT: function(){
				var aTotalLTon = this._itemData.getData().LTon;
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
			
			_calculateTotalLive: function(){
				
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
				
				if (this._data.getData().PrdctType === "02"){
					this.byId("ipBarrel").setEditable(false);
					this.byId("ipApi").setEditable(false);
					this.byId("ipLTon").setEditable(false);
				}
				else if (this._data.getData().PrdctType === "01"){
					this.byId("ipMTon").setEditable(false);
					this.byId("ipDensity").setEditable(false);
				}
				else{
					return; //do nothing
				}
			},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.spc.fiori.view.view.AddNew
		 */
		//	onExit: function() {
		//
		//	}
		
		onCancelDialog: function(oEvent){
			this._isNewItem = false;
			this._addNewItemPage.close();
			this._addNewItemPage.destroy(true);
			this._addNewItemPage = null;
		},
		
		handleAddItemPress: function(){
			
			if (this._data.getData().PrdctType === "" || this._data.getData().PrdctType === undefined){
				MessageToast.show("Product Type should be selected before entering Cargo detail information.");
				return;
			}
			
			if (!this._addNewItemPage) {
				this._addNewItemPage = sap.ui.xmlfragment('NewCargoInfo', "com.spc.fiori.view.fragments.NewCargoInfo", this);
				this.getView().addDependent(this._addNewItemPage);
			}
			
			//Disable some fields based on ProductType. BusinessRequirement
			if (this._data.getData().PrdctType === "01"){ // Crude
				sap.ui.core.Fragment.byId("NewCargoInfo","inpMTon").setVisible(false);
				sap.ui.core.Fragment.byId("NewCargoInfo","inpDensity").setVisible(false);
			} 
			else if (this._data.getData().PrdctType === "02"){ //Gas
				sap.ui.core.Fragment.byId("NewCargoInfo","inpBarrels").setVisible(false);
				sap.ui.core.Fragment.byId("NewCargoInfo","inpAPI").setVisible(false);
				sap.ui.core.Fragment.byId("NewCargoInfo","inpLTons").setEditable(false);
			}
			
			this._isNewItem = true;
			this._addNewItemPage.setModel(new JSONModel({
					"PrdctName": "",
					"Prdct": "",
					"Prtnr": "",
					"PrtnrName":"",
					"Dest": "",
					"DestName": "",
					"Barrl": "",
					"LTon":"",
					"Api":"",
					"MTon":"",
					"Dnsty":""
			}));
			
			this._addNewItemPage.bindElement("/");
			this._addNewItemPage.open();
		},
		
		_replaceNullWithZeros: function(sValues){
			if (sValues.Dnsty === ""){
				sValues.Dnsty = 0.00;
			}
			if (sValues.Api === ""){
				sValues.Api = 0.00;
			}
			if (sValues.LTon === ""){
				sValues.LTon = 0.00;
			}
			if (sValues.MTon === ""){
				sValues.MTon = 0.00;
			}
			if (sValues.Barrl === ""){
				sValues.Barrl = 0.00;
			}
			return sValues;
		},
		
		onCloseDialog: function(oEvent){
	
			var aValues = this._addNewItemPage.getModel().getJSON();
			aValues = JSON.parse(aValues);
			aValues = this._replaceNullWithZeros(aValues);
			aValues.Dnsty = parseFloat(parseFloat(aValues.Dnsty).toFixed(6));
			aValues.Api = parseFloat(parseFloat(aValues.Api).toFixed(6));
			aValues.Barrl = parseFloat(parseFloat(aValues.Barrl).toFixed(2));
			aValues.LTon = parseFloat(parseFloat(aValues.LTon).toFixed(3));
			aValues.MTon = parseFloat(parseFloat(aValues.MTon).toFixed(3));
			
			var aJSONObj = {
				Api: aValues.Api ,
				Barrl:aValues.Barrl,
				BolSerial:this._oObjectId,
				Dest:aValues.Dest,
				DestName:aValues.DestName,
				LTon:aValues.LTon,
				Prdct:aValues.Prdct,
				PrdctName:aValues.PrdctName,
				Prtnr:aValues.Prtnr,
				PrtnrName:aValues.PrtnrName,
				Dnsty: aValues.Dnsty,
				MTon: aValues.MTon
			};
			if (this._data.getData().HdrToItms === undefined){
				this._data.getData().HdrToItms = []; //Empty Array
			}
			this._data.getData().HdrToItms.push(aJSONObj);
			this.getView().getModel().refresh();
			this._calculateTotal();
			this._isNewItem = false;
			this._addNewItemPage.close();
			this._addNewItemPage.destroy(true);
			this._addNewItemPage = null;
		},
		
		handleItemCancelPress: function(oEvent){
			var aItemPath = oEvent.getSource().getParent().getBindingContextPath();
			var res = aItemPath.split("/");
			//delete this._data.oData.CargoInfo[res[2]];
			// Delete the element from JSON Model
			this._data.getData().HdrToItms.splice(res[2], 1);
			this._calculateTotal();
			this.getView().getModel().refresh();
		},
		
		handleCancelPress: function(){
			var that = this;
			MessageBox.show("All changes will be lost. Do you still want to Cancel?", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Cancel",
					actions: [sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL ],
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.OK){

							var oHistory = History.getInstance();
							var sPreviousHash = oHistory.getPreviousHash();
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							if (sPreviousHash !== undefined) {
								// It's going to Home page. TODO: Correct this later on.
								window.history.go(-1);
								//oRouter.navTo("object", {objectId : this._objectId}, true);
							} 
							else {
								//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
								// Navigation to defaul view
								oRouter.navTo("master", true);
							}
							
							//that.getRouter().navTo("object", {objectId : that._data.getData().BolSerial}, true);
							//that.getView().destroy();
						}
						else if (oAction === sap.m.MessageBox.Action.CANCEL){}
					}
					});
		},
		
		onSavePress: function(){
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			this._data.getData().LodComncdAt = this._changeDateFormat(this._data.getData().LodComncdAt);
			this._data.getData().LodCompltAt = this._changeDateFormat(this._data.getData().LodCompltAt);
			this._data.getData().VsslSldAt = this._changeDateFormat(this._data.getData().VsslSldAt);
			// TODO: Set the BolDate temporarily as the backend records don't have it.
			// TODO: REMOVE THIS CODE LATER!!
			if (this._data.getData().BolDate === undefined || this._data.getData().BolDate === null){
				this._data.getData().BolDate = this._changeDateFormat(new Date());
			}
			this._data.getData().DocType = "U";
			
			if (this._containsNullValues() === true){
				MessageToast.show("Fill in all mandatory fields before saving.");
				return;
			}
			
			// The backend expects X for True and " " for false. ABAP true and false
			if (this._data.getData().Carryfwd === true){
				this._data.getData().Carryfwd = "X";
			}
			else{
				this._data.getData().Carryfwd = " ";
			}
			// Convert numbers in items to String. oData accepts only strings
			for (var i = 0; i < this._data.getData().HdrToItms.length; i++) {
				this._data.getData().HdrToItms[i].BolSerial = this._data.getData().BolSerial;
				this._data.getData().HdrToItms[i].Dnsty = this._data.getData().HdrToItms[i].Dnsty.toString();
				this._data.getData().HdrToItms[i].Barrl = this._data.getData().HdrToItms[i].Barrl.toString();
				this._data.getData().HdrToItms[i].LTon = this._data.getData().HdrToItms[i].LTon.toString();
				this._data.getData().HdrToItms[i].MTon = this._data.getData().HdrToItms[i].MTon.toString();
				this._data.getData().HdrToItms[i].Api = this._data.getData().HdrToItms[i].Api.toString();
			}
			
			oModel.create('/BolDocHdrS', this._data.getData(), {
				success: function(oData, oResponse){
					MessageToast.show("Request created successfully");
					// TODO: Navigate out of AddNew Page
					that._data = null;
					that.getRouter().navTo("object", {objectId : oData.BolSerial}, true);
					//that.getRouter().navTo("master", null);
				},
				error:function(oData,oResponse) {
					var errorMessage = JSON.parse(oData.responseText).error.innererror.errordetails[0].message;
					MessageBox.show(errorMessage, {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function(oAction) {
						that._data = null;
						that.getRouter().navTo("master", null);
					}
					});
				}
			});
		},
		
		_changeDateFormat: function(oDate){
			// Convert to ISO String if input is a javascript Date else just return in value
			if (oDate.toISOString !== undefined){
				return oDate.toISOString().slice(0,-5);
			}
			return oDate;
		},
		
		handleVesselValueHelp: function(){
			if (!this._vesselListDialog ) {
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
			
			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_VSSLSet" , {
				  	success: function(oData, response){
				  		that._vesselListDialog.setModel(new JSONModel(oData.results), 'VesselListModel');
					}, 
					error: function(oError){}
			});
			
			this._vesselListDialog.open();
		},
		
		handleVesselDialogClose: function(oEvent){
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('VesselListModel');
			this._data.getData().Vssl = selectedItemContext.getProperty("ShipCode");
			this._data.getData().VsslName = selectedItemContext.getProperty("Ltext");
			
			var selectedItemIndex = oEvent.getParameter("selectedContexts")[0].sPath.split("/")[1];
			this._data.getData().Sdwt = this._vesselListDialog.getModel('VesselListModel').getData()[selectedItemIndex].Sdwt;
			this._data.getData().Grt = this._vesselListDialog.getModel('VesselListModel').getData()[selectedItemIndex].Grt;
			/*var aModel = this.getView().getModel();
			var sObjectPath = this.getModel().createKey("BolDocHdrS", {
					BolSerial :  this._oObjectId
				});
				
			aModel.setProperty("/" + sObjectPath + "/VsslName", selectedItemContext.getProperty("VsslName"));
			aModel.setProperty("/" + sObjectPath + "/Vssl", selectedItemContext.getProperty("Vssl"));*/
			// Code added by Rabi
			this.byId("name").setValueState(sap.ui.core.ValueState.None);
			// Code ended by Rabi
			this.getModel().refresh();
		},
		
		handleAgentValueHelp: function(){
			if (!this._agentListDialog ) {
				this._agentListDialog = sap.ui.xmlfragment('agentListDialog', "com.spc.fiori.view.fragments.AgentNo", this);
				this.getView().addDependent(this._agentListDialog);
			}
			
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
			aModel.read("/SH_AGENTSet" , {
				  	success: function(oData, response){
				  		that._agentListDialog.setModel(new JSONModel(oData.results), 'AgentListModel');
					}, 
					error: function(oError){}
			});
			
			this._agentListDialog.open();
		},
		
		handleAgentDialogClose: function(oEvent){
			
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('AgentListModel');
			this._data.oData.Agent = selectedItemContext.getProperty("Partner");
			this._data.oData.AgentName = selectedItemContext.getProperty("NameOrg1");
			this.byId("inpAgent").setValueState(sap.ui.core.ValueState.None);
			this.getModel().refresh();
			
			/*var aModel = this.getView().getModel();
			var sObjectPath = this.getModel().createKey("BolDocHdrS", {
					BolSerial :  this._oObjectId
				});
				
			aModel.setProperty("/" + sObjectPath + "/Agent", selectedItemContext.getProperty("Partner"));
			aModel.setProperty("/" + sObjectPath + "/AgentName", selectedItemContext.getProperty("NameOrg1"));
			aModel.refresh();*/
		},
		
		handleTerminalValueHelp: function(oEvent){
			if (!this._TerminalListDialog ) {
				this._TerminalListDialog = sap.ui.xmlfragment('terminalListDialog', "com.spc.fiori.view.fragments.Terminal", this);
				this.getView().addDependent(this._TerminalListDialog);
			}
			
			/*this._TerminalListDialog.setModel(new JSONModel([{
				"TerminalDesc": "Terminal1",
				"Terminal": "001"
			}, {
				"TerminalDesc": "Terminal2",
				"Terminal": "002"
			}, {
				"TerminalDesc": "Terminal3",
				"Terminal": "003"
			}]), 'TerminalListModel');*/
			
			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			aModel.read("/SH_TerminalSet" , {
				  	success: function(oData, response){
				  		that._TerminalListDialog.setModel(new JSONModel(oData.results), 'TerminalListModel');
					}, 
					error: function(oError){}
			});
			
			this._TerminalListDialog.open();
		},
		
		handleTerminalDialogClose: function(oEvent){
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('TerminalListModel');
			this._data.getData().Terminal = selectedItemContext.getProperty("Term");
			this._data.getData().TerminalDesc = selectedItemContext.getProperty("TermTxt");
			this.byId("inpTerminal").setValueState(sap.ui.core.ValueState.None);
			this.getModel().refresh();
			
			/*var aModel = this.getView().getModel();
			var sObjectPath = this.getModel().createKey("BolDocHdrS", {
					BolSerial :  this._oObjectId
				});
				
			aModel.setProperty("/" + sObjectPath + "/Terminal", selectedItemContext.getProperty("Terminal"));
			aModel.setProperty("/" + sObjectPath + "/TerminalDesc", selectedItemContext.getProperty("TerminalDesc"));
			aModel.refresh();*/
		},
		handleProductValueHelp: function(oEvent){
			if (!this._ProductListDialog ) {
				this._ProductListDialog = sap.ui.xmlfragment('ProductListDialog', "com.spc.fiori.view.fragments.Product", this);
				this.getView().addDependent(this._ProductListDialog);
			}
			
			var aItemPath = oEvent.getSource().getBindingContext().getPath();
			var res = aItemPath.split("/");
			this._itemIndex = res[2];
			
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
			
			var aModel = this.getOwnerComponent().getModel();
			var that = this;
			// Create Filter for ProductType and Terminal
			var aFilters = new Array();
			if (this._data.getData().Terminal === ""){
				MessageToast.show("Terminal is a mandatory field for Product");
				return;
			}
			if (this._data.getData().PrdctType === ""){
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
            
            // TODO: Uncomment below lines once oData service works properly
            /*var aQuery = "/SH_PROD_PART_CMP(Terminal='" + this._data.getData().Terminal + "',ProdType='" + this._data.getData().PrdctType + "')";
            aModel.read(aQuery, {
				  	success: function(oData, response){
				  		that._ProductListDialog.setModel(new JSONModel(oData.results), 'ProductListModel');
					}, 
					error: function(oError){}
			});*/
			
			aModel.read("/SH_PROD_PART_CMPSet" , {
					filters: aFilters,
				  	success: function(oData, response){
				  		that._ProductListDialog.setModel(new JSONModel(oData.results), 'ProductListModel');
					}, 
					error: function(oError){}
			});
			this._ProductListDialog.open();
		},
		
		handleProductDialogClose: function(oEvent){
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('ProductListModel');
			// Update the selected Item ( and not header)
			if (this._isNewItem !== undefined && this._isNewItem === true){
				this._addNewItemPage.getModel().getData().PrdctName = selectedItemContext.getProperty("PrdctName");
				this._addNewItemPage.getModel().getData().Prdct = selectedItemContext.getProperty("Prdct");
				this._addNewItemPage.getModel().refresh();
			}
			else{
				this._data.getData().HdrToItms[this._itemIndex].PrdctName = selectedItemContext.getProperty("PrdctName");
				this._data.getData().HdrToItms[this._itemIndex].Prdct = selectedItemContext.getProperty("Prdct");
				this.getModel().refresh();
			}
		},
		
		handlePartnerValueHelp: function(oEvent){
			if (!this._PartnerListDialog ) {
				this._PartnerListDialog = sap.ui.xmlfragment('PartnerListDialog', "com.spc.fiori.view.fragments.Partner", this);
				this.getView().addDependent(this._PartnerListDialog);
			}
			
			var aItemPath = oEvent.getSource().getBindingContext().getPath();
			var res = aItemPath.split("/");
			this._itemIndex = res[2];
			
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
			
			if (this._data.getData().Terminal === ""){
				MessageToast.show("Terminal is a mandatory field for Partner");
				return;
			}
			if (this._data.getData().PrdctType === ""){
				MessageToast.show("Product Type is a mandatory field for Partner");
				return;
			}
			if (this._data.getData().Prdct === ""){
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
                     value1: this._data.getData().Prdct
            });
            
            aFilters.push(aTerminalFilter);
            aFilters.push(aProductTypeFilter);
            aFilters.push(aPartnerFilter);
            
			aModel.read("/SH_PROD_PART_CMPSet" , {
					filters: aFilters,
				  	success: function(oData, response){
				  		that._PartnerListDialog.setModel(new JSONModel(oData.results), 'PartnerListModel');
					}, 
					error: function(oError){}
			});
			
			this._PartnerListDialog.open();
		},
		
		handlePartnerDialogClose: function(oEvent){
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('PartnerListModel');
			if (this._isNewItem !== undefined && this._isNewItem === true){
				this._addNewItemPage.getModel().getData().Prtnr = selectedItemContext.getProperty("Prtnr");
				this._addNewItemPage.getModel().getData().PrtnrName = selectedItemContext.getProperty("PrtnrName");
				this._addNewItemPage.getModel().refresh();
			}
			else{
				this._data.getData().HdrToItms[this._itemIndex].Prtnr = selectedItemContext.getProperty("Prtnr");
				this._data.getData().HdrToItms[this._itemIndex].PrtnrName = selectedItemContext.getProperty("PrtnrName");
				this.getModel().refresh();
			}
			/*var aModel = this.getView().getModel();
			var sObjectPath = this.getModel().createKey("BolDocHdrS", {
					BolSerial :  this._oObjectId
				});*/
				
			/*aModel.setProperty("/" + sObjectPath + "/Prtnr", selectedItemContext.getProperty("Partner"));
			aModel.setProperty("/" + sObjectPath + "/PrtnrName", selectedItemContext.getProperty("NameOrg1"));*/
		},
		
		handleDestinationValueHelp: function(oEvent){
			if (!this._DestinationListDialog ) {
				this._DestinationListDialog = sap.ui.xmlfragment('DestinationListDialog', "com.spc.fiori.view.fragments.Destination", this);
				this.getView().addDependent(this._DestinationListDialog);
			}
			
			var aItemPath = oEvent.getSource().getBindingContext().getPath();
			var res = aItemPath.split("/");
			this._itemIndex = res[2];
			
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
			aModel.read("/SH_DESTSet" , {
				  	success: function(oData, response){
				  		that._DestinationListDialog.setModel(new JSONModel(oData.results), 'DestinationListModel');
					}, 
					error: function(oError){}
			});
			
			this._DestinationListDialog.open();
		},
			
		handleDestinationDialogClose: function(oEvent){
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('DestinationListModel');
			
			if (this._isNewItem !== undefined && this._isNewItem === true){
				this._addNewItemPage.getModel().getData().DestName = selectedItemContext.getProperty("Landx");
				this._addNewItemPage.getModel().getData().Dest = selectedItemContext.getProperty("Land1");
				this._addNewItemPage.getModel().refresh();
			}
			else{
				this._data.getData().HdrToItms[this._itemIndex].DestName = selectedItemContext.getProperty("Landx");
				this._data.getData().HdrToItms[this._itemIndex].Dest = selectedItemContext.getProperty("Land1");
				this.getModel().refresh();
			}
			/*var aModel = this.getView().getModel();
			var sObjectPath = this.getModel().createKey("BolDocHdrS", {
					BolSerial :  this._oObjectId
				});*/
				
			/*aModel.setProperty("/" + sObjectPath + "/Dest", selectedItemContext.getProperty("Land1"));
			aModel.setProperty("/" + sObjectPath + "/DestName", selectedItemContext.getProperty("Landx"));*/
		},
		
		handleProductTypeValueHelp: function (){
			if (!this._ProductTypeListDialog ) {
				this._ProductTypeListDialog = sap.ui.xmlfragment('ProductTypeListDialog', "com.spc.fiori.view.fragments.ProductType", this);
				this.getView().addDependent(this._ProductTypeListDialog);
			}
			
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
			aModel.read("/SH_PROD_TYPESet" , {
				  	success: function(oData, response){
				  		that._ProductTypeListDialog.setModel(new JSONModel(oData.results), 'ProductTypeListModel');
					}, 
					error: function(oError){}
			});
			
			this._ProductTypeListDialog.open();
		},
		
		handleProductTypeDialogClose: function(oEvent){
			var selectedItemContext = oEvent.getParameter('selectedItem').getBindingContext('ProductTypeListModel');
			if (this._data.getData().PrdctType === selectedItemContext.getProperty("PrdctType") ){
				this._data.getData().PrdctType = selectedItemContext.getProperty("PrdctType");
				this._data.getData().PrdctTypeDesc = selectedItemContext.getProperty("PrdctTypeDesc");
				// Reset the value state if set to Error
				this.byId("inpProdType").setValueState(sap.ui.core.ValueState.None);
				this.getModel().refresh();
			}
			else{
				var that = this;
				MessageBox.show("All Cargo Detailed Information will be deleted. Do you want to continue?", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Change Product Type",
					actions: [sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL ],
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.OK){
							that._setLTonEditState(selectedItemContext.getProperty("PrdctType"));
							/*if (selectedItemContext.getProperty("PrdctType") === "02"){ //Gas
								that.byId("ipLTon").setEditable(false);
								that.byId("ipBarrel").setEditable(false);
			                    that.byId("ipApi").setEditable(false);
			                    that.byId("ipMTon").setEditable(true);
                    			that.byId("ipDensity").setEditable(true);
							}
							else if (selectedItemContext.getProperty("PrdctType") === "01"){ // Crude
								that.byId("ipLTon").setEditable(true);
								
								that.byId("ipMTon").setEditable(false);
                    			that.byId("ipDensity").setEditable(false);
                    			that.byId("ipBarrel").setEditable(true);
			                    that.byId("ipApi").setEditable(true);
							}*/
							that._data.getData().PrdctType = selectedItemContext.getProperty("PrdctType");
							that._data.getData().PrdctTypeDesc = selectedItemContext.getProperty("PrdctTypeDesc");
							that._data.getData().HdrToItms = []; // ProductType is changed so Delete existing items
							that._calculateTotal();
							that.byId("inpProdType").setValueState(sap.ui.core.ValueState.None);
							// Change the Columns in Cargo Table
							that._showHideTableColumns(that._data.getData().PrdctType);
							that.getModel().refresh();
						}
						else if (oAction === sap.m.MessageBox.Action.CANCEL){
							return; // do nothing
						}
					}
					});
			}
			
		/*	this._data.getData().PrdctType = selectedItemContext.getProperty("PrdctType");
			this._data.getData().PrdctTypeDesc = selectedItemContext.getProperty("PrdctTypeDesc");
			this._data.getData().HdrToItms = []; // ProductType is changed so Delete existing items
			this.getModel().refresh();*/
			
			/*var aModel = this.getView().getModel();
			var sObjectPath = this.getModel().createKey("BolDocHdrS", {
					BolSerial :  this._oObjectId
				});
				
			aModel.setProperty("/" + sObjectPath + "/PrdctTypeDesc", selectedItemContext.getProperty("PrdctTypeDesc"));
			aModel.setProperty("/" + sObjectPath + "/PrdctType", selectedItemContext.getProperty("PrdctType"));
			this.getModel().refresh();*/
		},
		
			
		_setLTonEditState: function(sProdType){
			if (sProdType === "02"){ //Gas
				this.byId("ipLTon").setEditable(false);
			}
			else if (sProdType === "01"){ // Crude
				this.byId("ipLTon").setEditable(true);
			}
		},
	
		onMTonChange: function(oEvent){
			// Apply formula to convert MTons to LTons
			this._addNewItemPage.getModel().getData().LTon = (oEvent.getSource().getValue() * 0.98421).toString();
			this._addNewItemPage.getModel().refresh();
		},
		
		_containsNullValues: function(){
		/*	if (this._data.getData().BolSerial === "" || this._data.getData().BolDate === "" 
				|| this._data.getData().VsslName === "" || this._data.getData().Vssl === ""
				|| this._data.getData().LodComncdAt === "" || this._data.getData().LodCompltAt === ""
				|| this._data.getData().Agent === "" || this._data.getData().AgentName === ""
				|| this._data.getData().Grt === "" || this._data.getData().Sdwt === ""
				|| this._data.getData().VsslSldAt === "" || this._data.getData().TerminalDesc === "" 
				|| this._data.getData().Terminal === "" || this._data.getData().PrdctTypeDesc === ""
				|| this._data.getData().PrdctType === "" || this._data.getData().SrNo === "")*/
				{
			
					if (this.getView().byId("name").getValue() === ""){
						this.byId("name").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					if (this.getView().byId("name").getValue() === ""){
						this.byId("name").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					if (this.getView().byId("idBolDate").getValue() === ""){
						this.byId("idBolDate").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					if (this.getView().byId("inpAgent").getValue() === ""){
						this.byId("inpAgent").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
						if (this.getView().byId("inpProdType").getValue() === ""){
						this.byId("inpProdType").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					
						if (this.getView().byId("inpTerminal").getValue() === ""){
						this.byId("inpTerminal").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					
					if (this.getView().byId("dtloading").getValue() === ""){
						this.byId("dtloading").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					
					if (this.getView().byId("dtloadingCom").getValue() === ""){
						this.byId("dtloadingCom").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					
					if (this.getView().byId("dtloadingVes").getValue() === ""){
						this.byId("dtloadingVes").setValueState(sap.ui.core.ValueState.Error);
						return true;
					}
					
					
				/*	if (this._data.getData().LodComncdAt === ""){
						this.byId("idCommencedAt").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().LodCompltAt === ""){
						this.byId("idCompletedAt").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().Agent === ""){
						this.byId("idAgent").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().AgentName === ""){
						this.byId("idAgent").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().VsslSldAt === ""){
						this.byId("idSealedAt").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().TerminalDesc === ""){
						this.byId("idTerminal").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().Terminal === ""){
						this.byId("idTerminal").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().PrdctTypeDesc === ""){
						this.byId("idProductType").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().PrdctType === ""){
						this.byId("idProductType").setValueState(sap.ui.core.ValueState.Error);
					}
					if (this._data.getData().SrNo === ""){
						this.byId("idSerialNo").setValueState(sap.ui.core.ValueState.Error);
					}*/
				//	return true ;
				}
			return false;
		},
		
		// Code Added By Rabi
		handleChange:function(){
		if(this.getView().byId("dtloading").getValue()!==""){
			this.getView().byId("dtloading").setValueState(sap.ui.core.ValueState.None);
			
		}
			if(this.getView().byId("dtloadingCom").getValue()!==""){
				this.getView().byId("dtloadingCom").setValueState(sap.ui.core.ValueState.None);
			}
			if(this.getView().byId("dtloadingVes").getValue()!==""){
				this.getView().byId("dtloadingVes").setValueState(sap.ui.core.ValueState.None);
			}
		},
		
		handleChangeComplAt: function(oEvent){
			this.handleChange();
			var aSource = oEvent.getSource();
			var oDate = new Date(aSource.getValue());
			
			if ( this._data.getData().LodComncdAt !== "" || this._data.getData().LodComncdAt !== undefined ){
				var oCmmcdDate = new Date(this._data.getData().LodComncdAt);
				if ( oDate < oCmmcdDate){
					MessageToast.show("Loading completed Date should be after Loading commenced date");
					aSource.setValueState(sap.ui.core.ValueState.Error);
					aSource.setValue("");
					return;
				}
			}
		},
		
		handleChangeSldAt: function(oEvent){
			this.handleChange();
			var aSource = oEvent.getSource();
			var oDate = new Date(aSource.getValue());
			
			if ( this._data.getData().LodCompltAt !== "" || this._data.getData().LodCompltAt !== undefined ){
				var oCmmcdDate = new Date(this._data.getData().LodCompltAt);
				if ( oDate < oCmmcdDate){
					MessageToast.show("Vessel sealed Date should be after Loading completed date");
					aSource.setValueState(sap.ui.core.ValueState.Error);
					aSource.setValue("");
					return;
				}
			}
		},
		
		resetValueState: function(oEvent){
			var aSource = oEvent.getSource();
			aSource.setValueState(sap.ui.core.ValueState.None);
		},
		// Code Ended By Rabi
		
		// Code Added By rabi
		handleSearch: function(oEvent) {

			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
				filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("NameOrg1", sap.ui.model.FilterOperator.Contains, searchString),
				            new sap.ui.model.Filter("Partner", sap.ui.model.FilterOperator.Contains, searchString)],false);
			}
	
			oEvent.getSource().getBinding("items").filter(filters);
		},
		
		handleSearchVessel:function(oEvent){
		 var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, searchString),
				            new sap.ui.model.Filter("ShipCode", sap.ui.model.FilterOperator.Contains, searchString)],false);
			}

			oEvent.getSource().getBinding("items").filter(filters);	
		},
		handleSearchProdType:function(oEvent){
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("PrdctTypeDesc", sap.ui.model.FilterOperator.Contains, searchString),
				            new sap.ui.model.Filter("PrdctType", sap.ui.model.FilterOperator.Contains, searchString)],false);
			}

			oEvent.getSource().getBinding("items").filter(filters);	
		},
		
		handleTerminalSearch:function(oEvent){
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("TermTxt", sap.ui.model.FilterOperator.Contains, searchString),
				            new sap.ui.model.Filter("Term", sap.ui.model.FilterOperator.Contains, searchString)],false);
			}

			oEvent.getSource().getBinding("items").filter(filters);	
		},
		
		handleSearchProd:function(oEvent){
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
			           filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("PrdctName", sap.ui.model.FilterOperator.Contains, searchString),
				       new sap.ui.model.Filter("Prdct", sap.ui.model.FilterOperator.Contains, searchString)],false);
				
			
			}

			oEvent.getSource().getBinding("items").filter(filters);
			
		},
		handleSearchPartner:function(oEvent){
				var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
					filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("PrtnrName", sap.ui.model.FilterOperator.Contains, searchString),
				       new sap.ui.model.Filter("Prtnr", sap.ui.model.FilterOperator.Contains, searchString)],false);
				
			}

			oEvent.getSource().getBinding("items").filter(filters);
			
		},
		
		handleSearchDes:function(oEvent){
			var searchString = oEvent.getParameter("value");
			var filters = [];
			if (searchString && searchString.length > 0) {
				//var tmpSearchStr = FarmAppUtil.formatSearchString(searchString);//"'"+searchString.toUpperCase()+"'";
				//	filters = [new sap.ui.model.Filter("toupper(name)", sap.ui.model.FilterOperator.Contains, tmpSearchStr)];
					filters = new sap.ui.model.Filter([ new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, searchString),
				       new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.Contains, searchString)],false);
				
			}
			oEvent.getSource().getBinding("items").filter(filters);
		}
		// Code Ended By Rabi
		
	});

});


/*this._data = new JSONModel({
					"BolSerial": "",
					"BolDate": "",
					"SrNo": "",
					"VesselName": "",
					"Vssl": "1234",
					"LodComncdAt": "Test",
					"LodCompltAt": "Test",
					"Agent": "12345",
					"AgentName": "Test",
					"Grt": "100",
					"Sdwt": "200",
					"Lvl": "",
					"Status":"",
					"VsslSldAt": "Test",
					"TerminalDesc": "Terminal1",
					"Terminal": "T001",
					"PrvsBolNo": "112",
					"IMO": "423",
					"PrdctTypeDesc": "Crude Oil",
					"PrdctType": "PRD001",
					"Return":"",
					"DocType":"",
					"CargoInfo": [
						{
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
						}
					]});*/