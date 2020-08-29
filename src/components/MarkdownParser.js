import React, { useEffect, useRef } from 'react';
import marked from 'marked';
import Highlight from 'highlight.js';
import DOMPurify from 'dompurify';
import '../../node_modules/highlight.js/styles/night-owl.css';
import { compose, ensureArray, map, join, recursiveApply } from '../libs/functional';


const makeSafeHTML = compose(DOMPurify.sanitize, marked);
const makeHTML = compose(ensureArray, map(makeSafeHTML), join('\n'));
const highlightNodes = recursiveApply(Highlight.highlightBlock);


function MarkdownParser({ markdown, children }) {

    const parent = useRef(null);

    useEffect(() => {
        const nodes = parent.current.querySelectorAll('pre code');
        highlightNodes(nodes);
    });

    return <div className="generated-from-MD" ref={parent} dangerouslySetInnerHTML={{ __html: makeHTML(children || markdown) }}></div>;

}

export default MarkdownParser;