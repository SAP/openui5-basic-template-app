/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/ValueStateSupport","sap/ui/core/IndicationColorSupport","sap/ui/core/InvisibleText","sap/ui/core/library"],function(t,e,a,s){"use strict";var i=s.TextDirection;var n=s.ValueState;var o={apiVersion:2};o.render=function(a,s){a.openStart("div",s);if(s._isEmpty()){a.style("display","none");a.openEnd()}else{var o=s.getState();var r=s.getInverted();var p=s.getTextDirection();var l=sap.ui.getCore();var c=l.getConfiguration().getRTL();var d={roledescription:l.getLibraryResourceBundle("sap.m").getText("OBJECT_STATUS")};var u;var g;if(p===i.Inherit){p=c?i.RTL:i.LTR}var S=s.getTooltip_AsString();if(S){a.attr("title",S)}a.class("sapMObjStatus");a.class("sapMObjStatus"+o);if(r){a.class("sapMObjStatusInverted")}if(s._isActive()){a.class("sapMObjStatusActive");a.attr("tabindex","0");d.role="button"}else{d.role="group"}a.accessibilityState(s,d);a.openEnd();if(s.getTitle()){a.openStart("span",s.getId()+"-title");a.class("sapMObjStatusTitle");if(p){a.attr("dir",p.toLowerCase())}a.openEnd();a.text(s.getTitle()+":");a.close("span")}if(s._isActive()){a.openStart("span",s.getId()+"-link");a.class("sapMObjStatusLink");a.openEnd()}if(s.getIcon()){a.openStart("span",s.getId()+"-statusIcon");a.class("sapMObjStatusIcon");if(!s.getText()){a.class("sapMObjStatusIconOnly")}a.openEnd();a.renderControl(s._getImageControl());a.close("span")}if(s.getText()){a.openStart("span",s.getId()+"-text");a.class("sapMObjStatusText");if(p){a.attr("dir",p.toLowerCase())}a.openEnd();a.text(s.getText());a.close("span")}if(s._isActive()){a.close("span")}if(o!=n.None){u=t.getAdditionalText(o);if(u){g=u}else{g=e.getAdditionalText(o)}if(g){a.openStart("span",s.getId()+"sapSRH");a.class("sapUiPseudoInvisibleText");a.openEnd();a.text(g);a.close("span")}}}a.close("div")};return o},true);