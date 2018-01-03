sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			},
			
			dateValue: function(sValue){
				if (!sValue){
					return "";
				}
				
				return sValue;
			},
			statusValue: function(sStatus){
				if (sStatus === "A") {
					return "Success";
				} else if (sStatus === "N") {
					return "Warning";
				} else if (sStatus === "R"){
					return "Error";
				} else {
					return "None";
				}
			},
			statusText: function(sStatus){
				if (sStatus === "A") {
					return "Approved";
				} else if (sStatus === "N") {
					return "New";
				} else if (sStatus === "R"){
					return "Rejected";
				} else if (sStatus === "S"){
					return "Submitted";
				}
				else {
					return "None";
				}
			},
			lockedValue: function(sStatus){
				if (sStatus === "A") {
					return true;
				} else if (sStatus === "N") {
					return true;
				} else if (sStatus === "R"){
					return false;
				} else {
					return true;
				}
			},
			editValue: function(sStatus){
				if (sStatus === "A") {
					return false;
				} else if (sStatus === "N") {
					return false;
				} else if (sStatus === "R"){
					return true;
				} 
				else if (sStatus === "S"){
					return true;
				} 
				else {
					return true;
				}
			},
			carryFwdValue: function(sValue){
				if (sValue === "X"){
					return true;
				}
				else if (sValue === " "){
					return false;
				}
				
				return false;
			},
			carryFwdText: function(sValue){
				if (sValue === "X"){
					return "Yes";
				}
				else if (sValue === " "){
					return "No";
				}
				
				return "";
			}
		};

	}
);