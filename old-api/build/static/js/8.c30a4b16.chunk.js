(this.webpackJsonpSyte3=this.webpackJsonpSyte3||[]).push([[8],{112:function(e,a,t){"use strict";t.r(a);var n=t(17),r=t(0),l=t.n(r),c=t(46),s=t(49),o=t(42),u=t.n(o),m=t(54),i=t.n(m);function p(e){var a=e.user;return l.a.createElement("div",{className:i.a.profile},l.a.createElement("a",{href:a.url,className:i.a.picture},l.a.createElement(u.a,{src:a.profile_picture,alt:"Instagram Profile"})),l.a.createElement("h2",null,a.full_name),l.a.createElement("a",{href:a.url,className:i.a.username},"@",a.username),a.bio&&a.bio.length&&l.a.createElement("p",{dangerouslySetInnerHTML:{__html:a.bio}}),l.a.createElement("ul",{className:i.a.stats},l.a.createElement("li",null,"Posts ",l.a.createElement("strong",null,a.counts.media?a.counts.media.toLocaleString():"0")),l.a.createElement("li",null,"Following ",l.a.createElement("strong",null,a.counts.follows?a.counts.follows.toLocaleString():"0")),l.a.createElement("li",null,"Followers ",l.a.createElement("strong",null,a.counts.followed_by?a.counts.followed_by.toLocaleString():"0"))))}var f=t(44),_=t.n(f),E=t(45),d=t(18),g=t(60);function v(e){var a=e.post,t=Object(r.useState)(!1),c=Object(n.a)(t,2),s=c[0],o=c[1],m=Object(r.useState)(!1),p=Object(n.a)(m,2),f=p[0],_=p[1],E=function(e){e.preventDefault(),_(!f)};return l.a.createElement("li",null,l.a.createElement("a",{href:a.url,className:i.a.post,onClick:E},l.a.createElement(u.a,{src:a.pictureHD,alt:"Instagram Post",loader:l.a.createElement("div",{className:i.a.placeholder},l.a.createElement(d.f,{type:"Instagram"})),onLoad:function(){o(!0)}}),a.video&&l.a.createElement("span",{className:i.a.video},s&&l.a.createElement(d.i,null)),l.a.createElement("ul",{className:i.a.stats},l.a.createElement("li",null,l.a.createElement(d.c,null),l.a.createElement("span",null,a.likes)),l.a.createElement("li",null,l.a.createElement(d.a,null),l.a.createElement("span",null,a.comments)))),f&&l.a.createElement(g.a,{item:a,onClose:E}))}function b(){var e=Object(r.useState)([]),a=Object(n.a)(e,2),t=a[0],c=a[1],s=Object(r.useState)(!0),o=Object(n.a)(s,2),u=o[0],m=o[1],p=Object(r.useState)(!1),f=Object(n.a)(p,2),d=f[0],g=f[1];Object(r.useEffect)((function(){b()}),[]);var b=function(){var e=Object(E.a)(_.a.mark((function e(){var a,t;return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat("http://localhost:4000/api","/instagram/recent"));case 3:return a=e.sent,e.next=6,a.json();case 6:(t=e.sent).length>0&&c(t),m(!1),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),g(!0);case 14:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(){return e.apply(this,arguments)}}();return l.a.createElement("div",{className:i.a.posts},d&&l.a.createElement("p",{className:i.a.error},"Unable to fetch Instagram posts."),!u&&!t.length&&!d&&l.a.createElement("p",{className:i.a.empty},"No recent activity."),u||d||!t.length?null:l.a.createElement("ul",null,t.map((function(e){return l.a.createElement(v,{key:e.id,post:e})}))))}function h(){var e=Object(s.a)("instagram"),a=Object(n.a)(e,2),t=a[0];return a[1]?l.a.createElement(c.a,{message:"Unable to fetch instagram profile."}):l.a.createElement(l.a.Fragment,null,t&&l.a.createElement(p,{user:t}),l.a.createElement(b,null),t&&l.a.createElement("a",{href:t.url,className:i.a.more},"See more on Instagram..."))}t.d(a,"default",(function(){return h}))},46:function(e,a,t){"use strict";var n=t(0),r=t.n(n),l=t(47),c=t.n(l);a.a=function(e){var a=e.message;return r.a.createElement("div",{className:c.a.Error},r.a.createElement("h3",null,":("),r.a.createElement("p",null,a||"Unable to load"))}},47:function(e,a,t){e.exports={Error:"Error_Error__3f4kP",fadeIn:"Error_fadeIn__2G69l"}},49:function(e,a,t){"use strict";t.d(a,"a",(function(){return o}));var n=t(44),r=t.n(n),l=t(45),c=t(17),s=t(0);function o(e){var a=Object(s.useState)(null),t=Object(c.a)(a,2),n=t[0],o=t[1],u=Object(s.useState)(!1),m=Object(c.a)(u,2),i=m[0],p=m[1];return Object(s.useEffect)((function(){(function(){var a=Object(l.a)(r.a.mark((function a(){var t,n,l;return r.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,t="".concat("http://localhost:4000/api","/").concat(e,"/user"),a.next=4,fetch(t);case 4:return n=a.sent,a.next=7,n.json();case 7:l=a.sent,o(l),a.next=14;break;case 11:a.prev=11,a.t0=a.catch(0),p(!0);case 14:case"end":return a.stop()}}),a,null,[[0,11]])})));return function(){return a.apply(this,arguments)}})()()}),[e]),[n,i]}},54:function(e,a,t){e.exports={profile:"Instagram_profile__25gVt",picture:"Instagram_picture__1Z0it",scaleIn:"Instagram_scaleIn__pyMKT",moveIn:"Instagram_moveIn__1dt-e",username:"Instagram_username__3SMz_",moveOut:"Instagram_moveOut__2liPY",stats:"Instagram_stats__14eJu",posts:"Instagram_posts__1qUTF",halfScaleIn:"Instagram_halfScaleIn__1278P",video:"Instagram_video__25Swq",post:"Instagram_post__10C5W",placeholder:"Instagram_placeholder__2rdj0",rotate:"Instagram_rotate__13xWk",error:"Instagram_error__IMUTE",more:"Instagram_more__k7diT",timelinePost:"Instagram_timelinePost__2mXed",fadeIn:"Instagram_fadeIn__1bABg"}},60:function(e,a,t){"use strict";t.d(a,"a",(function(){return f}));var n=t(0),r=t.n(n),l=t(42),c=t.n(l),s=t(107),o=t(104),u=t(18),m=t(19),i=t(10),p=t.n(i);function f(e){var a=e.item,t=e.onClose;return r.a.createElement(m.b,{onClose:t},a.video?r.a.createElement("video",{src:a.video.url,className:p.a.media,poster:a.pictureHD,controls:!0}):r.a.createElement(c.a,{src:a.pictureHD?a.pictureHD:a.picture,alt:"Instagram Post",className:p.a.media}),r.a.createElement("div",{className:p.a.details},r.a.createElement("h4",null,a.user.username),r.a.createElement("a",{href:a.url,className:p.a.avatar},r.a.createElement(c.a,{src:a.user.profile_picture,alt:"Avatar"})),r.a.createElement("span",{className:p.a.date},Object(s.a)("string"===typeof a.date?Object(o.a)(a.date):a.date)," ago"),r.a.createElement("ul",{className:p.a.stats},r.a.createElement("li",null,r.a.createElement(u.c,null),r.a.createElement("span",null,a.likes)),r.a.createElement("li",null,r.a.createElement(u.a,null),r.a.createElement("span",null,a.comments))),r.a.createElement("p",{dangerouslySetInnerHTML:{__html:a.text}})))}}}]);
//# sourceMappingURL=8.c30a4b16.chunk.js.map