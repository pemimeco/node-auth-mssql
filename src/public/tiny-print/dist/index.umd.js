!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.tinyPrint=t()}(this,function(){var e=function(t,n){var o=t,i=window.getComputedStyle(t).cssText;return 0===t.children.length?(o.style.cssText=i,o):(o.style.cssText=i,Array.from(o.children).forEach(function(t){return e(t,o)}),o)};return function(t,n){if(t.nodeName){var o=n.scanStyles;void 0===o&&(o=!0);var i=n.importStyles;void 0===i&&(i=[]);var d=n.scanHTML;void 0===d&&(d=!1);var r=n.cssStyle;void 0===r&&(r="");var c=n.hidePageRule;void 0===c&&(c=!1);var l=document.createElement("iframe"),a=t.cloneNode(!0),s=document.querySelector(".tiny-print-container");s||((s=document.createElement("div")).classList.add("tiny-print-container"),s.style.cssText="width: 100%; height: 100%;",s.style.display="none",document.body.appendChild(s)),o&&(s.style.display="block",s.appendChild(a),a=e(a),s.style.display="none");var u=a.outerHTML;s.innerHTML="",s.appendChild(l),l.contentWindow.document.open(),l.contentWindow.document.write(u);var p=l.contentWindow.document.querySelector("head");if(d){var m=document.querySelectorAll("style"),y=document.querySelectorAll('link[href$=".css"]');m.forEach(function(e){var t=e.cloneNode(!0);p.appendChild(t)}),y.forEach(function(e){var t=e.cloneNode(!0);p.appendChild(t)})}if(i.length>0&&i.forEach(function(e){var t=document.createElement("link");t.setAttribute("type","text/css"),t.setAttribute("rel","stylesheet"),t.setAttribute("href",e),p.appendChild(t)}),r){var f=document.createElement("style");f.innerHTML=r,p.appendChild(f)}if(c){var h=document.createElement("style");h.innerHTML="@page { size: auto;  margin: 0mm; }",p.appendChild(h)}l.contentWindow.print(),l.contentWindow.document.close()}else console.warn("Invalid DOM element passed!")}});
//# sourceMappingURL=index.umd.js.map
