var e=function(t,n){var o=t,r=window.getComputedStyle(t).cssText;return 0===t.children.length?(o.style.cssText=r,o):(o.style.cssText=r,Array.from(o.children).forEach(function(t){return e(t,o)}),o)};export default function(t,n){if(t.nodeName){var o=n.scanStyles;void 0===o&&(o=!0);var r=n.importStyles;void 0===r&&(r=[]);var d=n.scanHTML;void 0===d&&(d=!1);var i=n.cssStyle;void 0===i&&(i="");var c=n.hidePageRule;void 0===c&&(c=!1);var l=document.createElement("iframe"),a=t.cloneNode(!0),s=document.querySelector(".tiny-print-container");s||((s=document.createElement("div")).classList.add("tiny-print-container"),s.style.cssText="width: 100%; height: 100%;",s.style.display="none",document.body.appendChild(s)),o&&(s.style.display="block",s.appendChild(a),a=e(a),s.style.display="none");var u=a.outerHTML;s.innerHTML="",s.appendChild(l),l.contentWindow.document.open(),l.contentWindow.document.write(u);var p=l.contentWindow.document.querySelector("head");if(d){var m=document.querySelectorAll("style"),y=document.querySelectorAll('link[href$=".css"]');m.forEach(function(e){var t=e.cloneNode(!0);p.appendChild(t)}),y.forEach(function(e){var t=e.cloneNode(!0);p.appendChild(t)})}if(r.length>0&&r.forEach(function(e){var t=document.createElement("link");t.setAttribute("type","text/css"),t.setAttribute("rel","stylesheet"),t.setAttribute("href",e),p.appendChild(t)}),i){var h=document.createElement("style");h.innerHTML=i,p.appendChild(h)}if(c){var v=document.createElement("style");v.innerHTML="@page { size: auto;  margin: 0mm; }",p.appendChild(v)}l.contentWindow.print(),l.contentWindow.document.close()}else console.warn("Invalid DOM element passed!")}
//# sourceMappingURL=index.mjs.map
