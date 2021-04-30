/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/unified/library"],function(e){"use strict";var a=e.CalendarAppointmentRoundWidth;var t={apiVersion:2};t.render=function(e,t){var i=t.getId();var s=t.getTooltip_AsString();var n=t._getHeader();e.openStart("div",t);e.class("sapMPlanCal");e.accessibilityState({role:"region",roledescription:t._oRB.getText("PLANNINGCALENDAR")});this.addAdditionalClasses(e,t);switch(t.getAppointmentRoundWidth()){case a.HalfColumn:e.class("sapUiCalendarAppHalfColumnRounding");break}if(!t.getSingleSelection()){e.class("sapMPlanCalMultiSel")}if(!t.getShowRowHeaders()){e.class("sapMPlanCalNoHead")}if(t.getShowWeekNumbers()&&t._viewAllowsWeekNumbers(t.getViewKey())){e.class("sapMPlanCalWithWeekNumbers")}if(t.getShowDayNamesLine()&&t._viewAllowsDayNamesLine(t.getViewKey())){e.class("sapMPlanCalWithDayNamesLine")}if(s){e.attr("title",s)}var l=t.getWidth();if(l){e.style("width",l)}var o=t.getHeight();if(o){e.style("height",o)}e.accessibilityState(t);e.openEnd();e.renderControl(n);var r=t.getAggregation("table");e.renderControl(r);var d=t._oRB.getText("PLANNINGCALENDAR");e.openStart("span",i+"-Descr");e.class("sapUiInvisibleText");e.openEnd();e.text(d);e.close("span");d=t._oRB.getText("PLANNINGCALENDAR_VIEW");e.openStart("span",i+"-SelDescr");e.class("sapUiInvisibleText");e.openEnd();e.text(d);e.close("span");e.close("div")};t.addAdditionalClasses=function(){};return t},true);