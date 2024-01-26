var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import sourceMapSupport from"source-map-support";import path11 from"path";import chalk from"chalk";import pretty from"pretty-time";var PerfTimer=class{static{__name(this,"PerfTimer")}evts;constructor(){this.evts={},this.addEvent("start")}addEvent(evtName){this.evts[evtName]=process.hrtime()}timeSince(evtName){return chalk.yellow(pretty(process.hrtime(this.evts[evtName??"start"])))}};import{rimraf}from"rimraf";import{isGitIgnored}from"globby";import chalk6 from"chalk";import esbuild from"esbuild";import remarkParse from"remark-parse";import remarkRehype from"remark-rehype";import{unified}from"unified";import{read}from"to-vfile";import{slug as slugAnchor}from"github-slugger";import rfdc from"rfdc";var clone=rfdc(),QUARTZ="quartz";function isRelativeURL(s){let validStart=/^\.{1,2}/.test(s),validEnding=!(s.endsWith("/index")||s==="index");return validStart&&validEnding&&![".md",".html"].includes(_getFileExtension(s)??"")}__name(isRelativeURL,"isRelativeURL");function sluggify(s){return s.split("/").map(segment=>segment.replace(/\s/g,"-").replace(/%/g,"-percent").replace(/\?/g,"-q").replace(/#/g,"")).join("/").replace(/\/$/,"")}__name(sluggify,"sluggify");function slugifyFilePath(fp,excludeExt){fp=_stripSlashes(fp);let ext=_getFileExtension(fp),withoutFileExt=fp.replace(new RegExp(ext+"$"),"");(excludeExt||[".md",".html",void 0].includes(ext))&&(ext="");let slug=sluggify(withoutFileExt);return _endsWith(slug,"_index")&&(slug=slug.replace(/_index$/,"index")),slug+ext}__name(slugifyFilePath,"slugifyFilePath");function simplifySlug(fp){let res=_stripSlashes(_trimSuffix(fp,"index"),!0);return res.length===0?"/":res}__name(simplifySlug,"simplifySlug");function transformInternalLink(link){let[fplike,anchor]=splitAnchor(decodeURI(link)),folderPath=_isFolderPath(fplike),segments=fplike.split("/").filter(x=>x.length>0),prefix=segments.filter(_isRelativeSegment).join("/"),fp=segments.filter(seg=>!_isRelativeSegment(seg)&&seg!=="").join("/"),simpleSlug=simplifySlug(slugifyFilePath(fp)),joined=joinSegments(_stripSlashes(prefix),_stripSlashes(simpleSlug)),trail=folderPath?"/":"";return _addRelativeToStart(joined)+trail+anchor}__name(transformInternalLink,"transformInternalLink");var _rebaseHastElement=__name((el,attr,curBase,newBase)=>{if(el.properties?.[attr]){if(!isRelativeURL(String(el.properties[attr])))return;let rel=joinSegments(resolveRelative(curBase,newBase),"..",el.properties[attr]);el.properties[attr]=rel}},"_rebaseHastElement");function normalizeHastElement(rawEl,curBase,newBase){let el=clone(rawEl);return _rebaseHastElement(el,"src",curBase,newBase),_rebaseHastElement(el,"href",curBase,newBase),el.children&&(el.children=el.children.map(child=>normalizeHastElement(child,curBase,newBase))),el}__name(normalizeHastElement,"normalizeHastElement");function pathToRoot(slug){let rootPath=slug.split("/").filter(x=>x!=="").slice(0,-1).map(_=>"..").join("/");return rootPath.length===0&&(rootPath="."),rootPath}__name(pathToRoot,"pathToRoot");function resolveRelative(current,target){return joinSegments(pathToRoot(current),simplifySlug(target))}__name(resolveRelative,"resolveRelative");function splitAnchor(link){let[fp,anchor]=link.split("#",2);return anchor=anchor===void 0?"":"#"+slugAnchor(anchor),[fp,anchor]}__name(splitAnchor,"splitAnchor");function slugTag(tag){return tag.split("/").map(tagSegment=>sluggify(tagSegment)).join("/")}__name(slugTag,"slugTag");function joinSegments(...args){return args.filter(segment=>segment!=="").join("/").replace(/\/\/+/g,"/")}__name(joinSegments,"joinSegments");function getAllSegmentPrefixes(tags){let segments=tags.split("/"),results=[];for(let i=0;i<segments.length;i++)results.push(segments.slice(0,i+1).join("/"));return results}__name(getAllSegmentPrefixes,"getAllSegmentPrefixes");function transformLink(src,target,opts){let targetSlug=transformInternalLink(target);if(opts.strategy==="relative")return targetSlug;{let folderTail=_isFolderPath(targetSlug)?"/":"",canonicalSlug=_stripSlashes(targetSlug.slice(1)),[targetCanonical,targetAnchor]=splitAnchor(canonicalSlug);if(opts.strategy==="shortest"){let matchingFileNames=opts.allSlugs.filter(slug=>{let fileName=slug.split("/").at(-1);return targetCanonical===fileName});if(matchingFileNames.length===1){let targetSlug2=matchingFileNames[0];return resolveRelative(src,targetSlug2)+targetAnchor}}return joinSegments(pathToRoot(src),canonicalSlug)+folderTail}}__name(transformLink,"transformLink");function _isFolderPath(fplike){return fplike.endsWith("/")||_endsWith(fplike,"index")||_endsWith(fplike,"index.md")||_endsWith(fplike,"index.html")}__name(_isFolderPath,"_isFolderPath");function _endsWith(s,suffix){return s===suffix||s.endsWith("/"+suffix)}__name(_endsWith,"_endsWith");function _trimSuffix(s,suffix){return _endsWith(s,suffix)&&(s=s.slice(0,-suffix.length)),s}__name(_trimSuffix,"_trimSuffix");function _getFileExtension(s){return s.match(/\.[A-Za-z0-9]+$/)?.[0]}__name(_getFileExtension,"_getFileExtension");function _isRelativeSegment(s){return/^\.{0,2}$/.test(s)}__name(_isRelativeSegment,"_isRelativeSegment");function _stripSlashes(s,onlyStripPrefix){return s.startsWith("/")&&(s=s.substring(1)),!onlyStripPrefix&&s.endsWith("/")&&(s=s.slice(0,-1)),s}__name(_stripSlashes,"_stripSlashes");function _addRelativeToStart(s){return s===""&&(s="."),s.startsWith(".")||(s=joinSegments(".",s)),s}__name(_addRelativeToStart,"_addRelativeToStart");import path from"path";import workerpool,{Promise as WorkerPromise}from"workerpool";import{Spinner}from"cli-spinner";var QuartzLogger=class{static{__name(this,"QuartzLogger")}verbose;spinner;constructor(verbose){this.verbose=verbose}start(text){this.verbose?console.log(text):(this.spinner=new Spinner(`%s ${text}`),this.spinner.setSpinnerString(18),this.spinner.start())}end(text){this.verbose||this.spinner.stop(!0),text&&console.log(text)}};import chalk2 from"chalk";import process2 from"process";import{isMainThread}from"workerpool";var rootFile=/.*at file:/;function trace(msg,err){let stack=err.stack??"",lines=[];lines.push(""),lines.push(`
`+chalk2.bgRed.black.bold(" ERROR ")+`

`+chalk2.red(` ${msg}`)+(err.message.length>0?`: ${err.message}`:""));let reachedEndOfLegibleTrace=!1;for(let line of stack.split(`
`).slice(1)){if(reachedEndOfLegibleTrace)break;line.includes("node_modules")||(lines.push(` ${line}`),rootFile.test(line)&&(reachedEndOfLegibleTrace=!0))}let traceMsg=lines.join(`
`);if(isMainThread)console.error(traceMsg),process2.exit(1);else throw new Error(traceMsg)}__name(trace,"trace");function createProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkParse).use(transformers.filter(p=>p.markdownPlugins).flatMap(plugin=>plugin.markdownPlugins(ctx))).use(remarkRehype,{allowDangerousHtml:!0}).use(transformers.filter(p=>p.htmlPlugins).flatMap(plugin=>plugin.htmlPlugins(ctx)))}__name(createProcessor,"createProcessor");function*chunks(arr,n){for(let i=0;i<arr.length;i+=n)yield arr.slice(i,i+n)}__name(chunks,"chunks");async function transpileWorkerScript(){let cacheFile="./.quartz-cache/transpiled-worker.mjs",fp="./quartz/worker.ts";return esbuild.build({entryPoints:[fp],outfile:path.join(QUARTZ,cacheFile),bundle:!0,keepNames:!0,platform:"node",format:"esm",packages:"external",sourcemap:!0,sourcesContent:!1,plugins:[{name:"css-and-scripts-as-text",setup(build){build.onLoad({filter:/\.scss$/},_=>({contents:"",loader:"text"})),build.onLoad({filter:/\.inline\.(ts|js)$/},_=>({contents:"",loader:"text"}))}}]})}__name(transpileWorkerScript,"transpileWorkerScript");function createFileParser(ctx,fps){let{argv,cfg}=ctx;return async processor=>{let res=[];for(let fp of fps)try{let perf=new PerfTimer,file=await read(fp);file.value=file.value.toString().trim();for(let plugin of cfg.plugins.transformers.filter(p=>p.textTransform))file.value=plugin.textTransform(ctx,file.value.toString());file.data.filePath=file.path,file.data.relativePath=path.posix.relative(argv.directory,file.path),file.data.slug=slugifyFilePath(file.data.relativePath);let ast=processor.parse(file),newAst=await processor.run(ast,file);res.push([newAst,file]),argv.verbose&&console.log(`[process] ${fp} -> ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process \`${fp}\``,err)}return res}}__name(createFileParser,"createFileParser");var clamp=__name((num,min,max)=>Math.min(Math.max(Math.round(num),min),max),"clamp");async function parseMarkdown(ctx,fps){let{argv}=ctx,perf=new PerfTimer,log=new QuartzLogger(argv.verbose),CHUNK_SIZE=128,concurrency=ctx.argv.concurrency??clamp(fps.length/CHUNK_SIZE,1,4),res=[];if(log.start(`Parsing input files using ${concurrency} threads`),concurrency===1)try{let processor=createProcessor(ctx);res=await createFileParser(ctx,fps)(processor)}catch(error){throw log.end(),error}else{await transpileWorkerScript();let pool=workerpool.pool("./quartz/bootstrap-worker.mjs",{minWorkers:"max",maxWorkers:concurrency,workerType:"thread"}),childPromises=[];for(let chunk of chunks(fps,CHUNK_SIZE))childPromises.push(pool.exec("parseFiles",[argv,chunk,ctx.allSlugs]));res=(await WorkerPromise.all(childPromises).catch(err=>{let errString=err.toString().slice(6);console.error(errString),process.exit(1)})).flat(),await pool.terminate()}return log.end(`Parsed ${res.length} Markdown files in ${perf.timeSince()}`),res}__name(parseMarkdown,"parseMarkdown");function filterContent(ctx,content){let{cfg,argv}=ctx,perf=new PerfTimer,initialLength=content.length;for(let plugin of cfg.plugins.filters){let updatedContent=content.filter(item=>plugin.shouldPublish(ctx,item));if(argv.verbose){let diff=content.filter(x=>!updatedContent.includes(x));for(let file of diff)console.log(`[filter:${plugin.name}] ${file[1].data.slug}`)}content=updatedContent}return console.log(`Filtered out ${initialLength-content.length} files in ${perf.timeSince()}`),content}__name(filterContent,"filterContent");import matter from"gray-matter";import remarkFrontmatter from"remark-frontmatter";import yaml from"js-yaml";import toml from"toml";var defaultOptions={delims:"---",language:"yaml",oneLineTagDelim:","},FrontMatter=__name(userOpts=>{let opts={...defaultOptions,...userOpts};return{name:"FrontMatter",markdownPlugins(){let{oneLineTagDelim}=opts;return[[remarkFrontmatter,["yaml","toml"]],()=>(_,file)=>{let{data}=matter(Buffer.from(file.value),{...opts,engines:{yaml:s=>yaml.load(s,{schema:yaml.JSON_SCHEMA}),toml:s=>toml.parse(s)}});data.tag&&(data.tags=data.tag),data.title?data.title=data.title.toString():(data.title===null||data.title===void 0)&&(data.title=file.stem??"Untitled"),data.tags&&(Array.isArray(data.tags)||(data.tags=data.tags.toString().split(oneLineTagDelim).map(tag=>tag.trim())),data.tags=data.tags.filter(tag=>typeof tag=="string"||typeof tag=="number").map(tag=>tag.toString())),data.tags=[...new Set(data.tags?.map(tag=>slugTag(tag)))],file.data.frontmatter=data}]}}},"FrontMatter");import remarkGfm from"remark-gfm";import smartypants from"remark-smartypants";import rehypeSlug from"rehype-slug";import rehypeAutolinkHeadings from"rehype-autolink-headings";var defaultOptions2={enableSmartyPants:!0,linkHeadings:!0},GitHubFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions2,...userOpts};return{name:"GitHubFlavoredMarkdown",markdownPlugins(){return opts.enableSmartyPants?[remarkGfm,smartypants]:[remarkGfm]},htmlPlugins(){return opts.linkHeadings?[rehypeSlug,[rehypeAutolinkHeadings,{behavior:"append",properties:{ariaHidden:!0,tabIndex:-1,"data-no-popover":!0},content:{type:"text",value:" \xA7"}}]]:[]}}},"GitHubFlavoredMarkdown");import fs from"fs";import path2 from"path";import{Repository}from"@napi-rs/simple-git";import chalk3 from"chalk";var defaultOptions3={priority:["frontmatter","git","filesystem"]};function coerceDate(fp,d){let dt=new Date(d),invalidDate=isNaN(dt.getTime())||dt.getTime()===0;return invalidDate&&d!==void 0&&console.log(chalk3.yellow(`
Warning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`)),invalidDate?new Date:dt}__name(coerceDate,"coerceDate");var CreatedModifiedDate=__name(userOpts=>{let opts={...defaultOptions3,...userOpts};return{name:"CreatedModifiedDate",markdownPlugins(){return[()=>{let repo;return async(_tree,file)=>{let created,modified,published,fp=file.data.filePath,fullFp=path2.posix.join(file.cwd,fp);for(let source of opts.priority)if(source==="filesystem"){let st=await fs.promises.stat(fullFp);created||=st.birthtimeMs,modified||=st.mtimeMs}else if(source==="frontmatter"&&file.data.frontmatter)created||=file.data.frontmatter.date,modified||=file.data.frontmatter.lastmod,modified||=file.data.frontmatter.updated,modified||=file.data.frontmatter["last-modified"],published||=file.data.frontmatter.publishDate;else if(source==="git"){repo||(repo=Repository.discover(file.cwd));try{modified||=await repo.getFileLatestModifiedDateAsync(file.data.filePath)}catch{console.log(chalk3.yellow(`
Warning: ${file.data.filePath} isn't yet tracked by git, last modification date is not available for this file`))}}file.data.dates={created:coerceDate(fp,created),modified:coerceDate(fp,modified),published:coerceDate(fp,published)}}}]}}},"CreatedModifiedDate");import remarkMath from"remark-math";import rehypeKatex from"rehype-katex";import rehypeMathjax from"rehype-mathjax/svg";var Latex=__name(opts=>{let engine=opts?.renderEngine??"katex";return{name:"Latex",markdownPlugins(){return[remarkMath]},htmlPlugins(){return engine==="katex"?[[rehypeKatex,{output:"html"}]]:[rehypeMathjax]},externalResources(){return engine==="katex"?{css:["https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"],js:[{src:"https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/copy-tex.min.js",loadTime:"afterDOMReady",contentType:"external"}]}:{}}}},"Latex");import{toString}from"hast-util-to-string";var escapeHTML=__name(unsafe=>unsafe.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),"escapeHTML");var defaultOptions4={descriptionLength:150},Description=__name(userOpts=>{let opts={...defaultOptions4,...userOpts};return{name:"Description",htmlPlugins(){return[()=>async(tree,file)=>{let frontMatterDescription=file.data.frontmatter?.description,text=escapeHTML(toString(tree)),sentences=(frontMatterDescription??text).replace(/\s+/g," ").split("."),finalDesc="",sentenceIdx=0,len=opts.descriptionLength;for(;finalDesc.length<len;){let sentence=sentences[sentenceIdx];if(!sentence)break;finalDesc+=sentence+".",sentenceIdx++}file.data.description=finalDesc,file.data.text=text}]}}},"Description");import path3 from"path";import{visit}from"unist-util-visit";import isAbsoluteUrl from"is-absolute-url";var defaultOptions5={markdownLinkResolution:"absolute",prettyLinks:!0,openLinksInNewTab:!1,lazyLoad:!1,externalLinkIcon:!0},CrawlLinks=__name(userOpts=>{let opts={...defaultOptions5,...userOpts};return{name:"LinkProcessing",htmlPlugins(ctx){return[()=>(tree,file)=>{let curSlug=simplifySlug(file.data.slug),outgoing=new Set,transformOptions={strategy:opts.markdownLinkResolution,allSlugs:ctx.allSlugs};visit(tree,"element",(node,_index,_parent)=>{if(node.tagName==="a"&&node.properties&&typeof node.properties.href=="string"){let dest=node.properties.href,classes=node.properties.className??[],isExternal=isAbsoluteUrl(dest);classes.push(isExternal?"external":"internal"),isExternal&&opts.externalLinkIcon&&node.children.push({type:"element",tagName:"svg",properties:{class:"external-icon",viewBox:"0 0 512 512"},children:[{type:"element",tagName:"path",properties:{d:"M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z"},children:[]}]}),node.children.length===1&&node.children[0].type==="text"&&node.children[0].value!==dest&&classes.push("alias"),node.properties.className=classes,opts.openLinksInNewTab&&(node.properties.target="_blank");let isInternal=!(isAbsoluteUrl(dest)||dest.startsWith("#"));if(isInternal){dest=node.properties.href=transformLink(file.data.slug,dest,transformOptions);let canonicalDest=new URL(dest,`https://base.com/${curSlug}`).pathname,[destCanonical,_destAnchor]=splitAnchor(canonicalDest);destCanonical.endsWith("/")&&(destCanonical+="index");let full=decodeURIComponent(_stripSlashes(destCanonical,!0)),simple=simplifySlug(full);outgoing.add(simple),node.properties["data-slug"]=full}opts.prettyLinks&&isInternal&&node.children.length===1&&node.children[0].type==="text"&&!node.children[0].value.startsWith("#")&&(node.children[0].value=path3.basename(node.children[0].value))}if(["img","video","audio","iframe"].includes(node.tagName)&&node.properties&&typeof node.properties.src=="string"&&(opts.lazyLoad&&(node.properties.loading="lazy"),!isAbsoluteUrl(node.properties.src))){let dest=node.properties.src;dest=node.properties.src=transformLink(file.data.slug,dest,transformOptions),node.properties.src=dest}}),file.data.links=[...outgoing]}]}}},"CrawlLinks");import{findAndReplace as mdastFindReplace}from"mdast-util-find-and-replace";import{slug as slugAnchor2}from"github-slugger";import rehypeRaw from"rehype-raw";import{SKIP,visit as visit2}from"unist-util-visit";import path4 from"path";var callout_inline_default=`// quartz/components/scripts/quartz/components/scripts/callout.inline.ts
function toggleCallout() {
  const outerBlock = this.parentElement;
  outerBlock.classList.toggle(\`is-collapsed\`);
  const collapsed = outerBlock.classList.contains(\`is-collapsed\`);
  const height = collapsed ? this.scrollHeight : outerBlock.scrollHeight;
  outerBlock.style.maxHeight = height + \`px\`;
  let current = outerBlock;
  let parent = outerBlock.parentElement;
  while (parent) {
    if (!parent.classList.contains(\`callout\`)) {
      return;
    }
    const collapsed2 = parent.classList.contains(\`is-collapsed\`);
    const height2 = collapsed2 ? parent.scrollHeight : parent.scrollHeight + current.scrollHeight;
    parent.style.maxHeight = height2 + \`px\`;
    current = parent;
    parent = parent.parentElement;
  }
}
function setupCallout() {
  const collapsible = document.getElementsByClassName(
    \`callout is-collapsible\`
  );
  for (const div of collapsible) {
    const title = div.firstElementChild;
    if (title) {
      title.removeEventListener(\`click\`, toggleCallout);
      title.addEventListener(\`click\`, toggleCallout);
      const collapsed = div.classList.contains(\`is-collapsed\`);
      const height = collapsed ? title.scrollHeight : div.scrollHeight;
      div.style.maxHeight = height + \`px\`;
    }
  }
}
document.addEventListener(\`nav\`, setupCallout);
window.addEventListener(\`resize\`, setupCallout);
`;import{toHast}from"mdast-util-to-hast";import{toHtml}from"hast-util-to-html";function pluralize(count,s){return count===1?`1 ${s}`:`${count} ${s}s`}__name(pluralize,"pluralize");function capitalize(s){return s.substring(0,1).toUpperCase()+s.substring(1)}__name(capitalize,"capitalize");var defaultOptions6={comments:!0,highlight:!0,wikilinks:!0,callouts:!0,mermaid:!0,parseTags:!0,parseArrows:!0,parseBlockReferences:!0,enableInHtmlEmbed:!1,enableYouTubeEmbed:!0,enableVideoEmbed:!0},icons={infoIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',pencilIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>',clipboardListIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>',checkCircleIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',flameIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',checkIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',helpCircleIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',alertTriangleIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',xIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',zapIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',bugIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>',listIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',quoteIcon:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>'},callouts={note:icons.pencilIcon,abstract:icons.clipboardListIcon,info:icons.infoIcon,todo:icons.checkCircleIcon,tip:icons.flameIcon,success:icons.checkIcon,question:icons.helpCircleIcon,warning:icons.alertTriangleIcon,failure:icons.xIcon,danger:icons.zapIcon,bug:icons.bugIcon,example:icons.listIcon,quote:icons.quoteIcon},calloutMapping={note:"note",abstract:"abstract",summary:"abstract",tldr:"abstract",info:"info",todo:"todo",tip:"tip",hint:"tip",important:"tip",success:"success",check:"success",done:"success",question:"question",help:"question",faq:"question",warning:"warning",attention:"warning",caution:"warning",failure:"failure",missing:"failure",fail:"failure",danger:"danger",error:"danger",bug:"bug",example:"example",quote:"quote",cite:"quote"};function canonicalizeCallout(calloutName){let callout=calloutName.toLowerCase();return calloutMapping[callout]??calloutName}__name(canonicalizeCallout,"canonicalizeCallout");var externalLinkRegex=/^https?:\/\//i,arrowRegex=new RegExp(/-{1,2}>/,"g"),wikilinkRegex=new RegExp(/!?\[\[([^\[\]\|\#]+)?(#+[^\[\]\|\#]+)?(\|[^\[\]\|\#]+)?\]\]/,"g"),highlightRegex=new RegExp(/==([^=]+)==/,"g"),commentRegex=new RegExp(/%%[\s\S]*?%%/,"g"),calloutRegex=new RegExp(/^\[\!(\w+)\]([+-]?)/),calloutLineRegex=new RegExp(/^> *\[\!\w+\][+-]?.*$/,"gm"),tagRegex=new RegExp(/(?:^| )#((?:[-_\p{L}\p{Emoji}\d])+(?:\/[-_\p{L}\p{Emoji}\d]+)*)/,"gu"),blockReferenceRegex=new RegExp(/\^([-_A-Za-z0-9]+)$/,"g"),ytLinkRegex=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,videoExtensionRegex=new RegExp(/\.(mp4|webm|ogg|avi|mov|flv|wmv|mkv|mpg|mpeg|3gp|m4v)$/),ObsidianFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions6,...userOpts},mdastToHtml=__name(ast=>{let hast=toHast(ast,{allowDangerousHtml:!0});return toHtml(hast,{allowDangerousHtml:!0})},"mdastToHtml");return{name:"ObsidianFlavoredMarkdown",textTransform(_ctx,src){return opts.comments&&(src instanceof Buffer&&(src=src.toString()),src=src.replace(commentRegex,"")),opts.callouts&&(src instanceof Buffer&&(src=src.toString()),src=src.replace(calloutLineRegex,value=>value+`
> `)),opts.wikilinks&&(src instanceof Buffer&&(src=src.toString()),src=src.replace(wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp??"",anchor=rawHeader?.trim().replace(/^#+/,""),blockRef=anchor?.startsWith("^")?"^":"",displayAnchor=anchor?`#${blockRef}${slugAnchor2(anchor)}`:"",displayAlias=rawAlias??rawHeader?.replace("#","|")??"",embedDisplay=value.startsWith("!")?"!":"";return rawFp?.match(externalLinkRegex)?`${embedDisplay}[${displayAlias.replace(/^\|/,"")}](${rawFp})`:`${embedDisplay}[[${fp}${displayAnchor}${displayAlias}]]`})),src},markdownPlugins(){let plugins=[];return plugins.push(()=>(tree,file)=>{let replacements=[],base=pathToRoot(file.data.slug);opts.wikilinks&&replacements.push([wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp?.trim()??"",anchor=rawHeader?.trim()??"",alias=rawAlias?.slice(1).trim();if(value.startsWith("!")){let ext=path4.extname(fp).toLowerCase(),url2=slugifyFilePath(fp);if([".png",".jpg",".jpeg",".gif",".bmp",".svg",".webp"].includes(ext)){let dims=alias??"",[width,height]=dims.split("x",2);return width||="auto",height||="auto",{type:"image",url:url2,data:{hProperties:{width,height}}}}else{if([".mp4",".webm",".ogv",".mov",".mkv"].includes(ext))return{type:"html",value:`<video src="${url2}" controls></video>`};if([".mp3",".webm",".wav",".m4a",".ogg",".3gp",".flac"].includes(ext))return{type:"html",value:`<audio src="${url2}" controls></audio>`};if([".pdf"].includes(ext))return{type:"html",value:`<iframe src="${url2}"></iframe>`};{let block=anchor;return{type:"html",data:{hProperties:{transclude:!0}},value:`<blockquote class="transclude" data-url="${url2}" data-block="${block}"><a href="${url2+anchor}" class="transclude-inner">Transclude of ${url2}${block}</a></blockquote>`}}}}return{type:"link",url:fp+anchor,children:[{type:"text",value:alias??fp}]}}]),opts.highlight&&replacements.push([highlightRegex,(_value,...capture)=>{let[inner]=capture;return{type:"html",value:`<span class="text-highlight">${inner}</span>`}}]),opts.parseArrows&&replacements.push([arrowRegex,(_value,..._capture)=>({type:"html",value:"<span>&rarr;</span>"})]),opts.parseTags&&replacements.push([tagRegex,(_value,tag)=>/^\d+$/.test(tag)?!1:(tag=slugTag(tag),file.data.frontmatter&&!file.data.frontmatter.tags.includes(tag)&&file.data.frontmatter.tags.push(tag),{type:"link",url:base+`/tags/${tag}`,data:{hProperties:{className:["tag-link"]}},children:[{type:"text",value:`#${tag}`}]})]),opts.enableInHtmlEmbed&&visit2(tree,"html",node=>{for(let[regex,replace]of replacements)typeof replace=="string"?node.value=node.value.replace(regex,replace):node.value=node.value.replace(regex,(substring,...args)=>{let replaceValue=replace(substring,...args);return typeof replaceValue=="string"?replaceValue:Array.isArray(replaceValue)?replaceValue.map(mdastToHtml).join(""):typeof replaceValue=="object"&&replaceValue!==null?mdastToHtml(replaceValue):substring})}),mdastFindReplace(tree,replacements)}),opts.enableVideoEmbed&&plugins.push(()=>(tree,_file)=>{visit2(tree,"image",(node,index,parent)=>{if(parent&&index!=null&&videoExtensionRegex.test(node.url)){let newNode={type:"html",value:`<video controls src="${node.url}"></video>`};return parent.children.splice(index,1,newNode),SKIP}})}),opts.callouts&&plugins.push(()=>(tree,_file)=>{visit2(tree,"blockquote",node=>{if(node.children.length===0)return;let firstChild=node.children[0];if(firstChild.type!=="paragraph"||firstChild.children[0]?.type!=="text")return;let text=firstChild.children[0].value,restOfTitle=firstChild.children.slice(1),[firstLine,...remainingLines]=text.split(`
`),remainingText=remainingLines.join(`
`),match=firstLine.match(calloutRegex);if(match&&match.input){let[calloutDirective,typeString,collapseChar]=match,calloutType=canonicalizeCallout(typeString.toLowerCase()),collapse=collapseChar==="+"||collapseChar==="-",defaultState=collapseChar==="-"?"collapsed":"expanded",titleContent=match.input.slice(calloutDirective.length).trim()||capitalize(calloutType),titleNode={type:"paragraph",children:restOfTitle.length===0?[{type:"text",value:titleContent+" "}]:restOfTitle},title=mdastToHtml(titleNode),toggleIcon=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fold">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>`,blockquoteContent=[{type:"html",value:`<div
                  class="callout-title"
                >
                  <div class="callout-icon">${callouts[calloutType]??callouts.note}</div> 
                  <div class="callout-title-inner">${title}</div>
                  ${collapse?toggleIcon:""}
                </div>`}];remainingText.length>0&&blockquoteContent.push({type:"paragraph",children:[{type:"text",value:remainingText}]}),node.children.splice(0,1,...blockquoteContent),node.data={hProperties:{...node.data?.hProperties??{},className:`callout ${calloutType} ${collapse?"is-collapsible":""} ${defaultState==="collapsed"?"is-collapsed":""}`,"data-callout":calloutType,"data-callout-fold":collapse}}}})}),opts.mermaid&&plugins.push(()=>(tree,_file)=>{visit2(tree,"code",node=>{node.lang==="mermaid"&&(node.data={hProperties:{className:["mermaid"]}})})}),plugins},htmlPlugins(){let plugins=[rehypeRaw];return opts.parseBlockReferences&&plugins.push(()=>{let inlineTagTypes=new Set(["p","li"]),blockTagTypes=new Set(["blockquote"]);return(tree,file)=>{file.data.blocks={},visit2(tree,"element",(node,index,parent)=>{if(blockTagTypes.has(node.tagName)){let nextChild=parent?.children.at(index+2);if(nextChild&&nextChild.tagName==="p"){let text=nextChild.children.at(0);if(text&&text.value&&text.type==="text"){let matches=text.value.match(blockReferenceRegex);if(matches&&matches.length>=1){parent.children.splice(index+2,1);let block=matches[0].slice(1);Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}else if(inlineTagTypes.has(node.tagName)){let last=node.children.at(-1);if(last&&last.value&&typeof last.value=="string"){let matches=last.value.match(blockReferenceRegex);if(matches&&matches.length>=1){last.value=last.value.slice(0,-matches[0].length);let block=matches[0].slice(1);Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}),file.data.htmlAst=tree}}),opts.enableYouTubeEmbed&&plugins.push(()=>tree=>{visit2(tree,"element",node=>{if(node.tagName==="img"&&typeof node.properties.src=="string"){let match=node.properties.src.match(ytLinkRegex),videoId=match&&match[2].length==11?match[2]:null;videoId&&(node.tagName="iframe",node.properties={class:"external-embed",allow:"fullscreen",frameborder:0,width:"600px",height:"350px",src:`https://www.youtube.com/embed/${videoId}`})}})}),plugins},externalResources(){let js=[];return opts.callouts&&js.push({script:callout_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.mermaid&&js.push({script:`
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';
          const darkMode = document.documentElement.getAttribute('saved-theme') === 'dark'
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: darkMode ? 'dark' : 'default'
          });
          document.addEventListener('nav', async () => {
            await mermaid.run({
              querySelector: '.mermaid'
            })
          });
          `,loadTime:"afterDOMReady",moduleType:"module",contentType:"inline"}),{js}}}},"ObsidianFlavoredMarkdown");var relrefRegex=new RegExp(/\[([^\]]+)\]\(\{\{< relref "([^"]+)" >\}\}\)/,"g"),predefinedHeadingIdRegex=new RegExp(/(.*) {#(?:.*)}/,"g"),hugoShortcodeRegex=new RegExp(/{{(.*)}}/,"g"),figureTagRegex=new RegExp(/< ?figure src="(.*)" ?>/,"g"),inlineLatexRegex=new RegExp(/\\\\\((.+?)\\\\\)/,"g"),blockLatexRegex=new RegExp(/(?:\\begin{equation}|\\\\\(|\\\\\[)([\s\S]*?)(?:\\\\\]|\\\\\)|\\end{equation})/,"g"),quartzLatexRegex=new RegExp(/\$\$[\s\S]*?\$\$|\$.*?\$/,"g");import rehypePrettyCode from"rehype-pretty-code";var SyntaxHighlighting=__name(()=>({name:"SyntaxHighlighting",htmlPlugins(){return[[rehypePrettyCode,{keepBackground:!1,theme:{dark:"github-dark",light:"github-light"}}]]}}),"SyntaxHighlighting");import{visit as visit3}from"unist-util-visit";import{toString as toString2}from"mdast-util-to-string";import Slugger from"github-slugger";var defaultOptions7={maxDepth:3,minEntries:1,showByDefault:!0,collapseByDefault:!1},regexMdLinks=new RegExp(/\[([^\[]+)\](\(.*\))/,"g"),TableOfContents=__name(userOpts=>{let opts={...defaultOptions7,...userOpts};return{name:"TableOfContents",markdownPlugins(){return[()=>async(tree,file)=>{if(file.data.frontmatter?.enableToc??opts.showByDefault){let slugAnchor3=new Slugger,toc=[],highestDepth=opts.maxDepth;visit3(tree,"heading",node=>{if(node.depth<=opts.maxDepth){let text=toString2(node);text=text.replace(wikilinkRegex,(_,rawFp,__,rawAlias)=>{let fp=rawFp?.trim()??"";return rawAlias?.slice(1).trim()??fp}),text=text.replace(regexMdLinks,"$1"),highestDepth=Math.min(highestDepth,node.depth),toc.push({depth:node.depth,text,slug:slugAnchor3.slug(text)})}}),toc.length>opts.minEntries&&(file.data.toc=toc.map(entry=>({...entry,depth:entry.depth-highestDepth})),file.data.collapseToc=opts.collapseByDefault)}}]}}},"TableOfContents");import remarkBreaks from"remark-breaks";var RemoveDrafts=__name(()=>({name:"RemoveDrafts",shouldPublish(_ctx,[_tree,vfile]){return!(vfile.data?.frontmatter?.draft??!1)}}),"RemoveDrafts");import{jsx}from"preact/jsx-runtime";function Header({children}){return children.length>0?jsx("header",{children}):null}__name(Header,"Header");Header.css=`
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`;var Header_default=__name(()=>Header,"default");var clipboard_inline_default=`// quartz/components/scripts/quartz/components/scripts/clipboard.inline.ts
var svgCopy = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>';
var svgCheck = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';
document.addEventListener("nav", () => {
  const els = document.getElementsByTagName("pre");
  for (let i = 0; i < els.length; i++) {
    const codeBlock = els[i].getElementsByTagName("code")[0];
    if (codeBlock) {
      const source = codeBlock.innerText.replace(/\\n\\n/g, "\\n");
      const button = document.createElement("button");
      button.className = "clipboard-button";
      button.type = "button";
      button.innerHTML = svgCopy;
      button.ariaLabel = "Copy source";
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(source).then(
          () => {
            button.blur();
            button.innerHTML = svgCheck;
            setTimeout(() => {
              button.innerHTML = svgCopy;
              button.style.borderColor = "";
            }, 2e3);
          },
          (error) => console.error(error)
        );
      });
      els[i].prepend(button);
    }
  }
});
`;var clipboard_default=`.clipboard-button {
  position: absolute;
  display: flex;
  float: right;
  right: 0;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.clipboard-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.clipboard-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.clipboard-button:focus {
  outline: 0;
}

pre:hover > .clipboard-button {
  opacity: 1;
  transition: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImNsaXBib2FyZC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOzs7QUFLRjtFQUNFO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIuY2xpcGJvYXJkLWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxvYXQ6IHJpZ2h0O1xuICByaWdodDogMDtcbiAgcGFkZGluZzogMC40cmVtO1xuICBtYXJnaW46IDAuM3JlbTtcbiAgY29sb3I6IHZhcigtLWdyYXkpO1xuICBib3JkZXItY29sb3I6IHZhcigtLWRhcmspO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIGJvcmRlcjogMXB4IHNvbGlkO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IDAuMnM7XG5cbiAgJiA+IHN2ZyB7XG4gICAgZmlsbDogdmFyKC0tbGlnaHQpO1xuICAgIGZpbHRlcjogY29udHJhc3QoMC4zKTtcbiAgfVxuXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gIH1cblxuICAmOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG59XG5cbnByZSB7XG4gICY6aG92ZXIgPiAuY2xpcGJvYXJkLWJ1dHRvbiB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2l0aW9uOiAwLjJzO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx2}from"preact/jsx-runtime";function Body({children}){return jsx2("div",{id:"quartz-body",children})}__name(Body,"Body");Body.afterDOMLoaded=clipboard_inline_default;Body.css=clipboard_default;var Body_default=__name(()=>Body,"default");import{render}from"preact-render-to-string";import{randomUUID}from"crypto";import{jsx as jsx3}from"preact/jsx-runtime";function JSResourceToScriptElement(resource,preserve){let scriptType=resource.moduleType??"application/javascript",spaPreserve=preserve??resource.spaPreserve;if(resource.contentType==="external")return jsx3("script",{src:resource.src,type:scriptType,"spa-preserve":spaPreserve},resource.src);{let content=resource.script;return jsx3("script",{type:scriptType,"spa-preserve":spaPreserve,dangerouslySetInnerHTML:{__html:content}},randomUUID())}}__name(JSResourceToScriptElement,"JSResourceToScriptElement");import{visit as visit4}from"unist-util-visit";import{jsx as jsx4,jsxs}from"preact/jsx-runtime";function pageResources(baseDir,staticResources){let contentIndexScript=`const fetchData = fetch("${joinSegments(baseDir,"static/contentIndex.json")}").then(data => data.json())`;return{css:[joinSegments(baseDir,"index.css"),...staticResources.css],js:[{src:joinSegments(baseDir,"prescript.js"),loadTime:"beforeDOMReady",contentType:"external"},{loadTime:"beforeDOMReady",contentType:"inline",spaPreserve:!0,script:contentIndexScript},...staticResources.js,{src:joinSegments(baseDir,"postscript.js"),loadTime:"afterDOMReady",moduleType:"module",contentType:"external"}]}}__name(pageResources,"pageResources");var pageIndex;function getOrComputeFileIndex(allFiles){if(!pageIndex){pageIndex=new Map;for(let file of allFiles)pageIndex.set(file.slug,file)}return pageIndex}__name(getOrComputeFileIndex,"getOrComputeFileIndex");function renderPage(slug,componentData,components,pageResources2){visit4(componentData.tree,"element",(node,_index,_parent)=>{if(node.tagName==="blockquote"&&(node.properties?.className??[]).includes("transclude")){let inner=node.children[0],transcludeTarget=inner.properties["data-slug"],page=getOrComputeFileIndex(componentData.allFiles).get(transcludeTarget);if(!page)return;let blockRef=node.properties.dataBlock;if(blockRef?.startsWith("#^")){blockRef=blockRef.slice(2);let blockNode=page.blocks?.[blockRef];blockNode&&(blockNode.tagName==="li"&&(blockNode={type:"element",tagName:"ul",properties:{},children:[blockNode]}),node.children=[normalizeHastElement(blockNode,slug,transcludeTarget),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal"]},children:[{type:"text",value:"Link to original"}]}])}else if(blockRef?.startsWith("#")&&page.htmlAst){blockRef=blockRef.slice(1);let startIdx,endIdx;for(let[i,el]of page.htmlAst.children.entries())if(el.type==="element"&&el.tagName.match(/h[1-6]/)){if(endIdx)break;startIdx!==void 0?endIdx=i:el.properties?.id===blockRef&&(startIdx=i)}if(startIdx===void 0)return;node.children=[...page.htmlAst.children.slice(startIdx,endIdx).map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal"]},children:[{type:"text",value:"Link to original"}]}]}else page.htmlAst&&(node.children=[{type:"element",tagName:"h1",properties:{},children:[{type:"text",value:page.frontmatter?.title??`Transclude of ${page.slug}`}]},...page.htmlAst.children.map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal"]},children:[{type:"text",value:"Link to original"}]}])}});let{head:Head,header,beforeBody,pageBody:Content2,left,right,footer:Footer}=components,Header2=Header_default(),Body2=Body_default(),LeftComponent=jsx4("div",{class:"left sidebar",children:left.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),RightComponent=jsx4("div",{class:"right sidebar",children:right.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),doc=jsxs("html",{children:[jsx4(Head,{...componentData}),jsx4("body",{"data-slug":slug,children:jsxs("div",{id:"quartz-root",class:"page",children:[jsxs(Body2,{...componentData,children:[LeftComponent,jsxs("div",{class:"center",children:[jsxs("div",{class:"page-header",children:[jsx4(Header2,{...componentData,children:header.map(HeaderComponent=>jsx4(HeaderComponent,{...componentData}))}),jsx4("div",{class:"popover-hint",children:beforeBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),jsx4(Content2,{...componentData})]}),RightComponent]}),jsx4(Footer,{...componentData})]})}),pageResources2.js.filter(resource=>resource.loadTime==="afterDOMReady").map(res=>JSResourceToScriptElement(res))]});return`<!DOCTYPE html>
`+render(doc)}__name(renderPage,"renderPage");import{toJsxRuntime}from"hast-util-to-jsx-runtime";import{Fragment,jsx as jsx5,jsxs as jsxs2}from"preact/jsx-runtime";import{jsx as jsx6}from"preact/jsx-runtime";var customComponents={table:props=>jsx6("div",{class:"table-container",children:jsx6("table",{...props})})};function htmlToJsx(fp,tree){try{return toJsxRuntime(tree,{Fragment,jsx:jsx5,jsxs:jsxs2,elementAttributeNameCase:"html",components:customComponents})}catch(e){trace(`Failed to parse Markdown in \`${fp}\` into JSX`,e)}}__name(htmlToJsx,"htmlToJsx");import{jsx as jsx7}from"preact/jsx-runtime";function Content({fileData,tree}){let content=htmlToJsx(fileData.filePath,tree);return jsx7("article",{class:"popover-hint",children:content})}__name(Content,"Content");var Content_default=__name(()=>Content,"default");var listPage_default=`ul.section-ul {
  list-style: none;
  margin-top: 2em;
  padding-left: 0;
}

li.section-li {
  margin-bottom: 1em;
}
li.section-li > .section {
  display: grid;
  grid-template-columns: 6em 3fr 1fr;
}
@media all and (max-width: 600px) {
  li.section-li > .section > .tags {
    display: none;
  }
}
li.section-li > .section > .desc > h3 > a {
  background-color: transparent;
}
li.section-li > .section > .meta {
  margin: 0;
  flex-basis: 6em;
  opacity: 0.6;
}

.popover .section {
  grid-template-columns: 6em 1fr !important;
}
.popover .section > .tags {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImxpc3RQYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7O0FBRUE7RUFDRTtFQUNBOztBQUVBO0VBQ0U7SUFDRTs7O0FBSUo7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBTU47RUFDRTs7QUFDQTtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5cbnVsLnNlY3Rpb24tdWwge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBtYXJnaW4tdG9wOiAyZW07XG4gIHBhZGRpbmctbGVmdDogMDtcbn1cblxubGkuc2VjdGlvbi1saSB7XG4gIG1hcmdpbi1ib3R0b206IDFlbTtcblxuICAmID4gLnNlY3Rpb24ge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA2ZW0gM2ZyIDFmcjtcblxuICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRtb2JpbGVCcmVha3BvaW50KSB7XG4gICAgICAmID4gLnRhZ3Mge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgPiAuZGVzYyA+IGgzID4gYSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICB9XG5cbiAgICAmID4gLm1ldGEge1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgZmxleC1iYXNpczogNmVtO1xuICAgICAgb3BhY2l0eTogMC42O1xuICAgIH1cbiAgfVxufVxuXG4vLyBtb2RpZmljYXRpb25zIGluIHBvcG92ZXIgY29udGV4dFxuLnBvcG92ZXIgLnNlY3Rpb24ge1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDZlbSAxZnIgIWltcG9ydGFudDtcbiAgJiA+IC50YWdzIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4iXX0= */`;import{Fragment as Fragment2,jsx as jsx8}from"preact/jsx-runtime";function getDate(cfg,data){if(!cfg.defaultDateType)throw new Error("Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.");return data.dates?.[cfg.defaultDateType]}__name(getDate,"getDate");function formatDate(d){return d.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"2-digit"})}__name(formatDate,"formatDate");function Date2({date}){return jsx8(Fragment2,{children:formatDate(date)})}__name(Date2,"Date");import{jsx as jsx9,jsxs as jsxs3}from"preact/jsx-runtime";function byDateAndAlphabetical(cfg){return(f1,f2)=>{if(f1.dates&&f2.dates)return getDate(cfg,f2).getTime()-getDate(cfg,f1).getTime();if(f1.dates&&!f2.dates)return-1;if(!f1.dates&&f2.dates)return 1;let f1Title=f1.frontmatter?.title.toLowerCase()??"",f2Title=f2.frontmatter?.title.toLowerCase()??"";return f1Title.localeCompare(f2Title)}}__name(byDateAndAlphabetical,"byDateAndAlphabetical");function PageList({cfg,fileData,allFiles,limit}){let list=allFiles.sort(byDateAndAlphabetical(cfg));return limit&&(list=list.slice(0,limit)),jsx9("ul",{class:"section-ul",children:list.map(page=>{let title=page.frontmatter?.title,tags=page.frontmatter?.tags??[];return jsx9("li",{class:"section-li",children:jsxs3("div",{class:"section",children:[page.dates&&jsx9("p",{class:"meta",children:jsx9(Date2,{date:getDate(cfg,page)})}),jsx9("div",{class:"desc",children:jsx9("h3",{children:jsx9("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),jsx9("ul",{class:"tags",children:tags.map(tag=>jsx9("li",{children:jsxs3("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:["#",tag]})}))})]})})})})}__name(PageList,"PageList");PageList.css=`
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;import{jsx as jsx10,jsxs as jsxs4}from"preact/jsx-runtime";var numPages=10;function TagContent(props){let{tree,fileData,allFiles}=props,slug=fileData.slug;if(!(slug?.startsWith("tags/")||slug==="tags"))throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`);let tag=simplifySlug(slug.slice(5)),allPagesWithTag=__name(tag2=>allFiles.filter(file=>(file.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).includes(tag2)),"allPagesWithTag"),content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree);if(tag==="/"){let tags=[...new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes))].sort((a,b)=>a.localeCompare(b)),tagItemMap=new Map;for(let tag2 of tags)tagItemMap.set(tag2,allPagesWithTag(tag2));return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{children:jsx10("p",{children:content})}),jsxs4("p",{children:["Found ",tags.length," total tags."]}),jsx10("div",{children:tags.map(tag2=>{let pages=tagItemMap.get(tag2),listProps={...props,allFiles:pages},content2=allFiles.filter(file=>file.slug===`tags/${tag2}`)[0]?.description;return jsxs4("div",{children:[jsx10("h2",{children:jsxs4("a",{class:"internal tag-link",href:`../tags/${tag2}`,children:["#",tag2]})}),content2&&jsx10("p",{children:content2}),jsxs4("p",{children:[pluralize(pages.length,"item")," with this tag."," ",pages.length>numPages&&`Showing first ${numPages}.`]}),jsx10(PageList,{limit:numPages,...listProps})]})})})]})}else{let pages=allPagesWithTag(tag),listProps={...props,allFiles:pages};return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{children:content}),jsxs4("p",{children:[pluralize(pages.length,"item")," with this tag."]}),jsx10("div",{children:jsx10(PageList,{...listProps})})]})}}__name(TagContent,"TagContent");TagContent.css=listPage_default+PageList.css;var TagContent_default=__name(()=>TagContent,"default");import path5 from"path";import{jsx as jsx11,jsxs as jsxs5}from"preact/jsx-runtime";function FolderContent(props){let{tree,fileData,allFiles}=props,folderSlug=_stripSlashes(simplifySlug(fileData.slug)),allPagesInFolder=allFiles.filter(file=>{let fileSlug=_stripSlashes(simplifySlug(file.slug)),prefixed=fileSlug.startsWith(folderSlug)&&fileSlug!==folderSlug,folderParts=folderSlug.split(path5.posix.sep),isDirectChild=fileSlug.split(path5.posix.sep).length===folderParts.length+1;return prefixed&&isDirectChild}),listProps={...props,allFiles:allPagesInFolder},content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree);return jsxs5("div",{class:"popover-hint",children:[jsx11("article",{children:jsx11("p",{children:content})}),jsxs5("p",{children:[pluralize(allPagesInFolder.length,"item")," under this folder."]}),jsx11("div",{children:jsx11(PageList,{...listProps})})]})}__name(FolderContent,"FolderContent");FolderContent.css=listPage_default+PageList.css;var FolderContent_default=__name(()=>FolderContent,"default");import{jsx as jsx12,jsxs as jsxs6}from"preact/jsx-runtime";function NotFound(){return jsxs6("article",{class:"popover-hint",children:[jsx12("h1",{children:"404"}),jsx12("p",{children:"Either this page is private or doesn't exist."})]})}__name(NotFound,"NotFound");var __default=__name(()=>NotFound,"default");import{jsx as jsx13}from"preact/jsx-runtime";function ArticleTitle({fileData,displayClass}){let title=fileData.frontmatter?.title;return title?jsx13("h1",{class:`article-title ${displayClass??""}`,children:title}):null}__name(ArticleTitle,"ArticleTitle");ArticleTitle.css=`
.article-title {
  margin: 2rem 0 0 0;
}
`;var ArticleTitle_default=__name(()=>ArticleTitle,"default");var darkmode_inline_default=`// quartz/components/scripts/quartz/components/scripts/darkmode.inline.ts
var userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
var currentTheme = localStorage.getItem("theme") ?? userPref;
document.documentElement.setAttribute("saved-theme", currentTheme);
var emitThemeChangeEvent = (theme) => {
  const event = new CustomEvent("themechange", {
    detail: { theme }
  });
  document.dispatchEvent(event);
};
document.addEventListener("nav", () => {
  const switchTheme = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    document.documentElement.setAttribute("saved-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    emitThemeChangeEvent(newTheme);
  };
  const toggleSwitch = document.querySelector("#darkmode-toggle");
  toggleSwitch.removeEventListener("change", switchTheme);
  toggleSwitch.addEventListener("change", switchTheme);
  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  colorSchemeMediaQuery.addEventListener("change", (e) => {
    const newTheme = e.matches ? "dark" : "light";
    document.documentElement.setAttribute("saved-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    toggleSwitch.checked = e.matches;
    emitThemeChangeEvent(newTheme);
  });
});
`;var darkmode_default=`.darkmode {
  position: relative;
  width: 20px;
  height: 20px;
  margin: 0 10px;
}
.darkmode > .toggle {
  display: none;
  box-sizing: border-box;
}
.darkmode svg {
  cursor: pointer;
  opacity: 0;
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[saved-theme=dark] {
  color-scheme: dark;
}

:root[saved-theme=light] {
  color-scheme: light;
}

:root[saved-theme=dark] .toggle ~ label > #dayIcon {
  opacity: 0;
}
:root[saved-theme=dark] .toggle ~ label > #nightIcon {
  opacity: 1;
}

:root .toggle ~ label > #dayIcon {
  opacity: 1;
}
:root .toggle ~ label > #nightIcon {
  opacity: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImRhcmttb2RlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFJSjtFQUNFOzs7QUFHRjtFQUNFOzs7QUFJQTtFQUNFOztBQUVGO0VBQ0U7OztBQUtGO0VBQ0U7O0FBRUY7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbIi5kYXJrbW9kZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDIwcHg7XG4gIGhlaWdodDogMjBweDtcbiAgbWFyZ2luOiAwIDEwcHg7XG5cbiAgJiA+IC50b2dnbGUge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuXG4gICYgc3ZnIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgb3BhY2l0eTogMDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIHRvcDogY2FsYyg1MCUgLSAxMHB4KTtcbiAgICBmaWxsOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjFzIGVhc2U7XG4gIH1cbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIHtcbiAgY29sb3Itc2NoZW1lOiBkYXJrO1xufVxuXG46cm9vdFtzYXZlZC10aGVtZT1cImxpZ2h0XCJdIHtcbiAgY29sb3Itc2NoZW1lOiBsaWdodDtcbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIC50b2dnbGUgfiBsYWJlbCB7XG4gICYgPiAjZGF5SWNvbiB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICAmID4gI25pZ2h0SWNvbiB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuXG46cm9vdCAudG9nZ2xlIH4gbGFiZWwge1xuICAmID4gI2RheUljb24ge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgJiA+ICNuaWdodEljb24ge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbn1cbiJdfQ== */`;import{jsx as jsx14,jsxs as jsxs7}from"preact/jsx-runtime";function Darkmode({displayClass}){return jsxs7("div",{class:`darkmode ${displayClass??""}`,children:[jsx14("input",{class:"toggle",id:"darkmode-toggle",type:"checkbox",tabIndex:-1}),jsx14("label",{id:"toggle-label-light",for:"darkmode-toggle",tabIndex:-1,children:jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",id:"dayIcon",x:"0px",y:"0px",viewBox:"0 0 35 35",style:"enable-background:new 0 0 35 35",xmlSpace:"preserve",children:[jsx14("title",{children:"Light mode"}),jsx14("path",{d:"M6,17.5C6,16.672,5.328,16,4.5,16h-3C0.672,16,0,16.672,0,17.5    S0.672,19,1.5,19h3C5.328,19,6,18.328,6,17.5z M7.5,26c-0.414,0-0.789,0.168-1.061,0.439l-2,2C4.168,28.711,4,29.086,4,29.5    C4,30.328,4.671,31,5.5,31c0.414,0,0.789-0.168,1.06-0.44l2-2C8.832,28.289,9,27.914,9,27.5C9,26.672,8.329,26,7.5,26z M17.5,6    C18.329,6,19,5.328,19,4.5v-3C19,0.672,18.329,0,17.5,0S16,0.672,16,1.5v3C16,5.328,16.671,6,17.5,6z M27.5,9    c0.414,0,0.789-0.168,1.06-0.439l2-2C30.832,6.289,31,5.914,31,5.5C31,4.672,30.329,4,29.5,4c-0.414,0-0.789,0.168-1.061,0.44    l-2,2C26.168,6.711,26,7.086,26,7.5C26,8.328,26.671,9,27.5,9z M6.439,8.561C6.711,8.832,7.086,9,7.5,9C8.328,9,9,8.328,9,7.5    c0-0.414-0.168-0.789-0.439-1.061l-2-2C6.289,4.168,5.914,4,5.5,4C4.672,4,4,4.672,4,5.5c0,0.414,0.168,0.789,0.439,1.06    L6.439,8.561z M33.5,16h-3c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5h3c0.828,0,1.5-0.672,1.5-1.5S34.328,16,33.5,16z     M28.561,26.439C28.289,26.168,27.914,26,27.5,26c-0.828,0-1.5,0.672-1.5,1.5c0,0.414,0.168,0.789,0.439,1.06l2,2    C28.711,30.832,29.086,31,29.5,31c0.828,0,1.5-0.672,1.5-1.5c0-0.414-0.168-0.789-0.439-1.061L28.561,26.439z M17.5,29    c-0.829,0-1.5,0.672-1.5,1.5v3c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-3C19,29.672,18.329,29,17.5,29z M17.5,7    C11.71,7,7,11.71,7,17.5S11.71,28,17.5,28S28,23.29,28,17.5S23.29,7,17.5,7z M17.5,25c-4.136,0-7.5-3.364-7.5-7.5    c0-4.136,3.364-7.5,7.5-7.5c4.136,0,7.5,3.364,7.5,7.5C25,21.636,21.636,25,17.5,25z"})]})}),jsx14("label",{id:"toggle-label-dark",for:"darkmode-toggle",tabIndex:-1,children:jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",id:"nightIcon",x:"0px",y:"0px",viewBox:"0 0 100 100",style:"enable-background:new 0 0 100 100",xmlSpace:"preserve",children:[jsx14("title",{children:"Dark mode"}),jsx14("path",{d:"M96.76,66.458c-0.853-0.852-2.15-1.064-3.23-0.534c-6.063,2.991-12.858,4.571-19.655,4.571  C62.022,70.495,50.88,65.88,42.5,57.5C29.043,44.043,25.658,23.536,34.076,6.47c0.532-1.08,0.318-2.379-0.534-3.23  c-0.851-0.852-2.15-1.064-3.23-0.534c-4.918,2.427-9.375,5.619-13.246,9.491c-9.447,9.447-14.65,22.008-14.65,35.369  c0,13.36,5.203,25.921,14.65,35.368s22.008,14.65,35.368,14.65c13.361,0,25.921-5.203,35.369-14.65  c3.872-3.871,7.064-8.328,9.491-13.246C97.826,68.608,97.611,67.309,96.76,66.458z"})]})})]})}__name(Darkmode,"Darkmode");Darkmode.beforeDOMLoaded=darkmode_inline_default;Darkmode.css=darkmode_default;var Darkmode_default=__name(()=>Darkmode,"default");import{jsx as jsx15,jsxs as jsxs8}from"preact/jsx-runtime";var Head_default=__name(()=>{function Head({cfg,fileData,externalResources}){let title=fileData.frontmatter?.title??"Untitled",description=fileData.description?.trim()??"No description provided",{css,js}=externalResources,path12=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname,baseDir=fileData.slug==="404"?path12:pathToRoot(fileData.slug),iconPath=joinSegments(baseDir,"static/icon.png"),ogImagePath=`https://${cfg.baseUrl}/static/og-image.png`;return jsxs8("head",{children:[jsx15("title",{children:title}),jsx15("meta",{charSet:"utf-8"}),jsx15("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),jsx15("meta",{property:"og:title",content:title}),jsx15("meta",{property:"og:description",content:description}),cfg.baseUrl&&jsx15("meta",{property:"og:image",content:ogImagePath}),jsx15("meta",{property:"og:width",content:"1200"}),jsx15("meta",{property:"og:height",content:"675"}),jsx15("link",{rel:"icon",href:iconPath}),jsx15("meta",{name:"description",content:description}),jsx15("meta",{name:"generator",content:"Quartz"}),jsx15("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),jsx15("link",{rel:"preconnect",href:"https://fonts.gstatic.com"}),css.map(href=>jsx15("link",{href,rel:"stylesheet",type:"text/css","spa-preserve":!0},href)),js.filter(resource=>resource.loadTime==="beforeDOMReady").map(res=>JSResourceToScriptElement(res,!0))]})}return __name(Head,"Head"),Head},"default");import{jsx as jsx16}from"preact/jsx-runtime";function PageTitle({fileData,cfg,displayClass}){let title=cfg?.pageTitle??"Untitled Quartz",baseDir=pathToRoot(fileData.slug);return jsx16("h1",{class:`page-title ${displayClass??""}`,children:jsx16("a",{href:baseDir,children:title})})}__name(PageTitle,"PageTitle");PageTitle.css=`
.page-title {
  margin: 0;
}
`;var PageTitle_default=__name(()=>PageTitle,"default");import readingTime from"reading-time";import{jsx as jsx17}from"preact/jsx-runtime";var defaultOptions8={showReadingTime:!0},ContentMeta_default=__name(opts=>{let options2={...defaultOptions8,...opts};function ContentMetadata({cfg,fileData,displayClass}){let text=fileData.text;if(text){let segments=[];if(fileData.dates&&segments.push(formatDate(getDate(cfg,fileData))),options2.showReadingTime){let{text:timeTaken,words:_words}=readingTime(text);segments.push(timeTaken)}return jsx17("p",{class:`content-meta ${displayClass??""}`,children:segments.join(", ")})}else return null}return __name(ContentMetadata,"ContentMetadata"),ContentMetadata.css=`
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `,ContentMetadata},"default");import{jsx as jsx18}from"preact/jsx-runtime";function Spacer({displayClass}){return jsx18("div",{class:`spacer ${displayClass??""}`})}__name(Spacer,"Spacer");var Spacer_default=__name(()=>Spacer,"default");var legacyToc_default=`details#toc summary {
  cursor: pointer;
}
details#toc summary::marker {
  color: var(--dark);
}
details#toc summary > * {
  padding-left: 0.25rem;
  display: inline-block;
  margin: 0;
}
details#toc ul {
  list-style: none;
  margin: 0.5rem 1.25rem;
  padding: 0;
}
details#toc .depth-1 {
  padding-left: calc(1rem * 1);
}
details#toc .depth-2 {
  padding-left: calc(1rem * 2);
}
details#toc .depth-3 {
  padding-left: calc(1rem * 3);
}
details#toc .depth-4 {
  padding-left: calc(1rem * 4);
}
details#toc .depth-5 {
  padding-left: calc(1rem * 5);
}
details#toc .depth-6 {
  padding-left: calc(1rem * 6);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImxlZ2FjeVRvYy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQ0U7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7QUFJQTtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbImRldGFpbHMjdG9jIHtcbiAgJiBzdW1tYXJ5IHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAmOjptYXJrZXIge1xuICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgIH1cblxuICAgICYgPiAqIHtcbiAgICAgIHBhZGRpbmctbGVmdDogMC4yNXJlbTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIG1hcmdpbjogMDtcbiAgICB9XG4gIH1cblxuICAmIHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbjogMC41cmVtIDEuMjVyZW07XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gIEBmb3IgJGkgZnJvbSAxIHRocm91Z2ggNiB7XG4gICAgJiAuZGVwdGgtI3skaX0ge1xuICAgICAgcGFkZGluZy1sZWZ0OiBjYWxjKDFyZW0gKiAjeyRpfSk7XG4gICAgfVxuICB9XG59XG4iXX0= */`;var toc_default=`button#toc {
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}
button#toc h3 {
  font-size: 1rem;
  display: inline-block;
  margin: 0;
}
button#toc .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}
button#toc.collapsed .fold {
  transform: rotateZ(-90deg);
}

#toc-content {
  list-style: none;
  overflow: hidden;
  max-height: none;
  transition: max-height 0.5s ease;
  position: relative;
}
#toc-content.collapsed > .overflow::after {
  opacity: 0;
}
#toc-content ul {
  list-style: none;
  margin: 0.5rem 0;
  padding: 0;
}
#toc-content ul > li > a {
  color: var(--dark);
  opacity: 0.35;
  transition: 0.5s ease opacity, 0.3s ease color;
}
#toc-content ul > li > a.in-view {
  opacity: 0.75;
}
#toc-content .depth-0 {
  padding-left: calc(1rem * 0);
}
#toc-content .depth-1 {
  padding-left: calc(1rem * 1);
}
#toc-content .depth-2 {
  padding-left: calc(1rem * 2);
}
#toc-content .depth-3 {
  padding-left: calc(1rem * 3);
}
#toc-content .depth-4 {
  padding-left: calc(1rem * 4);
}
#toc-content .depth-5 {
  padding-left: calc(1rem * 5);
}
#toc-content .depth-6 {
  padding-left: calc(1rem * 6);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbInRvYy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFDQTtFQUNFO0VBQ0E7RUFDQSxZQUNFOztBQUVGO0VBQ0U7O0FBTUo7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRTs7QUFERjtFQUNFOztBQURGO0VBQ0U7O0FBREY7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbImJ1dHRvbiN0b2Mge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiBub25lO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDA7XG4gIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAmIGgzIHtcbiAgICBmb250LXNpemU6IDFyZW07XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gICYgLmZvbGQge1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTtcbiAgICBvcGFjaXR5OiAwLjg7XG4gIH1cblxuICAmLmNvbGxhcHNlZCAuZm9sZCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVaKC05MGRlZyk7XG4gIH1cbn1cblxuI3RvYy1jb250ZW50IHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgbWF4LWhlaWdodDogbm9uZTtcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAwLjVzIGVhc2U7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmLmNvbGxhcHNlZCA+IC5vdmVyZmxvdzo6YWZ0ZXIge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cblxuICAmIHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbjogMC41cmVtIDA7XG4gICAgcGFkZGluZzogMDtcbiAgICAmID4gbGkgPiBhIHtcbiAgICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICAgIG9wYWNpdHk6IDAuMzU7XG4gICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAwLjVzIGVhc2Ugb3BhY2l0eSxcbiAgICAgICAgMC4zcyBlYXNlIGNvbG9yO1xuICAgICAgJi5pbi12aWV3IHtcbiAgICAgICAgb3BhY2l0eTogMC43NTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAZm9yICRpIGZyb20gMCB0aHJvdWdoIDYge1xuICAgICYgLmRlcHRoLSN7JGl9IHtcbiAgICAgIHBhZGRpbmctbGVmdDogY2FsYygxcmVtICogI3skaX0pO1xuICAgIH1cbiAgfVxufVxuIl19 */`;var toc_inline_default=`// quartz/components/scripts/quartz/components/scripts/toc.inline.ts
var observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id;
    const tocEntryElement = document.querySelector(\`a[data-for="\${slug}"]\`);
    const windowHeight = entry.rootBounds?.height;
    if (windowHeight && tocEntryElement) {
      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElement.classList.add("in-view");
      } else {
        tocEntryElement.classList.remove("in-view");
      }
    }
  }
});
function toggleToc() {
  this.classList.toggle("collapsed");
  const content = this.nextElementSibling;
  content.classList.toggle("collapsed");
  content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px";
}
function setupToc() {
  const toc = document.getElementById("toc");
  if (toc) {
    const collapsed = toc.classList.contains("collapsed");
    const content = toc.nextElementSibling;
    content.style.maxHeight = collapsed ? "0px" : content.scrollHeight + "px";
    toc.removeEventListener("click", toggleToc);
    toc.addEventListener("click", toggleToc);
  }
}
window.addEventListener("resize", setupToc);
document.addEventListener("nav", () => {
  setupToc();
  observer.disconnect();
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
  headers.forEach((header) => observer.observe(header));
});
`;import{jsx as jsx19,jsxs as jsxs9}from"preact/jsx-runtime";var defaultOptions9={layout:"modern"};function TableOfContents2({fileData,displayClass}){return fileData.toc?jsxs9("div",{class:`toc ${displayClass??""}`,children:[jsxs9("button",{type:"button",id:"toc",class:fileData.collapseToc?"collapsed":"",children:[jsx19("h3",{children:"Table of Contents"}),jsx19("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"fold",children:jsx19("polyline",{points:"6 9 12 15 18 9"})})]}),jsx19("div",{id:"toc-content",children:jsx19("ul",{class:"overflow",children:fileData.toc.map(tocEntry=>jsx19("li",{class:`depth-${tocEntry.depth}`,children:jsx19("a",{href:`#${tocEntry.slug}`,"data-for":tocEntry.slug,children:tocEntry.text})},tocEntry.slug))})})]}):null}__name(TableOfContents2,"TableOfContents");TableOfContents2.css=toc_default;TableOfContents2.afterDOMLoaded=toc_inline_default;function LegacyTableOfContents({fileData}){return fileData.toc?jsxs9("details",{id:"toc",open:!fileData.collapseToc,children:[jsx19("summary",{children:jsx19("h3",{children:"Table of Contents"})}),jsx19("ul",{children:fileData.toc.map(tocEntry=>jsx19("li",{class:`depth-${tocEntry.depth}`,children:jsx19("a",{href:`#${tocEntry.slug}`,"data-for":tocEntry.slug,children:tocEntry.text})},tocEntry.slug))})]}):null}__name(LegacyTableOfContents,"LegacyTableOfContents");LegacyTableOfContents.css=legacyToc_default;var TableOfContents_default=__name(opts=>(opts?.layout??defaultOptions9.layout)==="modern"?TableOfContents2:LegacyTableOfContents,"default");var explorer_default=`button#explorer {
  all: unset;
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}
button#explorer h1 {
  font-size: 1rem;
  display: inline-block;
  margin: 0;
}
button#explorer .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}
button#explorer.collapsed .fold {
  transform: rotateZ(-90deg);
}

.folder-outer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;
}

.folder-outer.open {
  grid-template-rows: 1fr;
}

.folder-outer > ul {
  overflow: hidden;
}

#explorer-content {
  list-style: none;
  overflow: hidden;
  max-height: none;
  transition: max-height 0.35s ease;
  margin-top: 0.5rem;
}
#explorer-content.collapsed > .overflow::after {
  opacity: 0;
}
#explorer-content ul {
  list-style: none;
  margin: 0.08rem 0;
  padding: 0;
  transition: max-height 0.35s ease, transform 0.35s ease, opacity 0.2s ease;
}
#explorer-content ul li > a {
  color: var(--dark);
  opacity: 0.75;
  pointer-events: all;
}

