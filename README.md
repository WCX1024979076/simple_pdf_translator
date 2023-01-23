# PDF划词翻译

一个简单的PDF划词翻译软件。

![image-20230123142242157](.\README.assets\image-20230123142242157.png)

## 关于

这是一个开源的PDF划词翻译软件，前端渲染采用[Element-UI](https://element-plus.gitee.io/zh-CN/)和[PDF.js](https://mozilla.github.io/pdf.js/)；后端采用插件机制完成翻译引擎的管理，目前支持的翻译引擎有**百度翻译**、**谷歌翻译**、**有道翻译**和**腾讯翻译**，如需接入三方api可以参考PDF划词翻译插件开发。

## 使用指南

### 一、翻译引擎配置

在使用之前需要进行翻译引擎配置，下面分别介绍一下如何进行配置。

#### 1）百度翻译

百度翻译api接入需要申请appid和密钥，申请教程如下。

[https://talentranslate.com/docs/services/common/baidu](https://talentranslate.com/docs/services/common/baidu)

#### 2）腾讯翻译

腾讯翻译api接入需要申请SecretId和SecretKey，申请教程如下。

[https://talentranslate.com/docs/services/common/tencent](https://talentranslate.com/docs/services/common/tencent)

#### 3）谷歌翻译

谷歌翻译无需申请相关密钥，但是需要配置代理ip和代理端口（由于谷歌翻译关闭了国内接口，只能通过科学上网来访问谷歌翻译国际版）

#### 4）有道翻译

有道翻译需要申请APP ID和秘钥，申请教程如下。

[https://blog.csdn.net/weixin_44253490/article/details/126365385](https://blog.csdn.net/weixin_44253490/article/details/126365385)

如过在申请过程中遇到任何问题可通过邮箱/QQ私聊我，我可以提供相关apiid和密钥或者提供申请帮助。

### 二、打开文件

点击文件->打开文件 或 点击图中标记的按钮均可打开相应的pdf，划词即可在右侧显示译文和原文。（注意pdf是文本类型而非图像，目前暂不支持ocr文字识别）

![image-20230123143922255](.\README.assets\image-20230123143922255.png)

## 插件开发

见[PDF划词翻译插件开发文档](https://github.com/WCX1024979076/simple_pdf_translator_plugins)。

## TODO

1、完善插件机制

## 参考

1、[electron-vue-template](https://github.com/Deluze/electron-vue-template)

2、[PicGo插件机制](https://picgo.github.io/PicGo-Core-Doc/zh/dev-guide/cli.html)

3、[pdf.js](https://mozilla.github.io/pdf.js/)

4、[element-ui](https://element-plus.gitee.io/zh-CN/)
