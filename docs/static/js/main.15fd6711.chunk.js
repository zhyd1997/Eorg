(this.webpackJsonprich_text_editor=this.webpackJsonprich_text_editor||[]).push([[0],{104:function(e,t,n){e.exports=n(429)},109:function(e,t,n){},110:function(e,t,n){},206:function(e,t,n){},426:function(e,t,n){},427:function(e,t,n){},429:function(e,t,n){"use strict";n.r(t);var a=n(1),o=n.n(a),r=n(26),l=n.n(r),i=(n(109),n(110),n(27)),c=n(28),s=n(20),u=n(30),d=n(29),m=n(9),h=(n(206),n(207),n(56)),E=n(102),f=n.n(E),g=(n(416),function(){document.querySelectorAll("pre code").forEach((function(e){return f.a.highlightBlock(e)}))}),v=n(57),b=n.n(v),p=function(e){var t=e.content,n=e.onClick,a=o.a.useRef(null),r=function(e){var t=o.a.useRef(null);return o.a.useEffect((function(){t.current=e})),t.current}(t);return o.a.useEffect((function(){r!==t&&b.a.render(t,a.current,{displayMode:!0})})),o.a.createElement("div",{ref:a,onClick:n})},y=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={editMode:!1},a.textareaRef=o.a.createRef(),a.onClick=function(){a.state.editMode||a.setState({editMode:!0,texValue:a.getValue()},(function(){a.startEdit()}))},a.onValueChange=function(e){var t=e.target.value,n=!1;try{b.a.__parse(t)}catch(o){n=!0}finally{a.setState({invalidTeX:n,texValue:t})}},a.save=function(){var e=a.props.block.getEntityAt(0),t=a.props.contentState.mergeEntityData(e,{content:a.state.texValue});a.setState({invalidTeX:!1,editMode:!1,texValue:null},a.finishEdit.bind(Object(s.a)(a),t))},a.remove=function(){a.props.blockProps.onRemove(a.props.block.getKey())},a.startEdit=function(){a.props.blockProps.onStartEdit(a.props.block.getKey())},a.finishEdit=function(e){a.props.blockProps.onFinishEdit(a.props.block.getKey(),e)},a}return Object(c.a)(n,[{key:"getValue",value:function(){return this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData().content}},{key:"render",value:function(){var e=null;e=this.state.editMode?this.state.invalidTeX?"":this.state.texValue:this.getValue();var t="TeXEditor-tex";this.state.editMode&&(t+=" TeXEditor-activeTeX");var n=null;if(this.state.editMode){var a="TeXEditor-saveButton";this.state.invalidTeX&&(a+=" TeXEditor-invalidButton"),n=o.a.createElement("div",{className:"TeXEditor-panel"},o.a.createElement("textarea",{className:"TeXEditor-texValue",onChange:this.onValueChange,ref:this.textareaRef.current,value:this.state.texValue}),o.a.createElement("div",{className:"TeXEditor-buttons"},o.a.createElement("button",{className:a,disabled:this.state.invalidTeX,onClick:this.save,type:"button"},this.state.invalidTeX?"Invalid TeX":"Done"),o.a.createElement("button",{className:"TeXEditor-removeButton",onClick:this.remove,type:"button"},"Remove")))}return o.a.createElement("div",{className:t},o.a.createElement(p,{content:e,onClick:this.onClick}),n)}}]),n}(o.a.Component),k=function(e){for(var t=e.onDoubleClick,n=e.row,a=e.column,r=e.caption,l=o.a.useRef(null),i=[],c=[],s=[],u=[],d=0;d<a;d+=1)u.push(o.a.createElement("th",{key:d},"heading"));if(c.push(o.a.createElement("thead",{key:"hhh"},o.a.createElement("tr",null,u))),n>1){for(var m=0;m<a;m+=1)s.push(o.a.createElement("td",{key:m},"cell"));for(var h=1;h<n;h+=1)i.push(o.a.createElement("tr",{key:h},s))}return o.a.createElement("table",{className:"hoverTable",onDoubleClick:t,ref:l},o.a.createElement("caption",null,r),c,o.a.createElement("tbody",null,i))},T=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).onDoubleClick=function(){},a}return Object(c.a)(n,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(k,{row:this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData().row,column:this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData().column,caption:this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData().caption,onDoubleClick:this.onDoubleClick}))}}]),n}(o.a.Component),C=function(e){var t,n=e.contentState.getEntity(e.block.getEntityAt(0)).getType();return"TOKEN"===n?t=o.a.createElement(y,{blockProps:e.blockProps,block:e.block,contentState:e.contentState}):"TABLE"===n&&(t=o.a.createElement(T,{blockProps:e.blockProps,block:e.block,contentState:e.contentState})),t};var S=function(e,t){var n=e.getCurrentContent(),a=n.getBlockForKey(t),o=new m.SelectionState({anchorKey:t,anchorOffset:0,focusKey:t,focusOffset:a.getLength()}),r=m.Modifier.removeRange(n,o,"backward"),l=m.Modifier.setBlockType(r,r.getSelectionAfter(),"unstyled"),i=m.EditorState.push(e,l,"remove-range");return m.EditorState.forceSelection(i,l.getSelectionAfter())};var R=function(e){var t=e.getCurrentContent().createEntity("TOKEN","IMMUTABLE",{content:"\\KaTeX"}),n=t.getLastCreatedEntityKey(),a=m.EditorState.set(e,{currentContent:t});return m.AtomicBlockUtils.insertAtomicBlock(a,n," ")},O=n(103),B=n(441),x=n(431),X=n(432),j=n(433),N=n(434),w=n(435),K=n(436),M=n(437),A=n(438),D=n(439),I=n(440),L=[],V=function(e){var t=e.buttonLabel,n=e.className,r=e.onClick,l=Object(a.useState)(!1),i=Object(O.a)(l,2),c=i[0],s=i[1],u=o.a.useRef(null),d=o.a.useRef(null),m=o.a.useRef(null),h=function(){return s(!c)};return o.a.createElement(o.a.Fragment,null,o.a.createElement("button",{color:"danger",onClick:h,type:"button",className:"math RichEditor-styleButton"},t),o.a.createElement(B.a,{isOpen:c,toggle:h,className:n},o.a.createElement(x.a,{toggle:h},"Modal title"),o.a.createElement(X.a,null,o.a.createElement(j.a,null,o.a.createElement(N.a,{form:!0},o.a.createElement(w.a,{md:6},o.a.createElement(K.a,null,o.a.createElement(M.a,{for:"tableRow"},"Row"),o.a.createElement(A.a,{type:"text",name:"row",id:"tableRow",innerRef:u}))),o.a.createElement(w.a,{md:6},o.a.createElement(K.a,null,o.a.createElement(M.a,{for:"tableColumn"},"Column"),o.a.createElement(A.a,{type:"text",name:"column",id:"tableColumn",innerRef:d})))),o.a.createElement(N.a,{form:!0},o.a.createElement(w.a,null,o.a.createElement(K.a,null,o.a.createElement(M.a,{for:"tableTitle"},"Title"),o.a.createElement(A.a,{type:"text",name:"title",id:"tableTitle",innerRef:m})))))),o.a.createElement(D.a,null,o.a.createElement(I.a,{color:"primary",onClick:function(){var e={row:u.current.value,column:d.current.value,caption:m.current.value};L.push(e),r(),h()}},"Yes")," ",o.a.createElement(I.a,{color:"secondary",onClick:h},"Cancel"))))};var U=function(e){var t=e.getCurrentContent(),n=L[L.length-1],a=n.row,o=n.column,r=n.caption,l=t.createEntity("TABLE","IMMUTABLE",{row:a,column:o,caption:r}),i=l.getLastCreatedEntityKey(),c=m.EditorState.set(e,{currentContent:l});return m.AtomicBlockUtils.insertAtomicBlock(c,i," ")},F=(n(426),n(427),n(428),function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).blockRenderer=function(e){return"atomic"===e.getType()?{component:C,editable:!1,props:{onStartEdit:function(e){var t=a.state.liveTeXEdits;a.setState({liveTeXEdits:t.set(e,!0)})},onFinishEdit:function(e,t){var n=a.state.liveTeXEdits;a.setState({liveTeXEdits:n.remove(e),editorState:m.EditorState.createWithContent(t)})},onRemove:function(e){return a.removeTeX(e)}}}:null},a.onChange=function(e){return a.setState({editorState:e})},a.removeTeX=function(e){var t=a.state,n=t.editorState,o=t.liveTeXEdits;a.setState({liveTeXEdits:o.remove(e),editorState:S(n,e)})},a.insertTeX=function(){a.setState((function(e){return{liveTeXEdits:Object(h.a)(),editorState:R(e.editorState)}}))},a.createTable=function(){a.setState((function(e){return{editorState:U(e.editorState)}}))},a.state={editorState:m.EditorState.createEmpty(),liveTeXEdits:Object(h.a)()},a.editorRef=o.a.createRef(),a.focus=function(){return a.editorRef.current.focus()},a.onChange=function(e){return a.setState({editorState:e})},a.handleKeyCommand=a.handleKeyCommand.bind(Object(s.a)(a)),a.mapKeyToEditorCommand=a.mapKeyToEditorCommand.bind(Object(s.a)(a)),a.toggleBlockType=a.toggleBlockType.bind(Object(s.a)(a)),a.toggleInlineStyle=a.toggleInlineStyle.bind(Object(s.a)(a)),a}return Object(c.a)(n,[{key:"handleKeyCommand",value:function(e,t){var n=m.RichUtils.handleKeyCommand(t,e);return!!n&&(this.onChange(n),!0)}},{key:"mapKeyToEditorCommand",value:function(e){if(9!==e.keyCode)return Object(m.getDefaultKeyBinding)(e);var t=m.RichUtils.onTab(e,this.state.editorState,4);t!==this.state.editorState&&this.onChange(t)}},{key:"toggleBlockType",value:function(e){this.onChange(m.RichUtils.toggleBlockType(this.state.editorState,e))}},{key:"toggleInlineStyle",value:function(e){this.onChange(m.RichUtils.toggleInlineStyle(this.state.editorState,e))}},{key:"render",value:function(){var e=this.state.editorState,t="RichEditor-editor",n=e.getCurrentContent();n.hasText()||"unstyled"!==n.getBlockMap().first().getType()&&(t+=" RichEditor-hidePlaceholder");var a=function(e){for(var t='<pre><code class="latex">',n=0;n<e.length;n+=1){t+=e[n]}t+="</code></pre>",document.getElementById("tex").innerHTML=t,g()};return o.a.createElement("div",{className:"double-column"},o.a.createElement("div",{className:"RichEditor-root"},o.a.createElement("div",{className:"Menu"},o.a.createElement(J,{editorState:e,onToggle:this.toggleBlockType}),o.a.createElement(Y,{editorState:e,onToggle:this.toggleInlineStyle}),o.a.createElement("div",{className:"RichEditor-controls TeXEditor-insert"},o.a.createElement("button",{onClick:this.insertTeX,className:"math RichEditor-styleButton",type:"button"},"Math"),o.a.createElement(V,{onClick:this.createTable,buttonLabel:"Table"}),o.a.createElement("button",{onClick:function(){var e=Object(m.convertToRaw)(n),t=[],o=0,r=0,l=e.blocks,i=[],c=e.entityMap;if(Object.keys(c).length)for(var s=0;s<Object.keys(c).length;s+=1)"TOKEN"===c[s].type?i.push(Object.values(c)[s].data.content):"TABLE"===c[s].type&&i.push("sorry, but the table feature has not finished !!!");for(var u=0,d=0;d<l.length;d+=1){for(var h="",E=[],f=[],g=l[d].inlineStyleRanges,v=0;v<g.length;v+=1){var b=g[v].offset;E.push(b)}E.sort((function(e,t){return e-t}));for(var p=0;p<E.length;p+=1)for(var y=0;y<Object.values(g).length;y+=1)Object.values(g)[y].offset===E[p]&&f.push(Object.values(g)[y]);if(0===g.length)"unstyled"===l[d].type?h+=l[d].text:"atomic"===l[d].type?(l[d].text=i[u],h+=l[d].text,u+=1):h+="".concat(P[l[d].type],"{").concat(l[d].text,"}"),h+="<br />";else for(var k=0;k<f.length;k+=1){var T=E[k],C=f[k].length,S=f[k].style;h+=0===k?l[d].text.slice(0,T):l[d].text.slice(o+r,T),h+="".concat(P[S],"{").concat(l[d].text.slice(T,T+C),"}"),k===f.length-1&&(h+="".concat(l[d].text.slice(T+C),"<br/>")),o=T,r=C}t.push(h)}a(t)},className:"save",type:"button"},"preview"))),o.a.createElement("div",{className:t,onClick:this.focus},o.a.createElement(m.Editor,{blockRendererFn:this.blockRenderer,blockStyleFn:H,customStyleMap:_,editorState:e,handleKeyCommand:this.handleKeyCommand,keyBindingFn:this.mapKeyToEditorCommand,onChange:this.onChange,placeholder:"Tell a story...",readOnly:this.state.liveTeXEdits.count(),ref:this.editorRef,spellCheck:!0}))),o.a.createElement("div",{id:"tex"},o.a.createElement("p",{className:"compiled"},"% LaTeX code will appear below...")))}}]),n}(o.a.Component)),P={"header-one":"\\section","header-two":"\\subsection","header-three":"\\subsubsection",BOLD:"\\textbf",ITALIC:"\\textit",UNDERLINE:"\\underline",CODE:"\\texttt"},_={CODE:{backgroundColor:"rgba(0, 0, 0, 0.05)",fontFamily:'"Inconsolata", "Menlo", "Consolas", monospace',fontSize:16,padding:2}};function H(e){switch(e.getType()){case"blockquote":return"RichEditor-blockquote";default:return null}}var q=function(e){var t="RichEditor-styleButton";return e.active&&(t+=" RichEditor-activeButton"),o.a.createElement("span",{className:t,onMouseDown:function(t){t.preventDefault(),e.onToggle(e.style)}},e.label)},W=[{label:"H1",style:"header-one"},{label:"H2",style:"header-two"},{label:"H3",style:"header-three"}],J=function(e){var t=e.editorState,n=t.getSelection(),a=t.getCurrentContent().getBlockForKey(n.getStartKey()).getType();return o.a.createElement("div",{className:"RichEditor-controls"},W.map((function(t){return o.a.createElement(q,{key:t.label,active:t.style===a,label:t.label,onToggle:e.onToggle,style:t.style})})))},z=[{label:"Bold",style:"BOLD"},{label:"Italic",style:"ITALIC"},{label:"Underline",style:"UNDERLINE"},{label:"Monospace",style:"CODE"}],Y=function(e){var t=e.editorState.getCurrentInlineStyle();return o.a.createElement("div",{className:"RichEditor-controls"},z.map((function(n){return o.a.createElement(q,{key:n.label,active:t.has(n.style),label:n.label,onToggle:e.onToggle,style:n.style})})))},$=F;var G=function(){return o.a.createElement("div",{className:"App"},o.a.createElement($,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(G,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[104,1,2]]]);
//# sourceMappingURL=main.15fd6711.chunk.js.map