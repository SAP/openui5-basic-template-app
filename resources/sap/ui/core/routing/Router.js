/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/base/EventProvider","./HashChanger","./Route","./Views","./Targets","./History","sap/ui/thirdparty/crossroads","sap/base/util/UriParameters","sap/base/util/deepEqual","sap/base/util/isEmptyObject","sap/base/Log","sap/ui/thirdparty/jquery","./RouterHashChanger","sap/ui/core/Component"],function(t,e,i,s,n,a,r,h,o,u,d,f,c,g,_){"use strict";var l={};var p=e.extend("sap.ui.core.routing.Router",{constructor:function(t,s,a,r,u){e.apply(this);this._oConfig=s||{};this._oRouter=h.create();this._oRouter.ignoreState=true;this._oRoutes={};this._oOwner=a;function d(){if(o.fromQuery(window.location.search).get("sap-ui-xx-asyncRouting")==="true"){f.warning("Activation of async view loading in routing via url parameter is only temporarily supported and may be removed soon","Router");return true}return false}this._oConfig._async=this._oConfig.async;if(this._oConfig._async===undefined){this._oConfig._async=d()}this._oViews=new n({component:a,async:this._oConfig._async});if(r){this._oTargets=this._createTargets(this._oConfig,r);this._oTargets._setRouter(this);this._oTargets.attachDisplay(function(t){var e=t.getParameter("routeRelevant");if(this.isInitialized()&&!this._bMatchingProcessStarted){var i=this.getHashChanger();if(i instanceof g&&!e){i.resetHash()}}},this)}var _=this,l;if(!t){t={}}if(Array.isArray(t)){l=t;t={};l.forEach(function(e){t[e.name]=e})}c.each(t,function(t,e){if(e.name===undefined){e.name=t}_.addRoute(e)});this._oRouter.bypassed.add(c.proxy(this._onBypassed,this));if(!u){u=i.getInstance().createRouterHashChanger()}this.setHashChanger(u);var p=this._getParentRouter();if(p){this.attachTitleChanged(function(t){if(this._oOwner&&!this._oOwner._bRoutingPropagateTitle){return}var e=t.getParameters(),i,s;if(p._fnTitleChangedFiredOnChild){p._fnTitleChangedFiredOnChild(e)}else{i=e.nestedHistory.slice();i.unshift({ownerComponentId:p._oOwner.getId(),history:p.getTitleHistory()});s={propagated:true,title:e.title,history:e.history,nestedHistory:i};p.fireTitleChanged(s)}})}},addRoute:function(t,e){if(!t.name){f.error("A name has to be specified for every route",this)}if(this._oRoutes[t.name]){f.error("Route with name "+t.name+" already exists",this)}this._oRoutes[t.name]=this._createRoute(this,t,e)},parse:function(t){if(this._oRouter){this._oRouter.parse(t)}else{f.warning("This router has been destroyed while the hash changed. No routing events where fired by the destroyed instance.",this)}},initialize:function(t){var e=this,i;if(this._bIsInitialized){f.warning("Router is already initialized.",this);return this}this._bIsInitialized=true;this._bLastHashReplaced=false;this._bHashChangedAfterTitleChange=false;this.fnHashChanged=function(t){e.parse(t.getParameter("newHash"));e._bHashChangedAfterTitleChange=true};if(!this.oHashChanger){f.error("navTo of the router is called before the router is initialized. If you want to replace the current hash before you initialize the router you may use getUrl and use replaceHash of the Hashchanger.",this);return this}if(this._oTargets){var s=this._oRoutes[this._oConfig.homeRoute];this._oTargets.attachTitleChanged(this._forwardTitleChanged,this);this._aHistory=[];var n=s&&R(this._oOwner,s);if(n){this._aHistory.push(n)}}this.oHashChanger.init();i=this.oHashChanger.getHash();this.oHashChanger.attachEvent("hashChanged",this.fnHashChanged);if(!t&&i!==g.InvalidHash){this.parse(i)}return this},_forwardTitleChanged:function(t){var e=t.getParameters();var i={title:e.title};var s=this._oRoutes[this._oConfig.homeRoute];if(s&&C(e.name,s._oConfig.name)){i.isHome=true}this.fireTitleChanged(i)},stop:function(){if(!this._bIsInitialized){f.warning("Router is not initialized. But it got stopped",this)}if(this.fnHashChanged){this.oHashChanger.detachEvent("hashChanged",this.fnHashChanged)}if(this.fnHashReplaced){this.oHashChanger.detachEvent("hashReplaced",this.fnHashReplaced)}if(this._oTargets){this._oTargets.detachTitleChanged(this._forwardTitleChanged,this);this._oTargets._oLastTitleTarget={}}if(this._oMatchedRoute){this._oMatchedRoute._routeSwitched();this._oMatchedRoute=null}this._bIsInitialized=false;delete this._oPreviousTitleChangedRoute;return this},isStopped:function(){return this._bIsInitialized===false},isInitialized:function(){return this._bIsInitialized===true},getHashChanger:function(){return this.oHashChanger},setHashChanger:function(t){if(this.oHashChanger){f.warning("The Router already has a HashChanger set and this call is ignored")}else{this.oHashChanger=t}return this},destroy:function(){if(this.bIsDestroyed){return this}e.prototype.destroy.apply(this);if(this._oViews){this._oViews.destroy();this._oViews=null}if(!this._bIsInitialized){f.info("Router is not initialized, but got destroyed.",this)}if(this.fnHashChanged){this.oHashChanger.detachEvent("hashChanged",this.fnHashChanged)}if(this.fnHashReplaced){this.oHashChanger.detachEvent("hashReplaced",this.fnHashReplaced)}this._oRouter.removeAllRoutes();this._oRouter=null;c.each(this._oRoutes,function(t,e){e.destroy()});this._oRoutes=null;this._oConfig=null;if(this._oTargets){this._oTargets.destroy();this._oTargets=null}delete this._bIsInitialized;this.bIsDestroyed=true;return this},getURL:function(t,e){var i=this.getRoute(t);if(i){return i.getURL(e)}else{f.warning("Route with name "+t+" does not exist",this)}},match:function(t){return Object.keys(this._oRoutes).some(function(e){return this._oRoutes[e].match(t)}.bind(this))},getRouteByHash:function(t){for(var e in this._oRoutes){if(this._oRoutes.hasOwnProperty(e)){var i=this.getRoute(e);if(i.match(t)){return i}}}},getRouteInfoByHash:function(t){var e=this.getRouteByHash(t);if(!e){return undefined}return{name:e._oConfig.name,arguments:e.getPatternArguments(t)}},getRoute:function(t){return this._oRoutes[t]},getViews:function(){return this._oViews},_createTargets:function(t,e){return new a({views:this._oViews,config:t,targets:e})},_createRoute:function(t,e,i){return new s(t,e,i)},getView:function(t,e,i){f.warning("Deprecated API Router#getView called - use Router#getViews instead.",this);var s=this._oViews._getViewWithGlobalId({viewName:t,type:e,id:i},true);this.fireViewCreated({view:s,viewName:t,type:e});return s},setView:function(t,e){this._oViews.setView(t,e);return this},_getParentRouter:function(){var t=this._oOwner&&_.getOwnerComponentFor(this._oOwner);return t&&t.getRouter()},navTo:function(t,e,i,s){var n=this,a=this._getLastMatchedRouteName()!==t,r=this.getRoute(t),h,o;if(!r){f.warning("Route with name "+t+" does not exist",this);return this}if(typeof i==="boolean"){s=i}if(e===undefined){e={}}if(i&&!d(i)){if(!this._oConfig._async){f.error("navTo with component target info is only supported with async router",this);return this}h=r._changeHashWithComponentTargets(i,a)}o=r.getURL(e);if(s){n._bLastHashReplaced=true;n.oHashChanger.replaceHash(o,h,!a)}else{n.oHashChanger.setHash(o,h,!a)}return this},_getLastMatchedRouteName:function(){return this._oMatchedRoute&&this._oMatchedRoute._oConfig.name},getTargets:function(){return this._oTargets},getTarget:function(t){return this._oTargets.getTarget(t)},attachRouteMatched:function(t,e,i){this.attachEvent("routeMatched",t,e,i);return this},detachRouteMatched:function(t,e){this.detachEvent("routeMatched",t,e);return this},fireRouteMatched:function(t){this.fireEvent("routeMatched",t);if(p._interceptRouteMatched){p._interceptRouteMatched(this._oConfig.controlId,this)}return this},attachBeforeRouteMatched:function(t,e,i){this.attachEvent("beforeRouteMatched",t,e,i);return this},detachBeforeRouteMatched:function(t,e){this.detachEvent("beforeRouteMatched",t,e);return this},fireBeforeRouteMatched:function(t){this.fireEvent("beforeRouteMatched",t);return this},attachViewCreated:function(t,e,i){this.attachEvent("viewCreated",t,e,i);return this},detachViewCreated:function(t,e){this.detachEvent("viewCreated",t,e);return this},fireViewCreated:function(t){this.fireEvent("viewCreated",t);return this},attachRoutePatternMatched:function(t,e,i){this.attachEvent("routePatternMatched",t,e,i);return this},detachRoutePatternMatched:function(t,e){this.detachEvent("routePatternMatched",t,e);return this},fireRoutePatternMatched:function(t){this.fireEvent("routePatternMatched",t);return this},attachBypassed:function(t,e,i){return this.attachEvent(p.M_EVENTS.BYPASSED,t,e,i)},detachBypassed:function(t,e){return this.detachEvent(p.M_EVENTS.BYPASSED,t,e)},fireBypassed:function(t){return this.fireEvent(p.M_EVENTS.BYPASSED,t)},attachTitleChanged:function(t,e,i){this.attachEvent(p.M_EVENTS.TITLE_CHANGED,t,e,i);return this},detachTitleChanged:function(t,e){return this.detachEvent(p.M_EVENTS.TITLE_CHANGED,t,e)},fireTitleChanged:function(e){if(this.isStopped()){return this}var i=!this._pWaitForTitleChangedOnChild;if(!e.propagated){e.propagated=false;var s=r.getInstance().getDirection(),n=this.getHashChanger().getHash(),a=t.routing.HistoryDirection,h=this._aHistory[this._aHistory.length-1],o;if(s===a.Backwards&&h&&!h.isHome){if(h&&h.title!==e.title){this._aHistory.pop()}}else if(h&&h.hash==n){h.title=e.title;this._aHistory.some(function(t,e,i){if(e<i.length-1&&u(t,h)){return i.splice(e,1)}})}else{if(this._bLastHashReplaced){this._aHistory.pop()}o={hash:n,title:e.title};this._aHistory.some(function(t,e,i){if(u(t,o)){return i.splice(e,1)}});this._aHistory.push(o)}e.history=this._aHistory.slice(0,-1);e.nestedHistory=[{history:this.getTitleHistory(),ownerComponentId:this._oOwner&&this._oOwner.getId()}];this._bLastHashReplaced=false;this._oPreviousTitleChangedRoute=this._oMatchedRoute;this._bFireTitleChanged=false;if(this._pWaitForTitleChangedOnChild){this._pWaitForTitleChangedOnChild.then(function(t){e.title=t.title;e.propagated=true;Array.prototype.push.apply(e.nestedHistory,t.nestedHistory);this._stopWaitingTitleChangedFromChild();this.fireEvent(p.M_EVENTS.TITLE_CHANGED,e)}.bind(this))}}if(i){if(this._bMatchingProcessStarted&&this._isAsync()){this.attachEventOnce("routeMatched",function(){this.fireEvent(p.M_EVENTS.TITLE_CHANGED,e)},this)}else{this.fireEvent(p.M_EVENTS.TITLE_CHANGED,e)}}return this},getTitleHistory:function(){return this._aHistory||[]},_waitForTitleChangedOn:function(t){if(this._bFireTitleChanged){this._pWaitForTitleChangedOnChild=new Promise(function(t){this._fnTitleChangedFiredOnChild=t}.bind(this))}},_stopWaitingTitleChangedFromChild:function(){delete this._pWaitForTitleChangedOnChild;delete this._fnTitleChangedFiredOnChild},register:function(t){l[t]=this;return this},_onBypassed:function(t){var e=function(){this.fireBypassed({hash:t})}.bind(this);if(this._oConfig.bypassed){var i=this._oTargets.display(this._oConfig.bypassed.target,{hash:t});if(i instanceof Promise){i.then(e);return}}e()},_isAsync:function(){return this._oConfig._async},metadata:{publicMethods:["initialize","getURL","register","getRoute"]}});function C(t,e){return e&&e.indexOf(t)>-1}function R(t,e){var i=e.getPattern(),s=t&&t.getManifestEntry("sap.app/title");if(i===""||i!==undefined&&!/({.*})+/.test(i)){return{hash:i,isHome:true,title:s}}else{f.error("Routes with dynamic parts cannot be resolved as home route.")}}p.M_EVENTS={BEFORE_ROUTE_MATCHED:"beforeRouteMatched",ROUTE_MATCHED:"routeMatched",ROUTE_PATTERN_MATCHED:"routePatternMatched",VIEW_CREATED:"viewCreated",BYPASSED:"bypassed",TITLE_CHANGED:"titleChanged"};p._interceptRouteMatched=undefined;p.getRouter=function(t){return l[t]};return p});