# PDF预览

## Canvas解决方案

有两种方法实现

+ react-pdf（react组件化解决方案，代码简单，无缝对接react。但是2个API对老浏览器不友好，有兼容问题）
+ pdf.js-legacy模式（react封装需要自行处理，代码量大。引入了兼容包，故无兼容问题）
 + legacy也只支持chrome 92+ https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#faq-support
 + 原因是不支持Array.prototype.at

## 特点

pdf文件可以使用远程或者本地，远程需要注意服务器跨域问题
pdf.worker文件也可以引入本地，但是要保证pdfjs-dist包与pdfjs-generic-legacy包版本一致。如果使用react-pdf想引入worker本地文件，也要引入pdfjs-dist包，也要保持版本一致