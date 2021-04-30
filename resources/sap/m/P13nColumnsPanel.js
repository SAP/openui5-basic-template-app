/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/model/ChangeReason","sap/ui/model/json/JSONModel","sap/ui/model/BindingMode","sap/ui/core/ResizeHandler","sap/ui/core/IconPool","./library","./Table","./Column","./ColumnListItem","./P13nPanel","./P13nColumnsItem","./SearchField","./ScrollContainer","./Text","./Button","./OverflowToolbar","./OverflowToolbarLayoutData","./OverflowToolbarButton","./ToolbarSpacer","sap/ui/thirdparty/jquery"],function(e,t,n,i,o,r,s,l,a,d,u,h,p,m,g,c,I,f,_,y,b){"use strict";var M=s.OverflowToolbarPriority;var T=s.ButtonType;var v=s.ToolbarDesign;var C=s.ListType;var S=s.ListMode;var x=s.P13nPanelType;var w=u.extend("sap.m.P13nColumnsPanel",{metadata:{library:"sap.m",properties:{visibleItemsThreshold:{type:"int",group:"Behavior",defaultValue:-1}},aggregations:{columnsItems:{type:"sap.m.P13nColumnsItem",multiple:true,singularName:"columnsItem",bindable:"bindable"},content:{type:"sap.ui.core.Control",multiple:true,singularName:"content",visibility:"hidden"}},events:{addColumnsItem:{parameters:{newItem:{type:"sap.m.P13nColumnsItem"}}},changeColumnsItems:{parameters:{newItems:{type:"sap.m.P13nColumnsItem[]"},existingItems:{type:"sap.m.P13nColumnsItem[]"},items:{type:"object[]"}}},setData:{}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t);e.class("sapMP13nColumnsPanel");e.openEnd();t.getAggregation("content").forEach(function(t){e.renderControl(t)});e.close("div")}}});w.prototype.init=function(){this._iLiveChangeTimer=0;this._iSearchTimer=0;this._bIgnoreUpdateInternalModel=false;this._bUpdateInternalModel=true;this._bTableItemsChanged=false;this._bOnAfterRenderingFirstTimeExecuted=false;var e=new n({items:[],columnKeyOfMarkedItem:undefined,isMoveDownButtonEnabled:undefined,isMoveUpButtonEnabled:undefined,showOnlySelectedItems:undefined,countOfSelectedItems:0,countOfItems:0});e.setDefaultBindingMode(i.TwoWay);e.setSizeLimit(1e3);this.setModel(e,"$sapmP13nColumnsPanel");this.setType(x.columns);this.setTitle(sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("COLUMSPANEL_TITLE"));this._createTable();this._createToolbar();this.setVerticalScrolling(false);var t=new m({horizontal:false,vertical:true,content:[this._oTable],width:"100%",height:"100%"});this.addAggregation("content",t);var r=this;this._fnHandleResize=function(){var e=false,n,i;if(r.getParent){var o=null,s,l;var a=r.getParent();var d=r._getToolbar();if(a&&a.$){o=a.$("cont");if(o.children().length>0&&d.$().length>0){n=t.$()[0].clientHeight;s=o.children()[0].clientHeight;l=d?d.$()[0].clientHeight:0;i=s-l;if(n!==i){t.setHeight(i+"px");e=true}}}}return e};this._sContainerResizeListener=o.register(t,this._fnHandleResize)};w.prototype.reInitialize=function(){};w.prototype.onBeforeRendering=function(){this._updateInternalModel();if(!this._getInternalModel().getProperty("/columnKeyOfMarkedItem")){this._setColumnKeyOfMarkedItem(this._getColumnKeyByTableItem(this._getVisibleTableItems()[0]))}this._switchMarkedTableItemTo(this._getTableItemByColumnKey(this._getInternalModel().getProperty("/columnKeyOfMarkedItem")));this._updateControlLogic()};w.prototype.onAfterRendering=function(){if(!this._bOnAfterRenderingFirstTimeExecuted){this._bOnAfterRenderingFirstTimeExecuted=true;window.clearTimeout(this._iLiveChangeTimer);var e=this;this._iLiveChangeTimer=window.setTimeout(function(){e._fnHandleResize()},0)}};w.prototype.getOkPayload=function(){this._updateInternalModel();var e=this._getInternalModel().getProperty("/items");return{tableItems:e.map(function(e){return{columnKey:e.columnKey,index:e.persistentIndex===-1?undefined:e.persistentIndex,visible:e.persistentSelected,width:e.width}}),tableItemsChanged:this._bTableItemsChanged,selectedItems:e.filter(function(e){return e.persistentSelected}).map(function(e){return{columnKey:e.columnKey}})}};w.prototype.getResetPayload=function(){return{oPanel:this}};w.prototype.exit=function(){o.deregister(this._sContainerResizeListener);this._sContainerResizeListener=null;this._getToolbar().destroy();this._oTable.destroy();this._oTable=null;if(this._getInternalModel()){this._getInternalModel().destroy()}window.clearTimeout(this._iLiveChangeTimer);window.clearTimeout(this._iSearchTimer)};w.prototype.addItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.addAggregation("items",e);return this};w.prototype.insertItem=function(e,t){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.insertAggregation("items",e,t);return this};w.prototype.removeItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}e=this.removeAggregation("items",e);return e};w.prototype.removeAllItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}return this.removeAllAggregation("items")};w.prototype.destroyItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.destroyAggregation("items");return this};w.prototype.addColumnsItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.addAggregation("columnsItems",e);return this};w.prototype.insertColumnsItem=function(e,t){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.insertAggregation("columnsItems",e,t);return this};w.prototype.updateColumnsItems=function(e){this.updateAggregation("columnsItems");if(e===t.Change&&!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}};w.prototype.removeColumnsItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}return this.removeAggregation("columnsItems",e)};w.prototype.removeAllColumnsItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}return this.removeAllAggregation("columnsItems")};w.prototype.destroyColumnsItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.destroyAggregation("columnsItems");return this};w.prototype.onBeforeNavigationFrom=function(){var e=this._getSelectedModelItems();var t=this.getVisibleItemsThreshold();return!(e&&t!==-1&&e.length>t)};w.prototype._notifyChange=function(){this._bTableItemsChanged=true;var e=this.getChangeNotifier();if(e){e(this)}};w.prototype._scrollToSelectedItem=function(e){if(!e){return}sap.ui.getCore().applyChanges()};w.prototype._getInternalModel=function(){return this.getModel("$sapmP13nColumnsPanel")};w.prototype._createTable=function(){this._oTable=new l({mode:S.MultiSelect,rememberSelections:false,itemPress:b.proxy(this._onItemPressed,this),selectionChange:b.proxy(this._onSelectionChange,this),columns:[new a({vAlign:e.VerticalAlign.Middle,header:new g({text:{parts:[{path:"/countOfSelectedItems"},{path:"/countOfItems"}],formatter:function(e,t){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("COLUMNSPANEL_SELECT_ALL_WITH_COUNTER",[e,t])}}})})],items:{path:"/items",templateShareable:false,template:new d({cells:[new g({text:"{text}"})],visible:"{visible}",selected:"{persistentSelected}",tooltip:"{tooltip}",type:C.Active})}});this._oTable.setModel(this._getInternalModel())};w.prototype._createToolbar=function(){var e=this;var t=sap.ui.getCore().getLibraryResourceBundle("sap.m");var n=new I(this.getId()+"-toolbar",{design:v.Auto,content:[new y,new p(this.getId()+"-searchField",{liveChange:function(t){var n=t.getSource().getValue(),i=n?300:0;window.clearTimeout(e._iSearchTimer);if(i){e._iSearchTimer=window.setTimeout(function(){e._onExecuteSearch()},i)}else{e._onExecuteSearch()}},search:b.proxy(this._onExecuteSearch,this),layoutData:new f({minWidth:"12.5rem",maxWidth:"23.077rem",shrinkable:true,moveToOverflow:false,stayInOverflow:false})}),new c(this.getId()+"-showSelected",{text:{path:"/showOnlySelectedItems",formatter:function(e){return e?t.getText("COLUMNSPANEL_SHOW_ALL"):t.getText("COLUMNSPANEL_SHOW_SELECTED")}},type:T.Transparent,press:b.proxy(this._onSwitchButtonShowSelected,this),layoutData:new f({moveToOverflow:true,priority:M.High})}),new _({icon:r.getIconURI("collapse-group"),text:t.getText("COLUMNSPANEL_MOVE_TO_TOP"),tooltip:t.getText("COLUMNSPANEL_MOVE_TO_TOP"),type:T.Transparent,enabled:{path:"/isMoveUpButtonEnabled"},press:b.proxy(this.onPressButtonMoveToTop,this),layoutData:new f({moveToOverflow:true,priority:M.Low,group:2})}),new _({icon:r.getIconURI("slim-arrow-up"),text:t.getText("COLUMNSPANEL_MOVE_UP"),tooltip:t.getText("COLUMNSPANEL_MOVE_UP"),type:T.Transparent,enabled:{path:"/isMoveUpButtonEnabled"},press:b.proxy(this.onPressButtonMoveUp,this),layoutData:new f({moveToOverflow:true,priority:M.High,group:1})}),new _({icon:r.getIconURI("slim-arrow-down"),text:t.getText("COLUMNSPANEL_MOVE_DOWN"),tooltip:t.getText("COLUMNSPANEL_MOVE_DOWN"),type:T.Transparent,enabled:{path:"/isMoveDownButtonEnabled"},press:b.proxy(this.onPressButtonMoveDown,this),layoutData:new f({moveToOverflow:true,priority:M.High,group:1})}),new _({icon:r.getIconURI("expand-group"),text:t.getText("COLUMNSPANEL_MOVE_TO_BOTTOM"),tooltip:t.getText("COLUMNSPANEL_MOVE_TO_BOTTOM"),type:T.Transparent,enabled:{path:"/isMoveDownButtonEnabled"},press:b.proxy(this.onPressButtonMoveToBottom,this),layoutData:new f({moveToOverflow:true,priority:M.Low,group:2})})]});n.setModel(this._getInternalModel());this.addAggregation("content",n)};w.prototype.onPressButtonMoveToTop=function(){this._moveMarkedTableItem(this._getMarkedTableItem(),this._getVisibleTableItems()[0])};w.prototype.onPressButtonMoveUp=function(){var e=this._getVisibleTableItems();this._moveMarkedTableItem(this._getMarkedTableItem(),e[e.indexOf(this._getMarkedTableItem())-1])};w.prototype.onPressButtonMoveDown=function(){var e=this._getVisibleTableItems();this._moveMarkedTableItem(this._getMarkedTableItem(),e[e.indexOf(this._getMarkedTableItem())+1])};w.prototype.onPressButtonMoveToBottom=function(){var e=this._getVisibleTableItems();this._moveMarkedTableItem(this._getMarkedTableItem(),e[e.length-1])};w.prototype._onSwitchButtonShowSelected=function(){this._getInternalModel().setProperty("/showOnlySelectedItems",!this._getInternalModel().getProperty("/showOnlySelectedItems"));this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();this._scrollToSelectedItem(this._getMarkedTableItem());this._updateControlLogic();this._fnHandleResize()};w.prototype._onExecuteSearch=function(){this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();this._updateControlLogic()};w.prototype._switchVisibilityOfUnselectedModelItems=function(){var e=this._isFilteredByShowSelected();var t=this._getInternalModel().getProperty("/items");t.forEach(function(t){if(t.persistentSelected){t.visible=true;return}t.visible=!e});this._getInternalModel().setProperty("/items",t)};w.prototype._getVisibleModelItems=function(){return this._getInternalModel().getProperty("/items").filter(function(e){return!!e.visible})};w.prototype._moveMarkedTableItem=function(e,t){var n=this._getModelItemByColumnKey(this._getColumnKeyByTableItem(e));var i=this._getModelItemByColumnKey(this._getColumnKeyByTableItem(t));var o=this._getModelItemIndexByColumnKey(n.columnKey);var r=this._getModelItemIndexByColumnKey(i.columnKey);this._moveModelItems(o,r);this._checkButtonFocus(r);this._scrollToSelectedItem(this._getMarkedTableItem());this._updateControlLogic();this._fireChangeColumnsItems();this._fireSetData();this._notifyChange()};w.prototype._checkButtonFocus=function(e){var t=this._oTable.getItems().length-1;if(e===0||e===t){sap.ui.getCore().byId(this.getId()+"-showSelected").focus()}};w.prototype._moveModelItems=function(e,t){var n=this._getInternalModel().getProperty("/items");if(e<0||t<0||e>n.length-1||t>n.length-1){return false}this._removeStyleOfMarkedTableItem();var i=n.splice(e,1);n.splice(t,0,i[0]);this._updateModelItemsPersistentIndex(n);this._updateCounts(n);this._getInternalModel().setProperty("/items",n);this._switchMarkedTableItemTo(this._getMarkedTableItem());return true};w.prototype._getModelItemByColumnKey=function(e){var t=this._getInternalModel().getProperty("/items").filter(function(t){return t.columnKey===e});return t[0]};w.prototype._updateCounts=function(e){var t=0;var n=0;e.forEach(function(e){t++;if(e.persistentSelected){n++}});this._getInternalModel().setProperty("/countOfItems",t);this._getInternalModel().setProperty("/countOfSelectedItems",n)};w.prototype._sortModelItemsByPersistentIndex=function(e){var t;var n;try{n=sap.ui.getCore().getConfiguration().getLocale().toString();if(typeof window.Intl!=="undefined"){t=window.Intl.Collator(n,{numeric:true})}}catch(e){}e.forEach(function(e,t){e.localIndex=t});e.sort(function(e,i){if(e.persistentSelected===true&&(i.persistentSelected===false||i.persistentSelected===undefined)){return-1}else if((e.persistentSelected===false||e.persistentSelected===undefined)&&i.persistentSelected===true){return 1}else if(e.persistentSelected===true&&i.persistentSelected===true){if(e.persistentIndex>-1&&e.persistentIndex<i.persistentIndex){return-1}else if(i.persistentIndex>-1&&e.persistentIndex>i.persistentIndex){return 1}else{return e.localIndex-i.localIndex}}else if((e.persistentSelected===false||e.persistentSelected===undefined)&&(i.persistentSelected===false||i.persistentSelected===undefined)){return t?t.compare(e.text,i.text):e.text.localeCompare(i.text,n,{numeric:true})}});e.forEach(function(e){delete e.localIndex})};w.prototype._getColumnKeyByTableItem=function(e){var t=this._oTable.indexOfItem(e);if(t<0){return null}return this._oTable.getBinding("items").getContexts()[t].getObject().columnKey};w.prototype._getModelItemIndexByColumnKey=function(e){var t=-1;this._getInternalModel().getProperty("/items").some(function(n,i){if(n.columnKey===e){t=i;return true}});return t};w.prototype._getSelectedModelItems=function(){return this._getInternalModel().getProperty("/items").filter(function(e){return e.persistentSelected})};w.prototype._getVisibleTableItems=function(){return this._oTable.getItems().filter(function(e){return e.getVisible()})};w.prototype._getTableItemByColumnKey=function(e){var t=this._oTable.getBinding("items").getContexts();var n=this._oTable.getItems().filter(function(n,i){return t[i].getObject().columnKey===e});return n[0]};w.prototype._getToolbar=function(){return sap.ui.getCore().byId(this.getId()+"-toolbar")||null};w.prototype._getSearchField=function(){return sap.ui.getCore().byId(this.getId()+"-searchField")||null};w.prototype._getSearchText=function(){var e=this._getSearchField();return e?e.getValue():""};w.prototype._isFilteredBySearchText=function(){return!!this._getSearchText().length};w.prototype._isFilteredByShowSelected=function(){return this._getInternalModel().getData().showOnlySelectedItems};w.prototype._updateControlLogic=function(){var e=this._isFilteredBySearchText();var t=this._isFilteredByShowSelected();var n=this._getVisibleTableItems();this._getInternalModel().setProperty("/isMoveUpButtonEnabled",n.indexOf(this._getMarkedTableItem())>0);this._getInternalModel().setProperty("/isMoveDownButtonEnabled",n.indexOf(this._getMarkedTableItem())>-1&&n.indexOf(this._getMarkedTableItem())<n.length-1);var i=sap.ui.getCore().byId(this._oTable.getId()+"-sa");if(i){i.setEnabled(!e&&!t)}};w.prototype._updateModelItemsPersistentIndex=function(e){var t=-1;e.forEach(function(e){e.persistentIndex=-1;if(e.persistentSelected){t++;e.persistentIndex=t}})};w.prototype._fireSetData=function(){this._bIgnoreUpdateInternalModel=true;this.fireSetData();this._bIgnoreUpdateInternalModel=false};w.prototype._fireChangeColumnsItems=function(){this._bIgnoreUpdateInternalModel=true;var e=this._getInternalModel().getProperty("/items");var t={newItems:[],existingItems:[],items:e.map(function(e){return{columnKey:e.columnKey,visible:e.persistentSelected,index:e.persistentIndex===-1?undefined:e.persistentIndex,width:e.width,total:e.total}})};e.forEach(function(e){var n=this._getColumnsItemByColumnKey(e.columnKey);if(n){n.setVisible(e.persistentSelected);n.setIndex(e.persistentIndex===-1?undefined:e.persistentIndex);if(e.width!==undefined){n.setWidth(e.width)}if(e.total!==undefined){n.setTotal(e.total)}t.existingItems.push(n)}else{t.newItems.push(new h({columnKey:e.columnKey,visible:e.persistentSelected,index:e.persistentIndex===-1?undefined:e.persistentIndex,width:e.width,total:e.total}))}},this);this.fireChangeColumnsItems(t);this._bIgnoreUpdateInternalModel=false};w.prototype._getColumnsItemByColumnKey=function(e){var t=this.getColumnsItems().filter(function(t){return t.getColumnKey()===e});return t[0]};w.prototype._getMarkedTableItem=function(){return this._getTableItemByColumnKey(this._getInternalModel().getProperty("/columnKeyOfMarkedItem"))};w.prototype._setColumnKeyOfMarkedItem=function(e){this._getInternalModel().setProperty("/columnKeyOfMarkedItem",e)};w.prototype._onItemPressed=function(e){this._switchMarkedTableItemTo(e.getParameter("listItem"));this._updateControlLogic()};w.prototype._onSelectionChange=function(e){if(!e.getParameter("selectAll")&&e.getParameter("listItems").length===1){this._switchMarkedTableItemTo(e.getParameter("listItem"))}this._selectTableItem()};w.prototype._selectTableItem=function(){this._updateControlLogic();var e=this._getInternalModel().getProperty("/items");this._updateModelItemsPersistentIndex(e);this._updateCounts(e);this._getInternalModel().setProperty("/items",e);this._fireChangeColumnsItems();this._fireSetData();this._notifyChange();var t=this.getValidationExecutor();if(t){t()}};w.prototype._switchMarkedTableItemTo=function(e){this._removeStyleOfMarkedTableItem();var t=this._getColumnKeyByTableItem(e);if(t){this._setColumnKeyOfMarkedItem(t);e.addStyleClass("sapMP13nColumnsPanelItemSelected")}};w.prototype._removeStyleOfMarkedTableItem=function(){if(this._getMarkedTableItem()){this._getMarkedTableItem().removeStyleClass("sapMP13nColumnsPanelItemSelected")}};w.prototype._filterModelItemsBySearchText=function(){var e=this._getSearchText();e=e.replace(/(^\s+)|(\s+$)/g,"");e=e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");var t=new RegExp(e,"igm");if(!t){return}this._getVisibleModelItems().forEach(function(e){e.visible=false;if(typeof e.text==="string"&&e.text.match(t)){e.visible=true}if(typeof e.tooltip==="string"&&e.tooltip.match(t)){e.visible=true}});this._getInternalModel().refresh()};w.prototype._updateInternalModel=function(){if(!this._bUpdateInternalModel){return}this._bUpdateInternalModel=false;this._removeStyleOfMarkedTableItem();var e=this._getInternalModel().getProperty("/items");this._getInternalModel().setProperty("/items",this.getItems().map(function(e){return{columnKey:e.getColumnKey(),visible:true,text:e.getText(),tooltip:e.getTooltip(),persistentIndex:-1,persistentSelected:e.getVisible(),width:undefined,total:undefined}},this));this.getColumnsItems().forEach(function(e){var t=this._getModelItemByColumnKey(e.getColumnKey());if(!t){return}if(e.getIndex()!==undefined){t.persistentIndex=e.getIndex()}if(e.getVisible()!==undefined){t.persistentSelected=e.getVisible()}if(e.getWidth()!==undefined){t.width=e.getWidth()}if(e.getTotal()!==undefined){t.total=e.getTotal()}},this);this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();var t=this._getInternalModel().getProperty("/items");this._sortModelItemsByPersistentIndex(t);this._updateCounts(t);this._getInternalModel().setProperty("/items",t);this._switchMarkedTableItemTo(this._getMarkedTableItem());if(b(t).not(e).length!==0||b(e).not(t).length!==0){this._bTableItemsChanged=true}};return w});