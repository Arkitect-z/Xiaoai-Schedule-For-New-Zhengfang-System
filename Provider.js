function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    //除函数名外都可编辑
    //以下为示例，您可以完全重写或在此基础上更改
                                
const ifrs = dom.getElementsByTagName("iframe");
const frs = dom.getElementsByTagName("frame");

if (ifrs.length) {
    for (let i = 0; i < ifrs.length; i++) {
        const dom = ifrs[i].contentWindow.document;
        iframeContent += scheduleHtmlProvider(iframeContent, frameContent, dom);
        }
} 
if (frs.length) {
    for (let i = 0; i < frs.length; i++) {
        const dom = frs[i].contentDocument.body.parentElement;
        frameContent += scheduleHtmlProvider(iframeContent, frameContent, dom);
        }
} 
if(!ifrs.length && !frs.length){
    return dom.querySelector('body').outerHTML
}
return dom.getElementsByTagName('html')[0].innerHTML + iframeContent+frameContent  
}