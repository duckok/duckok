import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  ArrowRight, Check, ChevronDown, Code2, Languages, Menu, ShieldCheck,
  SlidersHorizontal, Sparkles, X, Zap, Image as ImageIcon, LockKeyhole,
} from "lucide-react";
import style from "./index.module.scss";
import { Logo } from "@/components/Logo";
import { UploadCard } from "@/components/UploadCard";
import { Compare } from "@/components/Compare";
import { gstate } from "@/global";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import { createImageList, useWorkerHandler } from "@/engines/transform";
import { getFilesFromClipboard, hasImageInClipboard } from "@/functions";
import { LeftContent } from "./LeftContent";
import { RightOption } from "./RightOption";
import { Select } from "@/components/Select";

const copy = {
  zh: {
    nav: ["图片压缩", "功能", "专业版", "关于"],
    eyebrow: "免费 · 本地处理 · 无需注册",
    title: "让每一张图片\n更小，更好用",
    summary: "压缩、转换、调整尺寸和裁剪，一站完成。无需安装软件，图片直接在浏览器本地处理。",
    intro: "无论是上传网站、发布社交媒体，还是处理日常图片，DuckOK 都能帮你快速完成。",
    start: "开始压缩图片",
    source: "开源代码",
    proof: ["无需注册", "支持批量", "图片不上传"],
    workspaceTitle: "图片处理工作台",
    workspaceHint: "拖入图片即可开始",
    featuresTitle: "常用的图片处理，一站完成",
    featuresIntro: "压缩、转换、调整尺寸、裁剪等常用功能集中在一起。打开 DuckOK，选择图片即可开始。",
    features: [
      ["批量压缩", "一次处理多张图片，统一调整质量和输出格式，适合日常批量上传。"],
      ["格式转换", "在 JPG、PNG、WebP、AVIF 等格式之间转换，并保留透明背景处理能力。"],
      ["尺寸调整", "按宽度、高度、长短边或固定比例快速调整图片尺寸。"],
      ["裁剪图片", "按比例或指定尺寸裁剪，适合网站封面、商品图和社交媒体配图。"],
      ["前后对比", "处理完成后直接查看效果，确认画质与文件大小之间的平衡。"],
      ["本地处理", "文件在浏览器中处理，不需要上传到服务器，适合对隐私敏感的图片。"],
    ],
    proEyebrow: "DUCKOK PRO",
    proTitle: "免费工具之外，\n还有更完整的图片工作流",
    proText: "DuckOK 的核心工具保持免费。未来专业版将面向高频用户和团队，提供更高效的批量处理、更多自动化能力和专业工作流。",
    proPoints: ["更高级的批量工作流", "更多图片处理工具", "任务与处理历史", "API 与团队能力"],
    proButton: "了解专业版",
    proHint: "专业版功能陆续开放",
    privacyTitle: "你的图片，不需要先上传",
    privacyText: "图片直接在你的设备上处理，无需上传到 DuckOK 服务器。这样不仅减少等待，也让私人照片、工作文件等内容少一个上传环节。",
    privacyPoints: ["本地处理", "无需账号", "无上传等待", "开源可审计"],
    howTitle: "三步完成图片处理",
    steps: [["添加图片", "选择文件、文件夹，或直接拖放、粘贴图片。"], ["调整参数", "选择质量、格式、尺寸和裁剪方式。"], ["下载结果", "查看压缩效果，逐张下载或一次保存全部结果。"]],
    faqTitle: "常见问题",
    faq: [
      ["DuckOK 会上传我的图片吗？", "正常使用 DuckOK 的网页图片处理功能时，图片会直接在你的浏览器中处理，不需要上传到 DuckOK 服务器。"],
      ["可以一次压缩很多图片吗？", "可以。DuckOK 支持批量添加文件，也支持在兼容浏览器中直接添加文件夹。实际可处理数量受设备内存和浏览器限制影响。"],
      ["支持哪些图片格式？", "当前核心工具支持 JPEG、PNG、WebP、GIF、SVG、AVIF，并可在本地处理 HEIC/HEIF 输入。"],
      ["DuckOK 以后会收费吗？", "核心图片压缩工具计划保持免费。专业版将针对高频用户提供额外能力，具体功能和价格会在正式上线后公布。"],
    ],
    finalTitle: "现在就把图片变轻",
    finalText: "不用注册，不用安装，打开浏览器就能开始。",
    footer: "DuckOK · 简单、快速、好用的在线图片工具。",
  },
  en: {
    nav: ["Compress", "Features", "Pro", "About"],
    eyebrow: "Free · Local processing · No sign-up",
    title: "Make every image\nsmaller and easier to use",
    summary: "Compress, convert, resize, and crop in one simple workflow. Your images are processed on your device instead of being uploaded.",
    intro: "A simple image tool for websites, social media, work, and everyday use.",
    start: "Start compressing",
    source: "Open source",
    proof: ["No account", "Batch processing", "Files stay local"],
    workspaceTitle: "Image workspace",
    workspaceHint: "Drop images to get started",
    featuresTitle: "Everyday image tools, all in one place",
    featuresIntro: "Compress, convert, resize, and crop in one place. Open DuckOK, choose your images, and get started.",
    features: [
      ["Batch compression", "Process multiple images at once with shared quality and output settings."],
      ["Format conversion", "Convert between JPG, PNG, WebP and AVIF while handling transparency."],
      ["Resize images", "Resize by width, height, short edge, long edge or a defined ratio."],
      ["Crop images", "Crop by ratio or exact dimensions for covers, product images and social posts."],
      ["Before / after", "Compare the result directly and find the right balance between quality and size."],
      ["Local processing", "Images are processed in your browser instead of being uploaded to a server."],
    ],
    proEyebrow: "DUCKOK PRO",
    proTitle: "A free core tool,\nwith a bigger workflow ahead",
    proText: "DuckOK keeps the core image tools free. Pro will be designed for high-volume users and teams with faster batch workflows, automation, and professional features.",
    proPoints: ["Advanced batch workflows", "More image tools", "Task and processing history", "API and team features"],
    proButton: "Explore Pro",
    proHint: "Pro features are being introduced gradually",
    privacyTitle: "Your images do not need to be uploaded first",
    privacyText: "Images are processed directly on your device without uploading them to DuckOK servers. That means less waiting and one less place for private photos or work files to be stored.",
    privacyPoints: ["Local processing", "No account", "No upload queue", "Open source"],
    howTitle: "Process images in three steps",
    steps: [["Add images", "Choose files or folders, or simply drop and paste images."], ["Set options", "Choose quality, format, dimensions, and crop behavior."], ["Download", "Review the result, then download one image or the complete batch."]],
    faqTitle: "Frequently asked questions",
    faq: [
      ["Does DuckOK upload my images?", "When using DuckOK’s web image tools normally, images are processed in your browser and do not need to be uploaded to DuckOK servers."],
      ["Can I compress many images at once?", "Yes. DuckOK supports batch files and, in compatible browsers, folders. The practical limit depends on your device memory and browser."],
      ["Which image formats are supported?", "The core tool supports JPEG, PNG, WebP, GIF, SVG and AVIF, with local HEIC/HEIF input handling."],
      ["Will DuckOK become paid?", "The core compressor is intended to remain free. Pro will add capabilities for high-volume users; features and pricing will be announced when they launch."],
    ],
    finalTitle: "Make your images lighter today",
    finalText: "No account. No installation. Just open DuckOK and start.",
    footer: "DuckOK · Simple, fast, and useful online image tools.",
  },
};

