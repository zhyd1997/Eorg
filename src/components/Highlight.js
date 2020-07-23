import hljs from "highlight.js";
import 'highlight.js/styles/monokai.css'

const highlightCallBack = () => {
	document.querySelectorAll('pre code')
		.forEach(block => hljs.highlightBlock(block))
}

export default highlightCallBack