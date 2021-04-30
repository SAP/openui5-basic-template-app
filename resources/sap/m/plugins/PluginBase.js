/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.m.plugins.PluginBase",{metadata:{abstract:true,library:"sap.m",properties:{enabled:{type:"boolean",defaultValue:true}}}});var i={};e.setConfig=function(t,a){var r=typeof a=="function"?a.getMetadata().getName():e.getMetadata().getName();Object.assign(i[r]=i[r]||{},t)};e.prototype.init=function(){this._bIsActive=false};e.prototype.isActive=function(){return this._bIsActive};e.prototype.getControl=function(){return this.getParent()};e.prototype.getControlPluginConfig=function(t,a){var r=this.getControl();if(!r){return a}var n=this.getMetadata().getName();var o=r.getMetadata().getName();var s=i[n]||{};var p=s[o]||{};if(t in p){return p[t]}for(var c in s){if(r.isA(c)&&t in s[c]){return s[c][t]}}var u=e.getMetadata().getName();var f=i[u]||{};var l=f[o]||{};if(t in l){return l[t]}for(var c in f){if(r.isA(c)&&t in f[c]){return f[c][t]}}return a};e.prototype.isApplicable=function(t){return t.isA("sap.ui.core.Control")};e.prototype.onActivate=function(t){};e.prototype.onDeactivate=function(t){};e.prototype.setParent=function(e){var i=this.getEnabled();if(i&&this.getControl()){this._deactivate()}t.prototype.setParent.apply(this,arguments);if(e&&i){if(!this.isApplicable(e)){throw new Error(this+" is not applicable to "+e)}else{this._activate()}}return this};e.prototype.setEnabled=function(t){var e=this.getEnabled();this.setProperty("enabled",t,true);var i=this.getEnabled();if(i!=e&&this.getControl()){if(i){this._activate()}else{this._deactivate()}}return this};e.prototype.setProperty=function(e,i,a){a=a||(this.getMetadata().getProperty(e).appData||{}).invalidate===false;return t.prototype.setProperty.call(this,e,i,a)};e.prototype._activate=function(){if(!this.isActive()){this.onActivate(this.getControl());this._bIsActive=true}};e.prototype._deactivate=function(){if(this.isActive()){this.onDeactivate(this.getControl());this._bIsActive=false}};return e});