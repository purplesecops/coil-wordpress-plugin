!function(e){function t(n){if(i[n])return i[n].exports;var o=i[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var i={};t.m=e,t.c=i,t.d=function(e,i,n){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});i(1)},function(e,t,i){"use strict";function n(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function o(e){return"undefined"!==typeof e.attributes&&(e.attributes=Object.assign(e.attributes,{monetizeBlockDisplay:{type:"string",default:"always-show"}})),e}function l(e,t){var i=t.monetizeBlockDisplay;return"undefined"!==typeof i&&"always-show"!==i&&(e.className=r()(e.className,"coil-"+i)),e}var a=i(2),r=i.n(a),s=i(3),c=(i.n(s),i(4)),u=(i.n(c),Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e}),__=wp.i18n.__,p=wp.hooks.addFilter,d=wp.element.Fragment,m=wp.blockEditor||wp.editor,b=m.InspectorControls,f=wp.data,v=f.withSelect,y=f.withDispatch,w=wp.compose.createHigherOrderComponent,_=wp.components,g=_.PanelBody,z=_.RadioControl,h=_.SelectControl,E=wp.plugins.registerPlugin,M=wp.editPost.PluginDocumentSettingPanel,P=w(function(e){return function(t){var i=!1,n=t.attributes,o=t.setAttributes,l=t.isSelected,a=n.monetizeBlockDisplay,r=wp.data.select("core/editor").getEditedPostAttribute("meta");return i=!1,"undefined"!==typeof r&&("undefined"!==typeof r._coil_visibility_post_status&&"gate-tagged-blocks"!==r._coil_visibility_post_status||(i=!0)),wp.element.createElement(d,null,wp.element.createElement(e,t),l&&i&&wp.element.createElement(b,null,wp.element.createElement(g,{title:__("Coil Web Monetization"),initialOpen:!1,className:"coil-panel"},wp.element.createElement(z,{label:__("Set the block's visibility.","coil-web-monetization"),selected:a,options:[{label:__("Always Show"),value:"always-show"},{label:__("Only Show Coil Members"),value:"show-monetize-users"},{label:__("Hide For Coil Members"),value:"hide-monetize-users"}],onChange:function(e){return o({monetizeBlockDisplay:e})}}))))}},"monetizeBlockControls"),N=w(function(e){return function(t){var i=t.wrapperProps,n={},o=!1,l=t.attributes,a=l.monetizeBlockDisplay,r=wp.data.select("core/editor").getEditedPostAttribute("meta");return o=!r||"undefined"===typeof r._coil_visibility_post_status||"undefined"!==typeof r._coil_visibility_post_status&&"gate-tagged-blocks"===r._coil_visibility_post_status,n=Object.assign(n,{"data-coil-is-monetized":1}),i=Object.assign({},i,n),"undefined"!==typeof a&&"always-show"!==a&&o?wp.element.createElement(e,u({},t,{className:"coil-"+a,wrapperProps:i})):wp.element.createElement(e,t)}},"wrapperClass");p("blocks.registerBlockType","coil/addAttributes",o),p("editor.BlockEdit","coil/monetizeBlockControls",P),p("blocks.getSaveContent.extraProps","coil/applyExtraClass",l),p("editor.BlockListBlock","coil/wrapperClass",N);var k=y(function(e,t){return{updateVisibilityMetaValue:function(i){e("core/editor").editPost({meta:n({},t.visibilityMetaFieldName,i)})},updateMonetizationMetaValue:function(i){var o,l="public";"default"===i?l="default":"monetized"===i&&(l=coilEditorParams.visibilityDefault),e("core/editor").editPost({meta:(o={},n(o,t.monetizationMetaFieldName,i),n(o,t.visibilityMetaFieldName,l),o)})}}})(v(function(e,t){var i,o=e("core/editor").getEditedPostAttribute("meta"),l=__("Enabled & Exclusive");return"not-monetized"===coilEditorParams.monetizationDefault?l=__("Disabled"):"public"===coilEditorParams.visibilityDefault&&(l=__("Enabled & Public")),i={},n(i,t.monetizationMetaFieldName,o&&o._coil_monetization_post_status),n(i,t.visibilityMetaFieldName,o&&o._coil_visibility_post_status),n(i,"defaultLabel",l),i})(function(e){return wp.element.createElement("div",null,wp.element.createElement("div",null,wp.element.createElement(h,{label:__("Select a monetization status","coil-web-monetization"),value:e[e.monetizationMetaFieldName]?e[e.monetizationMetaFieldName]:"default",onChange:function(t){return e.updateMonetizationMetaValue(t)},options:[{value:"default",label:"Default ("+e.defaultLabel+")"},{value:"monetized",label:"Enabled"},{value:"not-monetized",label:"Disabled"}]})),wp.element.createElement("div",{className:"coil-post-monetization-level "+(e[e.monetizationMetaFieldName]?e[e.monetizationMetaFieldName]:"default")},wp.element.createElement(z,{label:__("Who can access this content?","coil-web-monetization"),selected:e[e.visibilityMetaFieldName]&&"default"!==e[e.visibilityMetaFieldName]?e[e.visibilityMetaFieldName]:coilEditorParams.visibilityDefault,options:[{label:__("Everyone","coil-web-monetization"),value:"public"},{label:__("Coil Members Only","coil-web-monetization"),value:"exclusive"},{label:__("Split","coil-web-monetization"),value:"gate-tagged-blocks"}],onChange:function(t){return e.updateVisibilityMetaValue(t)}})))}));M&&E("coil-document-setting-panel",{render:function(){return wp.element.createElement(M,{name:"coil-meta",title:__("Coil Web Monetization","coil-web-monetization"),initialOpen:!1,className:"coil-document-panel"},wp.element.createElement(k,{monetizationMetaFieldName:"_coil_monetization_post_status",visibilityMetaFieldName:"_coil_visibility_post_status"}))},icon:""})},function(e,t,i){var n,o;!function(){"use strict";function i(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var o=typeof n;if("string"===o||"number"===o)e.push(n);else if(Array.isArray(n)){if(n.length){var a=i.apply(null,n);a&&e.push(a)}}else if("object"===o)if(n.toString===Object.prototype.toString)for(var r in n)l.call(n,r)&&n[r]&&e.push(r);else e.push(n.toString())}}return e.join(" ")}var l={}.hasOwnProperty;"undefined"!==typeof e&&e.exports?(i.default=i,e.exports=i):(n=[],void 0!==(o=function(){return i}.apply(t,n))&&(e.exports=o))}()},function(e,t){},function(e,t){}]);