!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});n(1)},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e){return"undefined"!==typeof e.attributes&&(e.attributes=Object.assign(e.attributes,{monetizeBlockDisplay:{type:"string",default:"always-show"}})),e}function a(e,t,n){var o=n.monetizeBlockDisplay;return"undefined"!==typeof o&&"always-show"!==o&&(e.className=r()(e.className,"coil-"+o)),e}var l=n(2),r=n.n(l),s=n(3),c=(n.n(s),n(4)),u=(n.n(c),Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}),__=wp.i18n.__,p=wp.hooks.addFilter,d=wp.element.Fragment,m=wp.blockEditor||wp.editor,f=m.InspectorControls,w=wp.data,b=w.withSelect,y=w.withDispatch,g=wp.compose.createHigherOrderComponent,_=wp.components,v=_.PanelBody,h=_.RadioControl,z=wp.plugins.registerPlugin,P=wp.editPost.PluginDocumentSettingPanel,k=g(function(e){return function(t){var n=!1,o=t.attributes,i=t.setAttributes,a=t.isSelected,l=o.monetizeBlockDisplay,r=wp.data.select("core/editor").getEditedPostAttribute("meta");return n=!1,"undefined"!==typeof r&&("undefined"===typeof r._coil_monetize_post_status||"undefined"!==typeof r._coil_monetize_post_status&&"gate-tagged-blocks"===r._coil_monetize_post_status)&&(n=!0),wp.element.createElement(d,null,wp.element.createElement(e,t),a&&n&&wp.element.createElement(f,null,wp.element.createElement(v,{title:__("Coil Web Monetization"),initialOpen:!1,className:"coil-panel"},wp.element.createElement(h,{selected:l,options:[{label:__("Always Show"),value:"always-show"},{label:__("Only Show Paying Viewers"),value:"show-monetize-users"},{label:__("Hide For Paying Viewers"),value:"hide-monetize-users"}],help:__("Set the visibility based on the monetization you prefer."),onChange:function(e){return i({monetizeBlockDisplay:e})}}))))}},"monetizeBlockControls"),O=g(function(e){return function(t){var n=t.wrapperProps,o={},i=!1,a=t.attributes,l=a.monetizeBlockDisplay,r=wp.data.select("core/editor").getEditedPostAttribute("meta");return i=!r||"undefined"===typeof r._coil_monetize_post_status||"undefined"!==typeof r._coil_monetize_post_status&&"gate-tagged-blocks"===r._coil_monetize_post_status,o=Object.assign(o,{"data-coil-is-monetized":1}),n=Object.assign({},n,o),"undefined"!==typeof l&&"always-show"!==l&&i?wp.element.createElement(e,u({},t,{className:"coil-"+l,wrapperProps:n})):wp.element.createElement(e,t)}},"wrapperClass");p("blocks.registerBlockType","coil/addAttributes",i),p("editor.BlockEdit","coil/monetizeBlockControls",k),p("blocks.getSaveContent.extraProps","coil/applyExtraClass",a),p("editor.BlockListBlock","coil/wrapperClass",O);var E=y(function(e,t){return{updateMetaValue:function(n){e("core/editor").editPost({meta:o({},t.metaFieldName,n)})}}})(b(function(e,t){var n=e("core/editor").getEditedPostAttribute("meta");return o({},t.metaFieldName,n&&n._coil_monetize_post_status)})(function(e){return wp.element.createElement(h,{selected:e[e.metaFieldName]?e[e.metaFieldName]:"default",options:[{label:__("Use Default","coil-web-monetization"),value:"default"},{label:__("No Monetization","coil-web-monetization"),value:"no"},{label:__("Monetized and Public","coil-web-monetization"),value:"no-gating"},{label:__("Paying Viewers Only","coil-web-monetization"),value:"gate-all"},{label:__("Split Content","coil-web-monetization"),value:"gate-tagged-blocks"}],help:__("Set the type of monetization for the article."),onChange:function(t){return e.updateMetaValue(t)}})}));P&&z("coil-document-setting-panel",{render:function(){return wp.element.createElement(P,{name:"coil-meta",title:__("Coil Web Monetization","coil-web-monetization"),initialOpen:!1,className:"coil-document-panel"},wp.element.createElement(E,{metaFieldName:"_coil_monetize_post_status"}))},icon:""})},function(e,t,n){var o,i;!function(){"use strict";function n(){for(var e=[],t=0;t<arguments.length;t++){var o=arguments[t];if(o){var i=typeof o;if("string"===i||"number"===i)e.push(o);else if(Array.isArray(o)&&o.length){var l=n.apply(null,o);l&&e.push(l)}else if("object"===i)for(var r in o)a.call(o,r)&&o[r]&&e.push(r)}}return e.join(" ")}var a={}.hasOwnProperty;"undefined"!==typeof e&&e.exports?(n.default=n,e.exports=n):(o=[],void 0!==(i=function(){return n}.apply(t,o))&&(e.exports=i))}()},function(e,t){},function(e,t){}]);