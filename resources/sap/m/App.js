/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./NavContainer","./library","./AppRenderer","sap/ui/base/DataType","sap/ui/util/Mobile","sap/base/Log","sap/ui/thirdparty/jquery"],function(e,t,a,o,n,i,r){"use strict";var p=e.extend("sap.m.App",{metadata:{library:"sap.m",properties:{homeIcon:{type:"any",group:"Misc",defaultValue:null},backgroundColor:{type:"string",group:"Appearance",defaultValue:null},backgroundImage:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},backgroundRepeat:{type:"boolean",group:"Appearance",defaultValue:false},backgroundOpacity:{type:"float",group:"Appearance",defaultValue:1},mobileWebAppCapable:{type:"boolean",group:"Appearance",defaultValue:true}},events:{orientationChange:{deprecated:true,parameters:{landscape:{type:"boolean"}}}}}});p.prototype.init=function(){e.prototype.init.apply(this,arguments);this.addStyleClass("sapMApp");n.init({viewport:!this._debugZoomAndScroll,statusBar:"default",hideBrowser:true,preventScroll:!this._debugZoomAndScroll,rootId:this.getId()});r(window).on("resize",r.proxy(this._handleOrientationChange,this))};p.prototype.onBeforeRendering=function(){if(e.prototype.onBeforeRendering){e.prototype.onBeforeRendering.apply(this,arguments)}n.init({homeIcon:this.getHomeIcon(),mobileWebAppCapable:this.getMobileWebAppCapable()})};p.prototype.onAfterRendering=function(){if(e.prototype.onAfterRendering){e.prototype.onAfterRendering.apply(this,arguments)}var t=this.getDomRef().parentNode;while(t&&t!==document.documentElement){var a=r(t);if(a.attr("data-sap-ui-root-content")){break}if(!t.style.height){t.style.height="100%"}t=t.parentNode}};p.prototype.exit=function(){r(window).off("resize",this._handleOrientationChange);if(this._sInitTimer){clearTimeout(this._sInitTimer)}};p.prototype._handleOrientationChange=function(){var e=r(window);var t=e.width()>e.height();if(this._oldIsLandscape!==t){this.fireOrientationChange({landscape:t});this._oldIsLandscape=t}};p.prototype.setBackgroundOpacity=function(e){if(e>1||e<0){i.warning("Invalid value "+e+" for App.setBackgroundOpacity() ignored. Valid values are: floats between 0 and 1.");return this}this.$("BG").css("opacity",e);return this.setProperty("backgroundOpacity",e,true)};return p});