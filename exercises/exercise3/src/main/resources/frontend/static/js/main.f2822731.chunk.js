(this["webpackJsonpclient-app"]=this["webpackJsonpclient-app"]||[]).push([[0],[,,,,,function(e,t,a){e.exports=a(19)},,,,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(3),s=a.n(c),u=a(1),l=a(4),m={requestedUsername:"",client:null},o=r.a.createContext(m),i=function(e){var t=e.username,a=e.children;return m.client=new l.w3cwebsocket("ws://127.0.0.1:4000/chat?username=".concat(t)),m.requestedUsername=t,r.a.createElement(o.Provider,{value:m},a)},d=(a(13),function(e){var t=e.createUser,a=Object(n.useState)(""),c=Object(u.a)(a,2),s=c[0],l=c[1];return r.a.createElement("div",{className:"modal-overlay"},r.a.createElement("div",{className:"modal-wrapper"},r.a.createElement("h2",null,"Insert your username"),r.a.createElement("form",{onSubmit:function(e){e.preventDefault(),t(s),l("")}},r.a.createElement("input",{type:"text",placeholder:"your username",value:s,minLength:1,required:!0,autoFocus:!0,onChange:function(e){e.preventDefault(),l(e.target.value)}}))))}),f=(a(14),function(e){var t=e.username,a=e.users;return r.a.createElement("div",{className:"users"},r.a.createElement("div",null,"@",t),r.a.createElement("h3",null,"users"),r.a.createElement("div",null,a.map((function(e,t){return r.a.createElement("p",{key:t},e)}))))}),p=(a(15),function(e){var t,a=e.data;return r.a.createElement("div",{className:"message"},r.a.createElement("div",{className:"message-handler"},r.a.createElement("span",{className:"message-handler-user"},a.username),r.a.createElement("span",{className:"message-handler-date"},(t=a.timestamp,new Date(1e3*t).toLocaleTimeString()))),r.a.createElement("pre",{className:"message-text",dangerouslySetInnerHTML:{__html:a.text}}))}),E=function(){var e=Object(n.useContext)(o).client,t=Object(n.useState)(""),a=Object(u.a)(t,2),c=a[0],s=a[1];return r.a.createElement("form",{onSubmit:function(t){t.preventDefault(),e.send(JSON.stringify({text:c})),s("")}},r.a.createElement("input",{type:"text",placeholder:"write to chat..",value:c,minLength:1,required:!0,autoFocus:!0,onChange:function(e){e.preventDefault(),s(e.target.value)}}))},v=(a(16),function(e){var t=e.messages,a=Object(n.useRef)();return Object(n.useEffect)((function(){a.current.scrollIntoView({behavior:"smooth"})}),[t]),r.a.createElement("div",{className:"chat"},r.a.createElement("div",{className:"chat-messages"},t.map((function(e,t){return r.a.createElement(p,{key:t,data:e})})),r.a.createElement("div",{ref:a})),r.a.createElement("div",{className:"chat-input"},r.a.createElement(E,null)))}),h=(a(17),function(){var e=Object(n.useContext)(o),t=e.client,a=e.requestedUsername,c=Object(n.useState)(a),s=Object(u.a)(c,2),l=s[0],m=s[1],i=Object(n.useState)([]),d=Object(u.a)(i,2),p=d[0],E=d[1],h=Object(n.useState)([]),b=Object(u.a)(h,2),g=b[0],O=b[1];return Object(n.useEffect)((function(){t.onmessage=function(e){var t=JSON.parse(e.data);console.log("chat app",t),t.Connected&&(m(t.Connected.username),E(t.Connected.userList)),t.UserJoined&&E(t.UserJoined.userList),t.UserLeft&&E(t.UserLeft.userList),t.Message&&O(g.concat(t.Message))}}),[t,g,l]),r.a.createElement("div",{className:"chat-app"},r.a.createElement(f,{username:l,users:p}),r.a.createElement(v,{messages:g}))}),b=function(){var e=Object(n.useState)(""),t=Object(u.a)(e,2),a=t[0],c=t[1];return r.a.createElement(r.a.Fragment,null,""===a?r.a.createElement(d,{createUser:c}):r.a.createElement(i,{username:a},r.a.createElement(h,null)))};a(18);s.a.render(r.a.createElement(b,null),document.getElementById("root"))}],[[5,1,2]]]);
//# sourceMappingURL=main.f2822731.chunk.js.map