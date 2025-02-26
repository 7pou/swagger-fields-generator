<p align="center">
  <img alt="logo" width="200px" src="./assets/icon.png" />
</p>

<p align="center">
  <a aria-label="License" href="./LICENSE">
    <img alt="See License" src="https://img.shields.io/github/license/7pou/swagger-fields-generator?style=flat-square"/>
  </a>
  <a aria-label="Discord" href="https://discord.gg/mvTPqXKat5">
    <img alt="Join our Discord for support and chat about our projects" src="https://img.shields.io/discord/1342034439991070764?logo=discord&logoColor=white"/>
  </a>
</p>
**Swagger Fields Generator** 是一款 Chrome 浏览器插件，旨在简化 API 转换，快速生成表单和表格，加快构建界面的速度。

[English](./README.md) | 简体中文

## 功能

- **自动转换：** 将 Swagger 文档自动转换为表单字段和表格列。
- **自定义转换器：** 支持用户自定义转换规则，以满足特定需求。
- **多语言支持：** 提供多语言界面，方便全球用户使用。

## 安装
- 插件应用商店中已提供插件下载，您可以直接下载安装。
- 或者，您也可以通过以下步骤手动安装插件：
1. 下载插件的 `.crx` 文件。
2. 在 Chrome 浏览器地址栏输入 `chrome://extensions/`，打开扩展程序页面。
3. 启用“开发者模式”，然后将 `.crx` 文件拖拽到页面中进行安装。


## 使用

1. 打开目标 Swagger 网站。
2. 点击浏览器工具栏中的插件图标，打开插件弹窗。
3. 在弹窗中，点击“启用”按钮以激活插件。
4. 插件会自动尝试获取配置的 JSON 请求地址中的数据。
5. 获取成功后，刷新当前页面，即可看到插件添加的生成器按钮。
6. 点击生成器按钮，生成的代码会以弹窗形式显示，供您复制使用。

## 配置

- **显示按钮数量：** 设置在 Swagger 页面中 API 栏中显示的最大按钮数量。默认值为 5，当项目配置的按钮数量超过该值时，会以折叠的方式呈现。
- **JSON 请求地址：** 配置当前 Swagger 的 JSON 请求地址，支持添加多个地址，以回车区分。支持全路径和相对路径。
- **选择显示按钮：** 选择当前 Swagger 页面中需要显示的按钮，支持拖拽排序。

## 贡献

欢迎提交问题报告、功能请求或直接贡献代码。请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多信息。

## 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE](LICENSE) 文件。

## 鸣谢

感谢以下项目和库的支持：

- [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript)
- [plasmo](https://github.com/PlasmoHQ/plasmo)

**Swagger Fields Generator** 旨在简化 API 转换，快速生成表单和表格，加快构建界面的速度


