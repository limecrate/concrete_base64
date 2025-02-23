(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const B of n.addedNodes)B.tagName==="LINK"&&B.rel==="modulepreload"&&r(B)}).observe(document,{childList:!0,subtree:!0});function o(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=o(s);fetch(s.href,n)}})();function T(e,t=!1,o=!1){return Uint8Array.prototype.toBase64?(console.log("Encode with toBase64!"),e.toBase64({alphabet:t?"base64url":"base64",omitPadding:o})):(console.log("Encode with compatible mode"),E(e,t,o))}function A(e,t=!1){return Uint8Array.fromBase64?(console.log("Decode with fromBase64!"),Uint8Array.fromBase64(e,{alphabet:t?"base64url":"base64"})):(console.log("Decode with compatible mode"),C(e,t))}function E(e,t=!1,o=!1){const r=Array.from(e,n=>String.fromCodePoint(n)).join(""),s=btoa(r);return!t&&!o?s:t?o?s.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""):s.replace(/\+/g,"-").replace(/\//g,"_"):s.replace(/=+$/,"")}function C(e,t=!1){const o=t?e.replace(/-/g,"+").replace(/_/g,"/"):e,r=atob(o);return Uint8Array.from(r,s=>s.codePointAt(0))}const I=[{ext:"png",sig:[137,80,78,71,13,10,26,10],ofs:0},{ext:"jpg",sig:[255,216,255,224],ofs:0},{ext:"jpg",sig:[255,216,255,225],ofs:0},{ext:"webp",sig:[82,73,70,70,null,null,null,null,87,69,66,80],ofs:0},{ext:"gif",sig:[71,73,70,56,55,97],ofs:0},{ext:"gif",sig:[71,73,70,56,57,97],ofs:0},{ext:"bmp",sig:[66,77],ofs:0},{ext:"avif",sig:[102,116,121,112,97,118,105,102],ofs:4},{ext:"heif",sig:[0,0,0,24,102,116,121,112,104,101,105,99],ofs:4},{ext:"mp3",sig:[255,251],ofs:0},{ext:"ogg",sig:[79,103,103,83],ofs:0},{ext:"wav",sig:[82,73,70,70,null,null,null,null,87,65,86,69],ofs:0},{ext:"ttf",sig:[116,114,117,101,0],ofs:0},{ext:"otf",sig:[79,84,84,79,0],ofs:0},{ext:"woff",sig:[119,79,70,70],ofs:0},{ext:"woff2",sig:[119,79,70,50],ofs:0},{ext:"pdf",sig:[37,80,68,70,45],ofs:0},{ext:"epub",sig:[80,75,3,4,10,0,2,0],ofs:0},{ext:"doc",sig:[208,207,17,224,161,177,26,225],ofs:0},{ext:"webm",sig:[26,69,223,163],ofs:0},{ext:"mp4",sig:[102,116,121,112,105,115,111,109],ofs:4},{ext:"mp4",sig:[102,116,121,112,77,83,78,86],ofs:4},{ext:"mov",sig:[102,116,121,112,113,116,32,32],ofs:4},{ext:"mov",sig:[109,111,111,118],ofs:4},{ext:"wasm",sig:[0,97,115,109],ofs:0},{ext:"exe",sig:[90,77],ofs:0},{ext:"7z",sig:[55,122,188,175,39,28],ofs:0},{ext:"gz",sig:[31,139],ofs:0},{ext:"xz",sig:[253,55,122,88,90,0],ofs:0},{ext:"zip",sig:[80,75,3,4],ofs:0},{ext:"tar",sig:[117,115,116,97,114,0,48,48],ofs:257},{ext:"tar",sig:[117,115,116,97,114,32,32,0],ofs:257}],d=1024,u=1048576,g=1073741824,m=1099511627776,p=0x4000000000000;function R(e){let t=0;for(const o of I){for(t=0;t<o.sig.length&&!(o.sig[t]!==null&&e[t+o.ofs]!==o.sig[t]);t+=1);if(t===o.sig.length)return o.ext}return"txt"}function w(e){return e?e<d?`${e} B`:e<u?`${e%d?(e/d).toFixed(1):e/d} KiB`:e<g?`${e%u?(e/u).toFixed(1):e/u} MiB`:e<m?`${e%g?(e/g).toFixed(1):e/g} GiB`:e<p?`${e%m?(e/m).toFixed(1):e/m} TiB`:`${e%p?(e/p).toFixed(1):e/p} PiB`:""}function L(e,t,o=!0){return o?e.startsWith(".")?`.${e.slice(1).replace(/\./g,"_")}.${t}`:`${e.replace(/\./g,"_")}.${t}`:`${e}.${t}`}const i=document.querySelector("#file-input"),x=document.querySelector("#download"),P=document.querySelector("#to-b64"),U=document.querySelector("#to-b64-url-safe"),v=document.querySelector("#to-b64-omit-padding"),M=document.querySelector("#to-bin"),F=document.querySelector("#to-bin-url-safe"),_=document.querySelector("#file-names"),j=document.querySelector("#file-size"),$=document.querySelector("#download > span"),h=document.querySelector("#message"),S=document.querySelector("#processing-modal");let c=localStorage.getItem("isToB64Url")==="true",f=localStorage.getItem("isToB64Omit")==="true",l=localStorage.getItem("isToBinUrl")==="true";a(U,c);a(v,f);a(F,l);i.addEventListener("change",function(e){var o,r;_.textContent=((o=i.files[0])==null?void 0:o.name.normalize("NFC"))??"";const t=w((r=i.files[0])==null?void 0:r.size);j.textContent=t?`(${t})`:"",y(h),y(x)});P.addEventListener("click",function(){if(!i.files.length){b("Upload file to encode");return}O("Encoding...");const e=new FileReader;e.onload=function(){try{const t=new Uint8Array(e.result),o=T(t,c,f),r=new Blob([o],{type:"text/plain"}),s=URL.createObjectURL(r),n=L(i.files[0].name,"txt");$.textContent=w(r.size),x.href=s,x.download=n,q(x)}catch(t){console.error(t),b(`Failed encoding..
File size might be too large.`)}finally{S.close()}},e.readAsArrayBuffer(i.files[0])});M.addEventListener("click",function(){if(!i.files.length){b("Upload file to decode");return}O("Decoding...");const e=new FileReader;e.onload=function(){try{const t=A(e.result,l);if(t.length===0)throw new Error("Something wrong. Result is 0 bytes");const o=new Blob([t]),r=URL.createObjectURL(o),s=L(i.files[0].name,R(t));$.textContent=w(o.size),x.href=r,x.download=s,q(x)}catch(t){console.error(t),b(`Failed decoding..
`+(l?"This file might be invalid or too large.":"Try to use URL safe option."))}finally{S.close()}},e.readAsText(i.files[0])});U.addEventListener("click",function(){c=!c,a(this,c),localStorage.setItem("isToB64Url",c)});v.addEventListener("click",function(){f=!f,a(this,f),localStorage.setItem("isToB64Omit",f)});F.addEventListener("click",function(){l=!l,a(this,l),localStorage.setItem("isToBinUrl",l)});function a(e,t){t?(e.classList.remove("push"),e.classList.add("half-push")):(e.classList.remove("half-push"),e.classList.add("push"))}function b(e){h.textContent=e,h.classList.remove("hide")}function y(e){e.classList.add("hide")}function q(e){e.classList.remove("hide")}function O(e){y(h),y(x),document.querySelector("#processing-modal > span").textContent=e,S.showModal()}
