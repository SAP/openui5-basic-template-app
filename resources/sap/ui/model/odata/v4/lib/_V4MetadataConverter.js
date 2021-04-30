/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Helper","./_MetadataConverter"],function(t,e){"use strict";function o(){this.enumType=null;this.enumTypeMemberCounter=0;this.navigationProperty=null;e.call(this)}o.prototype=Object.create(e.prototype);o.prototype.finalize=function(){if(this.result.$Version!=="4.0"){throw new Error(this.url+": Unsupported OData version "+this.result.$Version)}};o.prototype.processActionOrFunction=function(t){var e=t.localName,o={$kind:e},s,i,n=this.namespace+t.getAttribute("Name"),r="",a=this;function p(t){var e={};a.processTypedCollection(t.getAttribute("Type"),e);return e.$isCollection?"Collection("+e.$Type+")":e.$Type}this.processAttributes(t,o,{IsBound:this.setIfTrue,EntitySetPath:this.setValue,IsComposable:this.setIfTrue});s=this.getOrCreateArray(this.result,n);if(!Array.isArray(s)){s=[];this.addToResult(n,s)}s.push(o);this.oOperation=o;if(o.$IsBound){i=t.getElementsByTagName("Parameter");r=t.localName==="Action"?p(i[0]):Array.prototype.map.call(i,p).join(",")}this.annotatable(n+"("+r+")")};o.prototype.processComplexType=function(t){this.processType(t,{$kind:"ComplexType"})};o.prototype.processEdmx=function(t){this.processAttributes(t,this.result,{Version:this.setValue})};o.prototype.processElement=function(t,e){if(e){e.call(this,t)}};o.prototype.processEntityContainer=function(t){var e=this.namespace+t.getAttribute("Name");this.entityContainer={$kind:"EntityContainer"};this.addToResult(e,this.entityContainer);this.addToResult("$EntityContainer",e);this.annotatable(e)};o.prototype.processEntitySet=function(t){var e=t.getAttribute("Name");this.entityContainer[e]=this.entitySet={$kind:"EntitySet",$Type:this.resolveAlias(t.getAttribute("EntityType"))};this.processAttributes(t,this.entitySet,{IncludeInServiceDocument:this.setIfFalse});this.annotatable(e)};o.prototype.processEntityType=function(t){this.processType(t,{$kind:"EntityType"})};o.prototype.processEntityTypeKeyPropertyRef=function(t){var e=t.getAttribute("Alias"),o,s=t.getAttribute("Name");if(e){o={};o[e]=s}else{o=s}this.getOrCreateArray(this.type,"$Key").push(o)};o.prototype.processEnumType=function(t){var e=this.namespace+t.getAttribute("Name"),o={$kind:"EnumType"};this.processAttributes(t,o,{IsFlags:this.setIfTrue,UnderlyingType:function(t){return t!=="Edm.Int32"?t:undefined}});this.enumType=o;this.addToResult(e,o);this.enumTypeMemberCounter=0;this.annotatable(e)};o.prototype.processEnumTypeMember=function(e){var o=e.getAttribute("Name"),s=e.getAttribute("Value"),i;if(s){i=parseInt(s);if(!t.isSafeInteger(i)){i=s}}else{i=this.enumTypeMemberCounter;this.enumTypeMemberCounter+=1}this.enumType[o]=i;this.annotatable(o)};o.prototype.processFacetAttributes=function(t,e){var o=this;this.processAttributes(t,e,{MaxLength:function(t){return t==="max"?undefined:o.setNumber(t)},Precision:this.setNumber,Scale:function(t){return t==="variable"?t:o.setNumber(t)},SRID:this.setValue,Unicode:this.setIfFalse})};o.prototype.processImport=function(t){var e=t.localName,o={$kind:e},s=t.getAttribute("Name"),i=this;e=e.replace("Import","");o["$"+e]=this.resolveAlias(t.getAttribute(e));this.processAttributes(t,o,{EntitySet:function(t){return i.resolveTargetPath(t)},IncludeInServiceDocument:this.setIfTrue});this.entityContainer[s]=o;this.annotatable(s)};o.prototype.processNavigationPropertyBinding=function(t){var e=this.getOrCreateObject(this.entitySet,"$NavigationPropertyBinding");e[t.getAttribute("Path")]=this.resolveTargetPath(t.getAttribute("Target"))};o.prototype.processParameter=function(t){var e=this.oOperation,o={};this.processTypedCollection(t.getAttribute("Type"),o);this.processAttributes(t,o,{Name:this.setValue,Nullable:this.setIfFalse});this.processFacetAttributes(t,o);this.getOrCreateArray(e,"$Parameter").push(o);this.annotatable(o.$Name)};o.prototype.processReturnType=function(t){var e=this.oOperation,o={};this.processTypedCollection(t.getAttribute("Type"),o);this.processAttributes(t,o,{Nullable:this.setIfFalse});this.processFacetAttributes(t,o);e.$ReturnType=o;this.annotatable("$ReturnType")};o.prototype.processSchema=function(t){this.namespace=t.getAttribute("Namespace")+".";this.schema={$kind:"Schema"};this.addToResult(this.namespace,this.schema);this.annotatable(this.schema)};o.prototype.processSingleton=function(t){var e=t.getAttribute("Name");this.entityContainer[e]=this.entitySet={$kind:"Singleton",$Type:this.resolveAlias(t.getAttribute("Type"))};this.annotatable(e)};o.prototype.processTerm=function(t){var e=this.namespace+t.getAttribute("Name"),o={$kind:"Term"},s=this;this.processTypedCollection(t.getAttribute("Type"),o);this.processAttributes(t,o,{Nullable:this.setIfFalse,BaseTerm:function(t){return t?s.resolveAlias(t):undefined}});this.processFacetAttributes(t,o);this.addToResult(e,o);this.annotatable(e)};o.prototype.processType=function(t,e){var o=this.namespace+t.getAttribute("Name"),s=this;this.processAttributes(t,e,{OpenType:s.setIfTrue,HasStream:s.setIfTrue,Abstract:s.setIfTrue,BaseType:function(t){return t?s.resolveAlias(t):undefined}});this.type=e;this.addToResult(o,e);this.annotatable(o)};o.prototype.processTypedCollection=function(t,e){var o=this.rCollection.exec(t);if(o){e.$isCollection=true;t=o[1]}e.$Type=this.resolveAlias(t)};o.prototype.processTypeDefinition=function(t){var e=this.namespace+t.getAttribute("Name"),o={$kind:"TypeDefinition",$UnderlyingType:t.getAttribute("UnderlyingType")};this.addToResult(e,o);this.processFacetAttributes(t,o);this.annotatable(e)};o.prototype.processTypeNavigationProperty=function(t){var e=t.getAttribute("Name"),o={$kind:"NavigationProperty"};this.processTypedCollection(t.getAttribute("Type"),o);this.processAttributes(t,o,{Nullable:this.setIfFalse,Partner:this.setValue,ContainsTarget:this.setIfTrue});this.type[e]=this.navigationProperty=o;this.annotatable(e)};o.prototype.processTypeNavigationPropertyOnDelete=function(t){this.navigationProperty.$OnDelete=t.getAttribute("Action");this.annotatable(this.navigationProperty,"$OnDelete")};o.prototype.processTypeNavigationPropertyReferentialConstraint=function(t){var e=t.getAttribute("Property"),o=this.getOrCreateObject(this.navigationProperty,"$ReferentialConstraint");o[e]=t.getAttribute("ReferencedProperty");this.annotatable(o,e)};o.prototype.processTypeProperty=function(t){var e=t.getAttribute("Name"),o={$kind:"Property"};this.processTypedCollection(t.getAttribute("Type"),o);this.processAttributes(t,o,{Nullable:this.setIfFalse,DefaultValue:this.setValue});this.processFacetAttributes(t,o);this.type[e]=o;this.annotatable(e)};o.prototype.resolveTargetPath=function(t){var e;if(!t){return t}t=this.resolveAliasInPath(t);e=t.indexOf("/");if(e>=0&&t.indexOf("/",e+1)<0){if(t.slice(0,e)===this.result.$EntityContainer){return t.slice(e+1)}}return t};(function(t){var e,o,s;t.sRootNamespace=t.sEdmxNamespace;t.oAliasConfig={__xmlns:t.sEdmxNamespace,Reference:{Include:{__processor:t.processAlias}},DataServices:{Schema:{__xmlns:t.sEdmNamespace,__processor:t.processAlias}}};s={Property:{__processor:t.processTypeProperty,__include:[t.oAnnotationConfig]},NavigationProperty:{__processor:t.processTypeNavigationProperty,__include:[t.oAnnotationConfig],OnDelete:{__processor:t.processTypeNavigationPropertyOnDelete,__include:[t.oAnnotationConfig]},ReferentialConstraint:{__processor:t.processTypeNavigationPropertyReferentialConstraint,__include:[t.oAnnotationConfig]}}};o={NavigationPropertyBinding:{__processor:t.processNavigationPropertyBinding}};e={Parameter:{__processor:t.processParameter,__include:[t.oAnnotationConfig]},ReturnType:{__processor:t.processReturnType,__include:[t.oAnnotationConfig]}};t.oFullConfig={__xmlns:t.sEdmxNamespace,__processor:t.processEdmx,__include:[t.oReferenceInclude],DataServices:{Schema:{__xmlns:t.sEdmNamespace,__processor:t.processSchema,__include:[t.oAnnotationsConfig,t.oAnnotationConfig],Action:{__processor:t.processActionOrFunction,__include:[e,t.oAnnotationConfig]},Function:{__processor:t.processActionOrFunction,__include:[e,t.oAnnotationConfig]},EntityType:{__processor:t.processEntityType,__include:[s,t.oAnnotationConfig],Key:{PropertyRef:{__processor:t.processEntityTypeKeyPropertyRef}}},ComplexType:{__processor:t.processComplexType,__include:[s,t.oAnnotationConfig]},EntityContainer:{__processor:t.processEntityContainer,__include:[t.oAnnotationConfig],ActionImport:{__processor:t.processImport,__include:[t.oAnnotationConfig]},EntitySet:{__processor:t.processEntitySet,__include:[o,t.oAnnotationConfig]},FunctionImport:{__processor:t.processImport,__include:[t.oAnnotationConfig]},Singleton:{__processor:t.processSingleton,__include:[o,t.oAnnotationConfig]}},EnumType:{__processor:t.processEnumType,__include:[t.oAnnotationConfig],Member:{__processor:t.processEnumTypeMember,__include:[t.oAnnotationConfig]}},Term:{__processor:t.processTerm,__include:[t.oAnnotationConfig]},TypeDefinition:{__processor:t.processTypeDefinition,__include:[t.oAnnotationConfig]}}}}})(o.prototype);return o},false);