svg {
  pointer-events: all;
}
svg > polyline {
  pointer-events: none;
}

.folder-container {
  flex-direction: row;
  display: flex;
  align-items: center;
  user-select: none;
}
.folder-container div > a {
  color: var(--secondary);
  font-family: var(--headerFont);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5rem;
  display: inline-block;
}
.folder-container div > a:hover {
  color: var(--tertiary);
}
.folder-container div > button {
  color: var(--dark);
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding-left: 0;
  padding-right: 0;
  display: flex;
  align-items: center;
  font-family: var(--headerFont);
}
.folder-container div > button span {
  font-size: 0.95rem;
  display: inline-block;
  color: var(--secondary);
  font-weight: 600;
  margin: 0;
  line-height: 1.5rem;
  pointer-events: none;
}

.folder-icon {
  margin-right: 5px;
  color: var(--secondary);
  cursor: pointer;
  transition: transform 0.3s ease;
  backface-visibility: visible;
}

li:has(> .folder-outer:not(.open)) > .folder-container > svg {
  transform: rotate(-90deg);
}

.folder-icon:hover {
  color: var(--tertiary);
}

.no-background::after {
  background: none !important;
}

#explorer-end {
  height: 4px;
  margin: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImV4cGxvcmVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0EsWUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBS047RUFDRTs7QUFFQTtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7OztBQUdGO0VBRUU7RUFFQSIsInNvdXJjZXNDb250ZW50IjpbImJ1dHRvbiNleHBsb3JlciB7XG4gIGFsbDogdW5zZXQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXI6IG5vbmU7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgcGFkZGluZzogMDtcbiAgY29sb3I6IHZhcigtLWRhcmspO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICYgaDEge1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luOiAwO1xuICB9XG5cbiAgJiAuZm9sZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgIG9wYWNpdHk6IDAuODtcbiAgfVxuXG4gICYuY29sbGFwc2VkIC5mb2xkIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVooLTkwZGVnKTtcbiAgfVxufVxuXG4uZm9sZGVyLW91dGVyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAwZnI7XG4gIHRyYW5zaXRpb246IGdyaWQtdGVtcGxhdGUtcm93cyAwLjNzIGVhc2UtaW4tb3V0O1xufVxuXG4uZm9sZGVyLW91dGVyLm9wZW4ge1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcbn1cblxuLmZvbGRlci1vdXRlciA+IHVsIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuI2V4cGxvcmVyLWNvbnRlbnQge1xuICBsaXN0LXN0eWxlOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtYXgtaGVpZ2h0OiBub25lO1xuICB0cmFuc2l0aW9uOiBtYXgtaGVpZ2h0IDAuMzVzIGVhc2U7XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcblxuICAmLmNvbGxhcHNlZCA+IC5vdmVyZmxvdzo6YWZ0ZXIge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cblxuICAmIHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbjogMC4wOHJlbSAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgdHJhbnNpdGlvbjpcbiAgICAgIG1heC1oZWlnaHQgMC4zNXMgZWFzZSxcbiAgICAgIHRyYW5zZm9ybSAwLjM1cyBlYXNlLFxuICAgICAgb3BhY2l0eSAwLjJzIGVhc2U7XG4gICAgJiBsaSA+IGEge1xuICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgb3BhY2l0eTogMC43NTtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBhbGw7XG4gICAgfVxuICB9XG59XG5cbnN2ZyB7XG4gIHBvaW50ZXItZXZlbnRzOiBhbGw7XG5cbiAgJiA+IHBvbHlsaW5lIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxufVxuXG4uZm9sZGVyLWNvbnRhaW5lciB7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICYgZGl2ID4gYSB7XG4gICAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWhlYWRlckZvbnQpO1xuICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjVyZW07XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB9XG5cbiAgJiBkaXYgPiBhOmhvdmVyIHtcbiAgICBjb2xvcjogdmFyKC0tdGVydGlhcnkpO1xuICB9XG5cbiAgJiBkaXYgPiBidXR0b24ge1xuICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1oZWFkZXJGb250KTtcblxuICAgICYgc3BhbiB7XG4gICAgICBmb250LXNpemU6IDAuOTVyZW07XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBsaW5lLWhlaWdodDogMS41cmVtO1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgfVxuICB9XG59XG5cbi5mb2xkZXItaWNvbiB7XG4gIG1hcmdpbi1yaWdodDogNXB4O1xuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICBiYWNrZmFjZS12aXNpYmlsaXR5OiB2aXNpYmxlO1xufVxuXG5saTpoYXMoPiAuZm9sZGVyLW91dGVyOm5vdCgub3BlbikpID4gLmZvbGRlci1jb250YWluZXIgPiBzdmcge1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgtOTBkZWcpO1xufVxuXG4uZm9sZGVyLWljb246aG92ZXIge1xuICBjb2xvcjogdmFyKC0tdGVydGlhcnkpO1xufVxuXG4ubm8tYmFja2dyb3VuZDo6YWZ0ZXIge1xuICBiYWNrZ3JvdW5kOiBub25lICFpbXBvcnRhbnQ7XG59XG5cbiNleHBsb3Jlci1lbmQge1xuICAvLyBuZWVkcyBoZWlnaHQgc28gSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgZ2V0cyB0cmlnZ2VyZWRcbiAgaGVpZ2h0OiA0cHg7XG4gIC8vIHJlbW92ZSBkZWZhdWx0IG1hcmdpbiBmcm9tIGxpXG4gIG1hcmdpbjogMDtcbn1cbiJdfQ== */`;var explorer_inline_default=`// quartz/components/scripts/quartz/components/scripts/explorer.inline.ts
