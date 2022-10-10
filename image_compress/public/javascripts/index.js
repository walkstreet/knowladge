// 图片压缩后最大宽度限制
const MAX_WIDTH = 1500

// 大于1500宽度的图片质量
const MAX_QUALITY = 40

// 小于1500宽度的图片质量
const MIN_QUALITY = 30

// 超出大小限制后，重复几次再压缩
const RETRY_TIME = 3

// 文件大小限制
const MAX_SIZE = 300

// 计数器
let count = 0

// 压缩
function compress(base64, mimeType, loop) {
  let canvas = document.createElement('canvas')
  let img = document.createElement('img')
  img.crossOrigin = 'anonymous'

  return new Promise((resolve, reject) => {
    img.src = base64
    img.onload = () => {
      let targetWidth, targetHeight, quality

      if (loop) {
        targetWidth = img.width / 2
        targetHeight = (img.height * targetWidth) / img.width
        quality = loop;
      } else {
        if (img.width > MAX_WIDTH) {
          targetWidth = MAX_WIDTH
          targetHeight = (img.height * MAX_WIDTH) / img.width
          quality = MIN_QUALITY;
        } else {
          targetWidth = img.width
          targetHeight = img.height
          quality = MAX_QUALITY;
        }
      }

      canvas.width = targetWidth
      canvas.height = targetHeight
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, targetWidth, targetHeight) // 清除画布
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      let imageData = canvas.toDataURL(mimeType, quality / 100)

      // 判断base64大小
      const fileSize = obtainImageSize(imageData)
      console.log(fileSize)
      if (fileSize > MAX_SIZE) {
        if (count >= RETRY_TIME) {
          throw new Error(`retry exceeded ${RETRY_TIME} times`)
        } else {
          count++
          console.log('Retry', count)
          resolve(compress(imageData, mimeType, 20))
        }
      } else {
        resolve(dataUrlToBlob(imageData, mimeType))
      }
    }
  })
}

// 获取base64文件大小
function obtainImageSize(imageBase) {
  let str = imageBase;

  //处理头部的东西，注意，逗号也必须去除。
  str = str.replace("data:image/png;base64,", "");
  str = str.replace("=", "");

  //这里计算出来的是字节大小 也即是B
  let size = (str.length - (str.length / 8) * 2);

  //除以1024 得到的就是KB的大小了
  return size / 1024;
}

// base64=>blob
function dataUrlToBlob(base64, mimeType) {
  let bytes = window.atob(base64.split(',')[1])
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)

  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }

  return new Blob([ab], { type: mimeType })
}

// 上传文件
function uploadFile(url, blob) {
  let formData = new FormData()
  let request = new XMLHttpRequest()
  formData.append('image', blob)
  request.open('POST', url, true)
  request.send(formData)
}

const loadFile = (event) => {
  count = 0;
  // file=>base64
  let file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = async function () {
    // 如果接口对文件做了类型校验，此处文件类型要做动态处理
    const result = await compress(reader.result, file.type)
    uploadFile('/file/upload', result);

    // 先创建图片对象
    var img = new Image()
    img.src = reader.result

    // 复制图片
    var cas = document.querySelector('canvas')
    var ctx = cas.getContext('2d')

    // 图片加载完之后
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 320, 380, 100, 100, 32, 38)
    }

    var canvas = document.createElement('canvas')
    canvas.toDataURL("image/jpeg", 0.8)
  }
  reader.readAsDataURL(file)
}