const featureIcons = [Zap, ImageIcon, SlidersHorizontal, Sparkles, Check, LockKeyhole];

const Home = observer(() => {
  useWorkerHandler();
  const [menuOpen, setMenuOpen] = useState(false);
  const text = gstate.lang === "zh-CN" ? copy.zh : copy.en;
  const brandName = gstate.locale?.logo ?? "DuckOK";

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (!hasImageInClipboard(event)) return;
      const target = event.target as HTMLElement | null;
      const editable = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || Boolean(target?.isContentEditable);
      if (editable) return;
      event.preventDefault();
      const files = await getFilesFromClipboard(event);
      if (files.length > 0) createImageList(files);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const scrollToTool = () => document.getElementById("compressor")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={style.page}>
      <header className={style.header}>
        <a href="#top" className={style.brand} aria-label={`${brandName} home`}><Logo title={brandName} /></a>
        <nav className={menuOpen ? style.navOpen : ""} aria-label="Primary navigation">
          <a href="#compressor">{text.nav[0]}</a>
          <a href="#features">{text.nav[1]}</a>
          <a href="#pro">{text.nav[2]} <b>NEW</b></a>
          <a href="#about">{text.nav[3]}</a>
        </nav>
        <div className={style.headerActions}>
          <div className={style.language}><Languages size={16} /><Select compact value={gstate.lang} ariaLabel="Language" options={langList.map((lang) => ({ value: lang.key, label: lang.label }))} onChange={changeLang} /></div>
          <button type="button" className={style.menuButton} aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="top">
        <section className={style.hero} id="compressor">
          <div className={style.heroCopy}>
            <span className={style.eyebrow}><ShieldCheck size={15} />{text.eyebrow}</span>
            <h1>{text.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
            <p>{text.summary}</p>
            <div className={style.heroCta}>
              <button type="button" className="button buttonPrimary buttonLarge" onClick={scrollToTool}>{text.start}<ArrowRight size={18} /></button>
              <a className="button buttonLarge" href="https://github.com/duckok/dukcok" target="_blank" rel="noreferrer"><Code2 size={17} />{text.source}</a>
            </div>
            <ul className={style.heroProof}>{text.proof.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
          </div>

          <div className={style.workspace}>
            <div className={style.workspaceTop}>
              <div><i /><i /><i /><strong>{text.workspaceTitle}</strong></div>
              <button type="button" className="button" onClick={() => { homeState.showOption = true; }}><SlidersHorizontal size={16} />{gstate.locale?.optionPannel.resizeLable}</button>
            </div>
            <div className={style.workbench}>{homeState.list.size === 0 ? <UploadCard /> : <LeftContent />}<RightOption /></div>
          </div>
          <p className={style.heroNote}><LockKeyhole size={15} />{text.intro}</p>
        </section>

        <section className={style.features} id="features">
          <div className={style.sectionHeading}><span>FEATURES</span><h2>{text.featuresTitle}</h2><p>{text.featuresIntro}</p></div>
          <div className={style.featureGrid}>{text.features.map(([title, desc], index) => { const Icon = featureIcons[index]; return <article key={title}><span>0{index + 1}</span><div className={style.featureIcon}><Icon size={21} /></div><h3>{title}</h3><p>{desc}</p></article>; })}</div>
        </section>

        <section className={style.proSection} id="pro">
          <div className={style.proInner}>
            <div className={style.proCopy}>
              <span>{text.proEyebrow}</span>
              <h2>{text.proTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{text.proText}</p>
              <ul>{text.proPoints.map((point) => <li key={point}><Check size={16} />{point}</li>)}</ul>
              <div className={style.proActions}><button type="button" className="button buttonLarge" onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}>{text.proButton}<ArrowRight size={17} /></button><small>{text.proHint}</small></div>
            </div>
            <div className={style.proCard}>
              <div className={style.proCardTop}><Sparkles size={20} /><span>DUCKOK PRO</span><b>SOON</b></div>
              <div className={style.proCardBody}><strong>For people who process images every day.</strong><div className={style.proLines}><i /><i /><i /><i /></div></div>
            </div>
          </div>
        </section>

        <section className={style.how}>
          <div className={style.sectionHeading}><span>WORKFLOW</span><h2>{text.howTitle}</h2></div>
          <ol>{text.steps.map(([title, desc], index) => <li key={title}><b>{index + 1}</b><div><h3>{title}</h3><p>{desc}</p></div></li>)}</ol>
        </section>

        <section className={style.privacy} id="about">
          <div><span className={style.eyebrow}><ShieldCheck size={15} />PRIVACY BY DESIGN</span><h2>{text.privacyTitle}</h2><p>{text.privacyText}</p><ul>{text.privacyPoints.map((point) => <li key={point}><Check size={16} />{point}</li>)}</ul></div>
          <div className={style.privacyVisual}><ShieldCheck size={42} /><strong>0 files uploaded</strong><span>Browser · Web Worker · WebAssembly</span></div>
        </section>

        <section className={style.faq} id="faq">
          <div className={style.sectionHeading}><span>FAQ</span><h2>{text.faqTitle}</h2></div>
          <div className={style.faqList}>{text.faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className={style.finalCta}><h2>{text.finalTitle}</h2><p>{text.finalText}</p><button type="button" className="button buttonPrimary buttonLarge" onClick={scrollToTool}>{text.start}<ArrowRight size={18} /></button></section>
      </main>

      <footer className={style.footer}><Logo title={brandName} /><p>{text.footer}</p><div><a href="#compressor">{text.nav[0]}</a><a href="#features">{text.nav[1]}</a><a href="#pro">{text.nav[2]}</a><span>MIT License</span></div></footer>
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
