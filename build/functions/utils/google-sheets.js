"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.authorize=authorize;exports.getAuthUrl=getAuthUrl;exports.getToken=getToken;const googleAuth=require("google-auth-library");const auth=new googleAuth;let client,scope;function authorize(client_id,secret,redirect,client_scope){scope=client_scope;return client=new auth.OAuth2(client_id,secret,redirect)}function getAuthUrl(){return client.generateAuthUrl({access_type:"offline",scope,prompt:"consent"})}function getToken(code){return new Promise((resolve,reject)=>{client.getToken(code,(err,tokens)=>{if(err)reject(err);resolve(tokens);return})})}
//# sourceMappingURL=google-sheets.js.map