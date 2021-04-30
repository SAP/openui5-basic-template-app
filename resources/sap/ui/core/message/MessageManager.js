/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/EventProvider","sap/ui/base/ManagedObject","sap/ui/model/message/MessageModel","./Message","./ControlMessageProcessor","sap/ui/core/message/MessageProcessor","sap/base/util/deepEqual","sap/base/Log","sap/base/util/merge","sap/base/util/array/uniqueSort"],function(e,s,t,r,a,o,i,n,g,h){"use strict";var c=e.extend("sap.ui.core.message.MessageManager",{constructor:function(){e.apply(this,arguments);this.mProcessors={};this.mObjects={};this.mMessages={};var s=sap.ui.getCore().getConfiguration().getHandleValidation();if(s){sap.ui.getCore().attachValidationSuccess(s,this._handleSuccess,this);sap.ui.getCore().attachValidationError(s,this._handleError,this);sap.ui.getCore().attachParseError(s,this._handleError,this);sap.ui.getCore().attachFormatError(s,this._handleError,this)}},metadata:{publicMethods:["addMessages","removeMessages","removeAllMessages","registerMessageProcessor","unregisterMessageProcessor","registerObject","unregisterObject","getMessageModel","destroy"]}});c.prototype._handleError=function(e,s){if(!this.oControlMessageProcessor){this.oControlMessageProcessor=new a}if(s){var t=e.getParameter("element");var o=e.getParameter("property");var i=t.getId()+"/"+o;var n=this.oControlMessageProcessor.getId();var g=e.sId==="formatError";if(this.mMessages[n]&&this.mMessages[n][i]){this._removeMessages(this.mMessages[n][i],true)}var h={};h[t.getId()]={properties:{},fieldGroupIds:t.getFieldGroupIds?t.getFieldGroupIds():undefined};h[t.getId()].properties[o]=true;var c=new r({type:sap.ui.core.MessageType.Error,message:e.getParameter("message"),target:i,processor:this.oControlMessageProcessor,technical:g,references:h,validation:true});this.addMessages(c)}e.cancelBubble()};c.prototype._handleSuccess=function(e,s){if(!this.oControlMessageProcessor){this.oControlMessageProcessor=new a}if(s){var t=e.getParameter("element");var r=e.getParameter("property");var o=t.getId()+"/"+r;var i=this.oControlMessageProcessor.getId();if(this.mMessages[i]&&this.mMessages[i][o]){this._removeMessages(this.mMessages[i][o],true)}}e.cancelBubble()};c.prototype.addMessages=function(e){var s=e,t=this.getAffectedProcessors(e);if(!e){return}else if(Array.isArray(e)){for(var r=0;r<e.length;r++){s=e[r];this._importMessage(s)}}else{this._importMessage(e)}this._updateMessageModel(t)};c.prototype._importMessage=function(e){var s=e.getMessageProcessor(),t=s&&s.getId(),r=e.getTargets(),a=this;if(!this.mMessages[t]){this.mMessages[t]={}}if(!r.length){r=[undefined]}r.forEach(function(s){var r=a.mMessages[t][s]?a.mMessages[t][s]:[];r.push(e);a.mMessages[t][s]=r})};c.prototype._pushMessages=function(e){var s,t;for(t in e){s=e[t];var r=this.mMessages[t]?this.mMessages[t]:{};this._sortMessages(r);r=Object.keys(r).length===0?null:g({},r);s.setMessages(r)}};c.prototype._sortMessages=function(e){var s,t;if(Array.isArray(e)){e={ignored:e}}for(s in e){t=e[s];if(t.length>1){t.sort(r.compare)}}};c.prototype._updateMessageModel=function(e){var s=new Map,t,r=this.getMessageModel(),a;function o(e){s.set(e,true)}for(t in this.mMessages){for(a in this.mMessages[t]){this.mMessages[t][a].forEach(o)}}this._pushMessages(e);r.setData(Array.from(s.keys()))};c.prototype.removeAllMessages=function(){var e={};for(var s in this.mMessages){var t=Object.keys(this.mMessages[s])[0];var r=this.mMessages[s][t];Object.assign(e,this.getAffectedProcessors(r))}this.aMessages=[];this.mMessages={};this._updateMessageModel(e)};c.prototype.removeMessages=function(e){return this._removeMessages.apply(this,arguments)};c.prototype._removeMessages=function(e,s){var t=this.getAffectedProcessors(e);if(!e||Array.isArray(e)&&e.length==0){return}else if(Array.isArray(e)){var a=e.slice(0);for(var o=0;o<a.length;o++){if(!s||a[o].validation){this._removeMessage(a[o])}}}else if(e instanceof r&&(!s||e.validation)){this._removeMessage(e)}else{for(var i in e){this._removeMessages(e[i],s)}}this._updateMessageModel(t)};c.prototype._removeMessage=function(e){var s=e.getMessageProcessor(),t=s&&s.getId(),r=this.mMessages[t],a;if(!r){return}a=e.getTargets();if(!a.length){a=[undefined]}a.forEach(function(s){var t=r[s];if(t){for(var a=0;a<t.length;a++){var o=t[a];if(i(o,e)){t.splice(a,1);--a}}if(r[s].length===0){delete r[s]}}})};c.prototype.onMessageChange=function(e){var s=e.getParameter("oldMessages");var t=e.getParameter("newMessages");this.removeMessages(s);this.addMessages(t)};c.prototype.registerMessageProcessor=function(e){var s=e.getId(),t={};if(!this.mProcessors[s]){this.mProcessors[s]=s;e.attachMessageChange(this.onMessageChange,this);if(s in this.mMessages){t[s]=e;this._pushMessages(t)}}};c.prototype.unregisterMessageProcessor=function(e){this.removeMessagesByProcessor(e.getId());delete this.mProcessors[e.getId()];e.detachMessageChange(this.onMessageChange,this)};c.prototype.registerObject=function(e,t){if(!e instanceof s){n.error(this+" : "+e.toString()+" is not an instance of sap.ui.base.ManagedObject");return}e.attachValidationSuccess(t,this._handleSuccess,this);e.attachValidationError(t,this._handleError,this);e.attachParseError(t,this._handleError,this);e.attachFormatError(t,this._handleError,this)};c.prototype.unregisterObject=function(e){if(!e instanceof s){n.error(this+" : "+e.toString()+" is not an instance of sap.ui.base.ManagedObject");return}e.detachValidationSuccess(this._handleSuccess,this);e.detachValidationError(this._handleError,this);e.detachParseError(this._handleError,this);e.detachFormatError(this._handleError,this)};c.prototype.destroy=function(){n.warning("Deprecated: Do not call destroy on a MessageManager")};c.prototype.getMessageModel=function(){if(!this.oMessageModel){this.oMessageModel=new t(this);this.oMessageModel.setData([])}return this.oMessageModel};c.prototype.getAffectedProcessors=function(e){var s,t,r={};if(e){if(!Array.isArray(e)){e=[e]}e.forEach(function(e){s=e.getMessageProcessor();if(s instanceof o){t=s.getId();r[t]=s}})}return r};c.prototype.removeMessagesByProcessor=function(e){delete this.mMessages[e];this._updateMessageModel({})};return c});