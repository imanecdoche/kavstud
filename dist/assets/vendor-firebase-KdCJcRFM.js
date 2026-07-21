var K7=Object.defineProperty;var Q7=(r,e,t)=>e in r?K7(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var y=(r,e,t)=>Q7(r,typeof e!="symbol"?e+"":e,t);const Y7=()=>{};var sf={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dp=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},X7=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],a=r[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Vp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,a=o?r[s+1]:0,u=s+2<r.length,l=u?r[s+2]:0,d=i>>2,f=(i&3)<<4|a>>4;let g=(a&15)<<2|l>>6,I=l&63;u||(I=64,o||(g=64)),n.push(t[d],t[f],t[g],t[I])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(Dp(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):X7(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],a=s<r.length?t[r.charAt(s)]:0;++s;const l=s<r.length?t[r.charAt(s)]:64;++s;const f=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||a==null||l==null||f==null)throw new J7;const g=i<<2|a>>4;if(n.push(g),l!==64){const I=a<<4&240|l>>2;if(n.push(I),f!==64){const R=l<<6&192|f;n.push(R)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class J7 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Z7=function(r){const e=Dp(r);return Vp.encodeByteArray(e,!0)},hc=function(r){return Z7(r).replace(/\./g,"")},Op=function(r){try{return Vp.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e4=()=>kp().__FIREBASE_DEFAULTS__,t4=()=>{if(typeof process>"u"||typeof sf>"u")return;const r=sf.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},n4=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Op(r[1]);return e&&JSON.parse(e)},Gc=()=>{try{return Y7()||e4()||t4()||n4()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},xp=r=>{var e,t;return(t=(e=Gc())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},Lp=r=>{const e=xp(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Mp=()=>{var r;return(r=Gc())==null?void 0:r.config},Fp=r=>{var e;return(e=Gc())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Up{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bp(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[hc(JSON.stringify(t)),hc(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function r4(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ye())}function qp(){var e;const r=(e=Gc())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function s4(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function i4(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function o4(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function a4(){const r=Ye();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Gp(){return!qp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function $p(){return!qp()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function zp(){try{return typeof indexedDB=="object"}catch{return!1}}function c4(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}function Av(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u4="FirebaseError";class mn extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=u4,Object.setPrototypeOf(this,mn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ea.prototype.create)}}class ea{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?l4(i,n):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new mn(s,a,n)}}function l4(r,e){return r.replace(h4,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const h4=/\{\$([^}]+)}/g;function d4(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Wt(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(of(i)&&of(o)){if(!Wt(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function of(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function oo(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function ao(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function f4(r,e){const t=new p4(r,e);return t.subscribe.bind(t)}class p4{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");m4(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=tl),s.error===void 0&&(s.error=tl),s.complete===void 0&&(s.complete=tl);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function m4(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function tl(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ds(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function $c(r){return(await fetch(r,{credentials:"include"})).ok}class mr{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g4{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new Up;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(y4(e))try{this.getOrInitializeService({instanceIdentifier:qr})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=qr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=qr){return this.instances.has(e)}getOptions(e=qr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);n===a&&o.resolve(s)}return s}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(n)??new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:_4(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=qr){return this.component?this.component.multipleInstances?e:qr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function _4(r){return r===qr?void 0:r}function y4(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E4{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new g4(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fe;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(fe||(fe={}));const I4={debug:fe.DEBUG,verbose:fe.VERBOSE,info:fe.INFO,warn:fe.WARN,error:fe.ERROR,silent:fe.SILENT},T4=fe.INFO,w4={[fe.DEBUG]:"log",[fe.VERBOSE]:"log",[fe.INFO]:"info",[fe.WARN]:"warn",[fe.ERROR]:"error"},A4=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=w4[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class uh{constructor(e){this.name=e,this._logLevel=T4,this._logHandler=A4,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in fe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?I4[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,fe.DEBUG,...e),this._logHandler(this,fe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,fe.VERBOSE,...e),this._logHandler(this,fe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,fe.INFO,...e),this._logHandler(this,fe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,fe.WARN,...e),this._logHandler(this,fe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,fe.ERROR,...e),this._logHandler(this,fe.ERROR,...e)}}const v4=(r,e)=>e.some(t=>r instanceof t);let af,cf;function R4(){return af||(af=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function P4(){return cf||(cf=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Hp=new WeakMap,vl=new WeakMap,jp=new WeakMap,nl=new WeakMap,lh=new WeakMap;function S4(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(bn(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Hp.set(t,r)}).catch(()=>{}),lh.set(e,r),e}function b4(r){if(vl.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});vl.set(r,e)}let Rl={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return vl.get(r);if(e==="objectStoreNames")return r.objectStoreNames||jp.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return bn(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function C4(r){Rl=r(Rl)}function N4(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(rl(this),e,...t);return jp.set(n,e.sort?e.sort():[e]),bn(n)}:P4().includes(r)?function(...e){return r.apply(rl(this),e),bn(Hp.get(this))}:function(...e){return bn(r.apply(rl(this),e))}}function D4(r){return typeof r=="function"?N4(r):(r instanceof IDBTransaction&&b4(r),v4(r,R4())?new Proxy(r,Rl):r)}function bn(r){if(r instanceof IDBRequest)return S4(r);if(nl.has(r))return nl.get(r);const e=D4(r);return e!==r&&(nl.set(r,e),lh.set(e,r)),e}const rl=r=>lh.get(r);function V4(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),a=bn(o);return n&&o.addEventListener("upgradeneeded",u=>{n(bn(o.result),u.oldVersion,u.newVersion,bn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),a.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),a}function vv(r,{blocked:e}={}){const t=indexedDB.deleteDatabase(r);return e&&t.addEventListener("blocked",n=>e(n.oldVersion,n)),bn(t).then(()=>{})}const O4=["get","getKey","getAll","getAllKeys","count"],k4=["put","add","delete","clear"],sl=new Map;function uf(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(sl.get(e))return sl.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=k4.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||O4.includes(t)))return;const i=async function(o,...a){const u=this.transaction(o,s?"readwrite":"readonly");let l=u.store;return n&&(l=l.index(a.shift())),(await Promise.all([l[t](...a),s&&u.done]))[0]};return sl.set(e,i),i}C4(r=>({...r,get:(e,t,n)=>uf(e,t)||r.get(e,t,n),has:(e,t)=>!!uf(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x4{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(L4(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function L4(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Pl="@firebase/app",lf="0.15.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vn=new uh("@firebase/app"),M4="@firebase/app-compat",F4="@firebase/analytics-compat",U4="@firebase/analytics",B4="@firebase/app-check-compat",q4="@firebase/app-check",G4="@firebase/auth",$4="@firebase/auth-compat",z4="@firebase/database",H4="@firebase/data-connect",j4="@firebase/database-compat",W4="@firebase/functions",K4="@firebase/functions-compat",Q4="@firebase/installations",Y4="@firebase/installations-compat",X4="@firebase/messaging",J4="@firebase/messaging-compat",Z4="@firebase/performance",e_="@firebase/performance-compat",t_="@firebase/remote-config",n_="@firebase/remote-config-compat",r_="@firebase/storage",s_="@firebase/storage-compat",i_="@firebase/firestore",o_="@firebase/ai",a_="@firebase/firestore-compat",c_="firebase",u_="12.16.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc="[DEFAULT]",l_={[Pl]:"fire-core",[M4]:"fire-core-compat",[U4]:"fire-analytics",[F4]:"fire-analytics-compat",[q4]:"fire-app-check",[B4]:"fire-app-check-compat",[G4]:"fire-auth",[$4]:"fire-auth-compat",[z4]:"fire-rtdb",[H4]:"fire-data-connect",[j4]:"fire-rtdb-compat",[W4]:"fire-fn",[K4]:"fire-fn-compat",[Q4]:"fire-iid",[Y4]:"fire-iid-compat",[X4]:"fire-fcm",[J4]:"fire-fcm-compat",[Z4]:"fire-perf",[e_]:"fire-perf-compat",[t_]:"fire-rc",[n_]:"fire-rc-compat",[r_]:"fire-gcs",[s_]:"fire-gcs-compat",[i_]:"fire-fst",[a_]:"fire-fst-compat",[o_]:"fire-vertex","fire-js":"fire-js",[c_]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc=new Map,h_=new Map,Sl=new Map;function hf(r,e){try{r.container.addComponent(e)}catch(t){Vn.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function ns(r){const e=r.name;if(Sl.has(e))return Vn.debug(`There were multiple attempts to register component ${e}.`),!1;Sl.set(e,r);for(const t of fc.values())hf(t,r);for(const t of h_.values())hf(t,r);return!0}function gi(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function d_(r,e,t=dc){gi(r,e).clearInstance(t)}function Ve(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},cr=new ea("app","Firebase",f_);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new mr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw cr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fs=u_;function m_(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:dc,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw cr.create("bad-app-name",{appName:String(s)});if(t||(t=Mp()),!t)throw cr.create("no-options");const i=fc.get(s);if(i){if(Wt(t,i.options)&&Wt(n,i.config))return i;throw cr.create("duplicate-app",{appName:s})}const o=new E4(s);for(const u of Sl.values())o.addComponent(u);const a=new p_(t,n,o);return fc.set(s,a),a}function hh(r=dc){const e=fc.get(r);if(!e&&r===dc&&Mp())return m_();if(!e)throw cr.create("no-app",{appName:r});return e}function on(r,e,t){let n=l_[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${e}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Vn.warn(o.join(" "));return}ns(new mr(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g_="firebase-heartbeat-database",__=1,ko="firebase-heartbeat-store";let il=null;function Wp(){return il||(il=V4(g_,__,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ko)}catch(t){console.warn(t)}}}}).catch(r=>{throw cr.create("idb-open",{originalErrorMessage:r.message})})),il}async function y_(r){try{const t=(await Wp()).transaction(ko),n=await t.objectStore(ko).get(Kp(r));return await t.done,n}catch(e){if(e instanceof mn)Vn.warn(e.message);else{const t=cr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Vn.warn(t.message)}}}async function df(r,e){try{const n=(await Wp()).transaction(ko,"readwrite");await n.objectStore(ko).put(e,Kp(r)),await n.done}catch(t){if(t instanceof mn)Vn.warn(t.message);else{const n=cr.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Vn.warn(n.message)}}}function Kp(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E_=1024,I_=30;class T_{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new A_(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ff();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>I_){const o=v_(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Vn.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ff(),{heartbeatsToSend:n,unsentEntries:s}=w_(this._heartbeatsCache.heartbeats),i=hc(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Vn.warn(t),""}}}function ff(){return new Date().toISOString().substring(0,10)}function w_(r,e=E_){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),pf(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),pf(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class A_{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return zp()?c4().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await y_(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return df(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return df(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function pf(r){return hc(JSON.stringify({version:2,heartbeats:r})).length}function v_(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R_(r){ns(new mr("platform-logger",e=>new x4(e),"PRIVATE")),ns(new mr("heartbeat",e=>new T_(e),"PRIVATE")),on(Pl,lf,r),on(Pl,lf,"esm2020"),on("fire-js","")}R_("");var P_="firebase",S_="12.16.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */on(P_,S_,"app");/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b_={PHONE:"phone",TOTP:"totp"},C_={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},N_={EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},D_={LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},V_={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O_(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements.","invalid-hosting-link-domain":"The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."}}function Qp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const k_=O_,Yp=Qp,Xp=new ea("auth","Firebase",Qp()),x_={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_PASSWORD:"auth/missing-password",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type",INVALID_HOSTING_LINK_DOMAIN:"auth/invalid-hosting-link-domain"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc=new uh("@firebase/auth");function L_(r,...e){pc.logLevel<=fe.WARN&&pc.warn(`Auth (${fs}): ${r}`,...e)}function Xa(r,...e){pc.logLevel<=fe.ERROR&&pc.error(`Auth (${fs}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ct(r,...e){throw fh(r,...e)}function Tt(r,...e){return fh(r,...e)}function dh(r,e,t){const n={...Yp(),[e]:t};return new ea("auth","Firebase",n).create(e,{appName:r.name})}function st(r){return dh(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function _i(r,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&Ct(r,"argument-error"),dh(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function fh(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Xp.create(r,...e)}function q(r,e,...t){if(!r)throw fh(e,...t)}function Zt(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Xa(e),new Error(e)}function On(r,e){r||Zt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xo(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function ph(){return mf()==="http:"||mf()==="https:"}function mf(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M_(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ph()||i4()||"connection"in navigator)?navigator.onLine:!0}function F_(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,t){this.shortDelay=e,this.longDelay=t,On(t>e,"Short delay should be less than long delay!"),this.isMobile=r4()||o4()}get(){return M_()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mh(r,e){On(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jp{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Zt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Zt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Zt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U_={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B_=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],q_=new ta(3e4,6e4);function Ne(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function De(r,e,t,n,s={}){return Zp(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const a=mi({...o,key:r.config.apiKey}).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const l={method:e,headers:u,...i};return s4()||(l.referrerPolicy="strict-origin-when-cross-origin"),r.emulatorConfig&&ds(r.emulatorConfig.host)&&(l.credentials="include"),Jp.fetch()(await e6(r,r.config.apiHost,t,a),l)})}async function Zp(r,e,t){r._canInitEmulator=!1;const n={...U_,...e};try{const s=new $_(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw co(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[u,l]=a.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw co(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw co(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw co(r,"user-disabled",o);const d=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw dh(r,d,l);Ct(r,d)}}catch(s){if(s instanceof mn)throw s;Ct(r,"network-request-failed",{message:String(s)})}}async function Un(r,e,t,n,s={}){const i=await De(r,e,t,n,s);return"mfaPendingCredential"in i&&Ct(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function e6(r,e,t,n){const s=`${e}${t}?${n}`,i=r,o=i.config.emulator?mh(r.config,s):`${r.config.apiScheme}://${s}`;return B_.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function G_(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class $_{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Tt(this.auth,"network-request-failed")),q_.get())})}}function co(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=Tt(r,e,n);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gf(r){return r!==void 0&&r.getResponse!==void 0}function _f(r){return r!==void 0&&r.enterprise!==void 0}class t6{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return G_(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z_(r){return(await De(r,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function n6(r,e){return De(r,"GET","/v2/recaptchaConfig",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function H_(r,e){return De(r,"POST","/v1/accounts:delete",e)}async function j_(r,e){return De(r,"POST","/v1/accounts:update",e)}async function mc(r,e){return De(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function po(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W_(r,e=!1){return Y(r).getIdToken(e)}async function r6(r,e=!1){const t=Y(r),n=await t.getIdToken(e),s=zc(n);q(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:po(ol(s.auth_time)),issuedAtTime:po(ol(s.iat)),expirationTime:po(ol(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ol(r){return Number(r)*1e3}function zc(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Xa("JWT malformed, contained fewer than 3 sections"),null;try{const s=Op(t);return s?JSON.parse(s):(Xa("Failed to decode base64 JWT payload"),null)}catch(s){return Xa("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function yf(r){const e=zc(r);return q(e,"internal-error"),q(typeof e.exp<"u","internal-error"),q(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kn(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof mn&&K_(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function K_({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=po(this.lastLoginAt),this.creationTime=po(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lo(r){var f;const e=r.auth,t=await r.getIdToken(),n=await kn(r,mc(e,{idToken:t}));q(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=(f=s.providerUserInfo)!=null&&f.length?i6(s.providerUserInfo):[],o=Y_(r.providerData,i),a=r.isAnonymous,u=!(r.email&&s.passwordHash)&&!(o!=null&&o.length),l=a?u:!1,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new bl(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(r,d)}async function s6(r){const e=Y(r);await Lo(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Y_(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function i6(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X_(r,e){const t=await Zp(r,{},async()=>{const n=mi({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await e6(r,s,"/v1/token",`key=${i}`),a=await r._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:a,body:n};return r.emulatorConfig&&ds(r.emulatorConfig.host)&&(u.credentials="include"),Jp.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function J_(r,e){return De(r,"POST","/v2/accounts:revokeToken",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){q(e.idToken,"internal-error"),q(typeof e.idToken<"u","internal-error"),q(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):yf(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){q(e.length!==0,"internal-error");const t=yf(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(q(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await X_(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new Ms;return n&&(q(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(q(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(q(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ms,this.toJSON())}_performRefresh(){return Zt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xn(r,e){q(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class $t{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new Q_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new bl(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await kn(this,this.stsTokenManager.getToken(this.auth,e));return q(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return r6(this,e)}reload(){return s6(this)}_assign(e){this!==e&&(q(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new $t({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Lo(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ve(this.auth.app))return Promise.reject(st(this.auth));const e=await this.getIdToken();return await kn(this,H_(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,u=t._redirectEventId??void 0,l=t.createdAt??void 0,d=t.lastLoginAt??void 0,{uid:f,emailVerified:g,isAnonymous:I,providerData:R,stsTokenManager:O}=t;q(f&&O,e,"internal-error");const x=Ms.fromJSON(this.name,O);q(typeof f=="string",e,"internal-error"),Xn(n,e.name),Xn(s,e.name),q(typeof g=="boolean",e,"internal-error"),q(typeof I=="boolean",e,"internal-error"),Xn(i,e.name),Xn(o,e.name),Xn(a,e.name),Xn(u,e.name),Xn(l,e.name),Xn(d,e.name);const z=new $t({uid:f,auth:e,email:s,emailVerified:g,displayName:n,isAnonymous:I,photoURL:o,phoneNumber:i,tenantId:a,stsTokenManager:x,createdAt:l,lastLoginAt:d});return R&&Array.isArray(R)&&(z.providerData=R.map(Z=>({...Z}))),u&&(z._redirectEventId=u),z}static async _fromIdTokenResponse(e,t,n=!1){const s=new Ms;s.updateFromServerResponse(t);const i=new $t({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await Lo(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];q(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?i6(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),a=new Ms;a.updateFromIdToken(n);const u=new $t({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new bl(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,l),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ef=new Map;function Rn(r){On(r instanceof Function,"Expected a class definition");let e=Ef.get(r);return e?(On(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Ef.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o6{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}o6.type="NONE";const Cl=o6;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja(r,e,t){return`firebase:${r}:${e}:${t}`}class Fs{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Ja(this.userKey,s.apiKey,i),this.fullPersistenceKey=Ja("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await mc(this.auth,{idToken:e}).catch(()=>{});return t?$t._fromGetAccountInfoResponse(this.auth,t,e):null}return $t._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Fs(Rn(Cl),e,n);const s=(await Promise.all(t.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let i=s[0]||Rn(Cl);const o=Ja(n,e.config.apiKey,e.name);let a=null;for(const l of t)try{const d=await l._get(o);if(d){let f;if(typeof d=="string"){const g=await mc(e,{idToken:d}).catch(()=>{});if(!g)break;f=await $t._fromGetAccountInfoResponse(e,g,d)}else f=$t._fromJSON(e,d);l!==i&&(a=f),i=l;break}}catch{}const u=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Fs(i,e,n):(i=u[0],a&&await i._set(o,a.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new Fs(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function If(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(l6(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(a6(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(d6(e))return"Blackberry";if(f6(e))return"Webos";if(c6(e))return"Safari";if((e.includes("chrome/")||u6(e))&&!e.includes("edge/"))return"Chrome";if(h6(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function a6(r=Ye()){return/firefox\//i.test(r)}function c6(r=Ye()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function u6(r=Ye()){return/crios\//i.test(r)}function l6(r=Ye()){return/iemobile/i.test(r)}function h6(r=Ye()){return/android/i.test(r)}function d6(r=Ye()){return/blackberry/i.test(r)}function f6(r=Ye()){return/webos/i.test(r)}function gh(r=Ye()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function Z_(r=Ye()){var e;return gh(r)&&!!((e=window.navigator)!=null&&e.standalone)}function e3(){return a4()&&document.documentMode===10}function p6(r=Ye()){return gh(r)||h6(r)||f6(r)||d6(r)||/windows phone/i.test(r)||l6(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m6(r,e=[]){let t;switch(r){case"Browser":t=If(Ye());break;case"Worker":t=`${If(Ye())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${fs}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t3{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,a)=>{try{const u=e(i);o(u)}catch(u){a(u)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function n3(r,e={}){return De(r,"GET","/v2/passwordPolicy",Ne(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const r3=6;class s3{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??r3,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i3{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Tf(this),this.idTokenSubscription=new Tf(this),this.beforeStateQueue=new t3(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Xp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Rn(t)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted&&(this.persistenceManager=await Fs.create(this,e),(n=this._resolvePersistenceManagerAvailable)==null||n.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await mc(this,{idToken:e}),n=await $t._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(Ve(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,a=n==null?void 0:n._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===a)&&(u!=null&&u.user)&&(n=u.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Lo(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=F_()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ve(this.app))return Promise.reject(st(this));const t=e?Y(e):null;return t&&q(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&q(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ve(this.app)?Promise.reject(st(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ve(this.app)?Promise.reject(st(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Rn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await n3(this),t=new s3(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ea("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await J_(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Rn(e)||this._popupRedirectResolver;q(t,this,"argument-error"),this.redirectPersistenceManager=await Fs.create(this,[Rn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(q(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,n,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=m6(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(Ve(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&L_(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Fe(r){return Y(r)}class Tf{constructor(e){this.auth=e,this.observer=null,this.addObserver=f4(t=>this.observer=t)}get next(){return q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let na={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function o3(r){na=r}function _h(r){return na.loadJS(r)}function a3(){return na.recaptchaV2Script}function c3(){return na.recaptchaEnterpriseScript}function u3(){return na.gapiScript}function g6(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l3=500,h3=6e4,Ma=1e12;class d3{constructor(e){this.auth=e,this.counter=Ma,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new m3(e,this.auth.name,t||{})),this.counter++,n}reset(e){var n;const t=e||Ma;(n=this._widgets.get(t))==null||n.delete(),this._widgets.delete(t)}getResponse(e){var n;const t=e||Ma;return((n=this._widgets.get(t))==null?void 0:n.getResponse())||""}async execute(e){var n;const t=e||Ma;return(n=this._widgets.get(t))==null||n.execute(),""}}class f3{constructor(){this.enterprise=new p3}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class p3{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class m3{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const s=typeof e=="string"?document.getElementById(e):e;q(s,"argument-error",{appName:t}),this.container=s,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=g3(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},h3)},l3))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function g3(r){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let n=0;n<r;n++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}const _3="recaptcha-enterprise",mo="NO_RECAPTCHA",wf="onFirebaseAuthREInstanceReady";class En{constructor(e){this.type=_3,this.auth=Fe(e)}async verify(e="verify",t=!1){async function n(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{n6(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const l=new t6(u);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(u=>{a(u)})})}function s(i,o,a){const u=window.grecaptcha;_f(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(mo)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new f3().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{n(this.auth).then(async a=>{if(!t&&_f(window.grecaptcha)&&En.scriptInjectionDeferred)await En.scriptInjectionDeferred.promise,s(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=c3();u.length!==0&&(u+=a+`&onload=${wf}`),En.scriptInjectionDeferred=new Up,window[wf]=()=>{var l;(l=En.scriptInjectionDeferred)==null||l.resolve()},_h(u).then(()=>{var l;return(l=En.scriptInjectionDeferred)==null?void 0:l.promise}).then(()=>{s(a,i,o)}).catch(l=>{o(l)})}}).catch(a=>{o(a)})})}}En.scriptInjectionDeferred=null;async function Zi(r,e,t,n=!1,s=!1){const i=new En(r);let o;if(s)o=mo;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const a={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){const u=a.phoneEnrollmentInfo.phoneNumber,l=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const u=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return n?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function ur(r,e,t,n,s){var i,o;if(s==="EMAIL_PASSWORD_PROVIDER")if((i=r._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Zi(r,e,t,t==="getOobCode");return n(r,a)}else return n(r,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await Zi(r,e,t,t==="getOobCode");return n(r,u)}else return Promise.reject(a)});else if(s==="PHONE_PROVIDER")if((o=r._getRecaptchaConfig())!=null&&o.isProviderEnabled("PHONE_PROVIDER")){const a=await Zi(r,e,t);return n(r,a).catch(async u=>{var l;if(((l=r._getRecaptchaConfig())==null?void 0:l.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(u.code==="auth/missing-recaptcha-token"||u.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);const d=await Zi(r,e,t,!1,!0);return n(r,d)}return Promise.reject(u)})}else{const a=await Zi(r,e,t,!1,!0);return n(r,a)}else return Promise.reject(s+" provider is not supported.")}async function _6(r){const e=Fe(r),t=await n6(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),n=new t6(t);e.tenantId==null?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,n.isAnyProviderEnabled()&&new En(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y6(r,e){const t=gi(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Wt(i,e??{}))return s;Ct(s,"already-initialized")}return t.initialize({options:e})}function y3(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(Rn);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function E6(r,e,t){const n=Fe(r);q(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!!(t!=null&&t.disableWarnings),i=I6(e),{host:o,port:a}=E3(e),u=a===null?"":`:${a}`,l={url:`${i}//${o}${u}/`},d=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){q(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),q(Wt(l,n.config.emulator)&&Wt(d,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=l,n.emulatorConfig=d,n.settings.appVerificationDisabledForTesting=!0,ds(o)?$c(`${i}//${o}${u}`):s||I3()}function I6(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function E3(r){const e=I6(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Af(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:Af(o)}}}function Af(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function I3(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Zt("not implemented")}_getIdTokenResponse(e){return Zt("not implemented")}_linkToIdToken(e,t){return Zt("not implemented")}_getReauthenticationResolver(e){return Zt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function T6(r,e){return De(r,"POST","/v1/accounts:resetPassword",Ne(r,e))}async function T3(r,e){return De(r,"POST","/v1/accounts:update",e)}async function w3(r,e){return De(r,"POST","/v1/accounts:signUp",e)}async function A3(r,e){return De(r,"POST","/v1/accounts:update",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function v3(r,e){return Un(r,"POST","/v1/accounts:signInWithPassword",Ne(r,e))}async function Hc(r,e){return De(r,"POST","/v1/accounts:sendOobCode",Ne(r,e))}async function R3(r,e){return Hc(r,e)}async function P3(r,e){return Hc(r,e)}async function S3(r,e){return Hc(r,e)}async function b3(r,e){return Hc(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function C3(r,e){return Un(r,"POST","/v1/accounts:signInWithEmailLink",Ne(r,e))}async function N3(r,e){return Un(r,"POST","/v1/accounts:signInWithEmailLink",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs extends yi{constructor(e,t,n,s=null){super("password",n),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new zs(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new zs(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ur(e,t,"signInWithPassword",v3,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return C3(e,{email:this._email,oobCode:this._password});default:Ct(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ur(e,n,"signUpPassword",w3,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return N3(e,{idToken:t,email:this._email,oobCode:this._password});default:Ct(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cn(r,e){return Un(r,"POST","/v1/accounts:signInWithIdp",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D3="http://localhost";class ln extends yi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ln(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ct("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,...i}=t;if(!n||!s)return null;const o=new ln(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Cn(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Cn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Cn(e,t)}buildRequest(){const e={requestUri:D3,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=mi(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vf(r,e){return De(r,"POST","/v1/accounts:sendVerificationCode",Ne(r,e))}async function V3(r,e){return Un(r,"POST","/v1/accounts:signInWithPhoneNumber",Ne(r,e))}async function O3(r,e){const t=await Un(r,"POST","/v1/accounts:signInWithPhoneNumber",Ne(r,e));if(t.temporaryProof)throw co(r,"account-exists-with-different-credential",t);return t}const k3={USER_NOT_FOUND:"user-not-found"};async function x3(r,e){const t={...e,operation:"REAUTH"};return Un(r,"POST","/v1/accounts:signInWithPhoneNumber",Ne(r,t),k3)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr extends yi{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new lr({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new lr({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return V3(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return O3(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return x3(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:s}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:s,temporaryProof:i}=e;return!n&&!t&&!s&&!i?null:new lr({verificationId:t,verificationCode:n,phoneNumber:s,temporaryProof:i})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L3(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function M3(r){const e=oo(ao(r)).link,t=e?oo(ao(e)).deep_link_id:null,n=oo(ao(r)).deep_link_id;return(n?oo(ao(n)).link:null)||n||t||e||r}class Ei{constructor(e){const t=oo(ao(e)),n=t.apiKey??null,s=t.oobCode??null,i=L3(t.mode??null);q(n&&s&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=M3(e);try{return new Ei(t)}catch{return null}}}function F3(r){return Ei.parseLink(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(){this.providerId=br.PROVIDER_ID}static credential(e,t){return zs._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=Ei.parseLink(t);return q(n,"argument-error"),zs._fromEmailAndCode(e,n.code,n.tenantId)}}br.PROVIDER_ID="password";br.EMAIL_PASSWORD_SIGN_IN_METHOD="password";br.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii extends Bn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class go extends Ii{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return q("providerId"in t&&"signInMethod"in t,"argument-error"),ln._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return q(e.idToken||e.accessToken,"argument-error"),ln._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return go.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return go.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:s,pendingToken:i,nonce:o,providerId:a}=e;if(!n&&!s&&!t&&!i||!a)return null;try{return new go(a)._credential({idToken:t,accessToken:n,nonce:o,pendingToken:i})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In extends Ii{constructor(){super("facebook.com")}static credential(e){return ln._fromParams({providerId:In.PROVIDER_ID,signInMethod:In.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return In.credentialFromTaggedObject(e)}static credentialFromError(e){return In.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return In.credential(e.oauthAccessToken)}catch{return null}}}In.FACEBOOK_SIGN_IN_METHOD="facebook.com";In.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn extends Ii{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ln._fromParams({providerId:Tn.PROVIDER_ID,signInMethod:Tn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Tn.credentialFromTaggedObject(e)}static credentialFromError(e){return Tn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Tn.credential(t,n)}catch{return null}}}Tn.GOOGLE_SIGN_IN_METHOD="google.com";Tn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn extends Ii{constructor(){super("github.com")}static credential(e){return ln._fromParams({providerId:wn.PROVIDER_ID,signInMethod:wn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return wn.credentialFromTaggedObject(e)}static credentialFromError(e){return wn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return wn.credential(e.oauthAccessToken)}catch{return null}}}wn.GITHUB_SIGN_IN_METHOD="github.com";wn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U3="http://localhost";class Mo extends yi{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){const t=this.buildRequest();return Cn(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Cn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Cn(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,pendingToken:i}=t;return!n||!s||!i||n!==s?null:new Mo(n,i)}static _create(e,t){return new Mo(e,t)}buildRequest(){return{requestUri:U3,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B3="saml.";class gc extends Bn{constructor(e){q(e.startsWith(B3),"argument-error"),super(e)}static credentialFromResult(e){return gc.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return gc.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=Mo.fromJSON(e);return q(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:n}=e;if(!t||!n)return null;try{return Mo._create(n,t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An extends Ii{constructor(){super("twitter.com")}static credential(e,t){return ln._fromParams({providerId:An.PROVIDER_ID,signInMethod:An.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return An.credentialFromTaggedObject(e)}static credentialFromError(e){return An.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return An.credential(t,n)}catch{return null}}}An.TWITTER_SIGN_IN_METHOD="twitter.com";An.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function w6(r,e){return Un(r,"POST","/v1/accounts:signUp",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await $t._fromIdTokenResponse(e,n,s),o=Rf(n);return new Ut({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=Rf(n);return new Ut({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function Rf(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q3(r){var s;if(Ve(r.app))return Promise.reject(st(r));const e=Fe(r);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new Ut({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await w6(e,{returnSecureToken:!0}),n=await Ut._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(n.user),n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c extends mn{constructor(e,t,n,s){super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,_c.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new _c(e,t,n,s)}}function A6(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?_c._fromErrorAndOperation(r,i,e,n):i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v6(r){return new Set(r.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function G3(r,e){const t=Y(r);await jc(!0,t,e);const{providerUserInfo:n}=await j_(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),s=v6(n||[]);return t.providerData=t.providerData.filter(i=>s.has(i.providerId)),s.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function yh(r,e,t=!1){const n=await kn(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Ut._forOperation(r,"link",n)}async function jc(r,e,t){await Lo(e);const n=v6(e.providerData),s=r===!1?"provider-already-linked":"no-such-provider";q(n.has(t)===r,e.auth,s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function R6(r,e,t=!1){const{auth:n}=r;if(Ve(n.app))return Promise.reject(st(n));const s="reauthenticate";try{const i=await kn(r,A6(n,s,e,r),t);q(i.idToken,n,"internal-error");const o=zc(i.idToken);q(o,n,"internal-error");const{sub:a}=o;return q(r.uid===a,n,"user-mismatch"),Ut._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Ct(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P6(r,e,t=!1){if(Ve(r.app))return Promise.reject(st(r));const n="signIn",s=await A6(r,n,e),i=await Ut._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}async function Wc(r,e){return P6(Fe(r),e)}async function S6(r,e){const t=Y(r);return await jc(!1,t,e.providerId),yh(t,e)}async function b6(r,e){return R6(Y(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $3(r,e){return Un(r,"POST","/v1/accounts:signInWithCustomToken",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z3(r,e){if(Ve(r.app))return Promise.reject(st(r));const t=Fe(r),n=await $3(t,{token:e,returnSecureToken:!0}),s=await Ut._fromIdTokenResponse(t,"signIn",n);return await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?Eh._fromServerResponse(e,t):"totpInfo"in t?Ih._fromServerResponse(e,t):Ct(e,"internal-error")}}class Eh extends ra{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new Eh(t)}}class Ih extends ra{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Ih(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kc(r,e,t){var n;q(((n=t.url)==null?void 0:n.length)>0,r,"invalid-continue-uri"),q(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,r,"invalid-dynamic-link-domain"),q(typeof t.linkDomain>"u"||t.linkDomain.length>0,r,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(q(t.iOS.bundleId.length>0,r,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(q(t.android.packageName.length>0,r,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Th(r){const e=Fe(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function H3(r,e,t){const n=Fe(r),s={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&Kc(n,s,t),await ur(n,s,"getOobCode",P3,"EMAIL_PASSWORD_PROVIDER")}async function j3(r,e,t){await T6(Y(r),{oobCode:e,newPassword:t}).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Th(r),n})}async function W3(r,e){await A3(Y(r),{oobCode:e})}async function C6(r,e){const t=Y(r),n=await T6(t,{oobCode:e}),s=n.requestType;switch(q(s,t,"internal-error"),s){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":q(n.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":q(n.mfaInfo,t,"internal-error");default:q(n.email,t,"internal-error")}let i=null;return n.mfaInfo&&(i=ra._fromServerResponse(Fe(t),n.mfaInfo)),{data:{email:(n.requestType==="VERIFY_AND_CHANGE_EMAIL"?n.newEmail:n.email)||null,previousEmail:(n.requestType==="VERIFY_AND_CHANGE_EMAIL"?n.email:n.newEmail)||null,multiFactorInfo:i},operation:s}}async function K3(r,e){const{data:t}=await C6(Y(r),e);return t.email}async function Q3(r,e,t){if(Ve(r.app))return Promise.reject(st(r));const n=Fe(r),o=await ur(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",w6,"EMAIL_PASSWORD_PROVIDER").catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Th(r),u}),a=await Ut._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(a.user),a}function Y3(r,e,t){return Ve(r.app)?Promise.reject(st(r)):Wc(Y(r),br.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Th(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X3(r,e,t){const n=Fe(r),s={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function i(o,a){q(a.handleCodeInApp,n,"argument-error"),a&&Kc(n,o,a)}i(s,t),await ur(n,s,"getOobCode",S3,"EMAIL_PASSWORD_PROVIDER")}function J3(r,e){const t=Ei.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function Z3(r,e,t){if(Ve(r.app))return Promise.reject(st(r));const n=Y(r),s=br.credentialWithLink(e,t||xo());return q(s._tenantId===(n.tenantId||null),n,"tenant-id-mismatch"),Wc(n,s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e9(r,e){return De(r,"POST","/v1/accounts:createAuthUri",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t9(r,e){const t=ph()?xo():"http://localhost",n={identifier:e,continueUri:t},{signinMethods:s}=await e9(Y(r),n);return s||[]}async function n9(r,e){const t=Y(r),s={requestType:"VERIFY_EMAIL",idToken:await r.getIdToken()};e&&Kc(t.auth,s,e);const{email:i}=await R3(t.auth,s);i!==r.email&&await r.reload()}async function r9(r,e,t){const n=Y(r),i={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await r.getIdToken(),newEmail:e};t&&Kc(n.auth,i,t);const{email:o}=await b3(n.auth,i);o!==r.email&&await r.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function s9(r,e){return De(r,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function i9(r,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const n=Y(r),i={idToken:await n.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await kn(n,s9(n.auth,i));n.displayName=o.displayName||null,n.photoURL=o.photoUrl||null;const a=n.providerData.find(({providerId:u})=>u==="password");a&&(a.displayName=n.displayName,a.photoURL=n.photoURL),await n._updateTokensIfNecessary(o)}function o9(r,e){const t=Y(r);return Ve(t.auth.app)?Promise.reject(st(t.auth)):N6(t,e,null)}function a9(r,e){return N6(Y(r),null,e)}async function N6(r,e,t){const{auth:n}=r,i={idToken:await r.getIdToken(),returnSecureToken:!0};e&&(i.email=e),t&&(i.password=t);const o=await kn(r,T3(n,i));await r._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c9(r){var s,i;if(!r)return null;const{providerId:e}=r,t=r.rawUserInfo?JSON.parse(r.rawUserInfo):{},n=r.isNewUser||r.kind==="identitytoolkit#SignupNewUserResponse";if(!e&&(r!=null&&r.idToken)){const o=(i=(s=zc(r.idToken))==null?void 0:s.firebase)==null?void 0:i.sign_in_provider;if(o){const a=o!=="anonymous"&&o!=="custom"?o:null;return new Us(n,a)}}if(!e)return null;switch(e){case"facebook.com":return new u9(n,t);case"github.com":return new l9(n,t);case"google.com":return new h9(n,t);case"twitter.com":return new d9(n,t,r.screenName||null);case"custom":case"anonymous":return new Us(n,null);default:return new Us(n,e,t)}}class Us{constructor(e,t,n={}){this.isNewUser=e,this.providerId=t,this.profile=n}}class D6 extends Us{constructor(e,t,n,s){super(e,t,n),this.username=s}}class u9 extends Us{constructor(e,t){super(e,"facebook.com",t)}}class l9 extends D6{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class h9 extends Us{constructor(e,t){super(e,"google.com",t)}}class d9 extends D6{constructor(e,t,n){super(e,"twitter.com",t,n)}}function f9(r){const{user:e,_tokenResponse:t}=r;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:c9(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p9(r,e){return Y(r).setPersistence(e)}function m9(r){return _6(r)}async function g9(r,e){return Fe(r).validatePassword(e)}function V6(r,e,t,n){return Y(r).onIdTokenChanged(e,t,n)}function O6(r,e,t){return Y(r).beforeAuthStateChanged(e,t)}function _9(r,e,t,n){return Y(r).onAuthStateChanged(e,t,n)}function y9(r){Y(r).useDeviceLanguage()}function E9(r,e){return Y(r).updateCurrentUser(e)}function I9(r){return Y(r).signOut()}function T9(r,e){return Fe(r).revokeAccessToken(e)}async function w9(r){return Y(r).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(e,t,n){this.type=e,this.credential=t,this.user=n}static _fromIdtoken(e,t){return new Qr("enroll",e,t)}static _fromMfaPendingCredential(e){return new Qr("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var t,n;if(e!=null&&e.multiFactorSession){if((t=e.multiFactorSession)!=null&&t.pendingCredential)return Qr._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if((n=e.multiFactorSession)!=null&&n.idToken)return Qr._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(e,t,n){this.session=e,this.hints=t,this.signInResolver=n}static _fromError(e,t){const n=Fe(e),s=t.customData._serverResponse,i=(s.mfaInfo||[]).map(a=>ra._fromServerResponse(n,a));q(s.mfaPendingCredential,n,"internal-error");const o=Qr._fromMfaPendingCredential(s.mfaPendingCredential);return new wh(o,i,async a=>{const u=await a._process(n,o);delete s.mfaInfo,delete s.mfaPendingCredential;const l={...s,idToken:u.idToken,refreshToken:u.refreshToken};switch(t.operationType){case"signIn":const d=await Ut._fromIdTokenResponse(n,t.operationType,l);return await n._updateCurrentUser(d.user),d;case"reauthenticate":return q(t.user,n,"internal-error"),Ut._forOperation(t.user,t.operationType,l);default:Ct(n,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}function A9(r,e){var s;const t=Y(r),n=e;return q(e.customData.operationType,t,"argument-error"),q((s=n.customData._serverResponse)==null?void 0:s.mfaPendingCredential,t,"argument-error"),wh._fromError(t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pf(r,e){return De(r,"POST","/v2/accounts/mfaEnrollment:start",Ne(r,e))}function v9(r,e){return De(r,"POST","/v2/accounts/mfaEnrollment:finalize",Ne(r,e))}function R9(r,e){return De(r,"POST","/v2/accounts/mfaEnrollment:start",Ne(r,e))}function P9(r,e){return De(r,"POST","/v2/accounts/mfaEnrollment:finalize",Ne(r,e))}function S9(r,e){return De(r,"POST","/v2/accounts/mfaEnrollment:withdraw",Ne(r,e))}class Ah{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(n=>ra._fromServerResponse(e.auth,n)))})}static _fromUser(e){return new Ah(e)}async getSession(){return Qr._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const n=e,s=await this.getSession(),i=await kn(this.user,n._process(this.user.auth,s,t));return await this.user._updateTokensIfNecessary(i),this.user.reload()}async unenroll(e){const t=typeof e=="string"?e:e.uid,n=await this.user.getIdToken();try{const s=await kn(this.user,S9(this.user.auth,{idToken:n,mfaEnrollmentId:t}));this.enrolledFactors=this.enrolledFactors.filter(({uid:i})=>i!==t),await this.user._updateTokensIfNecessary(s),await this.user.reload()}catch(s){throw s}}}const al=new WeakMap;function b9(r){const e=Y(r);return al.has(e)||al.set(e,Ah._fromUser(e)),al.get(e)}const yc="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k6{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(yc,"1"),this.storage.removeItem(yc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C9=1e3,N9=10;class x6 extends k6{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=p6(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);e3()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,N9):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},C9)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}x6.type="LOCAL";const L6=x6;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D9=1e3;function cl(r){var n;const e=r.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return((n=document.cookie.match(t))==null?void 0:n[1])??null}function ul(r){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${r.split(":")[3]}`}class M6{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;const t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;const t=ul(e);if(window.cookieStore){const n=await window.cookieStore.get(t);return n==null?void 0:n.value}return cl(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;const n=ul(e);document.cookie=`${n}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;const n=ul(e);if(window.cookieStore){const a=(l=>{const d=l.changed.find(g=>g.name===n);d&&t(d.value),l.deleted.find(g=>g.name===n)&&t(null)}),u=()=>window.cookieStore.removeEventListener("change",a);return this.listenerUnsubscribes.set(t,u),window.cookieStore.addEventListener("change",a)}let s=cl(n);const i=setInterval(()=>{const a=cl(n);a!==s&&(t(a),s=a)},D9),o=()=>clearInterval(i);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){const n=this.listenerUnsubscribes.get(t);n&&(n(),this.listenerUnsubscribes.delete(t))}}M6.type="COOKIE";const V9=M6;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F6 extends k6{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}F6.type="SESSION";const vh=F6;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O9(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new Qc(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const a=Array.from(o).map(async l=>l(t.origin,i)),u=await O9(a);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Qc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k9{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((a,u)=>{const l=Yc("",20);s.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(f){const g=f;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(d),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(g.data.response);break;default:clearTimeout(d),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(){return window}function x9(r){ze().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rh(){return typeof ze().WorkerGlobalScope<"u"&&typeof ze().importScripts=="function"}async function L9(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function M9(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function F9(){return Rh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U6="firebaseLocalStorageDb",U9=1,Ec="firebaseLocalStorage",B6="fbase_key";class sa{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Xc(r,e){return r.transaction([Ec],e?"readwrite":"readonly").objectStore(Ec)}function B9(){const r=indexedDB.deleteDatabase(U6);return new sa(r).toPromise()}function q6(){const r=indexedDB.open(U6,U9);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Ec,{keyPath:B6})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Ec)?e(n):(n.close(),await B9(),e(await q6()))})})}async function Sf(r,e,t){const n=Xc(r,!0).put({[B6]:e,value:t});return new sa(n).toPromise()}async function q9(r,e){const t=Xc(r,!1).get(e),n=await new sa(t).toPromise();return n===void 0?null:n.value}function bf(r,e){const t=Xc(r,!0).delete(e);return new sa(t).toPromise()}const G9=800,$9=3;class G6{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=q6(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>$9)throw n;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Rh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Qc._getInstance(F9()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await L9(),!this.activeServiceWorker)return;this.sender=new k9(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||M9()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Sf(e,yc,"1"),await bf(e,yc)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Sf(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>q9(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>bf(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=Xc(s,!1).getAll();return new sa(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),G9)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}G6.type="LOCAL";const $6=G6;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cf(r,e){return De(r,"POST","/v2/accounts/mfaSignIn:start",Ne(r,e))}function z9(r,e){return De(r,"POST","/v2/accounts/mfaSignIn:finalize",Ne(r,e))}function H9(r,e){return De(r,"POST","/v2/accounts/mfaSignIn:finalize",Ne(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll=g6("rcb"),j9=new ta(3e4,6e4);class W9{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!((e=ze().grecaptcha)!=null&&e.render)}load(e,t=""){return q(K9(t),e,"argument-error"),this.shouldResolveImmediately(t)&&gf(ze().grecaptcha)?Promise.resolve(ze().grecaptcha):new Promise((n,s)=>{const i=ze().setTimeout(()=>{s(Tt(e,"network-request-failed"))},j9.get());ze()[ll]=()=>{ze().clearTimeout(i),delete ze()[ll];const a=ze().grecaptcha;if(!a||!gf(a)){s(Tt(e,"internal-error"));return}const u=a.render;a.render=(l,d)=>{const f=u(l,d);return this.counter++,f},this.hostLanguage=t,n(a)};const o=`${a3()}?${mi({onload:ll,render:"explicit",hl:t})}`;_h(o).catch(()=>{clearTimeout(i),s(Tt(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!((t=ze().grecaptcha)!=null&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function K9(r){return r.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(r)}class Q9{async load(e){return new d3(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _o="recaptcha",Y9={theme:"light",type:"image"};class X9{constructor(e,t,n={...Y9}){this.parameters=n,this.type=_o,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Fe(e),this.isInvisible=this.parameters.size==="invisible",q(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const s=typeof t=="string"?document.getElementById(t):t;q(s,this.auth,"argument-error"),this.container=s,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new Q9:new W9,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),n=t.getResponse(e);return n||new Promise(s=>{const i=o=>{o&&(this.tokenChangeListeners.delete(i),s(o))};this.tokenChangeListeners.add(i),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){q(!this.parameters.sitekey,this.auth,"argument-error"),q(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),q(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(n=>n(t)),typeof e=="function")e(t);else if(typeof e=="string"){const n=ze()[e];typeof n=="function"&&n(t)}}}assertNotDestroyed(){q(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){q(ph()&&!Rh(),this.auth,"internal-error"),await J9(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await z_(this.auth);q(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return q(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function J9(){let r=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}r=()=>e(),window.addEventListener("load",r)}).catch(e=>{throw r&&window.removeEventListener("load",r),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ph{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=lr._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function Z9(r,e,t){if(Ve(r.app))return Promise.reject(st(r));const n=Fe(r),s=await Jc(n,e,Y(t));return new Ph(s,i=>Wc(n,i))}async function e8(r,e,t){const n=Y(r);await jc(!1,n,"phone");const s=await Jc(n.auth,e,Y(t));return new Ph(s,i=>S6(n,i))}async function t8(r,e,t){const n=Y(r);if(Ve(n.auth.app))return Promise.reject(st(n.auth));const s=await Jc(n.auth,e,Y(t));return new Ph(s,i=>b6(n,i))}async function Jc(r,e,t){var n;if(!r._getRecaptchaConfig())try{await _6(r)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const i=s.session;if("phoneNumber"in s){q(i.type==="enroll",r,"internal-error");const o={idToken:i.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await ur(r,o,"mfaSmsEnrollment",async(d,f)=>{if(f.phoneEnrollmentInfo.captchaResponse===mo){q((t==null?void 0:t.type)===_o,d,"argument-error");const g=await hl(d,f,t);return Pf(d,g)}return Pf(d,f)},"PHONE_PROVIDER").catch(d=>Promise.reject(d))).phoneSessionInfo.sessionInfo}else{q(i.type==="signin",r,"internal-error");const o=((n=s.multiFactorHint)==null?void 0:n.uid)||s.multiFactorUid;q(o,r,"missing-multi-factor-info");const a={mfaPendingCredential:i.credential,mfaEnrollmentId:o,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await ur(r,a,"mfaSmsSignIn",async(f,g)=>{if(g.phoneSignInInfo.captchaResponse===mo){q((t==null?void 0:t.type)===_o,f,"argument-error");const I=await hl(f,g,t);return Cf(f,I)}return Cf(f,g)},"PHONE_PROVIDER").catch(f=>Promise.reject(f))).phoneResponseInfo.sessionInfo}}else{const i={phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await ur(r,i,"sendVerificationCode",async(l,d)=>{if(d.captchaResponse===mo){q((t==null?void 0:t.type)===_o,l,"argument-error");const f=await hl(l,d,t);return vf(l,f)}return vf(l,d)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).sessionInfo}}finally{t==null||t._reset()}}async function n8(r,e){const t=Y(r);if(Ve(t.auth.app))return Promise.reject(st(t.auth));await yh(t,e)}async function hl(r,e,t){q(t.type===_o,r,"argument-error");const n=await t.verify();q(typeof n=="string",r,"argument-error");const s={...e};if("phoneEnrollmentInfo"in s){const i=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,a=s.phoneEnrollmentInfo.clientType,u=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:i,recaptchaToken:n,captchaResponse:o,clientType:a,recaptchaVersion:u}}),s}else if("phoneSignInInfo"in s){const i=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,a=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:n,captchaResponse:i,clientType:o,recaptchaVersion:a}}),s}else return Object.assign(s,{recaptchaToken:n}),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jr{constructor(e){this.providerId=Jr.PROVIDER_ID,this.auth=Fe(e)}verifyPhoneNumber(e,t){return Jc(this.auth,e,Y(t))}static credential(e,t){return lr._fromVerification(e,t)}static credentialFromResult(e){const t=e;return Jr.credentialFromTaggedObject(t)}static credentialFromError(e){return Jr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:n}=e;return t&&n?lr._fromTokenResponse(t,n):null}}Jr.PROVIDER_ID="phone";Jr.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ps(r,e){return e?Rn(e):(q(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh extends yi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Cn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Cn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Cn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function r8(r){return P6(r.auth,new Sh(r),r.bypassAuthState)}function s8(r){const{auth:e,user:t}=r;return q(t,e,"internal-error"),R6(t,new Sh(r),r.bypassAuthState)}async function i8(r){const{auth:e,user:t}=r;return q(t,e,"internal-error"),yh(t,new Sh(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z6{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return r8;case"linkViaPopup":case"linkViaRedirect":return i8;case"reauthViaPopup":case"reauthViaRedirect":return s8;default:Ct(this.auth,"internal-error")}}resolve(e){On(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){On(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o8=new ta(2e3,1e4);async function a8(r,e,t){if(Ve(r.app))return Promise.reject(Tt(r,"operation-not-supported-in-this-environment"));const n=Fe(r);_i(r,e,Bn);const s=ps(n,t);return new Pn(n,"signInViaPopup",e,s).executeNotNull()}async function c8(r,e,t){const n=Y(r);if(Ve(n.auth.app))return Promise.reject(Tt(n.auth,"operation-not-supported-in-this-environment"));_i(n.auth,e,Bn);const s=ps(n.auth,t);return new Pn(n.auth,"reauthViaPopup",e,s,n).executeNotNull()}async function u8(r,e,t){const n=Y(r);_i(n.auth,e,Bn);const s=ps(n.auth,t);return new Pn(n.auth,"linkViaPopup",e,s,n).executeNotNull()}class Pn extends z6{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,Pn.currentPopupAction&&Pn.currentPopupAction.cancel(),Pn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return q(e,this.auth,"internal-error"),e}async onExecution(){On(this.filter.length===1,"Popup operations only handle one event");const e=Yc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Tt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Tt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Pn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if((n=(t=this.authWindow)==null?void 0:t.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Tt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,o8.get())};e()}}Pn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l8="pendingRedirect",Za=new Map;class h8 extends z6{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Za.get(this.auth._key());if(!e){try{const n=await d8(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Za.set(this.auth._key(),e)}return this.bypassAuthState||Za.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function d8(r,e){const t=j6(e),n=H6(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}async function bh(r,e){return H6(r)._set(j6(e),"true")}function f8(r,e){Za.set(r._key(),e)}function H6(r){return Rn(r._redirectPersistence)}function j6(r){return Ja(l8,r.config.apiKey,r.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p8(r,e,t){return m8(r,e,t)}async function m8(r,e,t){if(Ve(r.app))return Promise.reject(st(r));const n=Fe(r);_i(r,e,Bn),await n._initializationPromise;const s=ps(n,t);return await bh(s,n),s._openRedirect(n,e,"signInViaRedirect")}function g8(r,e,t){return _8(r,e,t)}async function _8(r,e,t){const n=Y(r);if(_i(n.auth,e,Bn),Ve(n.auth.app))return Promise.reject(st(n.auth));await n.auth._initializationPromise;const s=ps(n.auth,t);await bh(s,n.auth);const i=await K6(n);return s._openRedirect(n.auth,e,"reauthViaRedirect",i)}function y8(r,e,t){return E8(r,e,t)}async function E8(r,e,t){const n=Y(r);_i(n.auth,e,Bn),await n.auth._initializationPromise;const s=ps(n.auth,t);await jc(!1,n,e.providerId),await bh(s,n.auth);const i=await K6(n);return s._openRedirect(n.auth,e,"linkViaRedirect",i)}async function I8(r,e){return await Fe(r)._initializationPromise,W6(r,e,!1)}async function W6(r,e,t=!1){if(Ve(r.app))return Promise.reject(st(r));const n=Fe(r),s=ps(n,e),o=await new h8(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}async function K6(r){const e=Yc(`${r.uid}:::`);return r._redirectEventId=e,await r.auth._setRedirectUser(r),await r.auth._persistUserIfCurrent(r),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const T8=600*1e3;class w8{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!A8(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Q6(e)){const s=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";t.onError(Tt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=T8&&this.cachedEventUids.clear(),this.cachedEventUids.has(Nf(e))}saveEventToCache(e){this.cachedEventUids.add(Nf(e)),this.lastProcessedEventTime=Date.now()}}function Nf(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Q6({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function A8(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Q6(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function v8(r,e={}){return De(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R8=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,P8=/^https?/;async function S8(r){if(r.config.emulator)return;const{authorizedDomains:e}=await v8(r);for(const t of e)try{if(b8(t))return}catch{}Ct(r,"unauthorized-domain")}function b8(r){const e=xo(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!P8.test(t))return!1;if(R8.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C8=new ta(3e4,6e4);function Df(){const r=ze().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function N8(r){return new Promise((e,t)=>{var s,i,o;function n(){Df(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Df(),t(Tt(r,"network-request-failed"))},timeout:C8.get()})}if((i=(s=ze().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=ze().gapi)!=null&&o.load)n();else{const a=g6("iframefcb");return ze()[a]=()=>{gapi.load?n():t(Tt(r,"network-request-failed"))},_h(`${u3()}?onload=${a}`).catch(u=>t(u))}}).catch(e=>{throw ec=null,e})}let ec=null;function D8(r){return ec=ec||N8(r),ec}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V8=new ta(5e3,15e3),O8="__/auth/iframe",k8="emulator/auth/iframe",x8={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},L8=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function M8(r){const e=r.config;q(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?mh(e,k8):`https://${r.config.authDomain}/${O8}`,n={apiKey:e.apiKey,appName:r.name,v:fs},s=L8.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${mi(n).slice(1)}`}async function F8(r){const e=await D8(r),t=ze().gapi;return q(t,r,"internal-error"),e.open({where:document.body,url:M8(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:x8,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=Tt(r,"network-request-failed"),a=ze().setTimeout(()=>{i(o)},V8.get());function u(){ze().clearTimeout(a),s(n)}n.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U8={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},B8=500,q8=600,G8="_blank",$8="http://localhost";class Vf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function z8(r,e,t,n=B8,s=q8){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let a="";const u={...U8,width:n.toString(),height:s.toString(),top:i,left:o},l=Ye().toLowerCase();t&&(a=u6(l)?G8:t),a6(l)&&(e=e||$8,u.scrollbars="yes");const d=Object.entries(u).reduce((g,[I,R])=>`${g}${I}=${R},`,"");if(Z_(l)&&a!=="_self")return H8(e||"",a),new Vf(null);const f=window.open(e||"",a,d);q(f,r,"popup-blocked");try{f.focus()}catch{}return new Vf(f)}function H8(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j8="__/auth/handler",W8="emulator/auth/handler",K8=encodeURIComponent("fac");async function Of(r,e,t,n,s,i){q(r.config.authDomain,r,"auth-domain-config-required"),q(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:fs,eventId:s};if(e instanceof Bn){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",d4(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,f]of Object.entries({}))o[d]=f}if(e instanceof Ii){const d=e.getScopes().filter(f=>f!=="");d.length>0&&(o.scopes=d.join(","))}r.tenantId&&(o.tid=r.tenantId);const a=o;for(const d of Object.keys(a))a[d]===void 0&&delete a[d];const u=await r._getAppCheckToken(),l=u?`#${K8}=${encodeURIComponent(u)}`:"";return`${Q8(r)}?${mi(a).slice(1)}${l}`}function Q8({config:r}){return r.emulator?mh(r,W8):`https://${r.authDomain}/${j8}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl="webStorageSupport";class Y8{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=vh,this._completeRedirectFn=W6,this._overrideRedirectResult=f8}async _openPopup(e,t,n,s){var o;On((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await Of(e,t,n,xo(),s);return z8(e,i,Yc())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await Of(e,t,n,xo(),s);return x9(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(On(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await F8(e),n=new w8(e);return t.register("authEvent",s=>(q(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(dl,{type:dl},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[dl];i!==void 0&&t(!!i),Ct(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=S8(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return p6()||c6()||gh()}}const Y6=Y8;class X6{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,n);case"signin":return this._finalizeSignIn(e,t.credential);default:return Zt("unexpected MultiFactorSessionType")}}}class Ch extends X6{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new Ch(e)}_finalizeEnroll(e,t,n){return v9(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return z9(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class J6{constructor(){}static assertion(e){return Ch._fromCredential(e)}}J6.FACTOR_ID="phone";class Z6{static assertionForEnrollment(e,t){return Fo._fromSecret(e,t)}static assertionForSignIn(e,t){return Fo._fromEnrollmentId(e,t)}static async generateSecret(e){var s;const t=e;q(typeof((s=t.user)==null?void 0:s.auth)<"u","internal-error");const n=await R9(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return Zc._fromStartTotpMfaEnrollmentResponse(n,t.user.auth)}}Z6.FACTOR_ID="totp";class Fo extends X6{constructor(e,t,n){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=n}static _fromSecret(e,t){return new Fo(t,void 0,e)}static _fromEnrollmentId(e,t){return new Fo(t,e)}async _finalizeEnroll(e,t,n){return q(typeof this.secret<"u",e,"argument-error"),P9(e,{idToken:t,displayName:n,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){q(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");const n={verificationCode:this.otp};return H9(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:n})}}class Zc{constructor(e,t,n,s,i,o,a){this.sessionInfo=o,this.auth=a,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=n,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new Zc(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var s;let n=!1;return(Fa(e)||Fa(t))&&(n=!0),n&&(Fa(e)&&(e=((s=this.auth.currentUser)==null?void 0:s.email)||"unknownuser"),Fa(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function Fa(r){return typeof r>"u"||(r==null?void 0:r.length)===0}var kf="@firebase/auth",xf="1.13.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X8{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J8(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Z8(r){ns(new mr("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=n.options;q(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:a,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:m6(r)},l=new i3(n,s,i,u);return y3(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),ns(new mr("auth-internal",e=>{const t=Fe(e.getProvider("auth").getImmediate());return(n=>new X8(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),on(kf,xf,J8(r)),on(kf,xf,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e5=300,t5=Fp("authIdTokenMaxAge")||e5;let Lf=null;const n5=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>t5)return;const s=t==null?void 0:t.token;Lf!==s&&(Lf=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function r5(r=hh()){const e=gi(r,"auth");if(e.isInitialized())return e.getImmediate();const t=y6(r,{popupRedirectResolver:Y6,persistence:[$6,L6,vh]}),n=Fp("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=n5(i.toString());O6(t,o,()=>o(t.currentUser)),V6(t,a=>o(a))}}const s=xp("auth");return s&&E6(t,`http://${s}`),t}function s5(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}o3({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=Tt("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",s5().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Z8("Browser");const Rv=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:V_,ActionCodeURL:Ei,AuthCredential:yi,AuthErrorCodes:x_,EmailAuthCredential:zs,EmailAuthProvider:br,FacebookAuthProvider:In,FactorId:b_,GithubAuthProvider:wn,GoogleAuthProvider:Tn,OAuthCredential:ln,OAuthProvider:go,OperationType:D_,PhoneAuthCredential:lr,PhoneAuthProvider:Jr,PhoneMultiFactorGenerator:J6,ProviderId:C_,RecaptchaVerifier:X9,SAMLAuthProvider:gc,SignInMethod:N_,TotpMultiFactorGenerator:Z6,TotpSecret:Zc,TwitterAuthProvider:An,applyActionCode:W3,beforeAuthStateChanged:O6,browserCookiePersistence:V9,browserLocalPersistence:L6,browserPopupRedirectResolver:Y6,browserSessionPersistence:vh,checkActionCode:C6,confirmPasswordReset:j3,connectAuthEmulator:E6,createUserWithEmailAndPassword:Q3,debugErrorMap:k_,deleteUser:w9,fetchSignInMethodsForEmail:t9,getAdditionalUserInfo:f9,getAuth:r5,getIdToken:W_,getIdTokenResult:r6,getMultiFactorResolver:A9,getRedirectResult:I8,inMemoryPersistence:Cl,indexedDBLocalPersistence:$6,initializeAuth:y6,initializeRecaptchaConfig:m9,isSignInWithEmailLink:J3,linkWithCredential:S6,linkWithPhoneNumber:e8,linkWithPopup:u8,linkWithRedirect:y8,multiFactor:b9,onAuthStateChanged:_9,onIdTokenChanged:V6,parseActionCodeURL:F3,prodErrorMap:Yp,reauthenticateWithCredential:b6,reauthenticateWithPhoneNumber:t8,reauthenticateWithPopup:c8,reauthenticateWithRedirect:g8,reload:s6,revokeAccessToken:T9,sendEmailVerification:n9,sendPasswordResetEmail:H3,sendSignInLinkToEmail:X3,setPersistence:p9,signInAnonymously:q3,signInWithCredential:Wc,signInWithCustomToken:z3,signInWithEmailAndPassword:Y3,signInWithEmailLink:Z3,signInWithPhoneNumber:Z9,signInWithPopup:a8,signInWithRedirect:p8,signOut:I9,unlink:G3,updateCurrentUser:E9,updateEmail:o9,updatePassword:a9,updatePhoneNumber:n8,updateProfile:i9,useDeviceLanguage:y9,validatePassword:g9,verifyBeforeUpdateEmail:r9,verifyPasswordResetCode:K3},Symbol.toStringTag,{value:"Module"}));var Mf=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var hr,em;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,E){function w(){}w.prototype=E.prototype,A.F=E.prototype,A.prototype=new w,A.prototype.constructor=A,A.D=function(S,P,D){for(var T=Array(arguments.length-2),At=2;At<arguments.length;At++)T[At-2]=arguments[At];return E.prototype[P].apply(S,T)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,E,w){w||(w=0);const S=Array(16);if(typeof E=="string")for(var P=0;P<16;++P)S[P]=E.charCodeAt(w++)|E.charCodeAt(w++)<<8|E.charCodeAt(w++)<<16|E.charCodeAt(w++)<<24;else for(P=0;P<16;++P)S[P]=E[w++]|E[w++]<<8|E[w++]<<16|E[w++]<<24;E=A.g[0],w=A.g[1],P=A.g[2];let D=A.g[3],T;T=E+(D^w&(P^D))+S[0]+3614090360&4294967295,E=w+(T<<7&4294967295|T>>>25),T=D+(P^E&(w^P))+S[1]+3905402710&4294967295,D=E+(T<<12&4294967295|T>>>20),T=P+(w^D&(E^w))+S[2]+606105819&4294967295,P=D+(T<<17&4294967295|T>>>15),T=w+(E^P&(D^E))+S[3]+3250441966&4294967295,w=P+(T<<22&4294967295|T>>>10),T=E+(D^w&(P^D))+S[4]+4118548399&4294967295,E=w+(T<<7&4294967295|T>>>25),T=D+(P^E&(w^P))+S[5]+1200080426&4294967295,D=E+(T<<12&4294967295|T>>>20),T=P+(w^D&(E^w))+S[6]+2821735955&4294967295,P=D+(T<<17&4294967295|T>>>15),T=w+(E^P&(D^E))+S[7]+4249261313&4294967295,w=P+(T<<22&4294967295|T>>>10),T=E+(D^w&(P^D))+S[8]+1770035416&4294967295,E=w+(T<<7&4294967295|T>>>25),T=D+(P^E&(w^P))+S[9]+2336552879&4294967295,D=E+(T<<12&4294967295|T>>>20),T=P+(w^D&(E^w))+S[10]+4294925233&4294967295,P=D+(T<<17&4294967295|T>>>15),T=w+(E^P&(D^E))+S[11]+2304563134&4294967295,w=P+(T<<22&4294967295|T>>>10),T=E+(D^w&(P^D))+S[12]+1804603682&4294967295,E=w+(T<<7&4294967295|T>>>25),T=D+(P^E&(w^P))+S[13]+4254626195&4294967295,D=E+(T<<12&4294967295|T>>>20),T=P+(w^D&(E^w))+S[14]+2792965006&4294967295,P=D+(T<<17&4294967295|T>>>15),T=w+(E^P&(D^E))+S[15]+1236535329&4294967295,w=P+(T<<22&4294967295|T>>>10),T=E+(P^D&(w^P))+S[1]+4129170786&4294967295,E=w+(T<<5&4294967295|T>>>27),T=D+(w^P&(E^w))+S[6]+3225465664&4294967295,D=E+(T<<9&4294967295|T>>>23),T=P+(E^w&(D^E))+S[11]+643717713&4294967295,P=D+(T<<14&4294967295|T>>>18),T=w+(D^E&(P^D))+S[0]+3921069994&4294967295,w=P+(T<<20&4294967295|T>>>12),T=E+(P^D&(w^P))+S[5]+3593408605&4294967295,E=w+(T<<5&4294967295|T>>>27),T=D+(w^P&(E^w))+S[10]+38016083&4294967295,D=E+(T<<9&4294967295|T>>>23),T=P+(E^w&(D^E))+S[15]+3634488961&4294967295,P=D+(T<<14&4294967295|T>>>18),T=w+(D^E&(P^D))+S[4]+3889429448&4294967295,w=P+(T<<20&4294967295|T>>>12),T=E+(P^D&(w^P))+S[9]+568446438&4294967295,E=w+(T<<5&4294967295|T>>>27),T=D+(w^P&(E^w))+S[14]+3275163606&4294967295,D=E+(T<<9&4294967295|T>>>23),T=P+(E^w&(D^E))+S[3]+4107603335&4294967295,P=D+(T<<14&4294967295|T>>>18),T=w+(D^E&(P^D))+S[8]+1163531501&4294967295,w=P+(T<<20&4294967295|T>>>12),T=E+(P^D&(w^P))+S[13]+2850285829&4294967295,E=w+(T<<5&4294967295|T>>>27),T=D+(w^P&(E^w))+S[2]+4243563512&4294967295,D=E+(T<<9&4294967295|T>>>23),T=P+(E^w&(D^E))+S[7]+1735328473&4294967295,P=D+(T<<14&4294967295|T>>>18),T=w+(D^E&(P^D))+S[12]+2368359562&4294967295,w=P+(T<<20&4294967295|T>>>12),T=E+(w^P^D)+S[5]+4294588738&4294967295,E=w+(T<<4&4294967295|T>>>28),T=D+(E^w^P)+S[8]+2272392833&4294967295,D=E+(T<<11&4294967295|T>>>21),T=P+(D^E^w)+S[11]+1839030562&4294967295,P=D+(T<<16&4294967295|T>>>16),T=w+(P^D^E)+S[14]+4259657740&4294967295,w=P+(T<<23&4294967295|T>>>9),T=E+(w^P^D)+S[1]+2763975236&4294967295,E=w+(T<<4&4294967295|T>>>28),T=D+(E^w^P)+S[4]+1272893353&4294967295,D=E+(T<<11&4294967295|T>>>21),T=P+(D^E^w)+S[7]+4139469664&4294967295,P=D+(T<<16&4294967295|T>>>16),T=w+(P^D^E)+S[10]+3200236656&4294967295,w=P+(T<<23&4294967295|T>>>9),T=E+(w^P^D)+S[13]+681279174&4294967295,E=w+(T<<4&4294967295|T>>>28),T=D+(E^w^P)+S[0]+3936430074&4294967295,D=E+(T<<11&4294967295|T>>>21),T=P+(D^E^w)+S[3]+3572445317&4294967295,P=D+(T<<16&4294967295|T>>>16),T=w+(P^D^E)+S[6]+76029189&4294967295,w=P+(T<<23&4294967295|T>>>9),T=E+(w^P^D)+S[9]+3654602809&4294967295,E=w+(T<<4&4294967295|T>>>28),T=D+(E^w^P)+S[12]+3873151461&4294967295,D=E+(T<<11&4294967295|T>>>21),T=P+(D^E^w)+S[15]+530742520&4294967295,P=D+(T<<16&4294967295|T>>>16),T=w+(P^D^E)+S[2]+3299628645&4294967295,w=P+(T<<23&4294967295|T>>>9),T=E+(P^(w|~D))+S[0]+4096336452&4294967295,E=w+(T<<6&4294967295|T>>>26),T=D+(w^(E|~P))+S[7]+1126891415&4294967295,D=E+(T<<10&4294967295|T>>>22),T=P+(E^(D|~w))+S[14]+2878612391&4294967295,P=D+(T<<15&4294967295|T>>>17),T=w+(D^(P|~E))+S[5]+4237533241&4294967295,w=P+(T<<21&4294967295|T>>>11),T=E+(P^(w|~D))+S[12]+1700485571&4294967295,E=w+(T<<6&4294967295|T>>>26),T=D+(w^(E|~P))+S[3]+2399980690&4294967295,D=E+(T<<10&4294967295|T>>>22),T=P+(E^(D|~w))+S[10]+4293915773&4294967295,P=D+(T<<15&4294967295|T>>>17),T=w+(D^(P|~E))+S[1]+2240044497&4294967295,w=P+(T<<21&4294967295|T>>>11),T=E+(P^(w|~D))+S[8]+1873313359&4294967295,E=w+(T<<6&4294967295|T>>>26),T=D+(w^(E|~P))+S[15]+4264355552&4294967295,D=E+(T<<10&4294967295|T>>>22),T=P+(E^(D|~w))+S[6]+2734768916&4294967295,P=D+(T<<15&4294967295|T>>>17),T=w+(D^(P|~E))+S[13]+1309151649&4294967295,w=P+(T<<21&4294967295|T>>>11),T=E+(P^(w|~D))+S[4]+4149444226&4294967295,E=w+(T<<6&4294967295|T>>>26),T=D+(w^(E|~P))+S[11]+3174756917&4294967295,D=E+(T<<10&4294967295|T>>>22),T=P+(E^(D|~w))+S[2]+718787259&4294967295,P=D+(T<<15&4294967295|T>>>17),T=w+(D^(P|~E))+S[9]+3951481745&4294967295,A.g[0]=A.g[0]+E&4294967295,A.g[1]=A.g[1]+(P+(T<<21&4294967295|T>>>11))&4294967295,A.g[2]=A.g[2]+P&4294967295,A.g[3]=A.g[3]+D&4294967295}n.prototype.v=function(A,E){E===void 0&&(E=A.length);const w=E-this.blockSize,S=this.C;let P=this.h,D=0;for(;D<E;){if(P==0)for(;D<=w;)s(this,A,D),D+=this.blockSize;if(typeof A=="string"){for(;D<E;)if(S[P++]=A.charCodeAt(D++),P==this.blockSize){s(this,S),P=0;break}}else for(;D<E;)if(S[P++]=A[D++],P==this.blockSize){s(this,S),P=0;break}}this.h=P,this.o+=E},n.prototype.A=function(){var A=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);A[0]=128;for(var E=1;E<A.length-8;++E)A[E]=0;E=this.o*8;for(var w=A.length-8;w<A.length;++w)A[w]=E&255,E/=256;for(this.v(A),A=Array(16),E=0,w=0;w<4;++w)for(let S=0;S<32;S+=8)A[E++]=this.g[w]>>>S&255;return A};function i(A,E){var w=a;return Object.prototype.hasOwnProperty.call(w,A)?w[A]:w[A]=E(A)}function o(A,E){this.h=E;const w=[];let S=!0;for(let P=A.length-1;P>=0;P--){const D=A[P]|0;S&&D==E||(w[P]=D,S=!1)}this.g=w}var a={};function u(A){return-128<=A&&A<128?i(A,function(E){return new o([E|0],E<0?-1:0)}):new o([A|0],A<0?-1:0)}function l(A){if(isNaN(A)||!isFinite(A))return f;if(A<0)return x(l(-A));const E=[];let w=1;for(let S=0;A>=w;S++)E[S]=A/w|0,w*=4294967296;return new o(E,0)}function d(A,E){if(A.length==0)throw Error("number format error: empty string");if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(A.charAt(0)=="-")return x(d(A.substring(1),E));if(A.indexOf("-")>=0)throw Error('number format error: interior "-" character');const w=l(Math.pow(E,8));let S=f;for(let D=0;D<A.length;D+=8){var P=Math.min(8,A.length-D);const T=parseInt(A.substring(D,D+P),E);P<8?(P=l(Math.pow(E,P)),S=S.j(P).add(l(T))):(S=S.j(w),S=S.add(l(T)))}return S}var f=u(0),g=u(1),I=u(16777216);r=o.prototype,r.m=function(){if(O(this))return-x(this).m();let A=0,E=1;for(let w=0;w<this.g.length;w++){const S=this.i(w);A+=(S>=0?S:4294967296+S)*E,E*=4294967296}return A},r.toString=function(A){if(A=A||10,A<2||36<A)throw Error("radix out of range: "+A);if(R(this))return"0";if(O(this))return"-"+x(this).toString(A);const E=l(Math.pow(A,6));var w=this;let S="";for(;;){const P=oe(w,E).g;w=z(w,P.j(E));let D=((w.g.length>0?w.g[0]:w.h)>>>0).toString(A);if(w=P,R(w))return D+S;for(;D.length<6;)D="0"+D;S=D+S}},r.i=function(A){return A<0?0:A<this.g.length?this.g[A]:this.h};function R(A){if(A.h!=0)return!1;for(let E=0;E<A.g.length;E++)if(A.g[E]!=0)return!1;return!0}function O(A){return A.h==-1}r.l=function(A){return A=z(this,A),O(A)?-1:R(A)?0:1};function x(A){const E=A.g.length,w=[];for(let S=0;S<E;S++)w[S]=~A.g[S];return new o(w,~A.h).add(g)}r.abs=function(){return O(this)?x(this):this},r.add=function(A){const E=Math.max(this.g.length,A.g.length),w=[];let S=0;for(let P=0;P<=E;P++){let D=S+(this.i(P)&65535)+(A.i(P)&65535),T=(D>>>16)+(this.i(P)>>>16)+(A.i(P)>>>16);S=T>>>16,D&=65535,T&=65535,w[P]=T<<16|D}return new o(w,w[w.length-1]&-2147483648?-1:0)};function z(A,E){return A.add(x(E))}r.j=function(A){if(R(this)||R(A))return f;if(O(this))return O(A)?x(this).j(x(A)):x(x(this).j(A));if(O(A))return x(this.j(x(A)));if(this.l(I)<0&&A.l(I)<0)return l(this.m()*A.m());const E=this.g.length+A.g.length,w=[];for(var S=0;S<2*E;S++)w[S]=0;for(S=0;S<this.g.length;S++)for(let P=0;P<A.g.length;P++){const D=this.i(S)>>>16,T=this.i(S)&65535,At=A.i(P)>>>16,xr=A.i(P)&65535;w[2*S+2*P]+=T*xr,Z(w,2*S+2*P),w[2*S+2*P+1]+=D*xr,Z(w,2*S+2*P+1),w[2*S+2*P+1]+=T*At,Z(w,2*S+2*P+1),w[2*S+2*P+2]+=D*At,Z(w,2*S+2*P+2)}for(A=0;A<E;A++)w[A]=w[2*A+1]<<16|w[2*A];for(A=E;A<2*E;A++)w[A]=0;return new o(w,0)};function Z(A,E){for(;(A[E]&65535)!=A[E];)A[E+1]+=A[E]>>>16,A[E]&=65535,E++}function Q(A,E){this.g=A,this.h=E}function oe(A,E){if(R(E))throw Error("division by zero");if(R(A))return new Q(f,f);if(O(A))return E=oe(x(A),E),new Q(x(E.g),x(E.h));if(O(E))return E=oe(A,x(E)),new Q(x(E.g),E.h);if(A.g.length>30){if(O(A)||O(E))throw Error("slowDivide_ only works with positive integers.");for(var w=g,S=E;S.l(A)<=0;)w=le(w),S=le(S);var P=de(w,1),D=de(S,1);for(S=de(S,2),w=de(w,2);!R(S);){var T=D.add(S);T.l(A)<=0&&(P=P.add(w),D=T),S=de(S,1),w=de(w,1)}return E=z(A,P.j(E)),new Q(P,E)}for(P=f;A.l(E)>=0;){for(w=Math.max(1,Math.floor(A.m()/E.m())),S=Math.ceil(Math.log(w)/Math.LN2),S=S<=48?1:Math.pow(2,S-48),D=l(w),T=D.j(E);O(T)||T.l(A)>0;)w-=S,D=l(w),T=D.j(E);R(D)&&(D=g),P=P.add(D),A=z(A,T)}return new Q(P,A)}r.B=function(A){return oe(this,A).h},r.and=function(A){const E=Math.max(this.g.length,A.g.length),w=[];for(let S=0;S<E;S++)w[S]=this.i(S)&A.i(S);return new o(w,this.h&A.h)},r.or=function(A){const E=Math.max(this.g.length,A.g.length),w=[];for(let S=0;S<E;S++)w[S]=this.i(S)|A.i(S);return new o(w,this.h|A.h)},r.xor=function(A){const E=Math.max(this.g.length,A.g.length),w=[];for(let S=0;S<E;S++)w[S]=this.i(S)^A.i(S);return new o(w,this.h^A.h)};function le(A){const E=A.g.length+1,w=[];for(let S=0;S<E;S++)w[S]=A.i(S)<<1|A.i(S-1)>>>31;return new o(w,A.h)}function de(A,E){const w=E>>5;E%=32;const S=A.g.length-w,P=[];for(let D=0;D<S;D++)P[D]=E>0?A.i(D+w)>>>E|A.i(D+w+1)<<32-E:A.i(D+w);return new o(P,A.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,em=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=d,hr=o}).apply(typeof Mf<"u"?Mf:typeof self<"u"?self:typeof window<"u"?window:{});var Ua=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var tm,uo,nm,tc,Nl,rm,sm,im;(function(){var r,e=Object.defineProperty;function t(c){c=[typeof globalThis=="object"&&globalThis,c,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ua=="object"&&Ua];for(var h=0;h<c.length;++h){var p=c[h];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var n=t(this);function s(c,h){if(h)e:{var p=n;c=c.split(".");for(var _=0;_<c.length-1;_++){var C=c[_];if(!(C in p))break e;p=p[C]}c=c[c.length-1],_=p[c],h=h(_),h!=_&&h!=null&&e(p,c,{configurable:!0,writable:!0,value:h})}}s("Symbol.dispose",function(c){return c||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(c){return c||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(c){return c||function(h){var p=[],_;for(_ in h)Object.prototype.hasOwnProperty.call(h,_)&&p.push([_,h[_]]);return p}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function a(c){var h=typeof c;return h=="object"&&c!=null||h=="function"}function u(c,h,p){return c.call.apply(c.bind,arguments)}function l(c,h,p){return l=u,l.apply(null,arguments)}function d(c,h){var p=Array.prototype.slice.call(arguments,1);return function(){var _=p.slice();return _.push.apply(_,arguments),c.apply(this,_)}}function f(c,h){function p(){}p.prototype=h.prototype,c.Z=h.prototype,c.prototype=new p,c.prototype.constructor=c,c.Ob=function(_,C,k){for(var j=Array(arguments.length-2),ue=2;ue<arguments.length;ue++)j[ue-2]=arguments[ue];return h.prototype[C].apply(_,j)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?c=>c&&AsyncContext.Snapshot.wrap(c):c=>c;function I(c){const h=c.length;if(h>0){const p=Array(h);for(let _=0;_<h;_++)p[_]=c[_];return p}return[]}function R(c,h){for(let _=1;_<arguments.length;_++){const C=arguments[_];var p=typeof C;if(p=p!="object"?p:C?Array.isArray(C)?"array":p:"null",p=="array"||p=="object"&&typeof C.length=="number"){p=c.length||0;const k=C.length||0;c.length=p+k;for(let j=0;j<k;j++)c[p+j]=C[j]}else c.push(C)}}class O{constructor(h,p){this.i=h,this.j=p,this.h=0,this.g=null}get(){let h;return this.h>0?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function x(c){o.setTimeout(()=>{throw c},0)}function z(){var c=A;let h=null;return c.g&&(h=c.g,c.g=c.g.next,c.g||(c.h=null),h.next=null),h}class Z{constructor(){this.h=this.g=null}add(h,p){const _=Q.get();_.set(h,p),this.h?this.h.next=_:this.g=_,this.h=_}}var Q=new O(()=>new oe,c=>c.reset());class oe{constructor(){this.next=this.g=this.h=null}set(h,p){this.h=h,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let le,de=!1,A=new Z,E=()=>{const c=Promise.resolve(void 0);le=()=>{c.then(w)}};function w(){for(var c;c=z();){try{c.h.call(c.g)}catch(p){x(p)}var h=Q;h.j(c),h.h<100&&(h.h++,c.next=h.g,h.g=c)}de=!1}function S(){this.u=this.u,this.C=this.C}S.prototype.u=!1,S.prototype.dispose=function(){this.u||(this.u=!0,this.N())},S.prototype[Symbol.dispose]=function(){this.dispose()},S.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function P(c,h){this.type=c,this.g=this.target=h,this.defaultPrevented=!1}P.prototype.h=function(){this.defaultPrevented=!0};var D=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var c=!1,h=Object.defineProperty({},"passive",{get:function(){c=!0}});try{const p=()=>{};o.addEventListener("test",p,h),o.removeEventListener("test",p,h)}catch{}return c})();function T(c){return/^[\s\xa0]*$/.test(c)}function At(c,h){P.call(this,c?c.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,c&&this.init(c,h)}f(At,P),At.prototype.init=function(c,h){const p=this.type=c.type,_=c.changedTouches&&c.changedTouches.length?c.changedTouches[0]:null;this.target=c.target||c.srcElement,this.g=h,h=c.relatedTarget,h||(p=="mouseover"?h=c.fromElement:p=="mouseout"&&(h=c.toElement)),this.relatedTarget=h,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0),this.button=c.button,this.key=c.key||"",this.ctrlKey=c.ctrlKey,this.altKey=c.altKey,this.shiftKey=c.shiftKey,this.metaKey=c.metaKey,this.pointerId=c.pointerId||0,this.pointerType=c.pointerType,this.state=c.state,this.i=c,c.defaultPrevented&&At.Z.h.call(this)},At.prototype.h=function(){At.Z.h.call(this);const c=this.i;c.preventDefault?c.preventDefault():c.returnValue=!1};var xr="closure_listenable_"+(Math.random()*1e6|0),g7=0;function _7(c,h,p,_,C){this.listener=c,this.proxy=null,this.src=h,this.type=p,this.capture=!!_,this.ha=C,this.key=++g7,this.da=this.fa=!1}function wa(c){c.da=!0,c.listener=null,c.proxy=null,c.src=null,c.ha=null}function Aa(c,h,p){for(const _ in c)h.call(p,c[_],_,c)}function y7(c,h){for(const p in c)h.call(void 0,c[p],p,c)}function rd(c){const h={};for(const p in c)h[p]=c[p];return h}const sd="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function id(c,h){let p,_;for(let C=1;C<arguments.length;C++){_=arguments[C];for(p in _)c[p]=_[p];for(let k=0;k<sd.length;k++)p=sd[k],Object.prototype.hasOwnProperty.call(_,p)&&(c[p]=_[p])}}function va(c){this.src=c,this.g={},this.h=0}va.prototype.add=function(c,h,p,_,C){const k=c.toString();c=this.g[k],c||(c=this.g[k]=[],this.h++);const j=Vu(c,h,_,C);return j>-1?(h=c[j],p||(h.fa=!1)):(h=new _7(h,this.src,k,!!_,C),h.fa=p,c.push(h)),h};function Du(c,h){const p=h.type;if(p in c.g){var _=c.g[p],C=Array.prototype.indexOf.call(_,h,void 0),k;(k=C>=0)&&Array.prototype.splice.call(_,C,1),k&&(wa(h),c.g[p].length==0&&(delete c.g[p],c.h--))}}function Vu(c,h,p,_){for(let C=0;C<c.length;++C){const k=c[C];if(!k.da&&k.listener==h&&k.capture==!!p&&k.ha==_)return C}return-1}var Ou="closure_lm_"+(Math.random()*1e6|0),ku={};function od(c,h,p,_,C){if(Array.isArray(h)){for(let k=0;k<h.length;k++)od(c,h[k],p,_,C);return null}return p=ud(p),c&&c[xr]?c.J(h,p,a(_)?!!_.capture:!1,C):E7(c,h,p,!1,_,C)}function E7(c,h,p,_,C,k){if(!h)throw Error("Invalid event type");const j=a(C)?!!C.capture:!!C;let ue=Lu(c);if(ue||(c[Ou]=ue=new va(c)),p=ue.add(h,p,_,j,k),p.proxy)return p;if(_=I7(),p.proxy=_,_.src=c,_.listener=p,c.addEventListener)D||(C=j),C===void 0&&(C=!1),c.addEventListener(h.toString(),_,C);else if(c.attachEvent)c.attachEvent(cd(h.toString()),_);else if(c.addListener&&c.removeListener)c.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return p}function I7(){function c(p){return h.call(c.src,c.listener,p)}const h=T7;return c}function ad(c,h,p,_,C){if(Array.isArray(h))for(var k=0;k<h.length;k++)ad(c,h[k],p,_,C);else _=a(_)?!!_.capture:!!_,p=ud(p),c&&c[xr]?(c=c.i,k=String(h).toString(),k in c.g&&(h=c.g[k],p=Vu(h,p,_,C),p>-1&&(wa(h[p]),Array.prototype.splice.call(h,p,1),h.length==0&&(delete c.g[k],c.h--)))):c&&(c=Lu(c))&&(h=c.g[h.toString()],c=-1,h&&(c=Vu(h,p,_,C)),(p=c>-1?h[c]:null)&&xu(p))}function xu(c){if(typeof c!="number"&&c&&!c.da){var h=c.src;if(h&&h[xr])Du(h.i,c);else{var p=c.type,_=c.proxy;h.removeEventListener?h.removeEventListener(p,_,c.capture):h.detachEvent?h.detachEvent(cd(p),_):h.addListener&&h.removeListener&&h.removeListener(_),(p=Lu(h))?(Du(p,c),p.h==0&&(p.src=null,h[Ou]=null)):wa(c)}}}function cd(c){return c in ku?ku[c]:ku[c]="on"+c}function T7(c,h){if(c.da)c=!0;else{h=new At(h,this);const p=c.listener,_=c.ha||c.src;c.fa&&xu(c),c=p.call(_,h)}return c}function Lu(c){return c=c[Ou],c instanceof va?c:null}var Mu="__closure_events_fn_"+(Math.random()*1e9>>>0);function ud(c){return typeof c=="function"?c:(c[Mu]||(c[Mu]=function(h){return c.handleEvent(h)}),c[Mu])}function ct(){S.call(this),this.i=new va(this),this.M=this,this.G=null}f(ct,S),ct.prototype[xr]=!0,ct.prototype.removeEventListener=function(c,h,p,_){ad(this,c,h,p,_)};function yt(c,h){var p,_=c.G;if(_)for(p=[];_;_=_.G)p.push(_);if(c=c.M,_=h.type||h,typeof h=="string")h=new P(h,c);else if(h instanceof P)h.target=h.target||c;else{var C=h;h=new P(_,c),id(h,C)}C=!0;let k,j;if(p)for(j=p.length-1;j>=0;j--)k=h.g=p[j],C=Ra(k,_,!0,h)&&C;if(k=h.g=c,C=Ra(k,_,!0,h)&&C,C=Ra(k,_,!1,h)&&C,p)for(j=0;j<p.length;j++)k=h.g=p[j],C=Ra(k,_,!1,h)&&C}ct.prototype.N=function(){if(ct.Z.N.call(this),this.i){var c=this.i;for(const h in c.g){const p=c.g[h];for(let _=0;_<p.length;_++)wa(p[_]);delete c.g[h],c.h--}}this.G=null},ct.prototype.J=function(c,h,p,_){return this.i.add(String(c),h,!1,p,_)},ct.prototype.K=function(c,h,p,_){return this.i.add(String(c),h,!0,p,_)};function Ra(c,h,p,_){if(h=c.i.g[String(h)],!h)return!0;h=h.concat();let C=!0;for(let k=0;k<h.length;++k){const j=h[k];if(j&&!j.da&&j.capture==p){const ue=j.listener,Ke=j.ha||j.src;j.fa&&Du(c.i,j),C=ue.call(Ke,_)!==!1&&C}}return C&&!_.defaultPrevented}function w7(c,h){if(typeof c!="function")if(c&&typeof c.handleEvent=="function")c=l(c.handleEvent,c);else throw Error("Invalid listener argument");return Number(h)>2147483647?-1:o.setTimeout(c,h||0)}function ld(c){c.g=w7(()=>{c.g=null,c.i&&(c.i=!1,ld(c))},c.l);const h=c.h;c.h=null,c.m.apply(null,h)}class A7 extends S{constructor(h,p){super(),this.m=h,this.l=p,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:ld(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Mi(c){S.call(this),this.h=c,this.g={}}f(Mi,S);var hd=[];function dd(c){Aa(c.g,function(h,p){this.g.hasOwnProperty(p)&&xu(h)},c),c.g={}}Mi.prototype.N=function(){Mi.Z.N.call(this),dd(this)},Mi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Fu=o.JSON.stringify,v7=o.JSON.parse,R7=class{stringify(c){return o.JSON.stringify(c,void 0)}parse(c){return o.JSON.parse(c,void 0)}};function fd(){}function pd(){}var Fi={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Uu(){P.call(this,"d")}f(Uu,P);function Bu(){P.call(this,"c")}f(Bu,P);var Lr={},md=null;function Pa(){return md=md||new ct}Lr.Ia="serverreachability";function gd(c){P.call(this,Lr.Ia,c)}f(gd,P);function Ui(c){const h=Pa();yt(h,new gd(h))}Lr.STAT_EVENT="statevent";function _d(c,h){P.call(this,Lr.STAT_EVENT,c),this.stat=h}f(_d,P);function Et(c){const h=Pa();yt(h,new _d(h,c))}Lr.Ja="timingevent";function yd(c,h){P.call(this,Lr.Ja,c),this.size=h}f(yd,P);function Bi(c,h){if(typeof c!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){c()},h)}function qi(){this.g=!0}qi.prototype.ua=function(){this.g=!1};function P7(c,h,p,_,C,k){c.info(function(){if(c.g)if(k){var j="",ue=k.split("&");for(let Ae=0;Ae<ue.length;Ae++){var Ke=ue[Ae].split("=");if(Ke.length>1){const et=Ke[0];Ke=Ke[1];const Yt=et.split("_");j=Yt.length>=2&&Yt[1]=="type"?j+(et+"="+Ke+"&"):j+(et+"=redacted&")}}}else j=null;else j=k;return"XMLHTTP REQ ("+_+") [attempt "+C+"]: "+h+`
`+p+`
`+j})}function S7(c,h,p,_,C,k,j){c.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+C+"]: "+h+`
`+p+`
`+k+" "+j})}function vs(c,h,p,_){c.info(function(){return"XMLHTTP TEXT ("+h+"): "+C7(c,p)+(_?" "+_:"")})}function b7(c,h){c.info(function(){return"TIMEOUT: "+h})}qi.prototype.info=function(){};function C7(c,h){if(!c.g)return h;if(!h)return null;try{const k=JSON.parse(h);if(k){for(c=0;c<k.length;c++)if(Array.isArray(k[c])){var p=k[c];if(!(p.length<2)){var _=p[1];if(Array.isArray(_)&&!(_.length<1)){var C=_[0];if(C!="noop"&&C!="stop"&&C!="close")for(let j=1;j<_.length;j++)_[j]=""}}}}return Fu(k)}catch{return h}}var Sa={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ed={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Id;function qu(){}f(qu,fd),qu.prototype.g=function(){return new XMLHttpRequest},Id=new qu;function Gi(c){return encodeURIComponent(String(c))}function N7(c){var h=1;c=c.split(":");const p=[];for(;h>0&&c.length;)p.push(c.shift()),h--;return c.length&&p.push(c.join(":")),p}function Hn(c,h,p,_){this.j=c,this.i=h,this.l=p,this.S=_||1,this.V=new Mi(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Td}function Td(){this.i=null,this.g="",this.h=!1}var wd={},Gu={};function $u(c,h,p){c.M=1,c.A=Ca(Qt(h)),c.u=p,c.R=!0,Ad(c,null)}function Ad(c,h){c.F=Date.now(),ba(c),c.B=Qt(c.A);var p=c.B,_=c.S;Array.isArray(_)||(_=[String(_)]),Ld(p.i,"t",_),c.C=0,p=c.j.L,c.h=new Td,c.g=ef(c.j,p?h:null,!c.u),c.P>0&&(c.O=new A7(l(c.Y,c,c.g),c.P)),h=c.V,p=c.g,_=c.ba;var C="readystatechange";Array.isArray(C)||(C&&(hd[0]=C.toString()),C=hd);for(let k=0;k<C.length;k++){const j=od(p,C[k],_||h.handleEvent,!1,h.h||h);if(!j)break;h.g[j.key]=j}h=c.J?rd(c.J):{},c.u?(c.v||(c.v="POST"),h["Content-Type"]="application/x-www-form-urlencoded",c.g.ea(c.B,c.v,c.u,h)):(c.v="GET",c.g.ea(c.B,c.v,null,h)),Ui(),P7(c.i,c.v,c.B,c.l,c.S,c.u)}Hn.prototype.ba=function(c){c=c.target;const h=this.O;h&&Kn(c)==3?h.j():this.Y(c)},Hn.prototype.Y=function(c){try{if(c==this.g)e:{const ue=Kn(this.g),Ke=this.g.ya(),Ae=this.g.ca();if(!(ue<3)&&(ue!=3||this.g&&(this.h.h||this.g.la()||$d(this.g)))){this.K||ue!=4||Ke==7||(Ke==8||Ae<=0?Ui(3):Ui(2)),zu(this);var h=this.g.ca();this.X=h;var p=D7(this);if(this.o=h==200,S7(this.i,this.v,this.B,this.l,this.S,ue,h),this.o){if(this.U&&!this.L){t:{if(this.g){var _,C=this.g;if((_=C.g?C.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!T(_)){var k=_;break t}}k=null}if(c=k)vs(this.i,this.l,c,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Hu(this,c);else{this.o=!1,this.m=3,Et(12),Mr(this),$i(this);break e}}if(this.R){c=!0;let et;for(;!this.K&&this.C<p.length;)if(et=V7(this,p),et==Gu){ue==4&&(this.m=4,Et(14),c=!1),vs(this.i,this.l,null,"[Incomplete Response]");break}else if(et==wd){this.m=4,Et(15),vs(this.i,this.l,p,"[Invalid Chunk]"),c=!1;break}else vs(this.i,this.l,et,null),Hu(this,et);if(vd(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ue!=4||p.length!=0||this.h.h||(this.m=1,Et(16),c=!1),this.o=this.o&&c,!c)vs(this.i,this.l,p,"[Invalid Chunked Response]"),Mr(this),$i(this);else if(p.length>0&&!this.W){this.W=!0;var j=this.j;j.g==this&&j.aa&&!j.P&&(j.j.info("Great, no buffering proxy detected. Bytes received: "+p.length),Zu(j),j.P=!0,Et(11))}}else vs(this.i,this.l,p,null),Hu(this,p);ue==4&&Mr(this),this.o&&!this.K&&(ue==4?Yd(this.j,this):(this.o=!1,ba(this)))}else j7(this.g),h==400&&p.indexOf("Unknown SID")>0?(this.m=3,Et(12)):(this.m=0,Et(13)),Mr(this),$i(this)}}}catch{}finally{}};function D7(c){if(!vd(c))return c.g.la();const h=$d(c.g);if(h==="")return"";let p="";const _=h.length,C=Kn(c.g)==4;if(!c.h.i){if(typeof TextDecoder>"u")return Mr(c),$i(c),"";c.h.i=new o.TextDecoder}for(let k=0;k<_;k++)c.h.h=!0,p+=c.h.i.decode(h[k],{stream:!(C&&k==_-1)});return h.length=0,c.h.g+=p,c.C=0,c.h.g}function vd(c){return c.g?c.v=="GET"&&c.M!=2&&c.j.Aa:!1}function V7(c,h){var p=c.C,_=h.indexOf(`
`,p);return _==-1?Gu:(p=Number(h.substring(p,_)),isNaN(p)?wd:(_+=1,_+p>h.length?Gu:(h=h.slice(_,_+p),c.C=_+p,h)))}Hn.prototype.cancel=function(){this.K=!0,Mr(this)};function ba(c){c.T=Date.now()+c.H,Rd(c,c.H)}function Rd(c,h){if(c.D!=null)throw Error("WatchDog timer not null");c.D=Bi(l(c.aa,c),h)}function zu(c){c.D&&(o.clearTimeout(c.D),c.D=null)}Hn.prototype.aa=function(){this.D=null;const c=Date.now();c-this.T>=0?(b7(this.i,this.B),this.M!=2&&(Ui(),Et(17)),Mr(this),this.m=2,$i(this)):Rd(this,this.T-c)};function $i(c){c.j.I==0||c.K||Yd(c.j,c)}function Mr(c){zu(c);var h=c.O;h&&typeof h.dispose=="function"&&h.dispose(),c.O=null,dd(c.V),c.g&&(h=c.g,c.g=null,h.abort(),h.dispose())}function Hu(c,h){try{var p=c.j;if(p.I!=0&&(p.g==c||ju(p.h,c))){if(!c.L&&ju(p.h,c)&&p.I==3){try{var _=p.Ba.g.parse(h)}catch{_=null}if(Array.isArray(_)&&_.length==3){var C=_;if(C[0]==0){e:if(!p.v){if(p.g)if(p.g.F+3e3<c.F)ka(p),Va(p);else break e;Ju(p),Et(18)}}else p.xa=C[1],0<p.xa-p.K&&C[2]<37500&&p.F&&p.A==0&&!p.C&&(p.C=Bi(l(p.Va,p),6e3));bd(p.h)<=1&&p.ta&&(p.ta=void 0)}else Ur(p,11)}else if((c.L||p.g==c)&&ka(p),!T(h))for(C=p.Ba.g.parse(h),h=0;h<C.length;h++){let Ae=C[h];const et=Ae[0];if(!(et<=p.K))if(p.K=et,Ae=Ae[1],p.I==2)if(Ae[0]=="c"){p.M=Ae[1],p.ba=Ae[2];const Yt=Ae[3];Yt!=null&&(p.ka=Yt,p.j.info("VER="+p.ka));const Br=Ae[4];Br!=null&&(p.za=Br,p.j.info("SVER="+p.za));const Qn=Ae[5];Qn!=null&&typeof Qn=="number"&&Qn>0&&(_=1.5*Qn,p.O=_,p.j.info("backChannelRequestTimeoutMs_="+_)),_=p;const Yn=c.g;if(Yn){const La=Yn.g?Yn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(La){var k=_.h;k.g||La.indexOf("spdy")==-1&&La.indexOf("quic")==-1&&La.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(Wu(k,k.h),k.h=null))}if(_.G){const el=Yn.g?Yn.g.getResponseHeader("X-HTTP-Session-Id"):null;el&&(_.wa=el,be(_.J,_.G,el))}}p.I=3,p.l&&p.l.ra(),p.aa&&(p.T=Date.now()-c.F,p.j.info("Handshake RTT: "+p.T+"ms")),_=p;var j=c;if(_.na=Zd(_,_.L?_.ba:null,_.W),j.L){Cd(_.h,j);var ue=j,Ke=_.O;Ke&&(ue.H=Ke),ue.D&&(zu(ue),ba(ue)),_.g=j}else Kd(_);p.i.length>0&&Oa(p)}else Ae[0]!="stop"&&Ae[0]!="close"||Ur(p,7);else p.I==3&&(Ae[0]=="stop"||Ae[0]=="close"?Ae[0]=="stop"?Ur(p,7):Xu(p):Ae[0]!="noop"&&p.l&&p.l.qa(Ae),p.A=0)}}Ui(4)}catch{}}var O7=class{constructor(c,h){this.g=c,this.map=h}};function Pd(c){this.l=c||10,o.PerformanceNavigationTiming?(c=o.performance.getEntriesByType("navigation"),c=c.length>0&&(c[0].nextHopProtocol=="hq"||c[0].nextHopProtocol=="h2")):c=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=c?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Sd(c){return c.h?!0:c.g?c.g.size>=c.j:!1}function bd(c){return c.h?1:c.g?c.g.size:0}function ju(c,h){return c.h?c.h==h:c.g?c.g.has(h):!1}function Wu(c,h){c.g?c.g.add(h):c.h=h}function Cd(c,h){c.h&&c.h==h?c.h=null:c.g&&c.g.has(h)&&c.g.delete(h)}Pd.prototype.cancel=function(){if(this.i=Nd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const c of this.g.values())c.cancel();this.g.clear()}};function Nd(c){if(c.h!=null)return c.i.concat(c.h.G);if(c.g!=null&&c.g.size!==0){let h=c.i;for(const p of c.g.values())h=h.concat(p.G);return h}return I(c.i)}var Dd=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function k7(c,h){if(c){c=c.split("&");for(let p=0;p<c.length;p++){const _=c[p].indexOf("=");let C,k=null;_>=0?(C=c[p].substring(0,_),k=c[p].substring(_+1)):C=c[p],h(C,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function jn(c){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let h;c instanceof jn?(this.l=c.l,zi(this,c.j),this.o=c.o,this.g=c.g,Hi(this,c.u),this.h=c.h,Ku(this,Md(c.i)),this.m=c.m):c&&(h=String(c).match(Dd))?(this.l=!1,zi(this,h[1]||"",!0),this.o=ji(h[2]||""),this.g=ji(h[3]||"",!0),Hi(this,h[4]),this.h=ji(h[5]||"",!0),Ku(this,h[6]||"",!0),this.m=ji(h[7]||"")):(this.l=!1,this.i=new Ki(null,this.l))}jn.prototype.toString=function(){const c=[];var h=this.j;h&&c.push(Wi(h,Vd,!0),":");var p=this.g;return(p||h=="file")&&(c.push("//"),(h=this.o)&&c.push(Wi(h,Vd,!0),"@"),c.push(Gi(p).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.u,p!=null&&c.push(":",String(p))),(p=this.h)&&(this.g&&p.charAt(0)!="/"&&c.push("/"),c.push(Wi(p,p.charAt(0)=="/"?M7:L7,!0))),(p=this.i.toString())&&c.push("?",p),(p=this.m)&&c.push("#",Wi(p,U7)),c.join("")},jn.prototype.resolve=function(c){const h=Qt(this);let p=!!c.j;p?zi(h,c.j):p=!!c.o,p?h.o=c.o:p=!!c.g,p?h.g=c.g:p=c.u!=null;var _=c.h;if(p)Hi(h,c.u);else if(p=!!c.h){if(_.charAt(0)!="/")if(this.g&&!this.h)_="/"+_;else{var C=h.h.lastIndexOf("/");C!=-1&&(_=h.h.slice(0,C+1)+_)}if(C=_,C==".."||C==".")_="";else if(C.indexOf("./")!=-1||C.indexOf("/.")!=-1){_=C.lastIndexOf("/",0)==0,C=C.split("/");const k=[];for(let j=0;j<C.length;){const ue=C[j++];ue=="."?_&&j==C.length&&k.push(""):ue==".."?((k.length>1||k.length==1&&k[0]!="")&&k.pop(),_&&j==C.length&&k.push("")):(k.push(ue),_=!0)}_=k.join("/")}else _=C}return p?h.h=_:p=c.i.toString()!=="",p?Ku(h,Md(c.i)):p=!!c.m,p&&(h.m=c.m),h};function Qt(c){return new jn(c)}function zi(c,h,p){c.j=p?ji(h,!0):h,c.j&&(c.j=c.j.replace(/:$/,""))}function Hi(c,h){if(h){if(h=Number(h),isNaN(h)||h<0)throw Error("Bad port number "+h);c.u=h}else c.u=null}function Ku(c,h,p){h instanceof Ki?(c.i=h,B7(c.i,c.l)):(p||(h=Wi(h,F7)),c.i=new Ki(h,c.l))}function be(c,h,p){c.i.set(h,p)}function Ca(c){return be(c,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),c}function ji(c,h){return c?h?decodeURI(c.replace(/%25/g,"%2525")):decodeURIComponent(c):""}function Wi(c,h,p){return typeof c=="string"?(c=encodeURI(c).replace(h,x7),p&&(c=c.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c):null}function x7(c){return c=c.charCodeAt(0),"%"+(c>>4&15).toString(16)+(c&15).toString(16)}var Vd=/[#\/\?@]/g,L7=/[#\?:]/g,M7=/[#\?]/g,F7=/[#\?@]/g,U7=/#/g;function Ki(c,h){this.h=this.g=null,this.i=c||null,this.j=!!h}function Fr(c){c.g||(c.g=new Map,c.h=0,c.i&&k7(c.i,function(h,p){c.add(decodeURIComponent(h.replace(/\+/g," ")),p)}))}r=Ki.prototype,r.add=function(c,h){Fr(this),this.i=null,c=Rs(this,c);let p=this.g.get(c);return p||this.g.set(c,p=[]),p.push(h),this.h+=1,this};function Od(c,h){Fr(c),h=Rs(c,h),c.g.has(h)&&(c.i=null,c.h-=c.g.get(h).length,c.g.delete(h))}function kd(c,h){return Fr(c),h=Rs(c,h),c.g.has(h)}r.forEach=function(c,h){Fr(this),this.g.forEach(function(p,_){p.forEach(function(C){c.call(h,C,_,this)},this)},this)};function xd(c,h){Fr(c);let p=[];if(typeof h=="string")kd(c,h)&&(p=p.concat(c.g.get(Rs(c,h))));else for(c=Array.from(c.g.values()),h=0;h<c.length;h++)p=p.concat(c[h]);return p}r.set=function(c,h){return Fr(this),this.i=null,c=Rs(this,c),kd(this,c)&&(this.h-=this.g.get(c).length),this.g.set(c,[h]),this.h+=1,this},r.get=function(c,h){return c?(c=xd(this,c),c.length>0?String(c[0]):h):h};function Ld(c,h,p){Od(c,h),p.length>0&&(c.i=null,c.g.set(Rs(c,h),I(p)),c.h+=p.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const c=[],h=Array.from(this.g.keys());for(let _=0;_<h.length;_++){var p=h[_];const C=Gi(p);p=xd(this,p);for(let k=0;k<p.length;k++){let j=C;p[k]!==""&&(j+="="+Gi(p[k])),c.push(j)}}return this.i=c.join("&")};function Md(c){const h=new Ki;return h.i=c.i,c.g&&(h.g=new Map(c.g),h.h=c.h),h}function Rs(c,h){return h=String(h),c.j&&(h=h.toLowerCase()),h}function B7(c,h){h&&!c.j&&(Fr(c),c.i=null,c.g.forEach(function(p,_){const C=_.toLowerCase();_!=C&&(Od(this,_),Ld(this,C,p))},c)),c.j=h}function q7(c,h){const p=new qi;if(o.Image){const _=new Image;_.onload=d(Wn,p,"TestLoadImage: loaded",!0,h,_),_.onerror=d(Wn,p,"TestLoadImage: error",!1,h,_),_.onabort=d(Wn,p,"TestLoadImage: abort",!1,h,_),_.ontimeout=d(Wn,p,"TestLoadImage: timeout",!1,h,_),o.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=c}else h(!1)}function G7(c,h){const p=new qi,_=new AbortController,C=setTimeout(()=>{_.abort(),Wn(p,"TestPingServer: timeout",!1,h)},1e4);fetch(c,{signal:_.signal}).then(k=>{clearTimeout(C),k.ok?Wn(p,"TestPingServer: ok",!0,h):Wn(p,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(C),Wn(p,"TestPingServer: error",!1,h)})}function Wn(c,h,p,_,C){try{C&&(C.onload=null,C.onerror=null,C.onabort=null,C.ontimeout=null),_(p)}catch{}}function $7(){this.g=new R7}function Qu(c){this.i=c.Sb||null,this.h=c.ab||!1}f(Qu,fd),Qu.prototype.g=function(){return new Na(this.i,this.h)};function Na(c,h){ct.call(this),this.H=c,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}f(Na,ct),r=Na.prototype,r.open=function(c,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=c,this.D=h,this.readyState=1,Yi(this)},r.send=function(c){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const h={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};c&&(h.body=c),(this.H||o).fetch(new Request(this.D,h)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Qi(this)),this.readyState=0},r.Pa=function(c){if(this.g&&(this.l=c,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=c.headers,this.readyState=2,Yi(this)),this.g&&(this.readyState=3,Yi(this),this.g)))if(this.responseType==="arraybuffer")c.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in c){if(this.j=c.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Fd(this)}else c.text().then(this.Oa.bind(this),this.ga.bind(this))};function Fd(c){c.j.read().then(c.Ma.bind(c)).catch(c.ga.bind(c))}r.Ma=function(c){if(this.g){if(this.o&&c.value)this.response.push(c.value);else if(!this.o){var h=c.value?c.value:new Uint8Array(0);(h=this.B.decode(h,{stream:!c.done}))&&(this.response=this.responseText+=h)}c.done?Qi(this):Yi(this),this.readyState==3&&Fd(this)}},r.Oa=function(c){this.g&&(this.response=this.responseText=c,Qi(this))},r.Na=function(c){this.g&&(this.response=c,Qi(this))},r.ga=function(){this.g&&Qi(this)};function Qi(c){c.readyState=4,c.l=null,c.j=null,c.B=null,Yi(c)}r.setRequestHeader=function(c,h){this.A.append(c,h)},r.getResponseHeader=function(c){return this.h&&this.h.get(c.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const c=[],h=this.h.entries();for(var p=h.next();!p.done;)p=p.value,c.push(p[0]+": "+p[1]),p=h.next();return c.join(`\r
`)};function Yi(c){c.onreadystatechange&&c.onreadystatechange.call(c)}Object.defineProperty(Na.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(c){this.m=c?"include":"same-origin"}});function Ud(c){let h="";return Aa(c,function(p,_){h+=_,h+=":",h+=p,h+=`\r
`}),h}function Yu(c,h,p){e:{for(_ in p){var _=!1;break e}_=!0}_||(p=Ud(p),typeof c=="string"?p!=null&&Gi(p):be(c,h,p))}function Le(c){ct.call(this),this.headers=new Map,this.L=c||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}f(Le,ct);var z7=/^https?$/i,H7=["POST","PUT"];r=Le.prototype,r.Fa=function(c){this.H=c},r.ea=function(c,h,p,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+c);h=h?h.toUpperCase():"GET",this.D=c,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Id.g(),this.g.onreadystatechange=g(l(this.Ca,this));try{this.B=!0,this.g.open(h,String(c),!0),this.B=!1}catch(k){Bd(this,k);return}if(c=p||"",p=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var C in _)p.set(C,_[C]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const k of _.keys())p.set(k,_.get(k));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(p.keys()).find(k=>k.toLowerCase()=="content-type"),C=o.FormData&&c instanceof o.FormData,!(Array.prototype.indexOf.call(H7,h,void 0)>=0)||_||C||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,j]of p)this.g.setRequestHeader(k,j);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(c),this.v=!1}catch(k){Bd(this,k)}};function Bd(c,h){c.h=!1,c.g&&(c.j=!0,c.g.abort(),c.j=!1),c.l=h,c.o=5,qd(c),Da(c)}function qd(c){c.A||(c.A=!0,yt(c,"complete"),yt(c,"error"))}r.abort=function(c){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=c||7,yt(this,"complete"),yt(this,"abort"),Da(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Da(this,!0)),Le.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Gd(this):this.Xa())},r.Xa=function(){Gd(this)};function Gd(c){if(c.h&&typeof i<"u"){if(c.v&&Kn(c)==4)setTimeout(c.Ca.bind(c),0);else if(yt(c,"readystatechange"),Kn(c)==4){c.h=!1;try{const k=c.ca();e:switch(k){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var p;if(!(p=h)){var _;if(_=k===0){let j=String(c.D).match(Dd)[1]||null;!j&&o.self&&o.self.location&&(j=o.self.location.protocol.slice(0,-1)),_=!z7.test(j?j.toLowerCase():"")}p=_}if(p)yt(c,"complete"),yt(c,"success");else{c.o=6;try{var C=Kn(c)>2?c.g.statusText:""}catch{C=""}c.l=C+" ["+c.ca()+"]",qd(c)}}finally{Da(c)}}}}function Da(c,h){if(c.g){c.m&&(clearTimeout(c.m),c.m=null);const p=c.g;c.g=null,h||yt(c,"ready");try{p.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Kn(c){return c.g?c.g.readyState:0}r.ca=function(){try{return Kn(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(c){if(this.g){var h=this.g.responseText;return c&&h.indexOf(c)==0&&(h=h.substring(c.length)),v7(h)}};function $d(c){try{if(!c.g)return null;if("response"in c.g)return c.g.response;switch(c.F){case"":case"text":return c.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in c.g)return c.g.mozResponseArrayBuffer}return null}catch{return null}}function j7(c){const h={};c=(c.g&&Kn(c)>=2&&c.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<c.length;_++){if(T(c[_]))continue;var p=N7(c[_]);const C=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const k=h[C]||[];h[C]=k,k.push(p)}y7(h,function(_){return _.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Xi(c,h,p){return p&&p.internalChannelParams&&p.internalChannelParams[c]||h}function zd(c){this.za=0,this.i=[],this.j=new qi,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Xi("failFast",!1,c),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Xi("baseRetryDelayMs",5e3,c),this.Za=Xi("retryDelaySeedMs",1e4,c),this.Ta=Xi("forwardChannelMaxRetries",2,c),this.va=Xi("forwardChannelRequestTimeoutMs",2e4,c),this.ma=c&&c.xmlHttpFactory||void 0,this.Ua=c&&c.Rb||void 0,this.Aa=c&&c.useFetchStreams||!1,this.O=void 0,this.L=c&&c.supportsCrossDomainXhr||!1,this.M="",this.h=new Pd(c&&c.concurrentRequestLimit),this.Ba=new $7,this.S=c&&c.fastHandshake||!1,this.R=c&&c.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=c&&c.Pb||!1,c&&c.ua&&this.j.ua(),c&&c.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&c&&c.detectBufferingProxy||!1,this.ia=void 0,c&&c.longPollingTimeout&&c.longPollingTimeout>0&&(this.ia=c.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=zd.prototype,r.ka=8,r.I=1,r.connect=function(c,h,p,_){Et(0),this.W=c,this.H=h||{},p&&_!==void 0&&(this.H.OSID=p,this.H.OAID=_),this.F=this.X,this.J=Zd(this,null,this.W),Oa(this)};function Xu(c){if(Hd(c),c.I==3){var h=c.V++,p=Qt(c.J);if(be(p,"SID",c.M),be(p,"RID",h),be(p,"TYPE","terminate"),Ji(c,p),h=new Hn(c,c.j,h),h.M=2,h.A=Ca(Qt(p)),p=!1,o.navigator&&o.navigator.sendBeacon)try{p=o.navigator.sendBeacon(h.A.toString(),"")}catch{}!p&&o.Image&&(new Image().src=h.A,p=!0),p||(h.g=ef(h.j,null),h.g.ea(h.A)),h.F=Date.now(),ba(h)}Jd(c)}function Va(c){c.g&&(Zu(c),c.g.cancel(),c.g=null)}function Hd(c){Va(c),c.v&&(o.clearTimeout(c.v),c.v=null),ka(c),c.h.cancel(),c.m&&(typeof c.m=="number"&&o.clearTimeout(c.m),c.m=null)}function Oa(c){if(!Sd(c.h)&&!c.m){c.m=!0;var h=c.Ea;le||E(),de||(le(),de=!0),A.add(h,c),c.D=0}}function W7(c,h){return bd(c.h)>=c.h.j-(c.m?1:0)?!1:c.m?(c.i=h.G.concat(c.i),!0):c.I==1||c.I==2||c.D>=(c.Sa?0:c.Ta)?!1:(c.m=Bi(l(c.Ea,c,h),Xd(c,c.D)),c.D++,!0)}r.Ea=function(c){if(this.m)if(this.m=null,this.I==1){if(!c){this.V=Math.floor(Math.random()*1e5),c=this.V++;const C=new Hn(this,this.j,c);let k=this.o;if(this.U&&(k?(k=rd(k),id(k,this.U)):k=this.U),this.u!==null||this.R||(C.J=k,k=null),this.S)e:{for(var h=0,p=0;p<this.i.length;p++){t:{var _=this.i[p];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(h+=_,h>4096){h=p;break e}if(h===4096||p===this.i.length-1){h=p+1;break e}}h=1e3}else h=1e3;h=Wd(this,C,h),p=Qt(this.J),be(p,"RID",c),be(p,"CVER",22),this.G&&be(p,"X-HTTP-Session-Id",this.G),Ji(this,p),k&&(this.R?h="headers="+Gi(Ud(k))+"&"+h:this.u&&Yu(p,this.u,k)),Wu(this.h,C),this.Ra&&be(p,"TYPE","init"),this.S?(be(p,"$req",h),be(p,"SID","null"),C.U=!0,$u(C,p,null)):$u(C,p,h),this.I=2}}else this.I==3&&(c?jd(this,c):this.i.length==0||Sd(this.h)||jd(this))};function jd(c,h){var p;h?p=h.l:p=c.V++;const _=Qt(c.J);be(_,"SID",c.M),be(_,"RID",p),be(_,"AID",c.K),Ji(c,_),c.u&&c.o&&Yu(_,c.u,c.o),p=new Hn(c,c.j,p,c.D+1),c.u===null&&(p.J=c.o),h&&(c.i=h.G.concat(c.i)),h=Wd(c,p,1e3),p.H=Math.round(c.va*.5)+Math.round(c.va*.5*Math.random()),Wu(c.h,p),$u(p,_,h)}function Ji(c,h){c.H&&Aa(c.H,function(p,_){be(h,_,p)}),c.l&&Aa({},function(p,_){be(h,_,p)})}function Wd(c,h,p){p=Math.min(c.i.length,p);const _=c.l?l(c.l.Ka,c.l,c):null;e:{var C=c.i;let ue=-1;for(;;){const Ke=["count="+p];ue==-1?p>0?(ue=C[0].g,Ke.push("ofs="+ue)):ue=0:Ke.push("ofs="+ue);let Ae=!0;for(let et=0;et<p;et++){var k=C[et].g;const Yt=C[et].map;if(k-=ue,k<0)ue=Math.max(0,C[et].g-100),Ae=!1;else try{k="req"+k+"_"||"";try{var j=Yt instanceof Map?Yt:Object.entries(Yt);for(const[Br,Qn]of j){let Yn=Qn;a(Qn)&&(Yn=Fu(Qn)),Ke.push(k+Br+"="+encodeURIComponent(Yn))}}catch(Br){throw Ke.push(k+"type="+encodeURIComponent("_badmap")),Br}}catch{_&&_(Yt)}}if(Ae){j=Ke.join("&");break e}}j=void 0}return c=c.i.splice(0,p),h.G=c,j}function Kd(c){if(!c.g&&!c.v){c.Y=1;var h=c.Da;le||E(),de||(le(),de=!0),A.add(h,c),c.A=0}}function Ju(c){return c.g||c.v||c.A>=3?!1:(c.Y++,c.v=Bi(l(c.Da,c),Xd(c,c.A)),c.A++,!0)}r.Da=function(){if(this.v=null,Qd(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var c=4*this.T;this.j.info("BP detection timer enabled: "+c),this.B=Bi(l(this.Wa,this),c)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Et(10),Va(this),Qd(this))};function Zu(c){c.B!=null&&(o.clearTimeout(c.B),c.B=null)}function Qd(c){c.g=new Hn(c,c.j,"rpc",c.Y),c.u===null&&(c.g.J=c.o),c.g.P=0;var h=Qt(c.na);be(h,"RID","rpc"),be(h,"SID",c.M),be(h,"AID",c.K),be(h,"CI",c.F?"0":"1"),!c.F&&c.ia&&be(h,"TO",c.ia),be(h,"TYPE","xmlhttp"),Ji(c,h),c.u&&c.o&&Yu(h,c.u,c.o),c.O&&(c.g.H=c.O);var p=c.g;c=c.ba,p.M=1,p.A=Ca(Qt(h)),p.u=null,p.R=!0,Ad(p,c)}r.Va=function(){this.C!=null&&(this.C=null,Va(this),Ju(this),Et(19))};function ka(c){c.C!=null&&(o.clearTimeout(c.C),c.C=null)}function Yd(c,h){var p=null;if(c.g==h){ka(c),Zu(c),c.g=null;var _=2}else if(ju(c.h,h))p=h.G,Cd(c.h,h),_=1;else return;if(c.I!=0){if(h.o)if(_==1){p=h.u?h.u.length:0,h=Date.now()-h.F;var C=c.D;_=Pa(),yt(_,new yd(_,p)),Oa(c)}else Kd(c);else if(C=h.m,C==3||C==0&&h.X>0||!(_==1&&W7(c,h)||_==2&&Ju(c)))switch(p&&p.length>0&&(h=c.h,h.i=h.i.concat(p)),C){case 1:Ur(c,5);break;case 4:Ur(c,10);break;case 3:Ur(c,6);break;default:Ur(c,2)}}}function Xd(c,h){let p=c.Qa+Math.floor(Math.random()*c.Za);return c.isActive()||(p*=2),p*h}function Ur(c,h){if(c.j.info("Error code "+h),h==2){var p=l(c.bb,c),_=c.Ua;const C=!_;_=new jn(_||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||zi(_,"https"),Ca(_),C?q7(_.toString(),p):G7(_.toString(),p)}else Et(2);c.I=0,c.l&&c.l.pa(h),Jd(c),Hd(c)}r.bb=function(c){c?(this.j.info("Successfully pinged google.com"),Et(2)):(this.j.info("Failed to ping google.com"),Et(1))};function Jd(c){if(c.I=0,c.ja=[],c.l){const h=Nd(c.h);(h.length!=0||c.i.length!=0)&&(R(c.ja,h),R(c.ja,c.i),c.h.i.length=0,I(c.i),c.i.length=0),c.l.oa()}}function Zd(c,h,p){var _=p instanceof jn?Qt(p):new jn(p);if(_.g!="")h&&(_.g=h+"."+_.g),Hi(_,_.u);else{var C=o.location;_=C.protocol,h=h?h+"."+C.hostname:C.hostname,C=+C.port;const k=new jn(null);_&&zi(k,_),h&&(k.g=h),C&&Hi(k,C),p&&(k.h=p),_=k}return p=c.G,h=c.wa,p&&h&&be(_,p,h),be(_,"VER",c.ka),Ji(c,_),_}function ef(c,h,p){if(h&&!c.L)throw Error("Can't create secondary domain capable XhrIo object.");return h=c.Aa&&!c.ma?new Le(new Qu({ab:p})):new Le(c.ma),h.Fa(c.L),h}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function tf(){}r=tf.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function xa(){}xa.prototype.g=function(c,h){return new Vt(c,h)};function Vt(c,h){ct.call(this),this.g=new zd(h),this.l=c,this.h=h&&h.messageUrlParams||null,c=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(c?c["X-Client-Protocol"]="webchannel":c={"X-Client-Protocol":"webchannel"}),this.g.o=c,c=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(c?c["X-WebChannel-Content-Type"]=h.messageContentType:c={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.sa&&(c?c["X-WebChannel-Client-Profile"]=h.sa:c={"X-WebChannel-Client-Profile":h.sa}),this.g.U=c,(c=h&&h.Qb)&&!T(c)&&(this.g.u=c),this.A=h&&h.supportsCrossDomainXhr||!1,this.v=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!T(h)&&(this.g.G=h,c=this.h,c!==null&&h in c&&(c=this.h,h in c&&delete c[h])),this.j=new Ps(this)}f(Vt,ct),Vt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Vt.prototype.close=function(){Xu(this.g)},Vt.prototype.o=function(c){var h=this.g;if(typeof c=="string"){var p={};p.__data__=c,c=p}else this.v&&(p={},p.__data__=Fu(c),c=p);h.i.push(new O7(h.Ya++,c)),h.I==3&&Oa(h)},Vt.prototype.N=function(){this.g.l=null,delete this.j,Xu(this.g),delete this.g,Vt.Z.N.call(this)};function nf(c){Uu.call(this),c.__headers__&&(this.headers=c.__headers__,this.statusCode=c.__status__,delete c.__headers__,delete c.__status__);var h=c.__sm__;if(h){e:{for(const p in h){c=p;break e}c=void 0}(this.i=c)&&(c=this.i,h=h!==null&&c in h?h[c]:void 0),this.data=h}else this.data=c}f(nf,Uu);function rf(){Bu.call(this),this.status=1}f(rf,Bu);function Ps(c){this.g=c}f(Ps,tf),Ps.prototype.ra=function(){yt(this.g,"a")},Ps.prototype.qa=function(c){yt(this.g,new nf(c))},Ps.prototype.pa=function(c){yt(this.g,new rf)},Ps.prototype.oa=function(){yt(this.g,"b")},xa.prototype.createWebChannel=xa.prototype.g,Vt.prototype.send=Vt.prototype.o,Vt.prototype.open=Vt.prototype.m,Vt.prototype.close=Vt.prototype.close,im=function(){return new xa},sm=function(){return Pa()},rm=Lr,Nl={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Sa.NO_ERROR=0,Sa.TIMEOUT=8,Sa.HTTP_ERROR=6,tc=Sa,Ed.COMPLETE="complete",nm=Ed,pd.EventType=Fi,Fi.OPEN="a",Fi.CLOSE="b",Fi.ERROR="c",Fi.MESSAGE="d",ct.prototype.listen=ct.prototype.J,uo=pd,Le.prototype.listenOnce=Le.prototype.K,Le.prototype.getLastError=Le.prototype.Ha,Le.prototype.getLastErrorCode=Le.prototype.ya,Le.prototype.getStatus=Le.prototype.ca,Le.prototype.getResponseJson=Le.prototype.La,Le.prototype.getResponseText=Le.prototype.la,Le.prototype.send=Le.prototype.ea,Le.prototype.setWithCredentials=Le.prototype.Fa,tm=Le}).apply(typeof Ua<"u"?Ua:typeof self<"u"?self:typeof window<"u"?window:{});/*!
 * re2js
 * RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
 *
 * @version v0.4.3
 * @author Alexey Vasiliev
 * @homepage https://github.com/le0pard/re2js#readme
 * @repository github:le0pard/re2js
 * @license MIT
 */const xe=class xe{};y(xe,"FOLD_CASE",1),y(xe,"LITERAL",2),y(xe,"CLASS_NL",4),y(xe,"DOT_NL",8),y(xe,"ONE_LINE",16),y(xe,"NON_GREEDY",32),y(xe,"PERL_X",64),y(xe,"UNICODE_GROUPS",128),y(xe,"WAS_DOLLAR",256),y(xe,"MATCH_NL",xe.CLASS_NL|xe.DOT_NL),y(xe,"PERL",xe.CLASS_NL|xe.ONE_LINE|xe.PERL_X|xe.UNICODE_GROUPS),y(xe,"POSIX",0),y(xe,"UNANCHORED",0),y(xe,"ANCHOR_START",1),y(xe,"ANCHOR_BOTH",2);let K=xe;class V{static toUpperCase(e){const t=String.fromCodePoint(e).toUpperCase();if(t.length>1)return e;const n=String.fromCodePoint(t.codePointAt(0)).toLowerCase();return n.length>1||n.codePointAt(0)!==e?e:t.codePointAt(0)}static toLowerCase(e){const t=String.fromCodePoint(e).toLowerCase();if(t.length>1)return e;const n=String.fromCodePoint(t.codePointAt(0)).toUpperCase();return n.length>1||n.codePointAt(0)!==e?e:t.codePointAt(0)}}y(V,"CODES",new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]]));const m=class m{};y(m,"CASE_ORBIT",new Map([[75,107],[107,8490],[8490,75],[83,115],[115,383],[383,83],[181,924],[924,956],[956,181],[197,229],[229,8491],[8491,197],[452,453],[453,454],[454,452],[455,456],[456,457],[457,455],[458,459],[459,460],[460,458],[497,498],[498,499],[499,497],[837,921],[921,953],[953,8126],[8126,837],[914,946],[946,976],[976,914],[917,949],[949,1013],[1013,917],[920,952],[952,977],[977,1012],[1012,920],[922,954],[954,1008],[1008,922],[928,960],[960,982],[982,928],[929,961],[961,1009],[1009,929],[931,962],[962,963],[963,931],[934,966],[966,981],[981,934],[937,969],[969,8486],[8486,937],[1042,1074],[1074,7296],[7296,1042],[1044,1076],[1076,7297],[7297,1044],[1054,1086],[1086,7298],[7298,1054],[1057,1089],[1089,7299],[7299,1057],[1058,1090],[1090,7300],[7300,7301],[7301,1058],[1066,1098],[1098,7302],[7302,1066],[1122,1123],[1123,7303],[7303,1122],[7304,42570],[42570,42571],[42571,7304],[7776,7777],[7777,7835],[7835,7776],[223,7838],[7838,223],[8064,8072],[8072,8064],[8065,8073],[8073,8065],[8066,8074],[8074,8066],[8067,8075],[8075,8067],[8068,8076],[8076,8068],[8069,8077],[8077,8069],[8070,8078],[8078,8070],[8071,8079],[8079,8071],[8080,8088],[8088,8080],[8081,8089],[8089,8081],[8082,8090],[8090,8082],[8083,8091],[8091,8083],[8084,8092],[8092,8084],[8085,8093],[8093,8085],[8086,8094],[8094,8086],[8087,8095],[8095,8087],[8096,8104],[8104,8096],[8097,8105],[8105,8097],[8098,8106],[8106,8098],[8099,8107],[8107,8099],[8100,8108],[8108,8100],[8101,8109],[8109,8101],[8102,8110],[8110,8102],[8103,8111],[8111,8103],[8115,8124],[8124,8115],[8131,8140],[8140,8131],[912,8147],[8147,912],[944,8163],[8163,944],[8179,8188],[8188,8179],[64261,64262],[64262,64261],[66560,66600],[66600,66560],[66561,66601],[66601,66561],[66562,66602],[66602,66562],[66563,66603],[66603,66563],[66564,66604],[66604,66564],[66565,66605],[66605,66565],[66566,66606],[66606,66566],[66567,66607],[66607,66567],[66568,66608],[66608,66568],[66569,66609],[66609,66569],[66570,66610],[66610,66570],[66571,66611],[66611,66571],[66572,66612],[66612,66572],[66573,66613],[66613,66573],[66574,66614],[66614,66574],[66575,66615],[66615,66575],[66576,66616],[66616,66576],[66577,66617],[66617,66577],[66578,66618],[66618,66578],[66579,66619],[66619,66579],[66580,66620],[66620,66580],[66581,66621],[66621,66581],[66582,66622],[66622,66582],[66583,66623],[66623,66583],[66584,66624],[66624,66584],[66585,66625],[66625,66585],[66586,66626],[66626,66586],[66587,66627],[66627,66587],[66588,66628],[66628,66588],[66589,66629],[66629,66589],[66590,66630],[66630,66590],[66591,66631],[66631,66591],[66592,66632],[66632,66592],[66593,66633],[66633,66593],[66594,66634],[66634,66594],[66595,66635],[66635,66595],[66596,66636],[66636,66596],[66597,66637],[66637,66597],[66598,66638],[66638,66598],[66599,66639],[66639,66599],[66736,66776],[66776,66736],[66737,66777],[66777,66737],[66738,66778],[66778,66738],[66739,66779],[66779,66739],[66740,66780],[66780,66740],[66741,66781],[66781,66741],[66742,66782],[66782,66742],[66743,66783],[66783,66743],[66744,66784],[66784,66744],[66745,66785],[66785,66745],[66746,66786],[66786,66746],[66747,66787],[66787,66747],[66748,66788],[66788,66748],[66749,66789],[66789,66749],[66750,66790],[66790,66750],[66751,66791],[66791,66751],[66752,66792],[66792,66752],[66753,66793],[66793,66753],[66754,66794],[66794,66754],[66755,66795],[66795,66755],[66756,66796],[66796,66756],[66757,66797],[66797,66757],[66758,66798],[66798,66758],[66759,66799],[66799,66759],[66760,66800],[66800,66760],[66761,66801],[66801,66761],[66762,66802],[66802,66762],[66763,66803],[66803,66763],[66764,66804],[66804,66764],[66765,66805],[66805,66765],[66766,66806],[66806,66766],[66767,66807],[66807,66767],[66768,66808],[66808,66768],[66769,66809],[66809,66769],[66770,66810],[66810,66770],[66771,66811],[66811,66771],[66928,66967],[66967,66928],[66929,66968],[66968,66929],[66930,66969],[66969,66930],[66931,66970],[66970,66931],[66932,66971],[66971,66932],[66933,66972],[66972,66933],[66934,66973],[66973,66934],[66935,66974],[66974,66935],[66936,66975],[66975,66936],[66937,66976],[66976,66937],[66938,66977],[66977,66938],[66940,66979],[66979,66940],[66941,66980],[66980,66941],[66942,66981],[66981,66942],[66943,66982],[66982,66943],[66944,66983],[66983,66944],[66945,66984],[66984,66945],[66946,66985],[66985,66946],[66947,66986],[66986,66947],[66948,66987],[66987,66948],[66949,66988],[66988,66949],[66950,66989],[66989,66950],[66951,66990],[66990,66951],[66952,66991],[66991,66952],[66953,66992],[66992,66953],[66954,66993],[66993,66954],[66956,66995],[66995,66956],[66957,66996],[66996,66957],[66958,66997],[66997,66958],[66959,66998],[66998,66959],[66960,66999],[66999,66960],[66961,67e3],[67e3,66961],[66962,67001],[67001,66962],[66964,67003],[67003,66964],[66965,67004],[67004,66965],[68736,68800],[68800,68736],[68737,68801],[68801,68737],[68738,68802],[68802,68738],[68739,68803],[68803,68739],[68740,68804],[68804,68740],[68741,68805],[68805,68741],[68742,68806],[68806,68742],[68743,68807],[68807,68743],[68744,68808],[68808,68744],[68745,68809],[68809,68745],[68746,68810],[68810,68746],[68747,68811],[68811,68747],[68748,68812],[68812,68748],[68749,68813],[68813,68749],[68750,68814],[68814,68750],[68751,68815],[68815,68751],[68752,68816],[68816,68752],[68753,68817],[68817,68753],[68754,68818],[68818,68754],[68755,68819],[68819,68755],[68756,68820],[68820,68756],[68757,68821],[68821,68757],[68758,68822],[68822,68758],[68759,68823],[68823,68759],[68760,68824],[68824,68760],[68761,68825],[68825,68761],[68762,68826],[68826,68762],[68763,68827],[68827,68763],[68764,68828],[68828,68764],[68765,68829],[68829,68765],[68766,68830],[68830,68766],[68767,68831],[68831,68767],[68768,68832],[68832,68768],[68769,68833],[68833,68769],[68770,68834],[68834,68770],[68771,68835],[68835,68771],[68772,68836],[68836,68772],[68773,68837],[68837,68773],[68774,68838],[68838,68774],[68775,68839],[68839,68775],[68776,68840],[68840,68776],[68777,68841],[68841,68777],[68778,68842],[68842,68778],[68779,68843],[68843,68779],[68780,68844],[68844,68780],[68781,68845],[68845,68781],[68782,68846],[68846,68782],[68783,68847],[68847,68783],[68784,68848],[68848,68784],[68785,68849],[68849,68785],[68786,68850],[68850,68786],[71840,71872],[71872,71840],[71841,71873],[71873,71841],[71842,71874],[71874,71842],[71843,71875],[71875,71843],[71844,71876],[71876,71844],[71845,71877],[71877,71845],[71846,71878],[71878,71846],[71847,71879],[71879,71847],[71848,71880],[71880,71848],[71849,71881],[71881,71849],[71850,71882],[71882,71850],[71851,71883],[71883,71851],[71852,71884],[71884,71852],[71853,71885],[71885,71853],[71854,71886],[71886,71854],[71855,71887],[71887,71855],[71856,71888],[71888,71856],[71857,71889],[71889,71857],[71858,71890],[71890,71858],[71859,71891],[71891,71859],[71860,71892],[71892,71860],[71861,71893],[71893,71861],[71862,71894],[71894,71862],[71863,71895],[71895,71863],[71864,71896],[71896,71864],[71865,71897],[71897,71865],[71866,71898],[71898,71866],[71867,71899],[71899,71867],[71868,71900],[71900,71868],[71869,71901],[71901,71869],[71870,71902],[71902,71870],[71871,71903],[71903,71871],[93760,93792],[93792,93760],[93761,93793],[93793,93761],[93762,93794],[93794,93762],[93763,93795],[93795,93763],[93764,93796],[93796,93764],[93765,93797],[93797,93765],[93766,93798],[93798,93766],[93767,93799],[93799,93767],[93768,93800],[93800,93768],[93769,93801],[93801,93769],[93770,93802],[93802,93770],[93771,93803],[93803,93771],[93772,93804],[93804,93772],[93773,93805],[93805,93773],[93774,93806],[93806,93774],[93775,93807],[93807,93775],[93776,93808],[93808,93776],[93777,93809],[93809,93777],[93778,93810],[93810,93778],[93779,93811],[93811,93779],[93780,93812],[93812,93780],[93781,93813],[93813,93781],[93782,93814],[93814,93782],[93783,93815],[93815,93783],[93784,93816],[93816,93784],[93785,93817],[93817,93785],[93786,93818],[93818,93786],[93787,93819],[93819,93787],[93788,93820],[93820,93788],[93789,93821],[93821,93789],[93790,93822],[93822,93790],[93791,93823],[93823,93791],[125184,125218],[125218,125184],[125185,125219],[125219,125185],[125186,125220],[125220,125186],[125187,125221],[125221,125187],[125188,125222],[125222,125188],[125189,125223],[125223,125189],[125190,125224],[125224,125190],[125191,125225],[125225,125191],[125192,125226],[125226,125192],[125193,125227],[125227,125193],[125194,125228],[125228,125194],[125195,125229],[125229,125195],[125196,125230],[125230,125196],[125197,125231],[125231,125197],[125198,125232],[125232,125198],[125199,125233],[125233,125199],[125200,125234],[125234,125200],[125201,125235],[125235,125201],[125202,125236],[125236,125202],[125203,125237],[125237,125203],[125204,125238],[125238,125204],[125205,125239],[125239,125205],[125206,125240],[125240,125206],[125207,125241],[125241,125207],[125208,125242],[125242,125208],[125209,125243],[125243,125209],[125210,125244],[125244,125210],[125211,125245],[125245,125211],[125212,125246],[125246,125212],[125213,125247],[125247,125213],[125214,125248],[125248,125214],[125215,125249],[125249,125215],[125216,125250],[125250,125216],[125217,125251],[125251,125217]])),y(m,"C",[[0,31,1],[127,159,1],[173,888,715],[889,896,7],[897,899,1],[907,909,2],[930,1328,398],[1367,1368,1],[1419,1420,1],[1424,1480,56],[1481,1487,1],[1515,1518,1],[1525,1541,1],[1564,1757,193],[1806,1807,1],[1867,1868,1],[1970,1983,1],[2043,2044,1],[2094,2095,1],[2111,2140,29],[2141,2143,2],[2155,2159,1],[2191,2199,1],[2274,2436,162],[2445,2446,1],[2449,2450,1],[2473,2481,8],[2483,2485,1],[2490,2491,1],[2501,2502,1],[2505,2506,1],[2511,2518,1],[2520,2523,1],[2526,2532,6],[2533,2559,26],[2560,2564,4],[2571,2574,1],[2577,2578,1],[2601,2609,8],[2612,2618,3],[2619,2621,2],[2627,2630,1],[2633,2634,1],[2638,2640,1],[2642,2648,1],[2653,2655,2],[2656,2661,1],[2679,2688,1],[2692,2702,10],[2706,2729,23],[2737,2740,3],[2746,2747,1],[2758,2766,4],[2767,2769,2],[2770,2783,1],[2788,2789,1],[2802,2808,1],[2816,2820,4],[2829,2830,1],[2833,2834,1],[2857,2865,8],[2868,2874,6],[2875,2885,10],[2886,2889,3],[2890,2894,4],[2895,2900,1],[2904,2907,1],[2910,2916,6],[2917,2936,19],[2937,2945,1],[2948,2955,7],[2956,2957,1],[2961,2966,5],[2967,2968,1],[2971,2973,2],[2976,2978,1],[2981,2983,1],[2987,2989,1],[3002,3005,1],[3011,3013,1],[3017,3022,5],[3023,3025,2],[3026,3030,1],[3032,3045,1],[3067,3071,1],[3085,3089,4],[3113,3130,17],[3131,3141,10],[3145,3150,5],[3151,3156,1],[3159,3163,4],[3164,3166,2],[3167,3172,5],[3173,3184,11],[3185,3190,1],[3213,3217,4],[3241,3252,11],[3258,3259,1],[3269,3273,4],[3278,3284,1],[3287,3292,1],[3295,3300,5],[3301,3312,11],[3316,3327,1],[3341,3345,4],[3397,3401,4],[3408,3411,1],[3428,3429,1],[3456,3460,4],[3479,3481,1],[3506,3516,10],[3518,3519,1],[3527,3529,1],[3531,3534,1],[3541,3543,2],[3552,3557,1],[3568,3569,1],[3573,3584,1],[3643,3646,1],[3676,3712,1],[3715,3717,2],[3723,3748,25],[3750,3774,24],[3775,3781,6],[3783,3791,8],[3802,3803,1],[3808,3839,1],[3912,3949,37],[3950,3952,1],[3992,4029,37],[4045,4059,14],[4060,4095,1],[4294,4296,2],[4297,4300,1],[4302,4303,1],[4681,4686,5],[4687,4695,8],[4697,4702,5],[4703,4745,42],[4750,4751,1],[4785,4790,5],[4791,4799,8],[4801,4806,5],[4807,4823,16],[4881,4886,5],[4887,4955,68],[4956,4989,33],[4990,4991,1],[5018,5023,1],[5110,5111,1],[5118,5119,1],[5789,5791,1],[5881,5887,1],[5910,5918,1],[5943,5951,1],[5972,5983,1],[5997,6001,4],[6004,6015,1],[6110,6111,1],[6122,6127,1],[6138,6143,1],[6158,6170,12],[6171,6175,1],[6265,6271,1],[6315,6319,1],[6390,6399,1],[6431,6444,13],[6445,6447,1],[6460,6463,1],[6465,6467,1],[6510,6511,1],[6517,6527,1],[6572,6575,1],[6602,6607,1],[6619,6621,1],[6684,6685,1],[6751,6781,30],[6782,6794,12],[6795,6799,1],[6810,6815,1],[6830,6831,1],[6863,6911,1],[6989,6991,1],[7039,7156,117],[7157,7163,1],[7224,7226,1],[7242,7244,1],[7305,7311,1],[7355,7356,1],[7368,7375,1],[7419,7423,1],[7958,7959,1],[7966,7967,1],[8006,8007,1],[8014,8015,1],[8024,8030,2],[8062,8063,1],[8117,8133,16],[8148,8149,1],[8156,8176,20],[8177,8181,4],[8191,8203,12],[8204,8207,1],[8234,8238,1],[8288,8303,1],[8306,8307,1],[8335,8349,14],[8350,8351,1],[8385,8399,1],[8433,8447,1],[8588,8591,1],[9255,9279,1],[9291,9311,1],[11124,11125,1],[11158,11508,350],[11509,11512,1],[11558,11560,2],[11561,11564,1],[11566,11567,1],[11624,11630,1],[11633,11646,1],[11671,11679,1],[11687,11743,8],[11870,11903,1],[11930,12020,90],[12021,12031,1],[12246,12271,1],[12352,12439,87],[12440,12544,104],[12545,12548,1],[12592,12687,95],[12772,12782,1],[12831,42125,29294],[42126,42127,1],[42183,42191,1],[42540,42559,1],[42744,42751,1],[42955,42959,1],[42962,42964,2],[42970,42993,1],[43053,43055,1],[43066,43071,1],[43128,43135,1],[43206,43213,1],[43226,43231,1],[43348,43358,1],[43389,43391,1],[43470,43482,12],[43483,43485,1],[43519,43575,56],[43576,43583,1],[43598,43599,1],[43610,43611,1],[43715,43738,1],[43767,43776,1],[43783,43784,1],[43791,43792,1],[43799,43807,1],[43815,43823,8],[43884,43887,1],[44014,44015,1],[44026,44031,1],[55204,55215,1],[55239,55242,1],[55292,63743,1],[64110,64111,1],[64218,64255,1],[64263,64274,1],[64280,64284,1],[64311,64317,6],[64319,64325,3],[64451,64466,1],[64912,64913,1],[64968,64974,1],[64976,65007,1],[65050,65055,1],[65107,65127,20],[65132,65135,1],[65141,65277,136],[65278,65280,1],[65471,65473,1],[65480,65481,1],[65488,65489,1],[65496,65497,1],[65501,65503,1],[65511,65519,8],[65520,65531,1],[65534,65535,1],[65548,65575,27],[65595,65598,3],[65614,65615,1],[65630,65663,1],[65787,65791,1],[65795,65798,1],[65844,65846,1],[65935,65949,14],[65950,65951,1],[65953,65999,1],[66046,66175,1],[66205,66207,1],[66257,66271,1],[66300,66303,1],[66340,66348,1],[66379,66383,1],[66427,66431,1],[66462,66500,38],[66501,66503,1],[66518,66559,1],[66718,66719,1],[66730,66735,1],[66772,66775,1],[66812,66815,1],[66856,66863,1],[66916,66926,1],[66939,66955,16],[66963,66966,3],[66978,66994,16],[67002,67005,3],[67006,67071,1],[67383,67391,1],[67414,67423,1],[67432,67455,1],[67462,67505,43],[67515,67583,1],[67590,67591,1],[67593,67638,45],[67641,67643,1],[67645,67646,1],[67670,67743,73],[67744,67750,1],[67760,67807,1],[67827,67830,3],[67831,67834,1],[67868,67870,1],[67898,67902,1],[67904,67967,1],[68024,68027,1],[68048,68049,1],[68100,68103,3],[68104,68107,1],[68116,68120,4],[68150,68151,1],[68155,68158,1],[68169,68175,1],[68185,68191,1],[68256,68287,1],[68327,68330,1],[68343,68351,1],[68406,68408,1],[68438,68439,1],[68467,68471,1],[68498,68504,1],[68509,68520,1],[68528,68607,1],[68681,68735,1],[68787,68799,1],[68851,68857,1],[68904,68911,1],[68922,69215,1],[69247,69290,43],[69294,69295,1],[69298,69372,1],[69416,69423,1],[69466,69487,1],[69514,69551,1],[69580,69599,1],[69623,69631,1],[69710,69713,1],[69750,69758,1],[69821,69827,6],[69828,69839,1],[69865,69871,1],[69882,69887,1],[69941,69960,19],[69961,69967,1],[70007,70015,1],[70112,70133,21],[70134,70143,1],[70162,70210,48],[70211,70271,1],[70279,70281,2],[70286,70302,16],[70314,70319,1],[70379,70383,1],[70394,70399,1],[70404,70413,9],[70414,70417,3],[70418,70441,23],[70449,70452,3],[70458,70469,11],[70470,70473,3],[70474,70478,4],[70479,70481,2],[70482,70486,1],[70488,70492,1],[70500,70501,1],[70509,70511,1],[70517,70655,1],[70748,70754,6],[70755,70783,1],[70856,70863,1],[70874,71039,1],[71094,71095,1],[71134,71167,1],[71237,71247,1],[71258,71263,1],[71277,71295,1],[71354,71359,1],[71370,71423,1],[71451,71452,1],[71468,71471,1],[71495,71679,1],[71740,71839,1],[71923,71934,1],[71943,71944,1],[71946,71947,1],[71956,71959,3],[71990,71993,3],[71994,72007,13],[72008,72015,1],[72026,72095,1],[72104,72105,1],[72152,72153,1],[72165,72191,1],[72264,72271,1],[72355,72367,1],[72441,72447,1],[72458,72703,1],[72713,72759,46],[72774,72783,1],[72813,72815,1],[72848,72849,1],[72872,72887,15],[72888,72959,1],[72967,72970,3],[73015,73017,1],[73019,73022,3],[73032,73039,1],[73050,73055,1],[73062,73065,3],[73103,73106,3],[73113,73119,1],[73130,73439,1],[73465,73471,1],[73489,73531,42],[73532,73533,1],[73562,73647,1],[73649,73663,1],[73714,73726,1],[74650,74751,1],[74863,74869,6],[74870,74879,1],[75076,77711,1],[77811,77823,1],[78896,78911,1],[78934,82943,1],[83527,92159,1],[92729,92735,1],[92767,92778,11],[92779,92781,1],[92863,92874,11],[92875,92879,1],[92910,92911,1],[92918,92927,1],[92998,93007,1],[93018,93026,8],[93048,93052,1],[93072,93759,1],[93851,93951,1],[94027,94030,1],[94088,94094,1],[94112,94175,1],[94181,94191,1],[94194,94207,1],[100344,100351,1],[101590,101631,1],[101641,110575,1],[110580,110588,8],[110591,110883,292],[110884,110897,1],[110899,110927,1],[110931,110932,1],[110934,110947,1],[110952,110959,1],[111356,113663,1],[113771,113775,1],[113789,113791,1],[113801,113807,1],[113818,113819,1],[113824,118527,1],[118574,118575,1],[118599,118607,1],[118724,118783,1],[119030,119039,1],[119079,119080,1],[119155,119162,1],[119275,119295,1],[119366,119487,1],[119508,119519,1],[119540,119551,1],[119639,119647,1],[119673,119807,1],[119893,119965,72],[119968,119969,1],[119971,119972,1],[119975,119976,1],[119981,119994,13],[119996,120004,8],[120070,120075,5],[120076,120085,9],[120093,120122,29],[120127,120133,6],[120135,120137,1],[120145,120486,341],[120487,120780,293],[120781,121484,703],[121485,121498,1],[121504,121520,16],[121521,122623,1],[122655,122660,1],[122667,122879,1],[122887,122905,18],[122906,122914,8],[122917,122923,6],[122924,122927,1],[122990,123022,1],[123024,123135,1],[123181,123183,1],[123198,123199,1],[123210,123213,1],[123216,123535,1],[123567,123583,1],[123642,123646,1],[123648,124111,1],[124154,124895,1],[124903,124908,5],[124911,124927,16],[125125,125126,1],[125143,125183,1],[125260,125263,1],[125274,125277,1],[125280,126064,1],[126133,126208,1],[126270,126463,1],[126468,126496,28],[126499,126501,2],[126502,126504,2],[126515,126520,5],[126522,126524,2],[126525,126529,1],[126531,126534,1],[126536,126540,2],[126544,126547,3],[126549,126550,1],[126552,126560,2],[126563,126565,2],[126566,126571,5],[126579,126589,5],[126591,126602,11],[126620,126624,1],[126628,126634,6],[126652,126703,1],[126706,126975,1],[127020,127023,1],[127124,127135,1],[127151,127152,1],[127168,127184,16],[127222,127231,1],[127406,127461,1],[127491,127503,1],[127548,127551,1],[127561,127567,1],[127570,127583,1],[127590,127743,1],[128728,128731,1],[128749,128751,1],[128765,128767,1],[128887,128890,1],[128986,128991,1],[129004,129007,1],[129009,129023,1],[129036,129039,1],[129096,129103,1],[129114,129119,1],[129160,129167,1],[129198,129199,1],[129202,129279,1],[129620,129631,1],[129646,129647,1],[129661,129663,1],[129673,129679,1],[129726,129734,8],[129735,129741,1],[129756,129759,1],[129769,129775,1],[129785,129791,1],[129939,129995,56],[129996,130031,1],[130042,131071,1],[173792,173823,1],[177978,177983,1],[178206,178207,1],[183970,183983,1],[191457,191471,1],[192094,194559,1],[195102,196607,1],[201547,201551,1],[205744,917759,1],[918e3,1114111,1]]),y(m,"Cc",[[0,31,1],[127,159,1]]),y(m,"Cf",[[173,1536,1363],[1537,1541,1],[1564,1757,193],[1807,2192,385],[2193,2274,81],[6158,8203,2045],[8204,8207,1],[8234,8238,1],[8288,8292,1],[8294,8303,1],[65279,65529,250],[65530,65531,1],[69821,69837,16],[78896,78911,1],[113824,113827,1],[119155,119162,1],[917505,917536,31],[917537,917631,1]]),y(m,"Co",[[57344,63743,1],[983040,1048573,1],[1048576,1114109,1]]),y(m,"Cs",[[55296,57343,1]]),y(m,"L",[[65,90,1],[97,122,1],[170,181,11],[186,192,6],[193,214,1],[216,246,1],[248,705,1],[710,721,1],[736,740,1],[748,750,2],[880,884,1],[886,887,1],[890,893,1],[895,902,7],[904,906,1],[908,910,2],[911,929,1],[931,1013,1],[1015,1153,1],[1162,1327,1],[1329,1366,1],[1369,1376,7],[1377,1416,1],[1488,1514,1],[1519,1522,1],[1568,1610,1],[1646,1647,1],[1649,1747,1],[1749,1765,16],[1766,1774,8],[1775,1786,11],[1787,1788,1],[1791,1808,17],[1810,1839,1],[1869,1957,1],[1969,1994,25],[1995,2026,1],[2036,2037,1],[2042,2048,6],[2049,2069,1],[2074,2084,10],[2088,2112,24],[2113,2136,1],[2144,2154,1],[2160,2183,1],[2185,2190,1],[2208,2249,1],[2308,2361,1],[2365,2384,19],[2392,2401,1],[2417,2432,1],[2437,2444,1],[2447,2448,1],[2451,2472,1],[2474,2480,1],[2482,2486,4],[2487,2489,1],[2493,2510,17],[2524,2525,1],[2527,2529,1],[2544,2545,1],[2556,2565,9],[2566,2570,1],[2575,2576,1],[2579,2600,1],[2602,2608,1],[2610,2611,1],[2613,2614,1],[2616,2617,1],[2649,2652,1],[2654,2674,20],[2675,2676,1],[2693,2701,1],[2703,2705,1],[2707,2728,1],[2730,2736,1],[2738,2739,1],[2741,2745,1],[2749,2768,19],[2784,2785,1],[2809,2821,12],[2822,2828,1],[2831,2832,1],[2835,2856,1],[2858,2864,1],[2866,2867,1],[2869,2873,1],[2877,2908,31],[2909,2911,2],[2912,2913,1],[2929,2947,18],[2949,2954,1],[2958,2960,1],[2962,2965,1],[2969,2970,1],[2972,2974,2],[2975,2979,4],[2980,2984,4],[2985,2986,1],[2990,3001,1],[3024,3077,53],[3078,3084,1],[3086,3088,1],[3090,3112,1],[3114,3129,1],[3133,3160,27],[3161,3162,1],[3165,3168,3],[3169,3200,31],[3205,3212,1],[3214,3216,1],[3218,3240,1],[3242,3251,1],[3253,3257,1],[3261,3293,32],[3294,3296,2],[3297,3313,16],[3314,3332,18],[3333,3340,1],[3342,3344,1],[3346,3386,1],[3389,3406,17],[3412,3414,1],[3423,3425,1],[3450,3455,1],[3461,3478,1],[3482,3505,1],[3507,3515,1],[3517,3520,3],[3521,3526,1],[3585,3632,1],[3634,3635,1],[3648,3654,1],[3713,3714,1],[3716,3718,2],[3719,3722,1],[3724,3747,1],[3749,3751,2],[3752,3760,1],[3762,3763,1],[3773,3776,3],[3777,3780,1],[3782,3804,22],[3805,3807,1],[3840,3904,64],[3905,3911,1],[3913,3948,1],[3976,3980,1],[4096,4138,1],[4159,4176,17],[4177,4181,1],[4186,4189,1],[4193,4197,4],[4198,4206,8],[4207,4208,1],[4213,4225,1],[4238,4256,18],[4257,4293,1],[4295,4301,6],[4304,4346,1],[4348,4680,1],[4682,4685,1],[4688,4694,1],[4696,4698,2],[4699,4701,1],[4704,4744,1],[4746,4749,1],[4752,4784,1],[4786,4789,1],[4792,4798,1],[4800,4802,2],[4803,4805,1],[4808,4822,1],[4824,4880,1],[4882,4885,1],[4888,4954,1],[4992,5007,1],[5024,5109,1],[5112,5117,1],[5121,5740,1],[5743,5759,1],[5761,5786,1],[5792,5866,1],[5873,5880,1],[5888,5905,1],[5919,5937,1],[5952,5969,1],[5984,5996,1],[5998,6e3,1],[6016,6067,1],[6103,6108,5],[6176,6264,1],[6272,6276,1],[6279,6312,1],[6314,6320,6],[6321,6389,1],[6400,6430,1],[6480,6509,1],[6512,6516,1],[6528,6571,1],[6576,6601,1],[6656,6678,1],[6688,6740,1],[6823,6917,94],[6918,6963,1],[6981,6988,1],[7043,7072,1],[7086,7087,1],[7098,7141,1],[7168,7203,1],[7245,7247,1],[7258,7293,1],[7296,7304,1],[7312,7354,1],[7357,7359,1],[7401,7404,1],[7406,7411,1],[7413,7414,1],[7418,7424,6],[7425,7615,1],[7680,7957,1],[7960,7965,1],[7968,8005,1],[8008,8013,1],[8016,8023,1],[8025,8031,2],[8032,8061,1],[8064,8116,1],[8118,8124,1],[8126,8130,4],[8131,8132,1],[8134,8140,1],[8144,8147,1],[8150,8155,1],[8160,8172,1],[8178,8180,1],[8182,8188,1],[8305,8319,14],[8336,8348,1],[8450,8455,5],[8458,8467,1],[8469,8473,4],[8474,8477,1],[8484,8490,2],[8491,8493,1],[8495,8505,1],[8508,8511,1],[8517,8521,1],[8526,8579,53],[8580,11264,2684],[11265,11492,1],[11499,11502,1],[11506,11507,1],[11520,11557,1],[11559,11565,6],[11568,11623,1],[11631,11648,17],[11649,11670,1],[11680,11686,1],[11688,11694,1],[11696,11702,1],[11704,11710,1],[11712,11718,1],[11720,11726,1],[11728,11734,1],[11736,11742,1],[11823,12293,470],[12294,12337,43],[12338,12341,1],[12347,12348,1],[12353,12438,1],[12445,12447,1],[12449,12538,1],[12540,12543,1],[12549,12591,1],[12593,12686,1],[12704,12735,1],[12784,12799,1],[13312,19903,1],[19968,42124,1],[42192,42237,1],[42240,42508,1],[42512,42527,1],[42538,42539,1],[42560,42606,1],[42623,42653,1],[42656,42725,1],[42775,42783,1],[42786,42888,1],[42891,42954,1],[42960,42961,1],[42963,42965,2],[42966,42969,1],[42994,43009,1],[43011,43013,1],[43015,43018,1],[43020,43042,1],[43072,43123,1],[43138,43187,1],[43250,43255,1],[43259,43261,2],[43262,43274,12],[43275,43301,1],[43312,43334,1],[43360,43388,1],[43396,43442,1],[43471,43488,17],[43489,43492,1],[43494,43503,1],[43514,43518,1],[43520,43560,1],[43584,43586,1],[43588,43595,1],[43616,43638,1],[43642,43646,4],[43647,43695,1],[43697,43701,4],[43702,43705,3],[43706,43709,1],[43712,43714,2],[43739,43741,1],[43744,43754,1],[43762,43764,1],[43777,43782,1],[43785,43790,1],[43793,43798,1],[43808,43814,1],[43816,43822,1],[43824,43866,1],[43868,43881,1],[43888,44002,1],[44032,55203,1],[55216,55238,1],[55243,55291,1],[63744,64109,1],[64112,64217,1],[64256,64262,1],[64275,64279,1],[64285,64287,2],[64288,64296,1],[64298,64310,1],[64312,64316,1],[64318,64320,2],[64321,64323,2],[64324,64326,2],[64327,64433,1],[64467,64829,1],[64848,64911,1],[64914,64967,1],[65008,65019,1],[65136,65140,1],[65142,65276,1],[65313,65338,1],[65345,65370,1],[65382,65470,1],[65474,65479,1],[65482,65487,1],[65490,65495,1],[65498,65500,1],[65536,65547,1],[65549,65574,1],[65576,65594,1],[65596,65597,1],[65599,65613,1],[65616,65629,1],[65664,65786,1],[66176,66204,1],[66208,66256,1],[66304,66335,1],[66349,66368,1],[66370,66377,1],[66384,66421,1],[66432,66461,1],[66464,66499,1],[66504,66511,1],[66560,66717,1],[66736,66771,1],[66776,66811,1],[66816,66855,1],[66864,66915,1],[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1],[67072,67382,1],[67392,67413,1],[67424,67431,1],[67456,67461,1],[67463,67504,1],[67506,67514,1],[67584,67589,1],[67592,67594,2],[67595,67637,1],[67639,67640,1],[67644,67647,3],[67648,67669,1],[67680,67702,1],[67712,67742,1],[67808,67826,1],[67828,67829,1],[67840,67861,1],[67872,67897,1],[67968,68023,1],[68030,68031,1],[68096,68112,16],[68113,68115,1],[68117,68119,1],[68121,68149,1],[68192,68220,1],[68224,68252,1],[68288,68295,1],[68297,68324,1],[68352,68405,1],[68416,68437,1],[68448,68466,1],[68480,68497,1],[68608,68680,1],[68736,68786,1],[68800,68850,1],[68864,68899,1],[69248,69289,1],[69296,69297,1],[69376,69404,1],[69415,69424,9],[69425,69445,1],[69488,69505,1],[69552,69572,1],[69600,69622,1],[69635,69687,1],[69745,69746,1],[69749,69763,14],[69764,69807,1],[69840,69864,1],[69891,69926,1],[69956,69959,3],[69968,70002,1],[70006,70019,13],[70020,70066,1],[70081,70084,1],[70106,70108,2],[70144,70161,1],[70163,70187,1],[70207,70208,1],[70272,70278,1],[70280,70282,2],[70283,70285,1],[70287,70301,1],[70303,70312,1],[70320,70366,1],[70405,70412,1],[70415,70416,1],[70419,70440,1],[70442,70448,1],[70450,70451,1],[70453,70457,1],[70461,70480,19],[70493,70497,1],[70656,70708,1],[70727,70730,1],[70751,70753,1],[70784,70831,1],[70852,70853,1],[70855,71040,185],[71041,71086,1],[71128,71131,1],[71168,71215,1],[71236,71296,60],[71297,71338,1],[71352,71424,72],[71425,71450,1],[71488,71494,1],[71680,71723,1],[71840,71903,1],[71935,71942,1],[71945,71948,3],[71949,71955,1],[71957,71958,1],[71960,71983,1],[71999,72001,2],[72096,72103,1],[72106,72144,1],[72161,72163,2],[72192,72203,11],[72204,72242,1],[72250,72272,22],[72284,72329,1],[72349,72368,19],[72369,72440,1],[72704,72712,1],[72714,72750,1],[72768,72818,50],[72819,72847,1],[72960,72966,1],[72968,72969,1],[72971,73008,1],[73030,73056,26],[73057,73061,1],[73063,73064,1],[73066,73097,1],[73112,73440,328],[73441,73458,1],[73474,73476,2],[73477,73488,1],[73490,73523,1],[73648,73728,80],[73729,74649,1],[74880,75075,1],[77712,77808,1],[77824,78895,1],[78913,78918,1],[82944,83526,1],[92160,92728,1],[92736,92766,1],[92784,92862,1],[92880,92909,1],[92928,92975,1],[92992,92995,1],[93027,93047,1],[93053,93071,1],[93760,93823,1],[93952,94026,1],[94032,94099,67],[94100,94111,1],[94176,94177,1],[94179,94208,29],[94209,100343,1],[100352,101589,1],[101632,101640,1],[110576,110579,1],[110581,110587,1],[110589,110590,1],[110592,110882,1],[110898,110928,30],[110929,110930,1],[110933,110948,15],[110949,110951,1],[110960,111355,1],[113664,113770,1],[113776,113788,1],[113792,113800,1],[113808,113817,1],[119808,119892,1],[119894,119964,1],[119966,119967,1],[119970,119973,3],[119974,119977,3],[119978,119980,1],[119982,119993,1],[119995,119997,2],[119998,120003,1],[120005,120069,1],[120071,120074,1],[120077,120084,1],[120086,120092,1],[120094,120121,1],[120123,120126,1],[120128,120132,1],[120134,120138,4],[120139,120144,1],[120146,120485,1],[120488,120512,1],[120514,120538,1],[120540,120570,1],[120572,120596,1],[120598,120628,1],[120630,120654,1],[120656,120686,1],[120688,120712,1],[120714,120744,1],[120746,120770,1],[120772,120779,1],[122624,122654,1],[122661,122666,1],[122928,122989,1],[123136,123180,1],[123191,123197,1],[123214,123536,322],[123537,123565,1],[123584,123627,1],[124112,124139,1],[124896,124902,1],[124904,124907,1],[124909,124910,1],[124912,124926,1],[124928,125124,1],[125184,125251,1],[125259,126464,1205],[126465,126467,1],[126469,126495,1],[126497,126498,1],[126500,126503,3],[126505,126514,1],[126516,126519,1],[126521,126523,2],[126530,126535,5],[126537,126541,2],[126542,126543,1],[126545,126546,1],[126548,126551,3],[126553,126561,2],[126562,126564,2],[126567,126570,1],[126572,126578,1],[126580,126583,1],[126585,126588,1],[126590,126592,2],[126593,126601,1],[126603,126619,1],[126625,126627,1],[126629,126633,1],[126635,126651,1],[131072,173791,1],[173824,177977,1],[177984,178205,1],[178208,183969,1],[183984,191456,1],[191472,192093,1],[194560,195101,1],[196608,201546,1],[201552,205743,1]]),y(m,"foldL",[[837,837,1]]),y(m,"Ll",[[97,122,1],[181,223,42],[224,246,1],[248,255,1],[257,311,2],[312,328,2],[329,375,2],[378,382,2],[383,384,1],[387,389,2],[392,396,4],[397,402,5],[405,409,4],[410,411,1],[414,417,3],[419,421,2],[424,426,2],[427,429,2],[432,436,4],[438,441,3],[442,445,3],[446,447,1],[454,460,3],[462,476,2],[477,495,2],[496,499,3],[501,505,4],[507,563,2],[564,569,1],[572,575,3],[576,578,2],[583,591,2],[592,659,1],[661,687,1],[881,883,2],[887,891,4],[892,893,1],[912,940,28],[941,974,1],[976,977,1],[981,983,1],[985,1007,2],[1008,1011,1],[1013,1019,3],[1020,1072,52],[1073,1119,1],[1121,1153,2],[1163,1215,2],[1218,1230,2],[1231,1327,2],[1376,1416,1],[4304,4346,1],[4349,4351,1],[5112,5117,1],[7296,7304,1],[7424,7467,1],[7531,7543,1],[7545,7578,1],[7681,7829,2],[7830,7837,1],[7839,7935,2],[7936,7943,1],[7952,7957,1],[7968,7975,1],[7984,7991,1],[8e3,8005,1],[8016,8023,1],[8032,8039,1],[8048,8061,1],[8064,8071,1],[8080,8087,1],[8096,8103,1],[8112,8116,1],[8118,8119,1],[8126,8130,4],[8131,8132,1],[8134,8135,1],[8144,8147,1],[8150,8151,1],[8160,8167,1],[8178,8180,1],[8182,8183,1],[8458,8462,4],[8463,8467,4],[8495,8505,5],[8508,8509,1],[8518,8521,1],[8526,8580,54],[11312,11359,1],[11361,11365,4],[11366,11372,2],[11377,11379,2],[11380,11382,2],[11383,11387,1],[11393,11491,2],[11492,11500,8],[11502,11507,5],[11520,11557,1],[11559,11565,6],[42561,42605,2],[42625,42651,2],[42787,42799,2],[42800,42801,1],[42803,42865,2],[42866,42872,1],[42874,42876,2],[42879,42887,2],[42892,42894,2],[42897,42899,2],[42900,42901,1],[42903,42921,2],[42927,42933,6],[42935,42947,2],[42952,42954,2],[42961,42969,2],[42998,43002,4],[43824,43866,1],[43872,43880,1],[43888,43967,1],[64256,64262,1],[64275,64279,1],[65345,65370,1],[66600,66639,1],[66776,66811,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1],[68800,68850,1],[71872,71903,1],[93792,93823,1],[119834,119859,1],[119886,119892,1],[119894,119911,1],[119938,119963,1],[119990,119993,1],[119995,119997,2],[119998,120003,1],[120005,120015,1],[120042,120067,1],[120094,120119,1],[120146,120171,1],[120198,120223,1],[120250,120275,1],[120302,120327,1],[120354,120379,1],[120406,120431,1],[120458,120485,1],[120514,120538,1],[120540,120545,1],[120572,120596,1],[120598,120603,1],[120630,120654,1],[120656,120661,1],[120688,120712,1],[120714,120719,1],[120746,120770,1],[120772,120777,1],[120779,122624,1845],[122625,122633,1],[122635,122654,1],[122661,122666,1],[125218,125251,1]]),y(m,"foldLl",[[65,90,1],[192,214,1],[216,222,1],[256,302,2],[306,310,2],[313,327,2],[330,376,2],[377,381,2],[385,386,1],[388,390,2],[391,393,2],[394,395,1],[398,401,1],[403,404,1],[406,408,1],[412,413,1],[415,416,1],[418,422,2],[423,425,2],[428,430,2],[431,433,2],[434,435,1],[437,439,2],[440,444,4],[452,453,1],[455,456,1],[458,459,1],[461,475,2],[478,494,2],[497,498,1],[500,502,2],[503,504,1],[506,562,2],[570,571,1],[573,574,1],[577,579,2],[580,582,1],[584,590,2],[837,880,43],[882,886,4],[895,902,7],[904,906,1],[908,910,2],[911,913,2],[914,929,1],[931,939,1],[975,984,9],[986,1006,2],[1012,1015,3],[1017,1018,1],[1021,1071,1],[1120,1152,2],[1162,1216,2],[1217,1229,2],[1232,1326,2],[1329,1366,1],[4256,4293,1],[4295,4301,6],[5024,5109,1],[7312,7354,1],[7357,7359,1],[7680,7828,2],[7838,7934,2],[7944,7951,1],[7960,7965,1],[7976,7983,1],[7992,7999,1],[8008,8013,1],[8025,8031,2],[8040,8047,1],[8072,8079,1],[8088,8095,1],[8104,8111,1],[8120,8124,1],[8136,8140,1],[8152,8155,1],[8168,8172,1],[8184,8188,1],[8486,8490,4],[8491,8498,7],[8579,11264,2685],[11265,11311,1],[11360,11362,2],[11363,11364,1],[11367,11373,2],[11374,11376,1],[11378,11381,3],[11390,11392,1],[11394,11490,2],[11499,11501,2],[11506,42560,31054],[42562,42604,2],[42624,42650,2],[42786,42798,2],[42802,42862,2],[42873,42877,2],[42878,42886,2],[42891,42893,2],[42896,42898,2],[42902,42922,2],[42923,42926,1],[42928,42932,1],[42934,42948,2],[42949,42951,1],[42953,42960,7],[42966,42968,2],[42997,65313,22316],[65314,65338,1],[66560,66599,1],[66736,66771,1],[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[68736,68786,1],[71840,71871,1],[93760,93791,1],[125184,125217,1]]),y(m,"Lm",[[688,705,1],[710,721,1],[736,740,1],[748,750,2],[884,890,6],[1369,1600,231],[1765,1766,1],[2036,2037,1],[2042,2074,32],[2084,2088,4],[2249,2417,168],[3654,3782,128],[4348,6103,1755],[6211,6823,612],[7288,7293,1],[7468,7530,1],[7544,7579,35],[7580,7615,1],[8305,8319,14],[8336,8348,1],[11388,11389,1],[11631,11823,192],[12293,12337,44],[12338,12341,1],[12347,12445,98],[12446,12540,94],[12541,12542,1],[40981,42232,1251],[42233,42237,1],[42508,42623,115],[42652,42653,1],[42775,42783,1],[42864,42888,24],[42994,42996,1],[43e3,43001,1],[43471,43494,23],[43632,43741,109],[43763,43764,1],[43868,43871,1],[43881,65392,21511],[65438,65439,1],[67456,67461,1],[67463,67504,1],[67506,67514,1],[92992,92995,1],[94099,94111,1],[94176,94177,1],[94179,110576,16397],[110577,110579,1],[110581,110587,1],[110589,110590,1],[122928,122989,1],[123191,123197,1],[124139,125259,1120]]),y(m,"Lo",[[170,186,16],[443,448,5],[449,451,1],[660,1488,828],[1489,1514,1],[1519,1522,1],[1568,1599,1],[1601,1610,1],[1646,1647,1],[1649,1747,1],[1749,1774,25],[1775,1786,11],[1787,1788,1],[1791,1808,17],[1810,1839,1],[1869,1957,1],[1969,1994,25],[1995,2026,1],[2048,2069,1],[2112,2136,1],[2144,2154,1],[2160,2183,1],[2185,2190,1],[2208,2248,1],[2308,2361,1],[2365,2384,19],[2392,2401,1],[2418,2432,1],[2437,2444,1],[2447,2448,1],[2451,2472,1],[2474,2480,1],[2482,2486,4],[2487,2489,1],[2493,2510,17],[2524,2525,1],[2527,2529,1],[2544,2545,1],[2556,2565,9],[2566,2570,1],[2575,2576,1],[2579,2600,1],[2602,2608,1],[2610,2611,1],[2613,2614,1],[2616,2617,1],[2649,2652,1],[2654,2674,20],[2675,2676,1],[2693,2701,1],[2703,2705,1],[2707,2728,1],[2730,2736,1],[2738,2739,1],[2741,2745,1],[2749,2768,19],[2784,2785,1],[2809,2821,12],[2822,2828,1],[2831,2832,1],[2835,2856,1],[2858,2864,1],[2866,2867,1],[2869,2873,1],[2877,2908,31],[2909,2911,2],[2912,2913,1],[2929,2947,18],[2949,2954,1],[2958,2960,1],[2962,2965,1],[2969,2970,1],[2972,2974,2],[2975,2979,4],[2980,2984,4],[2985,2986,1],[2990,3001,1],[3024,3077,53],[3078,3084,1],[3086,3088,1],[3090,3112,1],[3114,3129,1],[3133,3160,27],[3161,3162,1],[3165,3168,3],[3169,3200,31],[3205,3212,1],[3214,3216,1],[3218,3240,1],[3242,3251,1],[3253,3257,1],[3261,3293,32],[3294,3296,2],[3297,3313,16],[3314,3332,18],[3333,3340,1],[3342,3344,1],[3346,3386,1],[3389,3406,17],[3412,3414,1],[3423,3425,1],[3450,3455,1],[3461,3478,1],[3482,3505,1],[3507,3515,1],[3517,3520,3],[3521,3526,1],[3585,3632,1],[3634,3635,1],[3648,3653,1],[3713,3714,1],[3716,3718,2],[3719,3722,1],[3724,3747,1],[3749,3751,2],[3752,3760,1],[3762,3763,1],[3773,3776,3],[3777,3780,1],[3804,3807,1],[3840,3904,64],[3905,3911,1],[3913,3948,1],[3976,3980,1],[4096,4138,1],[4159,4176,17],[4177,4181,1],[4186,4189,1],[4193,4197,4],[4198,4206,8],[4207,4208,1],[4213,4225,1],[4238,4352,114],[4353,4680,1],[4682,4685,1],[4688,4694,1],[4696,4698,2],[4699,4701,1],[4704,4744,1],[4746,4749,1],[4752,4784,1],[4786,4789,1],[4792,4798,1],[4800,4802,2],[4803,4805,1],[4808,4822,1],[4824,4880,1],[4882,4885,1],[4888,4954,1],[4992,5007,1],[5121,5740,1],[5743,5759,1],[5761,5786,1],[5792,5866,1],[5873,5880,1],[5888,5905,1],[5919,5937,1],[5952,5969,1],[5984,5996,1],[5998,6e3,1],[6016,6067,1],[6108,6176,68],[6177,6210,1],[6212,6264,1],[6272,6276,1],[6279,6312,1],[6314,6320,6],[6321,6389,1],[6400,6430,1],[6480,6509,1],[6512,6516,1],[6528,6571,1],[6576,6601,1],[6656,6678,1],[6688,6740,1],[6917,6963,1],[6981,6988,1],[7043,7072,1],[7086,7087,1],[7098,7141,1],[7168,7203,1],[7245,7247,1],[7258,7287,1],[7401,7404,1],[7406,7411,1],[7413,7414,1],[7418,8501,1083],[8502,8504,1],[11568,11623,1],[11648,11670,1],[11680,11686,1],[11688,11694,1],[11696,11702,1],[11704,11710,1],[11712,11718,1],[11720,11726,1],[11728,11734,1],[11736,11742,1],[12294,12348,54],[12353,12438,1],[12447,12449,2],[12450,12538,1],[12543,12549,6],[12550,12591,1],[12593,12686,1],[12704,12735,1],[12784,12799,1],[13312,19903,1],[19968,40980,1],[40982,42124,1],[42192,42231,1],[42240,42507,1],[42512,42527,1],[42538,42539,1],[42606,42656,50],[42657,42725,1],[42895,42999,104],[43003,43009,1],[43011,43013,1],[43015,43018,1],[43020,43042,1],[43072,43123,1],[43138,43187,1],[43250,43255,1],[43259,43261,2],[43262,43274,12],[43275,43301,1],[43312,43334,1],[43360,43388,1],[43396,43442,1],[43488,43492,1],[43495,43503,1],[43514,43518,1],[43520,43560,1],[43584,43586,1],[43588,43595,1],[43616,43631,1],[43633,43638,1],[43642,43646,4],[43647,43695,1],[43697,43701,4],[43702,43705,3],[43706,43709,1],[43712,43714,2],[43739,43740,1],[43744,43754,1],[43762,43777,15],[43778,43782,1],[43785,43790,1],[43793,43798,1],[43808,43814,1],[43816,43822,1],[43968,44002,1],[44032,55203,1],[55216,55238,1],[55243,55291,1],[63744,64109,1],[64112,64217,1],[64285,64287,2],[64288,64296,1],[64298,64310,1],[64312,64316,1],[64318,64320,2],[64321,64323,2],[64324,64326,2],[64327,64433,1],[64467,64829,1],[64848,64911,1],[64914,64967,1],[65008,65019,1],[65136,65140,1],[65142,65276,1],[65382,65391,1],[65393,65437,1],[65440,65470,1],[65474,65479,1],[65482,65487,1],[65490,65495,1],[65498,65500,1],[65536,65547,1],[65549,65574,1],[65576,65594,1],[65596,65597,1],[65599,65613,1],[65616,65629,1],[65664,65786,1],[66176,66204,1],[66208,66256,1],[66304,66335,1],[66349,66368,1],[66370,66377,1],[66384,66421,1],[66432,66461,1],[66464,66499,1],[66504,66511,1],[66640,66717,1],[66816,66855,1],[66864,66915,1],[67072,67382,1],[67392,67413,1],[67424,67431,1],[67584,67589,1],[67592,67594,2],[67595,67637,1],[67639,67640,1],[67644,67647,3],[67648,67669,1],[67680,67702,1],[67712,67742,1],[67808,67826,1],[67828,67829,1],[67840,67861,1],[67872,67897,1],[67968,68023,1],[68030,68031,1],[68096,68112,16],[68113,68115,1],[68117,68119,1],[68121,68149,1],[68192,68220,1],[68224,68252,1],[68288,68295,1],[68297,68324,1],[68352,68405,1],[68416,68437,1],[68448,68466,1],[68480,68497,1],[68608,68680,1],[68864,68899,1],[69248,69289,1],[69296,69297,1],[69376,69404,1],[69415,69424,9],[69425,69445,1],[69488,69505,1],[69552,69572,1],[69600,69622,1],[69635,69687,1],[69745,69746,1],[69749,69763,14],[69764,69807,1],[69840,69864,1],[69891,69926,1],[69956,69959,3],[69968,70002,1],[70006,70019,13],[70020,70066,1],[70081,70084,1],[70106,70108,2],[70144,70161,1],[70163,70187,1],[70207,70208,1],[70272,70278,1],[70280,70282,2],[70283,70285,1],[70287,70301,1],[70303,70312,1],[70320,70366,1],[70405,70412,1],[70415,70416,1],[70419,70440,1],[70442,70448,1],[70450,70451,1],[70453,70457,1],[70461,70480,19],[70493,70497,1],[70656,70708,1],[70727,70730,1],[70751,70753,1],[70784,70831,1],[70852,70853,1],[70855,71040,185],[71041,71086,1],[71128,71131,1],[71168,71215,1],[71236,71296,60],[71297,71338,1],[71352,71424,72],[71425,71450,1],[71488,71494,1],[71680,71723,1],[71935,71942,1],[71945,71948,3],[71949,71955,1],[71957,71958,1],[71960,71983,1],[71999,72001,2],[72096,72103,1],[72106,72144,1],[72161,72163,2],[72192,72203,11],[72204,72242,1],[72250,72272,22],[72284,72329,1],[72349,72368,19],[72369,72440,1],[72704,72712,1],[72714,72750,1],[72768,72818,50],[72819,72847,1],[72960,72966,1],[72968,72969,1],[72971,73008,1],[73030,73056,26],[73057,73061,1],[73063,73064,1],[73066,73097,1],[73112,73440,328],[73441,73458,1],[73474,73476,2],[73477,73488,1],[73490,73523,1],[73648,73728,80],[73729,74649,1],[74880,75075,1],[77712,77808,1],[77824,78895,1],[78913,78918,1],[82944,83526,1],[92160,92728,1],[92736,92766,1],[92784,92862,1],[92880,92909,1],[92928,92975,1],[93027,93047,1],[93053,93071,1],[93952,94026,1],[94032,94208,176],[94209,100343,1],[100352,101589,1],[101632,101640,1],[110592,110882,1],[110898,110928,30],[110929,110930,1],[110933,110948,15],[110949,110951,1],[110960,111355,1],[113664,113770,1],[113776,113788,1],[113792,113800,1],[113808,113817,1],[122634,123136,502],[123137,123180,1],[123214,123536,322],[123537,123565,1],[123584,123627,1],[124112,124138,1],[124896,124902,1],[124904,124907,1],[124909,124910,1],[124912,124926,1],[124928,125124,1],[126464,126467,1],[126469,126495,1],[126497,126498,1],[126500,126503,3],[126505,126514,1],[126516,126519,1],[126521,126523,2],[126530,126535,5],[126537,126541,2],[126542,126543,1],[126545,126546,1],[126548,126551,3],[126553,126561,2],[126562,126564,2],[126567,126570,1],[126572,126578,1],[126580,126583,1],[126585,126588,1],[126590,126592,2],[126593,126601,1],[126603,126619,1],[126625,126627,1],[126629,126633,1],[126635,126651,1],[131072,173791,1],[173824,177977,1],[177984,178205,1],[178208,183969,1],[183984,191456,1],[191472,192093,1],[194560,195101,1],[196608,201546,1],[201552,205743,1]]),y(m,"Lt",[[453,459,3],[498,8072,7574],[8073,8079,1],[8088,8095,1],[8104,8111,1],[8124,8140,16],[8188,8188,1]]),y(m,"foldLt",[[452,454,2],[455,457,2],[458,460,2],[497,499,2],[8064,8071,1],[8080,8087,1],[8096,8103,1],[8115,8131,16],[8179,8179,1]]),y(m,"Lu",[[65,90,1],[192,214,1],[216,222,1],[256,310,2],[313,327,2],[330,376,2],[377,381,2],[385,386,1],[388,390,2],[391,393,2],[394,395,1],[398,401,1],[403,404,1],[406,408,1],[412,413,1],[415,416,1],[418,422,2],[423,425,2],[428,430,2],[431,433,2],[434,435,1],[437,439,2],[440,444,4],[452,461,3],[463,475,2],[478,494,2],[497,500,3],[502,504,1],[506,562,2],[570,571,1],[573,574,1],[577,579,2],[580,582,1],[584,590,2],[880,882,2],[886,895,9],[902,904,2],[905,906,1],[908,910,2],[911,913,2],[914,929,1],[931,939,1],[975,978,3],[979,980,1],[984,1006,2],[1012,1015,3],[1017,1018,1],[1021,1071,1],[1120,1152,2],[1162,1216,2],[1217,1229,2],[1232,1326,2],[1329,1366,1],[4256,4293,1],[4295,4301,6],[5024,5109,1],[7312,7354,1],[7357,7359,1],[7680,7828,2],[7838,7934,2],[7944,7951,1],[7960,7965,1],[7976,7983,1],[7992,7999,1],[8008,8013,1],[8025,8031,2],[8040,8047,1],[8120,8123,1],[8136,8139,1],[8152,8155,1],[8168,8172,1],[8184,8187,1],[8450,8455,5],[8459,8461,1],[8464,8466,1],[8469,8473,4],[8474,8477,1],[8484,8490,2],[8491,8493,1],[8496,8499,1],[8510,8511,1],[8517,8579,62],[11264,11311,1],[11360,11362,2],[11363,11364,1],[11367,11373,2],[11374,11376,1],[11378,11381,3],[11390,11392,1],[11394,11490,2],[11499,11501,2],[11506,42560,31054],[42562,42604,2],[42624,42650,2],[42786,42798,2],[42802,42862,2],[42873,42877,2],[42878,42886,2],[42891,42893,2],[42896,42898,2],[42902,42922,2],[42923,42926,1],[42928,42932,1],[42934,42948,2],[42949,42951,1],[42953,42960,7],[42966,42968,2],[42997,65313,22316],[65314,65338,1],[66560,66599,1],[66736,66771,1],[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[68736,68786,1],[71840,71871,1],[93760,93791,1],[119808,119833,1],[119860,119885,1],[119912,119937,1],[119964,119966,2],[119967,119973,3],[119974,119977,3],[119978,119980,1],[119982,119989,1],[120016,120041,1],[120068,120069,1],[120071,120074,1],[120077,120084,1],[120086,120092,1],[120120,120121,1],[120123,120126,1],[120128,120132,1],[120134,120138,4],[120139,120144,1],[120172,120197,1],[120224,120249,1],[120276,120301,1],[120328,120353,1],[120380,120405,1],[120432,120457,1],[120488,120512,1],[120546,120570,1],[120604,120628,1],[120662,120686,1],[120720,120744,1],[120778,125184,4406],[125185,125217,1]]),y(m,"Upper",m.Lu),y(m,"foldLu",[[97,122,1],[181,223,42],[224,246,1],[248,255,1],[257,303,2],[307,311,2],[314,328,2],[331,375,2],[378,382,2],[383,384,1],[387,389,2],[392,396,4],[402,405,3],[409,410,1],[414,417,3],[419,421,2],[424,429,5],[432,436,4],[438,441,3],[445,447,2],[453,454,1],[456,457,1],[459,460,1],[462,476,2],[477,495,2],[498,499,1],[501,505,4],[507,543,2],[547,563,2],[572,575,3],[576,578,2],[583,591,2],[592,596,1],[598,599,1],[601,603,2],[604,608,4],[609,613,2],[614,616,2],[617,620,1],[623,625,2],[626,629,3],[637,640,3],[642,643,1],[647,652,1],[658,669,11],[670,837,167],[881,883,2],[887,891,4],[892,893,1],[940,943,1],[945,974,1],[976,977,1],[981,983,1],[985,1007,2],[1008,1011,1],[1013,1019,3],[1072,1119,1],[1121,1153,2],[1163,1215,2],[1218,1230,2],[1231,1327,2],[1377,1414,1],[4304,4346,1],[4349,4351,1],[5112,5117,1],[7296,7304,1],[7545,7549,4],[7566,7681,115],[7683,7829,2],[7835,7841,6],[7843,7935,2],[7936,7943,1],[7952,7957,1],[7968,7975,1],[7984,7991,1],[8e3,8005,1],[8017,8023,2],[8032,8039,1],[8048,8061,1],[8112,8113,1],[8126,8144,18],[8145,8160,15],[8161,8165,4],[8526,8580,54],[11312,11359,1],[11361,11365,4],[11366,11372,2],[11379,11382,3],[11393,11491,2],[11500,11502,2],[11507,11520,13],[11521,11557,1],[11559,11565,6],[42561,42605,2],[42625,42651,2],[42787,42799,2],[42803,42863,2],[42874,42876,2],[42879,42887,2],[42892,42897,5],[42899,42900,1],[42903,42921,2],[42933,42947,2],[42952,42954,2],[42961,42967,6],[42969,42998,29],[43859,43888,29],[43889,43967,1],[65345,65370,1],[66600,66639,1],[66776,66811,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1],[68800,68850,1],[71872,71903,1],[93792,93823,1],[125218,125251,1]]),y(m,"M",[[768,879,1],[1155,1161,1],[1425,1469,1],[1471,1473,2],[1474,1476,2],[1477,1479,2],[1552,1562,1],[1611,1631,1],[1648,1750,102],[1751,1756,1],[1759,1764,1],[1767,1768,1],[1770,1773,1],[1809,1840,31],[1841,1866,1],[1958,1968,1],[2027,2035,1],[2045,2070,25],[2071,2073,1],[2075,2083,1],[2085,2087,1],[2089,2093,1],[2137,2139,1],[2200,2207,1],[2250,2273,1],[2275,2307,1],[2362,2364,1],[2366,2383,1],[2385,2391,1],[2402,2403,1],[2433,2435,1],[2492,2494,2],[2495,2500,1],[2503,2504,1],[2507,2509,1],[2519,2530,11],[2531,2558,27],[2561,2563,1],[2620,2622,2],[2623,2626,1],[2631,2632,1],[2635,2637,1],[2641,2672,31],[2673,2677,4],[2689,2691,1],[2748,2750,2],[2751,2757,1],[2759,2761,1],[2763,2765,1],[2786,2787,1],[2810,2815,1],[2817,2819,1],[2876,2878,2],[2879,2884,1],[2887,2888,1],[2891,2893,1],[2901,2903,1],[2914,2915,1],[2946,3006,60],[3007,3010,1],[3014,3016,1],[3018,3021,1],[3031,3072,41],[3073,3076,1],[3132,3134,2],[3135,3140,1],[3142,3144,1],[3146,3149,1],[3157,3158,1],[3170,3171,1],[3201,3203,1],[3260,3262,2],[3263,3268,1],[3270,3272,1],[3274,3277,1],[3285,3286,1],[3298,3299,1],[3315,3328,13],[3329,3331,1],[3387,3388,1],[3390,3396,1],[3398,3400,1],[3402,3405,1],[3415,3426,11],[3427,3457,30],[3458,3459,1],[3530,3535,5],[3536,3540,1],[3542,3544,2],[3545,3551,1],[3570,3571,1],[3633,3636,3],[3637,3642,1],[3655,3662,1],[3761,3764,3],[3765,3772,1],[3784,3790,1],[3864,3865,1],[3893,3897,2],[3902,3903,1],[3953,3972,1],[3974,3975,1],[3981,3991,1],[3993,4028,1],[4038,4139,101],[4140,4158,1],[4182,4185,1],[4190,4192,1],[4194,4196,1],[4199,4205,1],[4209,4212,1],[4226,4237,1],[4239,4250,11],[4251,4253,1],[4957,4959,1],[5906,5909,1],[5938,5940,1],[5970,5971,1],[6002,6003,1],[6068,6099,1],[6109,6155,46],[6156,6157,1],[6159,6277,118],[6278,6313,35],[6432,6443,1],[6448,6459,1],[6679,6683,1],[6741,6750,1],[6752,6780,1],[6783,6832,49],[6833,6862,1],[6912,6916,1],[6964,6980,1],[7019,7027,1],[7040,7042,1],[7073,7085,1],[7142,7155,1],[7204,7223,1],[7376,7378,1],[7380,7400,1],[7405,7412,7],[7415,7417,1],[7616,7679,1],[8400,8432,1],[11503,11505,1],[11647,11744,97],[11745,11775,1],[12330,12335,1],[12441,12442,1],[42607,42610,1],[42612,42621,1],[42654,42655,1],[42736,42737,1],[43010,43014,4],[43019,43043,24],[43044,43047,1],[43052,43136,84],[43137,43188,51],[43189,43205,1],[43232,43249,1],[43263,43302,39],[43303,43309,1],[43335,43347,1],[43392,43395,1],[43443,43456,1],[43493,43561,68],[43562,43574,1],[43587,43596,9],[43597,43643,46],[43644,43645,1],[43696,43698,2],[43699,43700,1],[43703,43704,1],[43710,43711,1],[43713,43755,42],[43756,43759,1],[43765,43766,1],[44003,44010,1],[44012,44013,1],[64286,65024,738],[65025,65039,1],[65056,65071,1],[66045,66272,227],[66422,66426,1],[68097,68099,1],[68101,68102,1],[68108,68111,1],[68152,68154,1],[68159,68325,166],[68326,68900,574],[68901,68903,1],[69291,69292,1],[69373,69375,1],[69446,69456,1],[69506,69509,1],[69632,69634,1],[69688,69702,1],[69744,69747,3],[69748,69759,11],[69760,69762,1],[69808,69818,1],[69826,69888,62],[69889,69890,1],[69927,69940,1],[69957,69958,1],[70003,70016,13],[70017,70018,1],[70067,70080,1],[70089,70092,1],[70094,70095,1],[70188,70199,1],[70206,70209,3],[70367,70378,1],[70400,70403,1],[70459,70460,1],[70462,70468,1],[70471,70472,1],[70475,70477,1],[70487,70498,11],[70499,70502,3],[70503,70508,1],[70512,70516,1],[70709,70726,1],[70750,70832,82],[70833,70851,1],[71087,71093,1],[71096,71104,1],[71132,71133,1],[71216,71232,1],[71339,71351,1],[71453,71467,1],[71724,71738,1],[71984,71989,1],[71991,71992,1],[71995,71998,1],[72e3,72002,2],[72003,72145,142],[72146,72151,1],[72154,72160,1],[72164,72193,29],[72194,72202,1],[72243,72249,1],[72251,72254,1],[72263,72273,10],[72274,72283,1],[72330,72345,1],[72751,72758,1],[72760,72767,1],[72850,72871,1],[72873,72886,1],[73009,73014,1],[73018,73020,2],[73021,73023,2],[73024,73029,1],[73031,73098,67],[73099,73102,1],[73104,73105,1],[73107,73111,1],[73459,73462,1],[73472,73473,1],[73475,73524,49],[73525,73530,1],[73534,73538,1],[78912,78919,7],[78920,78933,1],[92912,92916,1],[92976,92982,1],[94031,94033,2],[94034,94087,1],[94095,94098,1],[94180,94192,12],[94193,113821,19628],[113822,118528,4706],[118529,118573,1],[118576,118598,1],[119141,119145,1],[119149,119154,1],[119163,119170,1],[119173,119179,1],[119210,119213,1],[119362,119364,1],[121344,121398,1],[121403,121452,1],[121461,121476,15],[121499,121503,1],[121505,121519,1],[122880,122886,1],[122888,122904,1],[122907,122913,1],[122915,122916,1],[122918,122922,1],[123023,123184,161],[123185,123190,1],[123566,123628,62],[123629,123631,1],[124140,124143,1],[125136,125142,1],[125252,125258,1],[917760,917999,1]]),y(m,"foldM",[[921,953,32],[8126,8126,1]]),y(m,"Mc",[[2307,2363,56],[2366,2368,1],[2377,2380,1],[2382,2383,1],[2434,2435,1],[2494,2496,1],[2503,2504,1],[2507,2508,1],[2519,2563,44],[2622,2624,1],[2691,2750,59],[2751,2752,1],[2761,2763,2],[2764,2818,54],[2819,2878,59],[2880,2887,7],[2888,2891,3],[2892,2903,11],[3006,3007,1],[3009,3010,1],[3014,3016,1],[3018,3020,1],[3031,3073,42],[3074,3075,1],[3137,3140,1],[3202,3203,1],[3262,3264,2],[3265,3268,1],[3271,3272,1],[3274,3275,1],[3285,3286,1],[3315,3330,15],[3331,3390,59],[3391,3392,1],[3398,3400,1],[3402,3404,1],[3415,3458,43],[3459,3535,76],[3536,3537,1],[3544,3551,1],[3570,3571,1],[3902,3903,1],[3967,4139,172],[4140,4145,5],[4152,4155,3],[4156,4182,26],[4183,4194,11],[4195,4196,1],[4199,4205,1],[4227,4228,1],[4231,4236,1],[4239,4250,11],[4251,4252,1],[5909,5940,31],[6070,6078,8],[6079,6085,1],[6087,6088,1],[6435,6438,1],[6441,6443,1],[6448,6449,1],[6451,6456,1],[6681,6682,1],[6741,6743,2],[6753,6755,2],[6756,6765,9],[6766,6770,1],[6916,6965,49],[6971,6973,2],[6974,6977,1],[6979,6980,1],[7042,7073,31],[7078,7079,1],[7082,7143,61],[7146,7148,1],[7150,7154,4],[7155,7204,49],[7205,7211,1],[7220,7221,1],[7393,7415,22],[12334,12335,1],[43043,43044,1],[43047,43136,89],[43137,43188,51],[43189,43203,1],[43346,43347,1],[43395,43444,49],[43445,43450,5],[43451,43454,3],[43455,43456,1],[43567,43568,1],[43571,43572,1],[43597,43643,46],[43645,43755,110],[43758,43759,1],[43765,44003,238],[44004,44006,2],[44007,44009,2],[44010,44012,2],[69632,69634,2],[69762,69808,46],[69809,69810,1],[69815,69816,1],[69932,69957,25],[69958,70018,60],[70067,70069,1],[70079,70080,1],[70094,70188,94],[70189,70190,1],[70194,70195,1],[70197,70368,171],[70369,70370,1],[70402,70403,1],[70462,70463,1],[70465,70468,1],[70471,70472,1],[70475,70477,1],[70487,70498,11],[70499,70709,210],[70710,70711,1],[70720,70721,1],[70725,70832,107],[70833,70834,1],[70841,70843,2],[70844,70846,1],[70849,71087,238],[71088,71089,1],[71096,71099,1],[71102,71216,114],[71217,71218,1],[71227,71228,1],[71230,71340,110],[71342,71343,1],[71350,71456,106],[71457,71462,5],[71724,71726,1],[71736,71984,248],[71985,71989,1],[71991,71992,1],[71997,72e3,3],[72002,72145,143],[72146,72147,1],[72156,72159,1],[72164,72249,85],[72279,72280,1],[72343,72751,408],[72766,72873,107],[72881,72884,3],[73098,73102,1],[73107,73108,1],[73110,73461,351],[73462,73475,13],[73524,73525,1],[73534,73535,1],[73537,94033,20496],[94034,94087,1],[94192,94193,1],[119141,119142,1],[119149,119154,1]]),y(m,"Me",[[1160,1161,1],[6846,8413,1567],[8414,8416,1],[8418,8420,1],[42608,42610,1]]),y(m,"Mn",[[768,879,1],[1155,1159,1],[1425,1469,1],[1471,1473,2],[1474,1476,2],[1477,1479,2],[1552,1562,1],[1611,1631,1],[1648,1750,102],[1751,1756,1],[1759,1764,1],[1767,1768,1],[1770,1773,1],[1809,1840,31],[1841,1866,1],[1958,1968,1],[2027,2035,1],[2045,2070,25],[2071,2073,1],[2075,2083,1],[2085,2087,1],[2089,2093,1],[2137,2139,1],[2200,2207,1],[2250,2273,1],[2275,2306,1],[2362,2364,2],[2369,2376,1],[2381,2385,4],[2386,2391,1],[2402,2403,1],[2433,2492,59],[2497,2500,1],[2509,2530,21],[2531,2558,27],[2561,2562,1],[2620,2625,5],[2626,2631,5],[2632,2635,3],[2636,2637,1],[2641,2672,31],[2673,2677,4],[2689,2690,1],[2748,2753,5],[2754,2757,1],[2759,2760,1],[2765,2786,21],[2787,2810,23],[2811,2815,1],[2817,2876,59],[2879,2881,2],[2882,2884,1],[2893,2901,8],[2902,2914,12],[2915,2946,31],[3008,3021,13],[3072,3076,4],[3132,3134,2],[3135,3136,1],[3142,3144,1],[3146,3149,1],[3157,3158,1],[3170,3171,1],[3201,3260,59],[3263,3270,7],[3276,3277,1],[3298,3299,1],[3328,3329,1],[3387,3388,1],[3393,3396,1],[3405,3426,21],[3427,3457,30],[3530,3538,8],[3539,3540,1],[3542,3633,91],[3636,3642,1],[3655,3662,1],[3761,3764,3],[3765,3772,1],[3784,3790,1],[3864,3865,1],[3893,3897,2],[3953,3966,1],[3968,3972,1],[3974,3975,1],[3981,3991,1],[3993,4028,1],[4038,4141,103],[4142,4144,1],[4146,4151,1],[4153,4154,1],[4157,4158,1],[4184,4185,1],[4190,4192,1],[4209,4212,1],[4226,4229,3],[4230,4237,7],[4253,4957,704],[4958,4959,1],[5906,5908,1],[5938,5939,1],[5970,5971,1],[6002,6003,1],[6068,6069,1],[6071,6077,1],[6086,6089,3],[6090,6099,1],[6109,6155,46],[6156,6157,1],[6159,6277,118],[6278,6313,35],[6432,6434,1],[6439,6440,1],[6450,6457,7],[6458,6459,1],[6679,6680,1],[6683,6742,59],[6744,6750,1],[6752,6754,2],[6757,6764,1],[6771,6780,1],[6783,6832,49],[6833,6845,1],[6847,6862,1],[6912,6915,1],[6964,6966,2],[6967,6970,1],[6972,6978,6],[7019,7027,1],[7040,7041,1],[7074,7077,1],[7080,7081,1],[7083,7085,1],[7142,7144,2],[7145,7149,4],[7151,7153,1],[7212,7219,1],[7222,7223,1],[7376,7378,1],[7380,7392,1],[7394,7400,1],[7405,7412,7],[7416,7417,1],[7616,7679,1],[8400,8412,1],[8417,8421,4],[8422,8432,1],[11503,11505,1],[11647,11744,97],[11745,11775,1],[12330,12333,1],[12441,12442,1],[42607,42612,5],[42613,42621,1],[42654,42655,1],[42736,42737,1],[43010,43014,4],[43019,43045,26],[43046,43052,6],[43204,43205,1],[43232,43249,1],[43263,43302,39],[43303,43309,1],[43335,43345,1],[43392,43394,1],[43443,43446,3],[43447,43449,1],[43452,43453,1],[43493,43561,68],[43562,43566,1],[43569,43570,1],[43573,43574,1],[43587,43596,9],[43644,43696,52],[43698,43700,1],[43703,43704,1],[43710,43711,1],[43713,43756,43],[43757,43766,9],[44005,44008,3],[44013,64286,20273],[65024,65039,1],[65056,65071,1],[66045,66272,227],[66422,66426,1],[68097,68099,1],[68101,68102,1],[68108,68111,1],[68152,68154,1],[68159,68325,166],[68326,68900,574],[68901,68903,1],[69291,69292,1],[69373,69375,1],[69446,69456,1],[69506,69509,1],[69633,69688,55],[69689,69702,1],[69744,69747,3],[69748,69759,11],[69760,69761,1],[69811,69814,1],[69817,69818,1],[69826,69888,62],[69889,69890,1],[69927,69931,1],[69933,69940,1],[70003,70016,13],[70017,70070,53],[70071,70078,1],[70089,70092,1],[70095,70191,96],[70192,70193,1],[70196,70198,2],[70199,70206,7],[70209,70367,158],[70371,70378,1],[70400,70401,1],[70459,70460,1],[70464,70502,38],[70503,70508,1],[70512,70516,1],[70712,70719,1],[70722,70724,1],[70726,70750,24],[70835,70840,1],[70842,70847,5],[70848,70850,2],[70851,71090,239],[71091,71093,1],[71100,71101,1],[71103,71104,1],[71132,71133,1],[71219,71226,1],[71229,71231,2],[71232,71339,107],[71341,71344,3],[71345,71349,1],[71351,71453,102],[71454,71455,1],[71458,71461,1],[71463,71467,1],[71727,71735,1],[71737,71738,1],[71995,71996,1],[71998,72003,5],[72148,72151,1],[72154,72155,1],[72160,72193,33],[72194,72202,1],[72243,72248,1],[72251,72254,1],[72263,72273,10],[72274,72278,1],[72281,72283,1],[72330,72342,1],[72344,72345,1],[72752,72758,1],[72760,72765,1],[72767,72850,83],[72851,72871,1],[72874,72880,1],[72882,72883,1],[72885,72886,1],[73009,73014,1],[73018,73020,2],[73021,73023,2],[73024,73029,1],[73031,73104,73],[73105,73109,4],[73111,73459,348],[73460,73472,12],[73473,73526,53],[73527,73530,1],[73536,73538,2],[78912,78919,7],[78920,78933,1],[92912,92916,1],[92976,92982,1],[94031,94095,64],[94096,94098,1],[94180,113821,19641],[113822,118528,4706],[118529,118573,1],[118576,118598,1],[119143,119145,1],[119163,119170,1],[119173,119179,1],[119210,119213,1],[119362,119364,1],[121344,121398,1],[121403,121452,1],[121461,121476,15],[121499,121503,1],[121505,121519,1],[122880,122886,1],[122888,122904,1],[122907,122913,1],[122915,122916,1],[122918,122922,1],[123023,123184,161],[123185,123190,1],[123566,123628,62],[123629,123631,1],[124140,124143,1],[125136,125142,1],[125252,125258,1],[917760,917999,1]]),y(m,"foldMn",[[921,953,32],[8126,8126,1]]),y(m,"N",[[48,57,1],[178,179,1],[185,188,3],[189,190,1],[1632,1641,1],[1776,1785,1],[1984,1993,1],[2406,2415,1],[2534,2543,1],[2548,2553,1],[2662,2671,1],[2790,2799,1],[2918,2927,1],[2930,2935,1],[3046,3058,1],[3174,3183,1],[3192,3198,1],[3302,3311,1],[3416,3422,1],[3430,3448,1],[3558,3567,1],[3664,3673,1],[3792,3801,1],[3872,3891,1],[4160,4169,1],[4240,4249,1],[4969,4988,1],[5870,5872,1],[6112,6121,1],[6128,6137,1],[6160,6169,1],[6470,6479,1],[6608,6618,1],[6784,6793,1],[6800,6809,1],[6992,7001,1],[7088,7097,1],[7232,7241,1],[7248,7257,1],[8304,8308,4],[8309,8313,1],[8320,8329,1],[8528,8578,1],[8581,8585,1],[9312,9371,1],[9450,9471,1],[10102,10131,1],[11517,12295,778],[12321,12329,1],[12344,12346,1],[12690,12693,1],[12832,12841,1],[12872,12879,1],[12881,12895,1],[12928,12937,1],[12977,12991,1],[42528,42537,1],[42726,42735,1],[43056,43061,1],[43216,43225,1],[43264,43273,1],[43472,43481,1],[43504,43513,1],[43600,43609,1],[44016,44025,1],[65296,65305,1],[65799,65843,1],[65856,65912,1],[65930,65931,1],[66273,66299,1],[66336,66339,1],[66369,66378,9],[66513,66517,1],[66720,66729,1],[67672,67679,1],[67705,67711,1],[67751,67759,1],[67835,67839,1],[67862,67867,1],[68028,68029,1],[68032,68047,1],[68050,68095,1],[68160,68168,1],[68221,68222,1],[68253,68255,1],[68331,68335,1],[68440,68447,1],[68472,68479,1],[68521,68527,1],[68858,68863,1],[68912,68921,1],[69216,69246,1],[69405,69414,1],[69457,69460,1],[69573,69579,1],[69714,69743,1],[69872,69881,1],[69942,69951,1],[70096,70105,1],[70113,70132,1],[70384,70393,1],[70736,70745,1],[70864,70873,1],[71248,71257,1],[71360,71369,1],[71472,71483,1],[71904,71922,1],[72016,72025,1],[72784,72812,1],[73040,73049,1],[73120,73129,1],[73552,73561,1],[73664,73684,1],[74752,74862,1],[92768,92777,1],[92864,92873,1],[93008,93017,1],[93019,93025,1],[93824,93846,1],[119488,119507,1],[119520,119539,1],[119648,119672,1],[120782,120831,1],[123200,123209,1],[123632,123641,1],[124144,124153,1],[125127,125135,1],[125264,125273,1],[126065,126123,1],[126125,126127,1],[126129,126132,1],[126209,126253,1],[126255,126269,1],[127232,127244,1],[130032,130041,1]]),y(m,"Nd",[[48,57,1],[1632,1641,1],[1776,1785,1],[1984,1993,1],[2406,2415,1],[2534,2543,1],[2662,2671,1],[2790,2799,1],[2918,2927,1],[3046,3055,1],[3174,3183,1],[3302,3311,1],[3430,3439,1],[3558,3567,1],[3664,3673,1],[3792,3801,1],[3872,3881,1],[4160,4169,1],[4240,4249,1],[6112,6121,1],[6160,6169,1],[6470,6479,1],[6608,6617,1],[6784,6793,1],[6800,6809,1],[6992,7001,1],[7088,7097,1],[7232,7241,1],[7248,7257,1],[42528,42537,1],[43216,43225,1],[43264,43273,1],[43472,43481,1],[43504,43513,1],[43600,43609,1],[44016,44025,1],[65296,65305,1],[66720,66729,1],[68912,68921,1],[69734,69743,1],[69872,69881,1],[69942,69951,1],[70096,70105,1],[70384,70393,1],[70736,70745,1],[70864,70873,1],[71248,71257,1],[71360,71369,1],[71472,71481,1],[71904,71913,1],[72016,72025,1],[72784,72793,1],[73040,73049,1],[73120,73129,1],[73552,73561,1],[92768,92777,1],[92864,92873,1],[93008,93017,1],[120782,120831,1],[123200,123209,1],[123632,123641,1],[124144,124153,1],[125264,125273,1],[130032,130041,1]]),y(m,"Nl",[[5870,5872,1],[8544,8578,1],[8581,8584,1],[12295,12321,26],[12322,12329,1],[12344,12346,1],[42726,42735,1],[65856,65908,1],[66369,66378,9],[66513,66517,1],[74752,74862,1]]),y(m,"No",[[178,179,1],[185,188,3],[189,190,1],[2548,2553,1],[2930,2935,1],[3056,3058,1],[3192,3198,1],[3416,3422,1],[3440,3448,1],[3882,3891,1],[4969,4988,1],[6128,6137,1],[6618,8304,1686],[8308,8313,1],[8320,8329,1],[8528,8543,1],[8585,9312,727],[9313,9371,1],[9450,9471,1],[10102,10131,1],[11517,12690,1173],[12691,12693,1],[12832,12841,1],[12872,12879,1],[12881,12895,1],[12928,12937,1],[12977,12991,1],[43056,43061,1],[65799,65843,1],[65909,65912,1],[65930,65931,1],[66273,66299,1],[66336,66339,1],[67672,67679,1],[67705,67711,1],[67751,67759,1],[67835,67839,1],[67862,67867,1],[68028,68029,1],[68032,68047,1],[68050,68095,1],[68160,68168,1],[68221,68222,1],[68253,68255,1],[68331,68335,1],[68440,68447,1],[68472,68479,1],[68521,68527,1],[68858,68863,1],[69216,69246,1],[69405,69414,1],[69457,69460,1],[69573,69579,1],[69714,69733,1],[70113,70132,1],[71482,71483,1],[71914,71922,1],[72794,72812,1],[73664,73684,1],[93019,93025,1],[93824,93846,1],[119488,119507,1],[119520,119539,1],[119648,119672,1],[125127,125135,1],[126065,126123,1],[126125,126127,1],[126129,126132,1],[126209,126253,1],[126255,126269,1],[127232,127244,1]]),y(m,"P",[[33,35,1],[37,42,1],[44,47,1],[58,59,1],[63,64,1],[91,93,1],[95,123,28],[125,161,36],[167,171,4],[182,183,1],[187,191,4],[894,903,9],[1370,1375,1],[1417,1418,1],[1470,1472,2],[1475,1478,3],[1523,1524,1],[1545,1546,1],[1548,1549,1],[1563,1565,2],[1566,1567,1],[1642,1645,1],[1748,1792,44],[1793,1805,1],[2039,2041,1],[2096,2110,1],[2142,2404,262],[2405,2416,11],[2557,2678,121],[2800,3191,391],[3204,3572,368],[3663,3674,11],[3675,3844,169],[3845,3858,1],[3860,3898,38],[3899,3901,1],[3973,4048,75],[4049,4052,1],[4057,4058,1],[4170,4175,1],[4347,4960,613],[4961,4968,1],[5120,5742,622],[5787,5788,1],[5867,5869,1],[5941,5942,1],[6100,6102,1],[6104,6106,1],[6144,6154,1],[6468,6469,1],[6686,6687,1],[6816,6822,1],[6824,6829,1],[7002,7008,1],[7037,7038,1],[7164,7167,1],[7227,7231,1],[7294,7295,1],[7360,7367,1],[7379,8208,829],[8209,8231,1],[8240,8259,1],[8261,8273,1],[8275,8286,1],[8317,8318,1],[8333,8334,1],[8968,8971,1],[9001,9002,1],[10088,10101,1],[10181,10182,1],[10214,10223,1],[10627,10648,1],[10712,10715,1],[10748,10749,1],[11513,11516,1],[11518,11519,1],[11632,11776,144],[11777,11822,1],[11824,11855,1],[11858,11869,1],[12289,12291,1],[12296,12305,1],[12308,12319,1],[12336,12349,13],[12448,12539,91],[42238,42239,1],[42509,42511,1],[42611,42622,11],[42738,42743,1],[43124,43127,1],[43214,43215,1],[43256,43258,1],[43260,43310,50],[43311,43359,48],[43457,43469,1],[43486,43487,1],[43612,43615,1],[43742,43743,1],[43760,43761,1],[44011,64830,20819],[64831,65040,209],[65041,65049,1],[65072,65106,1],[65108,65121,1],[65123,65128,5],[65130,65131,1],[65281,65283,1],[65285,65290,1],[65292,65295,1],[65306,65307,1],[65311,65312,1],[65339,65341,1],[65343,65371,28],[65373,65375,2],[65376,65381,1],[65792,65794,1],[66463,66512,49],[66927,67671,744],[67871,67903,32],[68176,68184,1],[68223,68336,113],[68337,68342,1],[68409,68415,1],[68505,68508,1],[69293,69461,168],[69462,69465,1],[69510,69513,1],[69703,69709,1],[69819,69820,1],[69822,69825,1],[69952,69955,1],[70004,70005,1],[70085,70088,1],[70093,70107,14],[70109,70111,1],[70200,70205,1],[70313,70731,418],[70732,70735,1],[70746,70747,1],[70749,70854,105],[71105,71127,1],[71233,71235,1],[71264,71276,1],[71353,71484,131],[71485,71486,1],[71739,72004,265],[72005,72006,1],[72162,72255,93],[72256,72262,1],[72346,72348,1],[72350,72354,1],[72448,72457,1],[72769,72773,1],[72816,72817,1],[73463,73464,1],[73539,73551,1],[73727,74864,1137],[74865,74868,1],[77809,77810,1],[92782,92783,1],[92917,92983,66],[92984,92987,1],[92996,93847,851],[93848,93850,1],[94178,113823,19645],[121479,121483,1],[125278,125279,1]]),y(m,"Pc",[[95,8255,8160],[8256,8276,20],[65075,65076,1],[65101,65103,1],[65343,65343,1]]),y(m,"Pd",[[45,1418,1373],[1470,5120,3650],[6150,8208,2058],[8209,8213,1],[11799,11802,3],[11834,11835,1],[11840,11869,29],[12316,12336,20],[12448,65073,52625],[65074,65112,38],[65123,65293,170],[69293,69293,1]]),y(m,"Pe",[[41,93,52],[125,3899,3774],[3901,5788,1887],[8262,8318,56],[8334,8969,635],[8971,9002,31],[10089,10101,2],[10182,10215,33],[10217,10223,2],[10628,10648,2],[10713,10715,2],[10749,11811,1062],[11813,11817,2],[11862,11868,2],[12297,12305,2],[12309,12315,2],[12318,12319,1],[64830,65048,218],[65078,65092,2],[65096,65114,18],[65116,65118,2],[65289,65341,52],[65373,65379,3]]),y(m,"Pf",[[187,8217,8030],[8221,8250,29],[11779,11781,2],[11786,11789,3],[11805,11809,4]]),y(m,"Pi",[[171,8216,8045],[8219,8220,1],[8223,8249,26],[11778,11780,2],[11785,11788,3],[11804,11808,4]]),y(m,"Po",[[33,35,1],[37,39,1],[42,46,2],[47,58,11],[59,63,4],[64,92,28],[161,167,6],[182,183,1],[191,894,703],[903,1370,467],[1371,1375,1],[1417,1472,55],[1475,1478,3],[1523,1524,1],[1545,1546,1],[1548,1549,1],[1563,1565,2],[1566,1567,1],[1642,1645,1],[1748,1792,44],[1793,1805,1],[2039,2041,1],[2096,2110,1],[2142,2404,262],[2405,2416,11],[2557,2678,121],[2800,3191,391],[3204,3572,368],[3663,3674,11],[3675,3844,169],[3845,3858,1],[3860,3973,113],[4048,4052,1],[4057,4058,1],[4170,4175,1],[4347,4960,613],[4961,4968,1],[5742,5867,125],[5868,5869,1],[5941,5942,1],[6100,6102,1],[6104,6106,1],[6144,6149,1],[6151,6154,1],[6468,6469,1],[6686,6687,1],[6816,6822,1],[6824,6829,1],[7002,7008,1],[7037,7038,1],[7164,7167,1],[7227,7231,1],[7294,7295,1],[7360,7367,1],[7379,8214,835],[8215,8224,9],[8225,8231,1],[8240,8248,1],[8251,8254,1],[8257,8259,1],[8263,8273,1],[8275,8277,2],[8278,8286,1],[11513,11516,1],[11518,11519,1],[11632,11776,144],[11777,11782,5],[11783,11784,1],[11787,11790,3],[11791,11798,1],[11800,11801,1],[11803,11806,3],[11807,11818,11],[11819,11822,1],[11824,11833,1],[11836,11839,1],[11841,11843,2],[11844,11855,1],[11858,11860,1],[12289,12291,1],[12349,12539,190],[42238,42239,1],[42509,42511,1],[42611,42622,11],[42738,42743,1],[43124,43127,1],[43214,43215,1],[43256,43258,1],[43260,43310,50],[43311,43359,48],[43457,43469,1],[43486,43487,1],[43612,43615,1],[43742,43743,1],[43760,43761,1],[44011,65040,21029],[65041,65046,1],[65049,65072,23],[65093,65094,1],[65097,65100,1],[65104,65106,1],[65108,65111,1],[65119,65121,1],[65128,65130,2],[65131,65281,150],[65282,65283,1],[65285,65287,1],[65290,65294,2],[65295,65306,11],[65307,65311,4],[65312,65340,28],[65377,65380,3],[65381,65792,411],[65793,65794,1],[66463,66512,49],[66927,67671,744],[67871,67903,32],[68176,68184,1],[68223,68336,113],[68337,68342,1],[68409,68415,1],[68505,68508,1],[69461,69465,1],[69510,69513,1],[69703,69709,1],[69819,69820,1],[69822,69825,1],[69952,69955,1],[70004,70005,1],[70085,70088,1],[70093,70107,14],[70109,70111,1],[70200,70205,1],[70313,70731,418],[70732,70735,1],[70746,70747,1],[70749,70854,105],[71105,71127,1],[71233,71235,1],[71264,71276,1],[71353,71484,131],[71485,71486,1],[71739,72004,265],[72005,72006,1],[72162,72255,93],[72256,72262,1],[72346,72348,1],[72350,72354,1],[72448,72457,1],[72769,72773,1],[72816,72817,1],[73463,73464,1],[73539,73551,1],[73727,74864,1137],[74865,74868,1],[77809,77810,1],[92782,92783,1],[92917,92983,66],[92984,92987,1],[92996,93847,851],[93848,93850,1],[94178,113823,19645],[121479,121483,1],[125278,125279,1]]),y(m,"Ps",[[40,91,51],[123,3898,3775],[3900,5787,1887],[8218,8222,4],[8261,8317,56],[8333,8968,635],[8970,9001,31],[10088,10100,2],[10181,10214,33],[10216,10222,2],[10627,10647,2],[10712,10714,2],[10748,11810,1062],[11812,11816,2],[11842,11861,19],[11863,11867,2],[12296,12304,2],[12308,12314,2],[12317,64831,52514],[65047,65077,30],[65079,65091,2],[65095,65113,18],[65115,65117,2],[65288,65339,51],[65371,65375,4],[65378,65378,1]]),y(m,"S",[[36,43,7],[60,62,1],[94,96,2],[124,126,2],[162,166,1],[168,169,1],[172,174,2],[175,177,1],[180,184,4],[215,247,32],[706,709,1],[722,735,1],[741,747,1],[749,751,2],[752,767,1],[885,900,15],[901,1014,113],[1154,1421,267],[1422,1423,1],[1542,1544,1],[1547,1550,3],[1551,1758,207],[1769,1789,20],[1790,2038,248],[2046,2047,1],[2184,2546,362],[2547,2554,7],[2555,2801,246],[2928,3059,131],[3060,3066,1],[3199,3407,208],[3449,3647,198],[3841,3843,1],[3859,3861,2],[3862,3863,1],[3866,3871,1],[3892,3896,2],[4030,4037,1],[4039,4044,1],[4046,4047,1],[4053,4056,1],[4254,4255,1],[5008,5017,1],[5741,6107,366],[6464,6622,158],[6623,6655,1],[7009,7018,1],[7028,7036,1],[8125,8127,2],[8128,8129,1],[8141,8143,1],[8157,8159,1],[8173,8175,1],[8189,8190,1],[8260,8274,14],[8314,8316,1],[8330,8332,1],[8352,8384,1],[8448,8449,1],[8451,8454,1],[8456,8457,1],[8468,8470,2],[8471,8472,1],[8478,8483,1],[8485,8489,2],[8494,8506,12],[8507,8512,5],[8513,8516,1],[8522,8525,1],[8527,8586,59],[8587,8592,5],[8593,8967,1],[8972,9e3,1],[9003,9254,1],[9280,9290,1],[9372,9449,1],[9472,10087,1],[10132,10180,1],[10183,10213,1],[10224,10626,1],[10649,10711,1],[10716,10747,1],[10750,11123,1],[11126,11157,1],[11159,11263,1],[11493,11498,1],[11856,11857,1],[11904,11929,1],[11931,12019,1],[12032,12245,1],[12272,12287,1],[12292,12306,14],[12307,12320,13],[12342,12343,1],[12350,12351,1],[12443,12444,1],[12688,12689,1],[12694,12703,1],[12736,12771,1],[12783,12800,17],[12801,12830,1],[12842,12871,1],[12880,12896,16],[12897,12927,1],[12938,12976,1],[12992,13311,1],[19904,19967,1],[42128,42182,1],[42752,42774,1],[42784,42785,1],[42889,42890,1],[43048,43051,1],[43062,43065,1],[43639,43641,1],[43867,43882,15],[43883,64297,20414],[64434,64450,1],[64832,64847,1],[64975,65020,45],[65021,65023,1],[65122,65124,2],[65125,65126,1],[65129,65284,155],[65291,65308,17],[65309,65310,1],[65342,65344,2],[65372,65374,2],[65504,65510,1],[65512,65518,1],[65532,65533,1],[65847,65855,1],[65913,65929,1],[65932,65934,1],[65936,65948,1],[65952,66e3,48],[66001,66044,1],[67703,67704,1],[68296,71487,3191],[73685,73713,1],[92988,92991,1],[92997,113820,20823],[118608,118723,1],[118784,119029,1],[119040,119078,1],[119081,119140,1],[119146,119148,1],[119171,119172,1],[119180,119209,1],[119214,119274,1],[119296,119361,1],[119365,119552,187],[119553,119638,1],[120513,120539,26],[120571,120597,26],[120629,120655,26],[120687,120713,26],[120745,120771,26],[120832,121343,1],[121399,121402,1],[121453,121460,1],[121462,121475,1],[121477,121478,1],[123215,123647,432],[126124,126128,4],[126254,126704,450],[126705,126976,271],[126977,127019,1],[127024,127123,1],[127136,127150,1],[127153,127167,1],[127169,127183,1],[127185,127221,1],[127245,127405,1],[127462,127490,1],[127504,127547,1],[127552,127560,1],[127568,127569,1],[127584,127589,1],[127744,128727,1],[128732,128748,1],[128752,128764,1],[128768,128886,1],[128891,128985,1],[128992,129003,1],[129008,129024,16],[129025,129035,1],[129040,129095,1],[129104,129113,1],[129120,129159,1],[129168,129197,1],[129200,129201,1],[129280,129619,1],[129632,129645,1],[129648,129660,1],[129664,129672,1],[129680,129725,1],[129727,129733,1],[129742,129755,1],[129760,129768,1],[129776,129784,1],[129792,129938,1],[129940,129994,1]]),y(m,"Sc",[[36,162,126],[163,165,1],[1423,1547,124],[2046,2047,1],[2546,2547,1],[2555,2801,246],[3065,3647,582],[6107,8352,2245],[8353,8384,1],[43064,65020,21956],[65129,65284,155],[65504,65505,1],[65509,65510,1],[73693,73696,1],[123647,126128,2481]]),y(m,"Sk",[[94,96,2],[168,175,7],[180,184,4],[706,709,1],[722,735,1],[741,747,1],[749,751,2],[752,767,1],[885,900,15],[901,2184,1283],[8125,8127,2],[8128,8129,1],[8141,8143,1],[8157,8159,1],[8173,8175,1],[8189,8190,1],[12443,12444,1],[42752,42774,1],[42784,42785,1],[42889,42890,1],[43867,43882,15],[43883,64434,20551],[64435,64450,1],[65342,65344,2],[65507,127995,62488],[127996,127999,1]]),y(m,"Sm",[[43,60,17],[61,62,1],[124,126,2],[172,177,5],[215,247,32],[1014,1542,528],[1543,1544,1],[8260,8274,14],[8314,8316,1],[8330,8332,1],[8472,8512,40],[8513,8516,1],[8523,8592,69],[8593,8596,1],[8602,8603,1],[8608,8614,3],[8622,8654,32],[8655,8658,3],[8660,8692,32],[8693,8959,1],[8992,8993,1],[9084,9115,31],[9116,9139,1],[9180,9185,1],[9655,9665,10],[9720,9727,1],[9839,10176,337],[10177,10180,1],[10183,10213,1],[10224,10239,1],[10496,10626,1],[10649,10711,1],[10716,10747,1],[10750,11007,1],[11056,11076,1],[11079,11084,1],[64297,65122,825],[65124,65126,1],[65291,65308,17],[65309,65310,1],[65372,65374,2],[65506,65513,7],[65514,65516,1],[120513,120539,26],[120571,120597,26],[120629,120655,26],[120687,120713,26],[120745,120771,26],[126704,126705,1]]),y(m,"So",[[166,169,3],[174,176,2],[1154,1421,267],[1422,1550,128],[1551,1758,207],[1769,1789,20],[1790,2038,248],[2554,2928,374],[3059,3064,1],[3066,3199,133],[3407,3449,42],[3841,3843,1],[3859,3861,2],[3862,3863,1],[3866,3871,1],[3892,3896,2],[4030,4037,1],[4039,4044,1],[4046,4047,1],[4053,4056,1],[4254,4255,1],[5008,5017,1],[5741,6464,723],[6622,6655,1],[7009,7018,1],[7028,7036,1],[8448,8449,1],[8451,8454,1],[8456,8457,1],[8468,8470,2],[8471,8478,7],[8479,8483,1],[8485,8489,2],[8494,8506,12],[8507,8522,15],[8524,8525,1],[8527,8586,59],[8587,8597,10],[8598,8601,1],[8604,8607,1],[8609,8610,1],[8612,8613,1],[8615,8621,1],[8623,8653,1],[8656,8657,1],[8659,8661,2],[8662,8691,1],[8960,8967,1],[8972,8991,1],[8994,9e3,1],[9003,9083,1],[9085,9114,1],[9140,9179,1],[9186,9254,1],[9280,9290,1],[9372,9449,1],[9472,9654,1],[9656,9664,1],[9666,9719,1],[9728,9838,1],[9840,10087,1],[10132,10175,1],[10240,10495,1],[11008,11055,1],[11077,11078,1],[11085,11123,1],[11126,11157,1],[11159,11263,1],[11493,11498,1],[11856,11857,1],[11904,11929,1],[11931,12019,1],[12032,12245,1],[12272,12287,1],[12292,12306,14],[12307,12320,13],[12342,12343,1],[12350,12351,1],[12688,12689,1],[12694,12703,1],[12736,12771,1],[12783,12800,17],[12801,12830,1],[12842,12871,1],[12880,12896,16],[12897,12927,1],[12938,12976,1],[12992,13311,1],[19904,19967,1],[42128,42182,1],[43048,43051,1],[43062,43063,1],[43065,43639,574],[43640,43641,1],[64832,64847,1],[64975,65021,46],[65022,65023,1],[65508,65512,4],[65517,65518,1],[65532,65533,1],[65847,65855,1],[65913,65929,1],[65932,65934,1],[65936,65948,1],[65952,66e3,48],[66001,66044,1],[67703,67704,1],[68296,71487,3191],[73685,73692,1],[73697,73713,1],[92988,92991,1],[92997,113820,20823],[118608,118723,1],[118784,119029,1],[119040,119078,1],[119081,119140,1],[119146,119148,1],[119171,119172,1],[119180,119209,1],[119214,119274,1],[119296,119361,1],[119365,119552,187],[119553,119638,1],[120832,121343,1],[121399,121402,1],[121453,121460,1],[121462,121475,1],[121477,121478,1],[123215,126124,2909],[126254,126976,722],[126977,127019,1],[127024,127123,1],[127136,127150,1],[127153,127167,1],[127169,127183,1],[127185,127221,1],[127245,127405,1],[127462,127490,1],[127504,127547,1],[127552,127560,1],[127568,127569,1],[127584,127589,1],[127744,127994,1],[128e3,128727,1],[128732,128748,1],[128752,128764,1],[128768,128886,1],[128891,128985,1],[128992,129003,1],[129008,129024,16],[129025,129035,1],[129040,129095,1],[129104,129113,1],[129120,129159,1],[129168,129197,1],[129200,129201,1],[129280,129619,1],[129632,129645,1],[129648,129660,1],[129664,129672,1],[129680,129725,1],[129727,129733,1],[129742,129755,1],[129760,129768,1],[129776,129784,1],[129792,129938,1],[129940,129994,1]]),y(m,"Z",[[32,160,128],[5760,8192,2432],[8193,8202,1],[8232,8233,1],[8239,8287,48],[12288,12288,1]]),y(m,"Zl",[[8232,8232,1]]),y(m,"Zp",[[8233,8233,1]]),y(m,"Zs",[[32,160,128],[5760,8192,2432],[8193,8202,1],[8239,8287,48],[12288,12288,1]]),y(m,"Adlam",[[125184,125259,1],[125264,125273,1],[125278,125279,1]]),y(m,"Ahom",[[71424,71450,1],[71453,71467,1],[71472,71494,1]]),y(m,"Anatolian_Hieroglyphs",[[82944,83526,1]]),y(m,"Arabic",[[1536,1540,1],[1542,1547,1],[1549,1562,1],[1564,1566,1],[1568,1599,1],[1601,1610,1],[1622,1647,1],[1649,1756,1],[1758,1791,1],[1872,1919,1],[2160,2190,1],[2192,2193,1],[2200,2273,1],[2275,2303,1],[64336,64450,1],[64467,64829,1],[64832,64911,1],[64914,64967,1],[64975,65008,33],[65009,65023,1],[65136,65140,1],[65142,65276,1],[69216,69246,1],[69373,69375,1],[126464,126467,1],[126469,126495,1],[126497,126498,1],[126500,126503,3],[126505,126514,1],[126516,126519,1],[126521,126523,2],[126530,126535,5],[126537,126541,2],[126542,126543,1],[126545,126546,1],[126548,126551,3],[126553,126561,2],[126562,126564,2],[126567,126570,1],[126572,126578,1],[126580,126583,1],[126585,126588,1],[126590,126592,2],[126593,126601,1],[126603,126619,1],[126625,126627,1],[126629,126633,1],[126635,126651,1],[126704,126705,1]]),y(m,"Armenian",[[1329,1366,1],[1369,1418,1],[1421,1423,1],[64275,64279,1]]),y(m,"Avestan",[[68352,68405,1],[68409,68415,1]]),y(m,"Balinese",[[6912,6988,1],[6992,7038,1]]),y(m,"Bamum",[[42656,42743,1],[92160,92728,1]]),y(m,"Bassa_Vah",[[92880,92909,1],[92912,92917,1]]),y(m,"Batak",[[7104,7155,1],[7164,7167,1]]),y(m,"Bengali",[[2432,2435,1],[2437,2444,1],[2447,2448,1],[2451,2472,1],[2474,2480,1],[2482,2486,4],[2487,2489,1],[2492,2500,1],[2503,2504,1],[2507,2510,1],[2519,2524,5],[2525,2527,2],[2528,2531,1],[2534,2558,1]]),y(m,"Bhaiksuki",[[72704,72712,1],[72714,72758,1],[72760,72773,1],[72784,72812,1]]),y(m,"Bopomofo",[[746,747,1],[12549,12591,1],[12704,12735,1]]),y(m,"Brahmi",[[69632,69709,1],[69714,69749,1],[69759,69759,1]]),y(m,"Braille",[[10240,10495,1]]),y(m,"Buginese",[[6656,6683,1],[6686,6687,1]]),y(m,"Buhid",[[5952,5971,1]]),y(m,"Canadian_Aboriginal",[[5120,5759,1],[6320,6389,1],[72368,72383,1]]),y(m,"Carian",[[66208,66256,1]]),y(m,"Caucasian_Albanian",[[66864,66915,1],[66927,66927,1]]),y(m,"Chakma",[[69888,69940,1],[69942,69959,1]]),y(m,"Cham",[[43520,43574,1],[43584,43597,1],[43600,43609,1],[43612,43615,1]]),y(m,"Cherokee",[[5024,5109,1],[5112,5117,1],[43888,43967,1]]),y(m,"Chorasmian",[[69552,69579,1]]),y(m,"Common",[[0,64,1],[91,96,1],[123,169,1],[171,185,1],[187,191,1],[215,247,32],[697,735,1],[741,745,1],[748,767,1],[884,894,10],[901,903,2],[1541,1548,7],[1563,1567,4],[1600,1757,157],[2274,2404,130],[2405,3647,1242],[4053,4056,1],[4347,5867,1520],[5868,5869,1],[5941,5942,1],[6146,6147,1],[6149,7379,1230],[7393,7401,8],[7402,7404,1],[7406,7411,1],[7413,7415,1],[7418,8192,774],[8193,8203,1],[8206,8292,1],[8294,8304,1],[8308,8318,1],[8320,8334,1],[8352,8384,1],[8448,8485,1],[8487,8489,1],[8492,8497,1],[8499,8525,1],[8527,8543,1],[8585,8587,1],[8592,9254,1],[9280,9290,1],[9312,10239,1],[10496,11123,1],[11126,11157,1],[11159,11263,1],[11776,11869,1],[12272,12292,1],[12294,12296,2],[12297,12320,1],[12336,12343,1],[12348,12351,1],[12443,12444,1],[12448,12539,91],[12540,12688,148],[12689,12703,1],[12736,12771,1],[12783,12832,49],[12833,12895,1],[12927,13007,1],[13055,13144,89],[13145,13311,1],[19904,19967,1],[42752,42785,1],[42888,42890,1],[43056,43065,1],[43310,43471,161],[43867,43882,15],[43883,64830,20947],[64831,65040,209],[65041,65049,1],[65072,65106,1],[65108,65126,1],[65128,65131,1],[65279,65281,2],[65282,65312,1],[65339,65344,1],[65371,65381,1],[65392,65438,46],[65439,65504,65],[65505,65510,1],[65512,65518,1],[65529,65533,1],[65792,65794,1],[65799,65843,1],[65847,65855,1],[65936,65948,1],[66e3,66044,1],[66273,66299,1],[113824,113827,1],[118608,118723,1],[118784,119029,1],[119040,119078,1],[119081,119142,1],[119146,119162,1],[119171,119172,1],[119180,119209,1],[119214,119274,1],[119488,119507,1],[119520,119539,1],[119552,119638,1],[119648,119672,1],[119808,119892,1],[119894,119964,1],[119966,119967,1],[119970,119973,3],[119974,119977,3],[119978,119980,1],[119982,119993,1],[119995,119997,2],[119998,120003,1],[120005,120069,1],[120071,120074,1],[120077,120084,1],[120086,120092,1],[120094,120121,1],[120123,120126,1],[120128,120132,1],[120134,120138,4],[120139,120144,1],[120146,120485,1],[120488,120779,1],[120782,120831,1],[126065,126132,1],[126209,126269,1],[126976,127019,1],[127024,127123,1],[127136,127150,1],[127153,127167,1],[127169,127183,1],[127185,127221,1],[127232,127405,1],[127462,127487,1],[127489,127490,1],[127504,127547,1],[127552,127560,1],[127568,127569,1],[127584,127589,1],[127744,128727,1],[128732,128748,1],[128752,128764,1],[128768,128886,1],[128891,128985,1],[128992,129003,1],[129008,129024,16],[129025,129035,1],[129040,129095,1],[129104,129113,1],[129120,129159,1],[129168,129197,1],[129200,129201,1],[129280,129619,1],[129632,129645,1],[129648,129660,1],[129664,129672,1],[129680,129725,1],[129727,129733,1],[129742,129755,1],[129760,129768,1],[129776,129784,1],[129792,129938,1],[129940,129994,1],[130032,130041,1],[917505,917536,31],[917537,917631,1]]),y(m,"foldCommon",[[924,956,32]]),y(m,"Coptic",[[994,1007,1],[11392,11507,1],[11513,11519,1]]),y(m,"Cuneiform",[[73728,74649,1],[74752,74862,1],[74864,74868,1],[74880,75075,1]]),y(m,"Cypriot",[[67584,67589,1],[67592,67594,2],[67595,67637,1],[67639,67640,1],[67644,67647,3]]),y(m,"Cypro_Minoan",[[77712,77810,1]]),y(m,"Cyrillic",[[1024,1156,1],[1159,1327,1],[7296,7304,1],[7467,7544,77],[11744,11775,1],[42560,42655,1],[65070,65071,1],[122928,122989,1],[123023,123023,1]]),y(m,"Deseret",[[66560,66639,1]]),y(m,"Devanagari",[[2304,2384,1],[2389,2403,1],[2406,2431,1],[43232,43263,1],[72448,72457,1]]),y(m,"Dives_Akuru",[[71936,71942,1],[71945,71948,3],[71949,71955,1],[71957,71958,1],[71960,71989,1],[71991,71992,1],[71995,72006,1],[72016,72025,1]]),y(m,"Dogra",[[71680,71739,1]]),y(m,"Duployan",[[113664,113770,1],[113776,113788,1],[113792,113800,1],[113808,113817,1],[113820,113823,1]]),y(m,"Egyptian_Hieroglyphs",[[77824,78933,1]]),y(m,"Elbasan",[[66816,66855,1]]),y(m,"Elymaic",[[69600,69622,1]]),y(m,"Ethiopic",[[4608,4680,1],[4682,4685,1],[4688,4694,1],[4696,4698,2],[4699,4701,1],[4704,4744,1],[4746,4749,1],[4752,4784,1],[4786,4789,1],[4792,4798,1],[4800,4802,2],[4803,4805,1],[4808,4822,1],[4824,4880,1],[4882,4885,1],[4888,4954,1],[4957,4988,1],[4992,5017,1],[11648,11670,1],[11680,11686,1],[11688,11694,1],[11696,11702,1],[11704,11710,1],[11712,11718,1],[11720,11726,1],[11728,11734,1],[11736,11742,1],[43777,43782,1],[43785,43790,1],[43793,43798,1],[43808,43814,1],[43816,43822,1],[124896,124902,1],[124904,124907,1],[124909,124910,1],[124912,124926,1]]),y(m,"Georgian",[[4256,4293,1],[4295,4301,6],[4304,4346,1],[4348,4351,1],[7312,7354,1],[7357,7359,1],[11520,11557,1],[11559,11565,6]]),y(m,"Glagolitic",[[11264,11359,1],[122880,122886,1],[122888,122904,1],[122907,122913,1],[122915,122916,1],[122918,122922,1]]),y(m,"Gothic",[[66352,66378,1]]),y(m,"Grantha",[[70400,70403,1],[70405,70412,1],[70415,70416,1],[70419,70440,1],[70442,70448,1],[70450,70451,1],[70453,70457,1],[70460,70468,1],[70471,70472,1],[70475,70477,1],[70480,70487,7],[70493,70499,1],[70502,70508,1],[70512,70516,1]]),y(m,"Greek",[[880,883,1],[885,887,1],[890,893,1],[895,900,5],[902,904,2],[905,906,1],[908,910,2],[911,929,1],[931,993,1],[1008,1023,1],[7462,7466,1],[7517,7521,1],[7526,7530,1],[7615,7936,321],[7937,7957,1],[7960,7965,1],[7968,8005,1],[8008,8013,1],[8016,8023,1],[8025,8031,2],[8032,8061,1],[8064,8116,1],[8118,8132,1],[8134,8147,1],[8150,8155,1],[8157,8175,1],[8178,8180,1],[8182,8190,1],[8486,43877,35391],[65856,65934,1],[65952,119296,53344],[119297,119365,1]]),y(m,"foldGreek",[[181,837,656]]),y(m,"Gujarati",[[2689,2691,1],[2693,2701,1],[2703,2705,1],[2707,2728,1],[2730,2736,1],[2738,2739,1],[2741,2745,1],[2748,2757,1],[2759,2761,1],[2763,2765,1],[2768,2784,16],[2785,2787,1],[2790,2801,1],[2809,2815,1]]),y(m,"Gunjala_Gondi",[[73056,73061,1],[73063,73064,1],[73066,73102,1],[73104,73105,1],[73107,73112,1],[73120,73129,1]]),y(m,"Gurmukhi",[[2561,2563,1],[2565,2570,1],[2575,2576,1],[2579,2600,1],[2602,2608,1],[2610,2611,1],[2613,2614,1],[2616,2617,1],[2620,2622,2],[2623,2626,1],[2631,2632,1],[2635,2637,1],[2641,2649,8],[2650,2652,1],[2654,2662,8],[2663,2678,1]]),y(m,"Han",[[11904,11929,1],[11931,12019,1],[12032,12245,1],[12293,12295,2],[12321,12329,1],[12344,12347,1],[13312,19903,1],[19968,40959,1],[63744,64109,1],[64112,64217,1],[94178,94179,1],[94192,94193,1],[131072,173791,1],[173824,177977,1],[177984,178205,1],[178208,183969,1],[183984,191456,1],[191472,192093,1],[194560,195101,1],[196608,201546,1],[201552,205743,1]]),y(m,"Hangul",[[4352,4607,1],[12334,12335,1],[12593,12686,1],[12800,12830,1],[12896,12926,1],[43360,43388,1],[44032,55203,1],[55216,55238,1],[55243,55291,1],[65440,65470,1],[65474,65479,1],[65482,65487,1],[65490,65495,1],[65498,65500,1]]),y(m,"Hanifi_Rohingya",[[68864,68903,1],[68912,68921,1]]),y(m,"Hanunoo",[[5920,5940,1]]),y(m,"Hatran",[[67808,67826,1],[67828,67829,1],[67835,67839,1]]),y(m,"Hebrew",[[1425,1479,1],[1488,1514,1],[1519,1524,1],[64285,64310,1],[64312,64316,1],[64318,64320,2],[64321,64323,2],[64324,64326,2],[64327,64335,1]]),y(m,"Hiragana",[[12353,12438,1],[12445,12447,1],[110593,110879,1],[110898,110928,30],[110929,110930,1],[127488,127488,1]]),y(m,"Imperial_Aramaic",[[67648,67669,1],[67671,67679,1]]),y(m,"Inherited",[[768,879,1],[1157,1158,1],[1611,1621,1],[1648,2385,737],[2386,2388,1],[6832,6862,1],[7376,7378,1],[7380,7392,1],[7394,7400,1],[7405,7412,7],[7416,7417,1],[7616,7679,1],[8204,8205,1],[8400,8432,1],[12330,12333,1],[12441,12442,1],[65024,65039,1],[65056,65069,1],[66045,66272,227],[70459,118528,48069],[118529,118573,1],[118576,118598,1],[119143,119145,1],[119163,119170,1],[119173,119179,1],[119210,119213,1],[917760,917999,1]]),y(m,"foldInherited",[[921,953,32],[8126,8126,1]]),y(m,"Inscriptional_Pahlavi",[[68448,68466,1],[68472,68479,1]]),y(m,"Inscriptional_Parthian",[[68416,68437,1],[68440,68447,1]]),y(m,"Javanese",[[43392,43469,1],[43472,43481,1],[43486,43487,1]]),y(m,"Kaithi",[[69760,69826,1],[69837,69837,1]]),y(m,"Kannada",[[3200,3212,1],[3214,3216,1],[3218,3240,1],[3242,3251,1],[3253,3257,1],[3260,3268,1],[3270,3272,1],[3274,3277,1],[3285,3286,1],[3293,3294,1],[3296,3299,1],[3302,3311,1],[3313,3315,1]]),y(m,"Katakana",[[12449,12538,1],[12541,12543,1],[12784,12799,1],[13008,13054,1],[13056,13143,1],[65382,65391,1],[65393,65437,1],[110576,110579,1],[110581,110587,1],[110589,110590,1],[110592,110880,288],[110881,110882,1],[110933,110948,15],[110949,110951,1]]),y(m,"Kawi",[[73472,73488,1],[73490,73530,1],[73534,73561,1]]),y(m,"Kayah_Li",[[43264,43309,1],[43311,43311,1]]),y(m,"Kharoshthi",[[68096,68099,1],[68101,68102,1],[68108,68115,1],[68117,68119,1],[68121,68149,1],[68152,68154,1],[68159,68168,1],[68176,68184,1]]),y(m,"Khitan_Small_Script",[[94180,101120,6940],[101121,101589,1]]),y(m,"Khmer",[[6016,6109,1],[6112,6121,1],[6128,6137,1],[6624,6655,1]]),y(m,"Khojki",[[70144,70161,1],[70163,70209,1]]),y(m,"Khudawadi",[[70320,70378,1],[70384,70393,1]]),y(m,"Lao",[[3713,3714,1],[3716,3718,2],[3719,3722,1],[3724,3747,1],[3749,3751,2],[3752,3773,1],[3776,3780,1],[3782,3784,2],[3785,3790,1],[3792,3801,1],[3804,3807,1]]),y(m,"Latin",[[65,90,1],[97,122,1],[170,186,16],[192,214,1],[216,246,1],[248,696,1],[736,740,1],[7424,7461,1],[7468,7516,1],[7522,7525,1],[7531,7543,1],[7545,7614,1],[7680,7935,1],[8305,8319,14],[8336,8348,1],[8490,8491,1],[8498,8526,28],[8544,8584,1],[11360,11391,1],[42786,42887,1],[42891,42954,1],[42960,42961,1],[42963,42965,2],[42966,42969,1],[42994,43007,1],[43824,43866,1],[43868,43876,1],[43878,43881,1],[64256,64262,1],[65313,65338,1],[65345,65370,1],[67456,67461,1],[67463,67504,1],[67506,67514,1],[122624,122654,1],[122661,122666,1]]),y(m,"Lepcha",[[7168,7223,1],[7227,7241,1],[7245,7247,1]]),y(m,"Limbu",[[6400,6430,1],[6432,6443,1],[6448,6459,1],[6464,6468,4],[6469,6479,1]]),y(m,"Linear_A",[[67072,67382,1],[67392,67413,1],[67424,67431,1]]),y(m,"Linear_B",[[65536,65547,1],[65549,65574,1],[65576,65594,1],[65596,65597,1],[65599,65613,1],[65616,65629,1],[65664,65786,1]]),y(m,"Lisu",[[42192,42239,1],[73648,73648,1]]),y(m,"Lycian",[[66176,66204,1]]),y(m,"Lydian",[[67872,67897,1],[67903,67903,1]]),y(m,"Mahajani",[[69968,70006,1]]),y(m,"Makasar",[[73440,73464,1]]),y(m,"Malayalam",[[3328,3340,1],[3342,3344,1],[3346,3396,1],[3398,3400,1],[3402,3407,1],[3412,3427,1],[3430,3455,1]]),y(m,"Mandaic",[[2112,2139,1],[2142,2142,1]]),y(m,"Manichaean",[[68288,68326,1],[68331,68342,1]]),y(m,"Marchen",[[72816,72847,1],[72850,72871,1],[72873,72886,1]]),y(m,"Masaram_Gondi",[[72960,72966,1],[72968,72969,1],[72971,73014,1],[73018,73020,2],[73021,73023,2],[73024,73031,1],[73040,73049,1]]),y(m,"Medefaidrin",[[93760,93850,1]]),y(m,"Meetei_Mayek",[[43744,43766,1],[43968,44013,1],[44016,44025,1]]),y(m,"Mende_Kikakui",[[124928,125124,1],[125127,125142,1]]),y(m,"Meroitic_Cursive",[[68e3,68023,1],[68028,68047,1],[68050,68095,1]]),y(m,"Meroitic_Hieroglyphs",[[67968,67999,1]]),y(m,"Miao",[[93952,94026,1],[94031,94087,1],[94095,94111,1]]),y(m,"Modi",[[71168,71236,1],[71248,71257,1]]),y(m,"Mongolian",[[6144,6145,1],[6148,6150,2],[6151,6169,1],[6176,6264,1],[6272,6314,1],[71264,71276,1]]),y(m,"Mro",[[92736,92766,1],[92768,92777,1],[92782,92783,1]]),y(m,"Multani",[[70272,70278,1],[70280,70282,2],[70283,70285,1],[70287,70301,1],[70303,70313,1]]),y(m,"Myanmar",[[4096,4255,1],[43488,43518,1],[43616,43647,1]]),y(m,"Nabataean",[[67712,67742,1],[67751,67759,1]]),y(m,"Nag_Mundari",[[124112,124153,1]]),y(m,"Nandinagari",[[72096,72103,1],[72106,72151,1],[72154,72164,1]]),y(m,"New_Tai_Lue",[[6528,6571,1],[6576,6601,1],[6608,6618,1],[6622,6623,1]]),y(m,"Newa",[[70656,70747,1],[70749,70753,1]]),y(m,"Nko",[[1984,2042,1],[2045,2047,1]]),y(m,"Nushu",[[94177,110960,16783],[110961,111355,1]]),y(m,"Nyiakeng_Puachue_Hmong",[[123136,123180,1],[123184,123197,1],[123200,123209,1],[123214,123215,1]]),y(m,"Ogham",[[5760,5788,1]]),y(m,"Ol_Chiki",[[7248,7295,1]]),y(m,"Old_Hungarian",[[68736,68786,1],[68800,68850,1],[68858,68863,1]]),y(m,"Old_Italic",[[66304,66339,1],[66349,66351,1]]),y(m,"Old_North_Arabian",[[68224,68255,1]]),y(m,"Old_Permic",[[66384,66426,1]]),y(m,"Old_Persian",[[66464,66499,1],[66504,66517,1]]),y(m,"Old_Sogdian",[[69376,69415,1]]),y(m,"Old_South_Arabian",[[68192,68223,1]]),y(m,"Old_Turkic",[[68608,68680,1]]),y(m,"Old_Uyghur",[[69488,69513,1]]),y(m,"Oriya",[[2817,2819,1],[2821,2828,1],[2831,2832,1],[2835,2856,1],[2858,2864,1],[2866,2867,1],[2869,2873,1],[2876,2884,1],[2887,2888,1],[2891,2893,1],[2901,2903,1],[2908,2909,1],[2911,2915,1],[2918,2935,1]]),y(m,"Osage",[[66736,66771,1],[66776,66811,1]]),y(m,"Osmanya",[[66688,66717,1],[66720,66729,1]]),y(m,"Pahawh_Hmong",[[92928,92997,1],[93008,93017,1],[93019,93025,1],[93027,93047,1],[93053,93071,1]]),y(m,"Palmyrene",[[67680,67711,1]]),y(m,"Pau_Cin_Hau",[[72384,72440,1]]),y(m,"Phags_Pa",[[43072,43127,1]]),y(m,"Phoenician",[[67840,67867,1],[67871,67871,1]]),y(m,"Psalter_Pahlavi",[[68480,68497,1],[68505,68508,1],[68521,68527,1]]),y(m,"Rejang",[[43312,43347,1],[43359,43359,1]]),y(m,"Runic",[[5792,5866,1],[5870,5880,1]]),y(m,"Samaritan",[[2048,2093,1],[2096,2110,1]]),y(m,"Saurashtra",[[43136,43205,1],[43214,43225,1]]),y(m,"Sharada",[[70016,70111,1]]),y(m,"Shavian",[[66640,66687,1]]),y(m,"Siddham",[[71040,71093,1],[71096,71133,1]]),y(m,"SignWriting",[[120832,121483,1],[121499,121503,1],[121505,121519,1]]),y(m,"Sinhala",[[3457,3459,1],[3461,3478,1],[3482,3505,1],[3507,3515,1],[3517,3520,3],[3521,3526,1],[3530,3535,5],[3536,3540,1],[3542,3544,2],[3545,3551,1],[3558,3567,1],[3570,3572,1],[70113,70132,1]]),y(m,"Sogdian",[[69424,69465,1]]),y(m,"Sora_Sompeng",[[69840,69864,1],[69872,69881,1]]),y(m,"Soyombo",[[72272,72354,1]]),y(m,"Sundanese",[[7040,7103,1],[7360,7367,1]]),y(m,"Syloti_Nagri",[[43008,43052,1]]),y(m,"Syriac",[[1792,1805,1],[1807,1866,1],[1869,1871,1],[2144,2154,1]]),y(m,"Tagalog",[[5888,5909,1],[5919,5919,1]]),y(m,"Tagbanwa",[[5984,5996,1],[5998,6e3,1],[6002,6003,1]]),y(m,"Tai_Le",[[6480,6509,1],[6512,6516,1]]),y(m,"Tai_Tham",[[6688,6750,1],[6752,6780,1],[6783,6793,1],[6800,6809,1],[6816,6829,1]]),y(m,"Tai_Viet",[[43648,43714,1],[43739,43743,1]]),y(m,"Takri",[[71296,71353,1],[71360,71369,1]]),y(m,"Tamil",[[2946,2947,1],[2949,2954,1],[2958,2960,1],[2962,2965,1],[2969,2970,1],[2972,2974,2],[2975,2979,4],[2980,2984,4],[2985,2986,1],[2990,3001,1],[3006,3010,1],[3014,3016,1],[3018,3021,1],[3024,3031,7],[3046,3066,1],[73664,73713,1],[73727,73727,1]]),y(m,"Tangsa",[[92784,92862,1],[92864,92873,1]]),y(m,"Tangut",[[94176,94208,32],[94209,100343,1],[100352,101119,1],[101632,101640,1]]),y(m,"Telugu",[[3072,3084,1],[3086,3088,1],[3090,3112,1],[3114,3129,1],[3132,3140,1],[3142,3144,1],[3146,3149,1],[3157,3158,1],[3160,3162,1],[3165,3168,3],[3169,3171,1],[3174,3183,1],[3191,3199,1]]),y(m,"Thaana",[[1920,1969,1]]),y(m,"Thai",[[3585,3642,1],[3648,3675,1]]),y(m,"Tibetan",[[3840,3911,1],[3913,3948,1],[3953,3991,1],[3993,4028,1],[4030,4044,1],[4046,4052,1],[4057,4058,1]]),y(m,"Tifinagh",[[11568,11623,1],[11631,11632,1],[11647,11647,1]]),y(m,"Tirhuta",[[70784,70855,1],[70864,70873,1]]),y(m,"Toto",[[123536,123566,1]]),y(m,"Ugaritic",[[66432,66461,1],[66463,66463,1]]),y(m,"Vai",[[42240,42539,1]]),y(m,"Vithkuqi",[[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1]]),y(m,"Wancho",[[123584,123641,1],[123647,123647,1]]),y(m,"Warang_Citi",[[71840,71922,1],[71935,71935,1]]),y(m,"Yezidi",[[69248,69289,1],[69291,69293,1],[69296,69297,1]]),y(m,"Yi",[[40960,42124,1],[42128,42182,1]]),y(m,"Zanabazar_Square",[[72192,72263,1]]),y(m,"CATEGORIES",new Map([["C",m.C],["Cc",m.Cc],["Cf",m.Cf],["Co",m.Co],["Cs",m.Cs],["L",m.L],["Ll",m.Ll],["Lm",m.Lm],["Lo",m.Lo],["Lt",m.Lt],["Lu",m.Lu],["M",m.M],["Mc",m.Mc],["Me",m.Me],["Mn",m.Mn],["N",m.N],["Nd",m.Nd],["Nl",m.Nl],["No",m.No],["P",m.P],["Pc",m.Pc],["Pd",m.Pd],["Pe",m.Pe],["Pf",m.Pf],["Pi",m.Pi],["Po",m.Po],["Ps",m.Ps],["S",m.S],["Sc",m.Sc],["Sk",m.Sk],["Sm",m.Sm],["So",m.So],["Z",m.Z],["Zl",m.Zl],["Zp",m.Zp],["Zs",m.Zs]])),y(m,"SCRIPTS",new Map([["Adlam",m.Adlam],["Ahom",m.Ahom],["Anatolian_Hieroglyphs",m.Anatolian_Hieroglyphs],["Arabic",m.Arabic],["Armenian",m.Armenian],["Avestan",m.Avestan],["Balinese",m.Balinese],["Bamum",m.Bamum],["Bassa_Vah",m.Bassa_Vah],["Batak",m.Batak],["Bengali",m.Bengali],["Bhaiksuki",m.Bhaiksuki],["Bopomofo",m.Bopomofo],["Brahmi",m.Brahmi],["Braille",m.Braille],["Buginese",m.Buginese],["Buhid",m.Buhid],["Canadian_Aboriginal",m.Canadian_Aboriginal],["Carian",m.Carian],["Caucasian_Albanian",m.Caucasian_Albanian],["Chakma",m.Chakma],["Cham",m.Cham],["Cherokee",m.Cherokee],["Chorasmian",m.Chorasmian],["Common",m.Common],["Coptic",m.Coptic],["Cuneiform",m.Cuneiform],["Cypriot",m.Cypriot],["Cypro_Minoan",m.Cypro_Minoan],["Cyrillic",m.Cyrillic],["Deseret",m.Deseret],["Devanagari",m.Devanagari],["Dives_Akuru",m.Dives_Akuru],["Dogra",m.Dogra],["Duployan",m.Duployan],["Egyptian_Hieroglyphs",m.Egyptian_Hieroglyphs],["Elbasan",m.Elbasan],["Elymaic",m.Elymaic],["Ethiopic",m.Ethiopic],["Georgian",m.Georgian],["Glagolitic",m.Glagolitic],["Gothic",m.Gothic],["Grantha",m.Grantha],["Greek",m.Greek],["Gujarati",m.Gujarati],["Gunjala_Gondi",m.Gunjala_Gondi],["Gurmukhi",m.Gurmukhi],["Han",m.Han],["Hangul",m.Hangul],["Hanifi_Rohingya",m.Hanifi_Rohingya],["Hanunoo",m.Hanunoo],["Hatran",m.Hatran],["Hebrew",m.Hebrew],["Hiragana",m.Hiragana],["Imperial_Aramaic",m.Imperial_Aramaic],["Inherited",m.Inherited],["Inscriptional_Pahlavi",m.Inscriptional_Pahlavi],["Inscriptional_Parthian",m.Inscriptional_Parthian],["Javanese",m.Javanese],["Kaithi",m.Kaithi],["Kannada",m.Kannada],["Katakana",m.Katakana],["Kawi",m.Kawi],["Kayah_Li",m.Kayah_Li],["Kharoshthi",m.Kharoshthi],["Khitan_Small_Script",m.Khitan_Small_Script],["Khmer",m.Khmer],["Khojki",m.Khojki],["Khudawadi",m.Khudawadi],["Lao",m.Lao],["Latin",m.Latin],["Lepcha",m.Lepcha],["Limbu",m.Limbu],["Linear_A",m.Linear_A],["Linear_B",m.Linear_B],["Lisu",m.Lisu],["Lycian",m.Lycian],["Lydian",m.Lydian],["Mahajani",m.Mahajani],["Makasar",m.Makasar],["Malayalam",m.Malayalam],["Mandaic",m.Mandaic],["Manichaean",m.Manichaean],["Marchen",m.Marchen],["Masaram_Gondi",m.Masaram_Gondi],["Medefaidrin",m.Medefaidrin],["Meetei_Mayek",m.Meetei_Mayek],["Mende_Kikakui",m.Mende_Kikakui],["Meroitic_Cursive",m.Meroitic_Cursive],["Meroitic_Hieroglyphs",m.Meroitic_Hieroglyphs],["Miao",m.Miao],["Modi",m.Modi],["Mongolian",m.Mongolian],["Mro",m.Mro],["Multani",m.Multani],["Myanmar",m.Myanmar],["Nabataean",m.Nabataean],["Nag_Mundari",m.Nag_Mundari],["Nandinagari",m.Nandinagari],["New_Tai_Lue",m.New_Tai_Lue],["Newa",m.Newa],["Nko",m.Nko],["Nushu",m.Nushu],["Nyiakeng_Puachue_Hmong",m.Nyiakeng_Puachue_Hmong],["Ogham",m.Ogham],["Ol_Chiki",m.Ol_Chiki],["Old_Hungarian",m.Old_Hungarian],["Old_Italic",m.Old_Italic],["Old_North_Arabian",m.Old_North_Arabian],["Old_Permic",m.Old_Permic],["Old_Persian",m.Old_Persian],["Old_Sogdian",m.Old_Sogdian],["Old_South_Arabian",m.Old_South_Arabian],["Old_Turkic",m.Old_Turkic],["Old_Uyghur",m.Old_Uyghur],["Oriya",m.Oriya],["Osage",m.Osage],["Osmanya",m.Osmanya],["Pahawh_Hmong",m.Pahawh_Hmong],["Palmyrene",m.Palmyrene],["Pau_Cin_Hau",m.Pau_Cin_Hau],["Phags_Pa",m.Phags_Pa],["Phoenician",m.Phoenician],["Psalter_Pahlavi",m.Psalter_Pahlavi],["Rejang",m.Rejang],["Runic",m.Runic],["Samaritan",m.Samaritan],["Saurashtra",m.Saurashtra],["Sharada",m.Sharada],["Shavian",m.Shavian],["Siddham",m.Siddham],["SignWriting",m.SignWriting],["Sinhala",m.Sinhala],["Sogdian",m.Sogdian],["Sora_Sompeng",m.Sora_Sompeng],["Soyombo",m.Soyombo],["Sundanese",m.Sundanese],["Syloti_Nagri",m.Syloti_Nagri],["Syriac",m.Syriac],["Tagalog",m.Tagalog],["Tagbanwa",m.Tagbanwa],["Tai_Le",m.Tai_Le],["Tai_Tham",m.Tai_Tham],["Tai_Viet",m.Tai_Viet],["Takri",m.Takri],["Tamil",m.Tamil],["Tangsa",m.Tangsa],["Tangut",m.Tangut],["Telugu",m.Telugu],["Thaana",m.Thaana],["Thai",m.Thai],["Tibetan",m.Tibetan],["Tifinagh",m.Tifinagh],["Tirhuta",m.Tirhuta],["Toto",m.Toto],["Ugaritic",m.Ugaritic],["Vai",m.Vai],["Vithkuqi",m.Vithkuqi],["Wancho",m.Wancho],["Warang_Citi",m.Warang_Citi],["Yezidi",m.Yezidi],["Yi",m.Yi],["Zanabazar_Square",m.Zanabazar_Square]])),y(m,"FOLD_CATEGORIES",new Map([["L",m.foldL],["Ll",m.foldLl],["Lt",m.foldLt],["Lu",m.foldLu],["M",m.foldM],["Mn",m.foldMn]])),y(m,"FOLD_SCRIPT",new Map([["Common",m.foldCommon],["Greek",m.foldGreek],["Inherited",m.foldInherited]]));let lt=m;class re{static is32(e,t){let n=0,s=e.length;for(;n<s;){let i=n+Math.floor((s-n)/2),o=e[i];if(o[0]<=t&&t<=o[1])return(t-o[0])%o[2]===0;t<o[0]?s=i:n=i+1}return!1}static is(e,t){if(t<=this.MAX_LATIN1){for(let n of e)if(!(t>n[1]))return t<n[0]?!1:(t-n[0])%n[2]===0;return!1}return e.length>0&&t>=e[0][0]&&this.is32(e,t)}static isUpper(e){if(e<=this.MAX_LATIN1){const t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return this.is(lt.Upper,e)}static isPrint(e){return e<=this.MAX_LATIN1?e>=32&&e<127||e>=161&&e!==173:this.is(lt.L,e)||this.is(lt.M,e)||this.is(lt.N,e)||this.is(lt.P,e)||this.is(lt.S,e)}static simpleFold(e){if(lt.CASE_ORBIT.has(e))return lt.CASE_ORBIT.get(e);const t=V.toLowerCase(e);return t!==e?t:V.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e<0||t<0||e===t)return!0;if(e<=this.MAX_ASCII&&t<=this.MAX_ASCII)return V.CODES.get("A")<=e&&e<=V.CODES.get("Z")&&(e|=32),V.CODES.get("A")<=t&&t<=V.CODES.get("Z")&&(t|=32),e===t;for(let n=this.simpleFold(e);n!==e;n=this.simpleFold(n))if(n===t)return!0;return!1}}y(re,"MAX_RUNE",1114111),y(re,"MAX_ASCII",127),y(re,"MAX_LATIN1",255),y(re,"MAX_BMP",65535),y(re,"MIN_FOLD",65),y(re,"MAX_FOLD",125251);class ae{static emptyInts(){return[]}static isalnum(e){return V.CODES.get("0")<=e&&e<=V.CODES.get("9")||V.CODES.get("a")<=e&&e<=V.CODES.get("z")||V.CODES.get("A")<=e&&e<=V.CODES.get("Z")}static unhex(e){return V.CODES.get("0")<=e&&e<=V.CODES.get("9")?e-V.CODES.get("0"):V.CODES.get("a")<=e&&e<=V.CODES.get("f")?e-V.CODES.get("a")+10:V.CODES.get("A")<=e&&e<=V.CODES.get("F")?e-V.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(re.isPrint(e))this.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case V.CODES.get('"'):t+='\\"';break;case V.CODES.get("\\"):t+="\\\\";break;case V.CODES.get("	"):t+="\\t";break;case V.CODES.get(`
`):t+="\\n";break;case V.CODES.get("\r"):t+="\\r";break;case V.CODES.get("\b"):t+="\\b";break;case V.CODES.get("\f"):t+="\\f";break;default:{let n=e.toString(16);e<256?(t+="\\x",n.length===1&&(t+="0"),t+=n):t+=`\\x{${n}}`;break}}return t}static stringToRunes(e){return String(e).split("").map(t=>t.codePointAt(0))}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return V.CODES.get("a")<=e&&e<=V.CODES.get("z")||V.CODES.get("A")<=e&&e<=V.CODES.get("Z")||V.CODES.get("0")<=e&&e<=V.CODES.get("9")||e===V.CODES.get("_")}static emptyOpContext(e,t){let n=0;return e<0&&(n|=this.EMPTY_BEGIN_TEXT|this.EMPTY_BEGIN_LINE),e===V.CODES.get(`
`)&&(n|=this.EMPTY_BEGIN_LINE),t<0&&(n|=this.EMPTY_END_TEXT|this.EMPTY_END_LINE),t===V.CODES.get(`
`)&&(n|=this.EMPTY_END_LINE),this.isWordRune(e)!==this.isWordRune(t)?n|=this.EMPTY_WORD_BOUNDARY:n|=this.EMPTY_NO_WORD_BOUNDARY,n}static quoteMeta(e){return e.split("").map(t=>this.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>re.MAX_BMP?2:1}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return Array.from(new TextEncoder().encode(e));{let t=[],n=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder)return new TextDecoder("utf-8").decode(new Uint8Array(e));{let t=[],n=0,s=0;for(;n<e.length;){let i=e[n++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],a=e[n++],u=e[n++],l=((i&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;t[s++]=String.fromCharCode(55296+(l>>10)),t[s++]=String.fromCharCode(56320+(l&1023))}else{let o=e[n++],a=e[n++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|a&63)}}return t.join("")}}}y(ae,"METACHARACTERS","\\.+*?()|[]{}^$"),y(ae,"EMPTY_BEGIN_LINE",1),y(ae,"EMPTY_END_LINE",2),y(ae,"EMPTY_BEGIN_TEXT",4),y(ae,"EMPTY_END_TEXT",8),y(ae,"EMPTY_WORD_BOUNDARY",16),y(ae,"EMPTY_NO_WORD_BOUNDARY",32),y(ae,"EMPTY_ALL",-1);const om=(r=[],e=0)=>{const t={};for(let n=0;n<r.length;n++){const s=r[n],i=e+n;t[s]=i,t[i]=s}return Object.freeze(t)},Oo=class Oo{getEncoding(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===Oo.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===Oo.Encoding.UTF_16}};y(Oo,"Encoding",om(["UTF_16","UTF_8"]));let gr=Oo;class Ff extends gr{constructor(e=null){super(),this.bytes=e}getEncoding(){return gr.Encoding.UTF_8}asCharSequence(){return ae.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}}class i5 extends gr{constructor(e=null){super(),this.charSequence=e}getEncoding(){return gr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return this.charSequence.toString().split("").map(e=>e.codePointAt(0))}length(){return this.charSequence.length}}class Ic{static utf16(e){return new i5(e)}static utf8(e){return Array.isArray(e)?new Ff(e):new Ff(ae.stringToUtf8ByteArray(e))}}class eu extends Error{constructor(e){super(e),this.name="RE2JSException"}}class Ue extends eu{constructor(e,t=null){let n=`error parsing regexp: ${e}`;t&&(n+=`: \`${t}\``),super(n),this.name="RE2JSSyntaxException",this.message=n,this.error=e,this.input=t}getDescription(){return this.error}getPattern(){return this.input}}class o5 extends eu{constructor(e){super(e),this.name="RE2JSCompileException"}}class yn extends eu{constructor(e){super(e),this.name="RE2JSGroupException"}}class a5 extends eu{constructor(e){super(e),this.name="RE2JSFlagsException"}}class c5{static quoteReplacement(e){return e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(t=>{const n=t.codePointAt(0);return n===V.CODES["\\"]||n===V.CODES.$?`\\${t}`:t}).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;const n=this.patternInput.re2();this.patternGroupCount=n.numberOfCapturingGroups(),this.groups=[],this.namedGroups=n.namedGroups,t instanceof gr?this.resetMatcherInput(t):Array.isArray(t)?this.resetMatcherInput(Ic.utf8(t)):this.resetMatcherInput(Ic.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new yn(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new yn(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}group(e=0){if(typeof e=="string"){const s=this.namedGroups[e];if(!Number.isFinite(s))throw new yn(`group '${e}' not found`);e=s}const t=this.start(e),n=this.end(e);return t<0&&n<0?null:this.substring(t,n)}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new yn(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new yn("perhaps no match attempted");if(e===0||this.hasGroups)return;let t=this.groups[1]+1;t>this.matcherInputLength&&(t=this.matcherInputLength);const n=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!n[0])throw new yn("inconsistency in matching group data");this.groups=n[1],this.hasGroups=!0}matches(){return this.genMatch(0,K.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,K.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new yn(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}return e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1]&&e++),this.genMatch(e,K.UNANCHORED)}genMatch(e,t){const n=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return n[0]?(this.groups=n[1],this.hasMatch=!0,this.hasGroups=!1,this.anchorFlag=t,!0):!1}substring(e,t){return this.matcherInput.isUTF8Encoding()?ae.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let n="";const s=this.start(),i=this.end();return this.appendPos<s&&(n+=this.substring(this.appendPos,s)),this.appendPos=i,n+=t?this.appendReplacementInternalPerl(e):this.appendReplacementInternal(e),n}appendReplacementInternal(e){let t="",n=0;const s=e.length;for(let i=0;i<s-1;i++){if(e.codePointAt(i)===V.CODES.get("\\")){n<i&&(t+=e.substring(n,i)),i++,n=i;continue}if(e.codePointAt(i)===V.CODES.get("$")){let o=e.codePointAt(i+1);if(V.CODES.get("0")<=o&&o<=V.CODES.get("9")){let a=o-V.CODES.get("0");for(n<i&&(t+=e.substring(n,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<V.CODES.get("0")||o>V.CODES.get("9")||a*10+o-V.CODES.get("0")>this.patternGroupCount));i++)a=a*10+o-V.CODES.get("0");if(a>this.patternGroupCount)throw new yn(`n > number of groups: ${a}`);const u=this.group(a);u!==null&&(t+=u),n=i,i--;continue}else if(o===V.CODES.get("{")){n<i&&(t+=e.substring(n,i)),i++;let a=i+1;for(;a<e.length&&e.codePointAt(a)!==V.CODES.get("}")&&e.codePointAt(a)!==V.CODES.get(" ");)a++;if(a===e.length||e.codePointAt(a)!==V.CODES.get("}"))throw new yn("named capture group is missing trailing '}'");const u=e.substring(i+1,a);t+=this.group(u),n=a+1}}}return n<s&&(t+=e.substring(n,s)),t}appendReplacementInternalPerl(e){let t="",n=0;const s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===V.CODES.get("$")){let o=e.codePointAt(i+1);if(V.CODES.get("$")===o){n<i&&(t+=e.substring(n,i)),t+="$",i++,n=i+1;continue}else if(V.CODES.get("&")===o){n<i&&(t+=e.substring(n,i));const a=this.group(0);a!==null?t+=a:t+="$&",i++,n=i+1;continue}else if(V.CODES.get("1")<=o&&o<=V.CODES.get("9")){let a=o-V.CODES.get("0");for(n<i&&(t+=e.substring(n,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<V.CODES.get("0")||o>V.CODES.get("9")||a*10+o-V.CODES.get("0")>this.patternGroupCount));i++)a=a*10+o-V.CODES.get("0");if(a>this.patternGroupCount){t+=`$${a}`,n=i,i--;continue}const u=this.group(a);u!==null&&(t+=u),n=i,i--;continue}else if(o===V.CODES.get("<")){n<i&&(t+=e.substring(n,i)),i++;let a=i+1;for(;a<e.length&&e.codePointAt(a)!==V.CODES.get(">")&&e.codePointAt(a)!==V.CODES.get(" ");)a++;if(a===e.length||e.codePointAt(a)!==V.CODES.get(">")){t+=e.substring(i-1,a+1),n=a+1;continue}const u=e.substring(i+1,a);Object.prototype.hasOwnProperty.call(this.namedGroups,u)?t+=this.group(u):t+=`$<${u}>`,n=a+1}}return n<s&&(t+=e.substring(n,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,n=!1){let s="";for(this.reset();this.find()&&(s+=this.appendReplacement(e,n),!!t););return s+=this.appendTail(),s}}class rr{static EOF(){return-8}canCheckPrefix(){return!0}endPos(){return this.end}}class u5 extends rr{constructor(e,t=0,n=e.length){super(),this.bytes=e,this.start=t,this.end=n}step(e){if(e+=this.start,e>=this.end)return rr.EOF();let t=this.bytes[e++]&255;return(t&128)===0?t<<3|1:(t&224)===192?(t=t&31,e>=this.end?rr.EOF():(t=t<<6|this.bytes[e++]&63,t<<3|2)):(t&240)===224?(t=t&15,e+1>=this.end?rr.EOF():(t=t<<6|this.bytes[e++]&63,t=t<<6|this.bytes[e++]&63,t<<3|3)):(t=t&7,e+2>=this.end?rr.EOF():(t=t<<6|this.bytes[e++]&63,t=t<<6|this.bytes[e++]&63,t=t<<6|this.bytes[e++]&63,t<<3|4))}index(e,t){t+=this.start;const n=this.indexOf(this.bytes,e.prefixUTF8,t);return n<0?n:n-t}context(e){e+=this.start;let t=-1;if(e>this.start&&e<=this.end){let s=e-1;if(t=this.bytes[s--],t>=128){let i=e-4;for(i<this.start&&(i=this.start);s>=i&&(this.bytes[s]&192)===128;)s--;s<this.start&&(s=this.start),t=this.step(s)>>3}}const n=e<this.end?this.step(e)>>3:-1;return ae.emptyOpContext(t,n)}indexOf(e,t,n=0){let s=t.length;if(s===0)return-1;let i=e.length;for(let o=n;o<=i-s;o++)for(let a=0;a<s&&e[o+a]===t[a];a++)if(a===s-1)return o;return-1}}class l5 extends rr{constructor(e,t=0,n=e.length){super(),this.charSequence=e,this.start=t,this.end=n}step(e){if(e+=this.start,e<this.end){const t=this.charSequence.codePointAt(e);return t<<3|ae.charCount(t)}else return rr.EOF()}index(e,t){t+=this.start;const n=this.charSequence.indexOf(e.prefix,t);return n<0?n:n-t}context(e){e+=this.start;const t=e>0&&e<=this.charSequence.length?this.charSequence.codePointAt(e-1):-1,n=e<this.charSequence.length?this.charSequence.codePointAt(e):-1;return ae.emptyOpContext(t,n)}}class Be{static fromUTF8(e,t=0,n=e.length){return new u5(e,t,n)}static fromUTF16(e,t=0,n=e.length){return new l5(e,t,n)}}const te=class te{static isPseudoOp(e){return e>=te.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===V.CODES.get("-")?"\\":""}static fromRegexp(e){const t=new te(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t}constructor(e){this.op=e,this.flags=0,this.subs=te.emptySubs(),this.runes=null,this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups={}}reinit(){this.flags=0,this.subs=te.emptySubs(),this.runes=null,this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups={}}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case te.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case te.Op.EMPTY_MATCH:e+="(?:)";break;case te.Op.STAR:case te.Op.PLUS:case te.Op.QUEST:case te.Op.REPEAT:{const t=this.subs[0];switch(t.op>te.Op.CAPTURE||t.op===te.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case te.Op.STAR:e+="*";break;case te.Op.PLUS:e+="+";break;case te.Op.QUEST:e+="?";break;case te.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}(this.flags&K.NON_GREEDY)!==0&&(e+="?");break}case te.Op.CONCAT:{for(let t of this.subs)t.op===te.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break}case te.Op.ALTERNATE:{let t="";for(let n of this.subs)e+=t,t="|",e+=n.appendTo();break}case te.Op.LITERAL:(this.flags&K.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=ae.escapeRune(t);(this.flags&K.FOLD_CASE)!==0&&(e+=")");break;case te.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case te.Op.ANY_CHAR:e+="(?s:.)";break;case te.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==te.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case te.Op.BEGIN_TEXT:e+="\\A";break;case te.Op.END_TEXT:(this.flags&K.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case te.Op.BEGIN_LINE:e+="^";break;case te.Op.END_LINE:e+="$";break;case te.Op.WORD_BOUNDARY:e+="\\b";break;case te.Op.NO_WORD_BOUNDARY:e+="\\B";break;case te.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===re.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){const n=this.runes[t]+1,s=this.runes[t+1]-1;e+=te.quoteIfHyphen(n),e+=ae.escapeRune(n),n!==s&&(e+="-",e+=te.quoteIfHyphen(s),e+=ae.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){const n=this.runes[t],s=this.runes[t+1];e+=te.quoteIfHyphen(n),e+=ae.escapeRune(n),n!==s&&(e+="-",e+=te.quoteIfHyphen(s),e+=ae.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===te.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){const n=t.maxCap();e<n&&(e=n)}return e}equals(e){if(!(e!==null&&e instanceof te)||this.op!==e.op)return!1;switch(this.op){case te.Op.END_TEXT:{if((this.flags&K.WAS_DOLLAR)!==(e.flags&K.WAS_DOLLAR))return!1;break}case te.Op.LITERAL:case te.Op.CHAR_CLASS:{if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break}case te.Op.ALTERNATE:case te.Op.CONCAT:{if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break}case te.Op.STAR:case te.Op.PLUS:case te.Op.QUEST:{if((this.flags&K.NON_GREEDY)!==(e.flags&K.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break}case te.Op.REPEAT:{if((this.flags&K.NON_GREEDY)!==(e.flags&K.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break}case te.Op.CAPTURE:{if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break}}return!0}};y(te,"Op",om(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","LEFT_PAREN","VERTICAL_BAR"]));let M=te;const Te=class Te{static isRuneOp(e){return Te.RUNE<=e&&e<=Te.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let n of e)t+=ae.escapeRune(n);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=null}matchRune(e){if(this.runes.length===1){const s=this.runes[0];return(this.arg&K.FOLD_CASE)!==0?re.equalsIgnoreCase(s,e):e===s}for(let s=0;s<this.runes.length&&s<=8;s+=2){if(e<this.runes[s])return!1;if(e<=this.runes[s+1])return!0}let t=0,n=this.runes.length/2|0;for(;t<n;){const s=t+((n-t)/2|0);if(this.runes[2*s]<=e){if(e<=this.runes[2*s+1])return!0;t=s+1}else n=s}return!1}toString(){switch(this.op){case Te.ALT:return`alt -> ${this.out}, ${this.arg}`;case Te.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case Te.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case Te.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case Te.MATCH:return"match";case Te.FAIL:return"fail";case Te.NOP:return`nop -> ${this.out}`;case Te.RUNE:return this.runes===null?"rune <null>":["rune ",Te.escapeRunes(this.runes),(this.arg&K.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case Te.RUNE1:return`rune1 ${Te.escapeRunes(this.runes)} -> ${this.out}`;case Te.RUNE_ANY:return`any -> ${this.out}`;case Te.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}};y(Te,"ALT",1),y(Te,"ALT_MATCH",2),y(Te,"CAPTURE",3),y(Te,"EMPTY_WIDTH",4),y(Te,"FAIL",5),y(Te,"MATCH",6),y(Te,"NOP",7),y(Te,"RUNE",8),y(Te,"RUNE1",9),y(Te,"RUNE_ANY",10),y(Te,"RUNE_ANY_NOT_NL",11);let ce=Te;class h5{constructor(){this.inst=[],this.start=0,this.numCap=2}getInst(e){return this.inst[e]}numInst(){return this.inst.length}addInst(e){this.inst.push(new ce(e))}skipNop(e){let t=this.inst[e];for(;t.op===ce.NOP||t.op===ce.CAPTURE;)t=this.inst[e],e=t.out;return t}prefix(){let e="",t=this.skipNop(this.start);if(!ce.isRuneOp(t.op)||t.runes.length!==1)return[t.op===ce.MATCH,e];for(;ce.isRuneOp(t.op)&&t.runes.length===1&&(t.arg&K.FOLD_CASE)===0;)e+=String.fromCodePoint(t.runes[0]),t=this.skipNop(t.out);return[t.op===ce.MATCH,e]}startCond(){let e=0,t=this.start;e:for(;;){const n=this.inst[t];switch(n.op){case ce.EMPTY_WIDTH:e|=n.arg;break;case ce.FAIL:return-1;case ce.CAPTURE:case ce.NOP:break;default:break e}t=n.out}return e}next(e){const t=this.inst[e>>1];return(e&1)===0?t.out:t.arg}patch(e,t){for(;e!==0;){const n=this.inst[e>>1];(e&1)===0?(e=n.out,n.out=t):(e=n.arg,n.arg=t)}}append(e,t){if(e===0)return t;if(t===0)return e;let n=e;for(;;){const i=this.next(n);if(i===0)break;n=i}const s=this.inst[n>>1];return(n&1)===0?s.out=t:s.arg=t,e}toString(){let e="";for(let t=0;t<this.inst.length;t++){const n=e.length;e+=t,t===this.start&&(e+="*"),e+="        ".substring(e.length-n),e+=this.inst[t],e+=`
`}return e}}class Ba{constructor(e=0,t=0,n=!1){this.i=e,this.out=t,this.nullable=n}}class yo{static ANY_RUNE_NOT_NL(){return[0,V.CODES.get(`
`)-1,V.CODES.get(`
`)+1,re.MAX_RUNE]}static ANY_RUNE(){return[0,re.MAX_RUNE]}static compileRegexp(e){const t=new yo,n=t.compile(e);return t.prog.patch(n.out,t.newInst(ce.MATCH).i),t.prog.start=n.i,t.prog}constructor(){this.prog=new h5,this.newInst(ce.FAIL)}newInst(e){return this.prog.addInst(e),new Ba(this.prog.numInst()-1,0,!0)}nop(){const e=this.newInst(ce.NOP);return e.out=e.i<<1,e}fail(){return new Ba}cap(e){const t=this.newInst(ce.CAPTURE);return t.out=t.i<<1,this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new Ba(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;const n=this.newInst(ce.ALT),s=this.prog.getInst(n.i);return s.out=e.i,s.arg=t.i,n.out=this.prog.append(e.out,t.out),n.nullable=e.nullable||t.nullable,n}loop(e,t){const n=this.newInst(ce.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=n.i<<1):(s.out=e.i,n.out=n.i<<1|1),this.prog.patch(e.out,n.i),n}quest(e,t){const n=this.newInst(ce.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=n.i<<1):(s.out=e.i,n.out=n.i<<1|1),n.out=this.prog.append(n.out,e.out),n}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new Ba(e.i,this.loop(e,t).out,e.nullable)}empty(e){const t=this.newInst(ce.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=t.i<<1,t}rune(e,t){const n=this.newInst(ce.RUNE);n.nullable=!1;const s=this.prog.getInst(n.i);return s.runes=e,t&=K.FOLD_CASE,(e.length!==1||re.simpleFold(e[0])===e[0])&&(t&=-2),s.arg=t,n.out=n.i<<1,(t&K.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=ce.RUNE1:e.length===2&&e[0]===0&&e[1]===re.MAX_RUNE?s.op=ce.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===V.CODES.get(`
`)-1&&e[2]===V.CODES.get(`
`)+1&&e[3]===re.MAX_RUNE&&(s.op=ce.RUNE_ANY_NOT_NL),n}compile(e){switch(e.op){case M.Op.NO_MATCH:return this.fail();case M.Op.EMPTY_MATCH:return this.nop();case M.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let n of e.runes){const s=this.rune([n],e.flags);t=t===null?s:this.cat(t,s)}return t}case M.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case M.Op.ANY_CHAR_NOT_NL:return this.rune(yo.ANY_RUNE_NOT_NL(),0);case M.Op.ANY_CHAR:return this.rune(yo.ANY_RUNE(),0);case M.Op.BEGIN_LINE:return this.empty(ae.EMPTY_BEGIN_LINE);case M.Op.END_LINE:return this.empty(ae.EMPTY_END_LINE);case M.Op.BEGIN_TEXT:return this.empty(ae.EMPTY_BEGIN_TEXT);case M.Op.END_TEXT:return this.empty(ae.EMPTY_END_TEXT);case M.Op.WORD_BOUNDARY:return this.empty(ae.EMPTY_WORD_BOUNDARY);case M.Op.NO_WORD_BOUNDARY:return this.empty(ae.EMPTY_NO_WORD_BOUNDARY);case M.Op.CAPTURE:{const t=this.cap(e.cap<<1),n=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,n),s)}case M.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&K.NON_GREEDY)!==0);case M.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&K.NON_GREEDY)!==0);case M.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&K.NON_GREEDY)!==0);case M.Op.CONCAT:{if(e.subs.length===0)return this.nop();{let t=null;for(let n of e.subs){const s=this.compile(n);t=t===null?s:this.cat(t,s)}return t}}case M.Op.ALTERNATE:{if(e.subs.length===0)return this.nop();{let t=null;for(let n of e.subs){const s=this.compile(n);t=t===null?s:this.alt(t,s)}return t}}default:throw new o5("regexp: unhandled case in compile")}}}class qt{static simplify(e){if(e===null)return null;switch(e.op){case M.Op.CAPTURE:case M.Op.CONCAT:case M.Op.ALTERNATE:{let t=e;for(let n=0;n<e.subs.length;n++){const s=e.subs[n],i=qt.simplify(s);t===e&&i!==s&&(t=M.fromRegexp(e),t.runes=null,t.subs=e.subs.slice(0,e.subs.length)),t!==e&&(t.subs[n]=i)}return t}case M.Op.STAR:case M.Op.PLUS:case M.Op.QUEST:{const t=qt.simplify(e.subs[0]);return qt.simplify1(e.op,e.flags,t,e)}case M.Op.REPEAT:{if(e.min===0&&e.max===0)return new M(M.Op.EMPTY_MATCH);const t=qt.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return qt.simplify1(M.Op.STAR,e.flags,t,null);if(e.min===1)return qt.simplify1(M.Op.PLUS,e.flags,t,null);const s=new M(M.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(qt.simplify1(M.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),s}if(e.min===1&&e.max===1)return t;let n=null;if(e.min>0){n=[];for(let s=0;s<e.min;s++)n.push(t)}if(e.max>e.min){let s=qt.simplify1(M.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){const o=new M(M.Op.CONCAT);o.subs=[t,s],s=qt.simplify1(M.Op.QUEST,e.flags,o,null)}if(n===null)return s;n.push(s)}if(n!==null){const s=new M(M.Op.CONCAT);return s.subs=n.slice(0),s}return new M(M.Op.NO_MATCH)}}return e}static simplify1(e,t,n,s){return n.op===M.Op.EMPTY_MATCH||e===n.op&&(t&K.NON_GREEDY)===(n.flags&K.NON_GREEDY)?n:(s!==null&&s.op===e&&(s.flags&K.NON_GREEDY)===(t&K.NON_GREEDY)&&n===s.subs[0]||(s=new M(e),s.flags=t,s.subs=[n]),s)}}class ge{constructor(e,t){this.sign=e,this.cls=t}}const Uf=[48,57],Bf=[9,10,12,13,32,32],qf=[48,57,65,90,95,95,97,122],Gf=new Map([["\\d",new ge(1,Uf)],["\\D",new ge(-1,Uf)],["\\s",new ge(1,Bf)],["\\S",new ge(-1,Bf)],["\\w",new ge(1,qf)],["\\W",new ge(-1,qf)]]),$f=[48,57,65,90,97,122],zf=[65,90,97,122],Hf=[0,127],jf=[9,9,32,32],Wf=[0,31,127,127],Kf=[48,57],Qf=[33,126],Yf=[97,122],Xf=[32,126],Jf=[33,47,58,64,91,96,123,126],Zf=[9,13,32,32],e2=[65,90],t2=[48,57,65,90,95,95,97,122],n2=[48,57,65,70,97,102],r2=new Map([["[:alnum:]",new ge(1,$f)],["[:^alnum:]",new ge(-1,$f)],["[:alpha:]",new ge(1,zf)],["[:^alpha:]",new ge(-1,zf)],["[:ascii:]",new ge(1,Hf)],["[:^ascii:]",new ge(-1,Hf)],["[:blank:]",new ge(1,jf)],["[:^blank:]",new ge(-1,jf)],["[:cntrl:]",new ge(1,Wf)],["[:^cntrl:]",new ge(-1,Wf)],["[:digit:]",new ge(1,Kf)],["[:^digit:]",new ge(-1,Kf)],["[:graph:]",new ge(1,Qf)],["[:^graph:]",new ge(-1,Qf)],["[:lower:]",new ge(1,Yf)],["[:^lower:]",new ge(-1,Yf)],["[:print:]",new ge(1,Xf)],["[:^print:]",new ge(-1,Xf)],["[:punct:]",new ge(1,Jf)],["[:^punct:]",new ge(-1,Jf)],["[:space:]",new ge(1,Zf)],["[:^space:]",new ge(-1,Zf)],["[:upper:]",new ge(1,e2)],["[:^upper:]",new ge(-1,e2)],["[:word:]",new ge(1,t2)],["[:^word:]",new ge(-1,t2)],["[:xdigit:]",new ge(1,n2)],["[:^xdigit:]",new ge(-1,n2)]]);class ht{static charClassToString(e,t){let n="[";for(let s=0;s<t;s+=2){s>0&&(n+=" ");const i=e[s],o=e[s+1];i===o?n+=`0x${i.toString(16)}`:n+=`0x${i.toString(16)}-0x${o.toString(16)}`}return n+="]",n}static cmp(e,t,n,s){const i=e[t]-n;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,n){const s=((t+n)/2|0)&-2,i=e[s],o=e[s+1];let a=t,u=n;for(;a<=u;){for(;a<n&&ht.cmp(e,a,i,o)<0;)a+=2;for(;u>t&&ht.cmp(e,u,i,o)>0;)u-=2;if(a<=u){if(a!==u){let l=e[a];e[a]=e[u],e[u]=l,l=e[a+1],e[a+1]=e[u+1],e[u+1]=l}a+=2,u-=2}}t<u&&ht.qsortIntPair(e,t,u),a<n&&ht.qsortIntPair(e,a,n)}constructor(e=ae.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;ht.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){const n=this.r[t],s=this.r[t+1];if(n<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=n,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&K.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let n=2;n<=4;n+=2)if(this.len>=n){const s=this.r[this.len-n],i=this.r[this.len-n+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-n]=e),t>i&&(this.r[this.len-n+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=re.MIN_FOLD&&t>=re.MAX_FOLD)return this.appendRange(e,t);if(t<re.MIN_FOLD||e>re.MAX_FOLD)return this.appendRange(e,t);e<re.MIN_FOLD&&(this.appendRange(e,re.MIN_FOLD-1),e=re.MIN_FOLD),t>re.MAX_FOLD&&(this.appendRange(re.MAX_FOLD+1,t),t=re.MAX_FOLD);for(let n=e;n<=t;n++){this.appendRange(n,n);for(let s=re.simpleFold(n);s!==n;s=re.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let n=0;n<e.length;n+=2){const s=e[n],i=e[n+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=re.MAX_RUNE&&this.appendRange(t,re.MAX_RUNE),this}appendTable(e){for(let t of e){const n=t[0],s=t[1],i=t[2];if(i===1){this.appendRange(n,s);continue}for(let o=n;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let n of e){const s=n[0],i=n[1],o=n[2];if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let a=s;a<=i;a+=o)t<=a-1&&this.appendRange(t,a-1),t=a+1}return t<=re.MAX_RUNE&&this.appendRange(t,re.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let n=0;n<this.len;n+=2){const s=this.r[n],i=this.r[n+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=re.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=re.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let n=e.cls;return t&&(n=new ht().appendFoldedClass(n).cleanClass().toArray()),this.appendClassWithSign(n,e.sign)}toString(){return ht.charClassToString(this.r,this.len)}}class Eo{static of(e,t){return new Eo(e,t)}constructor(e,t){this.first=e,this.second=t}}class d5{constructor(e){this.str=e,this.position=0}pos(){return this.position}rewindTo(e){this.position=e}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(e){this.position+=e}skipString(e){this.position+=e.length}pop(){const e=this.str.codePointAt(this.position);return this.position+=ae.charCount(e),e}lookingAt(e){return this.rest().startsWith(e)}rest(){return this.str.substring(this.position)}from(e){return this.str.substring(e,this.position)}toString(){return this.rest()}}const J=class J{static ANY_TABLE(){return[[0,re.MAX_RUNE,1]]}static unicodeTable(e){return e==="Any"?Eo.of(J.ANY_TABLE(),J.ANY_TABLE()):lt.CATEGORIES.has(e)?Eo.of(lt.CATEGORIES.get(e),lt.FOLD_CATEGORIES.get(e)):lt.SCRIPTS.has(e)?Eo.of(lt.SCRIPTS.get(e),lt.FOLD_SCRIPT.get(e)):null}static minFoldRune(e){if(e<re.MIN_FOLD||e>re.MAX_FOLD)return e;let t=e;const n=e;for(e=re.simpleFold(e);e!==n;e=re.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===M.Op.EMPTY_MATCH)return null;if(e.op===M.Op.CONCAT&&e.subs.length>0){const t=e.subs[0];return t.op===M.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){const n=new M(M.Op.LITERAL);return n.flags=t,n.runes=ae.stringToRunes(e),n}static parse(e,t){return new J(e,t).parseInternal()}static parseRepeat(e){const t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);const n=J.parseInt(e);if(n===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=n;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=J.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),n<0||n>1e3||s===-2||s>1e3||s>=0&&n>s)throw new Ue(J.ERR_INVALID_REPEAT_SIZE,e.from(t));return n<<16|s&re.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){const n=e.codePointAt(t);if(n!==V.CODES.get("_")&&!ae.isalnum(n))return!1}return!0}static parseInt(e){const t=e.pos();for(;e.more()&&e.peek()>=V.CODES.get("0")&&e.peek()<=V.CODES.get("9");)e.skip(1);const n=e.from(t);return n.length===0||n.length>1&&n.codePointAt(0)===V.CODES.get("0")?-1:n.length>8?-2:parseFloat(n,10)}static isCharClass(e){return e.op===M.Op.LITERAL&&e.runes.length===1||e.op===M.Op.CHAR_CLASS||e.op===M.Op.ANY_CHAR_NOT_NL||e.op===M.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case M.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case M.Op.CHAR_CLASS:for(let n=0;n<e.runes.length;n+=2)if(e.runes[n]<=t&&t<=e.runes[n+1])return!0;return!1;case M.Op.ANY_CHAR_NOT_NL:return t!==V.CODES.get(`
`);case M.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case M.Op.ANY_CHAR:break;case M.Op.ANY_CHAR_NOT_NL:J.matchRune(t,V.CODES.get(`
`))&&(e.op=M.Op.ANY_CHAR);break;case M.Op.CHAR_CLASS:t.op===M.Op.LITERAL?e.runes=new ht(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new ht(e.runes).appendClass(t.runes).toArray();break;case M.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=M.Op.CHAR_CLASS,e.runes=new ht().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){const t=e.pos();if(e.skip(1),!e.more())throw new Ue(J.ERR_TRAILING_BACKSLASH);let n=e.pop();e:switch(n){case V.CODES.get("1"):case V.CODES.get("2"):case V.CODES.get("3"):case V.CODES.get("4"):case V.CODES.get("5"):case V.CODES.get("6"):case V.CODES.get("7"):if(!e.more()||e.peek()<V.CODES.get("0")||e.peek()>V.CODES.get("7"))break;case V.CODES.get("0"):{let s=n-V.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<V.CODES.get("0")||e.peek()>V.CODES.get("7"));i++)s=s*8+e.peek()-V.CODES.get("0"),e.skip(1);return s}case V.CODES.get("x"):{if(!e.more())break;if(n=e.pop(),n===V.CODES.get("{")){let o=0,a=0;for(;;){if(!e.more())break e;if(n=e.pop(),n===V.CODES.get("}"))break;const u=ae.unhex(n);if(u<0||(a=a*16+u,a>re.MAX_RUNE))break e;o++}if(o===0)break e;return a}const s=ae.unhex(n);if(!e.more())break;n=e.pop();const i=ae.unhex(n);if(s<0||i<0)break;return s*16+i}case V.CODES.get("a"):return V.CODES.get("\x07");case V.CODES.get("f"):return V.CODES.get("\f");case V.CODES.get("n"):return V.CODES.get(`
`);case V.CODES.get("r"):return V.CODES.get("\r");case V.CODES.get("t"):return V.CODES.get("	");case V.CODES.get("v"):return V.CODES.get("\v");default:if(!ae.isalnum(n))return n;break}throw new Ue(J.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new Ue(J.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?J.parseEscape(e):e.pop()}static concatRunes(e,t){return[...e,...t]}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups={},this.stack=[],this.free=null}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):t=new M(e),t}reuse(e){e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}pop(){return this.stack.pop()}popToPseudo(){const e=this.stack.length;let t=e;for(;t>0&&!M.isPseudoOp(this.stack[t-1].op);)t--;const n=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),n}push(e){if(e.op===M.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&-2))return null;e.op=M.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&-2}else if(e.op===M.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&re.simpleFold(e.runes[0])===e.runes[2]&&re.simpleFold(e.runes[2])===e.runes[0]||e.op===M.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&re.simpleFold(e.runes[0])===e.runes[1]&&re.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|K.FOLD_CASE))return null;e.op=M.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|K.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),e}maybeConcat(e,t){const n=this.stack.length;if(n<2)return!1;const s=this.stack[n-1],i=this.stack[n-2];return s.op!==M.Op.LITERAL||i.op!==M.Op.LITERAL||(s.flags&K.FOLD_CASE)!==(i.flags&K.FOLD_CASE)?!1:(i.runes=J.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){const n=this.newRegexp(M.Op.LITERAL);return n.flags=t,(t&K.FOLD_CASE)!==0&&(e=J.minFoldRune(e)),n.runes=[e],n}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){const t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,n,s,i,o){let a=this.flags;if((a&K.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),a^=K.NON_GREEDY),o!==-1))throw new Ue(J.ERR_INVALID_REPEAT_OP,i.from(o));const u=this.stack.length;if(u===0)throw new Ue(J.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const l=this.stack[u-1];if(M.isPseudoOp(l.op))throw new Ue(J.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const d=this.newRegexp(e);d.min=t,d.max=n,d.flags=a,d.subs=[l],this.stack[u-1]=d}concat(){this.maybeConcat(-1,0);const e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(M.Op.EMPTY_MATCH)):this.push(this.collapse(e,M.Op.CONCAT))}alternate(){const e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(M.Op.NO_MATCH)):this.push(this.collapse(e,M.Op.ALTERNATE))}cleanAlt(e){e.op===M.Op.CHAR_CLASS&&(e.runes=new ht(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===re.MAX_RUNE?(e.runes=null,e.op=M.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===V.CODES.get(`
`)-1&&e.runes[2]===V.CODES.get(`
`)+1&&e.runes[3]===re.MAX_RUNE&&(e.runes=null,e.op=M.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let n=0;for(let a of e)n+=a.op===t?a.subs.length:1;let s=new Array(n).fill(null),i=0;for(let a of e)a.op===t?(s.splice(i,a.subs.length,...a.subs),i+=a.subs.length,this.reuse(a)):s[i++]=a;let o=this.newRegexp(t);if(o.subs=s,t===M.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){const a=o;o=o.subs[0],this.reuse(a)}return o}factor(e){if(e.length<2)return e;let t=0,n=e.length,s=0,i=null,o=0,a=0,u=0;for(let d=0;d<=n;d++){let f=null,g=0,I=0;if(d<n){let R=e[t+d];if(R.op===M.Op.CONCAT&&R.subs.length>0&&(R=R.subs[0]),R.op===M.Op.LITERAL&&(f=R.runes,g=R.runes.length,I=R.flags&K.FOLD_CASE),I===a){let O=0;for(;O<o&&O<g&&i[O]===f[O];)O++;if(O>0){o=O;continue}}}if(d!==u)if(d===u+1)e[s++]=e[t+u];else{const R=this.newRegexp(M.Op.LITERAL);R.flags=a,R.runes=i.slice(0,o);for(let z=u;z<d;z++)e[t+z]=this.removeLeadingString(e[t+z],o);const O=this.collapse(e.slice(t+u,t+d),M.Op.ALTERNATE),x=this.newRegexp(M.Op.CONCAT);x.subs=[R,O],e[s++]=x}u=d,i=f,o=g,a=I}n=s,t=0,u=0,s=0;let l=null;for(let d=0;d<=n;d++){let f=null;if(!(d<n&&(f=J.leadingRegexp(e[t+d]),l!==null&&l.equals(f)&&(J.isCharClass(l)||l.op===M.Op.REPEAT&&l.min===l.max&&J.isCharClass(l.subs[0]))))){if(d!==u)if(d===u+1)e[s++]=e[t+u];else{const g=l;for(let O=u;O<d;O++){const x=O!==u;e[t+O]=this.removeLeadingRegexp(e[t+O],x)}const I=this.collapse(e.slice(t+u,t+d),M.Op.ALTERNATE),R=this.newRegexp(M.Op.CONCAT);R.subs=[g,I],e[s++]=R}u=d,l=f}}n=s,t=0,u=0,s=0;for(let d=0;d<=n;d++)if(!(d<n&&J.isCharClass(e[t+d]))){if(d!==u)if(d===u+1)e[s++]=e[t+u];else{let f=u;for(let I=u+1;I<d;I++){const R=e[t+f],O=e[t+I];(R.op<O.op||R.op===O.op&&(R.runes!==null?R.runes.length:0)<(O.runes!==null?O.runes.length:0))&&(f=I)}const g=e[t+u];e[t+u]=e[t+f],e[t+f]=g;for(let I=u+1;I<d;I++)J.mergeCharClass(e[t+u],e[t+I]),this.reuse(e[t+I]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}d<n&&(e[s++]=e[t+d]),u=d+1}n=s,t=0,u=0,s=0;for(let d=0;d<n;++d)d+1<n&&e[t+d].op===M.Op.EMPTY_MATCH&&e[t+d+1].op===M.Op.EMPTY_MATCH||(e[s++]=e[t+d]);return n=s,t=0,e.slice(t,n)}removeLeadingString(e,t){if(e.op===M.Op.CONCAT&&e.subs.length>0){const n=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=n,n.op===M.Op.EMPTY_MATCH)switch(this.reuse(n),e.subs.length){case 0:case 1:e.op=M.Op.EMPTY_MATCH,e.subs=null;break;case 2:{const s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===M.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=M.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===M.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:{e.op=M.Op.EMPTY_MATCH,e.subs=M.emptySubs();break}case 1:{const n=e;e=e.subs[0],this.reuse(n);break}}return e}return t&&this.reuse(e),this.newRegexp(M.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&K.LITERAL)!==0)return J.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,n=-1;const s=new d5(this.wholeRegexp);for(;s.more();){let o=-1;e:switch(s.peek()){case V.CODES.get("("):if((this.flags&K.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(M.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case V.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case V.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case V.CODES.get("^"):(this.flags&K.ONE_LINE)!==0?this.op(M.Op.BEGIN_TEXT):this.op(M.Op.BEGIN_LINE),s.skip(1);break;case V.CODES.get("$"):(this.flags&K.ONE_LINE)!==0?this.op(M.Op.END_TEXT).flags|=K.WAS_DOLLAR:this.op(M.Op.END_LINE),s.skip(1);break;case V.CODES.get("."):(this.flags&K.DOT_NL)!==0?this.op(M.Op.ANY_CHAR):this.op(M.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case V.CODES.get("["):this.parseClass(s);break;case V.CODES.get("*"):case V.CODES.get("+"):case V.CODES.get("?"):{o=s.pos();let a=null;switch(s.pop()){case V.CODES.get("*"):a=M.Op.STAR;break;case V.CODES.get("+"):a=M.Op.PLUS;break;case V.CODES.get("?"):a=M.Op.QUEST;break}this.repeat(a,t,n,o,s,e);break}case V.CODES.get("{"):{o=s.pos();const a=J.parseRepeat(s);if(a<0){s.rewindTo(o),this.literal(s.pop());break}t=a>>16,n=(a&re.MAX_BMP)<<16>>16,this.repeat(M.Op.REPEAT,t,n,o,s,e);break}case V.CODES.get("\\"):{const a=s.pos();if(s.skip(1),(this.flags&K.PERL_X)!==0&&s.more())switch(s.pop()){case V.CODES.get("A"):this.op(M.Op.BEGIN_TEXT);break e;case V.CODES.get("b"):this.op(M.Op.WORD_BOUNDARY);break e;case V.CODES.get("B"):this.op(M.Op.NO_WORD_BOUNDARY);break e;case V.CODES.get("C"):throw new Ue(J.ERR_INVALID_ESCAPE,"\\C");case V.CODES.get("Q"):{let f=s.rest();const g=f.indexOf("\\E");g>=0&&(f=f.substring(0,g)),s.skipString(f),s.skipString("\\E");let I=0;for(;I<f.length;){const R=f.codePointAt(I);this.literal(R),I+=ae.charCount(R)}break e}case V.CODES.get("z"):this.op(M.Op.END_TEXT);break e;default:s.rewindTo(a);break}const u=this.newRegexp(M.Op.CHAR_CLASS);if(u.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){const d=new ht;if(this.parseUnicodeClass(s,d)){u.runes=d.toArray(),this.push(u);break e}}const l=new ht;if(this.parsePerlClassEscape(s,l)){u.runes=l.toArray(),this.push(u);break e}s.rewindTo(a),this.reuse(u),this.literal(J.parseEscape(s));break}default:this.literal(s.pop());break}e=o}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new Ue(J.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){const t=e.pos(),n=e.rest();if(n.startsWith("(?P<")||n.startsWith("(?<")){const a=n.charAt(2)==="P"?4:3,u=n.indexOf(">");if(u<0)throw new Ue(J.ERR_INVALID_NAMED_CAPTURE,n);const l=n.substring(a,u);if(e.skipString(l),e.skip(a+1),!J.isValidCaptureName(l))throw new Ue(J.ERR_INVALID_NAMED_CAPTURE,n.substring(0,u+1));const d=this.op(M.Op.LEFT_PAREN);if(d.cap=++this.numCap,this.namedGroups[l])throw new Ue(J.ERR_DUPLICATE_NAMED_CAPTURE,l);this.namedGroups[l]=this.numCap,d.name=l;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){const a=e.pop();switch(a){case V.CODES.get("i"):s|=K.FOLD_CASE,o=!0;break;case V.CODES.get("m"):s&=-17,o=!0;break;case V.CODES.get("s"):s|=K.DOT_NL,o=!0;break;case V.CODES.get("U"):s|=K.NON_GREEDY,o=!0;break;case V.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case V.CODES.get(":"):case V.CODES.get(")"):if(i<0){if(!o)break e;s=~s}a===V.CODES.get(":")&&this.op(M.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new Ue(J.ERR_INVALID_PERL_OP,e.from(t))}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(M.Op.VERTICAL_BAR)}swapVerticalBar(){const e=this.stack.length;if(e>=3&&this.stack[e-2].op===M.Op.VERTICAL_BAR&&J.isCharClass(this.stack[e-1])&&J.isCharClass(this.stack[e-3])){let t=this.stack[e-1],n=this.stack[e-3];if(t.op>n.op){const s=n;n=t,t=s,this.stack[e-3]=n}return J.mergeCharClass(n,t),this.reuse(t),this.pop(),!0}if(e>=2){const t=this.stack[e-1],n=this.stack[e-2];if(n.op===M.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=n,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new Ue(J.ERR_INTERNAL_ERROR,"stack underflow");const t=this.pop(),n=this.pop();if(n.op!==M.Op.LEFT_PAREN)throw new Ue(J.ERR_MISSING_PAREN,this.wholeRegexp);this.flags=n.flags,n.cap===0?this.push(t):(n.op=M.Op.CAPTURE,n.subs=[t],this.push(n))}parsePerlClassEscape(e,t){const n=e.pos();if((this.flags&K.PERL_X)===0||!e.more()||e.pop()!==V.CODES.get("\\")||!e.more())return!1;e.pop();const s=e.from(n),i=Gf.has(s)?Gf.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&K.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){const n=e.rest(),s=n.indexOf(":]");if(s<0)return!1;const i=n.substring(0,s+2);e.skipString(i);const o=r2.has(i)?r2.get(i):null;if(o===null)throw new Ue(J.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&K.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){const n=e.pos();if((this.flags&K.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===V.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(n),new Ue(J.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==V.CODES.get("{"))o=ae.runeToString(i);else{const d=e.rest(),f=d.indexOf("}");if(f<0)throw e.rewindTo(n),new Ue(J.ERR_INVALID_CHAR_RANGE,e.rest());o=d.substring(0,f),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===V.CODES.get("^")&&(s=0-s,o=o.substring(1));const a=J.unicodeTable(o);if(a===null)throw new Ue(J.ERR_INVALID_CHAR_RANGE,e.from(n));const u=a.first,l=a.second;if((this.flags&K.FOLD_CASE)===0||l===null)t.appendTableWithSign(u,s);else{const d=new ht().appendTable(u).appendTable(l).cleanClass().toArray();t.appendClassWithSign(d,s)}return!0}parseClass(e){const t=e.pos();e.skip(1);const n=this.newRegexp(M.Op.CHAR_CLASS);n.flags=this.flags;const s=new ht;let i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&K.CLASS_NL)===0&&s.appendRange(V.CODES.get(`
`),V.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==V.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&K.PERL_X)===0&&!o){const d=e.rest();if(d==="-"||!d.startsWith("-]"))throw e.rewindTo(t),new Ue(J.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;const a=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(a)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(a);const u=J.parseClassChar(e,t);let l=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(l=J.parseClassChar(e,t),l<u)throw new Ue(J.ERR_INVALID_CHAR_RANGE,e.from(a))}(this.flags&K.FOLD_CASE)===0?s.appendRange(u,l):s.appendFoldedRange(u,l)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),n.runes=s.toArray(),this.push(n)}};y(J,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),y(J,"ERR_INVALID_CHAR_RANGE","invalid character class range"),y(J,"ERR_INVALID_ESCAPE","invalid escape sequence"),y(J,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),y(J,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),y(J,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),y(J,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),y(J,"ERR_MISSING_BRACKET","missing closing ]"),y(J,"ERR_MISSING_PAREN","missing closing )"),y(J,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),y(J,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),y(J,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name");let Dl=J;class f5{constructor(){this.inst=null,this.cap=[]}}class s2{constructor(){this.sparse=[],this.densePcs=[],this.denseThreads=[],this.size=0}contains(e){const t=this.sparse[e];return t<this.size&&this.densePcs[t]===e}isEmpty(){return this.size===0}add(e){const t=this.size++;return this.sparse[e]=t,this.denseThreads[t]=null,this.densePcs[t]=e,t}clear(){this.sparse=[],this.densePcs=[],this.denseThreads=[],this.size=0}toString(){let e="{";for(let t=0;t<this.size;t++)t!==0&&(e+=", "),e+=this.densePcs[t];return e+="}",e}}class Bs{static fromRE2(e){const t=new Bs;return t.prog=e.prog,t.re2=e,t.q0=new s2(t.prog.numInst()),t.q1=new s2(t.prog.numInst()),t.pool=[],t.poolSize=0,t.matched=!1,t.matchcap=Array(t.prog.numCap<2?2:t.prog.numCap).fill(0),t.ncap=0,t}static fromMachine(e){const t=new Bs;return t.re2=e.re2,t.prog=e.prog,t.q0=e.q0,t.q1=e.q1,t.pool=e.pool,t.poolSize=e.poolSize,t.matched=e.matched,t.matchcap=e.matchcap,t.ncap=e.ncap,t}init(e){this.ncap=e,e>this.matchcap.length?this.initNewCap(e):this.resetCap(e)}resetCap(e){for(let t=0;t<this.poolSize;t++){const n=this.pool[t];n.cap=Array(e).fill(0)}}initNewCap(e){for(let t=0;t<this.poolSize;t++){const n=this.pool[t];n.cap=Array(e).fill(0)}this.matchcap=Array(e).fill(0)}submatches(){return this.ncap===0?ae.emptyInts():this.matchcap.slice(0,this.ncap)}alloc(e){let t;return this.poolSize>0?(this.poolSize--,t=this.pool[this.poolSize]):t=new f5,t.inst=e,t}freeQueue(e,t=0){const n=e.size-t,s=this.poolSize+n;this.pool.length<s&&(this.pool=this.pool.slice(0,Math.max(this.pool.length*2,s)));for(let i=t;i<e.size;i++){const o=e.denseThreads[i];o!==null&&(this.pool[this.poolSize]=o,this.poolSize++)}e.clear()}freeThread(e){this.pool.length<=this.poolSize&&(this.pool=this.pool.slice(0,this.pool.length*2)),this.pool[this.poolSize]=e,this.poolSize++}match(e,t,n){const s=this.re2.cond;if(s===ae.EMPTY_ALL||(n===K.ANCHOR_START||n===K.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap=Array(this.prog.numCap).fill(-1);let i=this.q0,o=this.q1,a=e.step(t),u=a>>3,l=a&7,d=-1,f=0;a!==rr.EOF()&&(a=e.step(t+l),d=a>>3,f=a&7);let g;for(t===0?g=ae.emptyOpContext(-1,u):g=e.context(t);;){if(i.isEmpty()){if((s&ae.EMPTY_BEGIN_TEXT)!==0&&t!==0||this.matched)break;if(this.re2.prefix.length!==0&&d!==this.re2.prefixRune&&e.canCheckPrefix()){const O=e.index(this.re2,t);if(O<0)break;t+=O,a=e.step(t),u=a>>3,l=a&7,a=e.step(t+l),d=a>>3,f=a&7}}!this.matched&&(t===0||n===K.UNANCHORED)&&(this.ncap>0&&(this.matchcap[0]=t),this.add(i,this.prog.start,t,this.matchcap,g,null));const I=t+l;if(g=e.context(I),this.step(i,o,t,I,u,g,n,t===e.endPos()),l===0||this.ncap===0&&this.matched)break;t+=l,u=d,l=f,u!==-1&&(a=e.step(t+l),d=a>>3,f=a&7);const R=i;i=o,o=R}return this.freeQueue(o),this.matched}step(e,t,n,s,i,o,a,u){const l=this.re2.longest;for(let d=0;d<e.size;d++){let f=e.denseThreads[d];if(f===null)continue;if(l&&this.matched&&this.ncap>0&&this.matchcap[0]<f.cap[0]){this.freeThread(f);continue}const g=f.inst;let I=!1;switch(g.op){case ce.MATCH:if(a===K.ANCHOR_BOTH&&!u)break;this.ncap>0&&(!l||!this.matched||this.matchcap[1]<n)&&(f.cap[1]=n,this.matchcap=f.cap.slice(0,this.ncap)),l||this.freeQueue(e,d+1),this.matched=!0;break;case ce.RUNE:I=g.matchRune(i);break;case ce.RUNE1:I=i===g.runes[0];break;case ce.RUNE_ANY:I=!0;break;case ce.RUNE_ANY_NOT_NL:I=i!==V.CODES.get(`
`);break;default:throw new Error("bad inst")}I&&(f=this.add(t,g.out,s,f.cap,o,f)),f!==null&&(this.freeThread(f),e.denseThreads[d]=null)}e.clear()}add(e,t,n,s,i,o){if(t===0||e.contains(t))return o;const a=e.add(t),u=this.prog.inst[t];switch(u.op){case ce.FAIL:break;case ce.ALT:case ce.ALT_MATCH:o=this.add(e,u.out,n,s,i,o),o=this.add(e,u.arg,n,s,i,o);break;case ce.EMPTY_WIDTH:(u.arg&~i)===0&&(o=this.add(e,u.out,n,s,i,o));break;case ce.NOP:o=this.add(e,u.out,n,s,i,o);break;case ce.CAPTURE:if(u.arg<this.ncap){const l=s[u.arg];s[u.arg]=n,this.add(e,u.out,n,s,i,null),s[u.arg]=l}else o=this.add(e,u.out,n,s,i,o);break;case ce.MATCH:case ce.RUNE:case ce.RUNE1:case ce.RUNE_ANY:case ce.RUNE_ANY_NOT_NL:o===null?o=this.alloc(u):o.inst=u,this.ncap>0&&o.cap!==s&&(o.cap=s.slice(0,this.ncap)),e.denseThreads[a]=o,o=null;break;default:throw new Error("unhandled")}return o}}class p5{constructor(e){this.value=e}get(){return this.value}set(e){this.value=e}compareAndSet(e,t){return this.value===e?(this.value=t,!0):!1}}class nr{static initTest(e){const t=nr.compile(e),n=new nr(t.expr,t.prog,t.numSubexp,t.longest);return n.cond=t.cond,n.prefix=t.prefix,n.prefixUTF8=t.prefixUTF8,n.prefixComplete=t.prefixComplete,n.prefixRune=t.prefixRune,n}static compile(e){return nr.compileImpl(e,K.PERL,!1)}static compilePOSIX(e){return nr.compileImpl(e,K.POSIX,!0)}static compileImpl(e,t,n){let s=Dl.parse(e,t);const i=s.maxCap();s=qt.simplify(s);const o=yo.compileRegexp(s),a=new nr(e,o,i,n),[u,l]=o.prefix();return a.prefixComplete=u,a.prefix=l,a.prefixUTF8=ae.stringToUtf8ByteArray(a.prefix),a.prefix.length>0&&(a.prefixRune=a.prefix.codePointAt(0)),a.namedGroups=s.namedGroups,a}static match(e,t){return nr.compile(e).match(t)}constructor(e,t,n=0,s=0){this.expr=e,this.prog=t,this.numSubexp=n,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.pooled=new p5}numberOfCapturingGroups(){return this.numSubexp}get(){let e;do e=this.pooled.get();while(e&&!this.pooled.compareAndSet(e,e.next));return e}reset(){this.pooled.set(null)}put(e,t){let n=this.pooled.get();do n=this.pooled.get(),!t&&n&&(e=Bs.fromMachine(e),t=!0),e.next!==n&&(e.next=n);while(!this.pooled.compareAndSet(n,e))}toString(){return this.expr}doExecute(e,t,n,s){let i=this.get(),o=!1;i?i.next!==null&&(i=Bs.fromMachine(i),o=!0):(i=Bs.fromRE2(this),o=!0),i.init(s);const a=i.match(e,t,n)?i.submatches():null;return this.put(i,o),a}match(e){return this.doExecute(Be.fromUTF16(e),0,K.UNANCHORED,0)!==null}matchWithGroup(e,t,n,s,i){return e instanceof gr||(e=Ic.utf16(e)),this.matchMachineInput(e,t,n,s,i)}matchMachineInput(e,t,n,s,i){if(t>n)return[!1,null];const o=e.isUTF16Encoding()?Be.fromUTF16(e.asCharSequence(),0,n):Be.fromUTF8(e.asBytes(),0,n),a=this.doExecute(o,t,s,2*i);return a===null?[!1,null]:[!0,a]}matchUTF8(e){return this.doExecute(Be.fromUTF8(e),0,K.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,n){let s=0,i=0,o="";const a=Be.fromUTF16(e);let u=0;for(;i<=e.length;){const l=this.doExecute(a,i,K.UNANCHORED,2);if(l===null||l.length===0)break;o+=e.substring(s,l[0]),(l[1]>s||l[0]===0)&&(o+=t(e.substring(l[0],l[1])),u++),s=l[1];const d=a.step(i)&7;if(i+d>l[1]?i+=d:i+1>l[1]?i++:i=l[1],u>=n)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let n=new Array(t).fill(-1);for(let s=0;s<e.length;s++)n[s]=e[s];e=n}return e}allMatches(e,t,n=s=>s){let s=[];const i=e.endPos();t<0&&(t=i+1);let o=0,a=0,u=-1;for(;a<t&&o<=i;){const l=this.doExecute(e,o,K.UNANCHORED,this.prog.numCap);if(l===null||l.length===0)break;let d=!0;if(l[1]===o){l[0]===u&&(d=!1);const f=e.step(o);f<0?o=i+1:o+=f&7}else o=l[1];u=l[1],d&&(s.push(n(this.pad(l))),a++)}return s}findUTF8(e){const t=this.doExecute(Be.fromUTF8(e),0,K.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){const t=this.doExecute(Be.fromUTF8(e),0,K.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){const t=this.doExecute(Be.fromUTF16(e),0,K.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.doExecute(Be.fromUTF16(e),0,K.UNANCHORED,2)}findUTF8Submatch(e){const t=this.doExecute(Be.fromUTF8(e),0,K.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.slice(t[2*s],t[2*s+1]));return n}findUTF8SubmatchIndex(e){return this.pad(this.doExecute(Be.fromUTF8(e),0,K.UNANCHORED,this.prog.numCap))}findSubmatch(e){const t=this.doExecute(Be.fromUTF16(e),0,K.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.substring(t[2*s],t[2*s+1]));return n}findSubmatchIndex(e){return this.pad(this.doExecute(Be.fromUTF16(e),0,K.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){const n=this.allMatches(Be.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return n.length===0?null:n}findAllUTF8Index(e,t){const n=this.allMatches(Be.fromUTF8(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAll(e,t){const n=this.allMatches(Be.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return n.length===0?null:n}findAllIndex(e,t){const n=this.allMatches(Be.fromUTF16(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAllUTF8Submatch(e,t){const n=this.allMatches(Be.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllUTF8SubmatchIndex(e,t){const n=this.allMatches(Be.fromUTF8(e),t);return n.length===0?null:n}findAllSubmatch(e,t){const n=this.allMatches(Be.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllSubmatchIndex(e,t){const n=this.allMatches(Be.fromUTF16(e),t);return n.length===0?null:n}}const It=class It{static quote(e){return ae.quoteMeta(e)}static compile(e,t=0){let n=e;if((t&It.CASE_INSENSITIVE)!==0&&(n=`(?i)${n}`),(t&It.DOTALL)!==0&&(n=`(?s)${n}`),(t&It.MULTILINE)!==0&&(n=`(?m)${n}`),(t&-32)!==0)throw new a5("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH");let s=K.PERL;(t&It.DISABLE_UNICODE_GROUPS)!==0&&(s&=-129);const i=new It(e,t);return i.re2Input=nr.compileImpl(n,s,(t&It.LONGEST_MATCH)!==0),i}static matches(e,t){return It.compile(e).matcher(t).matches()}static initTest(e,t,n){if(e==null)throw new Error("pattern is null");if(n==null)throw new Error("re2 is null");const s=new It(e,t);return s.re2Input=n,s}constructor(e,t){this.patternInput=e,this.flagsInput=t}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.matcher(e).matches()}matcher(e){return Array.isArray(e)&&(e=Ic.utf8(e)),new c5(this,e)}split(e,t=0){const n=this.matcher(e),s=[];let i=0,o=0;for(;n.find();){if(o===0&&n.end()===0){o=n.end();continue}if(t>0&&s.length===t-1)break;if(o===n.start()){if(t===0){i+=1,o=n.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.start())),o=n.end()}if(t===0&&o!==n.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.inputLength()))}return(t!==0||s.length===0)&&s.push(n.substring(o,n.inputLength())),s}toString(){return this.patternInput}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}};y(It,"CASE_INSENSITIVE",1),y(It,"DOTALL",2),y(It,"MULTILINE",4),y(It,"DISABLE_UNICODE_GROUPS",8),y(It,"LONGEST_MATCH",16);let Uo=It;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}nt.UNAUTHENTICATED=new nt(null),nt.GOOGLE_CREDENTIALS=new nt("google-credentials-uid"),nt.FIRST_PARTY=new nt("first-party-uid"),nt.MOCK_USER=new nt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ti="12.15.0";function m5(r){Ti=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _r=new uh("@firebase/firestore");function ks(){return _r.logLevel}function g5(r){_r.setLogLevel(r)}function U(r,...e){if(_r.logLevel<=fe.DEBUG){const t=e.map(Nh);_r.debug(`Firestore (${Ti}): ${r}`,...t)}}function qe(r,...e){if(_r.logLevel<=fe.ERROR){const t=e.map(Nh);_r.error(`Firestore (${Ti}): ${r}`,...t)}}function Xe(r,...e){if(_r.logLevel<=fe.WARN){const t=e.map(Nh);_r.warn(`Firestore (${Ti}): ${r}`,...t)}}function Nh(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,am(r,n,t)}function am(r,e,t){let n=`FIRESTORE (${Ti}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw qe(n),new Error(n)}function B(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||am(e,s,n)}function _5(r,e){r||W(57014,e)}function H(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class F extends mn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class um{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(nt.UNAUTHENTICATED)))}shutdown(){}}class y5{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class E5{constructor(e){this.t=e,this.currentUser=nt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){B(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new it;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new it,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},a=u=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>a(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new it)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(B(typeof n.accessToken=="string",31837,{l:n}),new cm(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return B(e===null||typeof e=="string",2055,{h:e}),new nt(e)}}class I5{constructor(e,t,n){this.T=e,this.P=t,this.R=n,this.type="FirstParty",this.user=nt.FIRST_PARTY,this.I=new Map}A(){return this.R?this.R():null}get headers(){this.I.set("X-Goog-AuthUser",this.T);const e=this.A();return e&&this.I.set("Authorization",e),this.P&&this.I.set("X-Goog-Iam-Authorization-Token",this.P),this.I}}class T5{constructor(e,t,n){this.T=e,this.P=t,this.R=n}getToken(){return Promise.resolve(new I5(this.T,this.P,this.R))}start(e,t){e.enqueueRetryable((()=>t(nt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Vl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class w5{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ve(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){B(this.o===void 0,3512);const n=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,U("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Vl(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(B(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Vl(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class A5{getToken(){return Promise.resolve(new Vl(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v5(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=v5(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function ne(r,e){return r<e?-1:r>e?1:0}function Ol(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return fl(s)===fl(i)?ne(s,i):fl(s)?1:-1}return ne(r.length,e.length)}const R5=55296,P5=57343;function fl(r){const e=r.charCodeAt(0);return e>=R5&&e<=P5}function Hs(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function lm(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en="__name__";class Xt{constructor(e,t,n){t===void 0?t=0:t>e.length&&W(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&W(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Xt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Xt?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=Xt.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return ne(e.length,t.length)}static compareSegments(e,t){const n=Xt.isNumericId(e),s=Xt.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?Xt.extractNumericId(e).compare(Xt.extractNumericId(t)):Ol(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return hr.fromString(e.substring(4,e.length-2))}}class ie extends Xt{construct(e,t,n){return new ie(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new F(N.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new ie(t)}static emptyPath(){return new ie([])}}const S5=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ve extends Xt{construct(e,t,n){return new ve(e,t,n)}static isValidIdentifier(e){return S5.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ve.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===en}static keyField(){return new ve([en])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new F(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new F(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new F(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new F(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ve(t)}static emptyPath(){return new ve([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.path=e}static fromPath(e){return new G(ie.fromString(e))}static fromName(e){return new G(ie.fromString(e).popFirst(5))}static empty(){return new G(ie.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ie.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ie.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new G(new ie(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dh(r,e,t){if(!t)throw new F(N.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function hm(r,e,t,n){if(e===!0&&n===!0)throw new F(N.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function i2(r){if(!G.isDocumentKey(r))throw new F(N.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function o2(r){if(G.isDocumentKey(r))throw new F(N.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function ia(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function nu(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":W(12329,{type:typeof r})}function he(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new F(N.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=nu(r);throw new F(N.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function dm(r,e){if(e<=0)throw new F(N.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(r,e){const t={typeString:r};return e&&(t.value=e),t}function ms(r,e){if(!ia(r))throw new F(N.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new F(N.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a2=-62135596800,c2=1e6;class _e{static now(){return _e.fromMillis(Date.now())}static fromDate(e){return _e.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*c2);return new _e(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new F(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new F(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<a2)throw new F(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new F(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/c2}_compareTo(e){return this.seconds===e.seconds?ne(this.nanoseconds,e.nanoseconds):ne(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:_e._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ms(e,_e._jsonSchema))return new _e(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-a2;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}_e._jsonSchemaVersion="firestore/timestamp/1.0",_e._jsonSchema={type:je("string",_e._jsonSchemaVersion),seconds:je("number"),nanoseconds:je("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{static fromTimestamp(e){return new X(e)}static min(){return new X(new _e(0,0))}static max(){return new X(new _e(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js=-1;class Ws{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function kl(r){return r.fields.find((e=>e.kind===2))}function Gr(r){return r.fields.filter((e=>e.kind!==2))}function b5(r,e){let t=ne(r.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let n=0;n<Math.min(r.fields.length,e.fields.length);++n)if(t=C5(r.fields[n],e.fields[n]),t!==0)return t;return ne(r.fields.length,e.fields.length)}Ws.UNKNOWN_ID=-1;class Zr{constructor(e,t){this.fieldPath=e,this.kind=t}}function C5(r,e){const t=ve.comparator(r.fieldPath,e.fieldPath);return t!==0?t:ne(r.kind,e.kind)}class Ks{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Ks(0,Lt.min())}}function fm(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=X.fromTimestamp(n===1e9?new _e(t+1,0):new _e(t,n));return new Lt(s,G.empty(),e)}function pm(r){return new Lt(r.readTime,r.key,js)}class Lt{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Lt(X.min(),G.empty(),js)}static max(){return new Lt(X.max(),G.empty(),js)}}function Vh(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=G.comparator(r.documentKey,e.documentKey),t!==0?t:ne(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mm="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class gm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cr(r){if(r.code!==N.FAILED_PRECONDITION||r.message!==mm)throw r;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&W(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new b(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof b?t:b.resolve(t)}catch(t){return b.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):b.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):b.reject(t)}static resolve(e){return new b(((t,n)=>{t(e)}))}static reject(e){return new b(((t,n)=>{n(e)}))}static waitFor(e){return new b(((t,n)=>{let s=0,i=0,o=!1;e.forEach((a=>{++s,a.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=b.resolve(!1);for(const n of e)t=t.next((s=>s?b.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new b(((n,s)=>{const i=e.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const l=u;t(e[l]).next((d=>{o[l]=d,++a,a===i&&n(o)}),(d=>s(d)))}}))}static doWhile(e,t){return new b(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kt="SimpleDb";class ru{static open(e,t,n,s){try{return new ru(t,e.transaction(s,n))}catch(i){throw new Io(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.v=new it,this.transaction.oncomplete=()=>{this.v.resolve()},this.transaction.onabort=()=>{t.error?this.v.reject(new Io(e,t.error)):this.v.resolve()},this.transaction.onerror=n=>{const s=Oh(n.target.error);this.v.reject(new Io(e,s))}}get S(){return this.v.promise}abort(e){e&&this.v.reject(e),this.aborted||(U(kt,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}D(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new D5(t)}}class an{static delete(e){return U(kt,"Removing database:",e),zr(kp().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!zp())return!1;if(an.F())return!0;const e=Ye(),t=an.O(e),n=0<t&&t<10,s=_m(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static M(e,t){return e.store(t)}static O(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.L=null,an.O(Ye())===12.2&&qe("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async B(e){return this.db||(U(kt,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new Io(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new F(N.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new F(N.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Io(e,o))},s.onupgradeneeded=i=>{U(kt,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.U(o,s.transaction,i.oldVersion,this.version).next((()=>{U(kt,"Database upgrade to version "+this.version+" complete")}))}}))),this.k&&(this.db.onversionchange=t=>this.k(t)),this.db}q(e){this.k=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.B(e);const a=ru.open(this.db,e,i?"readonly":"readwrite",n),u=s(a).next((l=>(a.D(),l))).catch((l=>(a.abort(l),b.reject(l)))).toPromise();return u.catch((()=>{})),await a.S,u}catch(a){const u=a,l=u.name!=="FirebaseError"&&o<3;if(U(kt,"Transaction failed with error:",u.message,"Retrying:",l),this.close(),!l)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function _m(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class N5{constructor(e){this.$=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.$=e}done(){this.K=!0}j(e){this.W=e}delete(){return zr(this.$.delete())}}class Io extends F{constructor(e,t){super(N.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Nr(r){return r.name==="IndexedDbTransactionError"}class D5{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(U(kt,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(U(kt,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),zr(n)}add(e){return U(kt,"ADD",this.store.name,e,e),zr(this.store.add(e))}get(e){return zr(this.store.get(e)).next((t=>(t===void 0&&(t=null),U(kt,"GET",this.store.name,e,t),t)))}delete(e){return U(kt,"DELETE",this.store.name,e),zr(this.store.delete(e))}count(){return U(kt,"COUNT",this.store.name),zr(this.store.count())}H(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new b(((o,a)=>{i.onerror=u=>{a(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(n),o=[];return this.J(i,((a,u)=>{o.push(u)})).next((()=>o))}}Y(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new b(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}Z(e,t){U(kt,"DELETE ALL",this.store.name);const n=this.options(e,t);n.X=!1;const s=this.cursor(n);return this.J(s,((i,o,a)=>a.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.J(s,t)}te(e){const t=this.cursor({});return new b(((n,s)=>{t.onerror=i=>{const o=Oh(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((a=>{a?o.continue():n()})):n()}}))}J(e,t){const n=[];return new b(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void s();const u=new N5(a),l=t(a.primaryKey,a.value,u);if(l instanceof b){const d=l.catch((f=>(u.done(),b.reject(f))));n.push(d)}u.isDone?s():u.G===null?a.continue():a.continue(u.G)}})).next((()=>b.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function zr(r){return new b(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=Oh(n.target.error);t(s)}}))}let u2=!1;function Oh(r){const e=an.O(Ye());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new F("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return u2||(u2=!0,setTimeout((()=>{throw n}),0)),n}}return r}const To="IndexBackfiller";class V5{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(e){U(To,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.ne.ie();U(To,`Documents written: ${t}`)}catch(t){Nr(t)?U(To,"Ignoring IndexedDB error during index backfill: ",t):await Cr(t)}await this.re(6e4)}))}}class O5{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.se(t,e)))}se(e,t){const n=new Set;let s=t,i=!0;return b.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return U(To,`Processing collection: ${o}`),this._e(e,o,s).next((a=>{s-=a,n.add(o)}));i=!1})))).next((()=>t-s))}_e(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this.oe(s,i))).next((a=>(U(To,`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,t,a)))).next((()=>o.size))}))))}oe(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=pm(i);Vh(o,n)>0&&(n=o)})),new Lt(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Rt.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dr=-1;function oa(r){return r==null}function Qs(r){return r===0&&1/r==-1/0}function ym(r){return typeof r=="number"&&Number.isInteger(r)&&!Qs(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function k5(r){return typeof r=="string"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tc="";function pt(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=l2(e)),e=x5(r.get(t),e);return l2(e)}function x5(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Tc:t+="";break;default:t+=i}}return t}function l2(r){return r+Tc+""}function tn(r){const e=r.length;if(B(e>=2,64408,{path:r}),e===2)return B(r.charAt(0)===Tc&&r.charAt(1)==="",56145,{path:r}),ie.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(Tc,i);switch((o<0||o>t)&&W(50515,{path:r}),r.charAt(o+1)){case"":const a=r.substring(i,o);let u;s.length===0?u=a:(s+=a,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:W(61167,{path:r})}i=o+2}return new ie(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r="remoteDocuments",aa="owner",Ss="owner",Bo="mutationQueues",L5="userId",Gt="mutations",h2="batchId",Yr="userMutationsIndex",d2=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nc(r,e){return[r,pt(e)]}function Em(r,e,t){return[r,pt(e),t]}const M5={},Ys="documentMutations",wc="remoteDocumentsV14",F5=["prefixPath","collectionGroup","readTime","documentId"],rc="documentKeyIndex",U5=["prefixPath","collectionGroup","documentId"],Im="collectionGroupIndex",B5=["collectionGroup","readTime","prefixPath","documentId"],qo="remoteDocumentGlobal",xl="remoteDocumentGlobalKey",Xs="targets",Tm="queryTargetsIndex",q5=["canonicalId","targetId"],Js="targetDocuments",G5=["targetId","path"],kh="documentTargetsIndex",$5=["path","targetId"],Ac="targetGlobalKey",es="targetGlobal",Go="collectionParents",z5=["collectionId","parent"],Zs="clientMetadata",H5="clientId",su="bundles",j5="bundleId",iu="namedQueries",W5="name",xh="indexConfiguration",K5="indexId",Ll="collectionGroupIndex",Q5="collectionGroup",wo="indexState",Y5=["indexId","uid"],wm="sequenceNumberIndex",X5=["uid","sequenceNumber"],Ao="indexEntries",J5=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Am="documentKeyIndex",Z5=["indexId","uid","orderedDocumentKey"],ou="documentOverlays",ey=["userId","collectionPath","documentId"],Ml="collectionPathOverlayIndex",ty=["userId","collectionPath","largestBatchId"],vm="collectionGroupOverlayIndex",ny=["userId","collectionGroup","largestBatchId"],Lh="globals",ry="name",Rm=[Bo,Gt,Ys,$r,Xs,aa,es,Js,Zs,qo,Go,su,iu],sy=[...Rm,ou],Pm=[Bo,Gt,Ys,wc,Xs,aa,es,Js,Zs,qo,Go,su,iu,ou],Sm=Pm,Mh=[...Sm,xh,wo,Ao],iy=Mh,bm=[...Mh,Lh],oy=bm;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl extends gm{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function Ze(r,e){const t=H(r);return an.M(t.le,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e,t){this.comparator=e,this.root=t||ot.EMPTY}insert(e,t){return new Re(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ot.BLACK,null,null))}remove(e){return new Re(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ot.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new qa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new qa(this.root,e,this.comparator,!1)}getReverseIterator(){return new qa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new qa(this.root,e,this.comparator,!0)}}class qa{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ot{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??ot.RED,this.left=s??ot.EMPTY,this.right=i??ot.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new ot(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ot.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return ot.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ot.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ot.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw W(43730,{key:this.key,value:this.value});if(this.right.isRed())throw W(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw W(27949);return e+(this.isRed()?0:1)}}ot.EMPTY=null,ot.RED=!0,ot.BLACK=!1;ot.EMPTY=new class{constructor(){this.size=0}get key(){throw W(57766)}get value(){throw W(16141)}get color(){throw W(16727)}get left(){throw W(29726)}get right(){throw W(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new ot(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e){this.comparator=e,this.data=new Re(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new f2(this.data.getIterator())}getIteratorFrom(e){return new f2(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof Ee)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new Ee(this.comparator);return t.data=e,t}}class f2{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function bs(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e){this.fields=e,e.sort(ve.comparator)}static empty(){return new Pt([])}unionWith(e){let t=new Ee(ve.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Pt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Hs(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Dr(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Fh(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function Cm(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ay(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Nm("Invalid base64 string: "+i):i}})(e);return new Se(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new Se(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ne(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Se.EMPTY_BYTE_STRING=new Se("");const cy=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function xn(r){if(B(!!r,39018),typeof r=="string"){let e=0;const t=cy.exec(r);if(B(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:Pe(r.seconds),nanos:Pe(r.nanos)}}function Pe(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ln(r){return typeof r=="string"?Se.fromBase64String(r):Se.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dm="server_timestamp",Vm="__type__",Om="__previous_value__",km="__local_write_time__";function ca(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Vm])==null?void 0:n.stringValue)===Dm}function ua(r){const e=r.mapValue.fields[Om];return ca(e)?ua(e):e}function ei(r){const e=xn(r.mapValue.fields[km].timestampValue);return new _e(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uy{constructor(e,t,n,s,i,o,a,u,l,d,f){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=l,this.isUsingEmulator=d,this.apiKey=f}}const $o="(default)";class yr{constructor(e,t){this.projectId=e,this.database=t||$o}static empty(){return new yr("","")}get isDefaultDatabase(){return this.database===$o}isEqual(e){return e instanceof yr&&e.projectId===this.projectId&&e.database===this.database}}function ly(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new F(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new yr(r.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uh="__type__",xm="__max__",or={mapValue:{fields:{__type__:{stringValue:xm}}}},Bh="__vector__",rs="value",cn={nullValue:"NULL_VALUE"},Nt={booleanValue:!0},rt={booleanValue:!1};function We(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ca(r)?4:Lm(r)?9007199254740991:is(r)?10:11:W(28295,{value:r})}function Bt(r,e,t){if(r===e)return!0;const n=We(r);if(n!==We(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return ei(r).isEqual(ei(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const a=xn(i.timestampValue),u=xn(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,o){return Ln(i.bytesValue).isEqual(Ln(o.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,o){return Pe(i.geoPointValue.latitude)===Pe(o.geoPointValue.latitude)&&Pe(i.geoPointValue.longitude)===Pe(o.geoPointValue.longitude)})(r,e);case 2:return(function(i,o,a){if("integerValue"in i&&"integerValue"in o)return Pe(i.integerValue)===Pe(o.integerValue);let u,l;if("doubleValue"in i&&"doubleValue"in o)u=Pe(i.doubleValue),l=Pe(o.doubleValue);else{if(!(a!=null&&a.Ee))return!1;u=Pe(i.integerValue??i.doubleValue),l=Pe(o.integerValue??o.doubleValue)}return u===l?!!(a!=null&&a.he)||Qs(u)===Qs(l):!!(a===void 0||a.Te)&&isNaN(u)&&isNaN(l)})(r,e,t);case 9:return Hs(r.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>Bt(s,i,t)));case 10:case 11:return(function(i,o,a){const u=i.mapValue.fields||{},l=o.mapValue.fields||{};if(vc(u)!==vc(l))return!1;for(const d in u)if(u.hasOwnProperty(d)&&(l[d]===void 0||!Bt(u[d],l[d],a)))return!1;return!0})(r,e,t);default:return W(52216,{left:r})}}function zo(r,e){return(r.values||[]).find((t=>Bt(t,e)))!==void 0}function gt(r,e){if(r===e)return 0;const t=We(r),n=We(e);if(t!==n)return ne(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return ne(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const a=Pe(i.integerValue||i.doubleValue),u=Pe(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1})(r,e);case 3:return p2(r.timestampValue,e.timestampValue);case 4:return p2(ei(r),ei(e));case 5:return Ol(r.stringValue,e.stringValue);case 6:return(function(i,o){const a=Ln(i),u=Ln(o);return a.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const a=i.split("/"),u=o.split("/");for(let l=0;l<a.length&&l<u.length;l++){const d=ne(a[l],u[l]);if(d!==0)return d}return ne(a.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const a=ne(Pe(i.latitude),Pe(o.latitude));return a!==0?a:ne(Pe(i.longitude),Pe(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return m2(r.arrayValue,e.arrayValue);case 10:return(function(i,o){var g,I,R,O;const a=i.fields||{},u=o.fields||{},l=(g=a[rs])==null?void 0:g.arrayValue,d=(I=u[rs])==null?void 0:I.arrayValue,f=ne(((R=l==null?void 0:l.values)==null?void 0:R.length)||0,((O=d==null?void 0:d.values)==null?void 0:O.length)||0);return f!==0?f:m2(l,d)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===or.mapValue&&o===or.mapValue)return 0;if(i===or.mapValue)return 1;if(o===or.mapValue)return-1;const a=i.fields||{},u=Object.keys(a),l=o.fields||{},d=Object.keys(l);u.sort(),d.sort();for(let f=0;f<u.length&&f<d.length;++f){const g=Ol(u[f],d[f]);if(g!==0)return g;const I=gt(a[u[f]],l[d[f]]);if(I!==0)return I}return ne(u.length,d.length)})(r.mapValue,e.mapValue);default:throw W(23264,{Pe:t})}}function p2(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return ne(r,e);const t=xn(r),n=xn(e),s=ne(t.seconds,n.seconds);return s!==0?s:ne(t.nanos,n.nanos)}function m2(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=gt(t[s],n[s]);if(i!==void 0&&i!==0)return i}return ne(t.length,n.length)}function ti(r){return Ul(r)}function Ul(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=xn(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Ln(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return G.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=Ul(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${Ul(t.fields[o])}`;return s+"}"})(r.mapValue):W(61005,{value:r})}function sc(r){switch(We(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=ua(r);return e?16+sc(e):16;case 5:return 2*r.stringValue.length;case 6:return Ln(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+sc(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Dr(n.fields,((i,o)=>{s+=i.length+sc(o)})),s})(r.mapValue);default:throw W(13486,{value:r})}}function ss(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function nn(r){return!!r&&"integerValue"in r}function Xr(r){return!!r&&"doubleValue"in r}function Er(r){return nn(r)||Xr(r)}function Ir(r){return!!r&&"arrayValue"in r}function xt(r){return!!r&&"nullValue"in r}function Dt(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function ts(r){return!!r&&"mapValue"in r}function is(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Uh])==null?void 0:n.stringValue)===Bh}function Bl(r){var e,t;return(t=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[rs])==null?void 0:t.arrayValue}function vo(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Dr(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=vo(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=vo(r.arrayValue.values[t]);return e}return{...r}}function Lm(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===xm}const Mm={mapValue:{fields:{[Uh]:{stringValue:Bh},[rs]:{arrayValue:{}}}}};function hy(r){return"nullValue"in r?cn:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?ss(yr.empty(),G.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?is(r)?Mm:{mapValue:{}}:W(35942,{value:r})}function dy(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?ss(yr.empty(),G.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Mm:"mapValue"in r?is(r)?{mapValue:{}}:or:W(61959,{value:r})}function g2(r,e){const t=gt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function _2(r,e){const t=gt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this.value=e}static empty(){return new Qe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!ts(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=vo(t)}setAll(e){let t=ve.emptyPath(),n={},s=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=a.popLast()}o?n[a.lastSegment()]=vo(o):s.push(a.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());ts(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Bt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];ts(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Dr(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new Qe(vo(this.value))}}function Fm(r){const e=[];return Dr(r.fields,((t,n)=>{const s=new ve([t]);if(ts(n)){const i=Fm(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new Pt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function au(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Qs(e)?"-0":e}}function qh(r){return{integerValue:""+r}}function wi(r,e,t){return Number.isInteger(e)&&(t!=null&&t.preferIntegers)||ym(e)?qh(e):au(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cu{constructor(){this._=void 0}}function fy(r,e,t){return r instanceof ni?(function(s,i){const o={fields:{[Vm]:{stringValue:Dm},[km]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ca(i)&&(i=ua(i)),i&&(o.fields[Om]=i),{mapValue:o}})(t,e):r instanceof os?Bm(r,e):r instanceof as?qm(r,e):r instanceof cs?(function(s,i){const o=Um(s,i),a=Rc(o)+Rc(s.Re);return nn(o)&&nn(s.Re)?qh(a):au(s.serializer,a)})(r,e):r instanceof ri?(function(s,i){return y2(s,i,Math.min)})(r,e):r instanceof si?(function(s,i){return y2(s,i,Math.max)})(r,e):void 0}function py(r,e,t){return r instanceof os?Bm(r,e):r instanceof as?qm(r,e):t}function Um(r,e){return r instanceof cs?Er(e)?e:{integerValue:0}:null}class ni extends cu{}class os extends cu{constructor(e){super(),this.elements=e}}function Bm(r,e){const t=Gm(e);for(const n of r.elements)t.some((s=>Bt(s,n)))||t.push(n);return{arrayValue:{values:t}}}class as extends cu{constructor(e){super(),this.elements=e}}function qm(r,e){let t=Gm(e);for(const n of r.elements)t=t.filter((s=>!Bt(s,n)));return{arrayValue:{values:t}}}class Gh extends cu{constructor(e,t){super(),this.serializer=e,this.Re=t}}class cs extends Gh{}class ri extends Gh{}class si extends Gh{}function y2(r,e,t){if(!Er(e))return r.Re;const n=t(Rc(e),Rc(r.Re));return nn(e)&&nn(r.Re)?qh(n):au(r.serializer,n)}function Rc(r){return Pe(r.integerValue||r.doubleValue)}function Gm(r){return Ir(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(e,t){this.field=e,this.transform=t}}function my(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof os&&s instanceof os||n instanceof as&&s instanceof as?Hs(n.elements,s.elements,Bt):n instanceof cs&&s instanceof cs||n instanceof ri&&s instanceof ri||n instanceof si&&s instanceof si?Bt(n.Re,s.Re):n instanceof ni&&s instanceof ni})(r.transform,e.transform)}class gy{constructor(e,t){this.version=e,this.transformResults=t}}class Oe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Oe}static exists(e){return new Oe(void 0,e)}static updateTime(e){return new Oe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ic(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class uu{}function $m(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new vi(r.key,Oe.none()):new Ai(r.key,r.data,Oe.none());{const t=r.data,n=Qe.empty();let s=new Ee(ve.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new qn(r.key,n,new Pt(s.toArray()),Oe.none())}}function _y(r,e,t){r instanceof Ai?(function(s,i,o){const a=s.value.clone(),u=I2(s.fieldTransforms,i,o.transformResults);a.setAll(u),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()})(r,e,t):r instanceof qn?(function(s,i,o){if(!ic(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=I2(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(zm(s)),u.setAll(a),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Ro(r,e,t,n){return r instanceof Ai?(function(i,o,a,u){if(!ic(i.precondition,o))return a;const l=i.value.clone(),d=T2(i.fieldTransforms,u,o);return l.setAll(d),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(r,e,t,n):r instanceof qn?(function(i,o,a,u){if(!ic(i.precondition,o))return a;const l=T2(i.fieldTransforms,u,o),d=o.data;return d.setAll(zm(i)),d.setAll(l),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((f=>f.field)))})(r,e,t,n):(function(i,o,a){return ic(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a})(r,e,t)}function yy(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Um(n.transform,s||null);i!=null&&(t===null&&(t=Qe.empty()),t.set(n.field,i))}return t||null}function E2(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Hs(n,s,((i,o)=>my(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Ai extends uu{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class qn extends uu{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function zm(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function I2(r,e,t){const n=new Map;B(r.length===t.length,32656,{Ie:t.length,Ae:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,a=e.data.field(i.field);n.set(i.field,py(o,a,t[s]))}return n}function T2(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,fy(i,o,e))}return n}class vi extends uu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class $h extends uu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(e,t){this.position=e,this.inclusive=t}}function w2(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=G.comparator(G.fromName(o.referenceValue),t.key):n=gt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function A2(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Bt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm{}class pe extends jm{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new Ey(e,t,n):t==="array-contains"?new wy(e,n):t==="in"?new Jm(e,n):t==="not-in"?new Ay(e,n):t==="array-contains-any"?new vy(e,n):new pe(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Iy(e,n):new Ty(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(gt(t,this.value)):t!==null&&We(this.value)===We(t)&&this.matchesComparison(gt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return W(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ie extends jm{constructor(e,t){super(),this.filters=e,this.op=t,this.Ve=null}static create(e,t){return new Ie(e,t)}matches(e){return ii(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Ve!==null||(this.Ve=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Ve}getFilters(){return Object.assign([],this.filters)}}function ii(r){return r.op==="and"}function ql(r){return r.op==="or"}function zh(r){return Wm(r)&&ii(r)}function Wm(r){for(const e of r.filters)if(e instanceof Ie)return!1;return!0}function Gl(r){if(r instanceof pe)return r.field.canonicalString()+r.op.toString()+ti(r.value);if(zh(r))return r.filters.map((e=>Gl(e))).join(",");{const e=r.filters.map((t=>Gl(t))).join(",");return`${r.op}(${e})`}}function Km(r,e){return r instanceof pe?(function(n,s){return s instanceof pe&&n.op===s.op&&n.field.isEqual(s.field)&&Bt(n.value,s.value)})(r,e):r instanceof Ie?(function(n,s){return s instanceof Ie&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,a)=>i&&Km(o,s.filters[a])),!0):!1})(r,e):void W(19439)}function Qm(r,e){const t=r.filters.concat(e);return Ie.create(t,r.op)}function Ym(r){return r instanceof pe?(function(t){return`${t.field.canonicalString()} ${t.op} ${ti(t.value)}`})(r):r instanceof Ie?(function(t){return t.op.toString()+" {"+t.getFilters().map(Ym).join(" ,")+"}"})(r):"Filter"}class Ey extends pe{constructor(e,t,n){super(e,t,n),this.key=G.fromName(n.referenceValue)}matches(e){const t=G.comparator(e.key,this.key);return this.matchesComparison(t)}}class Iy extends pe{constructor(e,t){super(e,"in",t),this.keys=Xm("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Ty extends pe{constructor(e,t){super(e,"not-in",t),this.keys=Xm("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Xm(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>G.fromName(n.referenceValue)))}class wy extends pe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ir(t)&&zo(t.arrayValue,this.value)}}class Jm extends pe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&zo(this.value.arrayValue,t)}}class Ay extends pe{constructor(e,t){super(e,"not-in",t)}matches(e){if(zo(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!zo(this.value.arrayValue,t)}}class vy extends pe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ir(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>zo(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,t="asc"){this.field=e,this.dir=t}}function Ry(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e,t,n,s,i,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Ce(e,0,X.min(),X.min(),X.min(),Qe.empty(),0)}static newFoundDocument(e,t,n,s){return new Ce(e,1,t,X.min(),n,s,0)}static newNoDocument(e,t){return new Ce(e,2,t,X.min(),X.min(),Qe.empty(),0)}static newUnknownDocument(e,t){return new Ce(e,3,t,X.min(),X.min(),Qe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(X.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Qe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Qe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=X.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ce&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ce(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(e,t=null,n=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.de=null}}function $l(r,e=null,t=[],n=[],s=null,i=null,o=null){return new Py(r,e,t,n,s,i,o)}function Pc(r){const e=H(r);if(e.de===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Gl(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),oa(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>ti(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>ti(n))).join(",")),e.de=t}return e.de}function Hh(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Ry(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Km(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!A2(r.startAt,e.startAt)&&A2(r.endAt,e.endAt)}function vn(r){return!!r.isCorePipeline}function jh(r){return!!r.path&&G.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Sc(r,e){return r.filters.filter((t=>t instanceof pe&&t.field.isEqual(e)))}function v2(r,e,t){let n=cn,s=!0;for(const i of Sc(r,e)){let o=cn,a=!0;switch(i.op){case"<":case"<=":o=hy(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,a=!1;break;case"!=":case"not-in":o=cn}g2({value:n,inclusive:s},{value:o,inclusive:a})<0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];g2({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function R2(r,e,t){let n=or,s=!0;for(const i of Sc(r,e)){let o=or,a=!0;switch(i.op){case">=":case">":o=dy(i.value),a=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,a=!1;break;case"!=":case"not-in":o=or}_2({value:n,inclusive:s},{value:o,inclusive:a})>0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];_2({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(e,t=null,n=[],s=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.fe=null,this.me=null,this.pe=null,this.startAt,this.endAt}}function Zm(r,e,t,n,s,i,o,a){return new Gn(r,e,t,n,s,i,o,a)}function Ri(r){return new Gn(r)}function P2(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Sy(r){return G.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Wh(r){return r.collectionGroup!==null}function qs(r){const e=H(r);if(e.fe===null){e.fe=[];const t=new Set;for(const i of e.explicitOrderBy)e.fe.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Ee(ve.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(a=a.add(l.field))}))})),a})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.fe.push(new Ho(i,n))})),t.has(ve.keyField().canonicalString())||e.fe.push(new Ho(ve.keyField(),n))}return e.fe}function mt(r){const e=H(r);return e.me||(e.me=t0(e,qs(r))),e.me}function e0(r){const e=H(r);return e.pe||(e.pe=t0(e,r.explicitOrderBy)),e.pe}function t0(r,e){if(r.limitType==="F")return $l(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Ho(s.field,i)}));const t=r.endAt?new Tr(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Tr(r.startAt.position,r.startAt.inclusive):null;return $l(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function zl(r,e){const t=r.filters.concat([e]);return new Gn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function by(r,e){const t=r.explicitOrderBy.concat([e]);return new Gn(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function bc(r,e,t){return new Gn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Cy(r,e){return new Gn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,e,r.endAt)}function Ny(r,e){return new Gn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,r.startAt,e)}function n0(r,e){return Hh(mt(r),mt(e))&&r.limitType===e.limitType}function Po(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>Ym(s))).join(", ")}]`),oa(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>ti(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>ti(s))).join(",")),`Target(${n})`})(mt(r))}; limitType=${r.limitType})`}function lu(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):G.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of qs(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,a,u){const l=w2(o,a,u);return o.inclusive?l<=0:l<0})(n.startAt,qs(n),s)||n.endAt&&!(function(o,a,u){const l=w2(o,a,u);return o.inclusive?l>=0:l>0})(n.endAt,qs(n),s))})(r,e)}function Kh(r){return(e,t)=>{let n=!1;for(const s of qs(r)){const i=Dy(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function Dy(r,e,t){const n=r.field.isKeyField()?G.comparator(e.key,t.key):(function(i,o,a){const u=o.data.field(i),l=a.data.field(i);return u!==null&&l!==null?gt(u,l):W(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return W(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $e,me;function r0(r){switch(r){case N.OK:return W(64938);case N.CANCELLED:case N.UNKNOWN:case N.DEADLINE_EXCEEDED:case N.RESOURCE_EXHAUSTED:case N.INTERNAL:case N.UNAVAILABLE:case N.UNAUTHENTICATED:return!1;case N.INVALID_ARGUMENT:case N.NOT_FOUND:case N.ALREADY_EXISTS:case N.PERMISSION_DENIED:case N.FAILED_PRECONDITION:case N.ABORTED:case N.OUT_OF_RANGE:case N.UNIMPLEMENTED:case N.DATA_LOSS:return!0;default:return W(15467,{code:r})}}function s0(r){if(r===void 0)return qe("GRPC error has no .code"),N.UNKNOWN;switch(r){case $e.OK:return N.OK;case $e.CANCELLED:return N.CANCELLED;case $e.UNKNOWN:return N.UNKNOWN;case $e.DEADLINE_EXCEEDED:return N.DEADLINE_EXCEEDED;case $e.RESOURCE_EXHAUSTED:return N.RESOURCE_EXHAUSTED;case $e.INTERNAL:return N.INTERNAL;case $e.UNAVAILABLE:return N.UNAVAILABLE;case $e.UNAUTHENTICATED:return N.UNAUTHENTICATED;case $e.INVALID_ARGUMENT:return N.INVALID_ARGUMENT;case $e.NOT_FOUND:return N.NOT_FOUND;case $e.ALREADY_EXISTS:return N.ALREADY_EXISTS;case $e.PERMISSION_DENIED:return N.PERMISSION_DENIED;case $e.FAILED_PRECONDITION:return N.FAILED_PRECONDITION;case $e.ABORTED:return N.ABORTED;case $e.OUT_OF_RANGE:return N.OUT_OF_RANGE;case $e.UNIMPLEMENTED:return N.UNIMPLEMENTED;case $e.DATA_LOSS:return N.DATA_LOSS;default:return W(39323,{code:r})}}(me=$e||($e={}))[me.OK=0]="OK",me[me.CANCELLED=1]="CANCELLED",me[me.UNKNOWN=2]="UNKNOWN",me[me.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",me[me.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",me[me.NOT_FOUND=5]="NOT_FOUND",me[me.ALREADY_EXISTS=6]="ALREADY_EXISTS",me[me.PERMISSION_DENIED=7]="PERMISSION_DENIED",me[me.UNAUTHENTICATED=16]="UNAUTHENTICATED",me[me.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",me[me.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",me[me.ABORTED=10]="ABORTED",me[me.OUT_OF_RANGE=11]="OUT_OF_RANGE",me[me.UNIMPLEMENTED=12]="UNIMPLEMENTED",me[me.INTERNAL=13]="INTERNAL",me[me.UNAVAILABLE=14]="UNAVAILABLE",me[me.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Dr(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return Cm(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oy=new Re(G.comparator);function He(){return Oy}const i0=new Re(G.comparator);function Hr(...r){let e=i0;for(const t of r)e=e.insert(t.key,t);return e}function o0(r){let e=i0;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Ft(){return So()}function a0(){return So()}function So(){return new $n((r=>r.toString()),((r,e)=>r.isEqual(e)))}const ky=new Re(G.comparator),xy=new Ee(G.comparator);function se(...r){let e=xy;for(const t of r)e=e.add(t);return e}const Ly=new Ee(ne);function Qh(){return Ly}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let bo=null;function My(r){if(bo)throw new Error("a TestingHooksSpi instance is already set");bo=r}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c0(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fy=new hr([4294967295,4294967295],0);function S2(r){const e=c0().encode(r),t=new em;return t.update(e),new Uint8Array(t.digest())}function b2(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new hr([t,n],0),new hr([s,i],0)]}class Yh{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new lo(`Invalid padding: ${t}`);if(n<0)throw new lo(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new lo(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new lo(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.ye=hr.fromNumber(this.ge)}we(e,t,n){let s=e.add(t.multiply(hr.fromNumber(n)));return s.compare(Fy)===1&&(s=new hr([s.getBits(0),s.getBits(1)],0)),s.modulo(this.ye).toNumber()}be(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=S2(e),[n,s]=b2(t);for(let i=0;i<this.hashCount;i++){const o=this.we(n,s,i);if(!this.be(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Yh(i,s,t);return n.forEach((a=>o.insert(a))),o}insert(e){if(this.ge===0)return;const t=S2(e),[n,s]=b2(t);for(let i=0;i<this.hashCount;i++){const o=this.we(n,s,i);this.ve(o)}}ve(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class lo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(e,t,n,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,la.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Pi(X.min(),s,new Re(ne),He(),He(),se())}}class la{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new la(n,t,se(),se(),se())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc{constructor(e,t,n,s){this.Se=e,this.removedTargetIds=t,this.key=n,this.De=s}}class u0{constructor(e,t){this.targetId=e,this.xe=t}}class l0{constructor(e,t,n=Se.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class C2{constructor(e){this.targetId=e,this.Ce=0,this.Fe=N2(),this.Oe=Se.EMPTY_BYTE_STRING,this.Me=!1,this.Ne=!0}get current(){return this.Me}get resumeToken(){return this.Oe}get Le(){return this.Ce!==0}get Be(){return this.Ne}Ue(e){e.approximateByteSize()>0&&(this.Ne=!0,this.Oe=e)}ke(){let e=se(),t=se(),n=se();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:W(38017,{changeType:i})}})),new la(this.Oe,this.Me,e,t,n)}qe(){this.Ne=!1,this.Fe=N2()}$e(e,t){this.Ne=!0,this.Fe=this.Fe.insert(e,t)}Ke(e){this.Ne=!0,this.Fe=this.Fe.remove(e)}We(){this.Ce+=1}Qe(){this.Ce-=1,B(this.Ce>=0,3241,{Ce:this.Ce,targetId:this.targetId})}Ge(){this.Ne=!0,this.Me=!0}}const eo="WatchChangeAggregator";class Uy{constructor(e){this.ze=e,this.je=new Map,this.He=He(),this.Je=Ga(),this.Ye=He(),this.Ze=Ga(),this.Xe=new Re(ne)}et(e){for(const t of e.Se)e.De&&e.De.isFoundDocument()?this.tt(t,e.De):this.nt(t,e.key,e.De);for(const t of e.removedTargetIds)this.nt(t,e.key,e.De)}rt(e){this.forEachTarget(e,(t=>{const n=this.je.get(t);if(n)switch(e.state){case 0:this.it(t)&&n.Ue(e.resumeToken);break;case 1:n.Qe(),n.Le||n.qe(),n.Ue(e.resumeToken);break;case 2:n.Qe(),n.Le||this.removeTarget(t);break;case 3:this.it(t)&&(n.Ge(),n.Ue(e.resumeToken));break;case 4:this.it(t)&&(this.st(t),n.Ue(e.resumeToken));break;default:W(56790,{state:e.state})}else U(eo,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.je.forEach(((n,s)=>{this.it(s)&&t(s)}))}_t(e){var t;return vn(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:jh(e)}ot(e){const t=e.targetId,n=e.xe.count,s=this.ut(t);if(s){const i=s.target;if(this._t(i))if(n===0){const o=new G(vn(i)?ie.fromString(i.getPipelineDocuments()[0]):i.path);this.nt(t,o,Ce.newNoDocument(o,X.min()))}else B(n===1,20013,"Single document existence filter with count: "+n);else{const o=this.ct(t);if(o!==n){const a=this.lt(e),u=a?this.Et(a,e,o):1;if(u!==0){this.st(t);const l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Xe=this.Xe.insert(t,l)}bo==null||bo.u((function(d,f,g,I,R){var z,Z,Q;const O={localCacheCount:d,existenceFilterCount:f.count,databaseId:g.database,projectId:g.projectId},x=f.unchangedNames;return x&&(O.bloomFilter={applied:R===0,hashCount:(x==null?void 0:x.hashCount)??0,bitmapLength:((Z=(z=x==null?void 0:x.bits)==null?void 0:z.bitmap)==null?void 0:Z.length)??0,padding:((Q=x==null?void 0:x.bits)==null?void 0:Q.padding)??0,mightContain:oe=>(I==null?void 0:I.mightContain(oe))??!1}),O})(o,e.xe,this.ze.Tt(),a,u))}}}}lt(e){const t=e.xe.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,a;try{o=Ln(n).toUint8Array()}catch(u){if(u instanceof Nm)return Xe("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new Yh(o,s,i)}catch(u){return Xe(u instanceof lo?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.ge===0?null:a}Et(e,t,n){return t.xe.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.ze.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.ze.Tt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.nt(t,i,null),s++)})),s}Rt(e){const t=new Map;this.je.forEach(((i,o)=>{const a=this.ut(o);if(a){if(i.current&&this._t(a.target)){const u=vn(a.target)?ie.fromString(a.target.getPipelineDocuments()[0]):a.target.path,l=new G(u);this.It(l).has(o)||this.At(o,l)||this.nt(o,l,Ce.newNoDocument(l,e))}i.Be&&(t.set(o,i.ke()),i.qe())}}));let n=se();this.Ze.forEach(((i,o)=>{let a=!0;o.forEachWhile((u=>{const l=this.ut(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(n=n.add(i))})),this.He.forEach(((i,o)=>o.setReadTime(e))),this.Ye.forEach(((i,o)=>o.setReadTime(e)));const s=new Pi(e,t,this.Xe,this.He,this.Ye,n);return this.He=He(),this.Je=Ga(),this.Ye=He(),this.Ze=Ga(),this.Xe=new Re(ne),s}tt(e,t){const n=this.je.get(e);if(!n||!this.it(e))return void U(eo,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.At(e,t.key)?2:0;n.$e(t.key,s),vn(this.ut(e).target)&&this.ut(e).target.getPipelineFlavor()!=="exact"?this.Ye=this.Ye.insert(t.key,t):this.He=this.He.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.Ze=this.Ze.insert(t.key,this.Vt(t.key).add(e))}nt(e,t,n){const s=this.je.get(e);s&&this.it(e)?(this.At(e,t)?s.$e(t,1):s.Ke(t),this.Ze=this.Ze.insert(t,this.Vt(t).delete(e)),this.Ze=this.Ze.insert(t,this.Vt(t).add(e)),n&&(vn(this.ut(e).target)&&this.ut(e).target.getPipelineFlavor()!=="exact"?this.Ye=this.Ye.insert(t,n):this.He=this.He.insert(t,n))):U(eo,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.je.delete(e)}ct(e){const t=this.je.get(e);if(!t)return 0;const n=t.ke();return this.ze.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}We(e){let t=this.je.get(e);t||(U(eo,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new C2(e),this.je.set(e,t)),t.We()}Vt(e){let t=this.Ze.get(e);return t||(t=new Ee(ne),this.Ze=this.Ze.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new Ee(ne),this.Je=this.Je.insert(e,t)),t}it(e){const t=this.ut(e)!==null;return t||U(eo,"Detected inactive target",e),t}ut(e){const t=this.je.get(e);return t===void 0||t.Le?null:this.ze.dt(e)}st(e){this.je.set(e,new C2(e)),this.ze.getRemoteKeysForTarget(e).forEach((t=>{this.nt(e,t,null)}))}At(e,t){return this.ze.getRemoteKeysForTarget(e).has(t)}}function Ga(){return new Re(G.comparator)}function N2(){return new Re(G.comparator)}const By={asc:"ASCENDING",desc:"DESCENDING"},qy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Gy={and:"AND",or:"OR"};class $y{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Hl(r,e){return r.useProto3Json||oa(e)?e:{value:e}}function oi(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Xh(r){const e=xn(r);return new _e(e.seconds,e.nanos)}function h0(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function ac(r,e){return oi(r,e.toTimestamp())}function Ge(r){return B(!!r,49232),X.fromTimestamp(Xh(r))}function Jh(r,e){return jl(r,e).canonicalString()}function jl(r,e){const t=(function(s){return new ie(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function d0(r){const e=ie.fromString(r);return B(w0(e),10190,{key:e.toString()}),e}function ai(r,e){return Jh(r.databaseId,e.path)}function un(r,e){const t=d0(e);if(t.get(1)!==r.databaseId.projectId)throw new F(N.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new F(N.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new G(m0(t))}function f0(r,e){return Jh(r.databaseId,e)}function p0(r){const e=d0(r);return e.length===4?ie.emptyPath():m0(e)}function Wl(r){return new ie(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function m0(r){return B(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function D2(r,e,t){return{name:ai(r,e),fields:t.value.mapValue.fields}}function hu(r,e,t){const n=un(r,e.name),s=Ge(e.updateTime),i=e.createTime?Ge(e.createTime):X.min(),o=new Qe({mapValue:{fields:e.fields}}),a=Ce.newFoundDocument(n,s,i,o);return t&&a.setHasCommittedMutations(),t?a.setHasCommittedMutations():a}function zy(r,e){return"found"in e?(function(n,s){B(!!s.found,43571),s.found.name,s.found.updateTime;const i=un(n,s.found.name),o=Ge(s.found.updateTime),a=s.found.createTime?Ge(s.found.createTime):X.min(),u=new Qe({mapValue:{fields:s.found.fields}});return Ce.newFoundDocument(i,o,a,u)})(r,e):"missing"in e?(function(n,s){B(!!s.missing,3894),B(!!s.readTime,22933);const i=un(n,s.missing),o=Ge(s.readTime);return Ce.newNoDocument(i,o)})(r,e):W(7234,{result:e})}function Hy(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:W(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,d){return l.useProto3Json?(B(d===void 0||typeof d=="string",58123),Se.fromBase64String(d||"")):(B(d===void 0||d instanceof Buffer||d instanceof Uint8Array,16193),Se.fromUint8Array(d||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&(function(l){const d=l.code===void 0?N.UNKNOWN:s0(l.code);return new F(d,l.message||"")})(o);t=new l0(n,s,i,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=un(r,n.document.name),i=Ge(n.document.updateTime),o=n.document.createTime?Ge(n.document.createTime):X.min(),a=new Qe({mapValue:{fields:n.document.fields}}),u=Ce.newFoundDocument(s,i,o,a),l=n.targetIds||[],d=n.removedTargetIds||[];t=new oc(l,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=un(r,n.document),i=n.readTime?Ge(n.readTime):X.min(),o=Ce.newNoDocument(s,i),a=n.removedTargetIds||[];t=new oc([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=un(r,n.document),i=n.removedTargetIds||[];t=new oc([],i,s,null)}else{if(!("filter"in e))return W(11601,{ft:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new Vy(s,i),a=n.targetId;t=new u0(a,o)}}return t}function jo(r,e){let t;if(e instanceof Ai)t={update:D2(r,e.key,e.value)};else if(e instanceof vi)t={delete:ai(r,e.key)};else if(e instanceof qn)t={update:D2(r,e.key,e.data),updateMask:Xy(e.fieldMask)};else{if(!(e instanceof $h))return W(16599,{gt:e.type});t={verify:ai(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const a=o.transform;if(a instanceof ni)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof os)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof as)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof cs)return{fieldPath:o.field.canonicalString(),increment:a.Re};if(a instanceof ri)return{fieldPath:o.field.canonicalString(),minimum:a.Re};if(a instanceof si)return{fieldPath:o.field.canonicalString(),maximum:a.Re};throw W(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:ac(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:W(27497)})(r,e.precondition)),t}function Kl(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?Oe.updateTime(Ge(i.updateTime)):i.exists!==void 0?Oe.exists(i.exists):Oe.none()})(e.currentDocument):Oe.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,a){let u=null;if("setToServerValue"in a)B(a.setToServerValue==="REQUEST_TIME",16630,{proto:a}),u=new ni;else if("appendMissingElements"in a){const d=a.appendMissingElements.values||[];u=new os(d)}else if("removeAllFromArray"in a){const d=a.removeAllFromArray.values||[];u=new as(d)}else"increment"in a?u=new cs(o,a.increment):"minimum"in a?u=new ri(o,a.minimum):"maximum"in a?u=new si(o,a.maximum):W(16584,{proto:a});const l=ve.fromServerFormat(a.fieldPath);return new gs(l,u)})(r,s))):[];if(e.update){e.update.name;const s=un(r,e.update.name),i=new Qe({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const l=u.fieldPaths||[];return new Pt(l.map((d=>ve.fromServerFormat(d))))})(e.updateMask);return new qn(s,i,o,t,n)}return new Ai(s,i,t,n)}if(e.delete){const s=un(r,e.delete);return new vi(s,t)}if(e.verify){const s=un(r,e.verify);return new $h(s,t)}return W(1463,{proto:e})}function jy(r,e){return r&&r.length>0?(B(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?Ge(s.updateTime):Ge(i);return o.isEqual(X.min())&&(o=Ge(i)),new gy(o,s.transformResults||[])})(t,e)))):[]}function g0(r,e){return{documents:[f0(r,e.path)]}}function du(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=f0(r,s);const i=(function(l){if(l.length!==0)return T0(Ie.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(l){if(l.length!==0)return l.map((d=>(function(g){return{field:sr(g.field),direction:Ky(g.dir)}})(d)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=Hl(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{yt:t,parent:s}}function _0(r,e,t,n){const{yt:s,parent:i}=du(r,e),o={},a=[];let u=0;return t.forEach((l=>{const d=n?l.alias:"aggregate_"+u++;o[d]=l.alias,l.aggregateType==="count"?a.push({alias:d,count:{}}):l.aggregateType==="avg"?a.push({alias:d,avg:{field:sr(l.fieldPath)}}):l.aggregateType==="sum"&&a.push({alias:d,sum:{field:sr(l.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:s.structuredQuery},parent:s.parent},wt:o,parent:i}}function y0(r){let e=p0(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){B(n===1,65062);const d=t.from[0];d.allDescendants?s=d.collectionId:e=e.child(d.collectionId)}let i=[];t.where&&(i=(function(f){const g=I0(f);return g instanceof Ie&&zh(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(f){return f.map((g=>(function(R){return new Ho(xs(R.field),(function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(R.direction))})(g)))})(t.orderBy));let a=null;t.limit&&(a=(function(f){let g;return g=typeof f=="object"?f.value:f,oa(g)?null:g})(t.limit));let u=null;t.startAt&&(u=(function(f){const g=!!f.before,I=f.values||[];return new Tr(I,g)})(t.startAt));let l=null;return t.endAt&&(l=(function(f){const g=!f.before,I=f.values||[];return new Tr(I,g)})(t.endAt)),Zm(e,s,o,i,a,"F",u,l)}function Wy(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return W(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function E0(r,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(r)))}}}}function I0(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=xs(t.unaryFilter.field);return pe.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=xs(t.unaryFilter.field);return pe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=xs(t.unaryFilter.field);return pe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=xs(t.unaryFilter.field);return pe.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return W(61313);default:return W(60726)}})(r):r.fieldFilter!==void 0?(function(t){return pe.create(xs(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return W(58110);default:return W(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return Ie.create(t.compositeFilter.filters.map((n=>I0(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return W(1026)}})(t.compositeFilter.op))})(r):W(30097,{filter:r})}function Ky(r){return By[r]}function Qy(r){return qy[r]}function Yy(r){return Gy[r]}function sr(r){return{fieldPath:r.canonicalString()}}function xs(r){return ve.fromServerFormat(r.fieldPath)}function T0(r){return r instanceof pe?(function(t){if(t.op==="=="){if(Dt(t.value))return{unaryFilter:{field:sr(t.field),op:"IS_NAN"}};if(xt(t.value))return{unaryFilter:{field:sr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Dt(t.value))return{unaryFilter:{field:sr(t.field),op:"IS_NOT_NAN"}};if(xt(t.value))return{unaryFilter:{field:sr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:sr(t.field),op:Qy(t.op),value:t.value}}})(r):r instanceof Ie?(function(t){const n=t.getFilters().map((s=>T0(s)));return n.length===1?n[0]:{compositeFilter:{op:Yy(t.op),filters:n}}})(r):W(54877,{filter:r})}function Xy(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function w0(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function A0(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function Wo(r,e){const t={fields:{}};return e.forEach(((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=n._toProto(r)})),{mapValue:t}}function v0(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _s(r){return new $y(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new vt(Se.fromBase64String(e))}catch(t){throw new F(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new vt(Se.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:vt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ms(e,vt._jsonSchema))return vt.fromBase64String(e.bytes)}}vt._jsonSchemaVersion="firestore/bytes/1.0",vt._jsonSchema={type:je("string",vt._jsonSchemaVersion),bytes:je("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new F(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ve(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function R0(){return new ys(en)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new F(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new F(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ne(this._lat,e._lat)||ne(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ht._jsonSchemaVersion}}static fromJSON(e){if(ms(e,Ht._jsonSchema))return new Ht(e.latitude,e.longitude)}}function P0(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ht._jsonSchemaVersion="firestore/geoPoint/1.0",Ht._jsonSchema={type:je("string",Ht._jsonSchemaVersion),latitude:je("number"),longitude:je("number")};class Jy{bt(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V2="ConnectivityMonitor";class O2{constructor(){this.vt=()=>this.St(),this.Dt=()=>this.xt(),this.Ct=[],this.Ft()}bt(e){this.Ct.push(e)}shutdown(){window.removeEventListener("online",this.vt),window.removeEventListener("offline",this.Dt)}Ft(){window.addEventListener("online",this.vt),window.addEventListener("offline",this.Dt)}St(){U(V2,"Network connectivity changed: AVAILABLE");for(const e of this.Ct)e(0)}xt(){U(V2,"Network connectivity changed: UNAVAILABLE");for(const e of this.Ct)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $a=null;function Ql(){return $a===null?$a=(function(){return 268435456+Math.round(2147483648*Math.random())})():$a++,"0x"+$a.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pl="RestConnection",Zy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class eE{get Ot(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Mt=t+"://"+e.host,this.Nt=`projects/${n}/databases/${s}`,this.Lt=this.databaseId.database===$o?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Bt(e,t,n,s,i){const o=Ql(),a=this.Ut(e,t.toUriEncodedString());U(pl,`Sending RPC '${e}' ${o}:`,a,n);const u={"google-cloud-resource-prefix":this.Nt,"x-goog-request-params":this.Lt};this.kt(u,s,i);const{host:l}=new URL(a),d=ds(l);return this.qt(e,a,u,n,d).then((f=>(U(pl,`Received RPC '${e}' ${o}: `,f),f)),(f=>{throw Xe(pl,`RPC '${e}' ${o} failed with error: `,f,"url: ",a,"request:",n),f}))}$t(e,t,n,s,i,o){return this.Bt(e,t,n,s,i)}kt(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Ti})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}Ut(e,t){const n=Zy[e];let s=`${this.Mt}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tE{constructor(e){this.Kt=e.Kt,this.Wt=e.Wt}Qt(e){this.Gt=e}zt(e){this.jt=e}Ht(e){this.Jt=e}onMessage(e){this.Yt=e}close(){this.Wt()}send(e){this.Kt(e)}Zt(){this.Gt()}Xt(){this.jt()}en(e){this.Jt(e)}tn(e){this.Yt(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ut="WebChannelConnection",to=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Gs extends eE{constructor(e){super(e),this.nn=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static rn(){if(!Gs.sn){const e=sm();to(e,rm.STAT_EVENT,(t=>{t.stat===Nl.PROXY?U(ut,"STAT_EVENT: detected buffering proxy"):t.stat===Nl.NOPROXY&&U(ut,"STAT_EVENT: detected no buffering proxy")})),Gs.sn=!0}}qt(e,t,n,s,i){const o=Ql();return new Promise(((a,u)=>{const l=new tm;l.setWithCredentials(!0),l.listenOnce(nm.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case tc.NO_ERROR:const f=l.getResponseJson();U(ut,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(f)),a(f);break;case tc.TIMEOUT:U(ut,`RPC '${e}' ${o} timed out`),u(new F(N.DEADLINE_EXCEEDED,"Request time out"));break;case tc.HTTP_ERROR:const g=l.getStatus();if(U(ut,`RPC '${e}' ${o} failed with status:`,g,"response text:",l.getResponseText()),g>0){let I=l.getResponseJson();Array.isArray(I)&&(I=I[0]);const R=I==null?void 0:I.error;if(R&&R.status&&R.message){const O=(function(z){const Z=z.toLowerCase().replace(/_/g,"-");return Object.values(N).indexOf(Z)>=0?Z:N.UNKNOWN})(R.status);u(new F(O,R.message))}else u(new F(N.UNKNOWN,"Server responded with status "+l.getStatus()))}else u(new F(N.UNAVAILABLE,"Connection failed."));break;default:W(9055,{_n:e,streamId:o,an:l.getLastErrorCode(),un:l.getLastError()})}}finally{U(ut,`RPC '${e}' ${o} completed.`)}}));const d=JSON.stringify(s);U(ut,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",d,n,15)}))}cn(e,t,n){const s=Ql(),i=[this.Mt,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(a.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(a.useFetchStreams=!0),this.kt(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const l=i.join("");U(ut,`Creating RPC '${e}' stream ${s}: ${l}`,a);const d=o.createWebChannel(l,a);this.En(d);let f=!1,g=!1;const I=new tE({Kt:R=>{g?U(ut,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(f||(U(ut,`Opening RPC '${e}' stream ${s} transport.`),d.open(),f=!0),U(ut,`RPC '${e}' stream ${s} sending:`,R),d.send(R))},Wt:()=>d.close()});return to(d,uo.EventType.OPEN,(()=>{g||(U(ut,`RPC '${e}' stream ${s} transport opened.`),I.Zt())})),to(d,uo.EventType.CLOSE,(()=>{g||(g=!0,U(ut,`RPC '${e}' stream ${s} transport closed`),I.en(),this.hn(d))})),to(d,uo.EventType.ERROR,(R=>{g||(g=!0,Xe(ut,`RPC '${e}' stream ${s} transport errored. Name:`,R.name,"Message:",R.message),I.en(new F(N.UNAVAILABLE,"The operation could not be completed")))})),to(d,uo.EventType.MESSAGE,(R=>{var O;if(!g){const x=R.data[0];B(!!x,16349);const z=x,Z=(z==null?void 0:z.error)||((O=z[0])==null?void 0:O.error);if(Z){U(ut,`RPC '${e}' stream ${s} received error:`,Z);const Q=Z.status;let oe=(function(A){const E=$e[A];if(E!==void 0)return s0(E)})(Q),le=Z.message;Q==="NOT_FOUND"&&le.includes("database")&&le.includes("does not exist")&&le.includes(this.databaseId.database)&&Xe(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),oe===void 0&&(oe=N.INTERNAL,le="Unknown error status: "+Q+" with message "+Z.message),g=!0,I.en(new F(oe,le)),d.close()}else U(ut,`RPC '${e}' stream ${s} received:`,x),I.tn(x)}})),Gs.rn(),setTimeout((()=>{I.Xt()}),0),I}terminate(){this.nn.forEach((e=>e.close())),this.nn=[]}En(e){this.nn.push(e)}hn(e){this.nn=this.nn.filter((t=>t===e))}kt(e,t,n){super.kt(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return im()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nE(r){return new Gs(r)}Gs.sn=!1;class Zh{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Tn=e,this.timerId=t,this.Pn=n,this.Rn=s,this.In=i,this.An=0,this.Vn=null,this.dn=Date.now(),this.reset()}reset(){this.An=0}fn(){this.An=this.In}mn(e){this.cancel();const t=Math.floor(this.An+this.pn()),n=Math.max(0,Date.now()-this.dn),s=Math.max(0,t-n);s>0&&U("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.An} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Vn=this.Tn.enqueueAfterDelay(this.timerId,s,(()=>(this.dn=Date.now(),e()))),this.An*=this.Rn,this.An<this.Pn&&(this.An=this.Pn),this.An>this.In&&(this.An=this.In)}gn(){this.Vn!==null&&(this.Vn.skipDelay(),this.Vn=null)}cancel(){this.Vn!==null&&(this.Vn.cancel(),this.Vn=null)}pn(){return(Math.random()-.5)*this.An}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k2="PersistentStream";class S0{constructor(e,t,n,s,i,o,a,u){this.Tn=e,this.yn=n,this.wn=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.bn=0,this.vn=null,this.Sn=null,this.stream=null,this.Dn=0,this.xn=new Zh(e,t)}Cn(){return this.state===1||this.state===5||this.Fn()}Fn(){return this.state===2||this.state===3}start(){this.Dn=0,this.state!==4?this.auth():this.On()}async stop(){this.Cn()&&await this.close(0)}Mn(){this.state=0,this.xn.reset()}Nn(){this.Fn()&&this.vn===null&&(this.vn=this.Tn.enqueueAfterDelay(this.yn,6e4,(()=>this.Ln())))}Bn(e){this.Un(),this.stream.send(e)}async Ln(){if(this.Fn())return this.close(0)}Un(){this.vn&&(this.vn.cancel(),this.vn=null)}kn(){this.Sn&&(this.Sn.cancel(),this.Sn=null)}async close(e,t){this.Un(),this.kn(),this.xn.cancel(),this.bn++,e!==4?this.xn.reset():t&&t.code===N.RESOURCE_EXHAUSTED?(qe(t.toString()),qe("Using maximum backoff delay to prevent overloading the backend."),this.xn.fn()):t&&t.code===N.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.qn(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Ht(t)}qn(){}auth(){this.state=1;const e=this.$n(this.bn),t=this.bn;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.bn===t&&this.Kn(n,s)}),(n=>{e((()=>{const s=new F(N.UNKNOWN,"Fetching auth token failed: "+n.message);return this.Wn(s)}))}))}Kn(e,t){const n=this.$n(this.bn);this.stream=this.Qn(e,t),this.stream.Qt((()=>{n((()=>this.listener.Qt()))})),this.stream.zt((()=>{n((()=>(this.state=2,this.Sn=this.Tn.enqueueAfterDelay(this.wn,1e4,(()=>(this.Fn()&&(this.state=3),Promise.resolve()))),this.listener.zt())))})),this.stream.Ht((s=>{n((()=>this.Wn(s)))})),this.stream.onMessage((s=>{n((()=>++this.Dn==1?this.Gn(s):this.onNext(s)))}))}On(){this.state=5,this.xn.mn((async()=>{this.state=0,this.start()}))}Wn(e){return U(k2,`close with error: ${e}`),this.stream=null,this.close(4,e)}$n(e){return t=>{this.Tn.enqueueAndForget((()=>this.bn===e?t():(U(k2,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class rE extends S0{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}Qn(e,t){return this.connection.cn("Listen",e,t)}Gn(e){return this.onNext(e)}onNext(e){this.xn.reset();const t=Hy(this.serializer,e),n=(function(i){if(!("targetChange"in i))return X.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?X.min():o.readTime?Ge(o.readTime):X.min()})(e);return this.listener.zn(t,n)}jn(e){const t={};t.database=Wl(this.serializer),t.addTarget=(function(i,o){let a;const u=o.target;if(a=vn(u)?{pipelineQuery:E0(i,u)}:jh(u)?{documents:g0(i,u)}:{query:du(i,u).yt},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=h0(i,o.resumeToken);const l=Hl(i,o.expectedCount);l!==null&&(a.expectedCount=l)}else if(o.snapshotVersion.compareTo(X.min())>0){a.readTime=oi(i,o.snapshotVersion.toTimestamp());const l=Hl(i,o.expectedCount);l!==null&&(a.expectedCount=l)}return a})(this.serializer,e);const n=Wy(this.serializer,e);n&&(t.labels=n),this.Bn(t)}Hn(e){const t={};t.database=Wl(this.serializer),t.removeTarget=e,this.Bn(t)}}class sE extends S0{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Jn(){return this.Dn>0}start(){this.lastStreamToken=void 0,super.start()}qn(){this.Jn&&this.Yn([])}Qn(e,t){return this.connection.cn("Write",e,t)}Gn(e){return B(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,B(!e.writeResults||e.writeResults.length===0,55816),this.listener.Zn()}onNext(e){B(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.xn.reset();const t=jy(e.writeResults,e.commitTime),n=Ge(e.commitTime);return this.listener.Xn(n,t)}er(){const e={};e.database=Wl(this.serializer),this.Bn(e)}Yn(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>jo(this.serializer,n)))};this.Bn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iE{}class oE extends iE{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.tr=!1}nr(){if(this.tr)throw new F(N.FAILED_PRECONDITION,"The client has already been terminated.")}Bt(e,t,n,s){return this.nr(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Bt(e,jl(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new F(N.UNKNOWN,i.toString())}))}$t(e,t,n,s,i){return this.nr(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.$t(e,jl(t,n),s,o,a,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new F(N.UNKNOWN,o.toString())}))}terminate(){this.tr=!0,this.connection.terminate()}}function aE(r,e,t,n){return new oE(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cE="ComponentProvider",x2=new Map;function uE(r,e,t,n,s){return new uy(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,P0(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L2={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},b0=41943040;class dt{static withCacheSize(e){return new dt(e,dt.DEFAULT_COLLECTION_PERCENTILE,dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}dt.DEFAULT_COLLECTION_PERCENTILE=10,dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,dt.DEFAULT=new dt(b0,dt.DEFAULT_COLLECTION_PERCENTILE,dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),dt.DISABLED=new dt(-1,0,0);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M2="LruGarbageCollector",C0=1048576;function F2([r,e],[t,n]){const s=ne(r,t);return s===0?ne(e,n):s}class lE{constructor(e){this.rr=e,this.buffer=new Ee(F2),this.ir=0}sr(){return++this.ir}_r(e){const t=[e,this.sr()];if(this.buffer.size<this.rr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();F2(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class N0{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.ur(6e4)}stop(){this.ar&&(this.ar.cancel(),this.ar=null)}get started(){return this.ar!==null}ur(e){U(M2,`Garbage collection scheduled in ${e}ms`),this.ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Nr(t)?U(M2,"Ignoring IndexedDB error during garbage collection: ",t):await Cr(t)}await this.ur(3e5)}))}}class hE{constructor(e,t){this.cr=e,this.params=t}calculateTargetCount(e,t){return this.cr.lr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return b.resolve(Rt.ce);const n=new lE(t);return this.cr.forEachTarget(e,(s=>n._r(s.sequenceNumber))).next((()=>this.cr.Er(e,(s=>n._r(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.cr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.cr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(U("LruGarbageCollector","Garbage collection skipped; disabled"),b.resolve(L2)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(U("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),L2):this.hr(e,t)))}getCacheSize(e){return this.cr.getCacheSize(e)}hr(e,t){let n,s,i,o,a,u,l;const d=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((f=>(f>this.params.maximumSequenceNumbersToCollect?(U("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${f}`),s=this.params.maximumSequenceNumbersToCollect):s=f,o=Date.now(),this.nthSequenceNumber(e,s)))).next((f=>(n=f,a=Date.now(),this.removeTargets(e,n,t)))).next((f=>(i=f,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((f=>(l=Date.now(),ks()<=fe.DEBUG&&U("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-d}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${f} documents in `+(l-u)+`ms
Total Duration: ${l-d}ms`),b.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:f}))))}}function D0(r,e){return new hE(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V0="firestore.googleapis.com",U2=!0;class B2{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new F(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=V0,this.ssl=U2}else this.host=e.host,this.ssl=e.ssl??U2;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=b0;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<C0)throw new F(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}hm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=P0(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new F(N.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new F(N.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new F(N.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ha{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new B2({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new F(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new F(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new B2(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new um;switch(n.type){case"firstParty":return new T5(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new F(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=x2.get(t);n&&(U(cE,"Removing Datastore"),x2.delete(t),n.terminate())})(this),Promise.resolve()}}function O0(r,e,t,n={}){var l;r=he(r,ha);const s=ds(e),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},a=`${e}:${t}`;s&&$c(`https://${a}`),i.host!==V0&&i.host!==a&&Xe("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:a,ssl:s,emulatorOptions:n};if(!Wt(u,o)&&(r._setSettings(u),n.mockUserToken)){let d,f;if(typeof n.mockUserToken=="string")d=n.mockUserToken,f=nt.MOCK_USER;else{d=Bp(n.mockUserToken,(l=r._app)==null?void 0:l.options.projectId);const g=n.mockUserToken.sub||n.mockUserToken.user_id;if(!g)throw new F(N.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");f=new nt(g)}r._authCredentials=new y5(new cm(d,f))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Je(this.firestore,e,this._query)}}class ye{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new jt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ye(this.firestore,e,this._key)}toJSON(){return{type:ye._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(ms(t,ye._jsonSchema))return new ye(e,n||null,new G(ie.fromString(t.referencePath)))}}ye._jsonSchemaVersion="firestore/documentReference/1.0",ye._jsonSchema={type:je("string",ye._jsonSchemaVersion),referencePath:je("string")};class jt extends Je{constructor(e,t,n){super(e,t,Ri(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ye(this.firestore,null,new G(e))}withConverter(e){return new jt(this.firestore,e,this._path)}}function dE(r,e,...t){if(r=Y(r),Dh("collection","path",e),r instanceof ha){const n=ie.fromString(e,...t);return o2(n),new jt(r,null,n)}{if(!(r instanceof ye||r instanceof jt))throw new F(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(ie.fromString(e,...t));return o2(n),new jt(r.firestore,null,n)}}function fE(r,e){if(r=he(r,ha),Dh("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new F(N.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Je(r,null,(function(n){return new Gn(ie.emptyPath(),n)})(e))}function k0(r,e,...t){if(r=Y(r),arguments.length===1&&(e=tu.newId()),Dh("doc","path",e),r instanceof ha){const n=ie.fromString(e,...t);return i2(n),new ye(r,null,new G(n))}{if(!(r instanceof ye||r instanceof jt))throw new F(N.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(ie.fromString(e,...t));return i2(n),new ye(r.firestore,r instanceof jt?r.converter:null,new G(n))}}function pE(r,e){return r=Y(r),e=Y(e),(r instanceof ye||r instanceof jt)&&(e instanceof ye||e instanceof jt)&&r.firestore===e.firestore&&r.path===e.path&&r.converter===e.converter}function e1(r,e){return r=Y(r),e=Y(e),r instanceof Je&&e instanceof Je&&r.firestore===e.firestore&&n0(r._query,e._query)&&r.converter===e.converter}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:wt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ms(e,wt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new wt(e.vectorValues);throw new F(N.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}wt._jsonSchemaVersion="firestore/vectorValue/1.0",wt._jsonSchema={type:je("string",wt._jsonSchemaVersion),vectorValues:je("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mE=/^__.*__$/;class gE{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new qn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ai(e,this.data,t,this.fieldTransforms)}}class x0{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new qn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function L0(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw W(40011,{dataSource:r})}}class fu{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new fu({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Cc(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(L0(this.dataSource)&&mE.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class _E{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||_s(e)}createContext(e,t,n,s=!1){return new fu({dataSource:e,methodName:t,targetDoc:n,path:ve.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Es(r){const e=r._freezeSettings(),t=_s(r._databaseId);return new _E(r._databaseId,!!e.ignoreUndefinedProperties,t)}function pu(r,e,t,n,s,i={}){const o=r.createContext(i.merge||i.mergeFields?2:0,e,t,s);u1("Data must be an object, but it was:",o,n);const a=U0(n,o);let u,l;if(i.merge)u=new Pt(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){const d=[];for(const f of i.mergeFields){const g=Kt(e,f,t);if(!o.contains(g))throw new F(N.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);q0(d,g)||d.push(g)}u=new Pt(d),l=o.fieldTransforms.filter((f=>u.covers(f.field)))}else u=null,l=o.fieldTransforms;return new gE(new Qe(a),u,l)}class da extends gn{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof da}}function M0(r,e,t){return new fu({dataSource:3,targetDoc:e.settings.targetDoc,methodName:r._methodName,arrayElement:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class t1 extends gn{_toFieldTransform(e){return new gs(e.path,new ni)}isEqual(e){return e instanceof t1}}class n1 extends gn{constructor(e,t){super(e),this.Tr=t}_toFieldTransform(e){const t=M0(this,e,!0),n=this.Tr.map((i=>hn(i,t))),s=new os(n);return new gs(e.path,s)}isEqual(e){return e instanceof n1&&Wt(this.Tr,e.Tr)}}class r1 extends gn{constructor(e,t){super(e),this.Tr=t}_toFieldTransform(e){const t=M0(this,e,!0),n=this.Tr.map((i=>hn(i,t))),s=new as(n);return new gs(e.path,s)}isEqual(e){return e instanceof r1&&Wt(this.Tr,e.Tr)}}class s1 extends gn{constructor(e,t){super(e),this.Pr=t}_toFieldTransform(e){const t=new cs(e.serializer,wi(e.serializer,this.Pr));return new gs(e.path,t)}isEqual(e){return e instanceof s1&&(this.Pr===e.Pr||Number.isNaN(this.Pr)&&Number.isNaN(e.Pr))}}class i1 extends gn{constructor(e,t){super(e),this.Pr=t}_toFieldTransform(e){const t=new ri(e.serializer,wi(e.serializer,this.Pr));return new gs(e.path,t)}isEqual(e){return e instanceof i1&&(this.Pr===e.Pr||Number.isNaN(this.Pr)&&Number.isNaN(e.Pr))}}class o1 extends gn{constructor(e,t){super(e),this.Pr=t}_toFieldTransform(e){const t=new si(e.serializer,wi(e.serializer,this.Pr));return new gs(e.path,t)}isEqual(e){return e instanceof o1&&(this.Pr===e.Pr||Number.isNaN(this.Pr)&&Number.isNaN(e.Pr))}}function a1(r,e,t,n){const s=r.createContext(1,e,t);u1("Data must be an object, but it was:",s,n);const i=[],o=Qe.empty();Dr(n,((u,l)=>{const d=l1(e,u,t);l=Y(l);const f=s.childContextForFieldPath(d);if(l instanceof da)i.push(d);else{const g=hn(l,f);g!=null&&(i.push(d),o.set(d,g))}}));const a=new Pt(i);return new x0(o,a,s.fieldTransforms)}function c1(r,e,t,n,s,i){const o=r.createContext(1,e,t),a=[Kt(e,n,t)],u=[s];if(i.length%2!=0)throw new F(N.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)a.push(Kt(e,i[g])),u.push(i[g+1]);const l=[],d=Qe.empty();for(let g=a.length-1;g>=0;--g)if(!q0(l,a[g])){const I=a[g];let R=u[g];R=Y(R);const O=o.childContextForFieldPath(I);if(R instanceof da)l.push(I);else{const x=hn(R,O);x!=null&&(l.push(I),d.set(I,x))}}const f=new Pt(l);return new x0(d,f,o.fieldTransforms)}function F0(r,e,t,n=!1){return hn(t,r.createContext(n?4:3,e))}function hn(r,e,t){if(B0(r=Y(r)))return u1("Unsupported field value:",e,r),U0(r,e);if(r instanceof gn)return(function(s,i){if(!L0(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const o=[];let a=0;for(const u of s){let l=hn(u,i.childContextForArray(a));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),a++}return{arrayValue:{values:o}}})(r,e)}return(function(s,i,o){if((s=Y(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return wi(i.serializer,s,o);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const a=_e.fromDate(s);return{timestampValue:oi(i.serializer,a)}}if(s instanceof _e){const a=new _e(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:oi(i.serializer,a)}}if(s instanceof Ht)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof vt)return{bytesValue:h0(i.serializer,s._byteString)};if(s instanceof ye){const a=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(a))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${a.projectId}/${a.database}`);return{referenceValue:Jh(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof wt)return(function(u,l){const d=u instanceof wt?u.toArray():u;return{mapValue:{fields:{[Uh]:{stringValue:Bh},[rs]:{arrayValue:{values:d.map((g=>{if(typeof g!="number")throw l.createError("VectorValues must only contain numeric values.");return au(l.serializer,g)}))}}}}}})(s,i);if(A0(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${nu(s)}`)})(r,e,t)}function U0(r,e){const t={};return Cm(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Dr(r,((n,s)=>{const i=hn(s,e.childContextForField(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function B0(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof _e||r instanceof Ht||r instanceof vt||r instanceof ye||r instanceof gn||r instanceof wt||A0(r))}function u1(r,e,t){if(!B0(t)||!ia(t)){const n=nu(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function Kt(r,e,t){if((e=Y(e))instanceof ys)return e._internalPath;if(typeof e=="string")return l1(r,e);throw Cc("Field path arguments must be of type string or ",r,!1,void 0,t)}const yE=new RegExp("[~\\*/\\[\\]]");function l1(r,e,t){if(e.search(yE)>=0)throw Cc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new ys(...e.split("."))._internalPath}catch{throw Cc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Cc(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new F(N.INVALID_ARGUMENT,a+r+u)}function q0(r,e){return r.some((t=>t.isEqual(e)))}function G0(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const n=Qe.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let a;i.nestedOptions&&ia(o)?a={mapValue:{fields:new _t(i.nestedOptions).getOptionsProto(t,o)}}:o&&(a=hn(o,t)??void 0),a&&n.set(ve.fromServerFormat(i.serverName),a)}}return n}getOptionsProto(e,t,n){const s=this._getKnownOptions(t,e);if(n){const i=new Map(Fh(n,((o,a)=>[ve.fromServerFormat(a),o!==void 0?hn(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EE(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!ia(t.fields))})(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(r.pipelineValue)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IE(){return new da("deleteField")}function TE(){return new t1("serverTimestamp")}function wE(...r){return new n1("arrayUnion",r)}function AE(...r){return new r1("arrayRemove",r)}function vE(r){return new s1("increment",r)}function RE(r){return new i1("minimum",r)}function PE(r){return new o1("maximum",r)}function $0(r){return new wt(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(r){let e;return r instanceof Is?r:(e=ia(r)?DE(r):r instanceof Array?VE(r):z0(r,void 0),e)}function ml(r){if(r instanceof Is)return r;if(r instanceof wt)return Ko(r);if(Array.isArray(r))return Ko($0(r));throw new Error("Unsupported value: "+typeof r)}function h1(r){return k5(r)?cc(r):$(r)}class Is{constructor(){this._protoValueType="ProtoValue"}add(e){return new L("add",[this,$(e)],"add")}asBoolean(){if(this instanceof wr)return this;if(this instanceof ws)return new j0(this);if(this instanceof Ts)return new NE(this);if(this instanceof L)return new H0(this);throw new F("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new L("subtract",[this,$(e)],"subtract")}multiply(e){return new L("multiply",[this,$(e)],"multiply")}divide(e){return new L("divide",[this,$(e)],"divide")}mod(e){return new L("mod",[this,$(e)],"mod")}equal(e){return new L("equal",[this,$(e)],"equal").asBoolean()}notEqual(e){return new L("not_equal",[this,$(e)],"notEqual").asBoolean()}lessThan(e){return new L("less_than",[this,$(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new L("less_than_or_equal",[this,$(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new L("greater_than",[this,$(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new L("greater_than_or_equal",[this,$(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const n=[e,...t].map((s=>$(s)));return new L("array_concat",[this,...n],"arrayConcat")}arrayContains(e){return new L("array_contains",[this,$(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new ho(e.map($),"arrayContainsAll"):e;return new L("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new ho(e.map($),"arrayContainsAny"):e;return new L("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new L("array_reverse",[this])}arrayLength(){return new L("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new ho(e.map($),"equalAny"):e;return new L("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new ho(e.map($),"notEqualAny"):e;return new L("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new L("exists",[this],"exists").asBoolean()}charLength(){return new L("char_length",[this],"charLength")}like(e){return new L("like",[this,$(e)],"like").asBoolean()}regexContains(e){return new L("regex_contains",[this,$(e)],"regexContains").asBoolean()}regexFind(e){return new L("regex_find",[this,$(e)],"regexFind")}regexFindAll(e){return new L("regex_find_all",[this,$(e)],"regexFindAll")}regexMatch(e){return new L("regex_match",[this,$(e)],"regexMatch").asBoolean()}stringContains(e){return new L("string_contains",[this,$(e)],"stringContains").asBoolean()}startsWith(e){return new L("starts_with",[this,$(e)],"startsWith").asBoolean()}endsWith(e){return new L("ends_with",[this,$(e)],"endsWith").asBoolean()}toLower(){return new L("to_lower",[this],"toLower")}toUpper(){return new L("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push($(e)),new L("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push($(e)),new L("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push($(e)),new L("rtrim",t,"rtrim")}type(){return new L("type",[this])}isType(e){return new L("is_type",[this,Ko(e)],"isType").asBoolean()}stringConcat(e,...t){const n=[e,...t].map($);return new L("string_concat",[this,...n],"stringConcat")}stringIndexOf(e){return new L("string_index_of",[this,$(e)],"stringIndexOf")}stringRepeat(e){return new L("string_repeat",[this,$(e)],"stringRepeat")}stringReplaceAll(e,t){return new L("string_replace_all",[this,$(e),$(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new L("string_replace_one",[this,$(e),$(t)],"stringReplaceOne")}concat(e,...t){const n=[e,...t].map($);return new L("concat",[this,...n],"concat")}reverse(){return new L("reverse",[this],"reverse")}arrayFilter(e,t){return new L("array_filter",[this,$(e),t],"arrayFilter")}arrayTransform(e,t){return new L("array_transform",[this,$(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,n){return new L("array_transform",[this,$(e),$(t),n],"arrayTransformWithIndex")}arraySlice(e,t){const n=[this,$(e)];return t!==void 0&&n.push($(t)),new L("array_slice",n,"arraySlice")}arrayFirst(){return new L("array_first",[this],"arrayFirst")}arrayFirstN(e){return new L("array_first_n",[this,$(e)],"arrayFirstN")}arrayLast(){return new L("array_last",[this],"arrayLast")}arrayLastN(e){return new L("array_last_n",[this,$(e)],"arrayLastN")}arrayMaximum(){return new L("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new L("maximum_n",[this,$(e)],"arrayMaximumN")}arrayMinimum(){return new L("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new L("minimum_n",[this,$(e)],"arrayMinimumN")}arrayIndexOf(e){return new L("array_index_of",[this,$(e),$("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new L("array_index_of",[this,$(e),$("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new L("array_index_of_all",[this,$(e)],"arrayIndexOfAll")}byteLength(){return new L("byte_length",[this],"byteLength")}ceil(){return new L("ceil",[this])}floor(){return new L("floor",[this])}abs(){return new L("abs",[this])}exp(){return new L("exp",[this])}mapGet(e){return new L("map_get",[this,Ko(e)],"mapGet")}mapSet(e,t,...n){const s=[this,$(e),$(t),...n.map($)];return new L("map_set",s,"mapSet")}mapKeys(){return new L("map_keys",[this],"mapKeys")}mapValues(){return new L("map_values",[this],"mapValues")}mapEntries(){return new L("map_entries",[this],"mapEntries")}getField(e){return new L("get_field",[this,$(e)],"get_field")}count(){return Ot._create("count",[this],"count")}sum(){return Ot._create("sum",[this],"sum")}average(){return Ot._create("average",[this],"average")}minimum(){return Ot._create("minimum",[this],"minimum")}maximum(){return Ot._create("maximum",[this],"maximum")}first(){return Ot._create("first",[this],"first")}last(){return Ot._create("last",[this],"last")}arrayAgg(){return Ot._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Ot._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Ot._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const n=[e,...t];return new L("maximum",[this,...n.map($)],"logicalMaximum")}logicalMinimum(e,...t){const n=[e,...t];return new L("minimum",[this,...n.map($)],"minimum")}vectorLength(){return new L("vector_length",[this],"vectorLength")}cosineDistance(e){return new L("cosine_distance",[this,ml(e)],"cosineDistance")}dotProduct(e){return new L("dot_product",[this,ml(e)],"dotProduct")}euclideanDistance(e){return new L("euclidean_distance",[this,ml(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new L("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new L("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new L("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new L("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new L("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new L("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new L("timestamp_add",[this,$(e),$(t)],"timestampAdd")}timestampSubtract(e,t){return new L("timestamp_subtract",[this,$(e),$(t)],"timestampSubtract")}timestampDiff(e,t){return new L("timestamp_diff",[this,h1(e),$(t)],"timestampDiff")}timestampExtract(e,t){const n=[this,$(e)];return t&&n.push($(t)),new L("timestamp_extract",n,"timestampExtract")}documentId(){return new L("document_id",[this],"documentId")}parent(){return new L("parent",[this],"parent")}substring(e,t){const n=$(e);return new L("substring",t===void 0?[this,n]:[this,n,$(t)],"substring")}arrayGet(e){return new L("array_get",[this,$(e)],"arrayGet")}isError(){return new L("is_error",[this],"isError").asBoolean()}ifError(e){const t=new L("if_error",[this,$(e)],"ifError");return e instanceof wr?t.asBoolean():t}isAbsent(){return new L("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new L("map_remove",[this,$(e)],"mapRemove")}mapMerge(e,...t){const n=$(e),s=t.map($);return new L("map_merge",[this,n,...s],"mapMerge")}pow(e){return new L("pow",[this,$(e)])}trunc(e){return e===void 0?new L("trunc",[this]):new L("trunc",[this,$(e)],"trunc")}round(e){return e===void 0?new L("round",[this]):new L("round",[this,$(e)],"round")}collectionId(){return new L("collection_id",[this])}length(){return new L("length",[this])}ln(){return new L("ln",[this])}sqrt(){return new L("sqrt",[this])}stringReverse(){return new L("string_reverse",[this])}ifAbsent(e){return new L("if_absent",[this,$(e)],"ifAbsent")}ifNull(e){return new L("if_null",[this,$(e)],"ifNull")}coalesce(e,...t){return new L("coalesce",[this,$(e),...t.map($)],"coalesce")}join(e){return new L("join",[this,$(e)],"join")}log10(){return new L("log10",[this])}arraySum(){return new L("sum",[this])}split(e){return new L("split",[this,$(e)])}timestampTruncate(e,t){const n=[this,$(e)];return t&&n.push($(t)),new L("timestamp_trunc",n)}ascending(){return OE(this)}descending(){return kE(this)}as(e){return new bE(this,e,"as")}}class Ot{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,n){const s=new Ot(e,t);return s._methodName=n,s}as(e){return new SE(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class SE{constructor(e,t,n){this.aggregate=e,this.alias=t,this._methodName=n}_readUserData(e){this.aggregate._readUserData(e)}}class bE{constructor(e,t,n){this.expr=e,this.alias=t,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class ho extends Is{constructor(e,t){super(),this.Rr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.Rr.map((t=>t._toProto(e)))}}}_readUserData(e){this.Rr.forEach((t=>t._readUserData(e)))}}class Ts extends Is{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new L("geo_distance",[this,$(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function cc(r){return CE(r,"field")}function CE(r,e){return new Ts(typeof r=="string"?en===r?R0()._internalPath:Kt("field",r):r._internalPath,e)}class ws extends Is{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new ws(e,void 0);return t._protoValue=e,t}_toProto(e){return B(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,EE(this._protoValue)||(this._protoValue=hn(this.value,e))}}function Ko(r,e){return z0(r,"constant")}function z0(r,e){const t=new ws(r,e);return typeof r=="boolean"?new j0(t):t}class L extends Is{constructor(e,t,n,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new _t({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((n=>n._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class wr extends Is{get _methodName(){return this._expr._methodName}countIf(){return Ot._create("count_if",[this],"countIf")}not(){return new L("not",[this],"not").asBoolean()}conditional(e,t){return new L("conditional",[this,e,t],"conditional")}ifError(e){const t=$(e),n=new L("if_error",[this,t],"ifError");return t instanceof wr?n.asBoolean():n}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class H0 extends wr{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class j0 extends wr{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class NE extends wr{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function DE(r,e){const t=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];t.push(Ko(n)),t.push($(s))}return new L("map",t,"map")}function VE(r){return(function(t,n){return new L("array",t.map((s=>$(s))),n)})(r,"array")}function OE(r){return new d1(h1(r),"ascending","ascending")}function kE(r){return new d1(h1(r),"descending","descending")}class d1{constructor(e,t,n){this.expr=e,this.direction=t,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:v0(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class W0 extends Mt{get _name(){return"add_fields"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[Wo(e,this.fields)]}}_readUserData(e){super._readUserData(e),vr(this.fields,e)}}class K0 extends Mt{get _name(){return"aggregate"}get _optionsUtil(){return new _t({})}constructor(e,t,n){super(n),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[Wo(e,this.accumulators),Wo(e,this.groups)]}}_readUserData(e){super._readUserData(e),vr(this.groups,e),vr(this.accumulators,e)}}class Q0 extends Mt{get _name(){return"distinct"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[Wo(e,this.groups)]}}_readUserData(e){super._readUserData(e),vr(this.groups,e)}}class fa extends Mt{get _name(){return"collection"}get _optionsUtil(){return new _t({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.Vr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.Vr}]}}_readUserData(e){super._readUserData(e)}}class pa extends Mt{get _name(){return"collection_group"}get _optionsUtil(){return new _t({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class mu extends Mt{get _name(){return"database"}get _optionsUtil(){return new _t({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class gu extends Mt{get _name(){return"documents"}get _optionsUtil(){return new _t({})}constructor(e,t){if(super(t),!e||e.length===0)throw new F(N.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(n);if(s.size!==n.length)throw new F(N.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.dr=n,this.mr=s}_toProto(e){return{...super._toProto(e),args:this.dr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class ma extends Mt{get _name(){return"where"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),vr(this.condition,e)}}class Ar extends Mt{get _name(){return"limit"}get _optionsUtil(){return new _t({})}constructor(e,t){B(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[wi(e,this.limit)]}}}class q2 extends Mt{get _name(){return"offset"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[wi(e,this.offset)]}}}class xE extends Mt{get _name(){return"select"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[Wo(e,this.selections)]}}_readUserData(e){super._readUserData(e),vr(this.selections,e)}}class rn extends Mt{get _name(){return"sort"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),vr(this.orderings,e)}}class f1 extends Mt{get _name(){return"replace_with"}get _optionsUtil(){return new _t({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),v0(f1.pr)]}}_readUserData(e){super._readUserData(e),vr(this.map,e)}}f1.pr="full_replace";function vr(r,e){return G0(r)?r._readUserData(e):Array.isArray(r)?r.forEach((t=>t._readUserData(e))):r instanceof Map?r.forEach((t=>t._readUserData(e))):Object.values(r).forEach((t=>t._readUserData(e))),r}// Copyright 2024 Google LLC* @license
class ft{constructor(e,t,n){this.serializer=e,this.stages=t,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return ga(this)}getPipelineCollectionGroup(){return p1(this)}getPipelineCollectionId(){return Y0(this)}getPipelineDocuments(){return Nc(this)}getPipelineFlavor(){return(function(t){let n="exact";return t.stages.forEach(((s,i)=>{s._name!==Q0.name&&s._name!==K0.name||(n="keyless"),s._name===xE.name&&n==="exact"&&(n="augmented"),s._name===W0.name&&i<t.stages.length-1&&n==="exact"&&(n="augmented")})),n})(this)}getPipelineSourceType(){return Nn(this)}}function Nn(r){const e=r.stages[0];return e instanceof fa||e instanceof pa||e instanceof mu||e instanceof gu?e._name:"unknown"}function ga(r){if(Nn(r)==="collection")return r.stages[0].Vr}function p1(r){if(Nn(r)==="collection_group")return r.stages[0].collectionId}function Y0(r){switch(Nn(r)){case"collection":return ie.fromString(ga(r)).lastSegment();case"collection_group":return p1(r);default:return}}function Nc(r){if(Nn(r)==="documents")return r.stages[0].dr}class Co{constructor(e,t,n,s){this._db=e,this.userDataReader=t,this._userDataWriter=n,this.stages=s}wr(e,t){const n=this.userDataReader.createContext(3,e);return G0(t)?t._readUserData(n):Array.isArray(t)?t.forEach((s=>s._readUserData(n))):t.forEach((s=>s._readUserData(n))),t}where(e){const t=this.stages.map((n=>n));return this.wr("where",e),t.push(new ma(e,{})),new Co(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((n=>n));return t.push(new Ar(e,{})),new Co(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const n=this.stages.map((s=>s));return"orderings"in e?n.push(new rn(this.wr("sort",e.orderings),{})):n.push(new rn(this.wr("sort",[e,...t]),{})),new Co(this._db,this.userDataReader,this._userDataWriter,n)}br(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class v{constructor(e,t){this.type=e,this.value=t}static vr(){return new v("ERROR",void 0)}static Sr(){return new v("UNSET",void 0)}static Dr(){return new v("NULL",cn)}static newValue(e){return xt(e)?new v("NULL",cn):(function(n){return!!n&&"booleanValue"in n})(e)?new v("BOOLEAN",e):nn(e)?new v("INT",e):Xr(e)?new v("DOUBLE",e):(function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue})(e)?new v("TIMESTAMP",e):(function(n){return!!n&&"stringValue"in n})(e)?new v("STRING",e):(function(n){return!!n&&"bytesValue"in n})(e)?new v("BYTES",e):e.referenceValue?new v("REFERENCE",e):e.geoPointValue?new v("GEO_POINT",e):Ir(e)?new v("ARRAY",e):is(e)?new v("VECTOR",e):ts(e)?new v("MAP",e):new v("ERROR",void 0)}Cr(){return this.type==="ERROR"||this.type==="UNSET"}Fr(){return this.type==="NULL"}}function No(r){if(!r.Cr())return r.value}function X0(r){return r instanceof wr?r._expr:r}function ee(r){if((r=X0(r))instanceof Ts)return new LE(r);if(r instanceof ws)return new ME(r);if(r instanceof ho)return new FE(r);if(r instanceof L){if(r.name==="add")return new qE(r);if(r.name==="subtract")return new GE(r);if(r.name==="multiply")return new $E(r);if(r.name==="divide")return new zE(r);if(r.name==="mod")return new HE(r);if(r.name==="and")return new jE(r);if(r.name==="equal")return new sI(r);if(r.name==="not_equal")return new iI(r);if(r.name==="less_than")return new oI(r);if(r.name==="less_than_or_equal")return new aI(r);if(r.name==="greater_than")return new cI(r);if(r.name==="greater_than_or_equal")return new uI(r);if(r.name==="array_concat")return new lI(r);if(r.name==="array_reverse")return new hI(r);if(r.name==="array_contains")return new dI(r);if(r.name==="array_contains_all")return new fI(r);if(r.name==="array_contains_any")return new pI(r);if(r.name==="array_length")return new mI(r);if(r.name==="array_element")return new gI(r);if(r.name==="equal_any")return new J0(r);if(r.name==="not_equal_any")return new KE(r);if(r.name==="is_nan")return new QE(r);if(r.name==="is_not_nan")return new YE(r);if(r.name==="is_null")return new XE(r);if(r.name==="is_not_null")return new JE(r);if(r.name==="is_error")return new ZE(r);if(r.name==="exists")return new eI(r);if(r.name==="not")return new _u(r);if(r.name==="or")return new WE(r);if(r.name==="xor")return new m1(r);if(r.name==="conditional")return new tI(r);if(r.name==="maximum")return new nI(r);if(r.name==="minimum")return new rI(r);if(r.name==="reverse")return new _I(r);if(r.name==="replace_first")return new yI(r);if(r.name==="replace_all")return new EI(r);if(r.name==="char_length")return new II(r);if(r.name==="byte_length")return new TI(r);if(r.name==="like")return new wI(r);if(r.name==="regex_contains")return new AI(r);if(r.name==="regex_match")return new vI(r);if(r.name==="string_contains")return new RI(r);if(r.name==="starts_with")return new PI(r);if(r.name==="ends_with")return new SI(r);if(r.name==="to_lower")return new bI(r);if(r.name==="to_upper")return new CI(r);if(r.name==="trim")return new NI(r);if(r.name==="string_concat")return new DI(r);if(r.name==="map_get")return new VI(r);if(r.name==="cosine_distance")return new OI(r);if(r.name==="dot_product")return new kI(r);if(r.name==="euclidean_distance")return new xI(r);if(r.name==="vector_length")return new LI(r);if(r.name==="unix_micros_to_timestamp")return new qI(r);if(r.name==="timestamp_to_unix_micros")return new zI(r);if(r.name==="unix_millis_to_timestamp")return new GI(r);if(r.name==="timestamp_to_unix_millis")return new HI(r);if(r.name==="unix_seconds_to_timestamp")return new $I(r);if(r.name==="timestamp_to_unix_seconds")return new jI(r);if(r.name==="timestamp_add")return new WI(r);if(r.name==="timestamp_subtract")return new KI(r)}throw new Error(`Unknown Expr : ${r}`)}class LE{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===en)return v.newValue({referenceValue:ai(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return v.newValue({timestampValue:ac(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return v.newValue({timestampValue:ac(e.serializer,t.createTime)});const n=t.data.field(this.expr._fieldPath);return n?ca(n)?v.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:ac(i.serializer,X.fromTimestamp(ei(o)))};if(i.serverTimestampBehavior==="previous"){const a=ua(o);if(a)return a}return{nullValue:"NULL_VALUE"}})(e,n)):v.newValue(n):v.Sr()}}class ME{constructor(e){this.expr=e}evaluate(e,t){return v.newValue(this.expr._getValue())}}class FE{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.Rr.map((s=>ee(s).evaluate(e,t)));return n.some((s=>s.Cr()))?v.vr():v.newValue({arrayValue:{values:n.map((s=>s.value))}})}}function at(r){return Xr(r)?Number(r.doubleValue):Number(r.integerValue)}function dn(r){return BigInt(r.integerValue)}const UE=BigInt("0x7fffffffffffffff"),BE=-BigInt("0x8000000000000000");class _a{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length>=2,24778);const n=ee(this.expr.params[0]).evaluate(e,t),s=ee(this.expr.params[1]).evaluate(e,t);let i=this.Or(n,s);for(const o of this.expr.params.slice(2)){const a=ee(o).evaluate(e,t);i=this.Or(i,a)}return i}Or(e,t){if(e.Cr()||t.Cr())return v.vr();if(e.Fr()||t.Fr())return v.Dr();const n=e.value,s=t.value;if(!Xr(n)&&!nn(n)||!Xr(s)&&!nn(s))return v.vr();if(Xr(n)||Xr(s)){const i=this.Mr(n,s);return i?v.newValue(i):v.vr()}if(nn(n)&&nn(s)){const i=this.Nr(n,s);return i===void 0?v.vr():typeof i=="number"?v.newValue({doubleValue:i}):i<BE||i>UE?v.vr():v.newValue({integerValue:`${i}`})}return v.vr()}}function Mn(r,e){return We(r)!==We(e)?"TYPE_MISMATCH":Dt(r)||Dt(e)?"NOT_EQ":xt(r)&&xt(e)?"EQ":xt(r)||xt(e)?"NULL":Ir(r)&&Ir(e)?(function(n,s){var o,a,u;if(((o=n.values)==null?void 0:o.length)!==((a=s.values)==null?void 0:a.length))return"NOT_EQ";let i=!1;for(let l=0;l<(((u=n.values)==null?void 0:u.length)??0);l++){const d=n.values[l],f=s.values[l];switch(Mn(d,f)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:W(44609,{Lr:d,Br:f})}}return i?"NULL":"EQ"})(r.arrayValue,e.arrayValue):is(r)&&is(e)||ts(r)&&ts(e)?(function(n,s){const i=n.fields||{},o=s.fields||{};if(vc(i)!==vc(o))return"NOT_EQ";let a=!1;for(const u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(Mn(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":a=!0}}return a?"NULL":"EQ"})(r.mapValue,e.mapValue):(function(n,s){return Bt(n,s,{Te:!1,Ee:!0,he:!0})})(r,e)?"EQ":"NOT_EQ"}class qE extends _a{Nr(e,t){return dn(e)+dn(t)}Mr(e,t){return{doubleValue:at(e)+at(t)}}}class GE extends _a{constructor(e){super(e),this.expr=e}Nr(e,t){return dn(e)-dn(t)}Mr(e,t){return{doubleValue:at(e)-at(t)}}}class $E extends _a{constructor(e){super(e),this.expr=e}Nr(e,t){return dn(e)*dn(t)}Mr(e,t){return{doubleValue:at(e)*at(t)}}}class zE extends _a{constructor(e){super(e),this.expr=e}Nr(e,t){const n=dn(t);if(n!==BigInt(0))return dn(e)/n}Mr(e,t){const n=at(t);return n===0?{doubleValue:Qs(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:at(e)/n}}}class HE extends _a{constructor(e){super(e),this.expr=e}Nr(e,t){const n=dn(t);if(n!==BigInt(0))return dn(e)%n}Mr(e,t){const n=at(t);if(n!==0)return{doubleValue:at(e)%n}}}class jE{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=ee(o).evaluate(e,t);switch(a.type){case"BOOLEAN":if(!((i=a.value)!=null&&i.booleanValue))return v.newValue(rt);break;case"NULL":s=!0;break;default:n=!0}}return n?v.vr():s?v.Dr():v.newValue(Nt)}}class _u{constructor(e){this.expr=e}evaluate(e,t){var s;B(this.expr.params.length===1,9634);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return v.newValue({booleanValue:!((s=n.value)!=null&&s.booleanValue)});case"NULL":return v.Dr();default:return v.vr()}}}class WE{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=ee(o).evaluate(e,t);switch(a.type){case"BOOLEAN":if((i=a.value)!=null&&i.booleanValue)return v.newValue(Nt);break;case"NULL":s=!0;break;default:n=!0}}return n?v.vr():s?v.Dr():v.newValue(rt)}}class m1{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=ee(o).evaluate(e,t);switch(a.type){case"BOOLEAN":n=m1.xor(n,!!((i=a.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return v.vr()}}return s?v.Dr():v.newValue({booleanValue:n})}static xor(e,t){return(e||t)&&!(e&&t)}}class J0{constructor(e){this.expr=e}evaluate(e,t){var o,a;B(this.expr.params.length===2,55094);let n=!1;const s=ee(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return v.vr()}const i=ee(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return v.vr()}if(n)return v.Dr();for(const u of((a=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:a.values)??[])switch(xt(s.value)&&xt(u)?"EQ":Mn(s.value,u)){case"EQ":return v.newValue(Nt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:W(44608,{value:s.value,candidate:u})}return n?v.Dr():v.newValue(rt)}}class KE{constructor(e){this.expr=e}evaluate(e,t){return new _u(new L("not",[new L("equal_any",this.expr.params)])).evaluate(e,t)}}class QE{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length===1,23322);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return v.newValue(rt);case"DOUBLE":return v.newValue({booleanValue:isNaN(at(n.value))});case"NULL":return v.Dr();default:return v.vr()}}}class YE{constructor(e){this.expr=e}evaluate(e,t){return B(this.expr.params.length===1,50406),new _u(new L("not",[new L("is_nan",this.expr.params)])).evaluate(e,t)}}class XE{constructor(e){this.expr=e}evaluate(e,t){switch(B(this.expr.params.length===1,23123),ee(this.expr.params[0]).evaluate(e,t).type){case"NULL":return v.newValue(Nt);case"UNSET":case"ERROR":return v.vr();default:return v.newValue(rt)}}}class JE{constructor(e){this.expr=e}evaluate(e,t){return B(this.expr.params.length===1,23167),new _u(new L("not",[new L("is_null",this.expr.params)])).evaluate(e,t)}}class ZE{constructor(e){this.expr=e}evaluate(e,t){return B(this.expr.params.length===1,5228),ee(this.expr.params[0]).evaluate(e,t).type==="ERROR"?v.newValue(Nt):v.newValue(rt)}}class eI{constructor(e){this.expr=e}evaluate(e,t){switch(B(this.expr.params.length===1,6877),ee(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return v.vr();case"UNSET":return v.newValue(rt);default:return v.newValue(Nt)}}}class tI{constructor(e){this.expr=e}evaluate(e,t){var s;B(this.expr.params.length===3,11706);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return(s=n.value)!=null&&s.booleanValue?ee(this.expr.params[1]).evaluate(e,t):ee(this.expr.params[2]).evaluate(e,t);case"NULL":return ee(this.expr.params[2]).evaluate(e,t);default:return v.vr()}}}class nI{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>ee(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||gt(i.value,s.value)>0?i:s}return s===void 0?v.Dr():s}}class rI{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>ee(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||gt(i.value,s.value)<0?i:s}return s===void 0?v.Dr():s}}class Si{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"ERROR":case"UNSET":return v.vr()}const s=ee(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return v.vr()}return this.Ur(n,s)}}class sI extends Si{constructor(e){super(e),this.expr=e}Ur(e,t){if(e.Fr()&&t.Fr())return v.newValue(Nt);if(e.Fr()||t.Fr()||Dt(e.value)||Dt(t.value)||We(e.value)!==We(t.value))return v.newValue(rt);switch(Mn(e.value,t.value)){case"EQ":return v.newValue(Nt);case"NOT_EQ":return v.newValue(rt);case"NULL":return v.Dr();default:W(44615,{left:e,right:t})}}}class iI extends Si{constructor(e){super(e),this.expr=e}Ur(e,t){switch(Mn(e.value,t.value)){case"EQ":return v.newValue(rt);case"NOT_EQ":case"TYPE_MISMATCH":return v.newValue(Nt);case"NULL":return v.Dr();default:W(44614,{left:e,right:t})}}}class oI extends Si{constructor(e){super(e),this.expr=e}Ur(e,t){return We(e.value)!==We(t.value)||Dt(e.value)||Dt(t.value)?v.newValue(rt):v.newValue({booleanValue:gt(e.value,t.value)<0})}}class aI extends Si{constructor(e){super(e),this.expr=e}Ur(e,t){return We(e.value)!==We(t.value)||Dt(e.value)||Dt(t.value)?v.newValue(rt):Mn(e.value,t.value)==="EQ"?v.newValue(Nt):v.newValue({booleanValue:gt(e.value,t.value)<0})}}class cI extends Si{constructor(e){super(e),this.expr=e}Ur(e,t){return We(e.value)!==We(t.value)||Dt(e.value)||Dt(t.value)?v.newValue(rt):v.newValue({booleanValue:gt(e.value,t.value)>0})}}class uI extends Si{constructor(e){super(e),this.expr=e}Ur(e,t){return We(e.value)!==We(t.value)||Dt(e.value)||Dt(t.value)?v.newValue(rt):Mn(e.value,t.value)==="EQ"?v.newValue(Nt):v.newValue({booleanValue:gt(e.value,t.value)>0})}}class lI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class hI{constructor(e){this.expr=e}evaluate(e,t){var s;B(this.expr.params.length===1,216);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return v.Dr();case"ARRAY":{const i=((s=n.value.arrayValue)==null?void 0:s.values)??[];return v.newValue({arrayValue:{values:[...i].reverse()}})}default:return v.vr()}}}class dI{constructor(e){this.expr=e}evaluate(e,t){return B(this.expr.params.length===2,52884),new J0(new L("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class fI{constructor(e){this.expr=e}evaluate(e,t){var u,l,d,f;B(this.expr.params.length===2,1392);let n=!1;const s=ee(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return v.vr()}const i=ee(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return v.vr()}if(n)return v.Dr();const o=((l=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:l.values)??[],a=((f=(d=s.value)==null?void 0:d.arrayValue)==null?void 0:f.values)??[];for(const g of o){let I=!1;n=!1;for(const R of a){switch(xt(g)&&xt(R)?"EQ":Mn(g,R)){case"EQ":I=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:W(44613,{value:R,search:g})}if(I)break}if(!I)return v.newValue(rt)}return v.newValue(Nt)}}class pI{constructor(e){this.expr=e}evaluate(e,t){var u,l,d,f;B(this.expr.params.length===2,2680);let n=!1;const s=ee(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return v.vr()}const i=ee(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return v.vr()}if(n)return v.Dr();const o=((l=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:l.values)??[],a=((f=(d=s.value)==null?void 0:d.arrayValue)==null?void 0:f.values)??[];for(const g of a)for(const I of o)switch(xt(g)&&xt(I)?"EQ":Mn(g,I)){case"EQ":return v.newValue(Nt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:W(44608,{value:g,search:I})}return n?v.Dr():v.newValue(rt)}}class mI{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;B(this.expr.params.length===1,38605);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return v.Dr();case"ARRAY":return v.newValue({integerValue:`${((o=(i=(s=n.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return v.vr()}}}class gI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class _I{constructor(e){this.expr=e}evaluate(e,t){var s,i;B(this.expr.params.length===1,1508);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return v.Dr();case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const a=Se.fromBase64String(o).toUint8Array();return a.reverse(),v.newValue({bytesValue:Se.fromUint8Array(a).toBase64()})}return v.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=n.value)==null?void 0:i.stringValue,a=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),u=Array.from(a,(l=>l.segment)).reverse();return v.newValue({stringValue:u.join("")})}default:return v.vr()}}}class yI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class EI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class II{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length===1,19400);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return v.Dr();case"STRING":{const s=(function(o){let a=0;for(let u=0;u<o.length;u++){const l=o.codePointAt(u);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){const d=o.codePointAt(u+1);d!==void 0&&d>=56320&&d<=57343?(a+=1,u++):a+=1}else a+=1;else a+=1;else{if(!(l<=1114111))return;a+=1,u++}}return a})(n.value.stringValue);return s===void 0?v.vr():v.newValue({integerValue:s})}default:return v.vr()}}}class TI{constructor(e){this.expr=e}evaluate(e,t){var s,i;B(this.expr.params.length===1,8486);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;return typeof o=="string"?v.newValue({integerValue:Se.fromBase64String(o).toUint8Array().length}):v.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=(function(u){let l=0;for(let d=0;d<u.length;d++){const f=u.codePointAt(d);if(f===void 0)return;if(f>=55296&&f<=57343){if(!(f<=56319))return;{const g=u.codePointAt(d+1);if(g===void 0||!(g>=56320&&g<=57343))return;l+=4,d++}}else if(f<=127)l+=1;else if(f<=2047)l+=2;else if(f<=65535)l+=3;else{if(!(f<=1114111))return;l+=4,d++}}return l})((i=n.value)==null?void 0:i.stringValue);return o===void 0?v.vr():v.newValue({integerValue:o})}case"NULL":return v.Dr();default:return v.vr()}}}class bi{constructor(e){this.expr=e}evaluate(e,t){var o,a;B(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=ee(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return v.vr()}const i=ee(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return v.vr()}return n?v.Dr():this.kr((o=s.value)==null?void 0:o.stringValue,(a=i.value)==null?void 0:a.stringValue)}}class wI extends bi{kr(e,t){try{const n=(function(o){let a="";for(let u=0;u<o.length;u++){const l=o.charAt(u);switch(l){case"_":a+=".";break;case"%":a+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":a+="\\"+l;break;default:a+=l}}return"^"+a+"$"})(t),s=Uo.compile(n);return v.newValue({booleanValue:s.matches(e)})}catch(n){return Xe(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${n}`),v.vr()}}}class AI extends bi{kr(e,t){try{const n=Uo.compile(t);return v.newValue({booleanValue:n.matcher(e).find()})}catch{return Xe(`Invalid regex pattern found in regex_contains: ${t}, returning error`),v.vr()}}}class vI extends bi{kr(e,t){try{return v.newValue({booleanValue:Uo.compile(t).matches(e)})}catch{return Xe(`Invalid regex pattern found in regex_match: ${t}, returning error`),v.vr()}}}class RI extends bi{kr(e,t){return v.newValue({booleanValue:e.includes(t)})}}class PI extends bi{kr(e,t){return v.newValue({booleanValue:e.startsWith(t)})}}class SI extends bi{kr(e,t){return v.newValue({booleanValue:e.endsWith(t)})}}class bI{constructor(e){this.expr=e}evaluate(e,t){var s,i;B(this.expr.params.length===1,29079);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return v.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return v.Dr();default:return v.vr()}}}class CI{constructor(e){this.expr=e}evaluate(e,t){var s,i;B(this.expr.params.length===1,60487);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return v.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return v.Dr();default:return v.vr()}}}class NI{constructor(e){this.expr=e}evaluate(e,t){var s,i;B(this.expr.params.length===1,28544);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return v.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return v.Dr();default:return v.vr()}}}class DI{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((o=>ee(o).evaluate(e,t)));let s="",i=!1;for(const o of n)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return v.vr()}return i?v.Dr():v.newValue({stringValue:s})}}class VI{constructor(e){this.expr=e}evaluate(e,t){var o,a,u,l;B(this.expr.params.length===2,4483);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"UNSET":return v.Sr();case"MAP":break;default:return v.vr()}const s=ee(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return v.vr();const i=(l=(a=(o=n.value)==null?void 0:o.mapValue)==null?void 0:a.fields)==null?void 0:l[(u=s.value)==null?void 0:u.stringValue];return i===void 0?v.Sr():v.newValue(i)}}class g1{constructor(e){this.expr=e}evaluate(e,t){var l,d;B(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=ee(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return v.vr()}const i=ee(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return v.vr()}if(n)return v.Dr();const o=Bl(s.value),a=Bl(i.value);if(o===void 0||a===void 0||((l=o.values)==null?void 0:l.length)!==((d=a.values)==null?void 0:d.length))return v.vr();const u=this.qr(o,a);return u===void 0||isNaN(u)?v.vr():v.newValue({doubleValue:u})}}class OI extends g1{qr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return;let i=0,o=0,a=0;for(let l=0;l<n.length;l++){if(!Er(n[l])||!Er(s[l]))return;const d=at(n[l]),f=at(s[l]);i+=d*f,o+=d*d,a+=f*f}const u=Math.sqrt(o)*Math.sqrt(a);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class kI extends g1{qr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!Er(n[o])||!Er(s[o]))return;i+=at(n[o])*at(s[o])}return i}}class xI extends g1{qr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!Er(n[o])||!Er(s[o]))return;const a=at(n[o]),u=at(s[o]);i+=Math.pow(a-u,2)}return Math.sqrt(i)}}class LI{constructor(e){this.expr=e}evaluate(e,t){var s;B(this.expr.params.length===1,39044);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"VECTOR":{const i=Bl(n.value);return v.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return v.Dr();default:return v.vr()}}}const Qo=BigInt(-62135596800),Yo=BigInt(253402300799),Dc=BigInt(1e3),fr=BigInt(1e6),MI=Qo*Dc,FI=Yo*Dc+BigInt(999),UI=Qo*fr,BI=Yo*fr+BigInt(999999);function _1(r){return r>=UI&&r<=BI}function Z0(r){return r>=Qo&&r<=Yo}function Xo(r,e){const t=BigInt(r);return!(t<Qo||t>Yo)&&!(e<0||e>=1e9)&&(t!==Qo||e===0)&&!(t===Yo&&e>999999999)}function eg(r,e){return e<0?{seconds:r-1,nanos:e+1e9}:{seconds:r,nanos:e}}function y1(r){return BigInt(r.seconds)*fr+BigInt(Math.trunc(r.nanoseconds/1e3))}class E1{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return v.Dr();default:return v.vr()}}}class qI extends E1{toTimestamp(e){if(!_1(e))return v.vr();let t=Number(e/fr),n=Number(e%fr*BigInt(1e3));const s=eg(t,n);return t=s.seconds,n=s.nanos,Xo(t,n)?v.newValue({timestampValue:{seconds:t,nanos:n}}):v.vr()}}class GI extends E1{toTimestamp(e){if(!(function(o){return o>=MI&&o<=FI})(e))return v.vr();let t=Number(e/Dc),n=Number(e%Dc*BigInt(1e6));const s=eg(t,n);return t=s.seconds,n=s.nanos,Xo(t,n)?v.newValue({timestampValue:{seconds:t,nanos:n}}):v.vr()}}class $I extends E1{toTimestamp(e){if(!Z0(e))return v.vr();const t=Number(e);return v.newValue({timestampValue:{seconds:t,nanos:0}})}}class I1{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=ee(this.expr.params[0]).evaluate(e,t);switch(n.type){case"TIMESTAMP":break;case"NULL":return v.Dr();default:return v.vr()}const s=Xh(n.value.timestampValue);return Xo(s.seconds,s.nanoseconds)?this.$r(s):v.vr()}}class zI extends I1{$r(e){const t=y1(e);return _1(t)?v.newValue({integerValue:`${t.toString()}`}):v.vr()}}class HI extends I1{$r(e){const t=y1(e),n=t/BigInt(1e3),s=t%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?v.newValue({integerValue:n.toString()}):v.newValue({integerValue:(n-BigInt(1)).toString()})}}class jI extends I1{$r(e){const t=BigInt(e.seconds);return Z0(t)?v.newValue({integerValue:t.toString()}):v.vr()}}class tg{constructor(e){this.expr=e}evaluate(e,t){B(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=ee(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return v.vr()}const i=ee(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=(function(Z){switch(Z){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return v.vr();break;case"NULL":n=!0;break;default:return v.vr()}const a=ee(this.expr.params[2]).evaluate(e,t);switch(a.type){case"INT":break;case"NULL":n=!0;break;default:return v.vr()}if(n)return v.Dr();const u=BigInt(a.value.integerValue);let l;try{switch(o){case"microsecond":l=u;break;case"millisecond":l=u*BigInt(1e3);break;case"second":l=u*BigInt(1e6);break;case"minute":l=u*BigInt(6e7);break;case"hour":l=u*BigInt(36e8);break;case"day":l=u*BigInt(864e8);break;default:return v.vr()}if(o!=="microsecond"&&u!==BigInt(0)&&l/u!==BigInt(this.Kr(o)))return v.vr()}catch(z){return Xe(`Error during timestamp arithmetic: ${z}`),v.vr()}const d=Xh(s.value.timestampValue);if(!Xo(d.seconds,d.nanoseconds))return v.vr();const f=y1(d),g=this.Wr(f,l);if(!_1(g))return v.vr();const I=Number(g/fr),R=g%fr,O=Number((R<0?R+fr:R)*BigInt(1e3)),x=R<0?I-1:I;return Xo(x,O)?v.newValue({timestampValue:{seconds:x,nanos:O}}):v.vr()}Kr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class WI extends tg{Wr(e,t){return e+t}}class KI extends tg{Wr(e,t){return e-t}}function Jo(r){if((r=X0(r))instanceof Ts)return`fld(${r.fieldName})`;if(r instanceof ws)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof ye?`ref(${t.path})`:t instanceof wt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(r.value)})`;if(r instanceof L)return`fn(${r.name},[${r.params.map(Jo).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.Rr.map(Jo).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function QI(r){if(r instanceof W0)return`${r._name}(${za(r.fields)})`;if(r instanceof K0){let e=`${r._name}(${za(r.accumulators)})`;return r.groups.size>0&&(e+=`grouping(${za(r.groups)})`),e}if(r instanceof Q0)return`${r._name}(${za(r.groups)})`;if(r instanceof fa)return`${r._name}(${r.Vr})`;if(r instanceof pa)return`${r._name}(${r.collectionId})`;if(r instanceof mu)return`${r._name}()`;if(r instanceof gu)return`${r._name}(${r.dr.sort()})`;if(r instanceof ma)return`${r._name}(${Jo(r.condition)})`;if(r instanceof Ar)return`${r._name}(${r.limit})`;if(r instanceof rn)return`${r._name}(${(function(t){return t.map((n=>`${Jo(n.expr)}${n.direction}`)).join(",")})(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function za(r){return`${Array.from(r.entries()).sort().map((([e,t])=>`${e}=${Jo(t)}`)).join(",")}`}function Dn(r){return r.stages.map((e=>QI(e))).join("|")}function ng(r,e){return Dn(r)===Dn(e)}function Me(r){return r instanceof ft}function G2(r){return Me(r)?Dn(r):Po(r)}function rg(r){return Me(r)?Dn(r):(function(t){return`${Pc(mt(t))}|lt:${t.limitType}`})(r)}function yu(r,e){return r instanceof ft&&e instanceof ft?ng(r,e):!(r instanceof ft&&!(e instanceof ft)||!(r instanceof ft)&&e instanceof ft)&&n0(r,e)}function Eu(r){return vn(r)?Dn(r):Pc(r)}function T1(r,e){return r instanceof ft&&e instanceof ft?ng(r,e):!(r instanceof ft&&!(e instanceof ft)||!(r instanceof ft)&&e instanceof ft)&&Hh(r,e)}function YI(r,e){const t=(function(s){let i=!1;const o=[];for(const a of s)if(a instanceof rn)if(i=!0,a.orderings.some((u=>u.expr instanceof Ts&&u.expr.fieldName===en)))o.push(a);else{const u=a.orderings.map((l=>l));u.push(cc(en).ascending()),o.push(new rn(u,{}))}else a instanceof Ar&&(i||(o.push(new rn([cc(en).ascending()],{})),i=!0)),o.push(a);return i||o.push(new rn([cc(en).ascending()],{})),o})(r.stages);if(r.userDataReader){const n=r.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(n)))}return new ft(r.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w1{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&_y(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Ro(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Ro(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=a0();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=t.has(s.key)?null:a;const u=$m(o,a);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(X.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),se())}isEqual(e){return this.batchId===e.batchId&&Hs(this.mutations,e.mutations,((t,n)=>E2(t,n)))&&Hs(this.baseMutations,e.baseMutations,((t,n)=>E2(t,n)))}}class A1{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){B(e.mutations.length===n.length,58842,{Qr:e.mutations.length,Gr:n.length});let s=(function(){return ky})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new A1(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v1{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,t,n,s,i=X.min(),o=X.min(),a=Se.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new sn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new sn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new sn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new sn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sg{constructor(e){this.zr=e}}function XI(r,e){let t;if(e.document)t=hu(r.zr,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=G.fromSegments(e.noDocument.path),s=ls(e.noDocument.readTime);t=Ce.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return W(56709);{const n=G.fromSegments(e.unknownDocument.path),s=ls(e.unknownDocument.version);t=Ce.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new _e(s[0],s[1]);return X.fromTimestamp(i)})(e.readTime)),t}function $2(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Vc(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:ai(i,o.key),fields:o.data.value.mapValue.fields,updateTime:oi(i,o.version.toTimestamp()),createTime:oi(i,o.createTime.toTimestamp())}})(r.zr,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:us(e.version)};else{if(!e.isUnknownDocument())return W(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:us(e.version)}}return n}function Vc(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function us(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function ls(r){const e=new _e(r.seconds,r.nanoseconds);return X.fromTimestamp(e)}function jr(r,e){const t=(e.baseMutations||[]).map((i=>Kl(r.zr,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const a=e.mutations[i+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>Kl(r.zr,i))),s=_e.fromMillis(e.localWriteTimeMs);return new w1(e.batchId,s,t,n)}function fo(r,e){const t=ls(e.readTime),n=e.lastLimboFreeSnapshotVersion!==void 0?ls(e.lastLimboFreeSnapshotVersion):X.min();let s;return s=(function(o){return o.structuredPipeline!==void 0})(e.query)?(function(o,a){var d,f;const u=o.structuredPipeline;B((((d=u==null?void 0:u.pipeline)==null?void 0:d.stages)??[]).length>0,1845);const l=(f=u==null?void 0:u.pipeline)==null?void 0:f.stages.map(JI);return new ft(a,l)})(e.query,r.zr):(function(o){return o.documents!==void 0})(e.query)?(function(o){const a=o.documents.length;return B(a===1,1966,{count:a}),mt(Ri(p0(o.documents[0])))})(e.query):(function(o){return mt(y0(o))})(e.query),new sn(s,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Se.fromBase64String(e.resumeToken))}function ig(r,e){const t=us(e.snapshotVersion),n=us(e.lastLimboFreeSnapshotVersion);let s;s=vn(e.target)?E0(r.zr,e.target):jh(e.target)?g0(r.zr,e.target):du(r.zr,e.target).yt;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Eu(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Iu(r){const e=y0({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?bc(e,e.limit,"L"):e}function Ha(r,e){return new v1(e.largestBatchId,Kl(r.zr,e.overlayMutation))}function z2(r,e){const t=e.path.lastSegment();return[r,pt(e.path.popLast()),t]}function H2(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:us(n.readTime),documentKey:pt(n.documentKey.path),largestBatchId:n.largestBatchId}}function JI(r){switch(r.name){case"collection":return new fa(r.args[0].referenceValue,{});case"collection_group":return new pa(r.args[1].stringValue,{});case"database":return new mu({});case"documents":return new gu(r.args.map((e=>e.referenceValue)),{});case"where":return new ma(Yl(r.args[0]),{});case"limit":{const e=r.args[0].integerValue??r.args[0].doubleValue;return new Ar(typeof e=="number"?e:Number(e),{})}case"sort":return new rn(r.args.map((e=>(function(n){var i,o;const s=(i=n.mapValue)==null?void 0:i.fields;return new d1(Yl(s.expression),(o=s.direction)==null?void 0:o.stringValue,"orderingFromProto")})(e))),{});default:throw new Error(`Stage type: ${r.name} not supported.`)}}function Yl(r){return r.fieldReferenceValue?new Ts(Kt("_exprFromProto",r.fieldReferenceValue),"_exprFromProto"):r.functionValue?(function(t){var n;return new L(t.functionValue.name,((n=t.functionValue.args)==null?void 0:n.map(Yl))||[])})(r):ws._fromProto(r)}class ZI{getBundleMetadata(e,t){return j2(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:ls(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return j2(e).put((function(s){return{bundleId:s.id,createTime:us(Ge(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return W2(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:Iu(i.bundledQuery),readTime:ls(i.readTime)}})(n)}))}saveNamedQuery(e,t){return W2(e).put((function(s){return{name:s.name,readTime:us(Ge(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function j2(r){return Ze(r,su)}function W2(r){return Ze(r,iu)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e,t){this.serializer=e,this.userId=t}static jr(e,t){const n=t.uid||"";return new Tu(e,n)}getOverlay(e,t){return Cs(e).get(z2(this.userId,t)).next((n=>n?Ha(this.serializer,n):null))}getOverlays(e,t){const n=Ft();return b.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=Ft();return Cs(e).ee(((s,i)=>{const o=Ha(this.serializer,i);o.largestBatchId>t&&n.set(o.getKey(),o)})).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const a=new v1(t,o);s.push(this.Hr(e,a))})),b.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(pt(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const a=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Cs(e).Z(Ml,a))})),b.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Ft(),i=pt(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Cs(e).H(Ml,o).next((a=>{for(const u of a){const l=Ha(this.serializer,u);s.set(l.getKey(),l)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=Ft();let o;const a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Cs(e).ee({index:vm,range:a},((u,l,d)=>{const f=Ha(this.serializer,l);i.size()<s||f.largestBatchId===o?(i.set(f.getKey(),f),o=f.largestBatchId):d.done()})).next((()=>i))}Hr(e,t){return Cs(e).put((function(s,i,o){const[a,u,l]=z2(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:l,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:jo(s.zr,o.mutation)}})(this.serializer,this.userId,t))}}function Cs(r){return Ze(r,ou)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eT{Jr(e){return Ze(e,Lh)}getSessionToken(e){return this.Jr(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?Se.fromUint8Array(n):Se.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Jr(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wr{constructor(){}Yr(e,t){this.Zr(e,t),t.Xr()}Zr(e,t){if("nullValue"in e)this.ei(t,5);else if("booleanValue"in e)this.ei(t,10),t.ti(e.booleanValue?1:0);else if("integerValue"in e)this.ei(t,15),t.ti(Pe(e.integerValue));else if("doubleValue"in e){const n=Pe(e.doubleValue);isNaN(n)?this.ei(t,13):(this.ei(t,15),Qs(n)?t.ti(0):t.ti(n))}else if("timestampValue"in e){let n=e.timestampValue;this.ei(t,20),typeof n=="string"&&(n=xn(n)),t.ni(`${n.seconds||""}`),t.ti(n.nanos||0)}else if("stringValue"in e)this.ri(e.stringValue,t),this.ii(t);else if("bytesValue"in e)this.ei(t,30),t.si(Ln(e.bytesValue)),this.ii(t);else if("referenceValue"in e)this._i(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.ei(t,45),t.ti(n.latitude||0),t.ti(n.longitude||0)}else"mapValue"in e?Lm(e)?this.ei(t,Number.MAX_SAFE_INTEGER):is(e)?this.oi(e.mapValue,t):(this.ai(e.mapValue,t),this.ii(t)):"arrayValue"in e?(this.ui(e.arrayValue,t),this.ii(t)):W(19022,{ci:e})}ri(e,t){this.ei(t,25),this.li(e,t)}li(e,t){t.ni(e)}ai(e,t){const n=e.fields||{};this.ei(t,55);for(const s of Object.keys(n))this.ri(s,t),this.Zr(n[s],t)}oi(e,t){var o,a;const n=e.fields||{};this.ei(t,53);const s=rs,i=((a=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:a.length)||0;this.ei(t,15),t.ti(Pe(i)),this.ri(s,t),this.Zr(n[s],t)}ui(e,t){const n=e.values||[];this.ei(t,50);for(const s of n)this.Zr(s,t)}_i(e,t){this.ei(t,37),G.fromName(e).path.forEach((n=>{this.ei(t,60),this.li(n,t)}))}ei(e,t){e.ti(t)}ii(e){e.ti(2)}}Wr.Ei=new Wr;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=255;function tT(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function K2(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=tT(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class nT{constructor(){this.buffer=new Uint8Array(1024),this.position=0}hi(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ti(n.value),n=t.next();this.Pi()}Ri(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ii(n.value),n=t.next();this.Ai()}Vi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ti(n);else if(n<2048)this.Ti(960|n>>>6),this.Ti(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ti(480|n>>>12),this.Ti(128|63&n>>>6),this.Ti(128|63&n);else{const s=t.codePointAt(0);this.Ti(240|s>>>18),this.Ti(128|63&s>>>12),this.Ti(128|63&s>>>6),this.Ti(128|63&s)}}this.Pi()}di(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ii(n);else if(n<2048)this.Ii(960|n>>>6),this.Ii(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ii(480|n>>>12),this.Ii(128|63&n>>>6),this.Ii(128|63&n);else{const s=t.codePointAt(0);this.Ii(240|s>>>18),this.Ii(128|63&s>>>12),this.Ii(128|63&s>>>6),this.Ii(128|63&s)}}this.Ai()}fi(e){const t=this.mi(e),n=K2(t);this.pi(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}gi(e){const t=this.mi(e),n=K2(t);this.pi(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}yi(){this.wi(Ns),this.wi(255)}bi(){this.Si(Ns),this.Si(255)}reset(){this.position=0}seed(e){this.pi(e.length),this.buffer.set(e,this.position),this.position+=e.length}Di(){return this.buffer.slice(0,this.position)}mi(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Ti(e){const t=255&e;t===0?(this.wi(0),this.wi(255)):t===Ns?(this.wi(Ns),this.wi(0)):this.wi(t)}Ii(e){const t=255&e;t===0?(this.Si(0),this.Si(255)):t===Ns?(this.Si(Ns),this.Si(0)):this.Si(e)}Pi(){this.wi(0),this.wi(1)}Ai(){this.Si(0),this.Si(1)}wi(e){this.pi(1),this.buffer[this.position++]=e}Si(e){this.pi(1),this.buffer[this.position++]=~e}pi(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class rT{constructor(e){this.xi=e}si(e){this.xi.hi(e)}ni(e){this.xi.Vi(e)}ti(e){this.xi.fi(e)}Xr(){this.xi.yi()}}class sT{constructor(e){this.xi=e}si(e){this.xi.Ri(e)}ni(e){this.xi.di(e)}ti(e){this.xi.gi(e)}Xr(){this.xi.bi()}}class no{constructor(){this.xi=new nT,this.ascending=new rT(this.xi),this.descending=new sT(this.xi)}seed(e){this.xi.seed(e)}Ci(e){return e===0?this.ascending:this.descending}Di(){return this.xi.Di()}reset(){this.xi.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e,t,n,s){this.Fi=e,this.Oi=t,this.Mi=n,this.Ni=s}Li(){const e=this.Ni.length,t=e===0||this.Ni[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.Ni,0),t!==e?n.set([0],this.Ni.length):++n[n.length-1],new Kr(this.Fi,this.Oi,this.Mi,n)}Bi(e,t,n){return{indexId:this.Fi,uid:e,arrayValue:uc(this.Mi),directionalValue:uc(this.Ni),orderedDocumentKey:uc(t),documentKey:n.path.toArray()}}Ui(e,t,n){const s=this.Bi(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function Jn(r,e){let t=r.Fi-e.Fi;return t!==0?t:(t=Q2(r.Mi,e.Mi),t!==0?t:(t=Q2(r.Ni,e.Ni),t!==0?t:G.comparator(r.Oi,e.Oi)))}function Q2(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function uc(r){return $p()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function Y2(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class X2{constructor(e){this.ki=new Ee(((t,n)=>ve.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.qi=e.orderBy,this.$i=[];for(const t of e.filters){const n=t;n.isInequality()?this.ki=this.ki.add(n):this.$i.push(n)}}get Ki(){return this.ki.size>1}Wi(e){if(B(e.collectionGroup===this.collectionId,49279),this.Ki)return!1;const t=kl(e);if(t!==void 0&&!this.Qi(t))return!1;const n=Gr(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.Qi(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.ki.size>0){const a=this.ki.getIterator().getNext();if(!s.has(a.field.canonicalString())){const u=n[i];if(!this.Gi(a,u)||!this.zi(this.qi[o++],u))return!1}++i}for(;i<n.length;++i){const a=n[i];if(o>=this.qi.length||!this.zi(this.qi[o++],a))return!1}return!0}ji(){if(this.Ki)return null;let e=new Ee(ve.comparator);const t=[];for(const n of this.$i)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Zr(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Zr(n.field,0))}for(const n of this.qi)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Zr(n.field,n.dir==="asc"?0:1)));return new Ws(Ws.UNKNOWN_ID,this.collectionId,t,Ks.empty())}Qi(e){for(const t of this.$i)if(this.Gi(t,e))return!0;return!1}Gi(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}zi(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function og(r){var t,n;if(B(r instanceof pe||r instanceof Ie,20012),r instanceof pe){if(r instanceof Jm){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map((i=>pe.create(r.field,"==",i))))||[];return Ie.create(s,"or")}return r}const e=r.filters.map((s=>og(s)));return Ie.create(e,r.op)}function iT(r){if(r.getFilters().length===0)return[];const e=Zl(og(r));return B(ag(e),7391),Xl(e)||Jl(e)?[e]:e.getFilters()}function Xl(r){return r instanceof pe}function Jl(r){return r instanceof Ie&&zh(r)}function ag(r){return Xl(r)||Jl(r)||(function(t){if(t instanceof Ie&&ql(t)){for(const n of t.getFilters())if(!Xl(n)&&!Jl(n))return!1;return!0}return!1})(r)}function Zl(r){if(B(r instanceof pe||r instanceof Ie,34018),r instanceof pe)return r;if(r.filters.length===1)return Zl(r.filters[0]);const e=r.filters.map((n=>Zl(n)));let t=Ie.create(e,r.op);return t=Oc(t),ag(t)?t:(B(t instanceof Ie,64498),B(ii(t),40251),B(t.filters.length>1,57927),t.filters.reduce(((n,s)=>R1(n,s))))}function R1(r,e){let t;return B(r instanceof pe||r instanceof Ie,38388),B(e instanceof pe||e instanceof Ie,25473),t=r instanceof pe?e instanceof pe?(function(s,i){return Ie.create([s,i],"and")})(r,e):J2(r,e):e instanceof pe?J2(e,r):(function(s,i){if(B(s.filters.length>0&&i.filters.length>0,48005),ii(s)&&ii(i))return Qm(s,i.getFilters());const o=ql(s)?s:i,a=ql(s)?i:s,u=o.filters.map((l=>R1(l,a)));return Ie.create(u,"or")})(r,e),Oc(t)}function J2(r,e){if(ii(e))return Qm(e,r.getFilters());{const t=e.filters.map((n=>R1(r,n)));return Ie.create(t,"or")}}function Oc(r){if(B(r instanceof pe||r instanceof Ie,11850),r instanceof pe)return r;const e=r.getFilters();if(e.length===1)return Oc(e[0]);if(Wm(r))return r;const t=e.map((s=>Oc(s))),n=[];return t.forEach((s=>{s instanceof pe?n.push(s):s instanceof Ie&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:Ie.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oT{constructor(){this.Hi=new P1}addToCollectionParentIndex(e,t){return this.Hi.add(t),b.resolve()}getCollectionParents(e,t){return b.resolve(this.Hi.getEntries(t))}addFieldIndex(e,t){return b.resolve()}deleteFieldIndex(e,t){return b.resolve()}deleteAllFieldIndexes(e){return b.resolve()}createTargetIndexes(e,t){return b.resolve()}getDocumentsMatchingTarget(e,t){return b.resolve(null)}getIndexType(e,t){return b.resolve(0)}getFieldIndexes(e,t){return b.resolve([])}getNextCollectionGroupToUpdate(e){return b.resolve(null)}getMinOffset(e,t){return b.resolve(Lt.min())}getMinOffsetFromCollectionGroup(e,t){return b.resolve(Lt.min())}updateCollectionGroup(e,t,n){return b.resolve()}updateIndexEntries(e,t){return b.resolve()}}class P1{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new Ee(ie.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new Ee(ie.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z2="IndexedDbIndexManager",ja=new Uint8Array(0);class aT{constructor(e,t){this.databaseId=t,this.Ji=new P1,this.Yi=new $n((n=>Pc(n)),((n,s)=>Hh(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Ji.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Ji.add(t)}));const i={collectionId:n,parent:pt(s)};return ep(e).put(i)}return b.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[lm(t),""],!1,!0);return ep(e).H(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(tn(o.parent))}return n}))}addFieldIndex(e,t){const n=ro(e),s=(function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=Vs(e);return i.next((a=>{o.put(H2(a,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=ro(e),s=Vs(e),i=Ds(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=ro(e),n=Ds(e),s=Vs(e);return t.Z().next((()=>n.Z())).next((()=>s.Z()))}createTargetIndexes(e,t){return b.forEach(this.Zi(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new X2(n).ji();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=Ds(e);let s=!0;const i=new Map;return b.forEach(this.Zi(t),(o=>this.Xi(e,o).next((a=>{s&&(s=!!a),i.set(o,a)})))).next((()=>{if(s){let o=se();const a=[];return b.forEach(i,((u,l)=>{U(Z2,`Using index ${(function(Q){return`id=${Q.indexId}|cg=${Q.collectionGroup}|f=${Q.fields.map((oe=>`${oe.fieldPath}:${oe.kind}`)).join(",")}`})(u)} to execute ${Pc(t)}`);const d=(function(Q,oe){const le=kl(oe);if(le===void 0)return null;for(const de of Sc(Q,le.fieldPath))switch(de.op){case"array-contains-any":return de.value.arrayValue.values||[];case"array-contains":return[de.value]}return null})(l,u),f=(function(Q,oe){const le=new Map;for(const de of Gr(oe))for(const A of Sc(Q,de.fieldPath))switch(A.op){case"==":case"in":le.set(de.fieldPath.canonicalString(),A.value);break;case"not-in":case"!=":return le.set(de.fieldPath.canonicalString(),A.value),Array.from(le.values())}return null})(l,u),g=(function(Q,oe){const le=[];let de=!0;for(const A of Gr(oe)){const E=A.kind===0?v2(Q,A.fieldPath,Q.startAt):R2(Q,A.fieldPath,Q.startAt);le.push(E.value),de&&(de=E.inclusive)}return new Tr(le,de)})(l,u),I=(function(Q,oe){const le=[];let de=!0;for(const A of Gr(oe)){const E=A.kind===0?R2(Q,A.fieldPath,Q.endAt):v2(Q,A.fieldPath,Q.endAt);le.push(E.value),de&&(de=E.inclusive)}return new Tr(le,de)})(l,u),R=this.es(u,l,g),O=this.es(u,l,I),x=this.ts(u,l,f),z=this.ns(u.indexId,d,R,g.inclusive,O,I.inclusive,x);return b.forEach(z,(Z=>n.Y(Z,t.limit).next((Q=>{Q.forEach((oe=>{const le=G.fromSegments(oe.documentKey);o.has(le)||(o=o.add(le),a.push(le))}))}))))})).next((()=>a))}return b.resolve(null)}))}Zi(e){let t=this.Yi.get(e);return t||(e.filters.length===0?t=[e]:t=iT(Ie.create(e.filters,"and")).map((n=>$l(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Yi.set(e,t),t)}ns(e,t,n,s,i,o,a){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),l=u/(t!=null?t.length:1),d=[];for(let f=0;f<u;++f){const g=t?this.rs(t[f/l]):ja,I=this.ss(e,g,n[f%l],s),R=this._s(e,g,i[f%l],o),O=a.map((x=>this.ss(e,g,x,!0)));d.push(...this.createRange(I,R,O))}return d}ss(e,t,n,s){const i=new Kr(e,G.empty(),t,n);return s?i:i.Li()}_s(e,t,n,s){const i=new Kr(e,G.empty(),t,n);return s?i.Li():i}Xi(e,t){const n=new X2(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const a of i)n.Wi(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o}))}getIndexType(e,t){let n=2;const s=this.Zi(t);return b.forEach(s,(i=>this.Xi(e,i).next((o=>{o?n!==0&&o.fields.length<(function(u){let l=new Ee(ve.comparator),d=!1;for(const f of u.filters)for(const g of f.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?d=!0:l=l.add(g.field));for(const f of u.orderBy)f.field.isKeyField()||(l=l.add(f.field));return l.size+(d?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}us(e,t){const n=new no;for(const s of Gr(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.Ci(s.kind);Wr.Ei.Yr(i,o)}return n.Di()}rs(e){const t=new no;return Wr.Ei.Yr(e,t.Ci(0)),t.Di()}cs(e,t){const n=new no;return Wr.Ei.Yr(ss(this.databaseId,t),n.Ci((function(i){const o=Gr(i);return o.length===0?0:o[o.length-1].kind})(e))),n.Di()}ts(e,t,n){if(n===null)return[];let s=[];s.push(new no);let i=0;for(const o of Gr(e)){const a=n[i++];for(const u of s)if(this.ls(t,o.fieldPath)&&Ir(a))s=this.Es(s,o,a);else{const l=u.Ci(o.kind);Wr.Ei.Yr(a,l)}}return this.hs(s)}es(e,t,n){return this.ts(e,t,n.position)}hs(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Di();return t}Es(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const a of s){const u=new no;u.seed(a.Di()),Wr.Ei.Yr(o,u.Ci(t.kind)),i.push(u)}return i}ls(e,t){return!!e.filters.find((n=>n instanceof pe&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=ro(e),s=Vs(e);return(t?n.H(Ll,IDBKeyRange.bound(t,t)):n.H()).next((i=>{const o=[];return b.forEach(i,(a=>s.get([a.indexId,this.uid]).next((u=>{o.push((function(d,f){const g=f?new Ks(f.sequenceNumber,new Lt(ls(f.readTime),new G(tn(f.documentKey)),f.largestBatchId)):Ks.empty(),I=d.fields.map((([R,O])=>new Zr(ve.fromServerFormat(R),O)));return new Ws(d.indexId,d.collectionGroup,I,g)})(a,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:ne(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=ro(e),i=Vs(e);return this.Ts(e).next((o=>s.H(Ll,IDBKeyRange.bound(t,t)).next((a=>b.forEach(a,(u=>i.put(H2(u.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return b.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?b.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((a=>(n.set(s.collectionGroup,a),b.forEach(a,(u=>this.Ps(e,s,u).next((l=>{const d=this.Rs(i,u);return l.isEqual(d)?b.resolve():this.Is(e,i,u,l,d)})))))))}))}As(e,t,n,s){return Ds(e).put(s.Bi(this.uid,this.cs(n,t.key),t.key))}Vs(e,t,n,s){return Ds(e).delete(s.Ui(this.uid,this.cs(n,t.key),t.key))}Ps(e,t,n){const s=Ds(e);let i=new Ee(Jn);return s.ee({index:Am,range:IDBKeyRange.only([n.indexId,this.uid,uc(this.cs(n,t))])},((o,a)=>{i=i.add(new Kr(n.indexId,t,Y2(a.arrayValue),Y2(a.directionalValue)))})).next((()=>i))}Rs(e,t){let n=new Ee(Jn);const s=this.us(t,e);if(s==null)return n;const i=kl(t);if(i!=null){const o=e.data.field(i.fieldPath);if(Ir(o))for(const a of o.arrayValue.values||[])n=n.add(new Kr(t.indexId,e.key,this.rs(a),s))}else n=n.add(new Kr(t.indexId,e.key,ja,s));return n}Is(e,t,n,s,i){U(Z2,"Updating index entries for document '%s'",t.key);const o=[];return(function(u,l,d,f,g){const I=u.getIterator(),R=l.getIterator();let O=bs(I),x=bs(R);for(;O||x;){let z=!1,Z=!1;if(O&&x){const Q=d(O,x);Q<0?Z=!0:Q>0&&(z=!0)}else O!=null?Z=!0:z=!0;z?(f(x),x=bs(R)):Z?(g(O),O=bs(I)):(O=bs(I),x=bs(R))}})(s,i,Jn,(a=>{o.push(this.As(e,t,n,a))}),(a=>{o.push(this.Vs(e,t,n,a))})),b.waitFor(o)}Ts(e){let t=1;return Vs(e).ee({index:wm,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,a)=>Jn(o,a))).filter(((o,a,u)=>!a||Jn(o,u[a-1])!==0));const s=[];s.push(e);for(const o of n){const a=Jn(o,e),u=Jn(o,t);if(a===0)s[0]=e.Li();else if(a>0&&u<0)s.push(o),s.push(o.Li());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.ds(s[o],s[o+1]))return[];const a=s[o].Ui(this.uid,ja,G.empty()),u=s[o+1].Ui(this.uid,ja,G.empty());i.push(IDBKeyRange.bound(a,u))}return i}ds(e,t){return Jn(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(tp)}getMinOffset(e,t){return b.mapArray(this.Zi(t),(n=>this.Xi(e,n).next((s=>s||W(44426))))).next(tp)}}function ep(r){return Ze(r,Go)}function Ds(r){return Ze(r,Ao)}function ro(r){return Ze(r,xh)}function Vs(r){return Ze(r,wo)}function tp(r){B(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;Vh(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Lt(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cg(r,e,t){const n=r.store(Gt),s=r.store(Ys),i=[],o=IDBKeyRange.only(t.batchId);let a=0;const u=n.ee({range:o},((d,f,g)=>(a++,g.delete())));i.push(u.next((()=>{B(a===1,47070,{batchId:t.batchId})})));const l=[];for(const d of t.mutations){const f=Em(e,d.key.path,t.batchId);i.push(s.delete(f)),l.push(d.key)}return b.waitFor(i).next((()=>l))}function kc(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw W(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.fs={}}static jr(e,t,n,s){B(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new wu(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Zn(e).ee({index:Yr,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=Ls(e),o=Zn(e);return o.add({}).next((a=>{B(typeof a=="number",49019);const u=new w1(a,t,n,s),l=(function(I,R,O){const x=O.baseMutations.map((Z=>jo(I.zr,Z))),z=O.mutations.map((Z=>jo(I.zr,Z)));return{userId:R,batchId:O.batchId,localWriteTimeMs:O.localWriteTime.toMillis(),baseMutations:x,mutations:z}})(this.serializer,this.userId,u),d=[];let f=new Ee(((g,I)=>ne(g.canonicalString(),I.canonicalString())));for(const g of s){const I=Em(this.userId,g.key.path,a);f=f.add(g.key.path.popLast()),d.push(o.put(l)),d.push(i.put(I,M5))}return f.forEach((g=>{d.push(this.indexManager.addToCollectionParentIndex(e,g))})),e.addOnCommittedListener((()=>{this.fs[a]=u.keys()})),b.waitFor(d).next((()=>u))}))}lookupMutationBatch(e,t){return Zn(e).get(t).next((n=>n?(B(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),jr(this.serializer,n)):null))}ps(e,t){return this.fs[t]?b.resolve(this.fs[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.fs[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Zn(e).ee({index:Yr,range:s},((o,a,u)=>{a.userId===this.userId&&(B(a.batchId>=n,47524,{gs:n}),i=jr(this.serializer,a)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=dr;return Zn(e).ee({index:Yr,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,dr],[this.userId,Number.POSITIVE_INFINITY]);return Zn(e).H(Yr,t).next((n=>n.map((s=>jr(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=nc(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Ls(e).ee({range:s},((o,a,u)=>{const[l,d,f]=o,g=tn(d);if(l===this.userId&&t.path.isEqual(g))return Zn(e).get(f).next((I=>{if(!I)throw W(61480,{ys:o,batchId:f});B(I.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:I.userId,batchId:f}),i.push(jr(this.serializer,I))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ee(ne);const s=[];return t.forEach((i=>{const o=nc(this.userId,i.path),a=IDBKeyRange.lowerBound(o),u=Ls(e).ee({range:a},((l,d,f)=>{const[g,I,R]=l,O=tn(I);g===this.userId&&i.path.isEqual(O)?n=n.add(R):f.done()}));s.push(u)})),b.waitFor(s).next((()=>this.ws(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=nc(this.userId,n),o=IDBKeyRange.lowerBound(i);let a=new Ee(ne);return Ls(e).ee({range:o},((u,l,d)=>{const[f,g,I]=u,R=tn(g);f===this.userId&&n.isPrefixOf(R)?R.length===s&&(a=a.add(I)):d.done()})).next((()=>this.ws(e,a)))}ws(e,t){const n=[],s=[];return t.forEach((i=>{s.push(Zn(e).get(i).next((o=>{if(o===null)throw W(35274,{batchId:i});B(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(jr(this.serializer,o))})))})),b.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return cg(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.bs(t.batchId)})),b.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}bs(e){delete this.fs[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return b.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return Ls(e).ee({range:n},((i,o,a)=>{if(i[0]===this.userId){const u=tn(i[1]);s.push(u)}else a.done()})).next((()=>{B(s.length===0,56720,{vs:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return ug(e,this.userId,t)}Ss(e){return lg(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:dr,lastStreamToken:""}))}}function ug(r,e,t){const n=nc(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Ls(r).ee({range:i,X:!0},((a,u,l)=>{const[d,f,g]=a;d===e&&f===s&&(o=!0),l.done()})).next((()=>o))}function Zn(r){return Ze(r,Gt)}function Ls(r){return Ze(r,Ys)}function lg(r){return Ze(r,Bo)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this.Ds=e}next(){return this.Ds+=2,this.Ds}static xs(){return new Fn(0)}static Cs(){return new Fn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cT{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Fs(e).next((t=>{const n=new Fn(t.highestTargetId);return t.highestTargetId=n.next(),this.Os(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.Fs(e).next((t=>X.fromTimestamp(new _e(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.Fs(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.Fs(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.Os(e,s))))}addTargetData(e,t){return this.Ms(e,t).next((()=>this.Fs(e).next((n=>(n.targetCount+=1,this.Ns(t,n),this.Os(e,n))))))}updateTargetData(e,t){return this.Ms(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>Os(e).delete(t.targetId))).next((()=>this.Fs(e))).next((n=>(B(n.targetCount>0,8065),n.targetCount-=1,this.Os(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return Os(e).ee(((o,a)=>{const u=fo(this.serializer,a);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>b.waitFor(i))).next((()=>s))}forEachTarget(e,t){return Os(e).ee(((n,s)=>{const i=fo(this.serializer,s);t(i)}))}Fs(e){return np(e).get(Ac).next((t=>(B(t!==null,2888),t)))}Os(e,t){return np(e).put(Ac,t)}Ms(e,t){return Os(e).put(ig(this.serializer,t))}Ns(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.Fs(e).next((t=>t.targetCount))}getTargetData(e,t){const n=Eu(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Os(e).ee({range:s,index:Tm},((o,a,u)=>{const l=fo(this.serializer,a);T1(t,l.target)&&(i=l,u.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=ir(e);return t.forEach((o=>{const a=pt(o.path);s.push(i.put({targetId:n,path:a})),s.push(this.referenceDelegate.addReference(e,n,o))})),b.waitFor(s)}removeMatchingKeys(e,t,n){const s=ir(e);return b.forEach(t,(i=>{const o=pt(i.path);return b.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=ir(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=ir(e);let i=se();return s.ee({range:n,X:!0},((o,a,u)=>{const l=tn(o[1]),d=new G(l);i=i.add(d)})).next((()=>i))}containsKey(e,t){const n=pt(t.path),s=IDBKeyRange.bound([n],[lm(n)],!1,!0);let i=0;return ir(e).ee({index:kh,X:!0,range:s},(([o,a],u,l)=>{o!==0&&(i++,l.done())})).next((()=>i>0))}dt(e,t){return Os(e).get(t).next((n=>n?fo(this.serializer,n):null))}}function Os(r){return Ze(r,Xs)}function np(r){return Ze(r,es)}function ir(r){return Ze(r,Js)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uT{constructor(e,t){this.db=e,this.garbageCollector=D0(this,t)}lr(e){const t=this.Ls(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Ls(e){let t=0;return this.Er(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Er(e,t){return this.Bs(e,((n,s)=>t(s)))}addReference(e,t,n){return Wa(e,n)}removeReference(e,t,n){return Wa(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Wa(e,t)}Us(e,t){return(function(s,i){let o=!1;return lg(s).te((a=>ug(s,a,i).next((u=>(u&&(o=!0),b.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Bs(e,((o,a)=>{if(a<=t){const u=this.Us(e,o).next((l=>{if(!l)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,X.min()),ir(e).delete((function(f){return[0,pt(f.path)]})(o)))))}));s.push(u)}})).next((()=>b.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Wa(e,t)}Bs(e,t){const n=ir(e);let s,i=Rt.ce;return n.ee({index:kh},(([o,a],{path:u,sequenceNumber:l})=>{o===0?(i!==Rt.ce&&t(new G(tn(s)),i),i=l,s=u):i=Rt.ce})).next((()=>{i!==Rt.ce&&t(new G(tn(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Wa(r,e){return ir(r).put((function(n,s){return{targetId:0,path:pt(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}// Copyright 2024 Google LLC* @license
function hg(r,e){var n;let t=e;for(const s of r.stages)t=lT({serializer:r.serializer,serverTimestampBehavior:(n=r.listenOptions)==null?void 0:n.serverTimestampBehavior},s,t);return t}function Au(r,e){return hg(r,[e]).length>0}function dg(r,e){return Me(r)?Au(r,e):lu(r,e)}function lT(r,e,t){if(e instanceof fa)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()&&`/${a.key.getCollectionPath().canonicalString()}`===i.Vr))})(0,e,t);if(e instanceof ma)return(function(s,i,o){return o.filter((a=>{const u=No(ee(i.condition).evaluate(s,a));return u!==void 0&&Bt(u,Nt)}))})(r,e,t);if(e instanceof pa)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()&&a.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof mu)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()))})(0,0,t);if(e instanceof gu)return(function(s,i,o){return o.filter((a=>a.isFoundDocument()&&i.mr.has(a.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Ar)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof rn)return(function(s,i,o){const a=i.orderings.map((u=>({ks:ee(u.expr),direction:u.direction})));return[...o].sort(((u,l)=>{for(const{ks:d,direction:f}of a){const g=No(d.evaluate(s,u)),I=No(d.evaluate(s,l)),R=gt(g??cn,I??cn);if(R!==0)return f==="ascending"?R:-R}return 0}))})(r,e,t);throw new Error(`Unknown stage: ${e._name}`)}function eh(r){const e=(function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof rn)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(r);return(t,n)=>{for(const s of e){const i=No(ee(s.expr).evaluate({serializer:r.serializer},t)),o=No(ee(s.expr).evaluate({serializer:r.serializer},n)),a=gt(i||cn,o||cn);if(a!==0)return s.direction==="ascending"?a:-a}return 0}}function gl(r){for(let e=r.stages.length-1;e>=0;e--){const t=r.stages[e];if(t instanceof Ar)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fg{constructor(){this.changes=new $n((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ce.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?b.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hT{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return er(e).put(n)}removeEntry(e,t,n){return er(e).delete((function(i,o){const a=i.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],Vc(o),a[a.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.qs(e,n))))}getEntry(e,t){let n=Ce.newInvalidDocument(t);return er(e).ee({index:rc,range:IDBKeyRange.only(so(t))},((s,i)=>{n=this.$s(t,i)})).next((()=>n))}Ks(e,t){let n={size:0,document:Ce.newInvalidDocument(t)};return er(e).ee({index:rc,range:IDBKeyRange.only(so(t))},((s,i)=>{n={document:this.$s(t,i),size:kc(i)}})).next((()=>n))}getEntries(e,t){let n=He();return this.Ws(e,t,((s,i)=>{const o=this.$s(s,i);n=n.insert(s,o)})).next((()=>n))}getAllEntries(e){let t=He();return er(e).ee(((n,s)=>{const i=this.$s(G.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);t=t.insert(i.key,i)})).next((()=>t))}Qs(e,t){let n=He(),s=new Re(G.comparator);return this.Ws(e,t,((i,o)=>{const a=this.$s(i,o);n=n.insert(i,a),s=s.insert(i,kc(o))})).next((()=>({documents:n,Gs:s})))}Ws(e,t,n){if(t.isEmpty())return b.resolve();let s=new Ee(ip);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(so(s.first()),so(s.last())),o=s.getIterator();let a=o.getNext();return er(e).ee({index:rc,range:i},((u,l,d)=>{const f=G.fromSegments([...l.prefixPath,l.collectionGroup,l.documentId]);for(;a&&ip(a,f)<0;)n(a,null),a=o.getNext();a&&a.isEqual(f)&&(n(a,l),a=o.hasNext()?o.getNext():null),a?d.j(so(a)):d.done()})).next((()=>{for(;a;)n(a,null),a=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=Me(t)?ie.fromString(ga(t)):t.path,a=[o.popLast().toArray(),o.lastSegment(),Vc(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return er(e).H(IDBKeyRange.bound(a,u,!0)).next((l=>{i==null||i.incrementDocumentReadCount(l.length);let d=He();for(const f of l){const g=this.$s(G.fromSegments(f.prefixPath.concat(f.collectionGroup,f.documentId)),f);g.isFoundDocument()&&(dg(t,g)||s.has(g.key))&&(d=d.insert(g.key,g))}return d}))}getAllFromCollectionGroup(e,t,n,s){let i=He();const o=sp(t,n),a=sp(t,Lt.max());return er(e).ee({index:Im,range:IDBKeyRange.bound(o,a,!0)},((u,l,d)=>{const f=this.$s(G.fromSegments(l.prefixPath.concat(l.collectionGroup,l.documentId)),l);i=i.insert(f.key,f),i.size===s&&d.done()})).next((()=>i))}newChangeBuffer(e){return new dT(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return rp(e).get(xl).next((t=>(B(!!t,20021),t)))}qs(e,t){return rp(e).put(xl,t)}$s(e,t){if(t){const n=XI(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(X.min())))return n}return Ce.newInvalidDocument(e)}}function pg(r){return new hT(r)}class dT extends fg{constructor(e,t){super(),this.zs=e,this.trackRemovals=t,this.js=new $n((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new Ee(((i,o)=>ne(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const a=this.js.get(i);if(t.push(this.zs.removeEntry(e,i,a.readTime)),o.isValidDocument()){const u=$2(this.zs.serializer,o);s=s.add(i.path.popLast());const l=kc(u);n+=l-a.size,t.push(this.zs.addEntry(e,i,u))}else if(n-=a.size,this.trackRemovals){const u=$2(this.zs.serializer,o.convertToNoDocument(X.min()));t.push(this.zs.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.zs.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.zs.updateMetadata(e,n)),b.waitFor(t)}getFromCache(e,t){return this.zs.Ks(e,t).next((n=>(this.js.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.zs.Qs(e,t).next((({documents:n,Gs:s})=>(s.forEach(((i,o)=>{this.js.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function rp(r){return Ze(r,qo)}function er(r){return Ze(r,wc)}function so(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function sp(r,e){const t=e.documentKey.path.toArray();return[r,Vc(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function ip(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=ne(t[i],n[i]),s)return s;return s=ne(t.length,n.length),s||(s=ne(t[t.length-2],n[n.length-2]),s||ne(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fT{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mg{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&Ro(n.mutation,s,Pt.empty(),_e.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,se()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=se()){const s=Ft();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=Hr();return i.forEach(((a,u)=>{o=o.insert(a,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Ft();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,se())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,a)=>{t.set(o,a)}))}))}computeViews(e,t,n,s){let i=He();const o=So(),a=(function(){return So()})();return t.forEach(((u,l)=>{const d=n.get(l.key);s.has(l.key)&&(d===void 0||d.mutation instanceof qn)?i=i.insert(l.key,l):d!==void 0?(o.set(l.key,d.mutation.getFieldMask()),Ro(d.mutation,l,d.mutation.getFieldMask(),_e.now())):o.set(l.key,Pt.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((l,d)=>o.set(l,d))),t.forEach(((l,d)=>a.set(l,new fT(d,o.get(l)??null)))),a)))}recalculateAndSaveOverlays(e,t){const n=So();let s=new Re(((o,a)=>o-a)),i=se();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const a of o)a.keys().forEach((u=>{const l=t.get(u);if(l===null)return;let d=n.get(u)||Pt.empty();d=a.applyToLocalView(l,d),n.set(u,d);const f=(s.get(a.batchId)||se()).add(u);s=s.insert(a.batchId,f)}))})).next((()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),l=u.key,d=u.value,f=a0();d.forEach((g=>{if(!i.has(g)){const I=$m(t.get(g),n.get(g));I!==null&&f.set(g,I),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,f))}return b.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return Me(t)?this.getDocumentsMatchingPipeline(e,t,n,s):Sy(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Wh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):b.resolve(Ft());let a=js,u=i;return o.next((l=>b.forEach(l,((d,f)=>(a<f.largestBatchId&&(a=f.largestBatchId),i.get(d)?b.resolve():this.remoteDocumentCache.getEntry(e,d).next((g=>{u=u.insert(d,g)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,u,l,se()))).next((d=>({batchId:a,changes:o0(d)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new G(t)).next((n=>{let s=Hr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Hr();return this.indexManager.getCollectionParents(e,i).next((a=>b.forEach(a,(u=>{const l=(function(f,g){return new Gn(g,null,f.explicitOrderBy.slice(),f.filters.slice(),f.limit,f.limitType,f.startAt,f.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,n,s).next((d=>{d.forEach(((f,g)=>{o=o.insert(f,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(a=>lu(t,a)))))}getDocumentsMatchingPipeline(e,t,n,s){if(Nn(t)==="collection_group"){const i=p1(t);let o=Hr();return this.indexManager.getCollectionParents(e,i).next((a=>b.forEach(a,(u=>{const l=(function(f,g){const I=f.stages.map((R=>R instanceof pa?new fa(g.canonicalString(),{}):R));return new ft(f.serializer,I)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,l,n,s).next((d=>{d.forEach(((f,g)=>{o=o.insert(f,g)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,n.largestBatchId).next((o=>{switch(i=o,Nn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s);case"documents":let a=se();for(const u of Nc(t))a=a.add(G.fromPath(u));return this.remoteDocumentCache.getEntries(e,a);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new F("invalid-argument",`Invalid pipeline source to execute offline: ${Dn(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(a=>Au(t,a)))))}}retrieveMatchingLocalDocuments(e,t,n){e.forEach(((i,o)=>{const a=o.getKey();t.get(a)===null&&(t=t.insert(a,Ce.newInvalidDocument(a)))}));let s=Hr();return t.forEach(((i,o)=>{const a=e.get(i);a!==void 0&&Ro(a.mutation,o,Pt.empty(),_e.now()),n(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,n){switch(Nn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,ie.fromString(ga(t)),n);case"collection_group":throw new F("invalid-argument",`Unexpected collection group pipeline: ${Dn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,Nc(t).map((s=>G.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,n);default:throw new F("invalid-argument",`Failed to get overlays for pipeline: ${Dn(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pT{constructor(e){this.serializer=e,this.Hs=new Map,this.Js=new Map}getBundleMetadata(e,t){return b.resolve(this.Hs.get(t))}saveBundleMetadata(e,t){return this.Hs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Ge(s.createTime)}})(t)),b.resolve()}getNamedQuery(e,t){return b.resolve(this.Js.get(t))}saveNamedQuery(e,t){return this.Js.set(t.name,(function(s){return{name:s.name,query:Iu(s.bundledQuery),readTime:Ge(s.readTime)}})(t)),b.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mT{constructor(){this.overlays=new Re(G.comparator),this.Ys=new Map}getOverlay(e,t){return b.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Ft();return b.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=Ft();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&n.set(s,i)})),b.resolve(n)}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.Hr(e,t,i)})),b.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Ys.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Ys.delete(n)),b.resolve()}getOverlaysForCollection(e,t,n){const s=Ft(),i=t.length+1,o=new G(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return b.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new Re(((l,d)=>l-d));const o=this.overlays.getIterator();for(;o.hasNext();){const l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>n){let d=i.get(l.largestBatchId);d===null&&(d=Ft(),i=i.insert(l.largestBatchId,d)),d.set(l.getKey(),l)}}const a=Ft(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((l,d)=>a.set(l,d))),!(a.size()>=s)););return b.resolve(a)}Hr(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Ys.get(s.largestBatchId).delete(n.key);this.Ys.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new v1(t,n));let i=this.Ys.get(t);i===void 0&&(i=se(),this.Ys.set(t,i)),this.Ys.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gT{constructor(){this.sessionToken=Se.EMPTY_BYTE_STRING}getSessionToken(e){return b.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,b.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S1{constructor(){this.Zs=new Ee(tt.Xs),this.e_=new Ee(tt.t_)}isEmpty(){return this.Zs.isEmpty()}addReference(e,t){const n=new tt(e,t);this.Zs=this.Zs.add(n),this.e_=this.e_.add(n)}n_(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.r_(new tt(e,t))}i_(e,t){e.forEach((n=>this.removeReference(n,t)))}s_(e){const t=new G(new ie([])),n=new tt(t,e),s=new tt(t,e+1),i=[];return this.e_.forEachInRange([n,s],(o=>{this.r_(o),i.push(o.key)})),i}__(){this.Zs.forEach((e=>this.r_(e)))}r_(e){this.Zs=this.Zs.delete(e),this.e_=this.e_.delete(e)}o_(e){const t=new G(new ie([])),n=new tt(t,e),s=new tt(t,e+1);let i=se();return this.e_.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new tt(e,0),n=this.Zs.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class tt{constructor(e,t){this.key=e,this.a_=t}static Xs(e,t){return G.comparator(e.key,t.key)||ne(e.a_,t.a_)}static t_(e,t){return ne(e.a_,t.a_)||G.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _T{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.gs=1,this.u_=new Ee(tt.Xs)}checkEmpty(e){return b.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.gs;this.gs++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new w1(i,t,n,s);this.mutationQueue.push(o);for(const a of s)this.u_=this.u_.add(new tt(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return b.resolve(o)}lookupMutationBatch(e,t){return b.resolve(this.c_(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.l_(n),i=s<0?0:s;return b.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return b.resolve(this.mutationQueue.length===0?dr:this.gs-1)}getAllMutationBatches(e){return b.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new tt(t,0),s=new tt(t,Number.POSITIVE_INFINITY),i=[];return this.u_.forEachInRange([n,s],(o=>{const a=this.c_(o.a_);i.push(a)})),b.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ee(ne);return t.forEach((s=>{const i=new tt(s,0),o=new tt(s,Number.POSITIVE_INFINITY);this.u_.forEachInRange([i,o],(a=>{n=n.add(a.a_)}))})),b.resolve(this.E_(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;G.isDocumentKey(i)||(i=i.child(""));const o=new tt(new G(i),0);let a=new Ee(ne);return this.u_.forEachWhile((u=>{const l=u.key.path;return!!n.isPrefixOf(l)&&(l.length===s&&(a=a.add(u.a_)),!0)}),o),b.resolve(this.E_(a))}E_(e){const t=[];return e.forEach((n=>{const s=this.c_(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){B(this.h_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.u_;return b.forEach(t.mutations,(s=>{const i=new tt(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.u_=n}))}bs(e){}containsKey(e,t){const n=new tt(t,0),s=this.u_.firstAfterOrEqual(n);return b.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,b.resolve()}h_(e,t){return this.l_(e)}l_(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}c_(e){const t=this.l_(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yT{constructor(e){this.T_=e,this.docs=(function(){return new Re(G.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.T_(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return b.resolve(n?n.document.mutableCopy():Ce.newInvalidDocument(t))}getEntries(e,t){let n=He();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():Ce.newInvalidDocument(s))})),b.resolve(n)}getAllEntries(e){let t=He();return this.docs.forEach(((n,s)=>{t=t.insert(n,s.document)})),b.resolve(t)}getDocumentsMatchingQuery(e,t,n,s){let i,o;Me(t)?(i=ie.fromString(ga(t)),o=d=>Au(t,d)):(i=t.path,o=d=>lu(t,d));let a=He();const u=new G(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){const{key:d,value:{document:f}}=l.getNext();if(!i.isPrefixOf(d.path))break;d.path.length>i.length+1||Vh(pm(f),n)<=0||(s.has(f.key)||o(f))&&(a=a.insert(f.key,f.mutableCopy()))}return b.resolve(a)}getAllFromCollectionGroup(e,t,n,s){W(9500)}P_(e,t){return b.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new ET(this)}getSize(e){return b.resolve(this.size)}}class ET extends fg{constructor(e){super(),this.zs=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.zs.addEntry(e,s)):this.zs.removeEntry(n)})),b.waitFor(t)}getFromCache(e,t){return this.zs.getEntry(e,t)}getAllFromCache(e,t){return this.zs.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IT{constructor(e){this.persistence=e,this.R_=new $n((t=>Eu(t)),T1),this.lastRemoteSnapshotVersion=X.min(),this.highestTargetId=0,this.I_=0,this.A_=new S1,this.targetCount=0,this.V_=Fn.xs()}forEachTarget(e,t){return this.R_.forEach(((n,s)=>t(s))),b.resolve()}getLastRemoteSnapshotVersion(e){return b.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return b.resolve(this.I_)}allocateTargetId(e){return this.highestTargetId=this.V_.next(),b.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.I_&&(this.I_=t),b.resolve()}Ms(e){this.R_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.V_=new Fn(t),this.highestTargetId=t),e.sequenceNumber>this.I_&&(this.I_=e.sequenceNumber)}addTargetData(e,t){return this.Ms(t),this.targetCount+=1,b.resolve()}updateTargetData(e,t){return this.Ms(t),b.resolve()}removeTargetData(e,t){return this.R_.delete(t.target),this.A_.s_(t.targetId),this.targetCount-=1,b.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.R_.forEach(((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.R_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)})),b.waitFor(i).next((()=>s))}getTargetCount(e){return b.resolve(this.targetCount)}getTargetData(e,t){const n=this.R_.get(t)||null;return b.resolve(n)}addMatchingKeys(e,t,n){return this.A_.n_(t,n),b.resolve()}removeMatchingKeys(e,t,n){this.A_.i_(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),b.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.A_.s_(t),b.resolve()}getMatchingKeysForTargetId(e,t){const n=this.A_.o_(t);return b.resolve(n)}containsKey(e,t){return b.resolve(this.A_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b1{constructor(e,t){this.d_={},this.overlays={},this.f_=new Rt(0),this.m_=!1,this.m_=!0,this.p_=new gT,this.referenceDelegate=e(this),this.g_=new IT(this),this.indexManager=new oT,this.remoteDocumentCache=(function(s){return new yT(s)})((n=>this.referenceDelegate.y_(n))),this.serializer=new sg(t),this.w_=new pT(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.m_=!1,Promise.resolve()}get started(){return this.m_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new mT,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.d_[e.toKey()];return n||(n=new _T(t,this.referenceDelegate),this.d_[e.toKey()]=n),n}getGlobalsCache(){return this.p_}getTargetCache(){return this.g_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.w_}runTransaction(e,t,n){U("MemoryPersistence","Starting transaction:",e);const s=new TT(this.f_.next());return this.referenceDelegate.b_(),n(s).next((i=>this.referenceDelegate.v_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}S_(e,t){return b.or(Object.values(this.d_).map((n=>()=>n.containsKey(e,t))))}}class TT extends gm{constructor(e){super(),this.currentSequenceNumber=e}}class vu{constructor(e){this.persistence=e,this.D_=new S1,this.x_=null}static C_(e){return new vu(e)}get F_(){if(this.x_)return this.x_;throw W(60996)}addReference(e,t,n){return this.D_.addReference(n,t),this.F_.delete(n.toString()),b.resolve()}removeReference(e,t,n){return this.D_.removeReference(n,t),this.F_.add(n.toString()),b.resolve()}markPotentiallyOrphaned(e,t){return this.F_.add(t.toString()),b.resolve()}removeTarget(e,t){this.D_.s_(t.targetId).forEach((s=>this.F_.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.F_.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}b_(){this.x_=new Set}v_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return b.forEach(this.F_,(n=>{const s=G.fromPath(n);return this.O_(e,s).next((i=>{i||t.removeEntry(s,X.min())}))})).next((()=>(this.x_=null,t.apply(e))))}updateLimboDocument(e,t){return this.O_(e,t).next((n=>{n?this.F_.delete(t.toString()):this.F_.add(t.toString())}))}y_(e){return 0}O_(e,t){return b.or([()=>b.resolve(this.D_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.S_(e,t)])}}class xc{constructor(e,t){this.persistence=e,this.M_=new $n((n=>pt(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=D0(this,t)}static C_(e,t){return new xc(e,t)}b_(){}v_(e){return b.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}lr(e){const t=this.Ls(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Ls(e){let t=0;return this.Er(e,(n=>{t++})).next((()=>t))}Er(e,t){return b.forEach(this.M_,((n,s)=>this.Us(e,n,s).next((i=>i?b.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.P_(e,(o=>this.Us(e,o,t).next((a=>{a||(n++,i.removeEntry(o,X.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.M_.set(t,e.currentSequenceNumber),b.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.M_.set(n,e.currentSequenceNumber),b.resolve()}removeReference(e,t,n){return this.M_.set(n,e.currentSequenceNumber),b.resolve()}updateLimboDocument(e,t){return this.M_.set(t,e.currentSequenceNumber),b.resolve()}y_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=sc(e.data.value)),t}Us(e,t,n){return b.or([()=>this.persistence.S_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.M_.get(t);return b.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wT{constructor(e){this.serializer=e}U(e,t,n,s){const i=new ru("createOrUpgrade",t);n<1&&s>=1&&((function(u){u.createObjectStore(aa)})(e),(function(u){u.createObjectStore(Bo,{keyPath:L5}),u.createObjectStore(Gt,{keyPath:h2,autoIncrement:!0}).createIndex(Yr,d2,{unique:!0}),u.createObjectStore(Ys)})(e),op(e),(function(u){u.createObjectStore($r)})(e));let o=b.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(Js),u.deleteObjectStore(Xs),u.deleteObjectStore(es)})(e),op(e)),o=o.next((()=>(function(u){const l=u.store(es),d={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:X.min().toTimestamp(),targetCount:0};return l.put(Ac,d)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(u,l){return l.store(Gt).H().next((f=>{u.deleteObjectStore(Gt),u.createObjectStore(Gt,{keyPath:h2,autoIncrement:!0}).createIndex(Yr,d2,{unique:!0});const g=l.store(Gt),I=f.map((R=>g.put(R)));return b.waitFor(I)}))})(e,i)))),o=o.next((()=>{(function(u){u.createObjectStore(Zs,{keyPath:H5})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.N_(i)))),n<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(qo)})(e),this.L_(i))))),n<7&&s>=7&&(o=o.next((()=>this.B_(i)))),n<8&&s>=8&&(o=o.next((()=>this.U_(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.k_(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(su,{keyPath:j5})})(e),(function(u){u.createObjectStore(iu,{keyPath:W5})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(u){const l=u.createObjectStore(ou,{keyPath:ey});l.createIndex(Ml,ty,{unique:!1}),l.createIndex(vm,ny,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(u){const l=u.createObjectStore(wc,{keyPath:F5});l.createIndex(rc,U5),l.createIndex(Im,B5)})(e))).next((()=>this.q_(e,i))).next((()=>e.deleteObjectStore($r)))),n<14&&s>=14&&(o=o.next((()=>this.K_(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore(xh,{keyPath:K5,autoIncrement:!0}).createIndex(Ll,Q5,{unique:!1}),u.createObjectStore(wo,{keyPath:Y5}).createIndex(wm,X5,{unique:!1}),u.createObjectStore(Ao,{keyPath:J5}).createIndex(Am,Z5,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(wo).clear()})).next((()=>{t.objectStore(Ao).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(Lh,{keyPath:ry})})(e)}))),n<18&&s>=18&&$p()&&(o=o.next((()=>{t.objectStore(wo).clear()})).next((()=>{t.objectStore(Ao).clear()}))),o}L_(e){let t=0;return e.store($r).ee(((n,s)=>{t+=kc(s)})).next((()=>{const n={byteSize:t};return e.store(qo).put(xl,n)}))}N_(e){const t=e.store(Bo),n=e.store(Gt);return t.H().next((s=>b.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,dr],[i.userId,i.lastAcknowledgedBatchId]);return n.H(Yr,o).next((a=>b.forEach(a,(u=>{B(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const l=jr(this.serializer,u);return cg(e,i.userId,l).next((()=>{}))}))))}))))}B_(e){const t=e.store(Js),n=e.store($r);return e.store(es).get(Ac).next((s=>{const i=[];return n.ee(((o,a)=>{const u=new ie(o),l=(function(f){return[0,pt(f)]})(u);i.push(t.get(l).next((d=>d?b.resolve():(f=>t.put({targetId:0,path:pt(f),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>b.waitFor(i)))}))}U_(e,t){e.createObjectStore(Go,{keyPath:z5});const n=t.store(Go),s=new P1,i=o=>{if(s.add(o)){const a=o.lastSegment(),u=o.popLast();return n.put({collectionId:a,parent:pt(u)})}};return t.store($r).ee({X:!0},((o,a)=>{const u=new ie(o);return i(u.popLast())})).next((()=>t.store(Ys).ee({X:!0},(([o,a,u],l)=>{const d=tn(a);return i(d.popLast())}))))}k_(e){const t=e.store(Xs);return t.ee(((n,s)=>{const i=fo(this.serializer,s),o=ig(this.serializer,i);return t.put(o)}))}q_(e,t){const n=t.store($r),s=[];return n.ee(((i,o)=>{const a=t.store(wc),u=(function(f){return f.document?new G(ie.fromString(f.document.name).popFirst(5)):f.noDocument?G.fromSegments(f.noDocument.path):f.unknownDocument?G.fromSegments(f.unknownDocument.path):W(36783)})(o).path.toArray(),l={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(a.put(l))})).next((()=>b.waitFor(s)))}K_(e,t){const n=t.store(Gt),s=pg(this.serializer),i=new b1(vu.C_,this.serializer.zr);return n.H().next((o=>{const a=new Map;return o.forEach((u=>{let l=a.get(u.userId)??se();jr(this.serializer,u).keys().forEach((d=>l=l.add(d))),a.set(u.userId,l)})),b.forEach(a,((u,l)=>{const d=new nt(l),f=Tu.jr(this.serializer,d),g=i.getIndexManager(d),I=wu.jr(d,this.serializer,g,i.referenceDelegate);return new mg(s,I,f,g).recalculateAndSaveOverlaysForDocumentKeys(new Fl(t,Rt.ce),u).next()}))}))}}function op(r){r.createObjectStore(Js,{keyPath:G5}).createIndex(kh,$5,{unique:!0}),r.createObjectStore(Xs,{keyPath:"targetId"}).createIndex(Tm,q5,{unique:!0}),r.createObjectStore(es)}const tr="IndexedDbPersistence",_l=18e5,yl=5e3,El="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",gg="main";class C1{constructor(e,t,n,s,i,o,a,u,l,d,f=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Tn=i,this.window=o,this.document=a,this.W_=l,this.Q_=d,this.G_=f,this.f_=null,this.m_=!1,this.isPrimary=!1,this.networkEnabled=!0,this.z_=null,this.inForeground=!1,this.j_=null,this.H_=null,this.J_=Number.NEGATIVE_INFINITY,this.Y_=g=>Promise.resolve(),!C1.C())throw new F(N.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new uT(this,s),this.Z_=t+gg,this.serializer=new sg(u),this.X_=new an(this.Z_,this.G_,new wT(this.serializer)),this.p_=new eT,this.g_=new cT(this.referenceDelegate,this.serializer),this.remoteDocumentCache=pg(this.serializer),this.w_=new ZI,this.window&&this.window.localStorage?this.eo=this.window.localStorage:(this.eo=null,d===!1&&qe(tr,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.no().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new F(N.FAILED_PRECONDITION,El);return this.ro(),this.io(),this.so(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.g_.getHighestSequenceNumber(e)))})).then((e=>{this.f_=new Rt(e,this.W_)})).then((()=>{this.m_=!0})).catch((e=>(this.X_&&this.X_.close(),Promise.reject(e))))}_o(e){return this.Y_=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.X_.q((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Tn.enqueueAndForget((async()=>{this.started&&await this.no()})))}no(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Ka(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.oo(e).next((t=>{t||(this.isPrimary=!1,this.Tn.enqueueRetryable((()=>this.Y_(!1))))}))})).next((()=>this.ao(e))).next((t=>this.isPrimary&&!t?this.uo(e).next((()=>!1)):!!t&&this.co(e).next((()=>!0)))))).catch((e=>{if(Nr(e))return U(tr,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return U(tr,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Tn.enqueueRetryable((()=>this.Y_(e))),this.isPrimary=e}))}oo(e){return io(e).get(Ss).next((t=>b.resolve(this.lo(t))))}Eo(e){return Ka(e).delete(this.clientId)}async ho(){if(this.isPrimary&&!this.To(this.J_,_l)){this.J_=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=Ze(t,Zs);return n.H().next((s=>{const i=this.Po(s,_l),o=s.filter((a=>i.indexOf(a)===-1));return b.forEach(o,(a=>n.delete(a.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.eo)for(const t of e)this.eo.removeItem(this.Ro(t.clientId))}}so(){this.H_=this.Tn.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.no().then((()=>this.ho())).then((()=>this.so()))))}lo(e){return!!e&&e.ownerId===this.clientId}ao(e){return this.Q_?b.resolve(!0):io(e).get(Ss).next((t=>{if(t!==null&&this.To(t.leaseTimestampMs,yl)&&!this.Io(t.ownerId)){if(this.lo(t)&&this.networkEnabled)return!0;if(!this.lo(t)){if(!t.allowTabSynchronization)throw new F(N.FAILED_PRECONDITION,El);return!1}}return!(!this.networkEnabled||!this.inForeground)||Ka(e).H().next((n=>this.Po(n,yl).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,a=this.networkEnabled===s.networkEnabled;if(i||o&&a)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&U(tr,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.m_=!1,this.Ao(),this.H_&&(this.H_.cancel(),this.H_=null),this.Vo(),this.fo(),await this.X_.runTransaction("shutdown","readwrite",[aa,Zs],(e=>{const t=new Fl(e,Rt.ce);return this.uo(t).next((()=>this.Eo(t)))})),this.X_.close(),this.mo()}Po(e,t){return e.filter((n=>this.To(n.updateTimeMs,t)&&!this.Io(n.clientId)))}po(){return this.runTransaction("getActiveClients","readonly",(e=>Ka(e).H().next((t=>this.Po(t,_l).map((n=>n.clientId))))))}get started(){return this.m_}getGlobalsCache(){return this.p_}getMutationQueue(e,t){return wu.jr(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.g_}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new aT(e,this.serializer.zr.databaseId)}getDocumentOverlayCache(e){return Tu.jr(this.serializer,e)}getBundleCache(){return this.w_}runTransaction(e,t,n){U(tr,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?oy:u===17?bm:u===16?iy:u===15?Mh:u===14?Sm:u===13?Pm:u===12?sy:u===11?Rm:void W(60245)})(this.G_);let o;return this.X_.runTransaction(e,s,i,(a=>(o=new Fl(a,this.f_?this.f_.next():Rt.ce),t==="readwrite-primary"?this.oo(o).next((u=>!!u||this.ao(o))).next((u=>{if(!u)throw qe(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Tn.enqueueRetryable((()=>this.Y_(!1))),new F(N.FAILED_PRECONDITION,mm);return n(o)})).next((u=>this.co(o).next((()=>u)))):this.yo(o).next((()=>n(o)))))).then((a=>(o.raiseOnCommittedEvent(),a)))}yo(e){return io(e).get(Ss).next((t=>{if(t!==null&&this.To(t.leaseTimestampMs,yl)&&!this.Io(t.ownerId)&&!this.lo(t)&&!(this.Q_||this.allowTabSynchronization&&t.allowTabSynchronization))throw new F(N.FAILED_PRECONDITION,El)}))}co(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return io(e).put(Ss,t)}static C(){return an.C()}uo(e){const t=io(e);return t.get(Ss).next((n=>this.lo(n)?(U(tr,"Releasing primary lease."),t.delete(Ss)):b.resolve()))}To(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(qe(`Detected an update time that is in the future: ${e} > ${n}`),!1))}ro(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.j_=()=>{this.Tn.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.no())))},this.document.addEventListener("visibilitychange",this.j_),this.inForeground=this.document.visibilityState==="visible")}Vo(){this.j_&&(this.document.removeEventListener("visibilitychange",this.j_),this.j_=null)}io(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.z_=()=>{this.Ao();const t=/(?:Version|Mobile)\/1[456]/;Gp()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Tn.enterRestrictedMode(!0),this.Tn.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.z_))}fo(){this.z_&&(this.window.removeEventListener("pagehide",this.z_),this.z_=null)}Io(e){var t;try{const n=((t=this.eo)==null?void 0:t.getItem(this.Ro(e)))!==null;return U(tr,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return qe(tr,"Failed to get zombied client id.",n),!1}}Ao(){if(this.eo)try{this.eo.setItem(this.Ro(this.clientId),String(Date.now()))}catch(e){qe("Failed to set zombie client id.",e)}}mo(){if(this.eo)try{this.eo.removeItem(this.Ro(this.clientId))}catch{}}Ro(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function io(r){return Ze(r,aa)}function Ka(r){return Ze(r,Zs)}function N1(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D1{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.wo=n,this.bo=s}static vo(e,t){let n=se(),s=se();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new D1(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AT(r,e){return G.comparator(r.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vT{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _g{constructor(){this.So=!1,this.Do=!1,this.xo=100,this.Co=(function(){return Gp()?8:_m(Ye())>0?6:4})()}initialize(e,t){this.Fo=e,this.indexManager=t,this.So=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.Oo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Mo(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new vT;return this.No(e,t,o).next((a=>{if(i.result=a,this.Do)return this.Lo(e,t,o,a.size)}))})).next((()=>i.result))}Lo(e,t,n,s){return Me(t)?b.resolve():n.documentReadCount<this.xo?(ks()<=fe.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",Po(t),"since it only creates cache indexes for collection contains","more than or equal to",this.xo,"documents"),b.resolve()):(ks()<=fe.DEBUG&&U("QueryEngine","Query:",Po(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Co*s?(ks()<=fe.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",Po(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,mt(t))):b.resolve())}Oo(e,t){if(Me(t))return b.resolve(null);let n=t;if(P2(n))return b.resolve(null);let s=mt(n);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=bc(n,null,"F"),s=mt(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const a=se(...o);return this.Fo.getDocuments(e,a).next((u=>this.indexManager.getMinOffset(e,s).next((l=>{const d=this.Bo(n,u);return this.Uo(n,d,a,l.readTime)?this.Oo(e,bc(n,null,"F")):this.ko(e,d,n,l)}))))})))))}Mo(e,t,n,s){return(Me(t)?(function(o){for(const a of o.stages){if(a instanceof Ar||a instanceof q2)return!1;if(a instanceof ma){if(a.condition instanceof H0&&a.condition._expr.name==="exists"&&a.condition._expr.params[0]instanceof Ts&&a.condition._expr.params[0].fieldName===en)continue;return!1}}return!0})(t):P2(t))||s.isEqual(X.min())?b.resolve(null):this.Fo.getDocuments(e,n).next((i=>{const o=this.Bo(t,i);return this.Uo(t,o,n,s)?b.resolve(null):(ks()<=fe.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),G2(t)),this.ko(e,o,t,fm(s,js)).next((a=>a)))}))}Bo(e,t){let n,s;return Me(e)?(n=new Ee(AT),s=i=>Au(e,i)):(n=new Ee(Kh(e)),s=i=>lu(e,i)),t.forEach(((i,o)=>{s(o)&&(n=n.add(o))})),n}Uo(e,t,n,s){if(Me(e))return(function(a){return a.stages.some((u=>u instanceof Ar||u instanceof q2))})(e);if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}No(e,t,n){return ks()<=fe.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",G2(t)),this.Fo.getDocumentsMatchingQuery(e,t,Lt.min(),n)}ko(e,t,n,s){return this.Fo.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V1="LocalStore",RT=3e8;class PT{constructor(e,t,n,s){this.persistence=e,this.qo=t,this.serializer=s,this.$o=new Re(ne),this.Ko=new $n((i=>Eu(i)),T1),this.Wo=new Map,this.Qo=e.getRemoteDocumentCache(),this.g_=e.getTargetCache(),this.w_=e.getBundleCache(),this.Go(n)}Go(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new mg(this.Qo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Qo.setIndexManager(this.indexManager),this.qo.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.$o)))}}function yg(r,e,t,n){return new PT(r,e,t,n)}async function Eg(r,e){const t=H(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.Go(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],a=[];let u=se();for(const l of s){o.push(l.batchId);for(const d of l.mutations)u=u.add(d.key)}for(const l of i){a.push(l.batchId);for(const d of l.mutations)u=u.add(d.key)}return t.localDocuments.getDocuments(n,u).next((l=>({zo:l,removedBatchIds:o,addedBatchIds:a})))}))}))}function ST(r,e){const t=H(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.Qo.newChangeBuffer({trackRemovals:!0});return(function(a,u,l,d){const f=l.batch,g=f.keys();let I=b.resolve();return g.forEach((R=>{I=I.next((()=>d.getEntry(u,R))).next((O=>{const x=l.docVersions.get(R);B(x!==null,48541),O.version.compareTo(x)<0&&(f.applyToRemoteDocument(O,l),O.isValidDocument()&&(O.setReadTime(l.commitVersion),d.addEntry(O)))}))})),I.next((()=>a.mutationQueue.removeMutationBatch(u,f)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(a){let u=se();for(let l=0;l<a.mutationResults.length;++l)a.mutationResults[l].transformResults.length>0&&(u=u.add(a.batch.mutations[l].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Ig(r){const e=H(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.g_.getLastRemoteSnapshotVersion(t)))}function bT(r,e){const t=H(r),n=e.snapshotVersion;let s=t.$o;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Qo.newChangeBuffer({trackRemovals:!0});s=t.$o;const a=[];e.targetChanges.forEach(((d,f)=>{const g=s.get(f);if(!g)return;a.push(t.g_.removeMatchingKeys(i,d.removedDocuments,f).next((()=>t.g_.addMatchingKeys(i,d.addedDocuments,f))));let I=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(f)!==null?I=I.withResumeToken(Se.EMPTY_BYTE_STRING,X.min()).withLastLimboFreeSnapshotVersion(X.min()):d.resumeToken.approximateByteSize()>0&&(I=I.withResumeToken(d.resumeToken,n)),s=s.insert(f,I),(function(O,x,z){return O.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=RT?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0})(g,I,d)&&a.push(t.g_.updateTargetData(i,I))}));let u=He(),l=se();if(e.documentUpdates.forEach((d=>{e.resolvedLimboDocuments.has(d)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,d))})),a.push(Tg(i,o,e.documentUpdates).next((d=>{u=d.jo,l=d.Ho}))),!n.isEqual(X.min())){const d=t.g_.getLastRemoteSnapshotVersion(i).next((f=>t.g_.setTargetsMetadata(i,i.currentSequenceNumber,n)));a.push(d)}return b.waitFor(a).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,l))).next((()=>u))})).then((i=>(t.$o=s,i)))}function Tg(r,e,t){let n=se(),s=se();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=He();return t.forEach(((a,u)=>{const l=i.get(a);u.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(a)),u.isNoDocument()&&u.version.isEqual(X.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):U(V1,"Ignoring outdated watch update for ",a,". Current version:",l.version," Watch version:",u.version)})),{jo:o,Ho:s}}))}function CT(r,e){const t=H(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=dr),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function ci(r,e){const t=H(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.g_.getTargetData(n,e).next((i=>i?(s=i,b.resolve(s)):t.g_.allocateTargetId(n).next((o=>(s=new sn(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.g_.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.$o.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.$o=t.$o.insert(n.targetId,n),t.Ko.set(e,n.targetId)),n}))}async function ui(r,e,t){const n=H(r),s=n.$o.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Nr(o))throw o;U(V1,`Failed to update sequence numbers for target ${e}: ${o}`)}n.$o=n.$o.remove(e),n.Ko.delete(s.target)}function Lc(r,e,t){const n=H(r);let s=X.min(),i=se();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,l,d){const f=H(u),g=f.Ko.get(d);return g!==void 0?b.resolve(f.$o.get(g)):f.g_.getTargetData(l,d)})(n,o,Me(e)?e:mt(e)).next((a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.g_.getMatchingKeysForTargetId(o,a.targetId).next((u=>{i=u}))})).next((()=>n.qo.getDocumentsMatchingQuery(o,e,t?s:X.min(),t?i:se()))).next((a=>(Ag(n,a),{documents:a,Jo:i})))))}function wg(r,e){const t=H(r),n=H(t.g_),s=t.$o.get(e);return s?Promise.resolve(s.target??null):t.persistence.runTransaction("Get target data","readonly",(i=>n.dt(i,e).next((o=>(o==null?void 0:o.target)??null))))}function th(r,e){const t=H(r),n=t.Wo.get(e)||X.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.Qo.getAllFromCollectionGroup(s,e,fm(n,js),Number.MAX_SAFE_INTEGER))).then((s=>(Ag(t,s),s)))}function Ag(r,e){e.forEach(((t,n)=>{const s=n.key.getCollectionGroup(),i=r.Wo.get(s)||X.min();n.readTime.compareTo(i)>0&&r.Wo.set(s,n.readTime)}))}async function NT(r,e,t,n){const s=H(r);let i=se(),o=He();for(const l of t){const d=e.Yo(l.metadata.name);l.document&&(i=i.add(d));const f=e.Zo(l);f.setReadTime(e.Xo(l.metadata.readTime)),o=o.insert(d,f)}const a=s.Qo.newChangeBuffer({trackRemovals:!0}),u=await ci(s,(function(d){return mt(Ri(ie.fromString(`__bundle__/docs/${d}`)))})(n));return s.persistence.runTransaction("Apply bundle documents","readwrite",(l=>Tg(l,a,o).next((d=>(a.apply(l),d))).next((d=>s.g_.removeMatchingKeysForTargetId(l,u.targetId).next((()=>s.g_.addMatchingKeys(l,i,u.targetId))).next((()=>s.localDocuments.getLocalViewOfDocuments(l,d.jo,d.Ho))).next((()=>d.jo))))))}async function DT(r,e,t=se()){const n=await ci(r,mt(Iu(e.bundledQuery))),s=H(r);return s.persistence.runTransaction("Save named query","readwrite",(i=>{const o=Ge(e.readTime);if(n.snapshotVersion.compareTo(o)>=0)return s.w_.saveNamedQuery(i,e);const a=n.withResumeToken(Se.EMPTY_BYTE_STRING,o);return s.$o=s.$o.insert(a.targetId,a),s.g_.updateTargetData(i,a).next((()=>s.g_.removeMatchingKeysForTargetId(i,n.targetId))).next((()=>s.g_.addMatchingKeys(i,t,n.targetId))).next((()=>s.w_.saveNamedQuery(i,e)))}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vg="firestore_clients";function ap(r,e){return`${vg}_${r}_${e}`}const Rg="firestore_mutations";function cp(r,e,t){let n=`${Rg}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const Pg="firestore_targets";function Il(r,e){return`${Pg}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt="SharedClientState";class Mc{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static ea(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new F(s.error.code,s.error.message))),o?new Mc(e,t,s.state,i):(qe(Jt,`Failed to parse mutation state for ID '${t}': ${n}`),null)}ta(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Do{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static ea(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new F(n.error.code,n.error.message))),i?new Do(e,n.state,s):(qe(Jt,`Failed to parse target state for ID '${e}': ${t}`),null)}ta(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Fc{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static ea(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Qh();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=ym(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new Fc(e,i):(qe(Jt,`Failed to parse client data for instance '${e}': ${t}`),null)}}class O1{constructor(e,t){this.clientId=e,this.onlineState=t}static ea(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new O1(t.clientId,t.onlineState):(qe(Jt,`Failed to parse online state: ${e}`),null)}}class nh{constructor(){this.activeTargetIds=Qh()}na(e){this.activeTargetIds=this.activeTargetIds.add(e)}ra(e){this.activeTargetIds=this.activeTargetIds.delete(e)}ta(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Tl{constructor(e,t,n,s,i){this.window=e,this.Tn=t,this.persistenceKey=n,this.ia=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.sa=this._a.bind(this),this.oa=new Re(ne),this.started=!1,this.aa=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.ua=ap(this.persistenceKey,this.ia),this.ca=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.oa=this.oa.insert(this.ia,new nh),this.la=new RegExp(`^${vg}_${o}_([^_]*)$`),this.Ea=new RegExp(`^${Rg}_${o}_(\\d+)(?:_(.*))?$`),this.ha=new RegExp(`^${Pg}_${o}_(\\d+)$`),this.Ta=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.Pa=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.sa)}static C(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.po();for(const n of e){if(n===this.ia)continue;const s=this.getItem(ap(this.persistenceKey,n));if(s){const i=Fc.ea(n,s);i&&(this.oa=this.oa.insert(i.clientId,i))}}this.Ra();const t=this.storage.getItem(this.Ta);if(t){const n=this.Ia(t);n&&this.Aa(n)}for(const n of this.aa)this._a(n);this.aa=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.ca,JSON.stringify(e))}getAllActiveQueryTargets(){return this.Va(this.oa)}isActiveQueryTarget(e){let t=!1;return this.oa.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.da(e,"pending")}updateMutationState(e,t,n){this.da(e,t,n),this.fa(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(Il(this.persistenceKey,e));if(s){const i=Do.ea(e,s);i&&(n=i.state)}}return t&&this.ma.na(e),this.Ra(),n}removeLocalQueryTarget(e){this.ma.ra(e),this.Ra()}isLocalQueryTarget(e){return this.ma.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Il(this.persistenceKey,e))}updateQueryState(e,t,n){this.pa(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.fa(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.ga(e)}notifyBundleLoaded(e){this.ya(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.sa),this.removeItem(this.ua),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return U(Jt,"READ",e,t),t}setItem(e,t){U(Jt,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){U(Jt,"REMOVE",e),this.storage.removeItem(e)}_a(e){const t=e;if(t.storageArea===this.storage){if(U(Jt,"EVENT",t.key,t.newValue),t.key===this.ua)return void qe("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Tn.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.la.test(t.key)){if(t.newValue==null){const n=this.wa(t.key);return this.ba(n,null)}{const n=this.va(t.key,t.newValue);if(n)return this.ba(n.clientId,n)}}else if(this.Ea.test(t.key)){if(t.newValue!==null){const n=this.Sa(t.key,t.newValue);if(n)return this.Da(n)}}else if(this.ha.test(t.key)){if(t.newValue!==null){const n=this.xa(t.key,t.newValue);if(n)return this.Ca(n)}}else if(t.key===this.Ta){if(t.newValue!==null){const n=this.Ia(t.newValue);if(n)return this.Aa(n)}}else if(t.key===this.ca){const n=(function(i){let o=Rt.ce;if(i!=null)try{const a=JSON.parse(i);B(typeof a=="number",30636,{Fa:i}),o=a}catch(a){qe(Jt,"Failed to read sequence number from WebStorage",a)}return o})(t.newValue);n!==Rt.ce&&this.sequenceNumberHandler(n)}else if(t.key===this.Pa){const n=this.Oa(t.newValue);await Promise.all(n.map((s=>this.syncEngine.Ma(s))))}}}else this.aa.push(t)}))}}get ma(){return this.oa.get(this.ia)}Ra(){this.setItem(this.ua,this.ma.ta())}da(e,t,n){const s=new Mc(this.currentUser,e,t,n),i=cp(this.persistenceKey,this.currentUser,e);this.setItem(i,s.ta())}fa(e){const t=cp(this.persistenceKey,this.currentUser,e);this.removeItem(t)}ga(e){const t={clientId:this.ia,onlineState:e};this.storage.setItem(this.Ta,JSON.stringify(t))}pa(e,t,n){const s=Il(this.persistenceKey,e),i=new Do(e,t,n);this.setItem(s,i.ta())}ya(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Pa,t)}wa(e){const t=this.la.exec(e);return t?t[1]:null}va(e,t){const n=this.wa(e);return Fc.ea(n,t)}Sa(e,t){const n=this.Ea.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Mc.ea(new nt(i),s,t)}xa(e,t){const n=this.ha.exec(e),s=Number(n[1]);return Do.ea(s,t)}Ia(e){return O1.ea(e)}Oa(e){return JSON.parse(e)}async Da(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Na(e.batchId,e.state,e.error);U(Jt,`Ignoring mutation for non-active user ${e.user.uid}`)}Ca(e){return this.syncEngine.La(e.targetId,e.state,e.error)}ba(e,t){const n=t?this.oa.insert(e,t):this.oa.remove(e),s=this.Va(this.oa),i=this.Va(n),o=[],a=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||a.push(u)})),this.syncEngine.Ba(o,a).then((()=>{this.oa=n}))}Aa(e){this.oa.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}Va(e){let t=Qh();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class Sg{constructor(){this.Ua=new nh,this.ka={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Ua.na(e),this.ka[e]||"not-current"}updateQueryState(e,t,n){this.ka[e]=t}removeLocalQueryTarget(e){this.Ua.ra(e)}isLocalQueryTarget(e){return this.Ua.activeTargetIds.has(e)}clearQueryState(e){delete this.ka[e]}getAllActiveQueryTargets(){return this.Ua.activeTargetIds}isActiveQueryTarget(e){return this.Ua.activeTargetIds.has(e)}start(){return this.Ua=new nh,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bg(){return typeof window<"u"?window:null}function lc(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VT{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.qa=0,this.$a=null,this.Ka=!0}Wa(){this.qa===0&&(this.Qa("Unknown"),this.$a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.$a=null,this.Ga("Backend didn't respond within 10 seconds."),this.Qa("Offline"),Promise.resolve()))))}za(e){this.state==="Online"?this.Qa("Unknown"):(this.qa++,this.qa>=1&&(this.ja(),this.Ga(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.Qa("Offline")))}set(e){this.ja(),this.qa=0,e==="Online"&&(this.Ka=!1),this.Qa(e)}Qa(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}Ga(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Ka?(qe(t),this.Ka=!1):U("OnlineStateTracker",t)}ja(){this.$a!==null&&(this.$a.cancel(),this.$a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fn="RemoteStore";class OT{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ha=[],this.Ja=new Map,this.Ya=new Map,this.Za=new Map,this.Xa=new Fn(1e3),this.eu=new Fn(1001),this.tu=new Set,this.nu=[],this.ru=i,this.ru.bt((o=>{n.enqueueAndForget((async()=>{Vr(this)&&(U(fn,"Restarting streams for network reachability change."),await(async function(u){const l=H(u);l.tu.add(4),await Ci(l),l.iu.set("Unknown"),l.tu.delete(4),await ya(l)})(this))}))})),this.iu=new VT(n,s)}}async function ya(r){if(Vr(r))for(const e of r.nu)await e(!0)}async function Ci(r){for(const e of r.nu)await e(!1)}function rh(r,e){return r.Ya.get(e)||void 0}function Ru(r,e){const t=H(r),n=rh(t,e.targetId);if(n!==void 0&&t.Ja.has(n))return;const s=(function(a,u){const l=rh(a,u);l!==void 0&&a.Za.delete(l);const d=(function(g,I){return I%2!=0?g.eu.next():g.Xa.next()})(a,u);return a.Ya.set(u,d),a.Za.set(d,u),d})(t,e.targetId);U(fn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new sn(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ja.set(s,i),L1(t)?x1(t):Di(t).Fn()&&k1(t,i)}function li(r,e){const t=H(r),n=Di(t),s=rh(t,e);U(fn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.Ja.delete(s),t.Ya.delete(e),t.Za.delete(s),n.Fn()&&Cg(t,s),t.Ja.size===0&&(n.Fn()?n.Nn():Vr(t)&&t.iu.set("Unknown"))}function k1(r,e){if(r.su.We(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(X.min())>0){const t=r.Za.get(e.targetId);if(t===void 0)return void U(fn,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}Di(r).jn(e)}function Cg(r,e){r.su.We(e),Di(r).Hn(e)}function x1(r){r.su=new Uy({getRemoteKeysForTarget:e=>{const t=r.Za.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):se()},dt:e=>r.Ja.get(e)||null,Tt:()=>r.datastore.serializer.databaseId}),Di(r).start(),r.iu.Wa()}function L1(r){return Vr(r)&&!Di(r).Cn()&&r.Ja.size>0}function Vr(r){return H(r).tu.size===0}function Ng(r){r.su=void 0}async function kT(r){r.iu.set("Online")}async function xT(r){r.Ja.forEach(((e,t)=>{k1(r,e)}))}async function LT(r,e){Ng(r),L1(r)?(r.iu.za(e),x1(r)):r.iu.set("Unknown")}async function MT(r,e,t){if(r.iu.set("Online"),e instanceof l0&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const a of i.targetIds){if(s.Ja.has(a)){const u=s.Za.get(a);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.Ya.delete(u),s.Za.delete(a)),s.Ja.delete(a)}s.su.removeTarget(a)}})(r,e)}catch(n){U(fn,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Uc(r,n)}else if(e instanceof oc?r.su.et(e):e instanceof u0?r.su.ot(e):r.su.rt(e),!t.isEqual(X.min()))try{const n=await Ig(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const a=i.su.Rt(o);a.targetChanges.forEach(((l,d)=>{if(l.resumeToken.approximateByteSize()>0){const f=i.Ja.get(d);f&&i.Ja.set(d,f.withResumeToken(l.resumeToken,o))}})),a.targetMismatches.forEach(((l,d)=>{const f=i.Ja.get(l);if(!f)return;i.Ja.set(l,f.withResumeToken(Se.EMPTY_BYTE_STRING,f.snapshotVersion)),Cg(i,l);const g=new sn(f.target,l,d,f.sequenceNumber);k1(i,g)}));const u=(function(d,f){const g=new Map;f.targetChanges.forEach(((R,O)=>{const x=d.Za.get(O);x!==void 0&&g.set(x,R)}));let I=new Re(ne);return f.targetMismatches.forEach(((R,O)=>{const x=d.Za.get(R);x!==void 0&&(I=I.insert(x,O))})),new Pi(f.snapshotVersion,g,I,f.documentUpdates,f.augmentedDocumentUpdates,f.resolvedLimboDocuments)})(i,a);return i.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){U(fn,"Failed to raise snapshot:",n),await Uc(r,n)}}async function Uc(r,e,t){if(!Nr(e))throw e;r.tu.add(1),await Ci(r),r.iu.set("Offline"),t||(t=()=>Ig(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{U(fn,"Retrying IndexedDB access"),await t(),r.tu.delete(1),await ya(r)}))}function Dg(r,e){return e().catch((t=>Uc(r,t,e)))}async function Ni(r){const e=H(r),t=Rr(e);let n=e.Ha.length>0?e.Ha[e.Ha.length-1].batchId:dr;for(;FT(e);)try{const s=await CT(e.localStore,n);if(s===null){e.Ha.length===0&&t.Nn();break}n=s.batchId,UT(e,s)}catch(s){await Uc(e,s)}Vg(e)&&Og(e)}function FT(r){return Vr(r)&&r.Ha.length<10}function UT(r,e){r.Ha.push(e);const t=Rr(r);t.Fn()&&t.Jn&&t.Yn(e.mutations)}function Vg(r){return Vr(r)&&!Rr(r).Cn()&&r.Ha.length>0}function Og(r){Rr(r).start()}async function BT(r){Rr(r).er()}async function qT(r){const e=Rr(r);for(const t of r.Ha)e.Yn(t.mutations)}async function GT(r,e,t){const n=r.Ha.shift(),s=A1.from(n,e,t);await Dg(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await Ni(r)}async function $T(r,e){e&&Rr(r).Jn&&await(async function(n,s){if((function(o){return r0(o)&&o!==N.ABORTED})(s.code)){const i=n.Ha.shift();Rr(n).Mn(),await Dg(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Ni(n)}})(r,e),Vg(r)&&Og(r)}async function up(r,e){const t=H(r);t.asyncQueue.verifyOperationInProgress(),U(fn,"RemoteStore received new credentials");const n=Vr(t);t.tu.add(3),await Ci(t),n&&t.iu.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.tu.delete(3),await ya(t)}async function sh(r,e){const t=H(r);e?(t.tu.delete(2),await ya(t)):e||(t.tu.add(2),await Ci(t),t.iu.set("Unknown"))}function Di(r){return r._u||(r._u=(function(t,n,s){const i=H(t);return i.nr(),new rE(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Qt:kT.bind(null,r),zt:xT.bind(null,r),Ht:LT.bind(null,r),zn:MT.bind(null,r)}),r.nu.push((async e=>{e?(r._u.Mn(),L1(r)?x1(r):r.iu.set("Unknown")):(await r._u.stop(),Ng(r))}))),r._u}function Rr(r){return r.ou||(r.ou=(function(t,n,s){const i=H(t);return i.nr(),new sE(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Qt:()=>Promise.resolve(),zt:BT.bind(null,r),Ht:$T.bind(null,r),Zn:qT.bind(null,r),Xn:GT.bind(null,r)}),r.nu.push((async e=>{e?(r.ou.Mn(),await Ni(r)):(await r.ou.stop(),r.Ha.length>0&&(U(fn,`Stopping write stream with ${r.Ha.length} pending writes`),r.Ha=[]))}))),r.ou}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M1{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new it,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,a=new M1(e,t,o,s,i);return a.start(n),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new F(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Vi(r,e){if(qe("AsyncQueue",`${e}: ${r}`),Nr(r))return new F(N.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{static emptySet(e){return new pr(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||G.comparator(t.key,n.key):(t,n)=>G.comparator(t.key,n.key),this.keyedMap=Hr(),this.sortedSet=new Re(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof pr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new pr;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lp{constructor(){this.au=new Re(G.comparator)}track(e){const t=e.doc.key,n=this.au.get(t);n?e.type!==0&&n.type===3?this.au=this.au.insert(t,e):e.type===3&&n.type!==1?this.au=this.au.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.au=this.au.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.au=this.au.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.au=this.au.remove(t):e.type===1&&n.type===2?this.au=this.au.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.au=this.au.insert(t,{type:2,doc:e.doc}):W(63341,{ft:e,uu:n}):this.au=this.au.insert(t,e)}cu(){const e=[];return this.au.inorderTraversal(((t,n)=>{e.push(n)})),e}}class hs{constructor(e,t,n,s,i,o,a,u,l){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((a=>{o.push({type:0,doc:a})})),new hs(e,t,pr.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&yu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zT{constructor(){this.lu=void 0,this.Eu=[]}hu(){return this.Eu.some((e=>e.Tu()))}}class HT{constructor(){this.queries=hp(),this.onlineState="Unknown",this.Pu=new Set}terminate(){(function(t,n){const s=H(t),i=s.queries;s.queries=hp(),i.forEach(((o,a)=>{for(const u of a.Eu)u.onError(n)}))})(this,new F(N.ABORTED,"Firestore shutting down"))}}function hp(){return new $n((r=>rg(r)),yu)}async function F1(r,e){const t=H(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.hu()&&e.Tu()&&(n=2):(i=new zT,n=e.Tu()?0:1);try{switch(n){case 0:i.lu=await t.onListen(s,!0);break;case 1:i.lu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const a=Vi(o,`Initialization of query '${Me(e.query)?Dn(e.query):Po(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.Eu.push(e),e.Ru(t.onlineState),i.lu&&e.Iu(i.lu)&&B1(t)}async function U1(r,e){const t=H(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.Eu.indexOf(e);o>=0&&(i.Eu.splice(o,1),i.Eu.length===0?s=e.Tu()?0:1:!i.hu()&&e.Tu()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function jT(r,e){const t=H(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const a of o.Eu)a.Iu(s)&&(n=!0);o.lu=s}}n&&B1(t)}function WT(r,e,t){const n=H(r),s=n.queries.get(e);if(s)for(const i of s.Eu)i.onError(t);n.queries.delete(e)}function B1(r){r.Pu.forEach((e=>{e.next()}))}var ih;(function(r){r.Default="default",r.Cache="cache"})(ih||(ih={}));class q1{constructor(e,t,n){this.query=e,this.Au=t,this.Vu=!1,this.du=null,this.onlineState="Unknown",this.options=n||{}}Iu(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new hs(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Vu?this.fu(e)&&(this.Au.next(e),t=!0):this.mu(e,this.onlineState)&&(this.pu(e),t=!0),this.du=e,t}onError(e){this.Au.error(e)}Ru(e){this.onlineState=e;let t=!1;return this.du&&!this.Vu&&this.mu(this.du,e)&&(this.pu(this.du),t=!0),t}mu(e,t){if(!e.fromCache||!this.Tu())return!0;const n=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}fu(e){if(e.docChanges.length>0)return!0;const t=this.du&&this.du.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}pu(e){e=hs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Vu=!0,this.Au.next(e)}Tu(){return this.options.source!==ih.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kg{constructor(e,t){this.gu=e,this.byteLength=t}yu(){return"metadata"in this.gu}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e){this.serializer=e}Yo(e){return un(this.serializer,e)}Zo(e){return e.metadata.exists?hu(this.serializer,e.document,!1):Ce.newNoDocument(this.Yo(e.metadata.name),this.Xo(e.metadata.readTime))}Xo(e){return Ge(e)}}class G1{constructor(e,t){this.wu=e,this.serializer=t,this.bu=[],this.vu=[],this.collectionGroups=new Set,this.progress=xg(e)}get queries(){return this.bu}get documents(){return this.vu}o(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.gu.namedQuery)this.bu.push(e.gu.namedQuery);else if(e.gu.documentMetadata){this.vu.push({metadata:e.gu.documentMetadata}),e.gu.documentMetadata.exists||++t;const n=ie.fromString(e.gu.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.gu.document&&(this.vu[this.vu.length-1].document=e.gu.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}Du(e){const t=new Map,n=new dp(this.serializer);for(const s of e)if(s.metadata.queries){const i=n.Yo(s.metadata.name);for(const o of s.metadata.queries){const a=(t.get(o)||se()).add(i);t.set(o,a)}}return t}async xu(e){const t=await NT(e,new dp(this.serializer),this.vu,this.wu.id),n=this.Du(this.documents);for(const s of this.bu)await DT(e,s,n.get(s.name));return this.progress.taskState="Success",{progress:this.progress,Cu:this.collectionGroups,Fu:t}}}function xg(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lg{constructor(e){this.key=e}}class Mg{constructor(e){this.key=e}}class Fg{constructor(e,t){this.query=e,this.Ou=t,this.Mu=null,this.hasCachedResults=!1,this.current=!1,this.Nu=se(),this.mutatedKeys=se(),this.Lu=Me(e)?eh(e):Kh(e),this.Bu=new pr(this.Lu)}get Uu(){return this.Ou}ku(e,t){const n=t?t.qu:new lp,s=t?t.Bu:this.Bu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,a=!1;const[u,l]=this.$u(this.query,s);e.inorderTraversal(((f,g)=>{const I=s.get(f),R=dg(this.query,g)?g:null,O=!!I&&this.mutatedKeys.has(I.key),x=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let z=!1;I&&R?I.data.isEqual(R.data)?O!==x&&(n.track({type:3,doc:R}),z=!0):this.Ku(I,R)||(n.track({type:2,doc:R}),z=!0,(u&&this.Lu(R,u)>0||l&&this.Lu(R,l)<0)&&(a=!0)):!I&&R?(n.track({type:0,doc:R}),z=!0):I&&!R&&(n.track({type:1,doc:I}),z=!0,(u||l)&&(a=!0)),z&&(R?(o=o.add(R),i=x?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}));const d=this.Wu(this.query);if(d)if(Me(this.query)){const f=[];o.forEach((R=>f.push(R)));const g=hg(this.query,f);let I=new pr(eh(this.query));for(const R of g)I=I.add(R);o.forEach((R=>{I.has(R.key)||(i=i.delete(R.key),n.track({type:1,doc:R}))})),o=I}else{const f=this.Qu(this.query);for(;o.size>d;){const g=f==="F"?o.last():o.first();o=o.delete(g.key),i=i.delete(g.key),n.track({type:1,doc:g})}}return{Bu:o,qu:n,Uo:a,mutatedKeys:i}}Wu(e){var t;return Me(e)?(t=gl(e))==null?void 0:t.limit:e.limit||void 0}Qu(e){if(Me(e)){const t=gl(e);return t&&t.limit<0?"L":"F"}return e.limitType}$u(e,t){var n;if(Me(e)){const s=(n=gl(e))==null?void 0:n.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.Wu(this.query)?t.last():null,e.limitType==="L"&&t.size===this.Wu(this.query)?t.first():null]}Ku(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Bu;this.Bu=e.Bu,this.mutatedKeys=e.mutatedKeys;const o=e.qu.cu();o.sort(((d,f)=>(function(I,R){const O=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return W(20277,{ft:x})}};return O(I)-O(R)})(d.type,f.type)||this.Lu(d.doc,f.doc))),this.Gu(n),s=s??!1;const a=t&&!s?this.zu():[],u=this.Nu.size===0&&this.current&&!s?1:0,l=u!==this.Mu;return this.Mu=u,o.length!==0||l?{snapshot:new hs(this.query,e.Bu,i,o,e.mutatedKeys,u===0,l,!1,!!n&&n.resumeToken.approximateByteSize()>0),ju:a}:{ju:a}}Ru(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Bu:this.Bu,qu:new lp,mutatedKeys:this.mutatedKeys,Uo:!1},!1)):{ju:[]}}Hu(e){return!this.Ou.has(e)&&!!this.Bu.has(e)&&!this.Bu.get(e).hasLocalMutations}Gu(e){e&&(e.addedDocuments.forEach((t=>this.Ou=this.Ou.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ou=this.Ou.delete(t))),this.current=e.current)}zu(){if(!this.current)return[];const e=this.Nu;this.Nu=se(),this.Bu.forEach((n=>{this.Hu(n.key)&&(this.Nu=this.Nu.add(n.key))}));const t=[];return e.forEach((n=>{this.Nu.has(n)||t.push(new Mg(n))})),this.Nu.forEach((n=>{e.has(n)||t.push(new Lg(n))})),t}Ju(e){this.Ou=e.Jo,this.Nu=se();const t=this.ku(e.documents);return this.applyChanges(t,!0)}Yu(){return hs.fromInitialDocuments(this.query,this.Bu,this.mutatedKeys,this.Mu===0,this.hasCachedResults)}}const Or="SyncEngine";class KT{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class QT{constructor(e){this.key=e,this.Zu=!1}}class YT{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Xu={},this.ec=new $n((a=>rg(a)),yu),this.tc=new Map,this.nc=new Set,this.rc=new Re(G.comparator),this.sc=new Map,this._c=new S1,this.oc={},this.ac=new Map,this.uc=Fn.Cs(),this.onlineState="Unknown",this.cc=void 0}get isPrimaryClient(){return this.cc===!0}}async function XT(r,e,t=!0){const n=Pu(r);let s;const i=n.ec.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Yu()):s=await Ug(n,e,t,!0),s}async function JT(r,e){const t=Pu(r);await Ug(t,e,!0,!1)}async function Ug(r,e,t,n){const s=await ci(r.localStore,Me(e)?e:mt(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let a;return n&&(a=await $1(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Ru(r.remoteStore,s),a}async function $1(r,e,t,n,s){r.lc=(f,g,I)=>(async function(O,x,z,Z){let Q=x.view.ku(z);Q.Uo&&(Q=await Lc(O.localStore,x.query,!1).then((({documents:A})=>x.view.ku(A,Q))));const oe=Z&&Z.targetChanges.get(x.targetId),le=Z&&Z.targetMismatches.get(x.targetId)!=null,de=x.view.applyChanges(Q,O.isPrimaryClient,oe,le);return oh(O,x.targetId,de.ju),de.snapshot})(r,f,g,I);const i=await Lc(r.localStore,e,!0),o=new Fg(e,i.Jo),a=o.ku(i.documents),u=la.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),l=o.applyChanges(a,r.isPrimaryClient,u);oh(r,t,l.ju);const d=new KT(e,t,o);return r.ec.set(e,d),r.tc.has(t)?r.tc.get(t).push(e):r.tc.set(t,[e]),l.snapshot}async function ZT(r,e,t){const n=H(r),s=n.ec.get(e),i=n.tc.get(s.targetId);if(i.length>1)return n.tc.set(s.targetId,i.filter((o=>!yu(o,e)))),void n.ec.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await ui(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&li(n.remoteStore,s.targetId),hi(n,s.targetId)})).catch(Cr)):(hi(n,s.targetId),await ui(n.localStore,s.targetId,!0))}async function ew(r,e){const t=H(r),n=t.ec.get(e),s=t.tc.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),li(t.remoteStore,n.targetId))}async function tw(r,e,t){const n=W1(r);try{const s=await(function(o,a){const u=H(o),l=_e.now(),d=a.reduce(((I,R)=>I.add(R.key)),se());let f,g;return u.persistence.runTransaction("Locally write mutations","readwrite",(I=>{let R=He(),O=se();return u.Qo.getEntries(I,d).next((x=>{R=x,R.forEach(((z,Z)=>{Z.isValidDocument()||(O=O.add(z))}))})).next((()=>u.localDocuments.getOverlayedDocuments(I,R))).next((x=>{f=x;const z=[];for(const Z of a){const Q=yy(Z,f.get(Z.key).overlayedDocument);Q!=null&&z.push(new qn(Z.key,Q,Fm(Q.value.mapValue),Oe.exists(!0)))}return u.mutationQueue.addMutationBatch(I,l,z,a)})).next((x=>{g=x;const z=x.applyToLocalDocumentSet(f,O);return u.documentOverlayCache.saveOverlays(I,x.batchId,z)}))})).then((()=>({batchId:g.batchId,changes:o0(f)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,a,u){let l=o.oc[o.currentUser.toKey()];l||(l=new Re(ne)),l=l.insert(a,u),o.oc[o.currentUser.toKey()]=l})(n,s.batchId,t),await zn(n,s.changes),await Ni(n.remoteStore)}catch(s){const i=Vi(s,"Failed to persist write");t.reject(i)}}async function Bg(r,e){const t=H(r);try{const n=await bT(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.sc.get(i);o&&(B(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Zu=!0:s.modifiedDocuments.size>0?B(o.Zu,14607):s.removedDocuments.size>0&&(B(o.Zu,42227),o.Zu=!1))})),await zn(t,n,e)}catch(n){await Cr(n)}}function fp(r,e,t){const n=H(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.ec.forEach(((i,o)=>{const a=o.view.Ru(e);a.snapshot&&s.push(a.snapshot)})),(function(o,a){const u=H(o);u.onlineState=a;let l=!1;u.queries.forEach(((d,f)=>{for(const g of f.Eu)g.Ru(a)&&(l=!0)})),l&&B1(u)})(n.eventManager,e),s.length&&n.Xu.zn(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function nw(r,e,t){const n=H(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.sc.get(e),i=s&&s.key;if(i){let o=new Re(G.comparator);o=o.insert(i,Ce.newNoDocument(i,X.min()));const a=se().add(i),u=new Pi(X.min(),new Map,new Re(ne),o,He(),a);await Bg(n,u),n.rc=n.rc.remove(i),n.sc.delete(e),j1(n)}else await ui(n.localStore,e,!1).then((()=>hi(n,e,t))).catch(Cr)}async function rw(r,e){const t=H(r),n=e.batch.batchId;try{const s=await ST(t.localStore,e);H1(t,n,null),z1(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await zn(t,s)}catch(s){await Cr(s)}}async function sw(r,e,t){const n=H(r);try{const s=await(function(o,a){const u=H(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(l=>{let d;return u.mutationQueue.lookupMutationBatch(l,a).next((f=>(B(f!==null,37113),d=f.keys(),u.mutationQueue.removeMutationBatch(l,f)))).next((()=>u.mutationQueue.performConsistencyCheck(l))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(l,d,a))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(l,d))).next((()=>u.localDocuments.getDocuments(l,d)))}))})(n.localStore,e);H1(n,e,t),z1(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await zn(n,s)}catch(s){await Cr(s)}}async function iw(r,e){const t=H(r);Vr(t.remoteStore)||U(Or,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await(function(o){const a=H(o);return a.persistence.runTransaction("Get highest unacknowledged batch id","readonly",(u=>a.mutationQueue.getHighestUnacknowledgedBatchId(u)))})(t.localStore);if(n===dr)return void e.resolve();const s=t.ac.get(n)||[];s.push(e),t.ac.set(n,s)}catch(n){const s=Vi(n,"Initialization of waitForPendingWrites() operation failed");e.reject(s)}}function z1(r,e){(r.ac.get(e)||[]).forEach((t=>{t.resolve()})),r.ac.delete(e)}function H1(r,e,t){const n=H(r);let s=n.oc[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.oc[n.currentUser.toKey()]=s}}function hi(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.tc.get(e))r.ec.delete(n),t&&r.Xu.Ec(n,t);r.tc.delete(e),r.isPrimaryClient&&r._c.s_(e).forEach((n=>{r._c.containsKey(n)||qg(r,n)}))}function qg(r,e){r.nc.delete(e.path.canonicalString());const t=r.rc.get(e);t!==null&&(li(r.remoteStore,t),r.rc=r.rc.remove(e),r.sc.delete(t),j1(r))}function oh(r,e,t){for(const n of t)n instanceof Lg?(r._c.addReference(n.key,e),ow(r,n)):n instanceof Mg?(U(Or,"Document no longer in limbo: "+n.key),r._c.removeReference(n.key,e),r._c.containsKey(n.key)||qg(r,n.key)):W(19791,{hc:n})}function ow(r,e){const t=e.key,n=t.path.canonicalString();r.rc.get(t)||r.nc.has(n)||(U(Or,"New document in limbo: "+t),r.nc.add(n),j1(r))}function j1(r){for(;r.nc.size>0&&r.rc.size<r.maxConcurrentLimboResolutions;){const e=r.nc.values().next().value;r.nc.delete(e);const t=new G(ie.fromString(e)),n=r.uc.next();r.sc.set(n,new QT(t)),r.rc=r.rc.insert(t,n),Ru(r.remoteStore,new sn(mt(Ri(t.path)),n,"TargetPurposeLimboResolution",Rt.ce))}}async function zn(r,e,t){const n=H(r),s=[],i=[],o=[];n.ec.isEmpty()||(n.ec.forEach(((a,u)=>{o.push(n.lc(u,e,t).then((l=>{var d;if((l||t)&&n.isPrimaryClient){const f=l?!l.fromCache:(d=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:d.current;n.sharedClientState.updateQueryState(u.targetId,f?"current":"not-current")}if(l){s.push(l);const f=D1.vo(u.targetId,l);i.push(f)}})))})),await Promise.all(o),n.Xu.zn(s),await(async function(u,l){const d=H(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",(f=>b.forEach(l,(g=>b.forEach(g.wo,(I=>d.persistence.referenceDelegate.addReference(f,g.targetId,I))).next((()=>b.forEach(g.bo,(I=>d.persistence.referenceDelegate.removeReference(f,g.targetId,I)))))))))}catch(f){if(!Nr(f))throw f;U(V1,"Failed to update sequence numbers: "+f)}for(const f of l){const g=f.targetId;if(!f.fromCache){const I=d.$o.get(g),R=I.snapshotVersion,O=I.withLastLimboFreeSnapshotVersion(R);d.$o=d.$o.insert(g,O)}}})(n.localStore,i))}async function aw(r,e){const t=H(r);if(!t.currentUser.isEqual(e)){U(Or,"User change. New user:",e.toKey());const n=await Eg(t.localStore,e);t.currentUser=e,(function(i,o){i.ac.forEach((a=>{a.forEach((u=>{u.reject(new F(N.CANCELLED,o))}))})),i.ac.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await zn(t,n.zo)}}function cw(r,e){const t=H(r),n=t.sc.get(e);if(n&&n.Zu)return se().add(n.key);{let s=se();const i=t.tc.get(e);if(!i)return s;for(const o of i??[]){const a=t.ec.get(o);s=s.unionWith(a.view.Uu)}return s}}async function uw(r,e){const t=H(r),n=await Lc(t.localStore,e.query,!0),s=e.view.Ju(n);return t.isPrimaryClient&&oh(t,e.targetId,s.ju),s}async function lw(r,e){const t=H(r);return th(t.localStore,e).then((n=>zn(t,n)))}async function hw(r,e,t,n){const s=H(r),i=await(function(a,u){const l=H(a),d=H(l.mutationQueue);return l.persistence.runTransaction("Lookup mutation documents","readonly",(f=>d.ps(f,u).next((g=>g?l.localDocuments.getDocuments(f,g):b.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await Ni(s.remoteStore):t==="acknowledged"||t==="rejected"?(H1(s,e,n||null),z1(s,e),(function(a,u){H(H(a).mutationQueue).bs(u)})(s.localStore,e)):W(6720,"Unknown batchState",{Tc:t}),await zn(s,i)):U(Or,"Cannot apply mutation batch with id: "+e)}async function dw(r,e){const t=H(r);if(Pu(t),W1(t),e===!0&&t.cc!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await pp(t,n.toArray());t.cc=!0,await sh(t.remoteStore,!0);for(const i of s)Ru(t.remoteStore,i)}else if(e===!1&&t.cc!==!1){const n=[];let s=Promise.resolve();t.tc.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(hi(t,o),ui(t.localStore,o,!0)))),li(t.remoteStore,o)})),await s,await pp(t,n),(function(o){const a=H(o);a.sc.forEach(((u,l)=>{li(a.remoteStore,l)})),a._c.__(),a.sc=new Map,a.rc=new Re(G.comparator)})(t),t.cc=!1,await sh(t.remoteStore,!1)}}async function pp(r,e,t){const n=H(r),s=[],i=[];for(const o of e){let a;const u=n.tc.get(o);if(u&&u.length!==0){a=await ci(n.localStore,Me(u[0])?u[0]:mt(u[0]));for(const l of u){const d=n.ec.get(l),f=await uw(n,d);f.snapshot&&i.push(f.snapshot)}}else{const l=await wg(n.localStore,o);a=await ci(n.localStore,l),await $1(n,Gg(l),o,!1,a.resumeToken)}s.push(a)}return n.Xu.zn(i),s}function Gg(r){return vn(r)?r:Zm(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function fw(r){return(function(t){return H(H(t).persistence).po()})(H(r).localStore)}async function pw(r,e,t,n){const s=H(r);if(s.cc)return void U(Or,"Ignoring unexpected query state notification.");const i=s.tc.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{let o;if(Me(i[0]))switch(Nn(i[0])){case"collection_group":case"collection":o=await th(s.localStore,Y0(i[0]));break;case"documents":o=await(function(l,d){const f=H(l),g=se(...Nc(d).map((I=>G.fromPath(I))));return f.persistence.runTransaction("Get documents for pipeline","readonly",(I=>f.Qo.getEntries(I,g))).then((I=>I))})(s.localStore,i[0]);break;default:Xe(""),o=Hr()}else o=await th(s.localStore,(function(l){return l.collectionGroup||(l.path.length%2==1?l.path.lastSegment():l.path.get(l.path.length-2))})(i[0]));const a=Pi.createSynthesizedRemoteEventForCurrentChange(e,t==="current",Se.EMPTY_BYTE_STRING);await zn(s,o,a);break}case"rejected":await ui(s.localStore,e,!0),hi(s,e,n);break;default:W(64155,t)}}async function mw(r,e,t){const n=Pu(r);if(n.cc){for(const s of e){if(n.tc.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){U(Or,"Adding an already active target "+s);continue}const i=await wg(n.localStore,s),o=await ci(n.localStore,i);await $1(n,Gg(i),o.targetId,!1,o.resumeToken),Ru(n.remoteStore,o)}for(const s of t)n.tc.has(s)&&await ui(n.localStore,s,!1).then((()=>{li(n.remoteStore,s),hi(n,s)})).catch(Cr)}}function Pu(r){const e=H(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Bg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=cw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=nw.bind(null,e),e.Xu.zn=jT.bind(null,e.eventManager),e.Xu.Ec=WT.bind(null,e.eventManager),e}function W1(r){const e=H(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=rw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=sw.bind(null,e),e}function gw(r,e,t){const n=H(r);(async function(i,o,a){try{const u=await o.getMetadata();if(await(function(I,R){const O=H(I),x=Ge(R.createTime);return O.persistence.runTransaction("hasNewerBundle","readonly",(z=>O.w_.getBundleMetadata(z,R.id))).then((z=>!!z&&z.createTime.compareTo(x)>=0))})(i.localStore,u))return await o.close(),a._completeWith((function(I){return{taskState:"Success",documentsLoaded:I.totalDocuments,bytesLoaded:I.totalBytes,totalDocuments:I.totalDocuments,totalBytes:I.totalBytes}})(u)),Promise.resolve(new Set);a._updateProgress(xg(u));const l=new G1(u,o.serializer);let d=await o.Pc();for(;d;){const g=await l.o(d);g&&a._updateProgress(g),d=await o.Pc()}const f=await l.xu(i.localStore);return await zn(i,f.Fu,void 0),await(function(I,R){const O=H(I);return O.persistence.runTransaction("Save bundle","readwrite",(x=>O.w_.saveBundleMetadata(x,R)))})(i.localStore,u),a._completeWith(f.progress),Promise.resolve(f.Cu)}catch(u){return Xe(Or,`Loading bundle failed with ${u}`),a._failWith(u),Promise.resolve(new Set)}})(n,e,t).then((s=>{n.sharedClientState.notifyBundleLoaded(s)}))}class di{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=_s(e.databaseInfo.databaseId),this.sharedClientState=this.Rc(e),this.persistence=this.Ic(e),await this.persistence.start(),this.localStore=this.Ac(e),this.gcScheduler=this.Vc(e,this.localStore),this.indexBackfillerScheduler=this.dc(e,this.localStore)}Vc(e,t){return null}dc(e,t){return null}Ac(e){return yg(this.persistence,new _g,e.initialUser,this.serializer)}Ic(e){return new b1(vu.C_,this.serializer)}Rc(e){return new Sg}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}di.provider={build:()=>new di};class K1 extends di{constructor(e){super(),this.cacheSizeBytes=e}Vc(e,t){B(this.persistence.referenceDelegate instanceof xc,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new N0(n,e.asyncQueue,t)}Ic(e){const t=this.cacheSizeBytes!==void 0?dt.withCacheSize(this.cacheSizeBytes):dt.DEFAULT;return new b1((n=>xc.C_(n,t)),this.serializer)}}class Q1 extends di{constructor(e,t,n){super(),this.fc=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.fc.initialize(this,e),await W1(this.fc.syncEngine),await Ni(this.fc.remoteStore),await this.persistence._o((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Ac(e){return yg(this.persistence,new _g,e.initialUser,this.serializer)}Vc(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new N0(n,e.asyncQueue,t)}dc(e,t){const n=new O5(t,this.persistence);return new V5(e.asyncQueue,n)}Ic(e){const t=N1(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?dt.withCacheSize(this.cacheSizeBytes):dt.DEFAULT;return new C1(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,bg(),lc(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Rc(e){return new Sg}}class $g extends Q1{constructor(e,t){super(e,t,!1),this.fc=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.fc.syncEngine;this.sharedClientState instanceof Tl&&(this.sharedClientState.syncEngine={Na:hw.bind(null,t),La:pw.bind(null,t),Ba:mw.bind(null,t),po:fw.bind(null,t),Ma:lw.bind(null,t)},await this.sharedClientState.start()),await this.persistence._o((async n=>{await dw(this.fc.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Rc(e){const t=bg();if(!Tl.C(t))throw new F(N.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=N1(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Tl(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Pr{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>fp(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=aw.bind(null,this.syncEngine),await sh(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new HT})()}createDatastore(e){const t=_s(e.databaseInfo.databaseId),n=nE(e.databaseInfo);return aE(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,a){return new OT(n,s,i,o,a)})(this.localStore,this.datastore,e.asyncQueue,(t=>fp(this.syncEngine,t,0)),(function(){return O2.C()?new O2:new Jy})())}createSyncEngine(e,t){return(function(s,i,o,a,u,l,d){const f=new YT(s,i,o,a,u,l);return d&&(f.cc=!0),f})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=H(s);U(fn,"RemoteStore shutting down."),i.tu.add(5),await Ci(i),i.ru.shutdown(),i.iu.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Pr.provider={build:()=>new Pr};function mp(r,e=10240){let t=0;return{async read(){if(t<r.byteLength){const n={value:r.slice(t,t+e),done:!1};return t+=e,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Su{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.mc(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.mc(this.observer.error,e):qe("Uncaught Error in snapshot listener:",e.toString()))}gc(){this.muted=!0}mc(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _w{constructor(e,t){this.yc=e,this.serializer=t,this.metadata=new it,this.buffer=new Uint8Array,this.wc=(function(){return new TextDecoder("utf-8")})(),this.bc().then((n=>{n&&n.yu()?this.metadata.resolve(n.gu.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n==null?void 0:n.gu)}`))}),(n=>this.metadata.reject(n)))}close(){return this.yc.cancel()}async getMetadata(){return this.metadata.promise}async Pc(){return await this.getMetadata(),this.bc()}async bc(){const e=await this.vc();if(e===null)return null;const t=this.wc.decode(e),n=Number(t);isNaN(n)&&this.Sc(`length string (${t}) is not valid number`);const s=await this.Dc(n);return new kg(JSON.parse(s),e.length+n)}xc(){return this.buffer.findIndex((e=>e===123))}async vc(){for(;this.xc()<0&&!await this.Cc(););if(this.buffer.length===0)return null;const e=this.xc();e<0&&this.Sc("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Dc(e){for(;this.buffer.length<e;)await this.Cc()&&this.Sc("Reached the end of bundle when more is expected.");const t=this.wc.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Sc(e){throw this.yc.cancel(),new Error(`Invalid bundle format: ${e}`)}async Cc(){const e=await this.yc.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.Pc();if(!n||!n.yu())throw new Error(`The first element of the bundle is not a metadata object, it is
         ${JSON.stringify(n==null?void 0:n.gu)}`);this.metadata=n;do n=this.Pc(),n!==null&&this.elements.push(n);while(n!==null)}getMetadata(){return this.metadata}t(){return this.elements}Pc(){if(this.cursor===this.bundleData.length)return null;const e=this.vc(),t=this.Dc(e);return new kg(JSON.parse(t),e)}Dc(e){if(this.cursor+e>this.bundleData.length)throw new F(N.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}vc(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if(this.bundleData[t]==="{"){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ew=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new F(N.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,i){const o=H(s),a={documents:i.map((f=>ai(o.serializer,f)))},u=await o.$t("BatchGetDocuments",o.serializer.databaseId,ie.emptyPath(),a,i.length),l=new Map;u.forEach((f=>{const g=zy(o.serializer,f);l.set(g.key.toString(),g)}));const d=[];return i.forEach((f=>{const g=l.get(f.toString());B(!!g,55234,{key:f}),d.push(g)})),d})(this.datastore,e);return t.forEach((n=>this.recordVersion(n))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new vi(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,n)=>{const s=G.fromPath(n);this.mutations.push(new $h(s,this.precondition(s)))})),await(async function(n,s){const i=H(n),o={writes:s.map((a=>jo(i.serializer,a)))};await i.Bt("Commit",i.serializer.databaseId,ie.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw W(50498,{Oc:e.constructor.name});t=X.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new F(N.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(X.min())?Oe.exists(!1):Oe.updateTime(t):Oe.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(X.min()))throw new F(N.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Oe.updateTime(t)}return Oe.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iw{constructor(e,t,n,s,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=s,this.deferred=i,this.Mc=n.maxAttempts,this.xn=new Zh(this.asyncQueue,"transaction_retry")}Nc(){this.Mc-=1,this.Lc()}Lc(){this.xn.mn((async()=>{const e=new Ew(this.datastore),t=this.Bc(e);t&&t.then((n=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(n)})).catch((s=>{this.Uc(s)}))))})).catch((n=>{this.Uc(n)}))}))}Bc(e){try{const t=this.updateFunction(e);return!oa(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Uc(e){this.Mc>0&&this.kc(e)?(this.Mc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Lc(),Promise.resolve())))):this.deferred.reject(e)}kc(e){if((e==null?void 0:e.name)==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!r0(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sr="FirestoreClient";class Tw{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=nt.UNAUTHENTICATED,this.clientId=tu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{U(Sr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(U(Sr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new it;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Vi(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function wl(r,e){r.asyncQueue.verifyOperationInProgress(),U(Sr,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await Eg(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function gp(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Y1(r);U(Sr,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>up(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>up(e.remoteStore,s))),r._onlineComponents=e}async function Y1(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){U(Sr,"Using user provided OfflineComponentProvider");try{await wl(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===N.FAILED_PRECONDITION||s.code===N.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Xe("Error using user provided cache. Falling back to memory cache: "+t),await wl(r,new di)}}else U(Sr,"Using default OfflineComponentProvider"),await wl(r,new K1(void 0));return r._offlineComponents}async function bu(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(U(Sr,"Using user provided OnlineComponentProvider"),await gp(r,r._uninitializedComponentsProvider._online)):(U(Sr,"Using default OnlineComponentProvider"),await gp(r,new Pr))),r._onlineComponents}function zg(r){return Y1(r).then((e=>e.persistence))}function Oi(r){return Y1(r).then((e=>e.localStore))}function Hg(r){return bu(r).then((e=>e.remoteStore))}function X1(r){return bu(r).then((e=>e.syncEngine))}function jg(r){return bu(r).then((e=>e.datastore))}async function fi(r){const e=await bu(r),t=e.eventManager;return t.onListen=XT.bind(null,e.syncEngine),t.onUnlisten=ZT.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=JT.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=ew.bind(null,e.syncEngine),t}function ww(r){return r.asyncQueue.enqueue((async()=>{const e=await zg(r),t=await Hg(r);return e.setNetworkEnabled(!0),(function(s){const i=H(s);return i.tu.delete(0),ya(i)})(t)}))}function Aw(r){return r.asyncQueue.enqueue((async()=>{const e=await zg(r),t=await Hg(r);return e.setNetworkEnabled(!1),(async function(s){const i=H(s);i.tu.add(0),await Ci(i),i.iu.set("Offline")})(t)}))}function vw(r,e,t,n){const s=new Su(n),i=new q1(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>F1(await fi(r),i))),()=>{s.gc(),r.asyncQueue.enqueueAndForget((async()=>U1(await fi(r),i)))}}function Rw(r,e){const t=new it;return r.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const a=await(function(l,d){const f=H(l);return f.persistence.runTransaction("read document","readonly",(g=>f.localDocuments.getDocument(g,d)))})(s,i);a.isFoundDocument()?o.resolve(a):a.isNoDocument()?o.resolve(null):o.reject(new F(N.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(a){const u=Vi(a,`Failed to get document '${i} from cache`);o.reject(u)}})(await Oi(r),e,t))),t.promise}function Wg(r,e,t={}){const n=new it;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,l){const d=new Su({next:g=>{d.gc(),o.enqueueAndForget((()=>U1(i,f)));const I=g.docs.has(a);!I&&g.fromCache?l.reject(new F(N.UNAVAILABLE,"Failed to get document because the client is offline.")):I&&g.fromCache&&u&&u.source==="server"?l.reject(new F(N.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),f=new q1(Ri(a.path),d,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return F1(i,f)})(await fi(r),r.asyncQueue,e,t,n))),n.promise}function Pw(r,e){const t=new it;return r.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const a=await Lc(s,i,!0),u=new Fg(i,a.Jo),l=u.ku(a.documents),d=u.applyChanges(l,!1);o.resolve(d.snapshot)}catch(a){const u=Vi(a,`Failed to execute query '${i} against cache`);o.reject(u)}})(await Oi(r),e,t))),t.promise}function Kg(r,e,t={}){const n=new it;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,l){const d=new Su({next:g=>{d.gc(),o.enqueueAndForget((()=>U1(i,f))),g.fromCache&&u.source==="server"?l.reject(new F(N.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(g)},error:g=>l.reject(g)}),f=new q1(a instanceof Co?YI(a):a,d,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return F1(i,f)})(await fi(r),r.asyncQueue,e,t,n))),n.promise}function Sw(r,e,t){const n=new it;return r.asyncQueue.enqueueAndForget((async()=>{try{const s=await jg(r);n.resolve((async function(o,a,u){var O;const l=H(o),{request:d,wt:f,parent:g}=_0(l.serializer,e0(a),u);l.connection.Ot||delete d.parent;const I=(await l.$t("RunAggregationQuery",l.serializer.databaseId,g,d,1)).filter((x=>!!x.result));B(I.length===1,64727);const R=(O=I[0].result)==null?void 0:O.aggregateFields;return Object.keys(R).reduce(((x,z)=>(x[f[z]]=R[z],x)),{})})(s,e,t))}catch(s){n.reject(s)}})),n.promise}function bw(r,e){const t=new it;return r.asyncQueue.enqueueAndForget((async()=>tw(await X1(r),e,t))),t.promise}function Cw(r,e){const t=new Su(e);return r.asyncQueue.enqueueAndForget((async()=>(function(s,i){H(s).Pu.add(i),i.next()})(await fi(r),t))),()=>{t.gc(),r.asyncQueue.enqueueAndForget((async()=>(function(s,i){H(s).Pu.delete(i)})(await fi(r),t)))}}function Nw(r,e,t){const n=new it;return r.asyncQueue.enqueueAndForget((async()=>{const s=await jg(r);new Iw(r.asyncQueue,s,t,e,n).Nc()})),n.promise}function Dw(r,e,t,n){const s=(function(o,a){let u;return u=typeof o=="string"?c0().encode(o):o,(function(d,f){return new _w(d,f)})((function(d,f){if(d instanceof Uint8Array)return mp(d,f);if(d instanceof ArrayBuffer)return mp(new Uint8Array(d),f);if(d instanceof ReadableStream)return d.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")})(u),a)})(t,_s(e));r.asyncQueue.enqueueAndForget((async()=>{gw(await X1(r),s,n)}))}function Vw(r,e){return r.asyncQueue.enqueue((async()=>(function(n,s){const i=H(n);return i.persistence.runTransaction("Get named query","readonly",(o=>i.w_.getNamedQuery(o,s)))})(await Oi(r),e)))}function Qg(r,e){return(function(n,s){return new yw(n,s)})(r,e)}function Ow(r,e){return r.asyncQueue.enqueue((async()=>(async function(n,s){const i=H(n),o=i.indexManager,a=[];return i.persistence.runTransaction("Configure indexes","readwrite",(u=>o.getFieldIndexes(u).next((l=>(function(f,g,I,R,O){f=[...f],g=[...g],f.sort(I),g.sort(I);const x=f.length,z=g.length;let Z=0,Q=0;for(;Z<z&&Q<x;){const oe=I(f[Q],g[Z]);oe<0?O(f[Q++]):oe>0?R(g[Z++]):(Z++,Q++)}for(;Z<z;)R(g[Z++]);for(;Q<x;)O(f[Q++])})(l,s,b5,(d=>{a.push(o.addFieldIndex(u,d))}),(d=>{a.push(o.deleteFieldIndex(u,d))})))).next((()=>b.waitFor(a)))))})(await Oi(r),e)))}function kw(r,e){return r.asyncQueue.enqueue((async()=>(function(n,s){H(n).qo.Do=s})(await Oi(r),e)))}function xw(r){return r.asyncQueue.enqueue((async()=>(function(t){const n=H(t),s=n.indexManager;return n.persistence.runTransaction("Delete All Indexes","readwrite",(i=>s.deleteAllFieldIndexes(i)))})(await Oi(r))))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _p="AsyncQueue";class yp{constructor(e=Promise.resolve()){this.qc=[],this.$c=!1,this.Kc=[],this.Wc=null,this.Qc=!1,this.Gc=!1,this.zc=[],this.xn=new Zh(this,"async_queue_retry"),this.jc=()=>{const n=lc();n&&U(_p,"Visibility state changed to "+n.visibilityState),this.xn.gn()},this.Hc=e;const t=lc();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.jc)}get isShuttingDown(){return this.$c}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Jc(),this.Yc(e)}enterRestrictedMode(e){if(!this.$c){this.$c=!0,this.Gc=e||!1;const t=lc();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.jc)}}enqueue(e){if(this.Jc(),this.$c)return new Promise((()=>{}));const t=new it;return this.Yc((()=>this.$c&&this.Gc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.qc.push(e),this.Zc())))}async Zc(){if(this.qc.length!==0){try{await this.qc[0](),this.qc.shift(),this.xn.reset()}catch(e){if(!Nr(e))throw e;U(_p,"Operation failed with retryable error: "+e)}this.qc.length>0&&this.xn.mn((()=>this.Zc()))}}Yc(e){const t=this.Hc.then((()=>(this.Qc=!0,e().catch((n=>{throw this.Wc=n,this.Qc=!1,qe("INTERNAL UNHANDLED ERROR: ",Ep(n)),n})).then((n=>(this.Qc=!1,n))))));return this.Hc=t,t}enqueueAfterDelay(e,t,n){this.Jc(),this.zc.indexOf(e)>-1&&(t=0);const s=M1.createAndSchedule(this,e,t,n,(i=>this.Xc(i)));return this.Kc.push(s),s}Jc(){this.Wc&&W(47125,{el:Ep(this.Wc)})}verifyOperationInProgress(){}async tl(){let e;do e=this.Hc,await e;while(e!==this.Hc)}nl(e){for(const t of this.Kc)if(t.timerId===e)return!0;return!1}rl(e){return this.tl().then((()=>{this.Kc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.Kc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.tl()}))}il(e){this.zc.push(e)}Xc(e){const t=this.Kc.indexOf(e);this.Kc.splice(t,1)}}function Ep(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yg{constructor(){this._progressObserver={},this._taskCompletionResolver=new it,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lw=-1;class we extends ha{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new yp,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new yp(e),this._firestoreClient=void 0,await e}}}function Mw(r,e,t){t||(t=$o);const n=gi(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(Wt(i,e))return s;throw new F(N.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new F(N.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<C0)throw new F(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&ds(e.host)&&$c(e.host),n.initialize({options:e,instanceIdentifier:t})}function Fw(r,e){const t=typeof r=="object"?r:hh(),n=typeof r=="string"?r:e||$o,s=gi(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Lp("firestore");i&&O0(s,...i)}return s}function ke(r){if(r._terminated)throw new F(N.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Xg(r),r._firestoreClient}function Xg(r){var n,s,i,o;const e=r._freezeSettings(),t=uE(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new Tw(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(u){const l=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(l),_online:l}})(r._componentsProvider))}function Uw(r,e){Xe("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();return Jg(r,Pr.provider,{build:n=>new Q1(n,t.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function Bw(r){Xe("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();Jg(r,Pr.provider,{build:t=>new $g(t,e.cacheSizeBytes)})}function Jg(r,e,t){if((r=he(r,we))._firestoreClient||r._terminated)throw new F(N.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new F(N.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},Xg(r)}function qw(r){if(r._initialized&&!r._terminated)throw new F(N.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new it;return r._queue.enqueueAndForgetEvenWhileRestricted((async()=>{try{await(async function(n){if(!an.C())return Promise.resolve();const s=n+gg;await an.delete(s)})(N1(r._databaseId,r._persistenceKey)),e.resolve()}catch(t){e.reject(t)}})),e.promise}function Gw(r){return(function(t){const n=new it;return t.asyncQueue.enqueueAndForget((async()=>iw(await X1(t),n))),n.promise})(ke(r=he(r,we)))}function $w(r){return ww(ke(r=he(r,we)))}function zw(r){return Aw(ke(r=he(r,we)))}function Hw(r){return d_(r.app,"firestore",r._databaseId.database),r._delete()}function ah(r,e){const t=ke(r=he(r,we)),n=new Yg;return Dw(t,r._databaseId,e,n),n}function Zg(r,e){return Vw(ke(r=he(r,we)),e).then((t=>t?new Je(r,null,t.query):null))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J1{convertValue(e,t="none"){switch(We(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Pe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ln(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw W(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Dr(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[rs].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>Pe(o.doubleValue)));return new wt(t)}convertGeoPoint(e){return new Ht(Pe(e.latitude),Pe(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=ua(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(ei(e));default:return null}}convertTimestamp(e){const t=xn(e);return new _e(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=ie.fromString(e);B(w0(n),9688,{name:e});const s=new yr(n.get(1),n.get(3)),i=new G(n.popFirst(5));return s.isEqual(t)||qe(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr extends J1{constructor(e){super(),this.firestore=e}convertBytes(e){return new vt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ye(this.firestore,null,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jw(r){var n;const e=ke(he(r.firestore,we)),t=(n=e._onlineComponents)==null?void 0:n.datastore.serializer;return t===void 0?null:du(t,mt(r._query)).yt}function Ww(r,e){var i;const t=Fh(e,((o,a)=>new Hm(a,o.aggregateType,o._internalFieldPath))),n=ke(he(r.firestore,we)),s=(i=n._onlineComponents)==null?void 0:i.datastore.serializer;return s===void 0?null:_0(s,e0(r._query),t,!0).request}const Ip="@firebase/firestore",Tp="4.16.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $s(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class e7{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new Qe({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ye(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Kw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Kt("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Kw extends Zo{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t7(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new F(N.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Z1{}class ki extends Z1{}function Qw(r,e,...t){let n=[];e instanceof Z1&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((u=>u instanceof As)).length,a=i.filter((u=>u instanceof xi)).length;if(o>1||o>0&&a>0)throw new F(N.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class xi extends ki{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new xi(e,t,n)}_apply(e){const t=this._parse(e);return r7(e._query,t),new Je(e.firestore,e.converter,zl(e._query,t))}_parse(e){const t=Es(e.firestore);return(function(i,o,a,u,l,d,f){let g;if(l.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new F(N.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){Ap(f,d);const R=[];for(const O of f)R.push(wp(u,i,O));g={arrayValue:{values:R}}}else g=wp(u,i,f)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||Ap(f,d),g=F0(a,o,f,d==="in"||d==="not-in");return pe.create(l,d,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Yw(r,e,t){const n=e,s=Kt("where",r);return xi._create(s,n,t)}class As extends Z1{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new As(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:Ie.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const a=i.getFlattenedFilters();for(const u of a)r7(o,u),o=zl(o,u)})(e._query,t),new Je(e.firestore,e.converter,zl(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function Xw(...r){return r.forEach((e=>s7("or",e))),As._create("or",r)}function Jw(...r){return r.forEach((e=>s7("and",e))),As._create("and",r)}class Cu extends ki{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Cu(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new F(N.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new F(N.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ho(i,o)})(e._query,this._field,this._direction);return new Je(e.firestore,e.converter,by(e._query,t))}}function Zw(r,e="asc"){const t=e,n=Kt("orderBy",r);return Cu._create(n,t)}class Ea extends ki{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Ea(e,t,n)}_apply(e){return new Je(e.firestore,e.converter,bc(e._query,this._limit,this._limitType))}}function eA(r){return dm("limit",r),Ea._create("limit",r,"F")}function tA(r){return dm("limitToLast",r),Ea._create("limitToLast",r,"L")}class Ia extends ki{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Ia(e,t,n)}_apply(e){const t=n7(e,this.type,this._docOrFields,this._inclusive);return new Je(e.firestore,e.converter,Cy(e._query,t))}}function nA(...r){return Ia._create("startAt",r,!0)}function rA(...r){return Ia._create("startAfter",r,!1)}class Ta extends ki{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Ta(e,t,n)}_apply(e){const t=n7(e,this.type,this._docOrFields,this._inclusive);return new Je(e.firestore,e.converter,Ny(e._query,t))}}function sA(...r){return Ta._create("endBefore",r,!1)}function iA(...r){return Ta._create("endAt",r,!0)}function n7(r,e,t,n){if(t[0]=Y(t[0]),t[0]instanceof Zo)return(function(i,o,a,u,l){if(!u)throw new F(N.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const d=[];for(const f of qs(i))if(f.field.isKeyField())d.push(ss(o,u.key));else{const g=u.data.field(f.field);if(ca(g))throw new F(N.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+f.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){const I=f.field.canonicalString();throw new F(N.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${I}' (used as the orderBy) does not exist.`)}d.push(g)}return new Tr(d,l)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=Es(r.firestore);return(function(o,a,u,l,d,f){const g=o.explicitOrderBy;if(d.length>g.length)throw new F(N.INVALID_ARGUMENT,`Too many arguments provided to ${l}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const I=[];for(let R=0;R<d.length;R++){const O=d[R];if(g[R].field.isKeyField()){if(typeof O!="string")throw new F(N.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${l}(), but got a ${typeof O}`);if(!Wh(o)&&O.indexOf("/")!==-1)throw new F(N.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${l}() must be a plain document ID, but '${O}' contains a slash.`);const x=o.path.child(ie.fromString(O));if(!G.isDocumentKey(x))throw new F(N.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${l}() must result in a valid document path, but '${x}' is not because it contains an odd number of segments.`);const z=new G(x);I.push(ss(a,z))}else{const x=F0(u,l,O);I.push(x)}}return new Tr(I,f)})(r._query,r.firestore._databaseId,s,e,t,n)}}function wp(r,e,t){if(typeof(t=Y(t))=="string"){if(t==="")throw new F(N.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Wh(e)&&t.indexOf("/")!==-1)throw new F(N.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(ie.fromString(t));if(!G.isDocumentKey(n))throw new F(N.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return ss(r,new G(n))}if(t instanceof ye)return ss(r,t._key);throw new F(N.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${nu(t)}.`)}function Ap(r,e){if(!Array.isArray(r)||r.length===0)throw new F(N.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function r7(r,e){const t=(function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new F(N.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new F(N.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function s7(r,e){if(!(e instanceof xi||e instanceof As))throw new F(N.INVALID_ARGUMENT,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}function Nu(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class ed extends J1{constructor(e){super(),this.firestore=e}convertBytes(e){return new vt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ye(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oA(r){return new pi("sum",Kt("sum",r))}function aA(r){return new pi("avg",Kt("average",r))}function i7(){return new pi("count")}function cA(r,e){var t,n;return r instanceof pi&&e instanceof pi&&r.aggregateType===e.aggregateType&&((t=r._internalFieldPath)==null?void 0:t.canonicalString())===((n=e._internalFieldPath)==null?void 0:n.canonicalString())}function uA(r,e){return e1(r.query,e.query)&&Wt(r.data(),e.data())}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lA(r){return o7(r,{count:i7()})}function o7(r,e){const t=he(r.firestore,we),n=ke(t),s=Fh(e,((i,o)=>new Hm(o,i.aggregateType,i._internalFieldPath)));return Sw(n,r._query,s).then((i=>(function(a,u,l){const d=new kr(a);return new e7(u,d,l)})(t,r,i)))}class hA{constructor(e){this.kind="memory",this._onlineComponentProvider=Pr.provider,this._offlineComponentProvider=e!=null&&e.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new K1(void 0)}}toJSON(){return{kind:this.kind}}}class dA{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=a7(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class fA{constructor(){this.kind="memoryEager",this._offlineComponentProvider=di.provider}toJSON(){return{kind:this.kind}}}class pA{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new K1(e)}}toJSON(){return{kind:this.kind}}}function mA(){return new fA}function gA(r){return new pA(r==null?void 0:r.cacheSizeBytes)}function _A(r){return new hA(r)}function yA(r){return new dA(r)}class EA{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Pr.provider,this._offlineComponentProvider={build:t=>new Q1(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class IA{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Pr.provider,this._offlineComponentProvider={build:t=>new $g(t,e==null?void 0:e.cacheSizeBytes)}}}function a7(r){return new EA(r==null?void 0:r.forceOwnership)}function TA(){return new IA}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c7="NOT SUPPORTED";class Sn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class St extends Zo{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Vo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Kt("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new F(N.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=St._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}function wA(r,e,t){if(ms(e,St._jsonSchema)){if(e.bundle===c7)throw new F(N.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=_s(r._databaseId),s=Qg(e.bundle,n),i=s.t(),o=new G1(s.getMetadata(),n);for(const d of i)o.o(d);const a=o.documents;if(a.length!==1)throw new F(N.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${a.length} documents.`);const u=hu(n,a[0].document),l=new G(ie.fromString(e.bundleName));return new St(r,new ed(r),l,u,new Sn(!1,!1),t||null)}}St._jsonSchemaVersion="firestore/documentSnapshot/1.0",St._jsonSchema={type:je("string",St._jsonSchemaVersion),bundleSource:je("string","DocumentSnapshot"),bundleName:je("string"),bundle:je("string")};class Vo extends St{data(e={}){return super.data(e)}}class bt{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Sn(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new Vo(this._firestore,this._userDataWriter,n.key,n,new Sn(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new F(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((a=>{Me(s._snapshot.query)?eh(s._snapshot.query):Kh(s.query._query);const u=new Vo(s._firestore,s._userDataWriter,a.doc.key,a.doc,new Sn(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((a=>i||a.type!==3)).map((a=>{const u=new Vo(s._firestore,s._userDataWriter,a.doc.key,a.doc,new Sn(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let l=-1,d=-1;return a.type!==0&&(l=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),d=o.indexOf(a.doc.key)),{type:vA(a.type),doc:u,oldIndex:l,newIndex:d}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new F(N.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=bt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=tu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function AA(r,e,t){if(ms(e,bt._jsonSchema)){if(e.bundle===c7)throw new F(N.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=_s(r._databaseId),s=Qg(e.bundle,n),i=s.t(),o=new G1(s.getMetadata(),n);for(const g of i)o.o(g);if(o.queries.length!==1)throw new F(N.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const a=Iu(o.queries[0].bundledQuery),u=o.documents;let l=new pr;u.map((g=>{const I=hu(n,g.document);l=l.add(I)}));const d=hs.fromInitialDocuments(a,l,se(),!1,!1),f=new Je(r,t||null,a);return new bt(r,new ed(r),f,d)}}function vA(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return W(61501,{type:r})}}function RA(r,e){return r instanceof St&&e instanceof St?r._firestore===e._firestore&&r._key.isEqual(e._key)&&(r._document===null?e._document===null:r._document.isEqual(e._document))&&r._converter===e._converter:r instanceof bt&&e instanceof bt&&r._firestore===e._firestore&&e1(r.query,e.query)&&r.metadata.isEqual(e.metadata)&&r._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */bt._jsonSchemaVersion="firestore/querySnapshot/1.0",bt._jsonSchema={type:je("string",bt._jsonSchemaVersion),bundleSource:je("string","QuerySnapshot"),bundleName:je("string"),bundle:je("string")};const PA={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u7{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Es(e)}set(e,t,n){this._verifyNotCommitted();const s=ar(e,this._firestore),i=Nu(s.converter,t,n),o=pu(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,Oe.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=ar(e,this._firestore);let o;return o=typeof(t=Y(t))=="string"||t instanceof ys?c1(this._dataReader,"WriteBatch.update",i._key,t,n,s):a1(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,Oe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=ar(e,this._firestore);return this._mutations=this._mutations.concat(new vi(t._key,Oe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new F(N.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function ar(r,e){if((r=Y(r)).firestore!==e)throw new F(N.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SA{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Es(e)}get(e){const t=ar(e,this._firestore),n=new ed(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return W(24041);const i=s[0];if(i.isFoundDocument())return new Zo(this._firestore,n,i.key,i,t.converter);if(i.isNoDocument())return new Zo(this._firestore,n,t._key,null,t.converter);throw W(18433,{doc:i})}))}set(e,t,n){const s=ar(e,this._firestore),i=Nu(s.converter,t,n),o=pu(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,n);return this._transaction.set(s._key,o),this}update(e,t,n,...s){const i=ar(e,this._firestore);let o;return o=typeof(t=Y(t))=="string"||t instanceof ys?c1(this._dataReader,"Transaction.update",i._key,t,n,s):a1(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){const t=ar(e,this._firestore);return this._transaction.delete(t._key),this}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l7 extends SA{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=ar(e,this._firestore),n=new kr(this._firestore);return super.get(e).then((s=>new St(this._firestore,n,t._key,s._document,new Sn(!1,!1),t.converter)))}}function bA(r,e,t){r=he(r,we);const n={...PA,...t};(function(o){if(o.maxAttempts<1)throw new F(N.INVALID_ARGUMENT,"Max attempts must be at least 1")})(n);const s=ke(r);return Nw(s,(i=>e(new l7(r,i))),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CA(r){r=he(r,ye);const e=he(r.firestore,we),t=ke(e);return Wg(t,r._key).then((n=>td(e,r,n)))}function NA(r){r=he(r,ye);const e=he(r.firestore,we),t=ke(e),n=new kr(e);return Rw(t,r._key).then((s=>new St(e,n,r._key,s,new Sn(s!==null&&s.hasLocalMutations,!0),r.converter)))}function DA(r){r=he(r,ye);const e=he(r.firestore,we),t=ke(e);return Wg(t,r._key,{source:"server"}).then((n=>td(e,r,n)))}function VA(r){r=he(r,Je);const e=he(r.firestore,we),t=ke(e),n=new kr(e);return t7(r._query),Kg(t,r._query).then((s=>new bt(e,n,r,s)))}function OA(r){r=he(r,Je);const e=he(r.firestore,we),t=ke(e),n=new kr(e);return Pw(t,r._query).then((s=>new bt(e,n,r,s)))}function kA(r){r=he(r,Je);const e=he(r.firestore,we),t=ke(e),n=new kr(e);return Kg(t,r._query,{source:"server"}).then((s=>new bt(e,n,r,s)))}function xA(r,e,t){r=he(r,ye);const n=he(r.firestore,we),s=Nu(r.converter,e,t),i=Es(n);return Li(n,[pu(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,Oe.none())])}function LA(r,e,t,...n){r=he(r,ye);const s=he(r.firestore,we),i=Es(s);let o;return o=typeof(e=Y(e))=="string"||e instanceof ys?c1(i,"updateDoc",r._key,e,t,n):a1(i,"updateDoc",r._key,e),Li(s,[o.toMutation(r._key,Oe.exists(!0))])}function MA(r){return Li(he(r.firestore,we),[new vi(r._key,Oe.none())])}function FA(r,e){const t=he(r.firestore,we),n=k0(r),s=Nu(r.converter,e),i=Es(r.firestore);return Li(t,[pu(i,"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,Oe.exists(!1))]).then((()=>n))}function ch(r,...e){var l,d,f;r=Y(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||$s(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if($s(e[n])){const g=e[n];e[n]=(l=g.next)==null?void 0:l.bind(g),e[n+1]=(d=g.error)==null?void 0:d.bind(g),e[n+2]=(f=g.complete)==null?void 0:f.bind(g)}let i,o,a;if(r instanceof ye)o=he(r.firestore,we),a=Ri(r._key.path),i={next:g=>{e[n]&&e[n](td(o,r,g))},error:e[n+1],complete:e[n+2]};else{const g=he(r,Je);o=he(g.firestore,we),a=g._query;const I=new kr(o);i={next:R=>{e[n]&&e[n](new bt(o,I,g,R))},error:e[n+1],complete:e[n+2]},t7(r._query)}const u=ke(o);return vw(u,a,s,i)}function UA(r,e,...t){const n=Y(r),s=(function(u){const l={bundle:"",bundleName:"",bundleSource:""},d=["bundle","bundleName","bundleSource"];for(const f of d){if(!(f in u)){l.error=`snapshotJson missing required field: ${f}`;break}const g=u[f];if(typeof g!="string"){l.error=`snapshotJson field '${f}' must be a string.`;break}if(g.length===0){l.error=`snapshotJson field '${f}' cannot be an empty string.`;break}f==="bundle"?l.bundle=g:f==="bundleName"?l.bundleName=g:f==="bundleSource"&&(l.bundleSource=g)}return l})(e);if(s.error)throw new F(N.INVALID_ARGUMENT,s.error);let i,o=0;if(typeof t[o]!="object"||$s(t[o])||(i=t[o++]),s.bundleSource==="QuerySnapshot"){let a=null;if(typeof t[o]=="object"&&$s(t[o])){const u=t[o++];a={next:u.next,error:u.error,complete:u.complete}}else a={next:t[o++],error:t[o++],complete:t[o++]};return(function(l,d,f,g,I){let R,O=!1;return ah(l,d.bundle).then((()=>Zg(l,d.bundleName))).then((z=>{z&&!O&&(I&&z.withConverter(I),R=ch(z,f||{},g))})).catch((z=>(g.error&&g.error(z),()=>{}))),()=>{O||(O=!0,R&&R())}})(n,s,i,a,t[o])}if(s.bundleSource==="DocumentSnapshot"){let a=null;if(typeof t[o]=="object"&&$s(t[o])){const u=t[o++];a={next:u.next,error:u.error,complete:u.complete}}else a={next:t[o++],error:t[o++],complete:t[o++]};return(function(l,d,f,g,I){let R,O=!1;return ah(l,d.bundle).then((()=>{if(!O){const z=new ye(l,I||null,G.fromPath(d.bundleName));R=ch(z,f||{},g)}})).catch((z=>(g.error&&g.error(z),()=>{}))),()=>{O||(O=!0,R&&R())}})(n,s,i,a,t[o])}throw new F(N.INVALID_ARGUMENT,`unsupported bundle source: ${s.bundleSource}`)}function BA(r,e){r=he(r,we);const t=ke(r),n=$s(e)?e:{next:e};return Cw(t,n)}function Li(r,e){const t=ke(r);return bw(t,e)}function td(r,e,t){const n=t.docs.get(e._key),s=new kr(r);return new St(r,s,e._key,n,new Sn(t.hasPendingWrites,t.fromCache),e.converter)}function qA(r){return r=he(r,we),ke(r),new u7(r,(e=>Li(r,e)))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GA(r,e){r=he(r,we);const t=ke(r);if(!t._uninitializedComponentsProvider||t._uninitializedComponentsProvider._offline.kind==="memory")return Xe("Cannot enable indexes when persistence is disabled"),Promise.resolve();const n=(function(i){const o=typeof i=="string"?(function(l){try{return JSON.parse(l)}catch(d){throw new F(N.INVALID_ARGUMENT,"Failed to parse JSON: "+(d==null?void 0:d.message))}})(i):i,a=[];if(Array.isArray(o.indexes))for(const u of o.indexes){const l=vp(u,"collectionGroup"),d=[];if(Array.isArray(u.fields))for(const f of u.fields){const g=vp(f,"fieldPath"),I=l1("setIndexConfiguration",g);f.arrayConfig==="CONTAINS"?d.push(new Zr(I,2)):f.order==="ASCENDING"?d.push(new Zr(I,0)):f.order==="DESCENDING"&&d.push(new Zr(I,1))}a.push(new Ws(Ws.UNKNOWN_ID,l,d,Ks.empty()))}return a})(e);return Ow(t,n)}function vp(r,e){if(typeof r[e]!="string")throw new F(N.INVALID_ARGUMENT,"Missing string value for: "+e);return r[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h7{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function $A(r){var s;r=he(r,we);const e=Rp.get(r);if(e)return e;if(((s=ke(r)._uninitializedComponentsProvider)==null?void 0:s._offline.kind)!=="persistent")return null;const n=new h7(r);return Rp.set(r,n),n}function zA(r){d7(r,!0)}function HA(r){d7(r,!1)}function jA(r){const e=ke(r._firestore);xw(e).then((t=>U("deleting all persistent cache indexes succeeded"))).catch((t=>Xe("deleting all persistent cache indexes failed",t)))}function d7(r,e){const t=ke(r._firestore);kw(t,e).then((n=>U(`setting persistent cache index auto creation isEnabled=${e} succeeded`))).catch((n=>Xe(`setting persistent cache index auto creation isEnabled=${e} failed`,n)))}const Rp=new WeakMap;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WA{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return nd.instance.onExistenceFilterMismatch(e)}}class nd{constructor(){this.i=new Map}static get instance(){return Qa||(Qa=new nd,My(Qa)),Qa}u(e){this.i.forEach((t=>t(e)))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.i;return n.set(t,e),()=>n.delete(t)}}let Qa=null;(function(e,t=!0){m5(fs),ns(new mr("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new we(new E5(n.getProvider("auth-internal")),new w5(o,n.getProvider("app-check-internal")),ly(o,s),o);return i={useFetchStreams:t,...i},a._setSettings(i),a}),"PUBLIC").setMultipleInstances(!0)),on(Ip,Tp,e),on(Ip,Tp,"esm2020")})();const bv=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:J1,AggregateField:pi,AggregateQuerySnapshot:e7,Bytes:vt,CACHE_SIZE_UNLIMITED:Lw,CollectionReference:jt,DocumentReference:ye,DocumentSnapshot:St,FieldPath:ys,FieldValue:gn,Firestore:we,FirestoreError:F,GeoPoint:Ht,LoadBundleTask:Yg,PersistentCacheIndexManager:h7,Query:Je,QueryCompositeFilterConstraint:As,QueryConstraint:ki,QueryDocumentSnapshot:Vo,QueryEndAtConstraint:Ta,QueryFieldFilterConstraint:xi,QueryLimitConstraint:Ea,QueryOrderByConstraint:Cu,QuerySnapshot:bt,QueryStartAtConstraint:Ia,SnapshotMetadata:Sn,Timestamp:_e,Transaction:l7,VectorValue:wt,WriteBatch:u7,_AutoId:tu,_ByteString:Se,_DatabaseId:yr,_DocumentKey:G,_EmptyAppCheckTokenProvider:A5,_EmptyAuthCredentialsProvider:um,_FieldPath:ve,_TestingHooks:WA,_cast:he,_debugAssert:_5,_internalAggregationQueryToProtoRunAggregationQueryRequest:Ww,_internalQueryToProtoQueryTarget:jw,_isBase64Available:ay,_logWarn:Xe,_validateIsNotUsedTogether:hm,addDoc:FA,aggregateFieldEqual:cA,aggregateQuerySnapshotEqual:uA,and:Jw,arrayRemove:AE,arrayUnion:wE,average:aA,clearIndexedDbPersistence:qw,collection:dE,collectionGroup:fE,connectFirestoreEmulator:O0,count:i7,deleteAllPersistentCacheIndexes:jA,deleteDoc:MA,deleteField:IE,disableNetwork:zw,disablePersistentCacheIndexAutoCreation:HA,doc:k0,documentId:R0,documentSnapshotFromJSON:wA,enableIndexedDbPersistence:Uw,enableMultiTabIndexedDbPersistence:Bw,enableNetwork:$w,enablePersistentCacheIndexAutoCreation:zA,endAt:iA,endBefore:sA,ensureFirestoreConfigured:ke,executeWrite:Li,getAggregateFromServer:o7,getCountFromServer:lA,getDoc:CA,getDocFromCache:NA,getDocFromServer:DA,getDocs:VA,getDocsFromCache:OA,getDocsFromServer:kA,getFirestore:Fw,getPersistentCacheIndexManager:$A,increment:vE,initializeFirestore:Mw,limit:eA,limitToLast:tA,loadBundle:ah,maximum:PE,memoryEagerGarbageCollector:mA,memoryLocalCache:_A,memoryLruGarbageCollector:gA,minimum:RE,namedQuery:Zg,onSnapshot:ch,onSnapshotResume:UA,onSnapshotsInSync:BA,or:Xw,orderBy:Zw,persistentLocalCache:yA,persistentMultipleTabManager:TA,persistentSingleTabManager:a7,query:Qw,queryEqual:e1,querySnapshotFromJSON:AA,refEqual:pE,runTransaction:bA,serverTimestamp:TE,setDoc:xA,setIndexConfiguration:GA,setLogLevel:g5,snapshotEqual:RA,startAfter:rA,startAt:nA,sum:oA,terminate:Hw,updateDoc:LA,vector:$0,waitForPendingWrites:Gw,where:Yw,writeBatch:qA},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f7="firebasestorage.googleapis.com",KA="storageBucket",QA=120*1e3,YA=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n extends mn{constructor(e,t,n=0){super(Al(e),`Firebase Storage: ${t} (${Al(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,_n.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Al(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var pn;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(pn||(pn={}));function Al(r){return"storage/"+r}function XA(){const r="An unknown error occurred, please check the error payload for server response.";return new _n(pn.UNKNOWN,r)}function JA(){return new _n(pn.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function ZA(){return new _n(pn.CANCELED,"User canceled the upload/download.")}function ev(r){return new _n(pn.INVALID_URL,"Invalid URL '"+r+"'.")}function tv(r){return new _n(pn.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function Pp(r){return new _n(pn.INVALID_ARGUMENT,r)}function p7(){return new _n(pn.APP_DELETED,"The Firebase app was deleted.")}function nv(r){return new _n(pn.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=zt.makeFromUrl(e,t)}catch{return new zt(e,"")}if(n.path==="")return n;throw tv(e)}static makeFromUrl(e,t){let n=null;const s="([A-Za-z0-9.\\-_]+)";function i(oe){oe.path.charAt(oe.path.length-1)==="/"&&(oe.path_=oe.path_.slice(0,-1))}const o="(/(.*))?$",a=new RegExp("^gs://"+s+o,"i"),u={bucket:1,path:3};function l(oe){oe.path_=decodeURIComponent(oe.path)}const d="v[A-Za-z0-9_]+",f=t.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",I=new RegExp(`^https?://${f}/${d}/b/${s}/o${g}`,"i"),R={bucket:1,path:3},O=t===f7?"(?:storage.googleapis.com|storage.cloud.google.com)":t,x="([^?#]*)",z=new RegExp(`^https?://${O}/${s}/${x}`,"i"),Q=[{regex:a,indices:u,postModify:i},{regex:I,indices:R,postModify:l},{regex:z,indices:{bucket:1,path:2},postModify:l}];for(let oe=0;oe<Q.length;oe++){const le=Q[oe],de=le.regex.exec(e);if(de){const A=de[le.indices.bucket];let E=de[le.indices.path];E||(E=""),n=new zt(A,E),le.postModify(n);break}}if(n==null)throw ev(e);return n}}class rv{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sv(r,e,t){let n=1,s=null,i=null,o=!1,a=0;function u(){return a===2}let l=!1;function d(...x){l||(l=!0,e.apply(null,x))}function f(x){s=setTimeout(()=>{s=null,r(I,u())},x)}function g(){i&&clearTimeout(i)}function I(x,...z){if(l){g();return}if(x){g(),d.call(null,x,...z);return}if(u()||o){g(),d.call(null,x,...z);return}n<64&&(n*=2);let Q;a===1?(a=2,Q=0):Q=(n+Math.random())*1e3,f(Q)}let R=!1;function O(x){R||(R=!0,g(),!l&&(s!==null?(x||(a=2),clearTimeout(s),f(0)):x||(a=1)))}return f(0),i=setTimeout(()=>{o=!0,O(!0)},t),O}function iv(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ov(r){return r!==void 0}function Sp(r,e,t,n){if(n<e)throw Pp(`Invalid value for '${r}'. Expected ${e} or greater.`);if(n>t)throw Pp(`Invalid value for '${r}'. Expected ${t} or less.`)}function av(r){const e=encodeURIComponent;let t="?";for(const n in r)if(r.hasOwnProperty(n)){const s=e(n)+"="+e(r[n]);t=t+s+"&"}return t=t.slice(0,-1),t}var Bc;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(Bc||(Bc={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(r,e){const t=r>=500&&r<600,s=[408,429].indexOf(r)!==-1,i=e.indexOf(r)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uv{constructor(e,t,n,s,i,o,a,u,l,d,f,g=!0,I=!1){this.url_=e,this.method_=t,this.headers_=n,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=a,this.errorCallback_=u,this.timeout_=l,this.progressCallback_=d,this.connectionFactory_=f,this.retry=g,this.isUsingEmulator=I,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,O)=>{this.resolve_=R,this.reject_=O,this.start_()})}start_(){const e=(n,s)=>{if(s){n(!1,new Ya(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=a=>{const u=a.loaded,l=a.lengthComputable?a.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,l)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const a=i.getErrorCode()===Bc.NO_ERROR,u=i.getStatus();if(!a||cv(u,this.additionalRetryCodes_)&&this.retry){const d=i.getErrorCode()===Bc.ABORT;n(!1,new Ya(!1,null,d));return}const l=this.successCodes_.indexOf(u)!==-1;n(!0,new Ya(l,i))})},t=(n,s)=>{const i=this.resolve_,o=this.reject_,a=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(a,a.getResponse());ov(u)?i(u):i()}catch(u){o(u)}else if(a!==null){const u=XA();u.serverResponse=a.getErrorText(),this.errorCallback_?o(this.errorCallback_(a,u)):o(u)}else if(s.canceled){const u=this.appDelete_?p7():ZA();o(u)}else{const u=JA();o(u)}};this.canceled_?t(!1,new Ya(!1,null,!0)):this.backoffId_=sv(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&iv(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Ya{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function lv(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function hv(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function dv(r,e){e&&(r["X-Firebase-GMPID"]=e)}function fv(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function pv(r,e,t,n,s,i,o=!0,a=!1){const u=av(r.urlParams),l=r.url+u,d=Object.assign({},r.headers);return dv(d,e),lv(d,t),hv(d,i),fv(d,n),new uv(l,r.method,d,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,s,o,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mv(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function gv(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc{constructor(e,t){this._service=e,t instanceof zt?this._location=t:this._location=zt.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new qc(e,t)}get root(){const e=new zt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return gv(this._location.path)}get storage(){return this._service}get parent(){const e=mv(this._location.path);if(e===null)return null;const t=new zt(this._location.bucket,e);return new qc(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw nv(e)}}function bp(r,e){const t=e==null?void 0:e[KA];return t==null?null:zt.makeFromBucketSpec(t,r)}function _v(r,e,t,n={}){r.host=`${e}:${t}`;const s=ds(e);s&&$c(`https://${r.host}/b`),r._isUsingEmulator=!0,r._protocol=s?"https":"http";const{mockUserToken:i}=n;i&&(r._overrideAuthToken=typeof i=="string"?i:Bp(i,r.app.options.projectId))}class yv{constructor(e,t,n,s,i,o=!1){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=f7,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=QA,this._maxUploadRetryTime=YA,this._requests=new Set,s!=null?this._bucket=zt.makeFromBucketSpec(s,this._host):this._bucket=bp(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=zt.makeFromBucketSpec(this._url,e):this._bucket=bp(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Sp("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Sp("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(Ve(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new qc(this,e)}_makeRequest(e,t,n,s,i=!0){if(this._deleted)return new rv(p7());{const o=pv(e,this._appId,n,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){const[n,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,s).getPromise()}}const Cp="@firebase/storage",Np="0.14.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m7="storage";function Cv(r=hh(),e){r=Y(r);const n=gi(r,m7).getImmediate({identifier:e}),s=Lp("storage");return s&&Ev(n,...s),n}function Ev(r,e,t,n={}){_v(r,e,t,n)}function Iv(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),n=r.getProvider("auth-internal"),s=r.getProvider("app-check-internal");return new yv(t,n,s,e,fs)}function Tv(){ns(new mr(m7,Iv,"PUBLIC").setMultipleInstances(!0)),on(Cp,Np,""),on(Cp,Np,"esm2020")}Tv();export{ch as A,FA as B,mr as C,MA as D,ea as E,mn as F,VA as G,Zw as H,eA as I,AE as J,wE as K,bA as L,vE as M,qA as N,_9 as O,Rv as P,bv as Q,ns as _,gi as a,Av as b,hh as c,vv as d,m_ as e,r5 as f,Y as g,Fw as h,zp as i,Cv as j,CA as k,k0 as l,Q3 as m,xA as n,V4 as o,TE as p,br as q,on as r,Y3 as s,b6 as t,LA as u,c4 as v,a9 as w,Qw as x,Yw as y,dE as z};
