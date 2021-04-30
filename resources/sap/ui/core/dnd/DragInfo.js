/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./DragDropBase"],function(r){"use strict";var e=r.extend("sap.ui.core.dnd.DragInfo",{metadata:{library:"sap.ui.core",interfaces:["sap.ui.core.dnd.IDragInfo"],properties:{sourceAggregation:{type:"string",defaultValue:null}},events:{dragStart:{allowPreventDefault:true},dragEnd:{}}}});e.prototype.isDraggable=function(r){if(!this.getEnabled()){return false}var e=this.getParent();if(!e){return false}var t=this.getSourceAggregation();if(!this.checkMetadata(e,t,"draggable")){return false}if(e===r&&!t){return true}if(r.getParent()===e&&t===r.sParentAggregationName){return true}return false};e.prototype.fireDragStart=function(r){if(!r||!r.dragSession){return}var e=r.dragSession;return this.fireEvent("dragStart",{dragSession:e,browserEvent:r.originalEvent,target:e.getDragControl()},true)};e.prototype.fireDragEnd=function(r){if(!r||!r.dragSession){return}var e=r.dragSession;return this.fireEvent("dragEnd",{dragSession:e,browserEvent:r.originalEvent,target:e.getDragControl()})};return e});