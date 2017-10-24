"use strict";Object.defineProperty(exports,"__esModule",{value:true});let replaceSheet=exports.replaceSheet=(()=>{var _ref=_asyncToGenerator(function*(spreadsheet_id,sheet_id,values){/* await new Promise((resolve, reject) => {
		googleApis.sheets("v4").spreadsheets.batchUpdate({	
			spreadsheetId: spreadsheet_id,
			resource : {
				requests : [{
					updateCells : {
						range: {
							sheetId: 0
						},
						fields: "userEnteredValue"
					}
				}]
			}
		}, (err, res) => {
			if (err) {return reject(err)}
			return resolve(res)
		})
	}) */return yield updateCells(spreadsheet_id,sheet_id+"!A1:"+values.length,values)});return function replaceSheet(_x,_x2,_x3){return _ref.apply(this,arguments)}})();exports.getAuthUrl=getAuthUrl;exports.getToken=getToken;exports.authorize=authorize;exports.appendToSheet=appendToSheet;exports.updateCells=updateCells;function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step("next",value)},function(err){step("throw",err)})}}return step("next")})}}const googleApis=require("googleapis");const auth=googleApis.auth.OAuth2;let client,hasCredentials,sheets=false;function getAuthUrl(client_id,client_secret,redirect,scope){client=new auth(client_id,client_secret,redirect);return client.generateAuthUrl({access_type:"offline",scope,prompt:"consent"})}function getToken(client_id,client_secret,redirect,code){client=new auth(client_id,client_secret,redirect);return new Promise((resolve,reject)=>{client.getToken(code,(err,tokens)=>{if(err)reject(err);resolve(tokens);return})})}function authorize(clientInfo){client=new auth(clientInfo.id,clientInfo.secret,clientInfo.redirect);client.setCredentials(clientInfo.tokens);googleApis.options({auth:client});hasCredentials=true;return this}function appendToSheet(sheet_id,values){return new Promise((resolve,reject)=>{if(!hasCredentials){return reject("Not authorized.")}googleApis.sheets("v4").spreadsheets.values.append({spreadsheetId:sheet_id,range:"A:C",valueInputOption:"USER_ENTERED",insertDataOption:"INSERT_ROWS",resource:{values:[values]}},(err,response)=>{if(err){return reject(err)}resolve(response)})})}function updateCells(spreadsheetId,range,values){return new Promise((resolve,reject)=>{googleApis.sheets("v4").spreadsheets.values.update({spreadsheetId,range,valueInputOption:"RAW",resource:{values}},(err,res)=>{if(err){return reject(err)}return resolve(res)})})}
//# sourceMappingURL=google.js.map