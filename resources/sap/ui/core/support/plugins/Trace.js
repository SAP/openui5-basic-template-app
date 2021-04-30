/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/support/Plugin","sap/ui/core/format/DateFormat","sap/base/Log","sap/base/security/encodeXML"],function(e,t,i,r){"use strict";var l=e.extend("sap.ui.core.support.plugins.Trace",{constructor:function(r){e.apply(this,["sapUiSupportTrace","JavaScript Trace",r]);this._aEventIds=this.runsAsToolPlugin()?[this.getId()+"Entry"]:[];if(this.runsAsToolPlugin()){this._aLogEntries=[];this._iLogLevel=i.Level.ALL;this._oDateFormat=t.getDateTimeInstance()}else{var l=this;this._oldLogLevel=i.getLevel();i.setLevel(i.Level.ALL);i.addLogListener({onLogEntry:function(e){if(l.isActive()){r.sendEvent(l.getId()+"Entry",{entry:e})}}})}}});l.prototype.onsapUiSupportTraceEntry=function(e){o(this,e.getParameter("entry"))};l.prototype.init=function(t){e.prototype.init.apply(this,arguments);if(!this.runsAsToolPlugin()){return}var i=this;var r=sap.ui.getCore().createRenderManager();r.write("<div class='sapUiSupportToolbar'>");r.write("<button id='"+this.getId()+"-clear' class='sapUiSupportRoundedButton'>Clear</button>");r.write("<label class='sapUiSupportLabel'>Filter:</label><input type='text' id='"+this.getId()+"-filter' class='sapUiSupportTxtFld'>");r.write("<label class='sapUiSupportLabel'>Log Level:</label><select id='"+this.getId()+"-loglevel' class='sapUiSupportTxtFld sapUiSupportSelect'>");r.write("<option value='0'>FATAL</option>");r.write("<option value='1'>ERROR</option>");r.write("<option value='2'>WARNING</option>");r.write("<option value='3'>INFO</option>");r.write("<option value='4'>DEBUG</option>");r.write("<option value='5'>TRACE</option>");r.write("<option value='6' selected=''>ALL</option>");r.write("</select>");r.write("</div><div class='sapUiSupportTraceCntnt'></div>");r.flush(this.$().get(0));r.destroy();this._fClearHandler=function(){o(i)};this._fLogLevelHandler=function(){i._iLogLevel=i.$("loglevel").val();var e=[];for(var t=0;t<i._aLogEntries.length;t++){if(a(i._filter,i._iLogLevel,i._aLogEntries[t])){e.push(s(i,i._aLogEntries[t]))}}o(i,e.join(""))};this._fFilterHandler=function(){i._filter=i.$("filter").val();i._filter=i._filter?i._filter.toLowerCase():"";var e=[];for(var t=0;t<i._aLogEntries.length;t++){if(a(i._filter,i._iLogLevel,i._aLogEntries[t])){e.push(s(i,i._aLogEntries[t]))}}o(i,e.join(""))};this.$("clear").on("click",this._fClearHandler);this.$("filter").on("change",this._fFilterHandler);this.$("loglevel").on("change",this._fLogLevelHandler)};l.prototype.exit=function(t){if(this.runsAsToolPlugin()){if(this._fClearHandler){this.$("clear").off("click",this._fClearHandler);this._fClearHandler=null}if(this._fFilterHandler){this.$("filter").off("change",this._fFilterHandler);this._fFilterHandler=null}if(this._fLogLevelHandler){this.$("loglevel").off("change",this._fLogLevelHandler);this._fLogLevelHandler=null}}else{i.setLevel(this._oldLogLevel);this._oldLogLevel=null}e.prototype.exit.apply(this,arguments)};function o(e,t){var i=jQuery(".sapUiSupportTraceCntnt",e.$());if(!t){i.html("");e._aLogEntries=[]}else if(typeof t==="string"){i.html(r(t));i[0].scrollTop=i[0].scrollHeight}else{t._levelInfo=n(t.level);if(a(e._filter,e._iLogLevel,t)){i.append(s(e,t));i[0].scrollTop=i[0].scrollHeight}e._aLogEntries.push(t)}}function s(e,t){var i=t._levelInfo;var l=" style='color:"+i[1]+";'";var o="<div class='sapUiSupportTraceEntry'><span class='sapUiSupportTraceEntryLevel'"+l+">"+i[0]+"</span><span class='sapUiSupportTraceEntryTime'"+l+">"+e._oDateFormat.format(new Date(t.timestamp))+"</span><span class='sapUiSupportTraceEntryMessage'>"+r(t.message||"")+"</div>";return o}function a(e,t,i){var r=i._levelInfo;if(i._levelInfo[2]<=t){if(e){var l=e.split(" ");var o=true;for(var s=0;s<l.length;s++){o=o&&i.message.toLowerCase().indexOf(l[s])>=0||r[0].toLowerCase().indexOf(l[s])>=0}return o}return true}return false}function n(e){switch(e){case i.Level.FATAL:return["FATAL","#E60000",e];case i.Level.ERROR:return["ERROR","#E60000",e];case i.Level.WARNING:return["WARNING","#FFAA00",e];case i.Level.INFO:return["INFO","#000000",e];case i.Level.DEBUG:return["DEBUG","#000000",e];case i.Level.TRACE:return["TRACE","#000000",e]}return["unknown","#000000",e]}return l});