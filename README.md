# msc-any-pip

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-any-pip) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/25387/branches/794161/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=25387&bid=794161)

Imaging what if we can let anything Picture-in-Picture (not only &lt;video />) ?! Here comes &lt;msc-any-pip /> to let it dream comes true. &lt;msc-any-pip /> apply Document Picture-in-Picture API to given elements have Picture-in-Picture feature.

![<msc-any-pip />](https://blog.lalacube.com/mei/img/preview/msc-any-pip.png)

## Basic Usage

&lt;msc-any-pip /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-any-pip />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-any-pip.js">        
</script>
```

- Structure

Put &lt;msc-any-pip /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-any-pip>
  <script type="application/json">
    {
      "width": 450,
      "height": 300
    }
  </script>

  <!-- Put any HTML element you like -->
  <div class="element-i-like-to-have-pip">
    ...
    ...
    ...
  </div>
</msc-any-pip>
```

Otherwise, developers could also choose `remoteconfig` to fetch config for &lt;msc-any-pip /&gt;.

```html
<msc-any-pip
  remoteconfig="https://your-domain/api-path"
  ...
></msc-any-pip>
```

## JavaScript Instantiation

&lt;msc-any-pip /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscAnyPip } from 'https://your-domain/wc-msc-any-pip.js';

const template = document.querySelector('.my-template');

// use DOM api
const nodeA = document.createElement('msc-any-pip');
document.body.appendChild(nodeA);
nodeA.appendChild(template.content.cloneNode(true));

// new instance with Class
const nodeB = new MscAnyPip();
document.body.appendChild(nodeB);
nodeB.appendChild(template.content.cloneNode(true));
nodeB.width = 450;
nodeB.height = 300;

// new instance with Class & default config
const config = {
  width: 450,
  height: 300
};
const nodeC = new MscAnyPip(config);
document.body.appendChild(nodeC);
nodeC.appendChild(template.content.cloneNode(true));
</script>
```

## Style Customization

Developers could apply styles to decorate &lt;msc-any-pip />'s looking.

```html
<style>
msc-any-pip {
  --msc-any-pip-piping-text: 'Playing in Picture-in-Picture.';
  --msc-any-pip-piping-color: #39e75f;
  --msc-any-pip-piping-font-size: 16px;
}
</style>
```

## Attributes

&lt;msc-any-pip /> supports some attributes to let it become more convenience & useful.

- **width**

Set Picture-in-Picture window width. Default is &lt;msc-any-pip />'s `clientWidth`. （Picture-in-Picture's min window width is 300）

```html
<msc-any-pip width="450">
  ...
</msc-any-pip>
```

- **height**

Set Picture-in-Picture window height. Default is &lt;msc-any-pip />'s `clientHeight`. （Picture-in-Picture's min window height is 300）

```html
<msc-any-pip height="300">
  ...
</msc-any-pip>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| width | Number | Getter / Setter for Picture-in-Picture window width. Default is &lt;msc-any-pip />'s clientWidth. |
| height | Number | Getter / Setter for Picture-in-Picture window height. Default is &lt;msc-any-pip />'s clientHeight. |

## Events

| Event Signature | Description |
| ----------- | ----------- |
| msc-any-pip-piping | Fired when user press confirm. |
| msc-any-pip-pip-end | Fired when Picture-in-Picture end. |

## Reference

- [Picture-in-Picture for any Element, not just <video />](https://developer.chrome.com/docs/web-platform/document-picture-in-picture/)
- [&lt;msc-any-pip />](https://blog.lalacube.com/mei/webComponent_msc-any-pip.html)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-any-pip)
- [YouTube](https://youtu.be/owB19sURQJw)