var explorerState;
var observer = new IntersectionObserver((entries) => {
  const explorer = document.getElementById("explorer-ul");
  for (const entry of entries) {
    if (entry.isIntersecting) {
      explorer?.classList.add("no-background");
    } else {
      explorer?.classList.remove("no-background");
    }
  }
});
function toggleExplorer() {
  this.classList.toggle("collapsed");
  const content = this.nextElementSibling;
  content.classList.toggle("collapsed");
  content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px";
}
function toggleFolder(evt) {
  evt.stopPropagation();
  const target = evt.target;
  const isSvg = target.nodeName === "svg";
  let childFolderContainer;
  let currentFolderParent;
  if (isSvg) {
    childFolderContainer = target.parentElement?.nextSibling;
    currentFolderParent = target.nextElementSibling;
    childFolderContainer.classList.toggle("open");
  } else {
    childFolderContainer = target.parentElement?.parentElement?.nextElementSibling;
    currentFolderParent = target.parentElement;
    childFolderContainer.classList.toggle("open");
  }
  if (!childFolderContainer)
    return;
  const isCollapsed = childFolderContainer.classList.contains("open");
  setFolderState(childFolderContainer, !isCollapsed);
  const clickFolderPath = currentFolderParent.dataset.folderpath;
  const fullFolderPath = clickFolderPath;
  toggleCollapsedByPath(explorerState, fullFolderPath);
  const stringifiedFileTree = JSON.stringify(explorerState);
  localStorage.setItem("fileTree", stringifiedFileTree);
}
function setupExplorer() {
  const explorer = document.getElementById("explorer");
  const storageTree = localStorage.getItem("fileTree");
  const useSavedFolderState = explorer?.dataset.savestate === "true";
  if (explorer) {
    const collapseBehavior = explorer.dataset.behavior;
    if (collapseBehavior === "collapse") {
      Array.prototype.forEach.call(
        document.getElementsByClassName("folder-button"),
        function(item) {
          item.removeEventListener("click", toggleFolder);
          item.addEventListener("click", toggleFolder);
        }
      );
    }
    explorer.removeEventListener("click", toggleExplorer);
    explorer.addEventListener("click", toggleExplorer);
  }
  Array.prototype.forEach.call(document.getElementsByClassName("folder-icon"), function(item) {
    item.removeEventListener("click", toggleFolder);
    item.addEventListener("click", toggleFolder);
  });
  if (storageTree && useSavedFolderState) {
    explorerState = JSON.parse(storageTree);
    explorerState.map((folderUl) => {
      const folderLi = document.querySelector(\`[data-folderpath='\${folderUl.path}']\`);
      if (folderLi) {
        const folderUL = folderLi.parentElement?.nextElementSibling;
        if (folderUL) {
          setFolderState(folderUL, folderUl.collapsed);
        }
      }
    });
  } else if (explorer?.dataset.tree) {
    explorerState = JSON.parse(explorer.dataset.tree);
  }
}
window.addEventListener("resize", setupExplorer);
document.addEventListener("nav", () => {
  setupExplorer();
  observer.disconnect();
  const lastItem = document.getElementById("explorer-end");
  if (lastItem) {
    observer.observe(lastItem);
  }
});
function setFolderState(folderElement, collapsed) {
  if (collapsed) {
    folderElement?.classList.remove("open");
  } else {
    folderElement?.classList.add("open");
  }
}
function toggleCollapsedByPath(array, path) {
  const entry = array.find((item) => item.path === path);
  if (entry) {
    entry.collapsed = !entry.collapsed;
  }
}
`;import{Fragment as Fragment3,jsx as jsx20,jsxs as jsxs10}from"preact/jsx-runtime";function getPathSegment(fp,idx){if(fp)return fp.split("/").at(idx)}__name(getPathSegment,"getPathSegment");var FileNode=class _FileNode{static{__name(this,"FileNode")}children;name;displayName;file;depth;constructor(slugSegment,displayName,file,depth){this.children=[],this.name=slugSegment,this.displayName=displayName??file?.frontmatter?.title??slugSegment,this.file=file?clone(file):null,this.depth=depth??0}insert(fileData){if(fileData.path.length===0)return;let nextSegment=fileData.path[0];if(fileData.path.length===1){if(nextSegment===""){let title=fileData.file.frontmatter?.title;title&&title!=="index"&&(this.displayName=title)}else this.children.push(new _FileNode(nextSegment,void 0,fileData.file,this.depth+1));return}fileData.path=fileData.path.splice(1);let child=this.children.find(c=>c.name===nextSegment);if(child){child.insert(fileData);return}let newChild=new _FileNode(nextSegment,getPathSegment(fileData.file.relativePath,this.depth),void 0,this.depth+1);newChild.insert(fileData),this.children.push(newChild)}add(file){this.insert({file,path:simplifySlug(file.slug).split("/")})}filter(filterFn){this.children=this.children.filter(filterFn),this.children.forEach(child=>child.filter(filterFn))}map(mapFn2){mapFn2(this),this.children.forEach(child=>child.map(mapFn2))}getFolderPaths(collapsed){let folderPaths=[],traverse=__name((node,currentPath)=>{if(!node.file){let folderPath=joinSegments(currentPath,node.name);folderPath!==""&&folderPaths.push({path:folderPath,collapsed}),node.children.forEach(child=>traverse(child,folderPath))}},"traverse");return traverse(this,""),folderPaths}sort(sortFn2){this.children=this.children.sort(sortFn2),this.children.forEach(e=>e.sort(sortFn2))}};function ExplorerNode({node,opts,fullPath,fileData}){let folderBehavior=opts.folderClickBehavior,isDefaultOpen=opts.folderDefaultState==="open",folderPath="";return node.name!==""&&(folderPath=joinSegments(fullPath??"",node.name)),jsx20(Fragment3,{children:node.file?jsx20("li",{children:jsx20("a",{href:resolveRelative(fileData.slug,node.file.slug),"data-for":node.file.slug,children:node.displayName})},node.file.slug):jsxs10("li",{children:[node.name!==""&&jsxs10("div",{class:"folder-container",children:[jsx20("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"5 8 14 8",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"folder-icon",children:jsx20("polyline",{points:"6 9 12 15 18 9"})}),jsx20("div",{"data-folderpath":folderPath,children:folderBehavior==="link"?jsx20("a",{href:resolveRelative(fileData.slug,folderPath),"data-for":node.name,class:"folder-title",children:node.displayName}):jsx20("button",{class:"folder-button",children:jsx20("span",{class:"folder-title",children:node.displayName})})},node.name)]}),jsx20("div",{class:`folder-outer ${node.depth===0||isDefaultOpen?"open":""}`,children:jsx20("ul",{style:{paddingLeft:node.name!==""?"1.4rem":"0"},class:"content","data-folderul":folderPath,children:node.children.map((childNode,i)=>jsx20(ExplorerNode,{node:childNode,opts,fullPath:folderPath,fileData},i))})})]})})}__name(ExplorerNode,"ExplorerNode");import{jsx as jsx21,jsxs as jsxs11}from"preact/jsx-runtime";var defaultOptions10={title:"Explorer",folderClickBehavior:"collapse",folderDefaultState:"collapsed",useSavedState:!0,mapFn:node=>node,sortFn:(a,b)=>!a.file&&!b.file||a.file&&b.file?a.displayName.localeCompare(b.displayName,void 0,{numeric:!0,sensitivity:"base"}):a.file&&!b.file?1:-1,filterFn:node=>node.name!=="tags",order:["filter","map","sort"]},Explorer_default=__name(userOpts=>{let opts={...defaultOptions10,...userOpts},fileTree,jsonTree;function constructFileTree(allFiles){if(fileTree)return;if(fileTree=new FileNode(""),allFiles.forEach(file=>fileTree.add(file)),opts.order)for(let i=0;i<opts.order.length;i++){let functionName=opts.order[i];functionName==="map"?fileTree.map(opts.mapFn):functionName==="sort"?fileTree.sort(opts.sortFn):functionName==="filter"&&fileTree.filter(opts.filterFn)}let folders=fileTree.getFolderPaths(opts.folderDefaultState==="collapsed");jsonTree=JSON.stringify(folders)}__name(constructFileTree,"constructFileTree");function Explorer({allFiles,displayClass,fileData}){return constructFileTree(allFiles),jsxs11("div",{class:`explorer ${displayClass??""}`,children:[jsxs11("button",{type:"button",id:"explorer","data-behavior":opts.folderClickBehavior,"data-collapsed":opts.folderDefaultState,"data-savestate":opts.useSavedState,"data-tree":jsonTree,children:[jsx21("h1",{children:opts.title}),jsx21("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"5 8 14 8",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"fold",children:jsx21("polyline",{points:"6 9 12 15 18 9"})})]}),jsx21("div",{id:"explorer-content",children:jsxs11("ul",{class:"overflow",id:"explorer-ul",children:[jsx21(ExplorerNode,{node:fileTree,opts,fileData}),jsx21("li",{id:"explorer-end"})]})})]})}return __name(Explorer,"Explorer"),Explorer.css=explorer_default,Explorer.afterDOMLoaded=explorer_inline_default,Explorer},"default");import{jsx as jsx22}from"preact/jsx-runtime";function TagList({fileData,displayClass}){let tags=fileData.frontmatter?.tags,baseDir=pathToRoot(fileData.slug);return tags&&tags.length>0?jsx22("ul",{class:`tags ${displayClass??""}`,children:tags.map(tag=>{let display=`#${tag}`,linkDest=baseDir+`/tags/${slugTag(tag)}`;return jsx22("li",{children:jsx22("a",{href:linkDest,class:"internal tag-link",children:display})})})}):null}__name(TagList,"TagList");TagList.css=`
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
  justify-self: end;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;var TagList_default=__name(()=>TagList,"default");import{jsx as jsx23,jsxs as jsxs12}from"preact/jsx-runtime";var backlinks_default=`.backlinks {
  position: relative;
}
.backlinks > h3 {
  font-size: 1rem;
  margin: 0;
}
.backlinks > ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}
.backlinks > ul > li > a {
  background-color: transparent;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImJhY2tsaW5rcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdFO0VBQ0UiLCJzb3VyY2VzQ29udGVudCI6WyIuYmFja2xpbmtzIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICYgPiBoMyB7XG4gICAgZm9udC1zaXplOiAxcmVtO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gICYgPiB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbjogMC41cmVtIDA7XG5cbiAgICAmID4gbGkge1xuICAgICAgJiA+IGEge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;import{jsx as jsx24,jsxs as jsxs13}from"preact/jsx-runtime";function Backlinks({fileData,allFiles,displayClass}){let slug=simplifySlug(fileData.slug),backlinkFiles=allFiles.filter(file=>file.links?.includes(slug));return jsxs13("div",{class:`backlinks ${displayClass??""}`,children:[jsx24("h3",{children:"Backlinks"}),jsx24("ul",{class:"overflow",children:backlinkFiles.length>0?backlinkFiles.map(f=>jsx24("li",{children:jsx24("a",{href:resolveRelative(fileData.slug,f.slug),class:"internal",children:f.frontmatter?.title})})):jsx24("li",{children:"No backlinks found"})})]})}__name(Backlinks,"Backlinks");Backlinks.css=backlinks_default;var Backlinks_default=__name(()=>Backlinks,"default");var search_default=`.search {
  min-width: fit-content;
  max-width: 14rem;
  flex-grow: 0.3;
}
.search > #search-icon {
  background-color: var(--lightgray);
  border-radius: 4px;
  height: 2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}
.search > #search-icon > div {
  flex-grow: 1;
}
.search > #search-icon > p {
  display: inline;
  padding: 0 1rem;
}
.search > #search-icon svg {
  cursor: pointer;
  width: 18px;
  min-width: 18px;
  margin: 0 0.5rem;
}
.search > #search-icon svg .search-path {
  stroke: var(--darkgray);
  stroke-width: 2px;
  transition: stroke 0.5s ease;
}
.search > #search-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: none;
  backdrop-filter: blur(4px);
}
.search > #search-container.active {
  display: inline-block;
}
.search > #search-container > #search-space {
  width: 50%;
  margin-top: 15vh;
  margin-left: auto;
  margin-right: auto;
}
@media all and (max-width: 1510px) {
  .search > #search-container > #search-space {
    width: 90%;
  }
}
.search > #search-container > #search-space > * {
  width: 100%;
  border-radius: 5px;
  background: var(--light);
  box-shadow: 0 14px 50px rgba(27, 33, 48, 0.12), 0 10px 30px rgba(27, 33, 48, 0.16);
  margin-bottom: 2em;
}
.search > #search-container > #search-space > input {
  box-sizing: border-box;
  padding: 0.5em 1em;
  font-family: var(--bodyFont);
  color: var(--dark);
  font-size: 1.1em;
  border: 1px solid var(--lightgray);
}
.search > #search-container > #search-space > input:focus {
  outline: none;
}
.search > #search-container > #search-space > #results-container .result-card {
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 1px solid var(--lightgray);
  border-bottom: none;
  width: 100%;
  display: block;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  text-align: left;
  background: var(--light);
  outline: none;
  font-weight: inherit;
}
.search > #search-container > #search-space > #results-container .result-card .highlight {
  color: var(--secondary);
  font-weight: 700;
}
.search > #search-container > #search-space > #results-container .result-card:hover, .search > #search-container > #search-space > #results-container .result-card:focus {
  background: var(--lightgray);
}
.search > #search-container > #search-space > #results-container .result-card:first-of-type {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.search > #search-container > #search-space > #results-container .result-card:last-of-type {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom: 1px solid var(--lightgray);
}
.search > #search-container > #search-space > #results-container .result-card > h3 {
  margin: 0;
}
.search > #search-container > #search-space > #results-container .result-card > ul > li {
  margin: 0;
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}
.search > #search-container > #search-space > #results-container .result-card > ul {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 0;
  margin-top: 0.45rem;
  margin-left: -2px;
  overflow: hidden;
  background-clip: border-box;
}
.search > #search-container > #search-space > #results-container .result-card > ul > li > p {
  border-radius: 8px;
  background-color: var(--highlight);
  overflow: hidden;
  background-clip: border-box;
  padding: 0.03rem 0.4rem;
  margin: 0;
  color: var(--secondary);
  opacity: 0.85;
}
.search > #search-container > #search-space > #results-container .result-card > ul > li > .match-tag {
  color: var(--tertiary);
  font-weight: bold;
  opacity: 1;
}
.search > #search-container > #search-space > #results-container .result-card > p {
  margin-bottom: 0;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbInNlYXJjaC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQU5GO0lBT0k7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0EsWUFDRTtFQUVGOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBS0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBR0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUVFOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG4uc2VhcmNoIHtcbiAgbWluLXdpZHRoOiBmaXQtY29udGVudDtcbiAgbWF4LXdpZHRoOiAxNHJlbTtcbiAgZmxleC1ncm93OiAwLjM7XG5cbiAgJiA+ICNzZWFyY2gtaWNvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHRncmF5KTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgaGVpZ2h0OiAycmVtO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcblxuICAgICYgPiBkaXYge1xuICAgICAgZmxleC1ncm93OiAxO1xuICAgIH1cblxuICAgICYgPiBwIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZTtcbiAgICAgIHBhZGRpbmc6IDAgMXJlbTtcbiAgICB9XG5cbiAgICAmIHN2ZyB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICB3aWR0aDogMThweDtcbiAgICAgIG1pbi13aWR0aDogMThweDtcbiAgICAgIG1hcmdpbjogMCAwLjVyZW07XG5cbiAgICAgIC5zZWFyY2gtcGF0aCB7XG4gICAgICAgIHN0cm9rZTogdmFyKC0tZGFya2dyYXkpO1xuICAgICAgICBzdHJva2Utd2lkdGg6IDJweDtcbiAgICAgICAgdHJhbnNpdGlvbjogc3Ryb2tlIDAuNXMgZWFzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAmID4gI3NlYXJjaC1jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBjb250YWluOiBsYXlvdXQ7XG4gICAgei1pbmRleDogOTk5O1xuICAgIGxlZnQ6IDA7XG4gICAgdG9wOiAwO1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcblxuICAgICYuYWN0aXZlIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICB9XG5cbiAgICAmID4gI3NlYXJjaC1zcGFjZSB7XG4gICAgICB3aWR0aDogNTAlO1xuICAgICAgbWFyZ2luLXRvcDogMTV2aDtcbiAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuXG4gICAgICBAbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAkZnVsbFBhZ2VXaWR0aCkge1xuICAgICAgICB3aWR0aDogOTAlO1xuICAgICAgfVxuXG4gICAgICAmID4gKiB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0KTtcbiAgICAgICAgYm94LXNoYWRvdzpcbiAgICAgICAgICAwIDE0cHggNTBweCByZ2JhKDI3LCAzMywgNDgsIDAuMTIpLFxuICAgICAgICAgIDAgMTBweCAzMHB4IHJnYmEoMjcsIDMzLCA0OCwgMC4xNik7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDJlbTtcbiAgICAgIH1cblxuICAgICAgJiA+IGlucHV0IHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgcGFkZGluZzogMC41ZW0gMWVtO1xuICAgICAgICBmb250LWZhbWlseTogdmFyKC0tYm9keUZvbnQpO1xuICAgICAgICBjb2xvcjogdmFyKC0tZGFyayk7XG4gICAgICAgIGZvbnQtc2l6ZTogMS4xZW07XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG5cbiAgICAgICAgJjpmb2N1cyB7XG4gICAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAmID4gI3Jlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgJiAucmVzdWx0LWNhcmQge1xuICAgICAgICAgIHBhZGRpbmc6IDFlbTtcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzIGVhc2U7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgICAgICAgICAvLyBub3JtYWxpemUgY2FyZCBwcm9wc1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTAwJTtcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS4xNTtcbiAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG4gICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gICAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgICBmb250LXdlaWdodDogaW5oZXJpdDtcblxuICAgICAgICAgICYgLmhpZ2hsaWdodCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJjpob3ZlcixcbiAgICAgICAgICAmOmZvY3VzIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJjpmaXJzdC1vZi10eXBlIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDVweDtcbiAgICAgICAgICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiA1cHg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJjpsYXN0LW9mLXR5cGUge1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNXB4O1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDVweDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICYgPiBoMyB7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJiA+IHVsID4gbGkge1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6IG5vcm1hbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAmID4gdWwge1xuICAgICAgICAgICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgICAgICAgICBnYXA6IDAuNHJlbTtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDAuNDVyZW07XG4gICAgICAgICAgICAvLyBPZmZzZXQgYm9yZGVyIHJhZGl1c1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IC0ycHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jbGlwOiBib3JkZXItYm94O1xuICAgICAgICAgIH1cblxuICAgICAgICAgICYgPiB1bCA+IGxpID4gcCB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oaWdobGlnaHQpO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY2xpcDogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuMDNyZW0gMC40cmVtO1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjg1O1xuICAgICAgICAgIH1cblxuICAgICAgICAgICYgPiB1bCA+IGxpID4gLm1hdGNoLXRhZyB7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGVydGlhcnkpO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICYgPiBwIHtcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0= */`;var search_inline_default=`var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/flexsearch/dist/flexsearch.bundle.js
var require_flexsearch_bundle = __commonJS({
  "node_modules/flexsearch/dist/flexsearch.bundle.js"(exports, module) {
    (function _f(self) {
      "use strict";
      try {
        if (module)
          self = module;
      } catch (e) {
      }
      self._factory = _f;
      var t;
      function u(a2) {
        return "undefined" !== typeof a2 ? a2 : true;
      }
      function aa(a2) {
        const b2 = Array(a2);
        for (let c2 = 0; c2 < a2; c2++)
          b2[c2] = v();
        return b2;
      }
      function v() {
        return /* @__PURE__ */ Object.create(null);
      }
      function ba(a2, b2) {
        return b2.length - a2.length;
      }
      function x(a2) {
        return "string" === typeof a2;
      }
      function C(a2) {
        return "object" === typeof a2;
      }
      function D(a2) {
        return "function" === typeof a2;
      }
      ;
      function ca(a2, b2) {
        var c2 = da;
        if (a2 && (b2 && (a2 = E(a2, b2)), this.H && (a2 = E(a2, this.H)), this.J && 1 < a2.length && (a2 = E(a2, this.J)), c2 || "" === c2)) {
          a2 = a2.split(c2);
          if (this.filter) {
            b2 = this.filter;
            c2 = a2.length;
            const d2 = [];
            for (let e = 0, f = 0; e < c2; e++) {
              const g = a2[e];
              g && !b2[g] && (d2[f++] = g);
            }
            a2 = d2;
          }
          return a2;
        }
        return a2;
      }
      const da = /[\\p{Z}\\p{S}\\p{P}\\p{C}]+/u, ea = /[\\u0300-\\u036f]/g;
      function fa(a2, b2) {
        const c2 = Object.keys(a2), d2 = c2.length, e = [];
        let f = "", g = 0;
        for (let h = 0, k, m; h < d2; h++)
          k = c2[h], (m = a2[k]) ? (e[g++] = F(b2 ? "(?!\\\\b)" + k + "(\\\\b|_)" : k), e[g++] = m) : f += (f ? "|" : "") + k;
        f && (e[g++] = F(b2 ? "(?!\\\\b)(" + f + ")(\\\\b|_)" : "(" + f + ")"), e[g] = "");
        return e;
      }
      function E(a2, b2) {
        for (let c2 = 0, d2 = b2.length; c2 < d2 && (a2 = a2.replace(b2[c2], b2[c2 + 1]), a2); c2 += 2)
          ;
        return a2;
      }
      function F(a2) {
        return new RegExp(a2, "g");
      }
      function ha(a2) {
        let b2 = "", c2 = "";
        for (let d2 = 0, e = a2.length, f; d2 < e; d2++)
          (f = a2[d2]) !== c2 && (b2 += c2 = f);
        return b2;
      }
      ;
      var ja = { encode: ia, F: false, G: "" };
      function ia(a2) {
        return ca.call(this, ("" + a2).toLowerCase(), false);
      }
      ;
      const ka = {}, G = {};
      function la(a2) {
        I(a2, "add");
        I(a2, "append");
        I(a2, "search");
        I(a2, "update");
        I(a2, "remove");
      }
      function I(a2, b2) {
        a2[b2 + "Async"] = function() {
          const c2 = this, d2 = arguments;
          var e = d2[d2.length - 1];
          let f;
          D(e) && (f = e, delete d2[d2.length - 1]);
          e = new Promise(function(g) {
            setTimeout(function() {
              c2.async = true;
              const h = c2[b2].apply(c2, d2);
              c2.async = false;
              g(h);
            });
          });
          return f ? (e.then(f), this) : e;
        };
      }
      ;
      function ma(a2, b2, c2, d2) {
        const e = a2.length;
        let f = [], g, h, k = 0;
        d2 && (d2 = []);
        for (let m = e - 1; 0 <= m; m--) {
          const n = a2[m], w = n.length, q = v();
          let r = !g;
          for (let l = 0; l < w; l++) {
            const p = n[l], z = p.length;
            if (z)
              for (let B = 0, A, y; B < z; B++)
                if (y = p[B], g) {
                  if (g[y]) {
                    if (!m) {
                      if (c2)
                        c2--;
                      else if (f[k++] = y, k === b2)
                        return f;
                    }
                    if (m || d2)
                      q[y] = 1;
                    r = true;
                  }
                  if (d2 && (h[y] = (A = h[y]) ? ++A : A = 1, A < e)) {
                    const H = d2[A - 2] || (d2[A - 2] = []);
                    H[H.length] = y;
                  }
                } else
                  q[y] = 1;
          }
          if (d2)
            g || (h = q);
          else if (!r)
            return [];
          g = q;
        }
        if (d2)
          for (let m = d2.length - 1, n, w; 0 <= m; m--) {
            n = d2[m];
            w = n.length;
            for (let q = 0, r; q < w; q++)
              if (r = n[q], !g[r]) {
                if (c2)
                  c2--;
                else if (f[k++] = r, k === b2)
                  return f;
                g[r] = 1;
              }
          }
        return f;
      }
      function na(a2, b2) {
        const c2 = v(), d2 = v(), e = [];
        for (let f = 0; f < a2.length; f++)
          c2[a2[f]] = 1;
        for (let f = 0, g; f < b2.length; f++) {
          g = b2[f];
          for (let h = 0, k; h < g.length; h++)
            k = g[h], c2[k] && !d2[k] && (d2[k] = 1, e[e.length] = k);
        }
        return e;
      }
      ;
      function J(a2) {
        this.l = true !== a2 && a2;
        this.cache = v();
        this.h = [];
      }
      function oa(a2, b2, c2) {
        C(a2) && (a2 = a2.query);
        let d2 = this.cache.get(a2);
        d2 || (d2 = this.search(a2, b2, c2), this.cache.set(a2, d2));
        return d2;
      }
      J.prototype.set = function(a2, b2) {
        if (!this.cache[a2]) {
          var c2 = this.h.length;
          c2 === this.l ? delete this.cache[this.h[c2 - 1]] : c2++;
          for (--c2; 0 < c2; c2--)
            this.h[c2] = this.h[c2 - 1];
          this.h[0] = a2;
        }
        this.cache[a2] = b2;
      };
      J.prototype.get = function(a2) {
        const b2 = this.cache[a2];
        if (this.l && b2 && (a2 = this.h.indexOf(a2))) {
          const c2 = this.h[a2 - 1];
          this.h[a2 - 1] = this.h[a2];
          this.h[a2] = c2;
        }
        return b2;
      };
      const qa = { memory: { charset: "latin:extra", D: 3, B: 4, m: false }, performance: { D: 3, B: 3, s: false, context: { depth: 2, D: 1 } }, match: { charset: "latin:extra", G: "reverse" }, score: { charset: "latin:advanced", D: 20, B: 3, context: { depth: 3, D: 9 } }, "default": {} };
      function ra(a2, b2, c2, d2, e, f) {
        setTimeout(function() {
          const g = a2(c2, JSON.stringify(f));
          g && g.then ? g.then(function() {
            b2.export(a2, b2, c2, d2, e + 1);
          }) : b2.export(a2, b2, c2, d2, e + 1);
        });
      }
      ;
      function K(a2, b2) {
        if (!(this instanceof K))
          return new K(a2);
        var c2;
        if (a2) {
          x(a2) ? a2 = qa[a2] : (c2 = a2.preset) && (a2 = Object.assign({}, c2[c2], a2));
          c2 = a2.charset;
          var d2 = a2.lang;
          x(c2) && (-1 === c2.indexOf(":") && (c2 += ":default"), c2 = G[c2]);
          x(d2) && (d2 = ka[d2]);
        } else
          a2 = {};
        let e, f, g = a2.context || {};
        this.encode = a2.encode || c2 && c2.encode || ia;
        this.register = b2 || v();
        this.D = e = a2.resolution || 9;
        this.G = b2 = c2 && c2.G || a2.tokenize || "strict";
        this.depth = "strict" === b2 && g.depth;
        this.l = u(g.bidirectional);
        this.s = f = u(a2.optimize);
        this.m = u(a2.fastupdate);
        this.B = a2.minlength || 1;
        this.C = a2.boost;
        this.map = f ? aa(e) : v();
        this.A = e = g.resolution || 1;
        this.h = f ? aa(e) : v();
        this.F = c2 && c2.F || a2.rtl;
        this.H = (b2 = a2.matcher || d2 && d2.H) && fa(b2, false);
        this.J = (b2 = a2.stemmer || d2 && d2.J) && fa(b2, true);
        if (c2 = b2 = a2.filter || d2 && d2.filter) {
          c2 = b2;
          d2 = v();
          for (let h = 0, k = c2.length; h < k; h++)
            d2[c2[h]] = 1;
          c2 = d2;
        }
        this.filter = c2;
        this.cache = (b2 = a2.cache) && new J(b2);
      }
      t = K.prototype;
      t.append = function(a2, b2) {
        return this.add(a2, b2, true);
      };
      t.add = function(a2, b2, c2, d2) {
        if (b2 && (a2 || 0 === a2)) {
          if (!d2 && !c2 && this.register[a2])
            return this.update(a2, b2);
          b2 = this.encode(b2);
          if (d2 = b2.length) {
            const m = v(), n = v(), w = this.depth, q = this.D;
            for (let r = 0; r < d2; r++) {
              let l = b2[this.F ? d2 - 1 - r : r];
              var e = l.length;
              if (l && e >= this.B && (w || !n[l])) {
                var f = L(q, d2, r), g = "";
                switch (this.G) {
                  case "full":
                    if (3 < e) {
                      for (f = 0; f < e; f++)
                        for (var h = e; h > f; h--)
                          if (h - f >= this.B) {
                            var k = L(q, d2, r, e, f);
                            g = l.substring(f, h);
                            M(this, n, g, k, a2, c2);
                          }
                      break;
                    }
                  case "reverse":
                    if (2 < e) {
                      for (h = e - 1; 0 < h; h--)
                        g = l[h] + g, g.length >= this.B && M(
                          this,
                          n,
                          g,
                          L(q, d2, r, e, h),
                          a2,
                          c2
                        );
                      g = "";
                    }
                  case "forward":
                    if (1 < e) {
                      for (h = 0; h < e; h++)
                        g += l[h], g.length >= this.B && M(this, n, g, f, a2, c2);
                      break;
                    }
                  default:
                    if (this.C && (f = Math.min(f / this.C(b2, l, r) | 0, q - 1)), M(this, n, l, f, a2, c2), w && 1 < d2 && r < d2 - 1) {
                      for (e = v(), g = this.A, f = l, h = Math.min(w + 1, d2 - r), e[f] = 1, k = 1; k < h; k++)
                        if ((l = b2[this.F ? d2 - 1 - r - k : r + k]) && l.length >= this.B && !e[l]) {
                          e[l] = 1;
                          const p = this.l && l > f;
                          M(this, m, p ? f : l, L(g + (d2 / 2 > g ? 0 : 1), d2, r, h - 1, k - 1), a2, c2, p ? l : f);
                        }
                    }
                }
              }
            }
            this.m || (this.register[a2] = 1);
          }
        }
        return this;
      };
      function L(a2, b2, c2, d2, e) {
        return c2 && 1 < a2 ? b2 + (d2 || 0) <= a2 ? c2 + (e || 0) : (a2 - 1) / (b2 + (d2 || 0)) * (c2 + (e || 0)) + 1 | 0 : 0;
      }
      function M(a2, b2, c2, d2, e, f, g) {
        let h = g ? a2.h : a2.map;
        if (!b2[c2] || g && !b2[c2][g])
          a2.s && (h = h[d2]), g ? (b2 = b2[c2] || (b2[c2] = v()), b2[g] = 1, h = h[g] || (h[g] = v())) : b2[c2] = 1, h = h[c2] || (h[c2] = []), a2.s || (h = h[d2] || (h[d2] = [])), f && -1 !== h.indexOf(e) || (h[h.length] = e, a2.m && (a2 = a2.register[e] || (a2.register[e] = []), a2[a2.length] = h));
      }
      t.search = function(a2, b2, c2) {
        c2 || (!b2 && C(a2) ? (c2 = a2, a2 = c2.query) : C(b2) && (c2 = b2));
        let d2 = [], e;
        let f, g = 0;
        if (c2) {
          b2 = c2.limit;
          g = c2.offset || 0;
          var h = c2.context;
          f = c2.suggest;
        }
        if (a2 && (a2 = this.encode(a2), e = a2.length, 1 < e)) {
          c2 = v();
          var k = [];
          for (let n = 0, w = 0, q; n < e; n++)
            if ((q = a2[n]) && q.length >= this.B && !c2[q])
              if (this.s || f || this.map[q])
                k[w++] = q, c2[q] = 1;
              else
                return d2;
          a2 = k;
          e = a2.length;
        }
        if (!e)
          return d2;
        b2 || (b2 = 100);
        h = this.depth && 1 < e && false !== h;
        c2 = 0;
        let m;
        h ? (m = a2[0], c2 = 1) : 1 < e && a2.sort(ba);
        for (let n, w; c2 < e; c2++) {
          w = a2[c2];
          h ? (n = sa(this, d2, f, b2, g, 2 === e, w, m), f && false === n && d2.length || (m = w)) : n = sa(this, d2, f, b2, g, 1 === e, w);
          if (n)
            return n;
          if (f && c2 === e - 1) {
            k = d2.length;
            if (!k) {
              if (h) {
                h = 0;
                c2 = -1;
                continue;
              }
              return d2;
            }
            if (1 === k)
              return ta(d2[0], b2, g);
          }
        }
        return ma(d2, b2, g, f);
      };
      function sa(a2, b2, c2, d2, e, f, g, h) {
        let k = [], m = h ? a2.h : a2.map;
        a2.s || (m = ua(m, g, h, a2.l));
        if (m) {
          let n = 0;
          const w = Math.min(m.length, h ? a2.A : a2.D);
          for (let q = 0, r = 0, l, p; q < w; q++)
            if (l = m[q]) {
              if (a2.s && (l = ua(l, g, h, a2.l)), e && l && f && (p = l.length, p <= e ? (e -= p, l = null) : (l = l.slice(e), e = 0)), l && (k[n++] = l, f && (r += l.length, r >= d2)))
                break;
            }
          if (n) {
            if (f)
              return ta(k, d2, 0);
            b2[b2.length] = k;
            return;
          }
        }
        return !c2 && k;
      }
      function ta(a2, b2, c2) {
        a2 = 1 === a2.length ? a2[0] : [].concat.apply([], a2);
        return c2 || a2.length > b2 ? a2.slice(c2, c2 + b2) : a2;
      }
      function ua(a2, b2, c2, d2) {
        c2 ? (d2 = d2 && b2 > c2, a2 = (a2 = a2[d2 ? b2 : c2]) && a2[d2 ? c2 : b2]) : a2 = a2[b2];
        return a2;
      }
      t.contain = function(a2) {
        return !!this.register[a2];
      };
      t.update = function(a2, b2) {
        return this.remove(a2).add(a2, b2);
      };
      t.remove = function(a2, b2) {
        const c2 = this.register[a2];
        if (c2) {
          if (this.m)
            for (let d2 = 0, e; d2 < c2.length; d2++)
              e = c2[d2], e.splice(e.indexOf(a2), 1);
          else
            N(this.map, a2, this.D, this.s), this.depth && N(this.h, a2, this.A, this.s);
          b2 || delete this.register[a2];
          if (this.cache) {
            b2 = this.cache;
            for (let d2 = 0, e, f; d2 < b2.h.length; d2++)
              f = b2.h[d2], e = b2.cache[f], -1 !== e.indexOf(a2) && (b2.h.splice(d2--, 1), delete b2.cache[f]);
          }
        }
        return this;
      };
      function N(a2, b2, c2, d2, e) {
        let f = 0;
        if (a2.constructor === Array)
          if (e)
            b2 = a2.indexOf(b2), -1 !== b2 ? 1 < a2.length && (a2.splice(b2, 1), f++) : f++;
          else {
            e = Math.min(a2.length, c2);
            for (let g = 0, h; g < e; g++)
              if (h = a2[g])
                f = N(h, b2, c2, d2, e), d2 || f || delete a2[g];
          }
        else
          for (let g in a2)
            (f = N(a2[g], b2, c2, d2, e)) || delete a2[g];
        return f;
      }
      t.searchCache = oa;
      t.export = function(a2, b2, c2, d2, e) {
        let f, g;
        switch (e || (e = 0)) {
          case 0:
            f = "reg";
            if (this.m) {
              g = v();
              for (let h in this.register)
                g[h] = 1;
            } else
              g = this.register;
            break;
          case 1:
            f = "cfg";
            g = { doc: 0, opt: this.s ? 1 : 0 };
            break;
          case 2:
            f = "map";
            g = this.map;
            break;
          case 3:
            f = "ctx";
            g = this.h;
            break;
          default:
            return;
        }
        ra(a2, b2 || this, c2 ? c2 + "." + f : f, d2, e, g);
        return true;
      };
      t.import = function(a2, b2) {
        if (b2)
          switch (x(b2) && (b2 = JSON.parse(b2)), a2) {
            case "cfg":
              this.s = !!b2.opt;
              break;
            case "reg":
              this.m = false;
              this.register = b2;
              break;
            case "map":
              this.map = b2;
              break;
            case "ctx":
              this.h = b2;
          }
      };
      la(K.prototype);
      function va(a2) {
        a2 = a2.data;
        var b2 = self._index;
        const c2 = a2.args;
        var d2 = a2.task;
        switch (d2) {
          case "init":
            d2 = a2.options || {};
            a2 = a2.factory;
            b2 = d2.encode;
            d2.cache = false;
            b2 && 0 === b2.indexOf("function") && (d2.encode = Function("return " + b2)());
            a2 ? (Function("return " + a2)()(self), self._index = new self.FlexSearch.Index(d2), delete self.FlexSearch) : self._index = new K(d2);
            break;
          default:
            a2 = a2.id, b2 = b2[d2].apply(b2, c2), postMessage("search" === d2 ? { id: a2, msg: b2 } : { id: a2 });
        }
      }
      ;
      let wa = 0;
      function O(a2) {
        if (!(this instanceof O))
          return new O(a2);
        var b2;
        a2 ? D(b2 = a2.encode) && (a2.encode = b2.toString()) : a2 = {};
        (b2 = (self || window)._factory) && (b2 = b2.toString());
        const c2 = self.exports, d2 = this;
        this.o = xa(b2, c2, a2.worker);
        this.h = v();
        if (this.o) {
          if (c2)
            this.o.on("message", function(e) {
              d2.h[e.id](e.msg);
              delete d2.h[e.id];
            });
          else
            this.o.onmessage = function(e) {
              e = e.data;
              d2.h[e.id](e.msg);
              delete d2.h[e.id];
            };
          this.o.postMessage({ task: "init", factory: b2, options: a2 });
        }
      }
      P("add");
      P("append");
      P("search");
      P("update");
      P("remove");
      function P(a2) {
        O.prototype[a2] = O.prototype[a2 + "Async"] = function() {
          const b2 = this, c2 = [].slice.call(arguments);
          var d2 = c2[c2.length - 1];
          let e;
          D(d2) && (e = d2, c2.splice(c2.length - 1, 1));
          d2 = new Promise(function(f) {
            setTimeout(function() {
              b2.h[++wa] = f;
              b2.o.postMessage({ task: a2, id: wa, args: c2 });
            });
          });
          return e ? (d2.then(e), this) : d2;
        };
      }
      function xa(a, b, c) {
        let d;
        try {
          d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + va.toString()], { type: "text/javascript" }))) : new Worker(x(c) ? c : "worker/worker.js", { type: "module" });
        } catch (e) {
        }
        return d;
      }
      ;
      function Q(a2) {
        if (!(this instanceof Q))
          return new Q(a2);
        var b2 = a2.document || a2.doc || a2, c2;
        this.K = [];
        this.h = [];
        this.A = [];
        this.register = v();
        this.key = (c2 = b2.key || b2.id) && S(c2, this.A) || "id";
        this.m = u(a2.fastupdate);
        this.C = (c2 = b2.store) && true !== c2 && [];
        this.store = c2 && v();
        this.I = (c2 = b2.tag) && S(c2, this.A);
        this.l = c2 && v();
        this.cache = (c2 = a2.cache) && new J(c2);
        a2.cache = false;
        this.o = a2.worker;
        this.async = false;
        c2 = v();
        let d2 = b2.index || b2.field || b2;
        x(d2) && (d2 = [d2]);
        for (let e = 0, f, g; e < d2.length; e++)
          f = d2[e], x(f) || (g = f, f = f.field), g = C(g) ? Object.assign({}, a2, g) : a2, this.o && (c2[f] = new O(g), c2[f].o || (this.o = false)), this.o || (c2[f] = new K(g, this.register)), this.K[e] = S(f, this.A), this.h[e] = f;
        if (this.C)
          for (a2 = b2.store, x(a2) && (a2 = [a2]), b2 = 0; b2 < a2.length; b2++)
            this.C[b2] = S(a2[b2], this.A);
        this.index = c2;
      }
      function S(a2, b2) {
        const c2 = a2.split(":");
        let d2 = 0;
        for (let e = 0; e < c2.length; e++)
          a2 = c2[e], 0 <= a2.indexOf("[]") && (a2 = a2.substring(0, a2.length - 2)) && (b2[d2] = true), a2 && (c2[d2++] = a2);
        d2 < c2.length && (c2.length = d2);
        return 1 < d2 ? c2 : c2[0];
      }
      function T(a2, b2) {
        if (x(b2))
          a2 = a2[b2];
        else
          for (let c2 = 0; a2 && c2 < b2.length; c2++)
            a2 = a2[b2[c2]];
        return a2;
      }
      function U(a2, b2, c2, d2, e) {
        a2 = a2[e];
        if (d2 === c2.length - 1)
          b2[e] = a2;
        else if (a2)
          if (a2.constructor === Array)
            for (b2 = b2[e] = Array(a2.length), e = 0; e < a2.length; e++)
              U(a2, b2, c2, d2, e);
          else
            b2 = b2[e] || (b2[e] = v()), e = c2[++d2], U(a2, b2, c2, d2, e);
      }
      function V(a2, b2, c2, d2, e, f, g, h) {
        if (a2 = a2[g])
          if (d2 === b2.length - 1) {
            if (a2.constructor === Array) {
              if (c2[d2]) {
                for (b2 = 0; b2 < a2.length; b2++)
                  e.add(f, a2[b2], true, true);
                return;
              }
              a2 = a2.join(" ");
            }
            e.add(f, a2, h, true);
          } else if (a2.constructor === Array)
            for (g = 0; g < a2.length; g++)
              V(a2, b2, c2, d2, e, f, g, h);
          else
            g = b2[++d2], V(a2, b2, c2, d2, e, f, g, h);
      }
      t = Q.prototype;
      t.add = function(a2, b2, c2) {
        C(a2) && (b2 = a2, a2 = T(b2, this.key));
        if (b2 && (a2 || 0 === a2)) {
          if (!c2 && this.register[a2])
            return this.update(a2, b2);
          for (let d2 = 0, e, f; d2 < this.h.length; d2++)
            f = this.h[d2], e = this.K[d2], x(e) && (e = [e]), V(b2, e, this.A, 0, this.index[f], a2, e[0], c2);
          if (this.I) {
            let d2 = T(b2, this.I), e = v();
            x(d2) && (d2 = [d2]);
            for (let f = 0, g, h; f < d2.length; f++)
              if (g = d2[f], !e[g] && (e[g] = 1, h = this.l[g] || (this.l[g] = []), !c2 || -1 === h.indexOf(a2))) {
                if (h[h.length] = a2, this.m) {
                  const k = this.register[a2] || (this.register[a2] = []);
                  k[k.length] = h;
                }
              }
          }
          if (this.store && (!c2 || !this.store[a2])) {
            let d2;
            if (this.C) {
              d2 = v();
              for (let e = 0, f; e < this.C.length; e++)
                f = this.C[e], x(f) ? d2[f] = b2[f] : U(b2, d2, f, 0, f[0]);
            }
            this.store[a2] = d2 || b2;
          }
        }
        return this;
      };
      t.append = function(a2, b2) {
        return this.add(a2, b2, true);
      };
      t.update = function(a2, b2) {
        return this.remove(a2).add(a2, b2);
      };
      t.remove = function(a2) {
        C(a2) && (a2 = T(a2, this.key));
        if (this.register[a2]) {
          for (var b2 = 0; b2 < this.h.length && (this.index[this.h[b2]].remove(a2, !this.o), !this.m); b2++)
            ;
          if (this.I && !this.m)
            for (let c2 in this.l) {
              b2 = this.l[c2];
              const d2 = b2.indexOf(a2);
              -1 !== d2 && (1 < b2.length ? b2.splice(d2, 1) : delete this.l[c2]);
            }
          this.store && delete this.store[a2];
          delete this.register[a2];
        }
        return this;
      };
      t.search = function(a2, b2, c2, d2) {
        c2 || (!b2 && C(a2) ? (c2 = a2, a2 = c2.query) : C(b2) && (c2 = b2, b2 = 0));
        let e = [], f = [], g, h, k, m, n, w, q = 0;
        if (c2)
          if (c2.constructor === Array)
            k = c2, c2 = null;
          else {
            k = (g = c2.pluck) || c2.index || c2.field;
            m = c2.tag;
            h = this.store && c2.enrich;
            n = "and" === c2.bool;
            b2 = c2.limit || 100;
            w = c2.offset || 0;
            if (m && (x(m) && (m = [m]), !a2)) {
              for (let l = 0, p; l < m.length; l++)
                if (p = ya.call(this, m[l], b2, w, h))
                  e[e.length] = p, q++;
              return q ? e : [];
            }
            x(k) && (k = [k]);
          }
        k || (k = this.h);
        n = n && (1 < k.length || m && 1 < m.length);
        const r = !d2 && (this.o || this.async) && [];
        for (let l = 0, p, z, B; l < k.length; l++) {
          let A;
          z = k[l];
          x(z) || (A = z, z = z.field);
          if (r)
            r[l] = this.index[z].searchAsync(a2, b2, A || c2);
          else {
            d2 ? p = d2[l] : p = this.index[z].search(a2, b2, A || c2);
            B = p && p.length;
            if (m && B) {
              const y = [];
              let H = 0;
              n && (y[0] = [p]);
              for (let X = 0, pa, R; X < m.length; X++)
                if (pa = m[X], B = (R = this.l[pa]) && R.length)
                  H++, y[y.length] = n ? [R] : R;
              H && (p = n ? ma(y, b2 || 100, w || 0) : na(p, y), B = p.length);
            }
            if (B)
              f[q] = z, e[q++] = p;
            else if (n)
              return [];
          }
        }
        if (r) {
          const l = this;
          return new Promise(function(p) {
            Promise.all(r).then(function(z) {
              p(l.search(a2, b2, c2, z));
            });
          });
        }
        if (!q)
          return [];
        if (g && (!h || !this.store))
          return e[0];
        for (let l = 0, p; l < f.length; l++) {
          p = e[l];
          p.length && h && (p = za.call(this, p));
          if (g)
            return p;
          e[l] = { field: f[l], result: p };
        }
        return e;
      };
      function ya(a2, b2, c2, d2) {
        let e = this.l[a2], f = e && e.length - c2;
        if (f && 0 < f) {
          if (f > b2 || c2)
            e = e.slice(c2, c2 + b2);
          d2 && (e = za.call(this, e));
          return { tag: a2, result: e };
        }
      }
      function za(a2) {
        const b2 = Array(a2.length);
        for (let c2 = 0, d2; c2 < a2.length; c2++)
          d2 = a2[c2], b2[c2] = { id: d2, doc: this.store[d2] };
        return b2;
      }
      t.contain = function(a2) {
        return !!this.register[a2];
      };
      t.get = function(a2) {
        return this.store[a2];
      };
      t.set = function(a2, b2) {
        this.store[a2] = b2;
        return this;
      };
      t.searchCache = oa;
      t.export = function(a2, b2, c2, d2, e) {
        e || (e = 0);
        d2 || (d2 = 0);
        if (d2 < this.h.length) {
          const f = this.h[d2], g = this.index[f];
          b2 = this;
          setTimeout(function() {
            g.export(a2, b2, e ? f.replace(":", "-") : "", d2, e++) || (d2++, e = 1, b2.export(a2, b2, f, d2, e));
          });
        } else {
          let f;
          switch (e) {
            case 1:
              c2 = "tag";
              f = this.l;
              break;
            case 2:
              c2 = "store";
              f = this.store;
              break;
            default:
              return;
          }
          ra(a2, this, c2, d2, e, f);
        }
      };
      t.import = function(a2, b2) {
        if (b2)
          switch (x(b2) && (b2 = JSON.parse(b2)), a2) {
            case "tag":
              this.l = b2;
              break;
            case "reg":
              this.m = false;
              this.register = b2;
              for (let d2 = 0, e; d2 < this.h.length; d2++)
                e = this.index[this.h[d2]], e.register = b2, e.m = false;
              break;
            case "store":
              this.store = b2;
              break;
            default:
              a2 = a2.split(".");
              const c2 = a2[0];
              a2 = a2[1];
              c2 && a2 && this.index[c2].import(a2, b2);
          }
      };
      la(Q.prototype);
      var Ba = { encode: Aa, F: false, G: "" };
      const Ca = [F("[\\xE0\\xE1\\xE2\\xE3\\xE4\\xE5]"), "a", F("[\\xE8\\xE9\\xEA\\xEB]"), "e", F("[\\xEC\\xED\\xEE\\xEF]"), "i", F("[\\xF2\\xF3\\xF4\\xF5\\xF6\\u0151]"), "o", F("[\\xF9\\xFA\\xFB\\xFC\\u0171]"), "u", F("[\\xFD\\u0177\\xFF]"), "y", F("\\xF1"), "n", F("[\\xE7c]"), "k", F("\\xDF"), "s", F(" & "), " and "];
      function Aa(a2) {
        var b2 = a2;
        b2.normalize && (b2 = b2.normalize("NFD").replace(ea, ""));
        return ca.call(this, b2.toLowerCase(), !a2.normalize && Ca);
      }
      ;
      var Ea = { encode: Da, F: false, G: "strict" };
      const Fa = /[^a-z0-9]+/, Ga = { b: "p", v: "f", w: "f", z: "s", x: "s", "\\xDF": "s", d: "t", n: "m", c: "k", g: "k", j: "k", q: "k", i: "e", y: "e", u: "o" };
      function Da(a2) {
        a2 = Aa.call(this, a2).join(" ");
        const b2 = [];
        if (a2) {
          const c2 = a2.split(Fa), d2 = c2.length;
          for (let e = 0, f, g = 0; e < d2; e++)
            if ((a2 = c2[e]) && (!this.filter || !this.filter[a2])) {
              f = a2[0];
              let h = Ga[f] || f, k = h;
              for (let m = 1; m < a2.length; m++) {
                f = a2[m];
                const n = Ga[f] || f;
                n && n !== k && (h += n, k = n);
              }
              b2[g++] = h;
            }
        }
        return b2;
      }
      ;
      var Ia = { encode: Ha, F: false, G: "" };
      const Ja = [F("ae"), "a", F("oe"), "o", F("sh"), "s", F("th"), "t", F("ph"), "f", F("pf"), "f", F("(?![aeo])h(?![aeo])"), "", F("(?!^[aeo])h(?!^[aeo])"), ""];
      function Ha(a2, b2) {
        a2 && (a2 = Da.call(this, a2).join(" "), 2 < a2.length && (a2 = E(a2, Ja)), b2 || (1 < a2.length && (a2 = ha(a2)), a2 && (a2 = a2.split(" "))));
        return a2;
      }
      ;
      var La = { encode: Ka, F: false, G: "" };
      const Ma = F("(?!\\\\b)[aeo]");
      function Ka(a2) {
        a2 && (a2 = Ha.call(this, a2, true), 1 < a2.length && (a2 = a2.replace(Ma, "")), 1 < a2.length && (a2 = ha(a2)), a2 && (a2 = a2.split(" ")));
        return a2;
      }
      ;
      G["latin:default"] = ja;
      G["latin:simple"] = Ba;
      G["latin:balance"] = Ea;
      G["latin:advanced"] = Ia;
      G["latin:extra"] = La;
      const W = self;
      let Y;
      const Z = { Index: K, Document: Q, Worker: O, registerCharset: function(a2, b2) {
        G[a2] = b2;
      }, registerLanguage: function(a2, b2) {
        ka[a2] = b2;
      } };
      (Y = W.define) && Y.amd ? Y([], function() {
        return Z;
      }) : W.exports ? W.exports = Z : W.FlexSearch = Z;
    })(exports);
  }
});

// node_modules/rfdc/index.js
var require_rfdc = __commonJS({
  "node_modules/rfdc/index.js"(exports2, module2) {
    "use strict";
    module2.exports = rfdc2;
    function copyBuffer(cur) {
      if (cur instanceof Buffer) {
        return Buffer.from(cur);
      }
      return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
    }
    function rfdc2(opts) {
      opts = opts || {};
      if (opts.circles)
        return rfdcCircles(opts);
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a2, fn) {
        var keys = Object.keys(a2);
        var a22 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a2[k];
          if (typeof cur !== "object" || cur === null) {
            a22[k] = cur;
          } else if (cur instanceof Date) {
            a22[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a22[k] = copyBuffer(cur);
          } else {
            a22[k] = fn(cur);
          }
        }
        return a22;
      }
      function clone2(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, clone2);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), clone2));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), clone2));
        var o2 = {};
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false)
            continue;
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone2));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone2));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = clone2(cur);
          }
        }
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = cloneProto(cur);
          }
        }
        return o2;
      }
    }
    function rfdcCircles(opts) {
      var refs = [];
      var refsNew = [];
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a2, fn) {
        var keys = Object.keys(a2);
        var a22 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a2[k];
          if (typeof cur !== "object" || cur === null) {
            a22[k] = cur;
          } else if (cur instanceof Date) {
            a22[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a22[k] = copyBuffer(cur);
          } else {
            var index2 = refs.indexOf(cur);
            if (index2 !== -1) {
              a22[k] = refsNew[index2];
            } else {
              a22[k] = fn(cur);
            }
          }
        }
        return a22;
      }
      function clone2(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, clone2);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), clone2));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), clone2));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false)
            continue;
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone2));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone2));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = clone2(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = cloneProto(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
    }
  }
});

// quartz/components/scripts/quartz/components/scripts/search.inline.ts
var import_flexsearch = __toESM(require_flexsearch_bundle());

// quartz/components/scripts/util.ts
function registerEscapeHandler(outsideContainer, cb) {
  if (!outsideContainer)
    return;
  function click(e) {
    if (e.target !== this)
      return;
    e.preventDefault();
    cb();
  }
  function esc(e) {
    if (!e.key.startsWith("Esc"))
      return;
    e.preventDefault();
    cb();
  }
  outsideContainer?.removeEventListener("click", click);
  outsideContainer?.addEventListener("click", click);
  document.removeEventListener("keydown", esc);
  document.addEventListener("keydown", esc);
}
function removeAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
var import_rfdc = __toESM(require_rfdc(), 1);
var clone = (0, import_rfdc.default)();
function simplifySlug(fp) {
  const res = _stripSlashes(_trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}
function joinSegments(...args) {
  return args.filter((segment) => segment !== "").join("/").replace(/\\/\\/+/g, "/");
}
function _endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function _trimSuffix(s, suffix) {
  if (_endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function _stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}

// quartz/components/scripts/quartz/components/scripts/search.inline.ts
var index = void 0;
var searchType = "basic";
var contextWindowWords = 30;
var numSearchResults = 5;
var numTagResults = 3;
function highlight(searchTerm, text, trim) {
  const tokenizedTerms = searchTerm.split(/\\s+/).filter((t2) => t2 !== "").sort((a2, b2) => b2.length - a2.length);
  let tokenizedText = text.split(/\\s+/).filter((t2) => t2 !== "");
  let startIndex = 0;
  let endIndex = tokenizedText.length - 1;
  if (trim) {
    const includesCheck = (tok) => tokenizedTerms.some((term) => tok.toLowerCase().startsWith(term.toLowerCase()));
    const occurrencesIndices = tokenizedText.map(includesCheck);
    let bestSum = 0;
    let bestIndex = 0;
    for (let i = 0; i < Math.max(tokenizedText.length - contextWindowWords, 0); i++) {
      const window2 = occurrencesIndices.slice(i, i + contextWindowWords);
      const windowSum = window2.reduce((total, cur) => total + (cur ? 1 : 0), 0);
      if (windowSum >= bestSum) {
        bestSum = windowSum;
        bestIndex = i;
      }
    }
    startIndex = Math.max(bestIndex - contextWindowWords, 0);
    endIndex = Math.min(startIndex + 2 * contextWindowWords, tokenizedText.length - 1);
    tokenizedText = tokenizedText.slice(startIndex, endIndex);
  }
  const slice = tokenizedText.map((tok) => {
    for (const searchTok of tokenizedTerms) {
      if (tok.toLowerCase().includes(searchTok.toLowerCase())) {
        const regex2 = new RegExp(searchTok.toLowerCase(), "gi");
        return tok.replace(regex2, \`<span class="highlight">$&</span>\`);
      }
    }
    return tok;
  }).join(" ");
  return \`\${startIndex === 0 ? "" : "..."}\${slice}\${endIndex === tokenizedText.length - 1 ? "" : "..."}\`;
}
var encoder = (str) => str.toLowerCase().split(/([^a-z]|[^\\x00-\\x7F])/);
var prevShortcutHandler = void 0;
document.addEventListener("nav", async (e) => {
  const currentSlug = e.detail.url;
  const data = await fetchData;
  const container = document.getElementById("search-container");
  const sidebar = container?.closest(".sidebar");
  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.getElementById("search-bar");
  const results = document.getElementById("results-container");
  const resultCards = document.getElementsByClassName("result-card");
  const idDataMap = Object.keys(data);
  function hideSearch() {
    container?.classList.remove("active");
    if (searchBar) {
      searchBar.value = "";
    }
    if (sidebar) {
      sidebar.style.zIndex = "unset";
    }
    if (results) {
      removeAllChildren(results);
    }
    searchType = "basic";
  }
  function showSearch(searchTypeNew) {
    searchType = searchTypeNew;
    if (sidebar) {
      sidebar.style.zIndex = "1";
    }
    container?.classList.add("active");
    searchBar?.focus();
  }
  function shortcutHandler(e2) {
    if (e2.key === "k" && (e2.ctrlKey || e2.metaKey) && !e2.shiftKey) {
      e2.preventDefault();
      const searchBarOpen = container?.classList.contains("active");
      searchBarOpen ? hideSearch() : showSearch("basic");
    } else if (e2.shiftKey && (e2.ctrlKey || e2.metaKey) && e2.key.toLowerCase() === "k") {
      e2.preventDefault();
      const searchBarOpen = container?.classList.contains("active");
      searchBarOpen ? hideSearch() : showSearch("tags");
      if (searchBar)
        searchBar.value = "#";
    }
    if (!container?.classList.contains("active"))
      return;
    else if (e2.key === "Enter") {
      if (results?.contains(document.activeElement)) {
        const active = document.activeElement;
        active.click();
      } else {
        const anchor = document.getElementsByClassName("result-card")[0];
        anchor?.click();
      }
    } else if (e2.key === "ArrowUp" || e2.shiftKey && e2.key === "Tab") {
      e2.preventDefault();
      if (results?.contains(document.activeElement)) {
        const prevResult = document.activeElement?.previousElementSibling;
        prevResult?.focus();
      }
    } else if (e2.key === "ArrowDown" || e2.key === "Tab") {
      e2.preventDefault();
      if (!results?.contains(document.activeElement)) {
        const firstResult = resultCards[0];
        firstResult?.focus();
      } else {
        const nextResult = document.activeElement?.nextElementSibling;
        nextResult?.focus();
      }
    }
  }
  function trimContent(content) {
    const sentences = content.replace(/\\s+/g, " ").split(".");
    let finalDesc = "";
    let sentenceIdx = 0;
    const len = contextWindowWords * 5;
    while (finalDesc.length < len) {
      const sentence = sentences[sentenceIdx];
      if (!sentence)
        break;
      finalDesc += sentence + ".";
      sentenceIdx++;
    }
    if (finalDesc.length < content.length) {
      finalDesc += "..";
    }
    return finalDesc;
  }
  const formatForDisplay = (term, id) => {
    const slug2 = idDataMap[id];
    return {
      id,
      slug: slug2,
      title: searchType === "tags" ? data[slug2].title : highlight(term, data[slug2].title ?? ""),
      // if searchType is tag, display context from start of file and trim, otherwise use regular highlight
      content: searchType === "tags" ? trimContent(data[slug2].content) : highlight(term, data[slug2].content ?? "", true),
      tags: highlightTags(term, data[slug2].tags)
    };
  };
  function highlightTags(term, tags) {
    if (tags && searchType === "tags") {
      const termLower = term.toLowerCase();
      let matching = tags.filter((str) => str.includes(termLower));
      if (matching.length > 0) {
        let difference = tags.filter((x2) => !matching.includes(x2));
        matching = matching.map((tag) => \`<li><p class="match-tag">#\${tag}</p></li>\`);
        difference = difference.map((tag) => \`<li><p>#\${tag}</p></li>\`);
        matching.push(...difference);
      }
      if (tags.length > numTagResults) {
        matching.splice(numTagResults);
      }
      return matching;
    } else {
      return [];
    }
  }
  const resultToHTML = ({ slug: slug2, title, content, tags }) => {
    const htmlTags = tags.length > 0 ? \`<ul>\${tags.join("")}</ul>\` : \`\`;
    const itemTile = document.createElement("a");
    itemTile.classList.add("result-card");
    itemTile.id = slug2;
    itemTile.href = new URL(resolveRelative(currentSlug, slug2), location.toString()).toString();
    itemTile.innerHTML = \`<h3>\${title}</h3>\${htmlTags}<p>\${content}</p>\`;
    itemTile.addEventListener("click", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;
      hideSearch();
    });
    return itemTile;
  };
  function displayResults(finalResults) {
    if (!results)
      return;
    removeAllChildren(results);
    if (finalResults.length === 0) {
      results.innerHTML = \`<a class="result-card">
                    <h3>No results.</h3>
                    <p>Try another search term?</p>
                </a>\`;
    } else {
      results.append(...finalResults.map(resultToHTML));
    }
  }
  async function onType(e2) {
    let term = e2.target.value;
    let searchResults;
    if (term.toLowerCase().startsWith("#")) {
      searchType = "tags";
    } else {
      searchType = "basic";
    }
    switch (searchType) {
      case "tags": {
        term = term.substring(1);
        searchResults = await index?.searchAsync({ query: term, limit: numSearchResults, index: ["tags"] }) ?? [];
        break;
      }
      case "basic":
      default: {
        searchResults = await index?.searchAsync({
          query: term,
          limit: numSearchResults,
          index: ["title", "content"]
        }) ?? [];
      }
    }
    const getByField = (field) => {
      const results2 = searchResults.filter((x2) => x2.field === field);
      return results2.length === 0 ? [] : [...results2[0].result];
    };
    const allIds = /* @__PURE__ */ new Set([
      ...getByField("title"),
      ...getByField("content"),
      ...getByField("tags")
    ]);
    const finalResults = [...allIds].map((id) => formatForDisplay(term, id));
    displayResults(finalResults);
  }
  if (prevShortcutHandler) {
    document.removeEventListener("keydown", prevShortcutHandler);
  }
  document.addEventListener("keydown", shortcutHandler);
  prevShortcutHandler = shortcutHandler;
  searchIcon?.removeEventListener("click", () => showSearch("basic"));
  searchIcon?.addEventListener("click", () => showSearch("basic"));
  searchBar?.removeEventListener("input", onType);
  searchBar?.addEventListener("input", onType);
  if (!index) {
    index = new import_flexsearch.Document({
      charset: "latin:extra",
      optimize: true,
      encode: encoder,
      document: {
        id: "id",
        index: [
          {
            field: "title",
            tokenize: "reverse"
          },
          {
            field: "content",
            tokenize: "reverse"
          },
          {
            field: "tags",
            tokenize: "reverse"
          }
        ]
      }
    });
    fillDocument(index, data);
  }
  registerEscapeHandler(container, hideSearch);
});
async function fillDocument(index2, data) {
  let id = 0;
  for (const [slug2, fileData] of Object.entries(data)) {
    await index2.addAsync(id, {
      id,
      slug: slug2,
      title: fileData.title,
      content: fileData.content,
      tags: fileData.tags
    });
    id++;
  }
}
`;import{jsx as jsx25,jsxs as jsxs14}from"preact/jsx-runtime";var Search_default=__name(()=>{function Search({displayClass}){return jsxs14("div",{class:`search ${displayClass??""}`,children:[jsxs14("div",{id:"search-icon",children:[jsx25("p",{children:"Search"}),jsx25("div",{}),jsxs14("svg",{tabIndex:0,"aria-labelledby":"title desc",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19.9 19.7",children:[jsx25("title",{id:"title",children:"Search"}),jsx25("desc",{id:"desc",children:"Search"}),jsxs14("g",{class:"search-path",fill:"none",children:[jsx25("path",{"stroke-linecap":"square",d:"M18.5 18.3l-5.4-5.4"}),jsx25("circle",{cx:"8",cy:"8",r:"7"})]})]})]}),jsx25("div",{id:"search-container",children:jsxs14("div",{id:"search-space",children:[jsx25("input",{autocomplete:"off",id:"search-bar",name:"search",type:"text","aria-label":"Search for something",placeholder:"Search for something"}),jsx25("div",{id:"results-container"})]})})]})}return __name(Search,"Search"),Search.afterDOMLoaded=search_inline_default,Search.css=search_default,Search},"default");var footer_default=`footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}
footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: -1rem;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImZvb3Rlci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJmb290ZXIge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBtYXJnaW4tYm90dG9tOiA0cmVtO1xuICBvcGFjaXR5OiAwLjc7XG5cbiAgJiB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgZ2FwOiAxcmVtO1xuICAgIG1hcmdpbi10b3A6IC0xcmVtO1xuICB9XG59XG4iXX0= */`;var version="4.1.5";import{jsx as jsx26,jsxs as jsxs15}from"preact/jsx-runtime";var Footer_default=__name(opts=>{function Footer({displayClass}){let year=new Date().getFullYear(),links=opts?.links??[];return jsxs15("footer",{class:`${displayClass??""}`,children:[jsx26("hr",{}),jsxs15("p",{children:["Created with ",jsxs15("a",{href:"https://quartz.jzhao.xyz/",children:["Quartz v",version]}),", \xA9 ",year]}),jsx26("ul",{children:Object.entries(links).map(([text,link])=>jsx26("li",{children:jsx26("a",{href:link,children:text})}))})]})}return __name(Footer,"Footer"),Footer.css=footer_default,Footer},"default");import{Fragment as Fragment4,jsx as jsx27}from"preact/jsx-runtime";var DesktopOnly_default=__name(component=>{if(component){let DesktopOnly2=function(props){return jsx27(Component,{displayClass:"desktop-only",...props})};var DesktopOnly=DesktopOnly2;__name(DesktopOnly2,"DesktopOnly");let Component=component;return DesktopOnly2.displayName=component.displayName,DesktopOnly2.afterDOMLoaded=component?.afterDOMLoaded,DesktopOnly2.beforeDOMLoaded=component?.beforeDOMLoaded,DesktopOnly2.css=component?.css,DesktopOnly2}else return()=>jsx27(Fragment4,{})},"default");import{Fragment as Fragment5,jsx as jsx28}from"preact/jsx-runtime";var MobileOnly_default=__name(component=>{if(component){let MobileOnly2=function(props){return jsx28(Component,{displayClass:"mobile-only",...props})};var MobileOnly=MobileOnly2;__name(MobileOnly2,"MobileOnly");let Component=component;return MobileOnly2.displayName=component.displayName,MobileOnly2.afterDOMLoaded=component?.afterDOMLoaded,MobileOnly2.beforeDOMLoaded=component?.beforeDOMLoaded,MobileOnly2.css=component?.css,MobileOnly2}else return()=>jsx28(Fragment5,{})},"default");var recentNotes_default=`.recent-notes > h3 {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}
.recent-notes > ul.recent-ul {
  list-style: none;
  margin-top: 1rem;
  padding-left: 0;
}
.recent-notes > ul.recent-ul > li {
  margin: 1rem 0;
}
.recent-notes > ul.recent-ul > li .section > .desc > h3 > a {
  background-color: transparent;
}
.recent-notes > ul.recent-ul > li .section > .meta {
  margin: 0 0 0.5rem 0;
  opacity: 0.6;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbInJlY2VudE5vdGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBQ0E7RUFDRTs7QUFHRjtFQUNFO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIucmVjZW50LW5vdGVzIHtcbiAgJiA+IGgzIHtcbiAgICBtYXJnaW46IDAuNXJlbSAwIDAgMDtcbiAgICBmb250LXNpemU6IDFyZW07XG4gIH1cblxuICAmID4gdWwucmVjZW50LXVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuXG4gICAgJiA+IGxpIHtcbiAgICAgIG1hcmdpbjogMXJlbSAwO1xuICAgICAgLnNlY3Rpb24gPiAuZGVzYyA+IGgzID4gYSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgfVxuXG4gICAgICAuc2VjdGlvbiA+IC5tZXRhIHtcbiAgICAgICAgbWFyZ2luOiAwIDAgMC41cmVtIDA7XG4gICAgICAgIG9wYWNpdHk6IDAuNjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;import{jsx as jsx29,jsxs as jsxs16}from"preact/jsx-runtime";var defaultOptions11=__name(cfg=>({title:"Recent Notes",limit:3,linkToMore:!1,filter:()=>!0,sort:byDateAndAlphabetical(cfg)}),"defaultOptions"),RecentNotes_default=__name(userOpts=>{function RecentNotes({allFiles,fileData,displayClass,cfg}){let opts={...defaultOptions11(cfg),...userOpts},pages=allFiles.filter(opts.filter).sort(opts.sort),remaining=Math.max(0,pages.length-opts.limit);return jsxs16("div",{class:`recent-notes ${displayClass??""}`,children:[jsx29("h3",{children:opts.title}),jsx29("ul",{class:"recent-ul",children:pages.slice(0,opts.limit).map(page=>{let title=page.frontmatter?.title,tags=page.frontmatter?.tags??[];return jsx29("li",{class:"recent-li",children:jsxs16("div",{class:"section",children:[jsx29("div",{class:"desc",children:jsx29("h3",{children:jsx29("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),page.dates&&jsx29("p",{class:"meta",children:jsx29(Date2,{date:getDate(cfg,page)})}),jsx29("ul",{class:"tags",children:tags.map(tag=>jsx29("li",{children:jsxs16("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:["#",tag]})}))})]})})})}),opts.linkToMore&&remaining>0&&jsx29("p",{children:jsxs16("a",{href:resolveRelative(fileData.slug,opts.linkToMore),children:["See ",remaining," more \u2192"]})})]})}return __name(RecentNotes,"RecentNotes"),RecentNotes.css=recentNotes_default,RecentNotes},"default");var breadcrumbs_default=`.breadcrumb-container {
  margin: 0;
  margin-top: 0.75rem;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.breadcrumb-element {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.breadcrumb-element p {
  margin: 0;
  margin-left: 0.5rem;
  padding: 0;
  line-height: normal;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImJyZWFkY3J1bWJzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFPRTtFQUNBO0VBQ0E7RUFDQTs7QUFUQTtFQUNFO0VBQ0E7RUFDQTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLmJyZWFkY3J1bWItY29udGFpbmVyIHtcbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tdG9wOiAwLjc1cmVtO1xuICBwYWRkaW5nOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMC41cmVtO1xufVxuXG4uYnJlYWRjcnVtYi1lbGVtZW50IHtcbiAgcCB7XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gICAgcGFkZGluZzogMDtcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICB9XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuIl19 */`;import{Fragment as Fragment6,jsx as jsx30,jsxs as jsxs17}from"preact/jsx-runtime";var defaultOptions12={spacerSymbol:"\u276F",rootName:"Home",resolveFrontmatterTitle:!0,hideOnRoot:!0,showCurrentPage:!0};function formatCrumb(displayName,baseSlug,currentSlug){return{displayName:displayName.replaceAll("-"," "),path:resolveRelative(baseSlug,currentSlug)}}__name(formatCrumb,"formatCrumb");var Breadcrumbs_default=__name(opts=>{let options2={...defaultOptions12,...opts},folderIndex;function Breadcrumbs({fileData,allFiles,displayClass}){if(options2.hideOnRoot&&fileData.slug==="index")return jsx30(Fragment6,{});let crumbs=[formatCrumb(options2.rootName,fileData.slug,"/")];if(!folderIndex&&options2.resolveFrontmatterTitle){folderIndex=new Map;for(let file of allFiles)if(file.slug?.endsWith("index")){let folderName=file.slug?.split("/")?.at(-2);folderName&&folderIndex.set(folderName,file)}}let slugParts=fileData.slug?.split("/");if(slugParts){let currentPath="";for(let i=0;i<slugParts.length-1;i++){let curPathSegment=slugParts[i],currentFile=folderIndex?.get(curPathSegment);if(currentFile){let title=currentFile.frontmatter.title;title!=="index"&&(curPathSegment=title)}currentPath+=slugParts[i]+"/";let crumb=formatCrumb(curPathSegment,fileData.slug,currentPath);crumbs.push(crumb)}options2.showCurrentPage&&slugParts.at(-1)!=="index"&&crumbs.push({displayName:fileData.frontmatter.title,path:""})}return jsx30("nav",{class:`breadcrumb-container ${displayClass??""}`,"aria-label":"breadcrumbs",children:crumbs.map((crumb,index)=>jsxs17("div",{class:"breadcrumb-element",children:[jsx30("a",{href:crumb.path,children:crumb.displayName}),index!==crumbs.length-1&&jsx30("p",{children:` ${options2.spacerSymbol} `})]}))})}return __name(Breadcrumbs,"Breadcrumbs"),Breadcrumbs.css=breadcrumbs_default,Breadcrumbs},"default");var sharedPageComponents={head:Head_default(),header:[],footer:Footer_default({links:{}})},sortFn=__name((a,b)=>!a.file&&!b.file?a.displayName.localeCompare(b.displayName):a.file&&b.file?b.file.dates?.created.getTime()-a.file.dates?.created.getTime():a.file&&!b.file?-1:1,"sortFn"),mapFn=__name(node=>{node.depth>0&&(node.file?node.displayName="\u{1F4DD} "+node.displayName:node.displayName="\u{1F4C1} "+node.displayName)},"mapFn"),defaultContentPageLayout={beforeBody:[MobileOnly_default(Explorer_default({sortFn,mapFn,folderDefaultState:"collapsed",useSavedState:!1})),Breadcrumbs_default(),ArticleTitle_default(),ContentMeta_default(),TagList_default()],left:[PageTitle_default(),MobileOnly_default(Spacer_default()),DesktopOnly_default(Search_default()),Darkmode_default(),DesktopOnly_default(RecentNotes_default()),DesktopOnly_default(Explorer_default({sortFn,mapFn}))],right:[DesktopOnly_default(TableOfContents_default()),Backlinks_default()]},defaultListPageLayout={beforeBody:[ArticleTitle_default()],left:[PageTitle_default(),MobileOnly_default(Spacer_default()),Search_default(),Darkmode_default()],right:[]};import chalk4 from"chalk";import path6 from"path";import fs2 from"fs";var write=__name(async({ctx,slug,ext,content})=>{let pathToPage=joinSegments(ctx.argv.output,slug+ext),dir=path6.dirname(pathToPage);return await fs2.promises.mkdir(dir,{recursive:!0}),await fs2.promises.writeFile(pathToPage,content),pathToPage},"write");var ContentPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultContentPageLayout,pageBody:Content_default(),...userOpts},{head:Head,header,beforeBody,pageBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"ContentPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...left,...right,Footer]},async emit(ctx,content,resources){let cfg=ctx.cfg.configuration,fps=[],allFiles=content.map(c=>c[1].data),containsIndex=!1;for(let[tree,file]of content){let slug=file.data.slug;slug==="index"&&(containsIndex=!0);let externalResources=pageResources(pathToRoot(slug),resources),componentData={fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content2=renderPage(slug,componentData,opts,externalResources),fp=await write({ctx,content:content2,slug,ext:".html"});fps.push(fp)}return containsIndex||console.log(chalk4.yellow(`
Warning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder. This may cause errors when deploying.`)),fps}}},"ContentPage");import{VFile}from"vfile";function defaultProcessedContent(vfileData){let root={type:"root",children:[]},vfile=new VFile("");return vfile.data=vfileData,[root,vfile]}__name(defaultProcessedContent,"defaultProcessedContent");var TagPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:TagContent_default(),...userOpts},{head:Head,header,beforeBody,pageBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"TagPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...left,...right,Footer]},async emit(ctx,content,resources){let fps=[],allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,tags=new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes));tags.add("index");let tagDescriptions=Object.fromEntries([...tags].map(tag=>{let title=tag==="index"?"Tag Index":`Tag: #${tag}`;return[tag,defaultProcessedContent({slug:joinSegments("tags",tag),frontmatter:{title,tags:[]}})]}));for(let[tree,file]of content){let slug=file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);tags.has(tag)&&(tagDescriptions[tag]=[tree,file])}}for(let tag of tags){let slug=joinSegments("tags",tag),externalResources=pageResources(pathToRoot(slug),resources),[tree,file]=tagDescriptions[tag],componentData={fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content2=renderPage(slug,componentData,opts,externalResources),fp=await write({ctx,content:content2,slug:file.data.slug,ext:".html"});fps.push(fp)}return fps}}},"TagPage");import path7 from"path";var FolderPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:FolderContent_default(),...userOpts},{head:Head,header,beforeBody,pageBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"FolderPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...left,...right,Footer]},async emit(ctx,content,resources){let fps=[],allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,folders=new Set(allFiles.flatMap(data=>{let slug=data.slug,folderName=path7.dirname(slug??"");return slug&&folderName!=="."&&folderName!=="tags"?[folderName]:[]})),folderDescriptions=Object.fromEntries([...folders].map(folder=>[folder,defaultProcessedContent({slug:joinSegments(folder,"index"),frontmatter:{title:`Folder: ${folder}`,tags:[]}})]));for(let[tree,file]of content){let slug=_stripSlashes(simplifySlug(file.data.slug));folders.has(slug)&&(folderDescriptions[slug]=[tree,file])}for(let folder of folders){let slug=joinSegments(folder,"index"),externalResources=pageResources(pathToRoot(slug),resources),[tree,file]=folderDescriptions[folder],componentData={fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content2=renderPage(slug,componentData,opts,externalResources),fp=await write({ctx,content:content2,slug,ext:".html"});fps.push(fp)}return fps}}},"FolderPage");import{toHtml as toHtml2}from"hast-util-to-html";var defaultOptions13={enableSiteMap:!0,enableRSS:!0,rssLimit:10,rssFullHtml:!1,includeEmptyFiles:!0};function generateSiteMap(cfg,idx){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<url>
    <loc>https://${joinSegments(base,encodeURI(slug))}</loc>
    <lastmod>${content.date?.toISOString()}</lastmod>
  </url>`,"createURLEntry");return`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Array.from(idx).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).join("")}</urlset>`}__name(generateSiteMap,"generateSiteMap");function generateRSSFeed(cfg,idx,limit){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base,encodeURI(slug))}</link>
    <guid>https://${joinSegments(base,encodeURI(slug))}</guid>
    <description>${content.richContent??content.description}</description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`,"createURLEntry"),items=Array.from(idx).sort(([_,f1],[__,f2])=>f1.date&&f2.date?f2.date.getTime()-f1.date.getTime():f1.date&&!f2.date?-1:!f1.date&&f2.date?1:f1.title.localeCompare(f2.title)).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).slice(0,limit??idx.size).join("");return`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>${limit?`Last ${limit} notes`:"Recent notes"} on ${escapeHTML(cfg.pageTitle)}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`}__name(generateRSSFeed,"generateRSSFeed");var ContentIndex=__name(opts=>(opts={...defaultOptions13,...opts},{name:"ContentIndex",async emit(ctx,content,_resources){let cfg=ctx.cfg.configuration,emitted=[],linkIndex=new Map;for(let[tree,file]of content){let slug=file.data.slug,date=getDate(ctx.cfg.configuration,file.data)??new Date;(opts?.includeEmptyFiles||file.data.text&&file.data.text!=="")&&linkIndex.set(slug,{title:file.data.frontmatter?.title,links:file.data.links??[],tags:file.data.frontmatter?.tags??[],content:file.data.text??"",richContent:opts?.rssFullHtml?escapeHTML(toHtml2(tree,{allowDangerousHtml:!0})):void 0,date,description:file.data.description??""})}opts?.enableSiteMap&&emitted.push(await write({ctx,content:generateSiteMap(cfg,linkIndex),slug:"sitemap",ext:".xml"})),opts?.enableRSS&&emitted.push(await write({ctx,content:generateRSSFeed(cfg,linkIndex,opts.rssLimit),slug:"index",ext:".xml"}));let fp=joinSegments("static","contentIndex"),simplifiedIndex=Object.fromEntries(Array.from(linkIndex).map(([slug,content2])=>(delete content2.description,delete content2.date,[slug,content2])));return emitted.push(await write({ctx,content:JSON.stringify(simplifiedIndex),slug:fp,ext:".json"})),emitted},getQuartzComponents:()=>[]}),"ContentIndex");import path8 from"path";var AliasRedirects=__name(()=>({name:"AliasRedirects",getQuartzComponents(){return[]},async emit(ctx,content,_resources){let{argv}=ctx,fps=[];for(let[_tree,file]of content){let ogSlug=simplifySlug(file.data.slug),dir=path8.posix.relative(argv.directory,path8.dirname(file.data.filePath)),aliases=file.data.frontmatter?.aliases??file.data.frontmatter?.alias??[];typeof aliases=="string"&&(aliases=[aliases]);let slugs=aliases.map(alias=>path8.posix.join(dir,alias)),permalink=file.data.frontmatter?.permalink;typeof permalink=="string"&&slugs.push(permalink);for(let slug of slugs){slug.endsWith("/")&&(slug=joinSegments(slug,"index"));let redirUrl=resolveRelative(slug,file.data.slug),fp=await write({ctx,content:`
            <!DOCTYPE html>
            <html lang="en-us">
            <head>
            <title>${ogSlug}</title>
            <link rel="canonical" href="${redirUrl}">
            <meta name="robots" content="noindex">
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0; url=${redirUrl}">
            </head>
            </html>
            `,slug,ext:".html"});fps.push(fp)}}return fps}}),"AliasRedirects");import path10 from"path";import fs3 from"fs";import path9 from"path";import{globby}from"globby";function toPosixPath(fp){return fp.split(path9.sep).join("/")}__name(toPosixPath,"toPosixPath");async function glob(pattern,cwd,ignorePatterns){return(await globby(pattern,{cwd,ignore:ignorePatterns,gitignore:!0})).map(toPosixPath)}__name(glob,"glob");var Assets=__name(()=>({name:"Assets",getQuartzComponents(){return[]},async emit({argv,cfg},_content,_resources){let assetsPath=argv.output,fps=await glob("**",argv.directory,["**/*.md",...cfg.configuration.ignorePatterns]),res=[];for(let fp of fps){let ext=path10.extname(fp),src=joinSegments(argv.directory,fp),name=slugifyFilePath(fp,!0)+ext,dest=joinSegments(assetsPath,name),dir=path10.dirname(dest);await fs3.promises.mkdir(dir,{recursive:!0}),await fs3.promises.copyFile(src,dest),res.push(dest)}return res}}),"Assets");import fs4 from"fs";var Static=__name(()=>({name:"Static",getQuartzComponents(){return[]},async emit({argv,cfg},_content,_resources){let staticPath=joinSegments(QUARTZ,"static"),fps=await glob("**",staticPath,cfg.configuration.ignorePatterns);return await fs4.promises.cp(staticPath,joinSegments(argv.output,"static"),{recursive:!0,dereference:!0}),fps.map(fp=>joinSegments(argv.output,"static",fp))}}),"Static");var spa_inline_default=`var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/rfdc/index.js
var require_rfdc = __commonJS({
  "node_modules/rfdc/index.js"(exports, module) {
    "use strict";
    module.exports = rfdc2;
    function copyBuffer(cur) {
      if (cur instanceof Buffer) {
        return Buffer.from(cur);
      }
      return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
    }
    function rfdc2(opts) {
      opts = opts || {};
      if (opts.circles)
        return rfdcCircles(opts);
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a, fn) {
        var keys = Object.keys(a);
        var a2 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a[k];
          if (typeof cur !== "object" || cur === null) {
            a2[k] = cur;
          } else if (cur instanceof Date) {
            a2[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            a2[k] = fn(cur);
          }
        }
        return a2;
      }
      function clone2(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, clone2);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), clone2));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), clone2));
        var o2 = {};
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false)
            continue;
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone2));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone2));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = clone2(cur);
          }
        }
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = cloneProto(cur);
          }
        }
        return o2;
      }
    }
    function rfdcCircles(opts) {
      var refs = [];
      var refsNew = [];
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a, fn) {
        var keys = Object.keys(a);
        var a2 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a[k];
          if (typeof cur !== "object" || cur === null) {
            a2[k] = cur;
          } else if (cur instanceof Date) {
            a2[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            var index = refs.indexOf(cur);
            if (index !== -1) {
              a2[k] = refsNew[index];
            } else {
              a2[k] = fn(cur);
            }
          }
        }
        return a2;
      }
      function clone2(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, clone2);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), clone2));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), clone2));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false)
            continue;
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone2));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone2));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = clone2(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = cloneProto(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
    }
  }
});

// node_modules/micromorph/dist/index.js
var T = (e) => (t, r) => t[\`node\${e}\`] === r[\`node\${e}\`];
var b = T("Name");
var C = T("Type");
var g = T("Value");
function M(e, t) {
  if (e.attributes.length === 0 && t.attributes.length === 0)
    return [];
  let r = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  for (let s of e.attributes)
    n.set(s.name, s.value);
  for (let s of t.attributes) {
    let a = n.get(s.name);
    s.value === a ? n.delete(s.name) : (typeof a < "u" && n.delete(s.name), o.set(s.name, s.value));
  }
  for (let s of n.keys())
    r.push({ type: 5, name: s });
  for (let [s, a] of o.entries())
    r.push({ type: 4, name: s, value: a });
  return r;
}
function N(e, t = true) {
  let r = \`\${e.localName}\`;
  for (let { name: n, value: o } of e.attributes)
    t && n.startsWith("data-") || (r += \`[\${n}=\${o}]\`);
  return r += e.innerHTML, r;
}
function h(e) {
  switch (e.tagName) {
    case "BASE":
    case "TITLE":
      return e.localName;
    case "META": {
      if (e.hasAttribute("name"))
        return \`meta[name="\${e.getAttribute("name")}"]\`;
      if (e.hasAttribute("property"))
        return \`meta[name="\${e.getAttribute("property")}"]\`;
      break;
    }
    case "LINK": {
      if (e.hasAttribute("rel") && e.hasAttribute("href"))
        return \`link[rel="\${e.getAttribute("rel")}"][href="\${e.getAttribute("href")}"]\`;
      if (e.hasAttribute("href"))
        return \`link[href="\${e.getAttribute("href")}"]\`;
      break;
    }
  }
  return N(e);
}
function x(e) {
  let [t, r = ""] = e.split("?");
  return \`\${t}?t=\${Date.now()}&\${r.replace(/t=\\d+/g, "")}\`;
}
function c(e) {
  if (e.nodeType === 1 && e.hasAttribute("data-persist"))
    return e;
  if (e.nodeType === 1 && e.localName === "script") {
    let t = document.createElement("script");
    for (let { name: r, value: n } of e.attributes)
      r === "src" && (n = x(n)), t.setAttribute(r, n);
    return t.innerHTML = e.innerHTML, t;
  }
  return e.cloneNode(true);
}
function R(e, t) {
  if (e.children.length === 0 && t.children.length === 0)
    return [];
  let r = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let a of e.children)
    n.set(h(a), a);
  for (let a of t.children) {
    let i = h(a), u = n.get(i);
    u ? N(a, false) !== N(u, false) && o.set(i, c(a)) : s.set(i, c(a)), n.delete(i);
  }
  for (let a of e.childNodes) {
    if (a.nodeType === 1) {
      let i = h(a);
      if (n.has(i)) {
        r.push({ type: 1 });
        continue;
      } else if (o.has(i)) {
        let u = o.get(i);
        r.push({ type: 3, attributes: M(a, u), children: I(a, u) });
        continue;
      }
    }
    r.push(void 0);
  }
  for (let a of s.values())
    r.push({ type: 0, node: c(a) });
  return r;
}
function I(e, t) {
  let r = [], n = Math.max(e.childNodes.length, t.childNodes.length);
  for (let o = 0; o < n; o++) {
    let s = e.childNodes.item(o), a = t.childNodes.item(o);
    r[o] = p(s, a);
  }
  return r;
}
function p(e, t) {
  if (!e)
    return { type: 0, node: c(t) };
  if (!t)
    return { type: 1 };
  if (C(e, t)) {
    if (e.nodeType === 3) {
      let r = e.nodeValue, n = t.nodeValue;
      if (r.trim().length === 0 && n.trim().length === 0)
        return;
    }
    if (e.nodeType === 1) {
      if (b(e, t)) {
        let r = e.tagName === "HEAD" ? R : I;
        return { type: 3, attributes: M(e, t), children: r(e, t) };
      }
      return { type: 2, node: c(t) };
    } else
      return e.nodeType === 9 ? p(e.documentElement, t.documentElement) : g(e, t) ? void 0 : { type: 2, value: t.nodeValue };
  }
  return { type: 2, node: c(t) };
}
function $(e, t) {
  if (t.length !== 0)
    for (let { type: r, name: n, value: o } of t)
      r === 5 ? e.removeAttribute(n) : r === 4 && e.setAttribute(n, o);
}
async function O(e, t, r) {
  if (!t)
    return;
  let n;
  switch (e.nodeType === 9 ? (e = e.documentElement, n = e) : r ? n = r : n = e, t.type) {
    case 0: {
      let { node: o } = t;
      e.appendChild(o);
      return;
    }
    case 1: {
      if (!n)
        return;
      e.removeChild(n);
      return;
    }
    case 2: {
      if (!n)
        return;
      let { node: o, value: s } = t;
      if (typeof s == "string") {
        n.nodeValue = s;
        return;
      }
      n.replaceWith(o);
      return;
    }
    case 3: {
      if (!n)
        return;
      let { attributes: o, children: s } = t;
      $(n, o);
      let a = Array.from(n.childNodes);
      await Promise.all(s.map((i, u) => O(n, i, a[u])));
      return;
    }
  }
}
function P(e, t) {
  let r = p(e, t);
  return O(e, r);
}

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
var import_rfdc = __toESM(require_rfdc(), 1);
var clone = (0, import_rfdc.default)();
function getFullSlug(window2) {
  const res = window2.document.body.dataset.slug;
  return res;
}
var _rebaseHtmlElement = (el, attr, newBase) => {
  const rebased = new URL(el.getAttribute(attr), newBase);
  el.setAttribute(attr, rebased.pathname + rebased.hash);
};
function normalizeRelativeURLs(el, destination) {
  el.querySelectorAll('[href^="./"], [href^="../"]').forEach(
    (item) => _rebaseHtmlElement(item, "href", destination)
  );
  el.querySelectorAll('[src^="./"], [src^="../"]').forEach(
    (item) => _rebaseHtmlElement(item, "src", destination)
  );
}

// quartz/components/scripts/quartz/components/scripts/spa.inline.ts
var NODE_TYPE_ELEMENT = 1;
var announcer = document.createElement("route-announcer");
var isElement = (target) => target?.nodeType === NODE_TYPE_ELEMENT;
var isLocalUrl = (href) => {
  try {
    const url = new URL(href);
    if (window.location.origin === url.origin) {
      return true;
    }
  } catch (e) {
  }
  return false;
};
var isSamePage = (url) => {
  const sameOrigin = url.origin === window.location.origin;
  const samePath = url.pathname === window.location.pathname;
  return sameOrigin && samePath;
};
var getOpts = ({ target }) => {
  if (!isElement(target))
    return;
  if (target.attributes.getNamedItem("target")?.value === "_blank")
    return;
  const a = target.closest("a");
  if (!a)
    return;
  if ("routerIgnore" in a.dataset)
    return;
  const { href } = a;
  if (!isLocalUrl(href))
    return;
  return { url: new URL(href), scroll: "routerNoscroll" in a.dataset ? false : void 0 };
};
function notifyNav(url) {
  const event = new CustomEvent("nav", { detail: { url } });
  document.dispatchEvent(event);
}
var p2;
async function navigate(url, isBack = false) {
  p2 = p2 || new DOMParser();
  const contents = await fetch(\`\${url}\`).then((res) => {
    const contentType = res.headers.get("content-type");
    if (contentType?.startsWith("text/html")) {
      return res.text();
    } else {
      window.location.assign(url);
    }
  }).catch(() => {
    window.location.assign(url);
  });
  if (!contents)
    return;
  const html = p2.parseFromString(contents, "text/html");
  normalizeRelativeURLs(html, url);
  let title = html.querySelector("title")?.textContent;
  if (title) {
    document.title = title;
  } else {
    const h1 = document.querySelector("h1");
    title = h1?.innerText ?? h1?.textContent ?? url.pathname;
  }
  if (announcer.textContent !== title) {
    announcer.textContent = title;
  }
  announcer.dataset.persist = "";
  html.body.appendChild(announcer);
  P(document.body, html.body);
  if (!isBack) {
    if (url.hash) {
      const el = document.getElementById(decodeURIComponent(url.hash.substring(1)));
      el?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0 });
    }
  }
  const elementsToRemove = document.head.querySelectorAll(":not([spa-preserve])");
  elementsToRemove.forEach((el) => el.remove());
  const elementsToAdd = html.head.querySelectorAll(":not([spa-preserve])");
  elementsToAdd.forEach((el) => document.head.appendChild(el));
  if (!isBack) {
    history.pushState({}, "", url);
  }
  notifyNav(getFullSlug(window));
  delete announcer.dataset.persist;
}
window.spaNavigate = navigate;
function createRouter() {
  if (typeof window !== "undefined") {
    window.addEventListener("click", async (event) => {
      const { url } = getOpts(event) ?? {};
      if (!url || event.ctrlKey || event.metaKey)
        return;
      event.preventDefault();
      if (isSamePage(url) && url.hash) {
        const el = document.getElementById(decodeURIComponent(url.hash.substring(1)));
        el?.scrollIntoView();
        history.pushState({}, "", url);
        return;
      }
      try {
        navigate(url, false);
      } catch (e) {
        window.location.assign(url);
      }
    });
    window.addEventListener("popstate", (event) => {
      const { url } = getOpts(event) ?? {};
      if (window.location.hash && window.location.pathname === url?.pathname)
        return;
      try {
        navigate(new URL(window.location.toString()), true);
      } catch (e) {
        window.location.reload();
      }
      return;
    });
  }
  return new class Router {
    go(pathname) {
      const url = new URL(pathname, window.location.toString());
      return navigate(url, false);
    }
    back() {
      return window.history.back();
    }
    forward() {
      return window.history.forward();
    }
  }();
}
createRouter();
notifyNav(getFullSlug(window));
if (!customElements.get("route-announcer")) {
  const attrs = {
    "aria-live": "assertive",
    "aria-atomic": "true",
    style: "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"
  };
  customElements.define(
    "route-announcer",
    class RouteAnnouncer extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        for (const [key, value] of Object.entries(attrs)) {
          this.setAttribute(key, value);
        }
      }
    }
  );
}
`;var popover_inline_default=`var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/rfdc/index.js
var require_rfdc = __commonJS({
  "node_modules/rfdc/index.js"(exports, module) {
    "use strict";
    module.exports = rfdc2;
    function copyBuffer(cur) {
      if (cur instanceof Buffer) {
        return Buffer.from(cur);
      }
      return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
    }
    function rfdc2(opts) {
      opts = opts || {};
      if (opts.circles)
        return rfdcCircles(opts);
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a, fn) {
        var keys = Object.keys(a);
        var a2 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a[k];
          if (typeof cur !== "object" || cur === null) {
            a2[k] = cur;
          } else if (cur instanceof Date) {
            a2[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            a2[k] = fn(cur);
          }
        }
        return a2;
      }
      function clone2(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, clone2);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), clone2));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), clone2));
        var o2 = {};
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false)
            continue;
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone2));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone2));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = clone2(cur);
          }
        }
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = cloneProto(cur);
          }
        }
        return o2;
      }
    }
    function rfdcCircles(opts) {
      var refs = [];
      var refsNew = [];
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a, fn) {
        var keys = Object.keys(a);
        var a2 = new Array(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var cur = a[k];
          if (typeof cur !== "object" || cur === null) {
            a2[k] = cur;
          } else if (cur instanceof Date) {
            a2[k] = new Date(cur);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            var index = refs.indexOf(cur);
            if (index !== -1) {
              a2[k] = refsNew[index];
            } else {
              a2[k] = fn(cur);
            }
          }
        }
        return a2;
      }
      function clone2(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, clone2);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), clone2));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), clone2));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          if (Object.hasOwnProperty.call(o, k) === false)
            continue;
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), clone2));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), clone2));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = clone2(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null)
          return o;
        if (o instanceof Date)
          return new Date(o);
        if (Array.isArray(o))
          return cloneArray(o, cloneProto);
        if (o instanceof Map)
          return new Map(cloneArray(Array.from(o), cloneProto));
        if (o instanceof Set)
          return new Set(cloneArray(Array.from(o), cloneProto));
        var o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (var k in o) {
          var cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur instanceof Date) {
            o2[k] = new Date(cur);
          } else if (cur instanceof Map) {
            o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
          } else if (cur instanceof Set) {
            o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            var i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = cloneProto(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
    }
  }
});

// node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var round = Math.round;
var createCoords = (v) => ({
  x: v,
  y: v
});
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}

// node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getBoundingRect(rects) {
  const minX = min(...rects.map((rect) => rect.left));
  const minY = min(...rects.map((rect) => rect.top));
  const maxX = max(...rects.map((rect) => rect.right));
  const maxY = max(...rects.map((rect) => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
}
var inline = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "inline",
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform: platform2,
        strategy
      } = state;
      const {
        padding = 2,
        x,
        y
      } = evaluate(options, state);
      const nativeClientRects = Array.from(await (platform2.getClientRects == null ? void 0 : platform2.getClientRects(elements.reference)) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
      const paddingObject = getPaddingObject(padding);
      function getBoundingClientRect2() {
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          return clientRects.find((rect) => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }
        if (clientRects.length >= 2) {
          if (getSideAxis(placement) === "y") {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = getSide(placement) === "top";
            const top2 = firstRect.top;
            const bottom2 = lastRect.bottom;
            const left2 = isTop ? firstRect.left : lastRect.left;
            const right2 = isTop ? firstRect.right : lastRect.right;
            const width2 = right2 - left2;
            const height2 = bottom2 - top2;
            return {
              top: top2,
              bottom: bottom2,
              left: left2,
              right: right2,
              width: width2,
              height: height2,
              x: left2,
              y: top2
            };
          }
          const isLeftSide = getSide(placement) === "left";
          const maxRight = max(...clientRects.map((rect) => rect.right));
          const minLeft = min(...clientRects.map((rect) => rect.left));
          const measureRects = clientRects.filter((rect) => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform2.getElementRects({
        reference: {
          getBoundingClientRect: getBoundingClientRect2
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};

// node_modules/@floating-ui/utils/dom/dist/floating-ui.utils.dom.mjs
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle(element);
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports)
    return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}

// node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
var noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  return getCssDimensions(element);
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
var getElementRects = async function(_ref) {
  let {
    reference,
    floating,
    strategy
  } = _ref;
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
    floating: {
      x: 0,
      y: 0,
      ...await getDimensionsFn(floating)
    }
  };
};
function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
var import_rfdc = __toESM(require_rfdc(), 1);
var clone = (0, import_rfdc.default)();
var _rebaseHtmlElement = (el, attr, newBase) => {
  const rebased = new URL(el.getAttribute(attr), newBase);
  el.setAttribute(attr, rebased.pathname + rebased.hash);
};
function normalizeRelativeURLs(el, destination) {
  el.querySelectorAll('[href^="./"], [href^="../"]').forEach(
    (item) => _rebaseHtmlElement(item, "href", destination)
  );
  el.querySelectorAll('[src^="./"], [src^="../"]').forEach(
    (item) => _rebaseHtmlElement(item, "src", destination)
  );
}

// quartz/components/scripts/quartz/components/scripts/popover.inline.ts
var p = new DOMParser();
async function mouseEnterHandler({ clientX, clientY }) {
  const link = this;
  if (link.dataset.noPopover === "true") {
    return;
  }
  async function setPosition(popoverElement2) {
    const { x, y } = await computePosition2(link, popoverElement2, {
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()]
    });
    Object.assign(popoverElement2.style, {
      left: \`\${x}px\`,
      top: \`\${y}px\`
    });
  }
  const hasAlreadyBeenFetched = () => [...link.children].some((child) => child.classList.contains("popover"));
  if (hasAlreadyBeenFetched()) {
    return setPosition(link.lastChild);
  }
  const thisUrl = new URL(document.location.href);
  thisUrl.hash = "";
  thisUrl.search = "";
  const targetUrl = new URL(link.href);
  const hash = targetUrl.hash;
  targetUrl.hash = "";
  targetUrl.search = "";
  const contents = await fetch(\`\${targetUrl}\`).then((res) => res.text()).catch((err) => {
    console.error(err);
  });
  if (hasAlreadyBeenFetched()) {
    return;
  }
  if (!contents)
    return;
  const html = p.parseFromString(contents, "text/html");
  normalizeRelativeURLs(html, targetUrl);
  const elts = [...html.getElementsByClassName("popover-hint")];
  if (elts.length === 0)
    return;
  const popoverElement = document.createElement("div");
  popoverElement.classList.add("popover");
  const popoverInner = document.createElement("div");
  popoverInner.classList.add("popover-inner");
  popoverElement.appendChild(popoverInner);
  elts.forEach((elt) => popoverInner.appendChild(elt));
  setPosition(popoverElement);
  link.appendChild(popoverElement);
  if (hash !== "") {
    const heading = popoverInner.querySelector(hash);
    if (heading) {
      popoverInner.scroll({ top: heading.offsetTop - 12, behavior: "instant" });
    }
  }
}
document.addEventListener("nav", () => {
  const links = [...document.getElementsByClassName("internal")];
  for (const link of links) {
    link.removeEventListener("mouseenter", mouseEnterHandler);
    link.addEventListener("mouseenter", mouseEnterHandler);
  }
});
`;var custom_default=`code[data-theme*=" "] {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

code[data-theme*=" "] span {
  color: var(--shiki-light);
}

[saved-theme=dark] code[data-theme*=" "] {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}

[saved-theme=dark] code[data-theme*=" "] span {
  color: var(--shiki-dark);
}

.callout {
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: 5px;
  padding: 0 1rem;
  overflow-y: hidden;
  transition: max-height 0.3s ease;
  box-sizing: border-box;
}
.callout > *:nth-child(2) {
  margin-top: 0;
}
.callout[data-callout] {
  --color: #448aff;
  --border: #448aff44;
  --bg: #448aff10;
}
.callout[data-callout=abstract] {
  --color: #00b0ff;
  --border: #00b0ff44;
  --bg: #00b0ff10;
}
.callout[data-callout=info], .callout[data-callout=todo] {
  --color: #00b8d4;
  --border: #00b8d444;
  --bg: #00b8d410;
}
.callout[data-callout=tip] {
  --color: #00bfa5;
  --border: #00bfa544;
  --bg: #00bfa510;
}
.callout[data-callout=success] {
  --color: #09ad7a;
  --border: #09ad7144;
  --bg: #09ad7110;
}
.callout[data-callout=question] {
  --color: #dba642;
  --border: #dba64244;
  --bg: #dba64210;
}
.callout[data-callout=warning] {
  --color: #db8942;
  --border: #db894244;
  --bg: #db894210;
}
.callout[data-callout=failure], .callout[data-callout=danger], .callout[data-callout=bug] {
  --color: #db4242;
  --border: #db424244;
  --bg: #db424210;
}
.callout[data-callout=example] {
  --color: #7a43b5;
  --border: #7a43b544;
  --bg: #7a43b510;
}
.callout[data-callout=quote] {
  --color: var(--secondary);
  --border: var(--lightgray);
}
.callout.is-collapsed > .callout-title > .fold {
  transform: rotateZ(-90deg);
}

.callout-title {
  display: flex;
  gap: 5px;
  padding: 1rem 0;
  color: var(--color);
}
.callout-title .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
  cursor: pointer;
}
.callout-title > .callout-title-inner > p {
  color: var(--color);
  margin: 0;
}

.callout-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  padding-top: 4px;
}

.callout-title-inner {
  font-weight: 700;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  overflow-x: hidden;
  width: 100vw;
}

body,
section {
  margin: 0;
  max-width: 100%;
  box-sizing: border-box;
  background-color: var(--light);
  font-family: var(--bodyFont);
  color: var(--darkgray);
}

.text-highlight {
  background-color: rgba(255, 242, 54, 0.5333333333);
  padding: 0 0.1rem;
  border-radius: 5px;
}

::selection {
  background: color-mix(in srgb, var(--tertiary) 75%, transparent);
  color: var(--darkgray);
}

p,
ul,
text,
a,
tr,
td,
li,
ol,
ul,
.katex,
.math {
  color: var(--darkgray);
  fill: var(--darkgray);
  overflow-wrap: anywhere;
  hyphens: auto;
}

.math.math-display {
  text-align: center;
}

a {
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  color: var(--secondary);
}
a:hover {
  color: var(--tertiary) !important;
}
a.internal {
  text-decoration: none;
  background-color: var(--highlight);
  padding: 0 0.1rem;
  border-radius: 5px;
  line-height: 1.4rem;
}
a.internal:has(> img) {
  background-color: none;
  border-radius: 0;
  padding: 0;
}
a.external .external-icon {
  height: 1ex;
  margin: 0 0.15em;
}
a.external .external-icon > path {
  fill: var(--dark);
}

.desktop-only {
  display: initial;
}
@media all and (max-width: 1510px) {
  .desktop-only {
    display: none;
  }
}

.mobile-only {
  display: none;
}
@media all and (max-width: 1510px) {
  .mobile-only {
    display: initial;
  }
}

@media all and (max-width: 1510px) {
  .page {
    margin: 0 auto;
    padding: 0 1rem;
    max-width: 750px;
  }
}
.page article > h1 {
  font-size: 2rem;
}
.page article li:has(> input[type=checkbox]) {
  list-style-type: none;
  padding-left: 0;
}
.page article li:has(> input[type=checkbox]:checked) {
  text-decoration: line-through;
  text-decoration-color: var(--gray);
  color: var(--gray);
}
.page article li > * {
  margin-top: 0;
  margin-bottom: 0;
}
.page article p > strong {
  color: var(--dark);
}
.page > #quartz-body {
  width: 100%;
  display: flex;
}
@media all and (max-width: 1510px) {
  .page > #quartz-body {
    flex-direction: column;
  }
}
.page > #quartz-body .sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  top: 0;
  width: 380px;
  margin-top: 6rem;
  box-sizing: border-box;
  padding: 0 4rem;
  position: fixed;
}
@media all and (max-width: 1510px) {
  .page > #quartz-body .sidebar {
    position: initial;
    flex-direction: row;
    padding: 0;
    width: initial;
    margin-top: 2rem;
  }
}
.page > #quartz-body .sidebar.left {
  left: calc((100vw - 750px) / 2 - 380px);
}
@media all and (max-width: 1510px) {
  .page > #quartz-body .sidebar.left {
    gap: 0;
    align-items: center;
  }
}
.page > #quartz-body .sidebar.right {
  right: calc((100vw - 750px) / 2 - 380px);
}
@media all and (max-width: 1510px) {
  .page > #quartz-body .sidebar.right > * {
    flex: 1;
  }
}
.page .page-header {
  width: 750px;
  margin: 6rem auto 0 auto;
}
@media all and (max-width: 1510px) {
  .page .page-header {
    width: initial;
    margin-top: 2rem;
  }
}
.page .center, .page footer {
  margin-left: auto;
  margin-right: auto;
  width: 750px;
}
@media all and (max-width: 1510px) {
  .page .center, .page footer {
    width: initial;
    margin-left: 0;
    margin-right: 0;
  }
}

.footnotes {
  margin-top: 2rem;
  border-top: 1px solid var(--lightgray);
}

input[type=checkbox] {
  transform: translateY(2px);
  color: var(--secondary);
  border: 1px solid var(--lightgray);
  border-radius: 3px;
  background-color: var(--light);
  position: relative;
  margin-inline-end: 0.2rem;
  margin-inline-start: -1.4rem;
  appearance: none;
  width: 16px;
  height: 16px;
}
input[type=checkbox]:checked {
  border-color: var(--secondary);
  background-color: var(--secondary);
}
input[type=checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  display: block;
  border: solid var(--light);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

blockquote {
  margin: 1rem 0;
  border-left: 3px solid var(--secondary);
  padding-left: 1rem;
  transition: border-color 0.2s ease;
}

h1,
h2,
h3,
h4,
h5,
h6,
thead {
  font-family: var(--headerFont);
  color: var(--dark);
  font-weight: revert;
  margin-bottom: 0;
}
article > h1 > a,
article > h2 > a,
article > h3 > a,
article > h4 > a,
article > h5 > a,
article > h6 > a,
article > thead > a {
  color: var(--dark);
}
article > h1 > a.internal,
article > h2 > a.internal,
article > h3 > a.internal,
article > h4 > a.internal,
article > h5 > a.internal,
article > h6 > a.internal,
article > thead > a.internal {
  background-color: transparent;
}

h1[id] > a[href^="#"],
h2[id] > a[href^="#"],
h3[id] > a[href^="#"],
h4[id] > a[href^="#"],
h5[id] > a[href^="#"],
h6[id] > a[href^="#"] {
  margin: 0 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translateY(-0.1rem);
  display: inline-block;
  font-family: var(--codeFont);
  user-select: none;
}
h1[id]:hover > a,
h2[id]:hover > a,
h3[id]:hover > a,
h4[id]:hover > a,
h5[id]:hover > a,
h6[id]:hover > a {
  opacity: 1;
}

h1 {
  font-size: 1.75rem;
  margin-top: 2.25rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.4rem;
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.12rem;
  margin-top: 1.62rem;
  margin-bottom: 1rem;
}

h4,
h5,
h6 {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

figure[data-rehype-pretty-code-figure] {
  margin: 0;
  position: relative;
  line-height: 1.6rem;
  position: relative;
}
figure[data-rehype-pretty-code-figure] > [data-rehype-pretty-code-title] {
  font-family: var(--codeFont);
  font-size: 0.9rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--lightgray);
  width: max-content;
  border-radius: 5px;
  margin-bottom: -0.5rem;
  color: var(--darkgray);
}
figure[data-rehype-pretty-code-figure] > pre {
  padding: 0;
}

pre {
  font-family: var(--codeFont);
  padding: 0 0.5rem;
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--lightgray);
  position: relative;
}
pre:has(> code.mermaid) {
  border: none;
}
pre > code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  counter-reset: line;
  counter-increment: line 0;
  display: grid;
  padding: 0.5rem 0;
  overflow-x: scroll;
}
pre > code [data-highlighted-chars] {
  background-color: var(--highlight);
  border-radius: 5px;
}
pre > code > [data-line] {
  padding: 0 0.25rem;
  box-sizing: border-box;
  border-left: 3px solid transparent;
}
pre > code > [data-line][data-highlighted-line] {
  background-color: var(--highlight);
  border-left: 3px solid var(--secondary);
}
pre > code > [data-line]::before {
  content: counter(line);
  counter-increment: line;
  width: 1rem;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(115, 138, 148, 0.6);
}
pre > code[data-line-numbers-max-digits="2"] > [data-line]::before {
  width: 2rem;
}
pre > code[data-line-numbers-max-digits="3"] > [data-line]::before {
  width: 3rem;
}

code {
  font-size: 0.9em;
  color: var(--dark);
  font-family: var(--codeFont);
  border-radius: 5px;
  padding: 0.1rem 0.2rem;
  background: var(--lightgray);
}

tbody,
li,
p {
  line-height: 1.6rem;
}

.table-container {
  overflow-x: auto;
}
.table-container > table {
  margin: 1rem;
  padding: 1.5rem;
  border-collapse: collapse;
}
.table-container > table th,
.table-container > table td {
  min-width: 75px;
}
.table-container > table > * {
  line-height: 2rem;
}

th {
  text-align: left;
  padding: 0.4rem 0.7rem;
  border-bottom: 2px solid var(--gray);
}

td {
  padding: 0.2rem 0.7rem;
}

tr {
  border-bottom: 1px solid var(--lightgray);
}
tr:last-child {
  border-bottom: none;
}

img {
  max-width: 100%;
  border-radius: 5px;
  margin: 1rem 0;
}

p > img + em {
  display: block;
  transform: translateY(-1rem);
}

hr {
  width: 100%;
  margin: 2rem auto;
  height: 1px;
  border: none;
  background-color: var(--lightgray);
}

audio,
video {
  width: 100%;
  border-radius: 5px;
}

.spacer {
  flex: 1 1 auto;
}

ul.overflow,
ol.overflow {
  max-height: 400;
  overflow-y: auto;
  content: "";
  clear: both;
}
ul.overflow > li:last-of-type,
ol.overflow > li:last-of-type {
  margin-bottom: 30px;
}
ul.overflow:after,
ol.overflow:after {
  pointer-events: none;
  content: "";
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: 1;
  transition: opacity 0.3s ease;
  background: linear-gradient(transparent 0px, var(--light));
}

.transclude ul {
  padding-left: 1rem;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxzdHlsZXMiLCJzb3VyY2VzIjpbInN5bnRheC5zY3NzIiwiY2FsbG91dHMuc2NzcyIsImJhc2Uuc2NzcyIsInZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtFQUNFOzs7QUNiRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFFRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFHRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQ3pHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7OztBQUdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFXRTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUE7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFJSjtFQUNFO0VBQ0E7O0FBRUE7RUFDRTs7O0FBS047RUFDRTs7QUFDQTtFQUZGO0lBR0k7Ozs7QUFJSjtFQUNFOztBQUNBO0VBRkY7SUFHSTs7OztBQUtGO0VBREY7SUFFSTtJQUNBO0lBQ0EsV0M1R1E7OztBRGdIUjtFQUNFOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTs7QUFJSjtFQUNFO0VBQ0E7O0FBQ0E7RUFIRjtJQUlJOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxPQ25KVztFRG9KWCxZQ25KTztFRG9KUDtFQUNBO0VBQ0E7O0FBQ0E7RUFYRjtJQVlJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7OztBQUlKO0VBQ0U7O0FBQ0E7RUFGRjtJQUdJO0lBQ0E7OztBQUlKO0VBQ0U7O0FBRUU7RUFERjtJQUVJOzs7QUFNUjtFQUNFLE9DdkxRO0VEd0xSOztBQUNBO0VBSEY7SUFJSTtJQUNBOzs7QUFJSjtFQUVFO0VBQ0E7RUFDQSxPQ25NUTs7QURvTVI7RUFMRjtJQU1JO0lBQ0E7SUFDQTs7OztBQUtOO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQU9FO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBQ0U7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7O0FBV0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBQ0U7OztBQUtKO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7QUFBQTtFQUdFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUlKO0VBQ0U7O0FBR0Y7RUFDRTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7QUFBQTtFQUdFOzs7QUFHRjtFQUNFOztBQUVBO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0FBQUE7RUFFRTs7QUFHRjtFQUNFOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBR0Y7RUFDRTs7QUFDQTtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7RUFFRTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTtFQUdBO0VBQ0E7O0FBRUE7QUFBQTtFQUNFOztBQUdGO0FBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBS0Y7RUFDRSIsInNvdXJjZXNDb250ZW50IjpbImNvZGVbZGF0YS10aGVtZSo9XCIgXCJdIHtcbiAgY29sb3I6IHZhcigtLXNoaWtpLWxpZ2h0KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpa2ktbGlnaHQtYmcpO1xufVxuXG5jb2RlW2RhdGEtdGhlbWUqPVwiIFwiXSBzcGFuIHtcbiAgY29sb3I6IHZhcigtLXNoaWtpLWxpZ2h0KTtcbn1cblxuW3NhdmVkLXRoZW1lPVwiZGFya1wiXSBjb2RlW2RhdGEtdGhlbWUqPVwiIFwiXSB7XG4gIGNvbG9yOiB2YXIoLS1zaGlraS1kYXJrKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpa2ktZGFyay1iZyk7XG59XG5cbltzYXZlZC10aGVtZT1cImRhcmtcIl0gY29kZVtkYXRhLXRoZW1lKj1cIiBcIl0gc3BhbiB7XG4gIGNvbG9yOiB2YXIoLS1zaGlraS1kYXJrKTtcbn1cbiIsIkB1c2UgXCJzYXNzOmNvbG9yXCI7XG5cbi5jYWxsb3V0IHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmcpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHBhZGRpbmc6IDAgMXJlbTtcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xuICB0cmFuc2l0aW9uOiBtYXgtaGVpZ2h0IDAuM3MgZWFzZTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxuICAmID4gKjpudGgtY2hpbGQoMikge1xuICAgIG1hcmdpbi10b3A6IDA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dF0ge1xuICAgIC0tY29sb3I6ICM0NDhhZmY7XG4gICAgLS1ib3JkZXI6ICM0NDhhZmY0NDtcbiAgICAtLWJnOiAjNDQ4YWZmMTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImFic3RyYWN0XCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiMGZmO1xuICAgIC0tYm9yZGVyOiAjMDBiMGZmNDQ7XG4gICAgLS1iZzogIzAwYjBmZjEwO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJpbmZvXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cInRvZG9cIl0ge1xuICAgIC0tY29sb3I6ICMwMGI4ZDQ7XG4gICAgLS1ib3JkZXI6ICMwMGI4ZDQ0NDtcbiAgICAtLWJnOiAjMDBiOGQ0MTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInRpcFwiXSB7XG4gICAgLS1jb2xvcjogIzAwYmZhNTtcbiAgICAtLWJvcmRlcjogIzAwYmZhNTQ0O1xuICAgIC0tYmc6ICMwMGJmYTUxMDtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwic3VjY2Vzc1wiXSB7XG4gICAgLS1jb2xvcjogIzA5YWQ3YTtcbiAgICAtLWJvcmRlcjogIzA5YWQ3MTQ0O1xuICAgIC0tYmc6ICMwOWFkNzExMDtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwicXVlc3Rpb25cIl0ge1xuICAgIC0tY29sb3I6ICNkYmE2NDI7XG4gICAgLS1ib3JkZXI6ICNkYmE2NDI0NDtcbiAgICAtLWJnOiAjZGJhNjQyMTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cIndhcm5pbmdcIl0ge1xuICAgIC0tY29sb3I6ICNkYjg5NDI7XG4gICAgLS1ib3JkZXI6ICNkYjg5NDI0NDtcbiAgICAtLWJnOiAjZGI4OTQyMTA7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImZhaWx1cmVcIl0sXG4gICZbZGF0YS1jYWxsb3V0PVwiZGFuZ2VyXCJdLFxuICAmW2RhdGEtY2FsbG91dD1cImJ1Z1wiXSB7XG4gICAgLS1jb2xvcjogI2RiNDI0MjtcbiAgICAtLWJvcmRlcjogI2RiNDI0MjQ0O1xuICAgIC0tYmc6ICNkYjQyNDIxMDtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiZXhhbXBsZVwiXSB7XG4gICAgLS1jb2xvcjogIzdhNDNiNTtcbiAgICAtLWJvcmRlcjogIzdhNDNiNTQ0O1xuICAgIC0tYmc6ICM3YTQzYjUxMDtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwicXVvdGVcIl0ge1xuICAgIC0tY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gICAgLS1ib3JkZXI6IHZhcigtLWxpZ2h0Z3JheSk7XG4gIH1cblxuICAmLmlzLWNvbGxhcHNlZCA+IC5jYWxsb3V0LXRpdGxlID4gLmZvbGQge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWigtOTBkZWcpO1xuICB9XG59XG5cbi5jYWxsb3V0LXRpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiA1cHg7XG4gIHBhZGRpbmc6IDFyZW0gMDtcbiAgY29sb3I6IHZhcigtLWNvbG9yKTtcblxuICAmIC5mb2xkIHtcbiAgICBtYXJnaW4tbGVmdDogMC41cmVtO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG4gICAgb3BhY2l0eTogMC44O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuXG4gICYgPiAuY2FsbG91dC10aXRsZS1pbm5lciA+IHAge1xuICAgIGNvbG9yOiB2YXIoLS1jb2xvcik7XG4gICAgbWFyZ2luOiAwO1xuICB9XG59XG5cbi5jYWxsb3V0LWljb24ge1xuICB3aWR0aDogMThweDtcbiAgaGVpZ2h0OiAxOHB4O1xuICBmbGV4OiAwIDAgMThweDtcbiAgcGFkZGluZy10b3A6IDRweDtcbn1cblxuLmNhbGxvdXQtdGl0bGUtaW5uZXIge1xuICBmb250LXdlaWdodDogNzAwO1xufVxuIiwiQHVzZSBcIi4vdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuQHVzZSBcIi4vc3ludGF4LnNjc3NcIjtcbkB1c2UgXCIuL2NhbGxvdXRzLnNjc3NcIjtcblxuaHRtbCB7XG4gIHNjcm9sbC1iZWhhdmlvcjogc21vb3RoO1xuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIHRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHZ3O1xufVxuXG5ib2R5LFxuc2VjdGlvbiB7XG4gIG1hcmdpbjogMDtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1ib2R5Rm9udCk7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG59XG5cbi50ZXh0LWhpZ2hsaWdodCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmYyMzY4ODtcbiAgcGFkZGluZzogMCAwLjFyZW07XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cblxuOjpzZWxlY3Rpb24ge1xuICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVydGlhcnkpIDc1JSwgdHJhbnNwYXJlbnQpO1xuICBjb2xvcjogdmFyKC0tZGFya2dyYXkpO1xufVxuXG5wLFxudWwsXG50ZXh0LFxuYSxcbnRyLFxudGQsXG5saSxcbm9sLFxudWwsXG4ua2F0ZXgsXG4ubWF0aCB7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG4gIGZpbGw6IHZhcigtLWRhcmtncmF5KTtcbiAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG4gIGh5cGhlbnM6IGF1dG87XG59XG5cbi5tYXRoIHtcbiAgJi5tYXRoLWRpc3BsYXkge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxufVxuXG5hIHtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICY6aG92ZXIge1xuICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSkgIWltcG9ydGFudDtcbiAgfVxuXG4gICYuaW50ZXJuYWwge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oaWdobGlnaHQpO1xuICAgIHBhZGRpbmc6IDAgMC4xcmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBsaW5lLWhlaWdodDogMS40cmVtO1xuXG4gICAgJjpoYXMoPiBpbWcpIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IG5vbmU7XG4gICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgcGFkZGluZzogMDtcbiAgICB9XG4gIH1cblxuICAmLmV4dGVybmFsIC5leHRlcm5hbC1pY29uIHtcbiAgICBoZWlnaHQ6IDFleDtcbiAgICBtYXJnaW46IDAgMC4xNWVtO1xuXG4gICAgPiBwYXRoIHtcbiAgICAgIGZpbGw6IHZhcigtLWRhcmspO1xuICAgIH1cbiAgfVxufVxuXG4uZGVza3RvcC1vbmx5IHtcbiAgZGlzcGxheTogaW5pdGlhbDtcbiAgQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogJGZ1bGxQYWdlV2lkdGgpIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5cbi5tb2JpbGUtb25seSB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgZGlzcGxheTogaW5pdGlhbDtcbiAgfVxufVxuXG4ucGFnZSB7XG4gIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgcGFkZGluZzogMCAxcmVtO1xuICAgIG1heC13aWR0aDogJHBhZ2VXaWR0aDtcbiAgfVxuXG4gICYgYXJ0aWNsZSB7XG4gICAgJiA+IGgxIHtcbiAgICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgICB9XG5cbiAgICAmIGxpOmhhcyg+IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXSkge1xuICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIH1cblxuICAgICYgbGk6aGFzKD4gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQpIHtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogbGluZS10aHJvdWdoO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uLWNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgICAgIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgICB9XG5cbiAgICAmIGxpID4gKiB7XG4gICAgICBtYXJnaW4tdG9wOiAwO1xuICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICB9XG5cbiAgICBwID4gc3Ryb25nIHtcbiAgICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICB9XG4gIH1cblxuICAmID4gI3F1YXJ0ei1ib2R5IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cblxuICAgICYgLnNpZGViYXIge1xuICAgICAgZmxleDogMTtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgZ2FwOiAycmVtO1xuICAgICAgdG9wOiAwO1xuICAgICAgd2lkdGg6ICRzaWRlUGFuZWxXaWR0aDtcbiAgICAgIG1hcmdpbi10b3A6ICR0b3BTcGFjaW5nO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIHBhZGRpbmc6IDAgNHJlbTtcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICAgIHBvc2l0aW9uOiBpbml0aWFsO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICB3aWR0aDogaW5pdGlhbDtcbiAgICAgICAgbWFyZ2luLXRvcDogMnJlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyLmxlZnQge1xuICAgICAgbGVmdDogY2FsYyhjYWxjKDEwMHZ3IC0gJHBhZ2VXaWR0aCkgLyAyIC0gJHNpZGVQYW5lbFdpZHRoKTtcbiAgICAgIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRmdWxsUGFnZVdpZHRoKSB7XG4gICAgICAgIGdhcDogMDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyLnJpZ2h0IHtcbiAgICAgIHJpZ2h0OiBjYWxjKGNhbGMoMTAwdncgLSAkcGFnZVdpZHRoKSAvIDIgLSAkc2lkZVBhbmVsV2lkdGgpO1xuICAgICAgJiA+ICoge1xuICAgICAgICBAbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAkZnVsbFBhZ2VXaWR0aCkge1xuICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAmIC5wYWdlLWhlYWRlciB7XG4gICAgd2lkdGg6ICRwYWdlV2lkdGg7XG4gICAgbWFyZ2luOiAkdG9wU3BhY2luZyBhdXRvIDAgYXV0bztcbiAgICBAbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAkZnVsbFBhZ2VXaWR0aCkge1xuICAgICAgd2lkdGg6IGluaXRpYWw7XG4gICAgICBtYXJnaW4tdG9wOiAycmVtO1xuICAgIH1cbiAgfVxuXG4gICYgLmNlbnRlcixcbiAgJiBmb290ZXIge1xuICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICB3aWR0aDogJHBhZ2VXaWR0aDtcbiAgICBAbWVkaWEgYWxsIGFuZCAobWF4LXdpZHRoOiAkZnVsbFBhZ2VXaWR0aCkge1xuICAgICAgd2lkdGg6IGluaXRpYWw7XG4gICAgICBtYXJnaW4tbGVmdDogMDtcbiAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICB9XG4gIH1cbn1cblxuLmZvb3Rub3RlcyB7XG4gIG1hcmdpbi10b3A6IDJyZW07XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xufVxuXG5pbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0ge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMnB4KTtcbiAgY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbi1pbmxpbmUtZW5kOiAwLjJyZW07XG4gIG1hcmdpbi1pbmxpbmUtc3RhcnQ6IC0xLjRyZW07XG4gIGFwcGVhcmFuY2U6IG5vbmU7XG4gIHdpZHRoOiAxNnB4O1xuICBoZWlnaHQ6IDE2cHg7XG5cbiAgJjpjaGVja2VkIHtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcblxuICAgICY6OmFmdGVyIHtcbiAgICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBsZWZ0OiA0cHg7XG4gICAgICB0b3A6IDFweDtcbiAgICAgIHdpZHRoOiA0cHg7XG4gICAgICBoZWlnaHQ6IDhweDtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgYm9yZGVyOiBzb2xpZCB2YXIoLS1saWdodCk7XG4gICAgICBib3JkZXItd2lkdGg6IDAgMnB4IDJweCAwO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xuICAgIH1cbiAgfVxufVxuXG5ibG9ja3F1b3RlIHtcbiAgbWFyZ2luOiAxcmVtIDA7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5KTtcbiAgcGFkZGluZy1sZWZ0OiAxcmVtO1xuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycyBlYXNlO1xufVxuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYsXG50aGVhZCB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1oZWFkZXJGb250KTtcbiAgY29sb3I6IHZhcigtLWRhcmspO1xuICBmb250LXdlaWdodDogcmV2ZXJ0O1xuICBtYXJnaW4tYm90dG9tOiAwO1xuXG4gIGFydGljbGUgPiAmID4gYSB7XG4gICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICYuaW50ZXJuYWwge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgfVxuICB9XG59XG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNiB7XG4gICZbaWRdID4gYVtocmVmXj1cIiNcIl0ge1xuICAgIG1hcmdpbjogMCAwLjVyZW07XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnMgZWFzZTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuMXJlbSk7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuICAmW2lkXTpob3ZlciA+IGEge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cblxuLy8gdHlwb2dyYXBoeSBpbXByb3ZlbWVudHNcbmgxIHtcbiAgZm9udC1zaXplOiAxLjc1cmVtO1xuICBtYXJnaW4tdG9wOiAyLjI1cmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5oMiB7XG4gIGZvbnQtc2l6ZTogMS40cmVtO1xuICBtYXJnaW4tdG9wOiAxLjlyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmgzIHtcbiAgZm9udC1zaXplOiAxLjEycmVtO1xuICBtYXJnaW4tdG9wOiAxLjYycmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5oNCxcbmg1LFxuaDYge1xuICBmb250LXNpemU6IDFyZW07XG4gIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuZmlndXJlW2RhdGEtcmVoeXBlLXByZXR0eS1jb2RlLWZpZ3VyZV0ge1xuICBtYXJnaW46IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbGluZS1oZWlnaHQ6IDEuNnJlbTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICYgPiBbZGF0YS1yZWh5cGUtcHJldHR5LWNvZGUtdGl0bGVdIHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tY29kZUZvbnQpO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgIHBhZGRpbmc6IDAuMXJlbSAwLjVyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICB3aWR0aDogbWF4LWNvbnRlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIG1hcmdpbi1ib3R0b206IC0wLjVyZW07XG4gICAgY29sb3I6IHZhcigtLWRhcmtncmF5KTtcbiAgfVxuXG4gICYgPiBwcmUge1xuICAgIHBhZGRpbmc6IDA7XG4gIH1cbn1cblxucHJlIHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgcGFkZGluZzogMCAwLjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICY6aGFzKD4gY29kZS5tZXJtYWlkKSB7XG4gICAgYm9yZGVyOiBub25lO1xuICB9XG5cbiAgJiA+IGNvZGUge1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgY291bnRlci1yZXNldDogbGluZTtcbiAgICBjb3VudGVyLWluY3JlbWVudDogbGluZSAwO1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgcGFkZGluZzogMC41cmVtIDA7XG4gICAgb3ZlcmZsb3cteDogc2Nyb2xsO1xuXG4gICAgJiBbZGF0YS1oaWdobGlnaHRlZC1jaGFyc10ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGlnaGxpZ2h0KTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICB9XG5cbiAgICAmID4gW2RhdGEtbGluZV0ge1xuICAgICAgcGFkZGluZzogMCAwLjI1cmVtO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdHJhbnNwYXJlbnQ7XG5cbiAgICAgICZbZGF0YS1oaWdobGlnaHRlZC1saW5lXSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAgIH1cblxuICAgICAgJjo6YmVmb3JlIHtcbiAgICAgICAgY29udGVudDogY291bnRlcihsaW5lKTtcbiAgICAgICAgY291bnRlci1pbmNyZW1lbnQ6IGxpbmU7XG4gICAgICAgIHdpZHRoOiAxcmVtO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICAgIGNvbG9yOiByZ2JhKDExNSwgMTM4LCAxNDgsIDAuNik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJltkYXRhLWxpbmUtbnVtYmVycy1tYXgtZGlnaXRzPVwiMlwiXSA+IFtkYXRhLWxpbmVdOjpiZWZvcmUge1xuICAgICAgd2lkdGg6IDJyZW07XG4gICAgfVxuXG4gICAgJltkYXRhLWxpbmUtbnVtYmVycy1tYXgtZGlnaXRzPVwiM1wiXSA+IFtkYXRhLWxpbmVdOjpiZWZvcmUge1xuICAgICAgd2lkdGg6IDNyZW07XG4gICAgfVxuICB9XG59XG5cbmNvZGUge1xuICBmb250LXNpemU6IDAuOWVtO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgcGFkZGluZzogMC4xcmVtIDAuMnJlbTtcbiAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHRncmF5KTtcbn1cblxudGJvZHksXG5saSxcbnAge1xuICBsaW5lLWhlaWdodDogMS42cmVtO1xufVxuXG4udGFibGUtY29udGFpbmVyIHtcbiAgb3ZlcmZsb3cteDogYXV0bztcblxuICAmID4gdGFibGUge1xuICAgIG1hcmdpbjogMXJlbTtcbiAgICBwYWRkaW5nOiAxLjVyZW07XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcblxuICAgIHRoLFxuICAgIHRkIHtcbiAgICAgIG1pbi13aWR0aDogNzVweDtcbiAgICB9XG5cbiAgICAmID4gKiB7XG4gICAgICBsaW5lLWhlaWdodDogMnJlbTtcbiAgICB9XG4gIH1cbn1cblxudGgge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBwYWRkaW5nOiAwLjRyZW0gMC43cmVtO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgdmFyKC0tZ3JheSk7XG59XG5cbnRkIHtcbiAgcGFkZGluZzogMC4ycmVtIDAuN3JlbTtcbn1cblxudHIge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgJjpsYXN0LWNoaWxkIHtcbiAgICBib3JkZXItYm90dG9tOiBub25lO1xuICB9XG59XG5cbmltZyB7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBtYXJnaW46IDFyZW0gMDtcbn1cblxucCA+IGltZyArIGVtIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXJlbSk7XG59XG5cbmhyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIG1hcmdpbjogMnJlbSBhdXRvO1xuICBoZWlnaHQ6IDFweDtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodGdyYXkpO1xufVxuXG5hdWRpbyxcbnZpZGVvIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cblxuLnNwYWNlciB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG51bC5vdmVyZmxvdyxcbm9sLm92ZXJmbG93IHtcbiAgbWF4LWhlaWdodDogNDAwO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gIC8vIGNsZWFyZml4XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNsZWFyOiBib3RoO1xuXG4gICYgPiBsaTpsYXN0LW9mLXR5cGUge1xuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XG4gIH1cblxuICAmOmFmdGVyIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBjb250ZW50OiBcIlwiO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogNTBweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMDtcbiAgICBib3R0b206IDA7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZTtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQgMHB4LCB2YXIoLS1saWdodCkpO1xuICB9XG59XG5cbi50cmFuc2NsdWRlIHtcbiAgdWwge1xuICAgIHBhZGRpbmctbGVmdDogMXJlbTtcbiAgfVxufVxuIiwiJHBhZ2VXaWR0aDogNzUwcHg7XG4kbW9iaWxlQnJlYWtwb2ludDogNjAwcHg7XG4kdGFibGV0QnJlYWtwb2ludDogMTIwMHB4O1xuJHNpZGVQYW5lbFdpZHRoOiAzODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGZ1bGxQYWdlV2lkdGg6ICRwYWdlV2lkdGggKyAyICogJHNpZGVQYW5lbFdpZHRoO1xuIl19 */`;var popover_default=`@keyframes dropin {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
.popover {
  z-index: 999;
  position: absolute;
  overflow: visible;
  padding: 1rem;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.popover > .popover-inner {
  position: relative;
  width: 30rem;
  max-height: 20rem;
  padding: 0 1rem 1rem 1rem;
  font-weight: initial;
  font-style: initial;
  line-height: normal;
  font-size: initial;
  font-family: var(--bodyFont);
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  box-shadow: 6px 6px 36px 0 rgba(0, 0, 0, 0.25);
  overflow: auto;
  white-space: normal;
}
.popover h1 {
  font-size: 1.5rem;
}
@media all and (max-width: 600px) {
  .popover {
    display: none !important;
  }
}

a:hover .popover,
.popover:hover {
  animation: dropin 0.3s ease;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXEFwcHNcXERydW5rZW4tRGljZS1UYXZlcm5cXHF1YXJ0elxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbInBvcG92ZXIuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNFO0lBQ0U7SUFDQTs7RUFFRjtJQUNFOztFQUVGO0lBQ0U7SUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQXdCQTtFQUNBO0VBQ0EsWUFDRTs7QUF6QkY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTs7QUFTRjtFQWxDRjtJQW1DSTs7OztBQUlKO0FBQUE7RUFFRTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxuQGtleWZyYW1lcyBkcm9waW4ge1xuICAwJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIH1cbiAgMSUge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICB9XG59XG5cbi5wb3BvdmVyIHtcbiAgei1pbmRleDogOTk5O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG92ZXJmbG93OiB2aXNpYmxlO1xuICBwYWRkaW5nOiAxcmVtO1xuXG4gICYgPiAucG9wb3Zlci1pbm5lciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHdpZHRoOiAzMHJlbTtcbiAgICBtYXgtaGVpZ2h0OiAyMHJlbTtcbiAgICBwYWRkaW5nOiAwIDFyZW0gMXJlbSAxcmVtO1xuICAgIGZvbnQtd2VpZ2h0OiBpbml0aWFsO1xuICAgIGZvbnQtc3R5bGU6IGluaXRpYWw7XG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXNpemU6IGluaXRpYWw7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgYm94LXNoYWRvdzogNnB4IDZweCAzNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xuICB9XG5cbiAgaDEge1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICB9XG5cbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOlxuICAgIG9wYWNpdHkgMC4zcyBlYXNlLFxuICAgIHZpc2liaWxpdHkgMC4zcyBlYXNlO1xuXG4gIEBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6ICRtb2JpbGVCcmVha3BvaW50KSB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbmE6aG92ZXIgLnBvcG92ZXIsXG4ucG9wb3Zlcjpob3ZlciB7XG4gIGFuaW1hdGlvbjogZHJvcGluIDAuM3MgZWFzZTtcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XG4gIGFuaW1hdGlvbi1kZWxheTogMC4ycztcbn1cbiJdfQ== */`;var DEFAULT_SANS_SERIF='-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',DEFAULT_MONO="ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace";function googleFontHref(theme){let{code,header,body}=theme.typography;return`https://fonts.googleapis.com/css2?family=${code}&family=${header}:wght@400;700&family=${body}:ital,wght@0,400;0,600;1,400;1,600&display=swap`}__name(googleFontHref,"googleFontHref");function joinStyles(theme,...stylesheet){return`
${stylesheet.join(`

`)}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};

  --headerFont: "${theme.typography.header}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${theme.typography.body}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${theme.typography.code}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
}
`}__name(joinStyles,"joinStyles");import{Features,transform}from"lightningcss";import{transform as transpile}from"esbuild";function getComponentResources(ctx){let allComponents=new Set;for(let emitter of ctx.cfg.plugins.emitters){let components=emitter.getQuartzComponents(ctx);for(let component of components)allComponents.add(component)}let componentResources={css:new Set,beforeDOMLoaded:new Set,afterDOMLoaded:new Set};for(let component of allComponents){let{css,beforeDOMLoaded,afterDOMLoaded}=component;css&&componentResources.css.add(css),beforeDOMLoaded&&componentResources.beforeDOMLoaded.add(beforeDOMLoaded),afterDOMLoaded&&componentResources.afterDOMLoaded.add(afterDOMLoaded)}return{css:[...componentResources.css],beforeDOMLoaded:[...componentResources.beforeDOMLoaded],afterDOMLoaded:[...componentResources.afterDOMLoaded]}}__name(getComponentResources,"getComponentResources");async function joinScripts(scripts){let script=scripts.map(script2=>`(function () {${script2}})();`).join(`
`);return(await transpile(script,{minify:!0})).code}__name(joinScripts,"joinScripts");function addGlobalPageResources(ctx,staticResources,componentResources){let cfg=ctx.cfg.configuration,reloadScript=ctx.argv.serve;if(cfg.enablePopovers&&(componentResources.afterDOMLoaded.push(popover_inline_default),componentResources.css.push(popover_default)),cfg.analytics?.provider==="google"){let tagId=cfg.analytics.tagId;staticResources.js.push({src:`https://www.googletagmanager.com/gtag/js?id=${tagId}`,contentType:"external",loadTime:"afterDOMReady"}),componentResources.afterDOMLoaded.push(`
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", "${tagId}", { send_page_view: false });

      document.addEventListener("nav", () => {
        gtag("event", "page_view", {
          page_title: document.title,
          page_location: location.href,
        });
      });`)}else if(cfg.analytics?.provider==="plausible"){let plausibleHost=cfg.analytics.host??"https://plausible.io";componentResources.afterDOMLoaded.push(`
      const plausibleScript = document.createElement("script")
      plausibleScript.src = "${plausibleHost}/js/script.manual.js"
      plausibleScript.setAttribute("data-domain", location.hostname)
      plausibleScript.defer = true
      document.head.appendChild(plausibleScript)

      window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

      document.addEventListener("nav", () => {
        plausible("pageview")
      })
    `)}else cfg.analytics?.provider==="umami"&&componentResources.afterDOMLoaded.push(`
      const umamiScript = document.createElement("script")
      umamiScript.src = "https://analytics.umami.is/script.js"
      umamiScript.setAttribute("data-website-id", "${cfg.analytics.websiteId}")
      umamiScript.async = true

      document.head.appendChild(umamiScript)
    `);cfg.enableSPA?componentResources.afterDOMLoaded.push(spa_inline_default):componentResources.afterDOMLoaded.push(`
        window.spaNavigate = (url, _) => window.location.assign(url)
        const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
        document.dispatchEvent(event)`);let wsUrl=`ws://localhost:${ctx.argv.wsPort}`;ctx.argv.remoteDevHost&&(wsUrl=`wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`),reloadScript&&staticResources.js.push({loadTime:"afterDOMReady",contentType:"inline",script:`
          const socket = new WebSocket('${wsUrl}')
          socket.addEventListener('message', () => document.location.reload())
        `})}__name(addGlobalPageResources,"addGlobalPageResources");var defaultOptions14={fontOrigin:"googleFonts"},ComponentResources=__name(opts=>{let{fontOrigin}={...defaultOptions14,...opts};return{name:"ComponentResources",getQuartzComponents(){return[]},async emit(ctx,_content,resources){let componentResources=getComponentResources(ctx);fontOrigin==="googleFonts"&&resources.css.push(googleFontHref(ctx.cfg.configuration.theme)),addGlobalPageResources(ctx,resources,componentResources);let stylesheet=joinStyles(ctx.cfg.configuration.theme,...componentResources.css,custom_default),[prescript,postscript]=await Promise.all([joinScripts(componentResources.beforeDOMLoaded),joinScripts(componentResources.afterDOMLoaded)]);return await Promise.all([write({ctx,slug:"index",ext:".css",content:transform({filename:"index.css",code:Buffer.from(stylesheet),minify:!0,targets:{safari:984576,ios_saf:984576,edge:7536640,firefox:6684672,chrome:7143424},include:Features.MediaQueries}).code.toString()}),write({ctx,slug:"prescript",ext:".js",content:prescript}),write({ctx,slug:"postscript",ext:".js",content:postscript})])}}},"ComponentResources");var NotFoundPage=__name(()=>{let opts={...sharedPageComponents,pageBody:__default(),beforeBody:[],left:[],right:[]},{head:Head,pageBody,footer:Footer}=opts,Body2=Body_default();return{name:"404Page",getQuartzComponents(){return[Head,Body2,pageBody,Footer]},async emit(ctx,_content,resources){let cfg=ctx.cfg.configuration,slug="404",path12=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname,externalResources=pageResources(path12,resources),[tree,vfile]=defaultProcessedContent({slug,text:"Not Found",description:"Not Found",frontmatter:{title:"Not Found",tags:[]}}),componentData={fileData:vfile.data,externalResources,cfg,children:[],tree,allFiles:[]};return[await write({ctx,content:renderPage(slug,componentData,opts,externalResources),slug,ext:".html"})]}}},"NotFoundPage");import chalk5 from"chalk";function getStaticResourcesFromPlugins(ctx){let staticResources={css:[],js:[]};for(let transformer of ctx.cfg.plugins.transformers){let res=transformer.externalResources?transformer.externalResources(ctx):{};res?.js&&staticResources.js.push(...res.js),res?.css&&staticResources.css.push(...res.css)}return staticResources}__name(getStaticResourcesFromPlugins,"getStaticResourcesFromPlugins");async function emitContent(ctx,content){let{argv,cfg}=ctx,perf=new PerfTimer,log=new QuartzLogger(ctx.argv.verbose);log.start("Emitting output files");let emittedFiles=0,staticResources=getStaticResourcesFromPlugins(ctx);for(let emitter of cfg.plugins.emitters)try{let emitted=await emitter.emit(ctx,content,staticResources);if(emittedFiles+=emitted.length,ctx.argv.verbose)for(let file of emitted)console.log(`[emit:${emitter.name}] ${file}`)}catch(err){trace(`Failed to emit from plugin \`${emitter.name}\``,err)}log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)}__name(emitContent,"emitContent");var config={configuration:{pageTitle:"The Drunken Dice Tavern",enableSPA:!0,enablePopovers:!0,analytics:{provider:"plausible"},baseUrl:"quartz.jzhao.xyz",ignorePatterns:["private","templates",".obsidian"],defaultDateType:"created",theme:{typography:{header:"Averia Serif Libre",body:"Lato",code:"IBM Plex Mono"},colors:{lightMode:{light:"#faf8f8",lightgray:"#e5e5e5",gray:"#b8b8b8",darkgray:"#4e4e4e",dark:"#2b2b2b",secondary:"#284b63",tertiary:"#84a59d",highlight:"rgba(143, 159, 169, 0.15)"},darkMode:{light:"#161618",lightgray:"#393639",gray:"#646464",darkgray:"#d4d4d4",dark:"#ebebec",secondary:"#7b97aa",tertiary:"#84a59d",highlight:"rgba(143, 159, 169, 0.15)"}}}},plugins:{transformers:[FrontMatter(),TableOfContents(),CreatedModifiedDate({priority:["frontmatter","filesystem"]}),Latex({renderEngine:"katex"}),SyntaxHighlighting(),ObsidianFlavoredMarkdown({enableInHtmlEmbed:!1}),GitHubFlavoredMarkdown(),CrawlLinks({markdownLinkResolution:"shortest"}),Description()],filters:[RemoveDrafts()],emitters:[AliasRedirects(),ComponentResources({fontOrigin:"googleFonts"}),ContentPage(),FolderPage(),TagPage(),ContentIndex({enableSiteMap:!0,enableRSS:!0}),Assets(),Static(),NotFoundPage()]}},quartz_config_default=config;import chokidar from"chokidar";import fs5 from"fs";import{fileURLToPath}from"url";var options={retrieveSourceMap(source){if(source.includes(".quartz-cache")){let realSource=fileURLToPath(source.split("?",2)[0]+".map");return{map:fs5.readFileSync(realSource,"utf8")}}else return null}};sourceMapSupport.install(options);async function buildQuartz(argv,mut,clientRefresh){let ctx={argv,cfg:quartz_config_default,allSlugs:[]},perf=new PerfTimer,output=argv.output,pluginCount=Object.values(quartz_config_default.plugins).flat().length,pluginNames=__name(key=>quartz_config_default.plugins[key].map(plugin=>plugin.name),"pluginNames");argv.verbose&&(console.log(`Loaded ${pluginCount} plugins`),console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`),console.log(`  Filters: ${pluginNames("filters").join(", ")}`),console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`));let release=await mut.acquire();perf.addEvent("clean"),await rimraf(output),console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`),perf.addEvent("glob");let allFiles=await glob("**/*.*",argv.directory,quartz_config_default.configuration.ignorePatterns),fps=allFiles.filter(fp=>fp.endsWith(".md")).sort();console.log(`Found ${fps.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`);let filePaths=fps.map(fp=>joinSegments(argv.directory,fp));ctx.allSlugs=allFiles.map(fp=>slugifyFilePath(fp));let parsedFiles=await parseMarkdown(ctx,filePaths),filteredContent=filterContent(ctx,parsedFiles);if(await emitContent(ctx,filteredContent),console.log(chalk6.green(`Done processing ${fps.length} files in ${perf.timeSince()}`)),release(),argv.serve)return startServing(ctx,mut,parsedFiles,clientRefresh)}__name(buildQuartz,"buildQuartz");async function startServing(ctx,mut,initialContent,clientRefresh){let{argv}=ctx,contentMap=new Map;for(let content of initialContent){let[_tree,vfile]=content;contentMap.set(vfile.data.filePath,content)}let buildData={ctx,mut,contentMap,ignored:await isGitIgnored(),initialSlugs:ctx.allSlugs,toRebuild:new Set,toRemove:new Set,trackedAssets:new Set,lastBuildMs:0},watcher=chokidar.watch(".",{persistent:!0,cwd:argv.directory,ignoreInitial:!0});return watcher.on("add",fp=>rebuildFromEntrypoint(fp,"add",clientRefresh,buildData)).on("change",fp=>rebuildFromEntrypoint(fp,"change",clientRefresh,buildData)).on("unlink",fp=>rebuildFromEntrypoint(fp,"delete",clientRefresh,buildData)),async()=>{await watcher.close()}}__name(startServing,"startServing");async function rebuildFromEntrypoint(fp,action,clientRefresh,buildData){let{ctx,ignored,mut,initialSlugs,contentMap,toRebuild,toRemove,trackedAssets,lastBuildMs}=buildData,{argv}=ctx;if(ignored(fp))return;fp=toPosixPath(fp);let filePath=joinSegments(argv.directory,fp);if(path11.extname(fp)!==".md"){action==="add"||action==="change"?trackedAssets.add(filePath):action==="delete"&&trackedAssets.delete(filePath),clientRefresh();return}action==="add"||action==="change"?toRebuild.add(filePath):action==="delete"&&toRemove.add(filePath);let buildStart=new Date().getTime();buildData.lastBuildMs=buildStart;let release=await mut.acquire();if(lastBuildMs>buildStart){release();return}let perf=new PerfTimer;console.log(chalk6.yellow("Detected change, rebuilding..."));try{let filesToRebuild=[...toRebuild].filter(fp2=>!toRemove.has(fp2)),trackedSlugs=[...new Set([...contentMap.keys(),...toRebuild,...trackedAssets])].filter(fp2=>!toRemove.has(fp2)).map(fp2=>slugifyFilePath(path11.posix.relative(argv.directory,fp2)));ctx.allSlugs=[...new Set([...initialSlugs,...trackedSlugs])];let parsedContent=await parseMarkdown(ctx,filesToRebuild);for(let content of parsedContent){let[_tree,vfile]=content;contentMap.set(vfile.data.filePath,content)}for(let fp2 of toRemove)contentMap.delete(fp2);let parsedFiles=[...contentMap.values()],filteredContent=filterContent(ctx,parsedFiles);await rimraf(argv.output),await emitContent(ctx,filteredContent),console.log(chalk6.green(`Done rebuilding in ${perf.timeSince()}`))}catch(err){console.log(chalk6.yellow("Rebuild failed. Waiting on a change to fix the error...")),argv.verbose&&console.log(chalk6.red(err))}release(),clientRefresh(),toRebuild.clear(),toRemove.clear()}__name(rebuildFromEntrypoint,"rebuildFromEntrypoint");var build_default=__name(async(argv,mut,clientRefresh)=>{try{return await buildQuartz(argv,mut,clientRefresh)}catch(err){trace(`
Exiting Quartz due to a fatal error`,err)}},"default");export{build_default as default};
//# sourceMappingURL=transpiled-build.mjs.map
