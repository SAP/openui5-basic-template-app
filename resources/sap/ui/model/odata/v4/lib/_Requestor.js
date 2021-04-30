/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Batch","./_GroupLock","./_Helper","./_V2Requestor","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/thirdparty/jquery"],function(e,t,r,n,o,i,s){"use strict";var a={Accept:"multipart/mixed"},u="sap.ui.model.odata.v4.lib._Requestor",c,h=/(\$\w+)=~/g,f=/^\d+$/;function p(e){var t;e=e.toLowerCase();for(t in this.headers){if(t.toLowerCase()===e){return this.headers[t]}}}function d(e,t,n,o){this.mBatchQueue={};this.mHeaders=t||{};this.aLockedGroupLocks=[];this.oModelInterface=o;this.sQueryParams=r.buildQuery(n);this.mRunningChangeRequests={};this.oSecurityTokenPromise=null;this.iSessionTimer=0;this.iSerialNumber=0;this.sServiceUrl=e}d.prototype.mFinalHeaders={"Content-Type":"application/json;charset=UTF-8;IEEE754Compatible=true"};d.prototype.mPredefinedPartHeaders={Accept:"application/json;odata.metadata=minimal;IEEE754Compatible=true"};d.prototype.mPredefinedRequestHeaders={Accept:"application/json;odata.metadata=minimal;IEEE754Compatible=true","OData-MaxVersion":"4.0","OData-Version":"4.0","X-CSRF-Token":"Fetch"};d.prototype.mReservedHeaders={accept:true,"accept-charset":true,"content-encoding":true,"content-id":true,"content-language":true,"content-length":true,"content-transfer-encoding":true,"content-type":true,"if-match":true,"if-none-match":true,isolation:true,"odata-isolation":true,"odata-maxversion":true,"odata-version":true,prefer:true,"sap-contextid":true};d.prototype.addChangeSet=function(e){var t=[],r=this.getOrCreateBatchQueue(e);t.iSerialNumber=this.getSerialNumber();r.iChangeSet+=1;r.splice(r.iChangeSet,0,t)};d.prototype.addChangeToGroup=function(e,t){var r;if(this.getGroupSubmitMode(t)==="Direct"){e.$resolve(this.request(e.method,e.url,this.lockGroup(t,this,true,true),e.headers,e.body,e.$submit,e.$cancel))}else{r=this.getOrCreateBatchQueue(t);r[r.iChangeSet].push(e)}};d.prototype.addQueryString=function(e,t,n){var o;n=this.convertQueryOptions(t,n,false,true);e=e.replace(h,function(e,t){var o=n[t];delete n[t];return r.encodePair(t,o)});o=r.buildQuery(n);if(!o){return e}return e+(e.includes("?")?"&"+o.slice(1):o)};d.prototype.batchRequestSent=function(e,t){var r,n;if(t){if(this.mRunningChangeRequests[e]){throw new Error("Unexpected second $batch")}r=new i(function(e){n=e});r.$resolve=n;this.mRunningChangeRequests[e]=r}};d.prototype.batchResponseReceived=function(e,t){if(t){this.mRunningChangeRequests[e].$resolve();delete this.mRunningChangeRequests[e]}};d.prototype.buildQueryString=function(e,t,n,o){return r.buildQuery(this.convertQueryOptions(e,t,n,o))};d.prototype.cancelChanges=function(e){if(this.mRunningChangeRequests[e]){throw new Error("Cannot cancel the changes for group '"+e+"', the batch request is running")}this.cancelChangesByFilter(function(){return true},e);this.cancelGroupLocks(e)};d.prototype.cancelChangesByFilter=function(e,t){var r=false,n=this;function o(t){var o=n.mBatchQueue[t],i,s,a,u,c;for(c=o.length-1;c>=0;c-=1){if(Array.isArray(o[c])){s=o[c];for(u=s.length-1;u>=0;u-=1){i=s[u];if(i.$cancel&&e(i)){i.$cancel();a=new Error("Request canceled: "+i.method+" "+i.url+"; group: "+t);a.canceled=true;i.$reject(a);s.splice(u,1);r=true}}}}}if(t){if(this.mBatchQueue[t]){o(t)}}else{for(t in this.mBatchQueue){o(t)}}return r};d.prototype.cancelGroupLocks=function(e){this.aLockedGroupLocks.forEach(function(t){if((!e||e===t.getGroupId())&&t.isModifying()&&t.isLocked()){t.cancel()}})};d.prototype.checkForOpenRequests=function(){var e=this;if(Object.keys(this.mRunningChangeRequests).length||Object.keys(this.mBatchQueue).some(function(t){return e.mBatchQueue[t].some(function(e){return Array.isArray(e)?e.length:true})})||this.aLockedGroupLocks.some(function(e){return e.isLocked()})){throw new Error("Unexpected open requests")}};d.prototype.checkHeaderNames=function(e){var t;for(t in e){if(this.mReservedHeaders[t.toLowerCase()]){throw new Error("Unsupported header: "+t)}}};d.prototype.cleanUpChangeSets=function(e){var t,n=false,o;function i(e){if(!s(e)){t.push(e)}}function s(e){if(e.method!=="PATCH"){return false}return t.some(function(t){if(t.method==="PATCH"&&t.headers["If-Match"]===e.headers["If-Match"]){r.merge(t.body,e.body);e.$resolve(t.$promise);return true}})}for(o=e.iChangeSet;o>=0;o-=1){t=[];e[o].forEach(i);if(t.length===0){e.splice(o,1)}else if(t.length===1&&this.isChangeSetOptional()){e[o]=t[0]}else{e[o]=t}n=n||t.length>0}return n};d.prototype.clearSessionContext=function(e){if(e){this.oModelInterface.fireSessionTimeout()}delete this.mHeaders["SAP-ContextId"];if(this.iSessionTimer){clearInterval(this.iSessionTimer);this.iSessionTimer=0}};d.prototype.convertExpand=function(e,t){var r,n=[],o=this;if(!e||typeof e!=="object"){throw new Error("$expand must be a valid object")}r=Object.keys(e);if(t){r=r.sort()}r.forEach(function(r){var i=e[r];if(i&&typeof i==="object"){n.push(o.convertExpandOptions(r,i,t))}else{n.push(r)}});return n.join(",")};d.prototype.convertExpandOptions=function(e,t,r){var n=[];this.doConvertSystemQueryOptions(undefined,t,function(e,t){n.push(e+"="+t)},undefined,r);return n.length?e+"("+n.join(";")+")":e};d.prototype.convertQueryOptions=function(e,t,r,n){var o={};if(!t){return undefined}this.doConvertSystemQueryOptions(e,t,function(e,t){o[e]=t},r,n);return o};d.prototype.convertResourcePath=function(e){return e};d.prototype.destroy=function(){this.clearSessionContext()};d.prototype.doCheckVersionHeader=function(e,t,r){var n=e("OData-Version"),o=!n&&e("DataServiceVersion");if(o){throw new Error("Expected 'OData-Version' header with value '4.0' but received"+" 'DataServiceVersion' header with value '"+o+"' in response for "+this.sServiceUrl+t)}if(n==="4.0"||!n&&r){return}throw new Error("Expected 'OData-Version' header with value '4.0' but received value '"+n+"' in response for "+this.sServiceUrl+t)};d.prototype.doConvertResponse=function(e,t){return e};d.prototype.doConvertSystemQueryOptions=function(e,t,r,n,o){var i=this;Object.keys(t).forEach(function(e){var s=t[e];if(n&&e[0]==="$"){return}switch(e){case"$expand":if(s!=="~"){s=i.convertExpand(s,o)}break;case"$select":if(Array.isArray(s)){s=o?s.sort().join(","):s.join(",")}break;default:}r(e,s)})};d.prototype.fetchTypeForPath=function(e,t){return this.oModelInterface.fetchMetadata(e+(t?"/$Type":"/"))};d.prototype.formatPropertyAsLiteral=function(e,t){return r.formatLiteral(e,t.$Type)};d.prototype.getGroupSubmitMode=function(e){return this.oModelInterface.getGroupProperty(e,"submit")};d.prototype.getModelInterface=function(){return this.oModelInterface};d.prototype.getOrCreateBatchQueue=function(e){var t,r=this.mBatchQueue[e];if(!r){t=[];t.iSerialNumber=0;r=this.mBatchQueue[e]=[t];r.iChangeSet=0;if(this.oModelInterface.onCreateGroup){this.oModelInterface.onCreateGroup(e)}}return r};d.prototype.getPathAndAddQueryOptions=function(e,t,r){var n=[],o,i={},s,a=this;e=e.slice(1,-5);if(t.$Parameter){t.$Parameter.forEach(function(e){i[e.$Name]=e})}if(t.$kind==="Function"){for(o in r){s=i[o];if(s){if(s.$isCollection){throw new Error("Unsupported collection-valued parameter: "+o)}n.push(encodeURIComponent(o)+"="+encodeURIComponent(a.formatPropertyAsLiteral(r[o],s)))}}e+="("+n.join(",")+")"}else{for(o in r){if(!(o in i)){delete r[o]}}}return e};d.prototype.getSerialNumber=function(){this.iSerialNumber+=1;return this.iSerialNumber};d.prototype.getServiceUrl=function(){return this.sServiceUrl};d.prototype.hasChanges=function(e,t){var r=this.mBatchQueue[e];if(r){return r.some(function(e){return Array.isArray(e)&&e.some(function(e){return e.headers["If-Match"]===t})})}return false};d.prototype.hasPendingChanges=function(e){var t=this;function r(t){if(!e){return Object.keys(t)}return e in t?[e]:[]}return r(this.mRunningChangeRequests).length>0||this.aLockedGroupLocks.some(function(t){return(e===undefined||t.getGroupId()===e)&&t.isModifying()&&t.isLocked()})||r(this.mBatchQueue).some(function(e){return t.mBatchQueue[e].some(function(e){return Array.isArray(e)&&e.some(function(e){return e.$cancel})})})};d.prototype.isActionBodyOptional=function(){return false};d.prototype.isChangeSetOptional=function(){return true};d.prototype.mergeGetRequests=function(e){var t=[],n=this;function o(e){return e.$queryOptions&&t.some(function(t){if(t.$queryOptions&&e.url===t.url){r.aggregateQueryOptions(t.$queryOptions,e.$queryOptions);e.$resolve(t.$promise);return true}return false})}e.forEach(function(e){if(!o(e)){t.push(e)}});t.forEach(function(e){if(e.$queryOptions){e.url=n.addQueryString(e.url,e.$metaPath,e.$queryOptions)}});t.iChangeSet=e.iChangeSet;return t};d.prototype.processBatch=function(e){var t,n=this.mBatchQueue[e]||[],o=this;function i(e){if(Array.isArray(e)){e.forEach(i)}else if(e.$submit){e.$submit()}}function s(e,t){if(Array.isArray(t)){t.forEach(s.bind(null,e))}else{t.$reject(e)}}function a(e,t){var n;e.forEach(function(e,i){var s,u,c,h=t[i];if(Array.isArray(h)){a(e,h)}else if(!h){s=new Error("HTTP request was not processed because the previous request failed");s.cause=n;s.$reported=true;e.$reject(s)}else if(h.status>=400){h.getResponseHeader=p;n=r.createError(h,"Communication error",e.url,e.$resourcePath);if(Array.isArray(e)){r.decomposeError(n,e).forEach(function(t,r){e[r].$reject(t)})}else{e.$reject(n)}}else{if(h.responseText){try{o.doCheckVersionHeader(p.bind(h),e.url,true);c=o.doConvertResponse(JSON.parse(h.responseText),e.$metaPath)}catch(t){e.$reject(t);return}}else{c=e.method==="GET"?null:{}}o.reportUnboundMessagesAsJSON(e.url,p.call(h,"sap-messages"));u=p.call(h,"ETag");if(u){c["@odata.etag"]=u}e.$resolve(c)}})}delete this.mBatchQueue[e];i(n);t=this.cleanUpChangeSets(n);if(n.length===0){return Promise.resolve()}this.batchRequestSent(e,t);n=this.mergeGetRequests(n);return this.sendBatch(c.cleanBatch(n)).then(function(e){a(n,e)}).catch(function(e){var t=new Error("HTTP request was not processed because $batch failed");t.cause=e;s(t,n);throw e}).finally(function(){o.batchResponseReceived(e,t)})};d.prototype.ready=function(){return i.resolve()};d.prototype.lockGroup=function(e,r,n,o,i){var s;s=new t(e,r,n,o,this.getSerialNumber(),i);if(n){this.aLockedGroupLocks.push(s)}return s};d.prototype.refreshSecurityToken=function(e){var t=this;if(!this.oSecurityTokenPromise){if(e!==this.mHeaders["X-CSRF-Token"]){return Promise.resolve()}this.oSecurityTokenPromise=new Promise(function(e,n){s.ajax(t.sServiceUrl+t.sQueryParams,{method:"HEAD",headers:Object.assign({},t.mHeaders,{"X-CSRF-Token":"Fetch"})}).then(function(r,n,o){var i=o.getResponseHeader("X-CSRF-Token");if(i){t.mHeaders["X-CSRF-Token"]=i}else{delete t.mHeaders["X-CSRF-Token"]}t.oSecurityTokenPromise=null;e()},function(e){t.oSecurityTokenPromise=null;n(r.createError(e,"Could not refresh security token"))})})}return this.oSecurityTokenPromise};d.prototype.relocate=function(e,t,r){var n=this.mBatchQueue[e],o=this,i=n&&n[0].some(function(e,i){if(e.body===t){o.addChangeToGroup(e,r);n[0].splice(i,1);return true}});if(!i){throw new Error("Request not found in group '"+e+"'")}};d.prototype.relocateAll=function(e,t,r){var n=0,o=this.mBatchQueue[e],i=this;if(o){o[0].slice().forEach(function(e){if(!r||e.headers["If-Match"]===r){i.addChangeToGroup(e,t);o[0].splice(n,1)}else{n+=1}})}};d.prototype.removePatch=function(e){var t=this.cancelChangesByFilter(function(t){return t.$promise===e});if(!t){throw new Error("Cannot reset the changes, the batch request is running")}};d.prototype.removePost=function(e,t){var n=r.getPrivateAnnotation(t,"postBody"),o=this.cancelChangesByFilter(function(e){return e.body===n},e);if(!o){throw new Error("Cannot reset the changes, the batch request is running")}};d.prototype.reportUnboundMessagesAsJSON=function(e,t){this.oModelInterface.reportUnboundMessages(e,JSON.parse(t||null))};d.prototype.request=function(e,t,r,n,o,i,s,a,u,h,f){var p,d,l=r&&r.getGroupId()||"$direct",m,y=Infinity,g,S=this;if(l==="$cached"){d=new Error("Unexpected request: "+e+" "+t);d.$cached=true;throw d}if(r&&r.isCanceled()){if(s){s()}d=new Error("Request already canceled");d.canceled=true;return Promise.reject(d)}if(r){r.unlock();y=r.getSerialNumber()}t=this.convertResourcePath(t);u=u||t;if(this.getGroupSubmitMode(l)!=="Direct"){m=new Promise(function(r,c){var d=S.getOrCreateBatchQueue(l);g={method:e,url:t,headers:Object.assign({},S.mPredefinedPartHeaders,S.mHeaders,n,S.mFinalHeaders),body:o,$cancel:s,$metaPath:a,$queryOptions:f,$reject:c,$resolve:r,$resourcePath:u,$submit:i};if(e==="GET"){d.push(g)}else if(h){d[0].unshift(g)}else{p=d.iChangeSet;while(d[p].iSerialNumber>y){p-=1}d[p].push(g)}});g.$promise=m;return m}if(f){t=S.addQueryString(t,a,f)}if(i){i()}return this.sendRequest(e,t,Object.assign({},n,this.mFinalHeaders),JSON.stringify(c.cleanPayload(o)),u).then(function(e){S.reportUnboundMessagesAsJSON(e.resourcePath,e.messages);return S.doConvertResponse(e.body,a)})};d.prototype.sendBatch=function(t){var r=e.serializeBatchRequest(t);return this.sendRequest("POST","$batch"+this.sQueryParams,Object.assign(r.headers,a),r.body).then(function(t){if(t.messages!==null){throw new Error("Unexpected 'sap-messages' response header for batch request")}return e.deserializeBatchResponse(t.contentType,t.body)})};d.prototype.sendRequest=function(e,t,n,i,a){var c=this.sServiceUrl+t,h=this;return new Promise(function(f,p){function d(l){var m=h.mHeaders["X-CSRF-Token"];return s.ajax(c,{contentType:n&&n["Content-Type"],data:i,headers:Object.assign({},h.mPredefinedRequestHeaders,h.mHeaders,r.resolveIfMatchHeader(n)),method:e}).then(function(r,n,o){var i=o.getResponseHeader("ETag"),s=o.getResponseHeader("X-CSRF-Token");try{h.doCheckVersionHeader(o.getResponseHeader,t,!r)}catch(e){p(e);return}if(s){h.mHeaders["X-CSRF-Token"]=s}h.setSessionContext(o.getResponseHeader("SAP-ContextId"),o.getResponseHeader("SAP-Http-Session-Timeout"));if(!r){r=e==="GET"?null:{}}if(i){r["@odata.etag"]=i}f({body:r,contentType:o.getResponseHeader("Content-Type"),messages:o.getResponseHeader("sap-messages"),resourcePath:t})},function(e){var t=e.getResponseHeader("SAP-ContextId"),n=e.getResponseHeader("X-CSRF-Token"),i;if(!l&&e.status===403&&n&&n.toLowerCase()==="required"){h.refreshSecurityToken(m).then(function(){d(true)},p)}else{i="Communication error";if(t){h.setSessionContext(t,e.getResponseHeader("SAP-Http-Session-Timeout"))}else if(h.mHeaders["SAP-ContextId"]){i="Session not found on server";o.error(i,undefined,u);h.clearSessionContext(true)}p(r.createError(e,i,c,a))}})}if(h.oSecurityTokenPromise&&e!=="GET"){return h.oSecurityTokenPromise.then(d)}return d()})};d.prototype.setSessionContext=function(e,t){var r=f.test(t)?parseInt(t):0,n=Date.now()+30*60*1e3,i=this;this.clearSessionContext();if(e){i.mHeaders["SAP-ContextId"]=e;if(r>=60){this.iSessionTimer=setInterval(function(){if(Date.now()>=n){i.clearSessionContext(true)}else{s.ajax(i.sServiceUrl+i.sQueryParams,{method:"HEAD",headers:{"SAP-ContextId":i.mHeaders["SAP-ContextId"]}}).fail(function(e){if(e.getResponseHeader("SAP-Err-Id")==="ICMENOSESSION"){o.error("Session not found on server",undefined,u);i.clearSessionContext(true)}})}},(r-5)*1e3)}else if(t!==null){o.warning("Unsupported SAP-Http-Session-Timeout header",t,u)}}};d.prototype.submitBatch=function(e){var t,r,n=this;r=i.all(this.aLockedGroupLocks.map(function(t){return t.waitFor(e)}));t=r.isPending();if(t){o.info("submitBatch('"+e+"') is waiting for locks",null,u)}return r.then(function(){if(t){o.info("submitBatch('"+e+"') continues",null,u)}n.aLockedGroupLocks=n.aLockedGroupLocks.filter(function(e){return e.isLocked()});return n.processBatch(e)})};d.prototype.waitForRunningChangeRequests=function(e){return this.mRunningChangeRequests[e]||i.resolve()};c={cleanBatch:function(e){e.forEach(function(e){if(Array.isArray(e)){c.cleanBatch(e)}else{e.body=c.cleanPayload(e.body)}});return e},cleanPayload:function(e){var t=e;if(t){Object.keys(t).forEach(function(r){if(r.startsWith("@$ui5.")){if(t===e){t=Object.assign({},e)}delete t[r]}})}return t},create:function(e,t,r,o,i){var s=new d(e,r,o,t);if(i==="2.0"){n(s)}return s}};return c},false);